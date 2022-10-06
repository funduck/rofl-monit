import { Container } from "../domain/aggregates/container";
import { Notification } from "../domain/values/notification";

export function renderStateChange(container: Container): Notification {
    return new Notification(
        `Container ${container.image}:${container.id} state changed`,
        container.stateAttrs().timeMsec,
        `${container.previousState()} -> ${container.state()}`
    );
}
