import { Notification } from "../domain/core/values/notification";
import { NotificatorInterface } from "./notificator_interface";

export class ConsoleNotificator extends NotificatorInterface {
    send(notification: Notification): Promise<void> {
        console.log(notification.toString())
        return Promise.resolve()
    }
}
