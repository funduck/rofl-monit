import {
    MonitoringEventContainerDied,
    MonitoringEventContainerIsHealthy,
    MonitoringEventContainerKilled,
    MonitoringEventContainerNotHealthy,
    MonitoringEventContainerOOM,
    MonitoringEventContainerRestarted,
    MonitoringEventContainerStarted,
    MonitoringEventContainerStopped,
} from "../domain/events/container_monitoring_events";
import { DockerEvent, monitoringEventFromDockerEvent } from "./docker_adapter";

describe("DockerAdapter", () => {
    for (const [dockerEvent, monitEvent] of [
        [
            {
                Type: "container",
                Action: "start",
                Actor: {
                    ID: "",
                    Attributes: { image: "snippet.image", name: "snippet.id" },
                },
                time: 1662476146,
                timeNano: 1662476146333437300,
            },
            {
                class: MonitoringEventContainerStarted,
                observableId: "snippet.id",
                match: {
                    timeMsec: 1662476146333,
                    image: "snippet.image",
                },
            },
        ],
        [
            {
                Type: "container",
                Action: "kill",
                Actor: {
                    ID: "",
                    Attributes: {
                        image: "snippet.image",
                        name: "snippet.id",
                        signal: "15",
                    },
                },
                time: 1662475946,
                timeNano: 1662475946796365000,
            },
            {
                class: MonitoringEventContainerKilled,
                observableId: "snippet.id",
                match: {
                    timeMsec: 1662475946796,
                    image: "snippet.image",
                },
            },
        ],
        [
            {
                Type: "container",
                Action: "die",
                Actor: {
                    ID: "",
                    Attributes: {
                        image: "snippet.image",
                        name: "snippet.id",
                        exitCode: "0",
                    },
                },
                time: 1662476146,
                timeNano: 1662476146333437300,
            },
            {
                class: MonitoringEventContainerDied,
                observableId: "snippet.id",
                match: {
                    timeMsec: 1662476146333,
                    image: "snippet.image",
                },
            },
        ],
        [
            {
                Type: "container",
                Action: "stop",
                Actor: {
                    ID: "",
                    Attributes: {
                        image: "snippet.image",
                        name: "snippet.id",
                    },
                },
                scope: "local",
                time: 1662476146,
                timeNano: 1662476146333437300,
            },
            {
                class: MonitoringEventContainerStopped,
                observableId: "snippet.id",
                match: {
                    timeMsec: 1662476146333,
                    image: "snippet.image",
                },
            },
        ],
        [
            {
                Type: "container",
                Action: "oom",
                Actor: {
                    ID: "",
                    Attributes: { image: "snippet.image", name: "snippet.id" },
                },
                time: 1662479621,
                timeNano: 1662479621426996500,
            },
            {
                class: MonitoringEventContainerOOM,
                observableId: "snippet.id",
                match: {
                    timeMsec: 1662479621426,
                    image: "snippet.image",
                },
            },
        ],
        [
            {
                Type: "container",
                Action: "restart",
                Actor: {
                    ID: "",
                    Attributes: { image: "snippet.image", name: "snippet.id" },
                },
                time: 1662480479,
                timeNano: 1662480479618681700,
            },
            {
                class: MonitoringEventContainerRestarted,
                observableId: "snippet.id",
                match: {
                    timeMsec: 1662480479618,
                    image: "snippet.image",
                },
            },
        ],
        [
            {
                Type: "container",
                Action: "health_status: healthy",
                Actor: {
                    ID: "",
                    Attributes: { image: "snippet.image", name: "snippet.id" },
                },
                time: 1662523275,
                timeNano: 1662523275404391400,
            },
            {
                class: MonitoringEventContainerIsHealthy,
                observableId: "snippet.id",
                match: {
                    timeMsec: 1662523275404,
                    image: "snippet.image",
                },
            },
        ],
        [
            {
                Type: "container",
                Action: "health_status: unhealthy",
                Actor: {
                    ID: "",
                    Attributes: { image: "snippet.image", name: "snippet.id" },
                },
                time: 1662523944,
                timeNano: 1662523944379267500,
            },
            {
                class: MonitoringEventContainerNotHealthy,
                observableId: "snippet.id",
                match: {
                    timeMsec: 1662523944379,
                    image: "snippet.image",
                },
            },
        ],
    ]) {
        test(`should map to ${monitEvent.class?.name}`, () => {
            const res = monitoringEventFromDockerEvent(
                dockerEvent as unknown as DockerEvent
            );
            expect(res).toBeInstanceOf(monitEvent.class);
            expect(res).toHaveProperty(
                "observableId.value",
                monitEvent.observableId
            );
            expect(res).toMatchObject(monitEvent.match!);
        });
    }
});
