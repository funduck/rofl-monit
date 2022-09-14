/**
 * Docker events as children of domain.Event
 */
import { Event } from "../core/events";

export class ContainerEvent extends Event {
    /**
     * Base docker container event
     */
    image: string
}
export class ContainerStartedEvent extends ContainerEvent {}
export class ContainerStoppedEvent extends ContainerEvent {}
export class ContainerOOMEvent extends ContainerEvent {}

export class ContainerUserEvent extends ContainerEvent {
    /**
     * Base docker container event describing user action
     */
}
export class ContainerCreatedEvent extends ContainerUserEvent {}
export class ContainerDestroyedEvent extends ContainerUserEvent {}
export class ContainerKilledEvent extends ContainerUserEvent {}
export class ContainerRestartedEvent extends ContainerUserEvent {}

export class ContainerExitEvent extends ContainerEvent {
    /**
     * Base docker container event when container exits
     */
    exitCode: number
}
export class ContainerDiedEvent extends ContainerExitEvent {}

export class ContainerHealthEvent extends ContainerEvent {
    /**
     * Base docker container event describing healthcheck result
     */
    healthStatus: string
}
export class ContainerIsHealthyEvent extends ContainerHealthEvent {}
export class ContainerNotHealthyEvent extends ContainerHealthEvent {}
