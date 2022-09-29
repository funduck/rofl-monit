import { DomainEntity, DomainEntityId } from "./entity"

/**
 * Interface for all repositories of domain entities.
 */
export interface DomainRepository<T extends DomainEntity> {
    get(entityId: DomainEntityId<T>): Promise<T>
    save(entity: T): Promise<void>
    delete(entityId: DomainEntityId<T>): Promise<void>
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
