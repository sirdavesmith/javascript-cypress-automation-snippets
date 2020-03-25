import roles from '../support/roles';
import {getSdk, isolateTestsToNewWebProperty} from '../support/utils';
import shortid from 'shortid';
import hostSelectors from '../selectors/hostSelectors';

const companyId = Cypress.env('companyId');

function assertNavigatingToHostsList(propertyId) {
  cy.location('pathname')
    .should('eq', `/companies/${companyId}/properties/${propertyId}/hosts`);
}

describe('Host edit', () => {
  describe('with admin right', () => {
    before(() => {
      cy.logIn(roles.ADMIN);
    });

    isolateTestsToNewWebProperty((getPropertyId) => {
      it('creates an aws host when no hosts exist', function() {
        // We made the decision to make the creation test the only one that tests the full workflow from
        // the list view to the edit view and back and that data on the list view updates appropriately.
        const hostName = shortid();
        cy.visit(`/companies/${companyId}/properties/${getPropertyId()}/hosts`);

        cy.contains('Create New Host')
          .click();
        cy.contains('Save')
          .should('be.disabled');
        cy.get(hostSelectors.nameTextfield)
          .type(hostName);
        cy.get(hostSelectors.typeComboBoxButton)
          .click();
        cy.popover()
          .contains('Managed by Company')
          .click();
        cy.contains('Save')
          .click();
        cy.listViewGetRowsContainingName(hostName);
      });

      describe('with host for editing', () => {
        let hostId;
        let hostName;

        before(() => {
          cy.then(() => {
            hostName = shortid();
            return getSdk().createHost(getPropertyId(), {
              attributes: {
                name: hostName,
                type_of: 'aws'
              },
              type: 'hosts'
            });
          }).then((result) => {
            hostId = result.data.id;
          });
        });

        it('creates an SFTP host', function() {
          // We made the decision to make the creation test the only one that tests the full workflow from
          // the list view to the edit view and back and that data on the list view updates appropriately.
          const hostName = shortid();
          cy.visit(`/companies/${companyId}/properties/${getPropertyId()}/hosts`);

          cy.contains('Add Host')
            .click();
          cy.contains('Save')
            .should('be.disabled');
          cy.get(hostSelectors.nameTextfield)
            .type(hostName);
          cy.get(hostSelectors.typeComboBoxButton)
            .click();
          cy.popover()
            .contains('SFTP')
            .click();
          cy.get(hostSelectors.serverTextfield)
            .type('//example.com');
          cy.get(hostSelectors.pathTextfield)
            .type('assets');
          cy.get(hostSelectors.portTextfield)
            .type('22');
          cy.get(hostSelectors.usernameTextfield)
            .type('John Doe');
          cy.get(hostSelectors.encryptedPrivateKeyTextfield)
            .type('...');
          cy.contains('Save')
            .click();
          cy.contains('Pending');
          cy.contains('Failed'); //this is due to the SFTP host not being able to connect. The actual creation works.
          cy.buttonContains('Close')
            .click();
          cy.listViewGetRowsContainingName(hostName);
        });

        it('displays a host', () => {
          cy.visit(`/companies/${companyId}/properties/${getPropertyId()}/hosts/${hostId}`);
          cy.heading()
            .contains('Edit Host');
          cy.contains('label', 'Connection Status');
          cy.contains('Success');
          cy.contains('label', 'Name');
          cy.get(hostSelectors.nameTextfield)
            .should('have.attr', 'placeholder', 'Enter a name')
            .should('have.value', hostName);
          cy.contains('label', 'Type');
          cy.get(hostSelectors.typeComboBoxButton)
            .should('be.disabled')
            .contains('Managed by Company');
          cy.contains('Close');
          cy.contains('Save')
            .should('be.disabled');
        });

        it('edits a host', () => {
          cy.visit(`/companies/${companyId}/properties/${getPropertyId()}/hosts/${hostId}`);
          cy.contains('Save')
            .should('be.disabled');
          cy.get(hostSelectors.nameTextfield)
            .type(' Edited');
          cy.get(hostSelectors.typeComboBoxButton)
            .should('be.disabled');
          cy.contains('Save')
            .click();
          assertNavigatingToHostsList(getPropertyId());
          cy.then(() => {
            return getSdk().retrieveHost(hostId);
          }).then((result) => {
            expect(result.data.attributes.name).to.equal(`${hostName} Edited`);
          });
        });
      });
    });
  });
});
