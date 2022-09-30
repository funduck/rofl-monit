import { Observable } from "../entities/observable"
import { DomainEntityId } from "../entity"
import { DomainEvent } from "../event"

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
