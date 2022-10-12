import { TaskCancels } from "../../infra/core/lib";
import { logger } from "../../infra/logger";
import {
    DomainEvent,
    DomainEventPublisher,
    DomainEventSubscriber,
} from "./event";

/**
 * Base class for domain services.
 * One service should perform one operation.
 * Application may subscribe it for events.
 */
export abstract class DomainService implements DomainEventSubscriber {
    constructor(protected eventPublisher: DomainEventPublisher) {
        logger.info(`Starting domain service ${this}`);
        TaskCancels.add(() => this.stop());
    }

    toString(): string {
        return `${this.constructor.name}`;
    }

    abstract handleEvent(event: DomainEvent): void;

    protected emitEvent(event: DomainEvent): void {
        logger.debug(`${this} publishes ${event.constructor.name}`);
        this.eventPublisher.publish(event);
    }

    /**
     * Should be called to stop the service.
     * For example clear timers here.
     */
    stop(): void {
        logger.debug(
            `${this}.stop() is empty, are you sure nothing should be cleaned up?`
        );
    }
}
