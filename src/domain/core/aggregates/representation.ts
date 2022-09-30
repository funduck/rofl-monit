import { Observable } from "../entities/observable";
import { DomainEntity, DomainEntityId } from "../entity";
import { RepresentationState, RepresentationStateUnknown } from "../values/representation_state";

/**
 * Respresentation of an observable object.
 */
export class Representation extends DomainEntity {

    protected statesHistory: Array<RepresentationState> = []

    constructor(public readonly observableId: DomainEntityId<Observable>) {
        super()
    }

    public state(): RepresentationState {
        return this.statesHistory.at(-1) || RepresentationStateUnknown
    }

    public previousState(): RepresentationState {
        return this.statesHistory.at(-2) || RepresentationStateUnknown
    }

    /**
     * Change state
     */
    public transition(state: RepresentationState): void {
        this.statesHistory.push(state)
    }

    /**
     * Reset to initial state.
     */
    public reset(): void {
        this.statesHistory = []
    }
}
