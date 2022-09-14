import { Exporter } from "../domain/core/exporter";
import { Notification } from "../domain/core/notifications";

export class ConsoleExporter extends Exporter {
    send(notification: Notification): Promise<void> {
        console.log(notification.toString())
        return new Promise((resolve) => resolve())
    }
}
