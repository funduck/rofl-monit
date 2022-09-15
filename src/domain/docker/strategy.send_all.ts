import { MonitoringEvent } from "../core/values/monitoring_events";
import { Notification } from "../core/values/notifications";
import { Strategy } from "../core/strategies";

export class SendAllStrategy extends Strategy {
    accept(event: MonitoringEvent): Promise<void> {
        return this.send(new Notification({
            title: event.toString(),
            objectId: event.objectId,
            timeMsec: event.timeMsec
        }))
    }
}
