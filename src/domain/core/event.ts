export class DomainEvent {
    constructor(readonly timeMsec: number = Number(new Date())) {}
}

export class DomainEventError extends Error {}

export interface DomainEventSubscriber {
    handleEvent(event: DomainEvent): void
}

export class DomainEventPublisher {
    private static instances: Map<string, DomainEventPublisher> = new Map()

    static getInstance(name: string = ''): DomainEventPublisher {
        let publisher = this.instances.get(name)
        if (!publisher) {
            publisher = new DomainEventPublisher()
            this.instances.set(name, publisher)
        }
        return publisher
    }

    private subscriptions: Map<typeof DomainEvent, Set<DomainEventSubscriber>> = new Map()

    /**
     * Removes all subscribers and clears everything
     */
    reset() {
        this.subscriptions = new Map()
    }

    publish(event: DomainEvent): void {
        for (const [EventClass, subscribers] of this.subscriptions.entries()) {
            if (event instanceof EventClass) {
                for (const subscriber of subscribers) {
                    subscriber.handleEvent(event)
                }
            }
        }
    }

    private getSubscribedClasses(subscriber: DomainEventSubscriber): Set<typeof DomainEvent> {
        const res: Set<typeof DomainEvent> = new Set()
        for (const [EventClass, subscribers] of this.subscriptions.entries()) {
            if (subscribers.has(subscriber)) {
                res.add(EventClass)
            }
        }
        return res
    }

    subscribe(subscriber: DomainEventSubscriber, eventClass: typeof DomainEvent = DomainEvent): void {
        for (const EventClass of this.getSubscribedClasses(subscriber)) {
            if (EventClass.prototype instanceof eventClass ||
                eventClass.prototype instanceof EventClass ||
                EventClass === eventClass
            ) {
                throw new DomainEventError(
                    `Cannot subscribe for ${eventClass} because already subscribed for ${EventClass}`)
            }
        }
        const set = this.subscriptions.get(eventClass) || new Set()
        set.add(subscriber)
        this.subscriptions.set(eventClass, set)
    }

    unsubscribe(subscriber: DomainEventSubscriber, eventClass: typeof DomainEvent = DomainEvent): void {
        this.subscriptions.get(eventClass)?.delete(subscriber)
    }
}
