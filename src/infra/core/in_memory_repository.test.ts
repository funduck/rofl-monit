import { DomainEntity, DomainEntityId } from "../../domain/core/entity";
import { DomainRepository, EntityNotFound } from "../../domain/core/repository";
import { InMemoryRepository } from "./in_memory_repository";

describe("InMemoryRepository", () => {
    class MyEntity extends DomainEntity {
        declare id: DomainEntityId<MyEntity>;
        constructor(
            public value: string,
            ...args: ConstructorParameters<typeof DomainEntity>
        ) {
            super(...args);
        }
    }
    class MyInMemoryRepository extends InMemoryRepository<MyEntity> {
        protected newInstance(
            options: {
                mem: Map<string, MyEntity> | null;
            } = { mem: null }
        ): MyInMemoryRepository {
            return new MyInMemoryRepository(options.mem);
        }
        clone(entity: MyEntity): MyEntity {
            return new MyEntity(entity.value, entity.id.clone());
        }
    }

    const repo = DomainRepository.getInstance(MyInMemoryRepository);
    let enId = new DomainEntityId<MyEntity>(0);
    let entity = new MyEntity("A", enId);
    let readEntity: MyEntity;
    let overwrittenEntity: MyEntity;

    test("should save entity", () => {
        repo.save(entity);
    });
    test("should throw when get not existing entity", () => {
        expect(() => repo.get(new DomainEntityId<MyEntity>(1))).toThrow(
            EntityNotFound
        );
    });
    test("should get existing entity by same EntityId", () => {
        readEntity = repo.get(enId);
        expect(readEntity).toStrictEqual(entity);
        expect(readEntity).not.toBe(entity);
    });
    test("should get existing entity by new EntityId", () => {
        readEntity = repo.get(new DomainEntityId<MyEntity>(enId.value));
        expect(readEntity).toStrictEqual(entity);
        expect(readEntity).not.toBe(entity);
    });
    test("should get existing entity by cloned EntityId", () => {
        readEntity = repo.get(enId.clone());
        expect(readEntity).toStrictEqual(entity);
        expect(readEntity).not.toBe(entity);
    });
    test("should save existing entity (overwrite)", () => {
        entity.value = "B";
        repo.save(entity);
    });
    test("should get updated entity", () => {
        overwrittenEntity = repo.get(enId);
        expect(overwrittenEntity).toStrictEqual(entity);
        expect(readEntity).not.toStrictEqual(entity);
    });
    test("should delete existing entity", () => {
        repo.delete(entity.id);
    });
    test("should delete not existing entity", async () => {
        repo.delete(entity.id);
    });
    test("should throw when get not existing entity", () => {
        expect(() => repo.get(new DomainEntityId<MyEntity>(1))).toThrow(
            EntityNotFound
        );
    });
});
