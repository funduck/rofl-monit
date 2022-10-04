/**
 * Receives events from docker and generates MonitoringEvents and published them to the system
 */

import { DomainEventPublisher } from "../domain/core/event";

export function MonitoringService() {
    const publisher = DomainEventPublisher.getInstance()

    /**
     * TODO
     * listen to docker and make ContainerEvents, NetworkEvents, ...
     * publish them into domain publisher
     */
}
