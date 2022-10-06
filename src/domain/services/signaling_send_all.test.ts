import { InMemoryContainerRepository } from "../../infra/in_memory_container_repository";
import { Container } from "../aggregates/container";
import { Id } from "../core/entity";
import { DomainEvent, DomainEventPublisher } from "../core/event";
import { ContainerEventStateChanged } from "../events/container_events";
import { NotificationEvent } from "../events/notification_events";
import {
    ContainerStateDied,
    ContainerStateRunning,
} from "../values/container_states";
import { Notification } from "../values/notification";
import { SignalingSendAll } from "./signaling_send_all";

describe("SignalingSendAll", () => {
    const container = new Container("image", Id<Container>("id"));
    const timeMsec = 1;
    const eventPublisher = DomainEventPublisher.getInstance("new");
    const containerRepo = new InMemoryContainerRepository();
    const service = new SignalingSendAll(containerRepo, eventPublisher);
    containerRepo.save(container);
    eventPublisher.subscribe(service, ContainerEventStateChanged);

    test("should receive notification when container state changes", () => {
        const subscriber = {
            handleEvent: jest.fn((_) => null),
        };
        eventPublisher.subscribe(subscriber, NotificationEvent);
        container.transition(ContainerStateRunning, timeMsec);
        container.transition(ContainerStateDied, timeMsec + 1);
        eventPublisher.publish(
            new ContainerEventStateChanged(
                container.id,
                container.previousState(),
                container.state(),
                timeMsec + 1
            )
        );
        expect(subscriber.handleEvent.mock.calls.length).toBe(1);
        const notif: NotificationEvent =
            subscriber.handleEvent.mock.lastCall![0];
        expect(notif).toBeInstanceOf(NotificationEvent);
        expect(notif.notification).toBeInstanceOf(Notification);
        expect(notif.notification.timeMsec).toBe(timeMsec + 1);
    });
});
