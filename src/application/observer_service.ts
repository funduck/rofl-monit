import { ContainerObserver } from "../domain/containers/services/container_observer";
import { MonitoringEventContainer } from "../domain/containers/values/monitoring_events";
import { DomainEventPublisher } from "../domain/core/event";
import { InMemoryContainerRepo } from "../infra/containers/in_memory_container_repo";

/**
 * Listens for MonitoringEvents in system and publishes them to domain observer services
 */
export function ObserverService() {
    const publisher = DomainEventPublisher.getInstance()
    const containerRepo = new InMemoryContainerRepo(null)
    const containerObserver = new ContainerObserver(containerRepo, publisher)
    publisher.subscribe(containerObserver, MonitoringEventContainer)
}
