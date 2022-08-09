// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')


// Here we define the selector priority for cypress.
// We use Cypress.SelectorPlayground.defaults within itself, in order to define two different selector priorities,
// depending on whether the element has the data-testid attribute.
// This is a little hacky, but works and is the most stable solution.
// Why this works can be founde here: https://github.com/cypress-io/cypress/blob/b6c4ba144cd6ae3d210789bbb69b9aacc6a92094/packages/driver/src/cypress/selector_playground.ts
// If in the future changes happen in cypress, that interfere with this approach, this solution must be changed.

Cypress.SelectorPlayground.defaults({
  // With onElement we can check whether the element has the data-testid attribute
  onElement: (el) => {
    if (el.attr('data-testid')) {
      // If it has the data-testid attribute then it should only use it in the selector priority.
      // This ensures that we get nice outputs in the cypress studio as we intended (hierarchy of data-testid elements).
      Cypress.SelectorPlayground.defaults({
        selectorPriority: ['data-testid'],
      })
    } else {
      // If it does not have it (eg. line up) we use all the available selector types to ensure that a unique selector is returned.
      Cypress.SelectorPlayground.defaults({
        selectorPriority: ['data-testid', 'data-cy', 'data-test', 'class', 'tag', 'attributes', 'nth-child', 'id'],
      })
    }
  },
})