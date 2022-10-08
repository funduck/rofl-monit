import { Container } from "../domain/aggregates/container";
import { InMemoryRepository } from "./core/in_memory_repository";

export class InMemoryContainerRepository extends InMemoryRepository<Container> {
    clone(entity: Container): Container {
        const clone = new Container(entity.image, entity.id);
        clone.stateHistory = entity.stateHistory.map((_) => _);
        return clone;
    }
}
