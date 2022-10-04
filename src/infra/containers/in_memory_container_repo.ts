import { Container } from "../../domain/containers/aggregates/container";
import { InMemoryRepository } from "../in_memory_repository";

export class InMemoryContainerRepo extends InMemoryRepository<Container> {
    clone(entity: Container): Container {
        const clone = new Container(entity.image, entity.id)
        clone.statesHistory = entity.statesHistory.map(_ => _)
        return clone
    }
}
