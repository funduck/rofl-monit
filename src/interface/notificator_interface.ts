import { Notification } from "../domain/values/notification";

export abstract class NotificatorInterface {
    /**
     * Send notification to external world
     */
    abstract send(notification: Notification): Promise<void>;

    /**
     * TODO
     * implement stream for sending
     */
}
