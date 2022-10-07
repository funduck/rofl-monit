export interface Class<T> {
    new (...args: any[]): T;
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function nanoToMsec(time: number): number {
    return Number(time.toString().slice(0, -3));
}

export const msecToSec = nanoToMsec;
