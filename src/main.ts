import { MonitoringService } from "./application/monitoring_service";
import { NotificatorService } from "./application/notificator_service";
import { ObserverService } from "./application/observer_service";
import { SignalingService } from "./application/signaling_service";
import { DomainEventPublisher } from "./domain/core/event";
import { DomainRepository } from "./domain/core/repository";
import { DomainService } from "./domain/core/service";
import { SignalingDetectLoops } from "./domain/services/container_signaling_detect_loops";
import { SignalingSendAll } from "./domain/services/container_signaling_send_all";
import { InMemoryContainerRepository } from "./infra/container_in_memory_repository";
import { TaskCancels } from "./infra/core/lib";
import { logger } from "./infra/logger";
import { ConsoleNotificator } from "./interface/console_notificator";
import { DockerMonitoring } from "./interface/docker_monitoring";

function main() {
    logger.setDefaultLevel(logger.levels.DEBUG);

    const publisher = DomainEventPublisher.getInstance();
    const containerRepo = DomainRepository.getInstance(
        InMemoryContainerRepository
    );
    let containerSignaling: DomainService;

    switch (process.env["APP_STRATEGY"]) {
        case "send_all": {
            containerSignaling = new SignalingSendAll(containerRepo, publisher);
            break;
        }
        default:
            containerSignaling = new SignalingDetectLoops(
                containerRepo,
                publisher
            );
    }

    const notificator = new ConsoleNotificator();
    // TODO APP_EXPORTER=="telegram"

    const monitoring = new DockerMonitoring();

    NotificatorService({
        publisher,
        notificator,
    });
    SignalingService({
        publisher,
        containerSignaling,
    });
    ObserverService({
        publisher,
        containerRepo,
    });
    MonitoringService({
        publisher,
        monitoring,
    });
}

function shutdown(signal: string) {
    logger.info(`Received exit signal ${signal}`);
    TaskCancels.cancelAll();
}

function cleanup() {
    logger.trace("Cleaning up before exit if needed any");
}
process.on("exit", cleanup);

for (const s of ["SIGTERM", "SIGINT"]) {
    process.on(s, shutdown);
}

main();
