import { Class } from "../../infra/core/lib";
import { DomainEntity, DomainEntityId } from "./entity";

export abstract class DomainRepository {
    private static instances: Map<
        Class<DomainRepository>,
        Map<string, DomainRepository>
    > = new Map();

    /**
     * Allows shared use of repositories.
     */
    public static getInstance<T extends DomainRepository>(
        RepositoryClass: Class<T>,
        name?: string,
        constructorArgs?: Array<any>
    ): T {
        if (name == undefined) name = "";
        let repo = this.instances.get(RepositoryClass)?.get(name) as T;
        if (repo) return repo;
        if (constructorArgs == undefined) constructorArgs = [];
        repo = new RepositoryClass(...constructorArgs);
        if (!this.instances.has(RepositoryClass))
            this.instances.set(RepositoryClass, new Map());
        this.instances.get(RepositoryClass)!.set(name, repo!);
        return repo!;
    }
}

/**
 * Interface for all repositories of domain entities.
 */
export interface InMemoryDomainRepository<T extends DomainEntity> {
    has(entityId: DomainEntityId<T>): boolean;
    get(entityId: DomainEntityId<T>): T;
    save(entity: T): void;
    delete(entityId: DomainEntityId<T>): void;
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
        super(`Not found domain entity: ${entityId}`);
    }
}
