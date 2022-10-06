import { MonitoringService } from "./application/monitoring_service";
import { NotificatorService } from "./application/notificator_service";
import { ObserverService } from "./application/observer_service";
import { SignalingService } from "./application/signaling_service";

NotificatorService();
SignalingService();
ObserverService();
MonitoringService();
