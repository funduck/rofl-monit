import { DomainEventFilter, DomainEventPublisher } from "../domain/core/event";
import { DomainService } from "../domain/core/service";
import { ContainerEventStateChanged } from "../domain/events/container_events";
import { logger } from "../infra/logger";

/**
 * Connects signaling strategies and domain events.
 * Consumes ContainerEventStateChanged.
 * Produces NotificationEvents.
 */
export function SignalingService({
    publisher,
    containerSignaling,
    eventsFilter,
}: {
    publisher: DomainEventPublisher;
    containerSignaling: DomainService;
    eventsFilter?: DomainEventFilter;
}) {
    publisher.subscribe(
        containerSignaling,
        ContainerEventStateChanged,
        eventsFilter
    );
    logger.info("Started application SignalingService");
}
