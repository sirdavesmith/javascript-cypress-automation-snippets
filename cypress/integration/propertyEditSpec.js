import propertySelectors from '../selectors/propertySelectors.json';
import { generatePropertyName, getSdk } from '../support/utils';
import roles from '../support/roles';

const companyId = Cypress.env('companyId');

function assertNavigatingToPropertiesList() {
  cy.location('pathname')
    .should('eq', `/companies/${companyId}/properties`);
}

describe('Property edit', function() {
  describe('with manage properties right', () => {
    before(() => {
      cy.logIn(roles.ADMIN);
    });

    it('creates a property', () => {
      // We made the decision to make the creation test the only one that tests the full workflow from
      // the list view to the edit view and back and that data on the list view updates appropriately.
      const propertyName = generatePropertyName();
      cy.visit(`/companies/${companyId}/properties`);

      cy.contains('New Property')
        .click();
      cy.get(propertySelectors.nameTextfield)
        .type(propertyName);
      cy.get(propertySelectors.domainTextfield)
        .type('example.com');
      cy.contains('Advanced Options')
        .click();
      cy.get(propertySelectors.undefinedVarsReturnEmptyCheckbox)
        .check();
      cy.get(propertySelectors.developmentCheckbox)
        .check();
      cy.contains('Save')
        .click();
      cy.listViewSearchByName(propertyName);
      cy.listViewGetRowsContainingName(propertyName);
    });

    describe('with property for editing', () => {
      let propertyId;
      let propertyName;

      beforeEach(() => {
        cy.then(() => {
          propertyName = generatePropertyName();
          return getSdk().createProperty(companyId, {
            attributes: {
              name: propertyName,
              domains: [
                'example.com',
                'example2.com'
              ],
              platform: 'web'
            },
            type: 'properties'
          });
        }).then((result) => {
          propertyId = result.data.id;
        });
      });

      it('displays a property', () => {
        cy.visit(`/companies/${companyId}/properties/${propertyId}/edit`);
        cy.breadcrumb()
          .contains('Edit Property');
        cy.contains('label', 'Name');
        cy.get(propertySelectors.nameTextfield)
          .should('have.attr', 'placeholder', 'Enter a name')
          .should('have.value', propertyName);
        cy.contains('label', 'Platform');
        cy.contains('Web');
        cy.get(propertySelectors.webPlatformButton)
          .should('have.class', 'is-selected')
          .should('be.disabled');
        cy.contains('Mobile');
        cy.get(propertySelectors.mobilePlatformButton)
          .should('not.have.class', 'is-selected')
          .should('be.disabled');
        cy.contains('label', 'Domains (no subdomains, paths, protocols, etc.)');
        cy.get(propertySelectors.domainTextfield)
          .first()
          .should('have.attr', 'placeholder', 'example.com')
          .should('have.value', 'example.com');
        cy.get(propertySelectors.domainTextfield)
          .last()
          .should('have.value', 'example2.com');
        cy.contains('Add Another');
        cy.contains('Advanced Options')
          .click();
        cy.contains('Return an empty string for undefined data elements');
        cy.get(propertySelectors.developmentCheckbox)
          .should('be.disabled');
        cy.contains('Cancel');
        cy.contains('Save');
      });

      it('edits a property', () => {
        cy.visit(`/companies/${companyId}/properties/${propertyId}/edit`);
        cy.get(propertySelectors.nameTextfield)
          .type(' Edited');
        cy.get(propertySelectors.domainRemoveButton)
          .first()
          .click();
        cy.contains('Add Another')
          .click();
        cy.get(propertySelectors.domainTextfield)
          .last()
          .type('example3.com');
        cy.contains('Advanced Options')
          .click();
        cy.get(propertySelectors.undefinedVarsReturnEmptyCheckbox)
          .check();
        cy.contains('Save')
          .click();
        assertNavigatingToPropertiesList();
        cy.then(() => {
          return getSdk().retrieveProperty(propertyId);
        }).then((result) => {
          expect(result.data.attributes.name).to.equal(`${propertyName} Edited`);
          expect(result.data.attributes.domains).to.eql([
            'example2.com',
            'example3.com'
          ]);
          expect(result.data.attributes.undefined_vars_return_empty).to.be.true;
        });
      });
    });
  });
});
