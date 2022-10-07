import { MonitoringService } from "./application/monitoring_service";
import { NotificatorService } from "./application/notificator_service";
import { ObserverService } from "./application/observer_service";
import { SignalingService } from "./application/signaling_service";
import { logger } from "./infra/logger";

function main() {
    logger.setDefaultLevel(logger.levels.DEBUG);

    NotificatorService();
    SignalingService();
    ObserverService();
    MonitoringService();
}

function shutdown(signal: string) {
    logger.info(`Received exit signal ${signal} terminating`);
    // TODO
    // implement tasks cancels saving
    // for (const cancel of taskCancels) {
    //     cancel();
    // }
    process.exit(0);
}

function cleanup() {
    logger.debug("Cleaning up before exit");
}

for (const s of ["SIGTERM", "SIGINT"]) {
    process.on(s, shutdown);
}

process.on("exit", cleanup);

main();
