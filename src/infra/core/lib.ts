export interface Class<T> {
    new(...args: any[]): T;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}
