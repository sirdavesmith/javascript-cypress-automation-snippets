import listViewSelectors from '../../selectors/listViewSelectors.json';

function confirmStatusChangeMustBePublished() {
  // Just to make sure we're responding to the expected dialog.
  cy.dialogContent()
    .contains('must be published before they will take effect');

  cy.dialogFooter()
    .contains('OK')
    .click();
}

Cypress.Commands.add('listViewActions', () => {
  return cy.get(listViewSelectors.tableActions);
});

Cypress.Commands.add('listViewDeleteSelectedItems', () => {
  cy.listViewActions()
    .contains('Delete')
    .click();

  // Just to make sure we're responding to the expected dialog.
  cy.dialogHeader()
    .contains('Are you sure?');

  cy.dialogFooter()
    .contains('Yes, Delete them')
    .click()
    .should('be.disabled');
});

Cypress.Commands.add('listViewDisableSelectedItems', () => {
  cy.listViewActions()
    .contains('Disable')
    .click();

  confirmStatusChangeMustBePublished();
});

Cypress.Commands.add('listViewEnableSelectedItems', () => {
  cy.listViewActions()
    .contains('Enable')
    .click();

  confirmStatusChangeMustBePublished();
});

Cypress.Commands.add('listViewGetRowsContainingName', (name) => {
  cy.get(listViewSelectors.visibleTableLoader)
    .should('not.exist');
  // We use the jQuery :contains() selector here because it allows tests to do things like:
  // cy.listViewGetRowsContainingName('test').should('not.exist');
  return cy.get(`tbody > tr:contains('${name}')`);
});

Cypress.Commands.add('listViewSortByColumn', (columnName) => {
  // There's a timing issue between when the element is found and when it is clicked. This is a
  // hack to get it to work until Cypress fixes their detection logic at a more systemic level.
  // https://github.com/cypress-io/cypress/issues/695
  cy.get('thead')
    .contains(columnName)
    .as('columnHeader');
  cy.wait(0);
  cy.get('@columnHeader')
    .click({ force: true });
});

Cypress.Commands.add('listViewDeselectAllItems', () => {
  cy.get('tbody > tr [type="checkbox"]')
    .uncheck();
});

Cypress.Commands.add('listViewSelectItemsContainingName', (name, deselectOthers = true) => {
  if (deselectOthers) {
    cy.listViewDeselectAllItems();
  }

  cy.listViewGetRowsContainingName(name)
    .find('[type="checkbox"]')
    .check();
});

Cypress.Commands.add('listViewOpenItemContainingName', (name) => {
  // There's a timing issue between when the element is found and when it is clicked. This is a
  // hack to get it to work until Cypress fixes their detection logic at a more systemic level.
  // https://github.com/cypress-io/cypress/issues/695
  cy.listViewGetRowsContainingName(name)
    .as('row');
  cy.wait(0);
  cy.get('@row')
    .find('.reactView-Link')
    .click({ force: true });
});

Cypress.Commands.add('listViewSearchByName', (name) => {
  cy.get(listViewSelectors.searchTextfield)
    .should('have.attr', 'placeholder', 'Search')
    .clear()
    .type(`${name}{enter}`);
});

Cypress.Commands.add('listViewVerifyItemContainingNameIsDisabled', (name) => {
  cy.listViewGetRowsContainingName(name)
    .within(() => {
      cy.get(listViewSelectors.status.lightIcon.disabled);
      cy.get('[class="u-flex"]')
        .contains('Disabled');
    });
});

Cypress.Commands.add('listViewVerifyItemContainingNameIsEnabled', (name) => {
  cy.listViewGetRowsContainingName(name)
    .within(() => {
      cy.get(listViewSelectors.status.lightIcon.enabled);
      cy.get('[class="u-flex"]')
        .contains('Enabled');
    });
});

Cypress.Commands.add('listViewVerifyItemOrder', (names) => {
  names.forEach((name, index) => {
    cy.listViewGetRowsContainingName(name)
      .invoke('index')
      .should('eq', index);
  });
});
