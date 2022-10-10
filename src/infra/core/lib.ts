import { logger } from "../logger";

/**
 * Helper type for class as parameter.
 */
export interface Class<T> {
    new (...args: any[]): T;
}

/**
 * Helper type for class constuctor.
 */
export interface Constructor<T> {
    (...args: any[]): T;
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
    return Number(time.toString().slice(0, -6));
}

/**
 * Convertion milli seconds to seconds, with loss of precision.
 */
export function msecToSec(time: number): number {
    return Number(time.toString().slice(0, -3));
}

/**
 * Millis since January 1, 1970
 */
export function now(): number {
    return Number(new Date());
}

/**
 * Global repository of what should be called before termination of an app.
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

    static cancelAll(): void {
        logger.info(`Canceling all tasks`);
        for (const cancel of this.set) {
            cancel();
        }
    }
}
