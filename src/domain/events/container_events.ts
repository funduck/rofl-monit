import { DomainEvent } from "../core/event";
import { ContainerState } from "../values/container_states";

/**
 * Event when state of representation of container has changed
 */
export class ContainerEvent extends DomainEvent {}

export class ContainerEventStateChanged extends ContainerEvent {
    constructor(
        readonly previous: ContainerState,
        readonly current: ContainerState,
        ...args: ConstructorParameters<typeof DomainEvent>
    ) {
        super(...args)
    }
}
