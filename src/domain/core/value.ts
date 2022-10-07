export class DomainValue {
    constructor(readonly value: number | string) {}

    toString(): string {
        return String(this.value);
    }
}
