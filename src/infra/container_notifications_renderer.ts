import { Container } from "../domain/aggregates/container";
import { Notification } from "../domain/values/notification";

export function renderStateChange(container: Container): Notification {
    return new Notification(
        `Container ${container.image}:${container.id} state changed`,
        container.stateAttrs().timeMsec,
        `${container.previousState()} -> ${container.state()}`
    );
}

export function renderRofl(container: Container): Notification {
    return new Notification(
        `Container ${container.image}:${container.id} is in restart-on-failure-loop`,
        container.stateAttrs().timeMsec,
        "ROFL!"
    );
}

export function renderRoflEnded(container: Container): Notification {
    return new Notification(
        `Container ${container.image}:${container.id} exited restart-on-failure-loop`,
        container.stateAttrs().timeMsec,
        `ROFL ended, now: ${container.state()}`
    );
}
