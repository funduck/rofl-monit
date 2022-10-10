import {
    renderRofl,
    renderRoflEnded,
    renderStateChange,
} from "../../infra/container_render_notifications";
import { now } from "../../infra/core/lib";
import { logger } from "../../infra/logger";
import { Container } from "../aggregates/container";
import { Id } from "../core/entity";
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

    private roflContainerIds: Set<string> = new Set();
    private roflCheckInterval: ReturnType<typeof setInterval>;

    constructor(
        private containerRepo: InMemoryDomainRepository<Container>,
        publisher: DomainEventPublisher,
        {
            roflDetectCount,
            roflDetectWindowMsec,
        }: {
            roflDetectCount: number;
            roflDetectWindowMsec: number;
        } = {
            roflDetectCount: 3,
            roflDetectWindowMsec: 1 * 60 * 1000, // 10 minutes
        }
    ) {
        super(publisher);
        this.roflDetectCount = roflDetectCount;
        this.roflDetectWindowMsec = roflDetectWindowMsec;
        this.roflCheckInterval = setInterval(() => {
            this.checkAllRofls();
        }, 2 * this.roflDetectWindowMsec);
    }

    /**
     * Checks if container is in ROFL
     */
    private isRofl(container: Container): boolean {
        const attrsHistory = container.findPreviousStates(
            ContainerStateDied,
            this.roflDetectCount
        );
        if (attrsHistory.length < this.roflDetectCount) return false;
        if (
            attrsHistory.at(-this.roflDetectCount)!.timeMsec +
                this.roflDetectWindowMsec <
            now()
        ) {
            return false;
        }
        return true;
    }

    private checkRoflStarted(container: Container): boolean {
        if (this.isRofl(container)) {
            if (!container.get(RoflMarker)) {
                this.roflContainerIds.add(String(container.id));
                container.set(new RoflMarker());
                container.del(RoflNotifiedAt);
            }
            container.set(new RoflNotifiedAt(now()));
            this.containerRepo.save(container);
            this.emitEvent(new NotificationEvent(renderRofl(container)));
            return true;
        }
        return false;
    }

    private checkRoflEnded(container: Container): boolean {
        if (!this.isRofl(container)) {
            // instances of container.id are not equal, so we convert to String
            this.roflContainerIds.delete(String(container.id));
            container.del(RoflMarker);
            container.del(RoflNotifiedAt);
            this.containerRepo.save(container);
            this.emitEvent(new NotificationEvent(renderRoflEnded(container)));
            return true;
        }
        return false;
    }

    stop() {
        logger.info("Clear roflCheckInterval");
        clearInterval(this.roflCheckInterval);
    }

    checkAllRofls() {
        for (const id of this.roflContainerIds) {
            const container = this.containerRepo.get(Id<Container>(id));
            if (container.get(RoflMarker)) {
                this.checkRoflEnded(container);
            }
        }
    }

    handleEvent(event: DomainEvent): void {
        if (event instanceof ContainerEventStateChanged) {
            const container = this.containerRepo.get(event.containerId);

            // check if event is actual
            if (
                event.current != container.state() ||
                event.previous != container.previousState()
            )
                return;

            // recover from rofl
            if (container.get(RoflMarker)) {
                if (this.checkRoflEnded(container)) {
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
            if (
                event.current == ContainerStateDied &&
                this.checkRoflStarted(container)
            ) {
                return;
            }

            // other state changes
            this.emitEvent(new NotificationEvent(renderStateChange(container)));
        }
    }
}
