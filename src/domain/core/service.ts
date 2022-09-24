import { DomainEvent, DomainEventPublisher, DomainEventSubscriber } from "./event";

export abstract class DomainService implements DomainEventSubscriber {
    constructor(protected eventPublisher: DomainEventPublisher) {}

    abstract handleEvent(event: DomainEvent): void;

    protected emitEvent(event: DomainEvent): void {
        this.eventPublisher.publish(event)
    }
}
