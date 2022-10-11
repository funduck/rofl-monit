import { InMemoryContainerRepository } from "../../infra/container_in_memory_repository";
import { Class, now } from "../../infra/core/lib";
import { Container } from "../aggregates/container";
import { Id } from "../core/entity";
import { DomainEventPublisher } from "../core/event";
import { ContainerEventStateChanged } from "../events/container_events";
import { NotificationEvent } from "../events/notification_events";
import {
    ContainerState,
    ContainerStateDied,
    ContainerStateRunning,
} from "../values/container_states";
import {
    Notification,
    NotificationContainerRofl,
    NotificationContainerRoflEnded,
    NotificationContainerStateChange,
} from "../values/notification";
import { SignalingDetectLoops } from "./container_signaling_detect_loops";

// Jest mocking "lib.now"
let _now: number = 0;
jest.mock("../../infra/core/lib", () => {
    const originalModule = jest.requireActual("../../infra/core/lib");

    //Mock the default export and named export 'foo'
    return {
        __esModule: true,
        ...originalModule,
        now: (): number => _now,
    };
});

describe("SignalingDetectLoops", () => {
    let container = new Container("image", Id<Container>("id"));
    const eventPublisher = DomainEventPublisher.getInstance("new");
    const containerRepo = new InMemoryContainerRepository();

    // timings here are in msec, multiply *1000 to get in seconds for real use case
    const roflDetectWindowMsec = 300; // in reality 5 min

    const service = new SignalingDetectLoops(containerRepo, eventPublisher, {
        roflDetectCount: 3,
        roflDetectWindowMsec,
    });

    containerRepo.save(container);
    eventPublisher.subscribe(service, ContainerEventStateChanged);
    const subscriber = {
        handleEvent: jest.fn((_) => null),
    };
    eventPublisher.subscribe(subscriber, NotificationEvent);

    let countNotifications = 0;

    function emitStateChange() {
        eventPublisher.publish(
            new ContainerEventStateChanged(
                container.previousState(),
                container.state(),
                container.id,
                now()
            )
        );
    }

    function transition(state: ContainerState, date: number) {
        _now = date;
        container = containerRepo.get(container.id);
        container.transition(state, date);
        containerRepo.save(container);
        emitStateChange();
    }

    function getNotification(): Notification {
        return (subscriber.handleEvent.mock.lastCall![0] as NotificationEvent)
            .notification;
    }
    function expectNotification(
        cls: Class<Notification> | undefined = undefined
    ) {
        countNotifications++;
        expect(subscriber.handleEvent.mock.calls.length).toBe(
            countNotifications
        );
        if (cls) expect(getNotification()).toBeInstanceOf(cls);
    }
    function expectNoNotification() {
        expect(subscriber.handleEvent.mock.calls.length).toBe(
            countNotifications
        );
    }

    afterAll(() => {
        service.stop();
    });

    test(`settings roflDetectWindowMsec: ${roflDetectWindowMsec}`, () => {});

    test("should receive notification when starts", () => {
        container = containerRepo.get(container.id);

        container.transition(ContainerStateRunning, 1000);
        containerRepo.save(container);
        emitStateChange();
        expectNotification();
    });

    test("should not receive ROFL when container dies", () => {
        transition(ContainerStateDied, 1005);
        expectNotification(NotificationContainerStateChange);
    });

    test("should receive ROFL when container dies a lot", () => {
        transition(ContainerStateRunning, 1010);
        expectNotification();
        transition(ContainerStateDied, 1020);
        expectNotification();
        transition(ContainerStateRunning, 1030);
        expectNotification();
        transition(ContainerStateDied, 1040);
        expectNotification(NotificationContainerRofl);
    });

    test("should not receive notifications while in rofl", () => {
        transition(ContainerStateRunning, 1050);
        expectNoNotification();
        transition(ContainerStateDied, 1060);
        expectNoNotification();
        transition(ContainerStateRunning, 1070);
        expectNoNotification();
        transition(ContainerStateDied, 1080);
        expectNoNotification();
    });

    test("should receive notifications rofl ended on new event", () => {
        transition(ContainerStateRunning, 2050);
        expectNotification(NotificationContainerRoflEnded);
    });

    test("should receive regular notification when container dies", () => {
        transition(ContainerStateDied, 2055);
        expectNotification(NotificationContainerStateChange);
    });

    test("should receive ROFL when container dies a lot", () => {
        transition(ContainerStateRunning, 2110);
        expectNotification();
        transition(ContainerStateDied, 2120);
        expectNotification();
        transition(ContainerStateRunning, 2130);
        expectNotification();
        transition(ContainerStateDied, 2140);
        expectNotification(NotificationContainerRofl);
    });

    test("should receive notifications rofl ended when roflDetectWindowMsec is passed", () => {
        _now = 3000;
        service.checkAllRofls();
        expectNotification(NotificationContainerRoflEnded);
    });
});
