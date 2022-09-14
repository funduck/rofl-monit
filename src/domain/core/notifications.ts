interface BaseNotification {
    title: string
    objectId: string
  timeMsec: number
}

/**
 * Base notification about changes with Object.
 */
export class Notification {
    readonly title: string = ''
    readonly objectId: string = ''
    readonly timeMsec: number = 0

    public constructor(init?:Required<BaseNotification>) {
        Object.assign(this, init);
    }

    public getLocaleDateTimeString(): string {
        return new Date(this.timeMsec).toLocaleString()
    }

    public toString(): string {
        return [
            this.title,
            this.getLocaleDateTimeString(),
        ].concat(
            Object.entries(this)
            .filter(([k,v]) => k != "title" && k != "timeMsec")
            .map(([k,v]) => `${k}=${v}`)
            .sort()
        ).join('\n')
    }
}
