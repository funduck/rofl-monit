import { Readable, Transform } from "stream";
import { MonitoringInterface } from "./monitoring_interface";
import Docker from "dockerode";
import JSONStream from "jsonstream";
import { monitoringEventFromDockerEvent } from "./docker_adapter";
import { logger } from "../infra/logger";

export class DockerMonitoring extends MonitoringInterface {
    private docker: Docker;
    private rawEventsStream?: Readable;
    private monitoringEventsStream: Transform;

    constructor() {
        super();
        this.docker = new Docker();
        this.monitoringEventsStream = new Transform({
            transform(obj, encoding, callback) {
                try {
                    logger.trace(`Docker event: ${JSON.stringify(obj)}`);
                    const event = monitoringEventFromDockerEvent(obj);
                    callback(null, event);
                } catch (err) {
                    logger.error(err);
                    callback(err as Error);
                }
            },
            writableObjectMode: true,
            readableObjectMode: true,
        });
    }

    /**
     * Start monitoring and emitting events
     */
    async start(): Promise<void> {
        // @ts-ignore
        this.rawEventsStream = await this.docker.getEvents();
        logger.info("Connected to docker");
        this.rawEventsStream!.pipe(JSONStream.parse(null)).pipe(
            this.monitoringEventsStream
        );
    }

    stop(): Promise<void> {
        if (!this.rawEventsStream) return Promise.resolve();
        return new Promise((resolve, reject) => {
            this.rawEventsStream!.on("close", () => {
                logger.info("Destroyed docker events stream");
                resolve();
            });
            this.rawEventsStream!.on("error", reject);
            this.rawEventsStream!.destroy();
        });
    }

    getMonitoringEventsStream(): Readable {
        return this.monitoringEventsStream;
    }
}
