import { DomainEvent } from "../../core/event";
import { ContainerState } from "./container_states";

/**
 * Event when state of representation of container has changed
 */
export class ContainerStateEvent extends DomainEvent {
    constructor(
        readonly previous: ContainerState,
        readonly current: ContainerState,
        ...args: ConstructorParameters<typeof DomainEvent>
    ) {
        super(...args)
    }
}
