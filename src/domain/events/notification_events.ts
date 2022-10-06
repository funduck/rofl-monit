import { DomainEvent } from "../core/event";
import { Notification } from "../values/notification";

export class NotificationEvent extends DomainEvent {
    constructor(
        readonly notification: Notification,
        ...args: ConstructorParameters<typeof DomainEvent>
    ) {
        super(...args);
    }
}

export class ContainerNotificationEvent extends NotificationEvent {}
