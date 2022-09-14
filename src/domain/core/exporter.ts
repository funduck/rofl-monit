import assert from "assert"
import { randomUUID } from "crypto"
import { Notification } from "./notifications"

export abstract class Exporter {
    readonly id: string = randomUUID()
    readonly name: string

    constructor(name:string) {
        this.name = name
    }

    /**
     * Send notification to external world
     */
    abstract send(notification: Notification): Promise<void>
}

export class Exporters {
    private static map = new Map<string, Exporter>()

    static setExporter(id: string, exporter: Exporter) {
        this.map.set(id, exporter)
    }

    static getExporter(id: string): Exporter {
        const exporter = this.map.get(id)
        assert(exporter, `Exporter not found by id ${id}`)
        return exporter
    }
}
