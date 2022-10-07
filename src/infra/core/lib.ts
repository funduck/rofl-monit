/**
 * Helper type for class as parameter.
 */
export interface Class<T> {
    new (...args: any[]): T;
}

/**
 * Async function sleep(milliseconds).
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convertion nano seconds to milli seconds, with loss of precision.
 */
export function nanoToMsec(time: number): number {
    return Number(time.toString().slice(0, -3));
}

/**
 * Convertion milli seconds to seconds, with loss of precision.
 */
export const msecToSec = nanoToMsec;

/**
 * Allows to remember what should be called before termination.
 * When app decides to finish it calls all cancels and Nodejs loop should finish.
 */
export class TaskCancels {
    private static set: Set<CallableFunction> = new Set();

    static add(cancel: CallableFunction) {
        this.set.add(cancel);
    }

    static delete(cancel: CallableFunction) {
        this.set.delete(cancel);
    }

    static items(): Array<CallableFunction> {
        return Array.from(this.set);
    }
}
