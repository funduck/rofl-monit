import { DomainEntity, DomainEntityId } from "../core/entity";
import { ObservableState, ObservableStateUnknown } from "../values/observable_state";

/**
 * Respresentation of an observable object.
 */
export class Observable extends DomainEntity {
    declare public readonly id: DomainEntityId<Observable>

    public statesHistory: Array<ObservableState> = [ObservableStateUnknown]

    public state(): ObservableState {
        return this.statesHistory.at(-1)!
    }

    public previousState(): ObservableState {
        return this.statesHistory.at(-2) || this.statesHistory.at(-1)!
    }

    /**
     * Change state
     */
    public transition(state: ObservableState): void {
        this.statesHistory.push(state)
    }

    /**
     * Reset to initial state.
     */
    public reset(): void {
        this.statesHistory = [ObservableStateUnknown]
    }

    /**
     * Forget all history and retain only present info
     */
    public dropHistory(): void {
        this.statesHistory = [this.state()]
    }
}
