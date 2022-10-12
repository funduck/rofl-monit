import { ContainerObserver } from "../domain/services/container_observer";
import { MonitoringEventContainer } from "../domain/events/container_monitoring_events";
import { DomainEventPublisher } from "../domain/core/event";
import { InMemoryContainerRepository } from "../infra/container_in_memory_repository";
import { logger } from "../infra/logger";

/**
 * Splits stream of monitoring events to different observers.
 * Consumes MonitoringEvent.
 * Produces ContainerEventStateChanged.
 */
export function ObserverService({
    publisher,
    containerRepo,
}: {
    publisher: DomainEventPublisher;
    containerRepo: InMemoryContainerRepository;
}) {
    const containerObserver = new ContainerObserver(containerRepo, publisher);
    publisher.subscribe(containerObserver, MonitoringEventContainer);
    logger.info("Started application ObserverService");
}
