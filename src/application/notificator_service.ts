import { DomainEventPublisher } from "../domain/core/event";
import { NotificationEvent } from "../domain/events/notification_events";
import { ConsoleNotificator } from "../interface/console_notificator";

/**
 * Connects domain and external world.
 * Consumes NotificationEvent.
 * Produces Notification.
 */
export function NotificatorService() {
    const publisher = DomainEventPublisher.getInstance();
    const notificator = new ConsoleNotificator();
    publisher.subscribe(
        {
            handleEvent(event: NotificationEvent) {
                notificator.send(event.notification).catch(console.error);
            },
        },
        NotificationEvent
    );
}
