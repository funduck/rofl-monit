import { DomainEvent, DomainEventPublisher, DomainEventSubscriber } from "./event";

/**
 * Base class for domain services.
 * One service should perform one operation.
 * Application may subscribe it for events.
 */
export abstract class DomainService implements DomainEventSubscriber {

    constructor(protected eventPublisher: DomainEventPublisher) {}

    abstract handleEvent(event: DomainEvent): void;

    protected emitEvent(event: DomainEvent): void {
        this.eventPublisher.publish(event)
    }
}
