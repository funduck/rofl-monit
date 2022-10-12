import { Notification } from "../domain/values/notification";
import { logger } from "../infra/logger";

export abstract class NotificatorInterface {
    constructor() {
        logger.info("Starting interface", this.constructor.name);
    }
    /**
     * Send notification to external world
     */
    abstract send(notification: Notification): Promise<void>;

    /**
     * TODO
     * implement stream for sending
     */
}
