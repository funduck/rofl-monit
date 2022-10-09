import { Container } from "../domain/aggregates/container";
import {
    NotificationContainerRofl,
    NotificationContainerRoflEnded,
    NotificationContainerStateChange,
} from "../domain/values/notification";

export function renderStateChange(
    container: Container
): NotificationContainerStateChange {
    return new NotificationContainerStateChange(
        `Container ${container.image}:${container.id} state changed`,
        container.stateAttrs().timeMsec,
        `${container.previousState()} -> ${container.state()}`
    );
}

export function renderRofl(container: Container): NotificationContainerRofl {
    return new NotificationContainerRofl(
        `Container ${container.image}:${container.id} is in restart-on-failure-loop`,
        container.stateAttrs().timeMsec,
        "ROFL!"
    );
}

export function renderRoflEnded(
    container: Container
): NotificationContainerRoflEnded {
    return new NotificationContainerRoflEnded(
        `Container ${container.image}:${container.id} exited restart-on-failure-loop`,
        container.stateAttrs().timeMsec,
        `ROFL ended, now: ${container.state()}`
    );
}
