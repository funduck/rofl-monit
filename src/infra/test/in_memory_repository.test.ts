import { DomainEntity, DomainEntityId } from "../../domain/core/entity"
import { EntityNotFound } from "../../domain/core/repository"
import { InMemoryRepository } from "../in_memory_repository"

describe('InMemoryRepository', () => {
    class MyEntity extends DomainEntity {
        declare id: DomainEntityId<MyEntity>
        constructor(public value: string, ...args: ConstructorParameters<typeof DomainEntity>) {
            super(...args)
        }
    }
    class MyInMemoryRepository extends InMemoryRepository<MyEntity> {
        clone(entity: MyEntity): MyEntity {
            return new MyEntity(entity.value, entity.id.clone())
        }
    }

    const repo = new MyInMemoryRepository(null)
    let enId = new DomainEntityId<MyEntity>(0)
    let entity = new MyEntity('A', enId)
    let readEntity: MyEntity
    let overwrittenEntity: MyEntity

    test('should save entity', async () => {
        await expect(repo.save(entity)).resolves.not.toThrowError()
    })
    test('should throw when get not existing entity', async () => {
        await expect(repo.get(new DomainEntityId<MyEntity>(1))).rejects.toThrow(EntityNotFound)
    })
    test('should get existing entity by same EntityId', async () => {
        readEntity = await repo.get(enId)
        expect(readEntity).toStrictEqual(entity)
        expect(readEntity).not.toBe(entity)
    })
    test('should get existing entity by new EntityId', async () => {
        readEntity = await repo.get(new DomainEntityId<MyEntity>(enId.value))
        expect(readEntity).toStrictEqual(entity)
        expect(readEntity).not.toBe(entity)
    })
    test('should get existing entity by cloned EntityId', async () => {
        readEntity = await repo.get(enId.clone())
        expect(readEntity).toStrictEqual(entity)
        expect(readEntity).not.toBe(entity)
    })
    test('should save existing entity (overwrite)', async () => {
        entity.value = 'B'
        await expect(repo.save(entity)).resolves.not.toThrowError()
    })
    test('should get updated entity', async () => {
        overwrittenEntity = await repo.get(enId)
        expect(overwrittenEntity).toStrictEqual(entity)
        expect(readEntity).not.toStrictEqual(entity)
    })
    test('should delete existing entity', async () => {
        await expect(repo.delete(entity.id)).resolves.not.toThrowError()
    })
    test('should delete not existing entity', async () => {
        await expect(repo.delete(entity.id)).resolves.not.toThrowError()
    })
    test('should throw when get not existing entity', async () => {
        await expect(repo.get(new DomainEntityId<MyEntity>(1))).rejects.toThrow(EntityNotFound)
    })
})
