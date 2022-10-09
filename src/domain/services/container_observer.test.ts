import { DomainEventPublisher } from "../core/event";
import { Class, sleep } from "../../infra/core/lib";
import { ObservableStateUnknown } from "../values/observable_state";
import { Container } from "../aggregates/container";
import { ContainerEventStateChanged } from "../events/container_events";
import {
    ContainerStateRunning,
    ContainerStateStopped,
} from "../values/container_states";
import { InMemoryContainerRepository } from "../../infra/container_in_memory_repository";
import { EntityNotFound } from "../core/repository";
import {
    MonitoringEventContainer,
    MonitoringEventContainerStarted,
    MonitoringEventContainerStopped,
} from "../events/container_monitoring_events";
import { ContainerObserver } from "./container_observer";
import { Id } from "../core/entity";

describe("ContainerObserverService", () => {
    const containerImage = "sample.image";
    const containerId = Id<Container>("happy_socrates");
    const timeMsec = 1;

    function MonitEvent(cls: Class<MonitoringEventContainer>) {
        return new cls(
            containerImage,
            "action.emulation",
            containerId,
            timeMsec
        );
    }

    const eventPublisher = DomainEventPublisher.getInstance("new");
    let containerRepo: InMemoryContainerRepository;
    let observer: ContainerObserver;

    let queue: Array<ContainerEventStateChanged> = [];
    async function pop_event(): Promise<ContainerEventStateChanged> {
        while (!queue.length) {
            await sleep(10);
        }
        const event = queue.pop()!;
        return event;
    }
    let subscriber = {
        handleEvent: (event: ContainerEventStateChanged) => {
            queue.push(event);
        },
    };

    function setup() {
        beforeAll(() => {
            queue = [];
            eventPublisher.reset();
            containerRepo = new InMemoryContainerRepository();
            observer = new ContainerObserver(containerRepo, eventPublisher);
            eventPublisher.subscribe(observer, MonitoringEventContainer);
            eventPublisher.subscribe(subscriber, ContainerEventStateChanged);
        });
    }

    function createContainer() {
        test("should get notified when container is created", async () => {
            eventPublisher.publish(MonitEvent(MonitoringEventContainerStarted));
            const event = await pop_event();
            expect(event).toBeInstanceOf(ContainerEventStateChanged);
            expect(event.containerId).toBe(containerId);
            expect(event.previous).toBe(ObservableStateUnknown);
            expect(event.current).toBe(ContainerStateRunning);
            expect(event.timeMsec).toBe(timeMsec);
        });
    }

    describe("Container starts", () => {
        setup();

        test("container should not exist before", () => {
            expect(() => containerRepo.get(containerId)).toThrow(
                EntityNotFound
            );
        });

        createContainer();

        test("container should exist after first event", () => {
            const container = containerRepo.get(containerId);
            expect(container.previousState()).toBe(ObservableStateUnknown);
            expect(container.state()).toBe(ContainerStateRunning);
        });
    });

    describe("Container stops", () => {
        setup();

        createContainer();

        let container0: Container;
        test("should store running container instance", () => {
            container0 = containerRepo.get(containerId);
        });

        test("should get notified when user stopped container", async () => {
            eventPublisher.publish(MonitEvent(MonitoringEventContainerStopped));
            const event = await pop_event();
            expect(event.previous).toBe(ContainerStateRunning);
            expect(event.current).toBe(ContainerStateStopped);
        });

        test("should check that stored container instance not changed", () => {
            expect(container0.state()).toBe(ContainerStateRunning);
        });

        test("should check current container instance", () => {
            const container = containerRepo.get(containerId);
            expect(container.state()).toBe(ContainerStateStopped);
        });
    });
});
