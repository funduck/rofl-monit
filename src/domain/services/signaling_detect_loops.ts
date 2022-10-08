import {
    renderRofl,
    renderRoflEnded,
    renderStateChange,
} from "../../infra/render_container_notifications";
import { now } from "../../infra/core/lib";
import { Container } from "../aggregates/container";
import { DomainEvent, DomainEventPublisher } from "../core/event";
import { InMemoryDomainRepository } from "../core/repository";
import { DomainService } from "../core/service";
import { ContainerEventStateChanged } from "../events/container_events";
import { NotificationEvent } from "../events/notification_events";
import { ContainerStateDied } from "../values/container_states";
import { ObservableAttribute } from "../values/observable_attribute";

class RoflMarker extends ObservableAttribute {
    constructor() {
        super("");
    }
}
class RoflNotifiedAt extends ObservableAttribute {
    declare value: number;
    before(timeMsec: number): boolean {
        return this.value < timeMsec;
    }
}

/**
 * Signaling strategy that detects when Observable is in fail-restart loop or healthy-unhealthy loop
 */
export class SignalingDetectLoops extends DomainService {
    readonly repeatNotificationMsec: number;
    readonly roflDetectWindowMsec: number;
    readonly roflDetectCount: number;

    constructor(
        private containerRepo: InMemoryDomainRepository<Container>,
        publisher: DomainEventPublisher,
        {
            roflDetectCount = 3,
            roflDetectWindowMsec = 10 * 60 * 1000, // 10 minutes
            repeatNotificationMsec = 60 * 60 * 1000, // 60 minutes
        }
    ) {
        super(publisher);
        this.roflDetectCount = roflDetectCount;
        this.roflDetectWindowMsec = roflDetectWindowMsec;
        this.repeatNotificationMsec = repeatNotificationMsec;
    }

    /**
     * Checks if container is in ROFL
     */
    private isRofl(container: Container): boolean {
        const attrsHistory = container.findPreviousStates(
            ContainerStateDied,
            this.roflDetectCount
        );
        if (
            attrsHistory.length < this.roflDetectCount ||
            attrsHistory[0].timeMsec < now() - this.roflDetectWindowMsec
        )
            return false;
        return true;
    }

    handleEvent(event: DomainEvent): void {
        if (event instanceof ContainerEventStateChanged) {
            const container = this.containerRepo.get(event.containerId);

            if (
                event.current != container.state() ||
                event.previous != container.previousState()
            )
                return;

            // detect rofl
            if (event.current == ContainerStateDied && this.isRofl(container)) {
                if (!container.get(RoflMarker)) {
                    container.set(new RoflMarker());
                    container.del(RoflNotifiedAt);
                    // TODO start timer to check if rofl ended
                }
                const notifiedAt = container.get(RoflNotifiedAt);
                if (
                    !notifiedAt ||
                    notifiedAt!.before(now() - this.repeatNotificationMsec)
                ) {
                    container.set(new RoflNotifiedAt(now()));
                    this.containerRepo.save(container);
                    this.emitEvent(
                        new NotificationEvent(renderRofl(container))
                    );
                }
                return;
            }

            // recover from rofl
            if (container.get(RoflMarker) && !this.isRofl(container)) {
                container.del(RoflMarker);
                container.del(RoflNotifiedAt);
                this.containerRepo.save(container);
                this.emitEvent(
                    new NotificationEvent(renderRoflEnded(container))
                );
                return;
            }

            // other state changes
            this.emitEvent(new NotificationEvent(renderStateChange(container)));
        }
    }
}
