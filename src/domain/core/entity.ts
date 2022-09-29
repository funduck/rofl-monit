import { DomainValue } from "./value";

/**
 * Generic class for all references to domain entities.
 *
 * It allows to indicate type of entity for a field with reference to a DomainEntity by id.
 * For example
 *
 * `anything.refId: DomainEntityId<MySpecialEntity>` means that
 * anything.refId is an id of MySpecialEntity
 */
export class DomainEntityId<T extends DomainEntity> extends DomainValue {
    toString(): string {
        return String(this.value)
    }

    clone(): DomainEntityId<T> {
        return new DomainEntityId<T>(this.value)
    }
}

/**
 * Base class for all domain entities.
 */
export class DomainEntity {
    constructor(readonly id: DomainEntityId<DomainEntity>) {}
}
