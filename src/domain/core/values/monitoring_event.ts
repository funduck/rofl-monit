import { DomainEvent } from "../event"

/**
 * Base received event about Object.
 */
export abstract class MonitoringEvent extends DomainEvent {
    constructor(readonly action: string, readonly objectId: string) {
        super()
    }

    toString(): string {
        return Object.entries(this)
            .map(([k,v]) => `${k}:${v}`)
            .sort()
            .join(', ')
    }
}
