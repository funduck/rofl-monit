import { Observable } from "../aggregates/observable"
import { DomainEntityId } from "../core/entity"
import { DomainEvent } from "../core/event"

/**
 * Base event from monitoring about any Observable.
 */
export class MonitoringEvent extends DomainEvent {
    constructor(
        readonly action: string,
        readonly observableId: DomainEntityId<Observable>,
        readonly timeMsec: number
    ) {
        super(timeMsec)
    }
}
