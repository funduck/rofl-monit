import { Event } from "../core/events";
import { Notification } from "../core/notifications";
import { Strategy } from "../core/strategy";

export class SendAllStrategy extends Strategy {
    accept(event: Event): Promise<void> {
        return this.send(new Notification({
            title: event.toString(),
            objectId: event.objectId,
            timeMsec: event.timeMsec
        }))
    }
}
