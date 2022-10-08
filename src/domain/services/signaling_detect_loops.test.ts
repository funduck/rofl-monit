import { now } from "../../infra/core/lib";
import { InMemoryContainerRepository } from "../../infra/in_memory_container_repository";
import { Container } from "../aggregates/container";
import { Id } from "../core/entity";
import { DomainEventPublisher } from "../core/event";
import { ContainerEventStateChanged } from "../events/container_events";
import { NotificationEvent } from "../events/notification_events";
import {
    ContainerStateDied,
    ContainerStateRunning,
} from "../values/container_states";
import { Notification } from "../values/notification";
import { SignalingDetectLoops } from "./signaling_detect_loops";

describe("SignalingDetectLoops", () => {
    const container = new Container("image", Id<Container>("id"));
    const timeMsec = 1;
    const eventPublisher = DomainEventPublisher.getInstance("new");
    const containerRepo = new InMemoryContainerRepository();
    const service = new SignalingDetectLoops(containerRepo, eventPublisher, {
        roflDetectCount: 3,
        roflDetectWindowMsec: 500,
        repeatNotificationMsec: 500,
    });

    containerRepo.save(container);
    eventPublisher.subscribe(service, ContainerEventStateChanged);
    const subscriber = {
        handleEvent: jest.fn((_) => null),
    };
    eventPublisher.subscribe(subscriber, NotificationEvent);

    function emitStateChange() {
        eventPublisher.publish(
            new ContainerEventStateChanged(
                container.id,
                container.previousState(),
                container.state(),
                now()
            )
        );
    }
    function getNotification(): Notification {
        return (subscriber.handleEvent.mock.lastCall![0] as NotificationEvent)
            .notification;
    }

    let countNotifications = 0;
    for (const _ of Array(2)) {
        test("should receive notification when container starts", () => {
            countNotifications += 1;
            container.transition(ContainerStateRunning, now());
            emitStateChange();
            expect(subscriber.handleEvent.mock.calls.length).toBe(
                countNotifications
            );
            expect(getNotification()).toBeInstanceOf(Notification);
        });

        test("should receive notification when container dies", () => {
            countNotifications += 1;
            container.transition(ContainerStateDied, now());
            emitStateChange();
            expect(subscriber.handleEvent.mock.calls.length).toBe(
                countNotifications
            );
            expect(getNotification().toString()).not.toMatch(/ROFL/);
        });
    }

    test("should receive ROFL notification when container dies", () => {
        countNotifications += 1;
        container.transition(ContainerStateRunning, now());
        container.transition(ContainerStateDied, now());
        emitStateChange();
        expect(subscriber.handleEvent.mock.calls.length).toBe(
            countNotifications
        );
        expect(getNotification().toString()).toMatch(/ROFL/);
    });
});
