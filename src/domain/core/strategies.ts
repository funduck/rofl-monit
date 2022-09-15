import { MonitoringEvent } from "./values/monitoring_events"
import { Exporter, Exporters } from "./exporters"
import { Notification } from "./values/notifications"

/**
 * Produces Notifications about Objects under monitoring`
 */
export abstract class Strategy {
    private enabled: boolean = true
    protected readonly exporter: Exporter
    readonly objectId: string

    /**
     * We provide ids of object and exporter because we dont want unnecessary coupling
     */
    constructor(objectId: string, exporterId: string) {
        this.objectId = objectId
        this.exporter = Exporters.getExporter(exporterId)
    }

    /**
     * Accept and store event about Object
     */
    abstract accept(event: MonitoringEvent): Promise<void>

    /**
     * Use this method to send notifications from strategy implemetation
     */
    protected send(notification: Notification): Promise<void> {
        if (this.isEnabled()) {
            return this.exporter.send(notification)
        }
        return Promise.resolve()
    }

    /**
     * When Strategy is enabled, it sends notifications.
     * When not enabled it doesn't
     */
    isEnabled(): boolean {
        return this.enabled
    }

    enable() {
        this.enabled = true
    }

    disable() {
        this.enabled = false
    }
}
