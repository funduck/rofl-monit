import { Container } from "../domain/aggregates/container";
import { InMemoryRepository } from "./core/in_memory_repository";

// TODO may be clone in Container?

export class InMemoryContainerRepository extends InMemoryRepository<Container> {
    clone(entity: Container): Container {
        const clone = new Container(entity.image, entity.id);
        clone.stateHistory = entity.stateHistory.map((_) => _);
        clone.attributes = new Map(entity.attributes.entries());
        return clone;
    }
}
