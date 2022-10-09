import {
    renderRofl,
    renderRoflEnded,
    renderStateChange,
} from "../../infra/container_render_notifications";
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
    readonly roflDetectWindowMsec: number;
    readonly roflDetectCount: number;

    constructor(
        private containerRepo: InMemoryDomainRepository<Container>,
        publisher: DomainEventPublisher,
        {
            roflDetectCount = 3,
            roflDetectWindowMsec = 10 * 60 * 1000, // 10 minutes
        }
    ) {
        super(publisher);
        this.roflDetectCount = roflDetectCount;
        this.roflDetectWindowMsec = roflDetectWindowMsec;
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
            attrsHistory.at(-this.roflDetectCount)!.timeMsec +
                this.roflDetectWindowMsec <
                now()
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

            if (container.get(RoflMarker)) {
                // recover from rofl
                if (!this.isRofl(container)) {
                    container.del(RoflMarker);
                    container.del(RoflNotifiedAt);
                    this.containerRepo.save(container);
                    this.emitEvent(
                        new NotificationEvent(renderRoflEnded(container))
                    );
                    return;
                }
                // const notifiedAt = container.get(RoflNotifiedAt);
                // if (notifiedAt!.before(now() - this.repeatNotificationMsec)) {
                //     container.set(new RoflNotifiedAt(now()));
                //     this.containerRepo.save(container);
                //     this.emitEvent(
                //         new NotificationEvent(renderRofl(container))
                //     );
                //     return;
                // }
                return;
            }

            // detect rofl
            if (event.current == ContainerStateDied && this.isRofl(container)) {
                if (!container.get(RoflMarker)) {
                    container.set(new RoflMarker());
                    container.del(RoflNotifiedAt);
                }
                container.set(new RoflNotifiedAt(now()));
                this.containerRepo.save(container);
                this.emitEvent(new NotificationEvent(renderRofl(container)));
                return;
            }

            // other state changes
            this.emitEvent(new NotificationEvent(renderStateChange(container)));
        }
    }
}
