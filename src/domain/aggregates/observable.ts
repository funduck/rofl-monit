import { Class, Constructor } from "../../infra/core/lib";
import { DomainEntity, DomainEntityId } from "../core/entity";
import { ObservableAttribute } from "../values/observable_attribute";
import {
    ObservableState,
    ObservableStateUnknown,
} from "../values/observable_state";

export type ObservableStateAttrs = {
    timeMsec: number;
};

type StateHistoryRecord = {
    state: ObservableState;
    attrs: ObservableStateAttrs;
};

/**
 * Respresentation of an observable object.
 */
export class Observable extends DomainEntity {
    public declare readonly id: DomainEntityId<Observable>;

    public stateHistory: Array<StateHistoryRecord> = [
        {
            state: ObservableStateUnknown,
            attrs: { timeMsec: 0 },
        },
    ];
    protected stateHistoryMaxLen: number = 1440; // 1 in minute, 24h

    public attributes: Map<
        Constructor<ObservableAttribute>,
        ObservableAttribute
    > = new Map();

    public state(): ObservableState {
        return this.stateHistory.at(-1)!.state;
    }

    public stateAttrs(): ObservableStateAttrs {
        return this.stateHistory.at(-1)!.attrs;
    }

    public previousState(): ObservableState {
        if (this.stateHistory.length > 1)
            return this.stateHistory.at(-2)!.state;
        return this.stateHistory.at(-1)!.state;
    }

    // public previousStateAttrs(): ObservableStateAttrs {
    //     if (this.statesHistory.length > 1) return this.statesHistory.at(-2)![1];
    //     return this.statesHistory.at(-1)![1];
    // }

    /**
     * Finds state <count> times from tail of history.
     */
    public findPreviousStates(
        state: ObservableState,
        count: number = 1
    ): Array<ObservableStateAttrs> {
        let i = this.stateHistory.length;
        const res = [];
        for (const _ of Array(count)) {
            while (i) {
                i--;
                if (this.stateHistory[i].state == state) {
                    res.push(this.stateHistory[i].attrs);
                    break;
                }
            }
        }
        return res.reverse();
    }

    /**
     * Change state
     */
    public transition(state: ObservableState, timeMsec: number): void {
        this.stateHistory.push({ state, attrs: { timeMsec } });
        if (this.stateHistory.length == this.stateHistoryMaxLen) {
            this.stateHistory.shift();
        }
    }

    public get<T extends ObservableAttribute>(cls: Class<T>): T | undefined {
        return this.attributes.get(cls.prototype) as T;
    }

    public set<T extends ObservableAttribute>(value: T): void {
        this.attributes.set(value.constructor.prototype, value);
    }

    public del<T extends ObservableAttribute>(cls: Class<T>): void {
        this.attributes.delete(cls.prototype);
    }
}
