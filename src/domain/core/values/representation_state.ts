import { DomainValue } from "../value";

export class RepresentationState extends DomainValue {
    constructor(descr: string = '') {
        super(descr)
    }
}

export const RepresentationStateUnknown = new RepresentationState('unknown')
