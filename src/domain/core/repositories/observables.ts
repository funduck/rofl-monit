import { Observable } from "../entities/observable";
import { InMemoryDomainRepository } from "../repository";

export type ObservablesRepository = InMemoryDomainRepository<Observable>
