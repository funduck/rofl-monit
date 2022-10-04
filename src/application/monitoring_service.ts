/**
 * Receives events from docker and generates MonitoringEvents and published them to the system
 */

import { DomainEventPublisher } from "../domain/core/event";
import { MonitoringEvent } from "../domain/events/monitoring_event";
import { DockerMonitoring } from "../interface/docker_monitoring";

export function MonitoringService() {
    const publisher = DomainEventPublisher.getInstance()

    const monitoring = new DockerMonitoring()
    monitoring.start().then(() => {
        const monitEventsStream = monitoring.getMonitoringEventsStream()
        monitEventsStream.on('data', (monitEvent) => {
            publisher.publish(monitEvent as MonitoringEvent)
        })
        monitEventsStream.on('error', (err) => {
            console.error(err)
        })
    }, (err) => {
        console.error(err)
    })
}
