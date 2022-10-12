import { DomainEventPublisher } from "../domain/core/event";
import { MonitoringEvent } from "../domain/events/monitoring_event";
import { TaskCancels } from "../infra/core/lib";
import { logger } from "../infra/logger";
import { DockerMonitoring } from "../interface/docker_monitoring";

/**
 * Connects docker and domain.
 * Produces MonitoringEvent.
 */
export function MonitoringService({
    publisher,
    monitoring,
}: {
    publisher: DomainEventPublisher;
    monitoring: DockerMonitoring;
}) {
    function monitoringCancel() {
        monitoring.stop();
    }
    TaskCancels.add(monitoringCancel);

    monitoring.start().then(
        () => {
            logger.info("Started application MonitoringService");

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
            TaskCancels.delete(monitoringCancel);
        }
    );
}
