import { ContainerObserver } from "../domain/services/container_observer";
import { MonitoringEventContainer } from "../domain/events/container_monitoring_events";
import { DomainEventPublisher } from "../domain/core/event";
import { InMemoryContainerRepository } from "../infra/in_memory_container_repository";
import { DomainRepository } from "../domain/core/repository";
import { logger } from "../infra/logger";

/**
 * Splits stream of monitoring events to different observers.
 * Consumes MonitoringEvent.
 * Produces ContainerEventStateChanged.
 */
export function ObserverService() {
    const publisher = DomainEventPublisher.getInstance();
    const containerRepo = DomainRepository.getInstance(
        InMemoryContainerRepository
    );
    const containerObserver = new ContainerObserver(containerRepo, publisher);
    publisher.subscribe(containerObserver, MonitoringEventContainer);
    logger.info("Started ObserverService");
}
