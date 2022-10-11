import { DomainEvent, DomainEventFilter } from "../core/event";
import { ContainerEvent } from "../events/container_events";

export function filterContainerNames(
    regexpIncludeContainers: string
): DomainEventFilter {
    const re = new RegExp(regexpIncludeContainers);
    return (event: DomainEvent): boolean => {
        if (event instanceof ContainerEvent) {
            if (String((event as ContainerEvent).containerId).match(re)) {
                return true;
            }
        }
        return false;
    };
}
