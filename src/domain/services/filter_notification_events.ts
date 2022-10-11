import { DomainEvent, DomainEventFilter } from "../core/event";
import { NotificationEvent } from "../events/notification_events";

export function filterByText(regexp: string): DomainEventFilter {
    const re = new RegExp(regexp);
    return (event: DomainEvent): boolean => {
        if (event instanceof NotificationEvent) {
            if (String((event as NotificationEvent).notification).match(re)) {
                return true;
            }
        }
        return false;
    };
}
