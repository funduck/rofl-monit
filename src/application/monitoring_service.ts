import { DomainEventPublisher } from "../domain/core/event";
import { MonitoringEvent } from "../domain/events/monitoring_event";
import { logger } from "../infra/logger";
import { DockerMonitoring } from "../interface/docker_monitoring";

/**
 * Connects docker and domain.
 * Produces MonitoringEvent.
 */
export function MonitoringService() {
    const publisher = DomainEventPublisher.getInstance();

    const monitoring = new DockerMonitoring();
    monitoring.start().then(
        () => {
            logger.info("Started MonitoringService");
            const monitEventsStream = monitoring.getMonitoringEventsStream();
            monitEventsStream.on("data", (monitEvent) => {
                logger.debug(`MonitoringEvent ${monitEvent}`);
                publisher.publish(monitEvent as MonitoringEvent);
            });
            monitEventsStream.on("error", (err) => {
                logger.error(err);
            });
        },
        (err) => {
            logger.error(err);
        }
    );
}
