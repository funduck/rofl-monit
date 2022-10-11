import { Container } from "../aggregates/container";
import { Id } from "../core/entity";
import { ContainerEvent } from "../events/container_events";
import { filterByContainerId } from "./filter_container_events";

function event(containerName: string) {
    return new ContainerEvent(Id<Container>(containerName));
}

describe("FilterContainerEvents", () => {
    test("should pass all", () => {
        for (const name of ["1", "abc", "my/container"])
            expect(filterByContainerId(".*")(event(name))).toBeTruthy();
    });

    test("should pass selected", () => {
        for (const name of ["abc", "12"])
            expect(
                filterByContainerId("(abc|^def|12$)")(event(name))
            ).toBeTruthy();
        for (const name of ["cdef", "123"])
            expect(
                filterByContainerId("(abc|^def|12$)")(event(name))
            ).toBeFalsy();
    });
});
