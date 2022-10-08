import { ObservableAttribute } from "../values/observable_attribute";
import { Observable } from "./observable";

describe("Observable", () => {
    test("should set, get, del attribute", () => {
        const obs = new Observable();
        class Attr extends ObservableAttribute {}
        const attr = new Attr(42);
        obs.set(attr);
        expect(obs.get(Attr)).toBe(attr);
        obs.del(Attr);
        expect(obs.get(Attr)).toBe(undefined);
    });
});
