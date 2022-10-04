import { DomainValue } from "../value";

export class ObservableState extends DomainValue {
    constructor(descr: string = '') {
        super(descr)
    }
}

export const ObservableStateUnknown = new ObservableState('unknown')
