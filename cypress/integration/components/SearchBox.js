import React from "react";

import SearchBox from "../../../src/components/SearchBox";

import "../../support/mount";

describe("<SearchBox>", () => {
    function renderProp({ s, e }) {
        return (
            <span className="test">
                <strong>{s}</strong>
                <em>{e}</em>
            </span>
        );
    }
    const results = [
        { s: "Foo", e: "Bar" },
        { s: "Ford", e: "Focus" },
    ];

    it("calls the search engine with the search term when typed into", () => {
        cy.mount(<SearchBox engine={cy.spy(() => []).as("engine")} />);

        cy.get(".search-box").find("input").type("Foo");

        cy.get("@engine").should("be.calledWith", "Foo");
    });

    it("displays the results from the engine as a list", () => {
        cy.mount(<SearchBox engine={() => ["Bar", "Baz"]} />);

        cy.get(".search-box").find("input").type("Foo");

        cy.get(".search-results").should("contain", "Bar");
    });

    it("does not display the list if the engine returns empty", () => {
        cy.mount(<SearchBox engine={() => []} />);

        cy.get(".search-box").find("input").type("Foo");

        cy.get(".search-results").should("not.exist");
    });

    it("fires the select event when a result is selected", () => {
        cy.mount(<SearchBox
            engine={() => ["Bar", "Baz"]}
            onSelect={cy.stub().as("select")}/>);

        cy.get(".search-box").find("input").type("Foo");
        cy.get(".search-results").contains("Baz").click();

        cy.get("@select").should("be.calledWith", "Baz");
    });

    it("injects the className prop into the same for the root element", () => {
        cy.mount(<SearchBox className="test"/>);

        cy.get(".search-box").should("have.class", "test");
    });

    it("renders results with the given render prop", () => {
        function test() { return <span className="test">Test</span>; }
        cy.mount(<SearchBox engine={() => ["Bar", "Baz"]} render={test}/>);

        cy.get(".search-box").find("input").type("Foo");

        cy.get("span.test");
    });

    it("passes results to the given render prop", () => {
        cy.mount(<SearchBox engine={() => results} render={renderProp}/>);

        cy.get(".search-box").find("input").type("Foo");

        cy.get("span.test strong").first().should("have.text", "Foo");
        cy.get("span.test strong").last().should("have.text", "Ford");
        cy.get("span.test em").first().should("have.text", "Bar");
        cy.get("span.test em").last().should("have.text", "Focus");
    });

    it("shows no results if the search is empty", () => {
        cy.mount(<SearchBox engine={() => ["Bar", "Baz"]} />);

        cy.get(".search-box").find("input").type("Foo").clear();

        cy.get(".search-results").should("not.exist");
    });

    it("shows no results after selecting", () => {
        cy.mount(<SearchBox engine={() => ["Bar", "Baz"]} onSelect={cy.stub()} />);

        cy.get(".search-box > input").type("Ba");
        cy.get(".search-box *").contains("Baz").click();

        cy.get(".search-results").should("not.exist");
        cy.get(".search-box").should("not.have.class", "results");
    });

    it("replaces search term with the selected string result", () => {
        cy.mount(<SearchBox engine={() => ["Bar", "Baz"]} onSelect={cy.stub()} />);

        cy.get(".search-box > input").type("Ba");
        cy.get(".search-box *").contains("Baz").click();

        cy.get(".search-box > input").should("have.prop", "value", "Baz");
    });

    it("replaces search input with the rendered selected object", () => {
        cy.mount(<SearchBox engine={() => results} render={renderProp} onSelect={cy.stub()}/>);

        cy.get(".search-box > input").type("Fo");
        cy.get(".search-box *").contains("Ford").click();

        cy.get(".search-box > input").should("not.exist");
        cy.get(".search-box span.test strong").should("have.text", "Ford");
        cy.get(".search-box span.test em").should("have.text", "Focus");
    });

    it("restores the search input when the rendered selection is clicked", () => {
        cy.mount(<SearchBox engine={() => results} render={renderProp} onSelect={cy.stub()}/>);

        cy.get(".search-box > input").type("Fo");
        cy.get(".search-box *").contains("Ford").click();
        cy.get(".search-box span.test strong").click();

        cy.get(".search-box > input").should("have.prop", "value", "Fo");
    });

    it("shows the previously selected object as a result when the input is restored", () => {
        cy.mount(<SearchBox engine={() => results} render={renderProp} onSelect={cy.stub()}/>);

        cy.get(".search-box > input").type("Fo");
        cy.get(".search-box *").contains("Ford").click();
        cy.get(".search-box span.test strong").click();

        cy.get(".search-results span.test strong").last().should("have.text", "Ford");
        cy.get(".search-results span.test em").last().should("have.text", "Focus");
    });

    it("shows the selected value passed in the prop", () => {
        cy.mount(
            <SearchBox
                engine={() => results}
                render={renderProp}
                onSelect={cy.stub()}
                selected={{ s: "Foo", e: "Bar" }}
            />);

        cy.get(".search-box > input").should("not.exist");
        cy.get(".search-box span.test strong").should("have.text", "Foo");
        cy.get(".search-box span.test em").should("have.text", "Bar");
    });

    it("prefers the user-selected value over the selected prop", () => {
        cy.mount(
            <SearchBox
                engine={() => results}
                render={renderProp}
                onSelect={cy.stub()}
                selected={{ s: "Foo", e: "Bar" }}
            />);

        cy.get(".search-box span.test").click();
        cy.get(".search-box > input").type("Fo");
        cy.get(".search-box *").contains("Ford").click();

        cy.get(".search-box .selected span.test strong").last().should("have.text", "Ford");
        cy.get(".search-box .selected span.test em").last().should("have.text", "Focus");
    });
});
