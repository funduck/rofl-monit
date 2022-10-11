import { Class, now } from "../../infra/core/lib";
import { logger } from "../../infra/logger";

/**
 * Base class for all domain events
 */
export class DomainEvent {
    constructor(readonly timeMsec: number = now()) {}

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

export type DomainEventFilter = (event: DomainEvent) => boolean;

/**
 * Singleton domain events publisher. Registers subscribers and accepts publications.
 */
export class DomainEventPublisher {
    private static instances: Map<string, DomainEventPublisher> = new Map();

    private eventSubscribers: Map<
        typeof DomainEvent,
        Map<DomainEventSubscriber, DomainEventFilter | undefined>
    > = new Map();

    private getSubscribedClasses(
        subscriber: DomainEventSubscriber
    ): Set<typeof DomainEvent> {
        const res: Set<typeof DomainEvent> = new Set();
        for (const [
            EventClass,
            subscriptions,
        ] of this.eventSubscribers.entries()) {
            if (subscriptions.has(subscriber)) {
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
        this.eventSubscribers = new Map();
    }

    /**
     * Immediate publish to present subscribers. Handlers are called syncronously in random order.
     */
    publish(event: DomainEvent): void {
        logger.trace("DomainEventPublisher.publish", event);
        for (const [
            EventClass,
            subscriptions,
        ] of this.eventSubscribers.entries()) {
            if (event instanceof EventClass) {
                for (const [subscriber, filter] of subscriptions.entries()) {
                    try {
                        filtering: {
                            if (filter && !filter(event)) break filtering;
                            logger.debug(
                                `${subscriber} handling ${event.constructor.name}`
                            );
                            subscriber.handleEvent(event);
                        }
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
        eventClass: Class<DomainEvent> = DomainEvent,
        filter?: DomainEventFilter
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
        const eventSubscriptions: Map<
            DomainEventSubscriber,
            DomainEventFilter | undefined
        > = this.eventSubscribers.get(eventClass) || new Map();
        eventSubscriptions.set(subscriber, filter);
        this.eventSubscribers.set(eventClass, eventSubscriptions);
    }

    /**
     * Unsubscribe for particular class
     */
    unsubscribe(
        subscriber: DomainEventSubscriber,
        eventClass: typeof DomainEvent = DomainEvent
    ): void {
        this.eventSubscribers.get(eventClass)?.delete(subscriber);
    }
}
