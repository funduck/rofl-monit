import { DomainService } from "../service";
import { MonitoringEvent } from "../values/monitoring_events";

/**
 * Receives MonitoringEvents for its personal Observable
 * Can emit DomainEvents (Notifications included)
 * Can access Observable by observableId
 */
export abstract class ObserverService extends DomainService {
    observableId: string

    constructor(observableId: string) {
        super()
        this.observableId = observableId
    }

    protected abstract _save(event: MonitoringEvent): Promise<void>

    protected abstract _accept(event: MonitoringEvent): Promise<void>

    protected async accept(event: MonitoringEvent): Promise<void> {
        await this._save(event)
        return this._accept(event)
    }
}
