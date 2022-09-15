import { randomUUID } from "crypto"

export class DomainEntity {
    readonly id: string = randomUUID()
}
