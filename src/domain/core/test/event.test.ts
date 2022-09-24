import { DomainEvent, DomainEventError, DomainEventPublisher, DomainEventSubscriber } from "../event";

describe('DomainEvents', () => {
    const publisher = DomainEventPublisher.getInstance('new')
    let subscriber = {
        handleEvent: jest.fn(_ => Promise.resolve())
    }
    class MyEvent extends DomainEvent {}

    beforeEach(() => {
        publisher.reset()
        subscriber.handleEvent.mockReset()
    })

    test('should publish to zero subscribers without error', () => {
        publisher.publish(new DomainEvent())
    });

    test('should subscribe and receive all events', () => {
        publisher.subscribe(subscriber)
        publisher.publish(new DomainEvent())
        publisher.publish(new MyEvent())
        expect(subscriber.handleEvent.mock.calls.length).toBe(2)
    });

    test('should publish to no one without error', () => {
        publisher.subscribe(subscriber, MyEvent)
        publisher.publish(new DomainEvent())
        expect(subscriber.handleEvent.mock.calls.length).toBe(0)
    });

    test('should not receive events after "reset"', () => {
        publisher.subscribe(subscriber)
        publisher.reset()
        publisher.publish(new DomainEvent())
        expect(subscriber.handleEvent.mock.calls.length).toBe(0)
    });

    test('should receive only subscribed events', () => {
        publisher.subscribe(subscriber, MyEvent)
        publisher.publish(new DomainEvent())
        expect(subscriber.handleEvent.mock.calls.length).toBe(0)
        publisher.publish(new MyEvent())
        expect(subscriber.handleEvent.mock.calls.length).toBe(1)
    });

    test('should deliver events to several subscribers', () => {
        const subscribers = new Array(10).fill(0).map(_ => ({
            handleEvent: jest.fn(_ => Promise.resolve())
        }))
        subscribers.map(subscriber => publisher.subscribe(subscriber))
        publisher.publish(new DomainEvent())
        for (const subscriber of subscribers) {
            expect(subscriber.handleEvent.mock.calls.length).toBe(1)
        }
    });

    test('should not allow to subscribe for child class', () => {
        publisher.subscribe(subscriber)
        expect(() => publisher.subscribe(subscriber, MyEvent)).toThrow(DomainEventError)
    });

    test('should not allow to subscribe for parent class', () => {
        publisher.subscribe(subscriber, MyEvent)
        expect(() => publisher.subscribe(subscriber)).toThrow(DomainEventError)
    });
});
