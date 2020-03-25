import appSelectors from '../selectors/appSelectors.json';
import listViewSelectors from '../selectors/listViewSelectors.json';
import {generatePropertyName, getSdk} from '../support/utils';
import roles from '../support/roles';

const companyId = Cypress.env('companyId');
const companyName = Cypress.env('companyName');

describe('Properties', function() {
  describe('with admin right', () => {
    before(() => {
      cy.logIn(roles.ADMIN);
    });

    it('has list view elements', () => {
      cy.visit(`/companies/${companyId}/properties`);

      cy.breadcrumb()
        .contains('Properties');
      cy.companyBreadcrumb()
        .contains(companyName);
      cy.contains('Name');
      cy.contains('Platform');
      cy.contains('Status');
      cy.contains('New Property');
      // Needs Hover for Tooltip
      cy.get(appSelectors.leftRail.companiesIcon);
      // Needs Hover for Tooltip
      cy.get(appSelectors.leftRail.propertiesIcon);
      // Needs Hover for Tooltip
      cy.get(appSelectors.leftRail.auditEventsIcon);
      cy.contains('Next');
      cy.get(listViewSelectors.previousResultsButton);
    });

    describe('with property', () => {
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
          }).then((result) => {
            propertyId = result.data.id;
          });
        });

        cy.visit(`/companies/${companyId}/properties`);
      });

      it('deletes a property', () => {
        cy.listViewSearchByName(propertyName)
          .listViewSelectItemsContainingName(propertyName)
          .listViewDeleteSelectedItems()
          .listViewGetRowsContainingName(propertyName)
          .should('not.exist');
      });

      it('opens property', () => {
        cy.listViewSearchByName(propertyName)
          .listViewOpenItemContainingName(propertyName);
        cy.location('pathname')
          .should('eq', `/companies/${companyId}/properties/${propertyId}`);
      });
    });
  });
});
