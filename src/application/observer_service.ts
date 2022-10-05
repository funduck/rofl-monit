import { ContainerObserver } from "../domain/services/container_observer";
import { MonitoringEventContainer } from "../domain/events/container_monitoring_events";
import { DomainEventPublisher } from "../domain/core/event";
import { InMemoryContainerRepository } from "../infra/in_memory_container_repository";

/**
 * Listens for MonitoringEvents in system and publishes them to domain observer services
 */
export function ObserverService() {
    const publisher = DomainEventPublisher.getInstance();
    const containerRepo = new InMemoryContainerRepository(null);
    const containerObserver = new ContainerObserver(containerRepo, publisher);
    publisher.subscribe(containerObserver, MonitoringEventContainer);
}
