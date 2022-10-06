import { Notification } from "../domain/values/notification";
import { ConsoleNotificator } from "./console_notificator";

describe("ConsoleExporter", () => {
    test("prints to console", () => {
        new ConsoleNotificator().send(
            new Notification("Hey, it is a success!", Number(new Date()), "")
        );
    });
});
