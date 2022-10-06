import { Readable, Transform } from "stream";
import { MonitoringInterface } from "./monitoring_interface";
import Docker from "dockerode";
import JSONStream from "jsonstream";
import { monitoringEventFromDockerEvent } from "./docker_adapter";
import { logger } from "../infra/logger";

export class DockerMonitoring implements MonitoringInterface {
    private docker: Docker;
    private rawEventsStream?: Readable;
    private monitoringEventsStream: Transform;

    constructor() {
        this.docker = new Docker();
        this.monitoringEventsStream = new Transform({
            transform(obj, encoding, callback) {
                try {
                    logger.debug(`Docker event ${obj}`);
                    const event = monitoringEventFromDockerEvent(obj);
                    if (event) callback(null, event);
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
        this.rawEventsStream!.pipe(JSONStream.parse("*")).pipe(
            this.monitoringEventsStream
        );
    }

    getMonitoringEventsStream(): Readable {
        return this.monitoringEventsStream;
    }
}
