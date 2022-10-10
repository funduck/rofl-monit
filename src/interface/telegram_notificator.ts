import { Notification } from "../domain/values/notification";
import { NotificatorInterface } from "./notificator_interface";
import { Telegram } from "telegraf";

export class TelegramNotificator extends NotificatorInterface {
    private telegram: Telegram;

    constructor(
        readonly chatId: string,
        readonly botToken: string,
        botDefaults: object = {}
    ) {
        super();
        this.telegram = new Telegram(this.botToken, botDefaults);
    }

    async send(notification: Notification): Promise<void> {
        await this.telegram.sendMessage(this.chatId, notification.toHTML(), {
            parse_mode: "HTML",
        });
    }
}
