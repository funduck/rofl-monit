import { Notification } from "../../domain/core/values/notification";
import { ConsoleNotificator } from "../console_notificator";

describe('ConsoleExporter', () => {
    test('prints to console', () => {
        new ConsoleNotificator().send(new Notification({
            title: 'Hey, it is a success!',
            timeMsec: Number(new Date()),
            objectId: '1'
        }))
    });
});
