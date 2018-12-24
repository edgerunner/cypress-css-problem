import { render } from "react-dom";

import React from "react";
import { Provider } from "react-redux";

import configureMockStore from "redux-mock-store";
const mockStore = configureMockStore();

Cypress.Commands.add("mount", (component, state) => {
    cy.get("body", { log: false }).then((body) => {
        body[0].innerText="";
        const container = document.createElement("div");
        container.setAttribute("id", "cypress");
        body[0].appendChild(container);
        render(
            state
                ? <Provider store={mockStore(state)}>{component}</Provider>
                : component,
            container);
        return container;
    });
    Cypress.log({
        message: component.type.displayName,
        consoleProps: () => ({ Component: component }),
    });
});
