import { Container } from "../domain/aggregates/container";
import { Id } from "../domain/core/entity";
import { MonitoringEvent } from "../domain/events/monitoring_event";

export function monitoringEventFromDockerEvent(dockerEvent: string): MonitoringEvent {
    return new MonitoringEvent(
        '',
        Id<Container>(''),
        0
    )
}
