import { Notification } from "../domain/values/notification";
import { NotificatorInterface } from "./notificator_interface";

export class ConsoleNotificator extends NotificatorInterface {
    send(notification: Notification): Promise<void> {
        console.log(notification.toString())
        return Promise.resolve()
    }
}
