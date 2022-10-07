import { MonitoringService } from "./application/monitoring_service";
import { NotificatorService } from "./application/notificator_service";
import { ObserverService } from "./application/observer_service";
import { SignalingService } from "./application/signaling_service";
import { TaskCancels } from "./infra/core/lib";
import { logger } from "./infra/logger";

function main() {
    logger.setDefaultLevel(logger.levels.DEBUG);

    NotificatorService();
    SignalingService();
    ObserverService();
    MonitoringService();
}

function shutdown(signal: string) {
    logger.info(
        `Received exit signal ${signal} calling all TaskCancels and terminating`
    );
    for (const cancel of TaskCancels.items()) {
        cancel();
    }
}

function cleanup() {
    logger.trace("Cleaning up before exit if needed any");
}
process.on("exit", cleanup);

for (const s of ["SIGTERM", "SIGINT"]) {
    process.on(s, shutdown);
}

main();
