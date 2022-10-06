import { DomainEntity, DomainEntityId } from "../../domain/core/entity";
import {
    InMemoryDomainRepository,
    EntityNotFound,
    DomainRepository,
} from "../../domain/core/repository";

/**
 * In memory storage for any kind of entities.
 *
 * To use it extend this clas and implement "clone" method.
 * Repository needs cloning because otherwise if two places call "get" of same entity,
 * they will receive same object and it will lead to side effects.
 */
export abstract class InMemoryRepository<T extends DomainEntity>
    extends DomainRepository
    implements InMemoryDomainRepository<T>
{
    private mem: Map<string, T>;

    constructor(mem: Map<string, T> | null = null) {
        super();
        this.mem = mem || new Map();
    }

    abstract clone(entity: T): T;

    has(entityId: DomainEntityId<T>): boolean {
        return this.mem.has(String(entityId));
    }

    get(entityId: DomainEntityId<T>): T {
        const res = this.mem.get(String(entityId));
        if (res === undefined) {
            throw new EntityNotFound(entityId);
        }
        return this.clone(res);
    }

    save(entity: T): void {
        this.mem.set(String(entity.id), entity);
    }

    delete(entityId: DomainEntityId<T>): void {
        this.mem.delete(String(entityId));
    }
}
