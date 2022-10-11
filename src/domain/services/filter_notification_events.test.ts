import { NotificationEvent } from "../events/notification_events";
import { Notification } from "../values/notification";
import { filterByText } from "./filter_notification_events";

function event(text: string) {
    return new NotificationEvent(
        new Notification({
            text,
        })
    );
}

describe("FilterNotificationEvents", () => {
    test("should pass all", () => {
        for (const name of ["1", "abc", "my/container"])
            expect(filterByText(".*")(event(name))).toBeTruthy();
    });

    test("should pass selected", () => {
        for (const name of ["abc", "12"])
            expect(filterByText("(abc|^def|12$)")(event(name))).toBeTruthy();
        for (const name of ["cdef", "123"])
            expect(filterByText("(abc|^def|12$)")(event(name))).toBeFalsy();
    });
});
