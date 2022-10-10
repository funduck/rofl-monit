import { DomainEventPublisher } from "../domain/core/event";
import { NotificationEvent } from "../domain/events/notification_events";
import { logger } from "../infra/logger";
import { NotificatorInterface } from "../interface/notificator_interface";

/**
 * Connects domain and external world.
 * Consumes NotificationEvent.
 * Produces Notification.
 */
export function NotificatorService({
    publisher,
    notificator,
}: {
    publisher: DomainEventPublisher;
    notificator: NotificatorInterface;
}) {
    publisher.subscribe(
        {
            handleEvent(event: NotificationEvent) {
                notificator.send(event.notification).catch(console.error);
            },
        },
        NotificationEvent
    );
    logger.info("Started NotificatorService");
}
