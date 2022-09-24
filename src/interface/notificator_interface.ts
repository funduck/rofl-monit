import { Notification } from "../domain/core/values/notification";

export abstract class NotificatorInterface {
    /**
     * Send notification to external world
     */
    abstract send(notification: Notification): Promise<void>
}
