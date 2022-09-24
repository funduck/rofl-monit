import { DomainEntity } from "../domain/core/entity";
import { DomainRepository, EntityNotFound } from "../domain/core/repository";

export class InMemoryRepository<T extends DomainEntity> implements DomainRepository<T> {
    private mem: Map<string, T>

    constructor(mem: Map<string, T>) {
        this.mem = mem || new Map()
    }

    get(entityId: string): T {
        const res = this.mem.get(entityId)
        if (!res) {
            throw new EntityNotFound(entityId)
        }
        return res
    }

    save(entity: T): Promise<void> {
        this.mem.set(entity.id, entity)
        return Promise.resolve()
    }

    delete(entityId: string): Promise<void> {
        this.mem.delete(entityId)
        return Promise.resolve()
    }
}
