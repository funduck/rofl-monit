import { Readable } from 'node:stream'

export abstract class MonitoringInterface {
    abstract start(): Promise<void>

    /**
     * Should return ReadableStream of MonitoringEvents
     */
    abstract getMonitoringEventsStream(): Readable
}
