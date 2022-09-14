/**
 * Base received event about Object.
 */
export abstract class Event {
    readonly action: string
    readonly objectId: string
    readonly timeMsec: number

    toString(): string {
        return Object.entries(this)
            .map(([k,v]) => `${k}:${v}`)
            .sort()
            .join(', ')
    }
}
