import { Exporter } from "../domain/core/exporters";
import { Notification } from "../domain/core/values/notifications";

export class ConsoleExporter extends Exporter {
    send(notification: Notification): Promise<void> {
        console.log(notification.toString())
        return Promise.resolve()
    }
}
