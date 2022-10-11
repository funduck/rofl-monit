import { Container } from "../domain/aggregates/container";
import {
    NotificationContainerRofl,
    NotificationContainerRoflEnded,
    NotificationContainerStateChange,
} from "../domain/values/notification";

function dateToString(date: Date): string {
    return date.toLocaleTimeString();
}
function stateDateToString(container: Container): string {
    return dateToString(new Date(container.stateAttrs().timeMsec));
}

export function renderStateChange(
    container: Container
): NotificationContainerStateChange {
    return new NotificationContainerStateChange({
        text:
            `Container ${container.image}:${container.id} state changed\n` +
            stateDateToString(container) +
            `\n${container.previousState()} -> ${container.state()}`,
        html:
            `Container ${container.image}:<b>${container.id}</b> state changed\n` +
            stateDateToString(container) +
            `\n${container.previousState()} -> <b>${container.state()}</b>`,
    });
}

export function renderRofl(container: Container): NotificationContainerRofl {
    return new NotificationContainerRofl({
        text:
            `Container ${container.image}:${container.id} ROFL\n` +
            stateDateToString(container) +
            "\nIs in restart-on-failure-loop",
        html:
            `Container ${container.image}:<b>${container.id} ROFL</b>\n` +
            stateDateToString(container) +
            "\nIs in restart-on-failure-loop",
    });
}

export function renderRoflEnded(
    container: Container,
    timeMsec: number
): NotificationContainerRoflEnded {
    return new NotificationContainerRoflEnded({
        text:
            `Container ${container.image}:${container.id} ROFL ended\n` +
            dateToString(new Date(timeMsec)) +
            "\nExited restart-on-failure-loop",
        html:
            `Container ${container.image}:<b>${container.id} ROFL</b> ended\n` +
            dateToString(new Date(timeMsec)) +
            "\nExited restart-on-failure-loop",
    });
}
