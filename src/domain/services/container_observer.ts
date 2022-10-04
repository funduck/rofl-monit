import { DomainEvent, DomainEventPublisher } from "../core/event";
import { DomainService } from "../core/service";
import { InMemoryDomainRepository } from "../core/repository";
import { Container } from "../aggregates/container";
import { MonitoringEventContainerDied, MonitoringEventContainer, MonitoringEventContainerOOM, MonitoringEventContainerRestarted, MonitoringEventContainerStarted, MonitoringEventContainerStopped } from "../events/container_monitoring_events";
import { DomainEntityId } from "../core/entity";
import { ContainerStateDied, ContainerState, ContainerStateRunning, ContainerStateStopped } from "../values/container_states";
import { ObservableStateUnknown } from "../values/observable_state";
import { ContainerEventStateChanged } from "../events/container_events";

/**
 * Receives MonitoringEvents, updates representations of containers and emits MonitoringEventContainerStates
 */
export class ContainerObserver extends DomainService {
    private eventQueues: Map<DomainEntityId<Container>, Array<MonitoringEventContainer>> = new Map()
    private containerCache: Map<DomainEntityId<Container>, Container> = new Map()

    constructor(
        private containerRepo: InMemoryDomainRepository<Container>,
        publisher: DomainEventPublisher
    ) {
        super(publisher);
    }

    handleEvent(event: DomainEvent): void {
        if (!(event instanceof MonitoringEventContainer)) {
            return
        }
        this.appendContainerEvent(event)
        if (!this.containerCache.has(event.observableId)) {
            this.ensureContainerExists(event)
        }
        this.processContainerEvents(event.observableId)
    }

    private appendContainerEvent(event: MonitoringEventContainer): void {
        const id = event.observableId
        const queue = this.eventQueues.get(id) || []
        queue.push(event)
        if (queue.length == 1) {
            this.eventQueues.set(id, queue)
        }
    }

    private processContainerEvents(containerId: DomainEntityId<Container>): void {
        /**
         * Just emit last event
         * If container is destroyed - remove it from cache
         */
        const queue = this.eventQueues.get(containerId) || []
        if (!queue.length) {
            return
        }
        const container = this.containerCache.get(containerId)!
        const lastEvent = queue.at(-1)
        let state: ContainerState = ObservableStateUnknown
        _: {
            /**
             * Naive logic
             * TODO
             * more accurate logic
             * for example
             * docker stop events are: kill die stop
             * docker restart events are: kil die stop start restarted
             * we should distinguish them
             */
            if (lastEvent instanceof MonitoringEventContainerStarted ||
                lastEvent instanceof MonitoringEventContainerRestarted
            ) {
                state = ContainerStateRunning
                break _
            }
            if (lastEvent instanceof MonitoringEventContainerDied) {
                if (lastEvent.exitCode != 0) {
                    state = ContainerStateDied
                } else {
                    state = ContainerStateStopped
                }
                break _
            }
            if (lastEvent instanceof MonitoringEventContainerOOM) {
                state = ContainerStateDied
                break _
            }
            if (lastEvent instanceof MonitoringEventContainerStopped) {
                state = ContainerStateStopped
                break _
            }
        }
        if (state != ObservableStateUnknown) {
            container.transition(state)
            this.containerRepo.save(container)
            const event = new ContainerEventStateChanged(
                container.previousState(),
                container.state(),
                lastEvent?.timeMsec
            )
            this.emitEvent(event)
        }
    }

    private ensureContainerExists(event: MonitoringEventContainer): void {
        let exists = this.containerRepo.has(event.observableId)
        let container: Container
        if (!exists) {
            container = new Container(event.image, event.observableId)
            this.containerRepo.save(container)
            this.containerCache.set(container.id, container)
        }
    }
}
