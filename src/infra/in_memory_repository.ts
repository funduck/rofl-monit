import { DomainEntity, DomainEntityId } from "../domain/core/entity";
import { DomainRepository, EntityNotFound } from "../domain/core/repository";

/**
 * In memory storage for any kind of entities.
 *
 * To use it extend this clas and implement "clone" method.
 * Repository needs cloning because otherwise if two places call "get" of same entity,
 * they will receive same object and it will lead to side effects.
 */
export abstract class InMemoryRepository<T extends DomainEntity> implements DomainRepository<T> {
    private mem: Map<string, T>

    constructor(mem: Map<string, T> | null) {
        this.mem = mem || new Map()
    }

    abstract clone(entity: T): T

    get(entityId: DomainEntityId<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const res = this.mem.get(String(entityId))
            if (!res) {
                return reject(new EntityNotFound(entityId))
            }
            resolve(this.clone(res))
        })
    }

    save(entity: T): Promise<void> {
        this.mem.set(String(entity.id), entity)
        return Promise.resolve()
    }

    delete(entityId: DomainEntityId<T>): Promise<void> {
        this.mem.delete(String(entityId))
        return Promise.resolve()
    }
}
