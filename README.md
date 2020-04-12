# Cypress JavaScript Framework Snippets

Collection of snippets that suggest ideas for how a Cypress framework could look 

Note: These are just snippets for demo purposes - this project won't run

#### Assumptions
- These snippets were written for a [React](https://facebook.github.io/react/) + [Redux](http://redux.js.org/) app
- They would live in the same repo as the app under test
- JavaScript & Cypress + Docker, Jenkins, Promises, Babel, Mocha, ESLint

### General Suggestions
- Before developing [Cypress](https://www.cypress.io/) tests, I highly recommend reading their [core concepts](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#Cypress-Is-Simple) and [best practices](https://docs.cypress.io/guides/references/best-practices.html) documentation. 
- The framework should support multiple environments
- Write tests in a way that prevents them from stomping on each other in the same environment.
    - For example, engineers and a CI server could be running tests against the same environment at the same time.
    - One solution is property isolation combined with unique names.

#### Global Setup and Teardown Suggestions

Global setup and teardown could be done in `cypress/support/globalSetupAndTeardown.js`.

Before tests are run, you could log in as an admin user. Between each test, Cypress clears all web storage and cookies to help ensure that we're starting with a fresh state. Normally, this would force you to log in a user for every test since their access token is cleared from local storage. Instead, in the global setup and teardown logic could ensure that the access token gets restored to local storage before tests.

Before tests are run, you can have the global setup deletes all properties older than a day from a test environment. This would ensure that your keeping old data to a minimum while also ensuring (through the one day delay) you don't disturb simultaneous test runs against the same environment.

#### Element Selectors Suggestions

Rather than have element selectors scattered throughout tests, you should leverage cy.contains(). If a selector is needed, you could place them inside JSON files found in `cypress/selectors`. Rather than using selectors that depend on CSS classes, you would add `data-test-id` attributes to elements and use [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) instead. This helps engineers working on the UI realize when a test may break due to modifications of the DOM. There may be extenuating circumstances where you can't use a `data-test-id` and need to use some other selector instead.

#### Data Seeding Suggestions

As described in the [Cypress Best Practices guide](https://docs.cypress.io/guides/references/best-practices.html), tests should not depend on previous tests. Rather than using the UI to setup your data, you could seed data by sending requests directly to the APIs. This is could be an SDK like `cypress/support/sdk/appSDK.js`.

When seeding data, you should consider making requests in parallel when possible to keep tests fast.

#### Utilities Suggestion

Consider creating utilities that help when writing tests. You could put them in `cypress/support/utils.js`.
