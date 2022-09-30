import { DomainEntity, DomainEntityId } from "../entity";

/**
 * Base object of monitoring.
 */
export abstract class Observable extends DomainEntity {
    declare id: DomainEntityId<Observable>
}
