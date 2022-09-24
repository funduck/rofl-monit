import { DomainService } from "../service";
import { MonitoringEvent } from "../values/monitoring_event";

/**
 * Receives MonitoringEvents for its personal Observable
 * Can emit DomainEvents (Notifications included)
 * Can access Observable by observableId
 */
export abstract class ObserverService extends DomainService {
    constructor(public readonly observableId: string, ...args: ConstructorParameters<typeof DomainService>) {
        super(...args)
        this.eventPublisher.subscribe(this, MonitoringEvent)
    }

    protected abstract _save(event: MonitoringEvent): Promise<void>

    protected abstract _accept(event: MonitoringEvent): Promise<void>

    protected async accept(event: MonitoringEvent): Promise<void> {
        await this._save(event)
        return this._accept(event)
    }
}
