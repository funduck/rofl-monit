import { DomainEventPublisher } from "../domain/core/event";
import { DomainRepository } from "../domain/core/repository";
import { ContainerEventStateChanged } from "../domain/events/container_events";
import { SignalingSendAll } from "../domain/services/signaling_send_all";
import { InMemoryContainerRepository } from "../infra/in_memory_container_repository";

/**
 * Connects signaling strategies and domain events.
 * Consumes ContainerEventStateChanged.
 * Produces NotificationEvents.
 */
export function SignalingService() {
    const publisher = DomainEventPublisher.getInstance();
    const containerRepo = DomainRepository.getInstance(
        InMemoryContainerRepository
    );
    const containerSignalling = new SignalingSendAll(containerRepo, publisher);
    publisher.subscribe(containerSignalling, ContainerEventStateChanged);
}
