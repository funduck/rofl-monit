import { DomainEntity, DomainEntityId } from "./entity"

/**
 * Interface for all repositories of domain entities.
 */
export interface InMemoryDomainRepository<T extends DomainEntity> {
    has(entityId: DomainEntityId<T>): boolean
    get(entityId: DomainEntityId<T>): T
    save(entity: T): void
    delete(entityId: DomainEntityId<T>): void
}

/**
 * All errors in repositories.
 */
export class DomainRepositoryError extends Error {}

/**
 * Thrown when entity is not found in any operation by repository.
 */
export class EntityNotFound extends DomainRepositoryError {
    constructor(entityId: DomainEntityId<DomainEntity>) {
        super(`Not found domain entity: ${entityId}`)
    }
}
