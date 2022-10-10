import { DomainValue } from "../core/value";

/**
 * Base notification about changes with Object.
 */
export class Notification extends DomainValue {
    readonly html: string;

    public constructor(
        { text, html }: { text: string; html?: string } = {
            text: "",
            html: "",
        }
    ) {
        super(text);
        this.html = html || text;
    }

    public toHTML(): string {
        return this.html;
    }
}

export class NotificationContainerStateChange extends Notification {}
export class NotificationContainerRofl extends Notification {}
export class NotificationContainerRoflEnded extends Notification {}
