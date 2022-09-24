import { MonitoringEvent } from "../../core/values/monitoring_event";

export class ContainerEvent extends MonitoringEvent {
    constructor(readonly image: string) {
        super()
    }
}
export class ContainerStartedEvent extends ContainerEvent {}
export class ContainerOOMEvent extends ContainerEvent {}
export class ContainerKilledEvent extends ContainerEvent {
    signal: number
}
export class ContainerDiedEvent extends ContainerEvent {
    exitCode: number
}
export class ContainerStoppedEvent extends ContainerEvent {}
export class ContainerRestartedEvent extends ContainerEvent {}
export class ContainerIsHealthyEvent extends ContainerEvent {}
export class ContainerNotHealthyEvent extends ContainerEvent {}
