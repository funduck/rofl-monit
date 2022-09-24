import { randomUUID } from "crypto"

export class DomainEntity {
    constructor(readonly id: string = randomUUID()) {}
}
