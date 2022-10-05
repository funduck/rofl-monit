import { Container } from "../domain/aggregates/container";
import { DomainEntityId, Id } from "../domain/core/entity";
import {
    MonitoringEventContainer,
    MonitoringEventContainerDied,
    MonitoringEventContainerIsHealthy,
    MonitoringEventContainerKilled,
    MonitoringEventContainerNotHealthy,
    MonitoringEventContainerOOM,
    MonitoringEventContainerRestarted,
    MonitoringEventContainerStarted,
    MonitoringEventContainerStopped,
} from "../domain/events/container_monitoring_events";
import { MonitoringEvent } from "../domain/events/monitoring_event";

export type DockerEvent = {
    Type: string;
    Action: string;
    Actor: object;
    time: number;
    timeNano: number;
};

export type DockerContainerEvent = {
    Type: string;
    Action: string;
    Actor: {
        Attributes: {
            image: string;
            name: string;
            signal?: number;
            exitCode?: number;
        };
    };
    time: number;
    timeNano: number;
};

function getContainerEvent(
    dockerEvent: DockerContainerEvent
): MonitoringEventContainer | null {
    const action = dockerEvent.Action;
    const image = dockerEvent.Actor.Attributes.image;
    const name = dockerEvent.Actor.Attributes.name;
    const id = Id<Container>(name);
    const timeMsec = Number(dockerEvent.timeNano.toString().slice(0, -3));

    const dfltArgs: [string, string, DomainEntityId<Container>, number] = [
        image,
        action,
        id,
        timeMsec,
    ];

    switch (dockerEvent.Action) {
        case "start":
            return new MonitoringEventContainerStarted(...dfltArgs);
        case "stop":
            return new MonitoringEventContainerStopped(...dfltArgs);
        case "kill":
            return new MonitoringEventContainerKilled(
                dockerEvent.Actor.Attributes.signal!,
                ...dfltArgs
            );
        case "die":
            return new MonitoringEventContainerDied(
                dockerEvent.Actor.Attributes.exitCode!,
                ...dfltArgs
            );
        case "oom":
            return new MonitoringEventContainerOOM(...dfltArgs);
        case "restart":
            return new MonitoringEventContainerRestarted(...dfltArgs);
        case "health_status: healthy":
            return new MonitoringEventContainerIsHealthy(...dfltArgs);
        case "health_status: unhealthy":
            return new MonitoringEventContainerNotHealthy(...dfltArgs);
        default:
            return null;
    }
}

/**
 * Transforms docker events to domain monitoring events
 */
export function monitoringEventFromDockerEvent(
    dockerEvent: DockerEvent
): MonitoringEvent | null {
    switch (dockerEvent.Type) {
        case "container":
            return getContainerEvent(dockerEvent as DockerContainerEvent);
        default:
            return null;
    }
}
