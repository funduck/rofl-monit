import { Notification } from "../domain/values/notification";
import { NotificatorInterface } from "./notificator_interface";

export class ConsoleNotificator extends NotificatorInterface {
    send(notification: Notification): Promise<void> {
        console.log("\x1b[43m%s\x1b[0m", notification.toString());
        return Promise.resolve();
    }
}
