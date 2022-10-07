import { Class } from "../../infra/core/lib";
import { logger } from "../../infra/logger";

/**
 * Base class for all domain events
 */
export class DomainEvent {
    constructor(readonly timeMsec: number = Number(new Date())) {}

    toString(): string {
        return Object.entries(this)
            .map(([k, v]) => `${k}:${v}`)
            .sort()
            .join(", ");
    }
}

export class DomainEventError extends Error {}

/**
 * Interface of subscriber for domain events
 */
export interface DomainEventSubscriber {
    handleEvent(event: DomainEvent): void;
}

/**
 * Singleton domain events publisher. Registers subscribers and accepts publications.
 */
export class DomainEventPublisher {
    private static instances: Map<string, DomainEventPublisher> = new Map();

    private subscriptions: Map<typeof DomainEvent, Set<DomainEventSubscriber>> =
        new Map();

    private getSubscribedClasses(
        subscriber: DomainEventSubscriber
    ): Set<typeof DomainEvent> {
        const res: Set<typeof DomainEvent> = new Set();
        for (const [EventClass, subscribers] of this.subscriptions.entries()) {
            if (subscribers.has(subscriber)) {
                res.add(EventClass);
            }
        }
        return res;
    }

    /**
     * Factory method returning named singleton instance.
     * Different publishers are completely independent.
     */
    static getInstance(name: string = ""): DomainEventPublisher {
        let publisher = this.instances.get(name);
        if (!publisher) {
            publisher = new DomainEventPublisher();
            this.instances.set(name, publisher);
        }
        return publisher;
    }

    /**
     * Removes all subscribers from publisher.
     */
    reset() {
        this.subscriptions = new Map();
    }

    /**
     * Immediate publish to present subscribers. Handlers are called syncronously in random order.
     */
    publish(event: DomainEvent): void {
        logger.trace("DomainEventPublisher.publish", event);
        for (const [EventClass, subscribers] of this.subscriptions.entries()) {
            if (event instanceof EventClass) {
                for (const subscriber of subscribers) {
                    try {
                        logger.debug(
                            `${subscriber} handling ${event.constructor.name}`
                        );
                        subscriber.handleEvent(event);
                    } catch (e) {
                        logger.error(
                            `${subscriber} failed to handle ${event}`,
                            e
                        );
                    }
                }
            }
        }
    }

    /**
     * Subscribe for events of class and all its subclasses.
     *
     * For example, if subscribed for DomainEvent subscriber will receive all events because all events subclass DomainEvent
     */
    subscribe(
        subscriber: DomainEventSubscriber,
        eventClass: Class<DomainEvent> = DomainEvent
    ): void {
        for (const EventClass of this.getSubscribedClasses(subscriber)) {
            if (
                EventClass.prototype instanceof eventClass ||
                eventClass.prototype instanceof EventClass ||
                EventClass === eventClass
            ) {
                throw new DomainEventError(
                    `Cannot subscribe for ${eventClass} because already subscribed for ${EventClass}`
                );
            }
        }
        const set = this.subscriptions.get(eventClass) || new Set();
        set.add(subscriber);
        this.subscriptions.set(eventClass, set);
    }

    /**
     * Unsubscribe for particular class
     */
    unsubscribe(
        subscriber: DomainEventSubscriber,
        eventClass: typeof DomainEvent = DomainEvent
    ): void {
        this.subscriptions.get(eventClass)?.delete(subscriber);
    }
}
