import { DomainEvent, DomainEventError, DomainEventPublisher, DomainEventSubscriber } from "../event";

describe('DomainEvents', () => {
    describe('One publisher', () => {
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

    describe('Two publishers', () => {
        const publisher1 = DomainEventPublisher.getInstance('1')
        const publisher2 = DomainEventPublisher.getInstance('2')
        let subscriber = {
            handleEvent: jest.fn(_ => Promise.resolve())
        }
        class MyEvent1 extends DomainEvent {}
        class MyEvent2 extends DomainEvent {}

        beforeEach(() => {
            publisher1.reset()
            publisher2.reset()
            subscriber.handleEvent.mockReset()
        })

        test('should subscribe for MyEvent1 in publisher 1 and MyEvent2 in publisher 2', () => {
            publisher1.subscribe(subscriber, MyEvent1)
            publisher2.subscribe(subscriber, MyEvent2)
            const events = [new MyEvent1(0), new MyEvent2(1), new MyEvent1(2), new MyEvent2(3)]
            publisher1.publish(events[0])
            publisher1.publish(events[1])
            publisher2.publish(events[2])
            publisher2.publish(events[3])
            expect(subscriber.handleEvent).toHaveBeenCalledTimes(2)
            expect(subscriber.handleEvent).toHaveBeenCalledWith(events[0])
            expect(subscriber.handleEvent).toHaveBeenCalledWith(events[3])
            expect(subscriber.handleEvent).not.toHaveBeenCalledWith(events[1])
            expect(subscriber.handleEvent).not.toHaveBeenCalledWith(events[2])
        })
    })
});
