import { DomainEntityId } from "../../core/entity";
import { MonitoringEvent } from "../../core/values/monitoring_event";
import { Container } from "../aggregates/container";

/**
 * Event from monitoring abount observable container. Docker specific.
 */
export class MonitoringEventContainer extends MonitoringEvent {
    declare public readonly observableId: DomainEntityId<Container>

    constructor(
        readonly image: string,
        ...args: ConstructorParameters<typeof MonitoringEvent>
    ) {
        super(...args)
    }
}
export class MonitoringEventContainerStarted extends MonitoringEventContainer {}
export class MonitoringEventContainerOOM extends MonitoringEventContainer {}
export class MonitoringEventContainerKilled extends MonitoringEventContainer {
    constructor(
        readonly signal: number,
        ...args: ConstructorParameters<typeof MonitoringEventContainer>
    ) {
        super(...args)
    }
}
export class MonitoringEventContainerDied extends MonitoringEventContainer {
    constructor(
        readonly exitCode: number,
        ...args: ConstructorParameters<typeof MonitoringEventContainer>
    ) {
        super(...args)
    }
}
export class MonitoringEventContainerStopped extends MonitoringEventContainer {}
export class MonitoringEventContainerRestarted extends MonitoringEventContainer {}
export class MonitoringEventContainerIsHealthy extends MonitoringEventContainer {}
export class MonitoringEventContainerNotHealthy extends MonitoringEventContainer {}
