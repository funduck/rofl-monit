import { DomainValue } from "../core/value";

/**
 * Base notification about changes with Object.
 */
export class Notification extends DomainValue {
    public constructor(
        readonly title: string,
        readonly timeMsec: number,
        ...args: ConstructorParameters<typeof DomainValue>
    ) {
        super(...args);
    }

    public getLocaleDateTimeString(): string {
        return new Date(this.timeMsec).toLocaleString();
    }

    public toString(): string {
        return `${this.getLocaleDateTimeString()}\n${this.title}\n${
            this.value
        }`;
    }
}

export class NotificationContainerStateChange extends Notification {}
export class NotificationContainerRofl extends Notification {}
export class NotificationContainerRoflEnded extends Notification {}
