import { DomainEventPublisher } from "../domain/core/event";
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
}: {
    publisher: DomainEventPublisher;
    containerSignaling: DomainService;
}) {
    publisher.subscribe(containerSignaling, ContainerEventStateChanged);
    logger.info("Started SignalingService");
}
