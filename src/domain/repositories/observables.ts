import { Observable } from "../entities/observable";
import { InMemoryDomainRepository } from "../core/repository";

export type ObservablesRepository = InMemoryDomainRepository<Observable>
