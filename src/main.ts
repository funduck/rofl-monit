import { MonitoringService } from "./application/monitoring_service";
import { NotificatorService } from "./application/notificator_service";
import { ObserverService } from "./application/observer_service";
import { SignalingService } from "./application/signaling_service";
import { logger } from "./infra/logger";

logger.setDefaultLevel(logger.levels.TRACE);

NotificatorService();
SignalingService();
ObserverService();
MonitoringService();
