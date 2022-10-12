import { Readable } from "node:stream";
import { logger } from "../infra/logger";

export abstract class MonitoringInterface {
    constructor() {
        logger.info("Starting interface", this.constructor.name);
    }

    abstract start(): Promise<void>;

    abstract stop(): Promise<void>;

    /**
     * Should return ReadableStream of MonitoringEvents
     */
    abstract getMonitoringEventsStream(): Readable;
}
