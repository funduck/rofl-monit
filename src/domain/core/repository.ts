import { DomainEntity } from "./entity"

export interface DomainRepository<T extends DomainEntity> {
    get(entityId: string): T
    save(entity: T): Promise<void>
    delete(entityId: string): Promise<void>
}

export class DomainRepositoryError extends Error {}

export class EntityNotFound extends DomainRepositoryError {
    constructor(entityId: string) {
        super(`Not found domain entity: ${entityId}`)
    }
}
