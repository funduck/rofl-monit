import { DomainEntity, DomainEntityId } from "../core/entity";
import {
    ObservableState,
    ObservableStateUnknown,
} from "../values/observable_state";

export type ObservableStateAttrs = {
    timeMsec: number;
};

/**
 * Respresentation of an observable object.
 */
export class Observable extends DomainEntity {
    public declare readonly id: DomainEntityId<Observable>;

    public statesHistory: Array<[ObservableState, ObservableStateAttrs]> = [
        [ObservableStateUnknown, { timeMsec: 0 }],
    ];

    public state(): ObservableState {
        return this.statesHistory.at(-1)![0];
    }

    public stateAttrs(): ObservableStateAttrs {
        return this.statesHistory.at(-1)![1];
    }

    public previousState(): ObservableState {
        if (this.statesHistory.length > 1) return this.statesHistory.at(-2)![0];
        return this.statesHistory.at(-1)![0];
    }

    public previousStateAttrs(): ObservableStateAttrs {
        if (this.statesHistory.length > 1) return this.statesHistory.at(-2)![1];
        return this.statesHistory.at(-1)![1];
    }

    /**
     * Change state
     */
    public transition(state: ObservableState, timeMsec: number): void {
        this.statesHistory.push([state, { timeMsec }]);
    }

    /**
     * Reset to initial state.
     */
    public reset(): void {
        this.statesHistory = [[ObservableStateUnknown, { timeMsec: 0 }]];
    }

    /**
     * Forget all history and retain only present info
     */
    public dropHistory(): void {
        this.statesHistory = [[this.state(), this.stateAttrs()]];
    }
}
