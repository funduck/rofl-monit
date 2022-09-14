import { Notification } from "../../domain/core/notifications";
import { ConsoleExporter } from "../console_exporter";

describe('ConsoleExporter', () => {
    test('prints to console', () => {
        new ConsoleExporter('tester').send(new Notification({
            title: 'Hey, it is a success!',
            timeMsec: Number(new Date())
        }))
    });
});
