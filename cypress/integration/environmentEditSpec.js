import environmentSelectors from '../selectors/environmentSelectors.json';

import {
  createGenericHost,
  getSdk,
  isolateTestsToNewWebProperty
} from '../support/utils';
import shortid from 'shortid';
import roles from '../support/roles';

const companyId = Cypress.env('companyId');

function createNewEnvironment(environmentName) {
  if (environmentName === 'Development') {
    cy.contains('Create New Environment')
      .click();
  } else {
    cy.contains('Add Environment')
      .click();
  }
  cy.contains(environmentName)
    .parent()
    .contains('Select')
    .click();
  cy.get(environmentSelectors.nameTextfield)
    .type(environmentName);
  cy.get(environmentSelectors.hostComboBox)
    .click();
  cy.popover()
    .contains('Generic Host 1')
    .click();
  cy.contains('Save')
    .click();
  cy.contains('Save')
    .should('be.disabled');
  cy.dialogHeader()
    .contains('Web Install Instructions');
  cy.dialogFooter()
    .contains('Close')
    .click();
  cy.listViewGetRowsContainingName(environmentName);
}

function assertNavigatingToEnvironmentsList(propertyId) {
  cy.location('pathname')
    .should('eq', `/companies/${companyId}/properties/${propertyId}/environments`);
}

describe('Environment edit', function() {
  describe('with admin right', () => {
    before(() => {
      cy.logIn(roles.ADMIN);
    });

    isolateTestsToNewWebProperty((getPropertyId) => {
      let host1Id;
      let host2Id;

      describe('with new hosts', () => {
        before(() => {
          cy.then(() => {
            return Promise.all([
              createGenericHost(getPropertyId(), 'Generic Host 1'),
              createGenericHost(getPropertyId(), 'Generic Host 2')
            ]);
          }).then((results) => {
            host1Id = results[0].data.id;
            host2Id = results[1].data.id;
          });
        });

        it('creates all 3 environment types', () => {
          // We made the decision to make the creation test the only one that tests the full workflow from
          // the list view to the edit view and back and that data on the list view updates appropriately.
          cy.visit(`/companies/${companyId}/properties/${getPropertyId()}/environments`);

          createNewEnvironment('Development');
          createNewEnvironment('Staging');
          createNewEnvironment('Production');
          cy.listViewGetRowsContainingName('Development');
          cy.listViewGetRowsContainingName('Staging');
          cy.listViewGetRowsContainingName('Production');

          // checks if staging and production buttons are disabled when creating new environment
          cy.contains('Add Environment')
            .click();
          cy.contains('Staging')
            .parent()
            .contains('Select')
            .should('be.disabled');
          cy.contains('Production')
            .parent()
            .contains('Select')
            .should('be.disabled');
        });

        describe('with environment for editing', () => {
          let environmentId;
          let environmentName;

          beforeEach(() => {
            cy.then(() => {
              environmentName = shortid();

              return getSdk().createEnvironment(getPropertyId(), {
                attributes: {
                  name: environmentName
                },
                relationships: {
                  host: {
                    data: {
                      id: host1Id,
                      type: 'hosts'
                    }
                  }
                },
                type: 'environments'
              });
            }).then((result) => {
              environmentId = result.data.id;
            });
          });

          it('displays an environment', () => {
            cy.visit(`/companies/${companyId}/properties/${getPropertyId()}/environments/${environmentId}`);
            cy.heading()
              .contains('Edit Development Environment');
            cy.contains('label', 'Name');
            cy.get(environmentSelectors.nameTextfield)
              .should('have.attr', 'placeholder', 'Enter a name')
              .should('have.value', environmentName);
            cy.contains('label', 'Select Host');
            cy.get(environmentSelectors.hostComboBox)
              .click();
            cy.popover()
              .contains('Generic Host 1')
              .click();
            cy.contains('label', 'Create archive');
            cy.contains('Close');
            cy.contains('Save');
          });

          it('edits an environment', () => {
            cy.visit(`/companies/${companyId}/properties/${getPropertyId()}/environments/${environmentId}`);
            cy.contains('Save')
              .as('save')
              .should('be.disabled');
            cy.get(environmentSelectors.nameTextfield)
              .type(' Edited');
            cy.get(environmentSelectors.hostComboBox)
              .click();
            cy.popover()
              .contains('Generic Host 2')
              .click();
            cy.contains('Save')
              .click();
            cy.dialogHeader()
              .contains('Web Install Instructions');
            cy.dialogFooter()
              .contains('Close')
              .click();
            assertNavigatingToEnvironmentsList(getPropertyId());
            cy.then(() => {
              return getSdk().retrieveEnvironment(environmentId);
            }).then((result) => {
              expect(result.data.attributes.name).to.equal(`${environmentName} Edited`);
              expect(result.data.relationships.host.data.id).to.equal(host2Id);
            });
          });
        });
      });
    });
  });
});
