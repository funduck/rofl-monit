import { Observable } from "../../core/aggregates/observable";
import { DomainEntityId } from "../../core/entity";

export class Container extends Observable {
    declare readonly id: DomainEntityId<Container>

    constructor(
        readonly image: string,
        id: DomainEntityId<Container>
    ) {
        super(id)
    }
}
