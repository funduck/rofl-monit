import { Representation } from "../../core/aggregates/representation";
import { DomainEntityId } from "../../core/entity";
import { Container } from "../entities/container";

export class ContainerRepresentation extends Representation {
    declare public readonly observableId: DomainEntityId<Container>
}
