import { Observable } from "../../core/entities/observable";

export class Container extends Observable {
    constructor(
        readonly image: string,
        ...args: ConstructorParameters<typeof Observable>
    ) {
        super(...args)
    }
}
