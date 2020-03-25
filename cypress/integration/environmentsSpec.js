import {namesForFiltering} from './listViewSpec.js';

import {
  createGenericHost,
  createGenericEnvironment,
  getSdk,
  isolateTestsToNewWebProperty
} from '../support/utils';
import listViewSpec from './listViewSpec';
import roles from '../support/roles';

const companyId = Cypress.env('companyId');


describe('Environments', function() {
  describe('with admin right', () => {
    before(() => {
      cy.logIn(roles.ADMIN);
    });

    isolateTestsToNewWebProperty((getPropertyId) => {
      describe('with environments for filtering', () => {
        before(() => {
          cy.then(() => {
            return createGenericHost(getPropertyId());
          }).then((result) => {
            return Promise.all(namesForFiltering.map((name) => {
              return createGenericEnvironment(
                getPropertyId(),
                result.data.id,
                name
              );
            }));
          });
        });

        it('retains list view filter when coming back from environment editor', () => {
          cy.visit(`/companies/${companyId}/properties/${getPropertyId()}/environments`);
          cy.listViewSearchByName('Vegetable');
          cy.listViewOpenItemContainingName('Vegetable 2');
          cy.contains('Close')
            .click();
          cy.listViewGetRowsContainingName('Vegetable')
            .should('have.length', 3);
          cy.listViewGetRowsContainingName('Fruit')
            .should('have.length', 0);
        });
      });
    });

    isolateTestsToNewWebProperty((getPropertyId) => {
      describe('with environments for sorting', () => {
        before(() => {
          cy.then(() => {
            return createGenericHost(getPropertyId());
          }).then((result) => {
            const relationships = {
              host: {
                data: {
                  id: result.data.id,
                  type: 'hosts'
                }
              }
            };

            return getSdk().createEnvironment(getPropertyId(), {
              attributes: {
                name: 'Sort Environment A',
                stage: 'production'
              },
              relationships,
              type: 'environments'
            }).then(() => {
              return getSdk().createEnvironment(getPropertyId(), {
                attributes: {
                  name: 'Sort Environment C',
                  stage: 'staging'
                },
                relationships,
                type: 'environments'
              });
            }).then(() => {
              return getSdk().createEnvironment(getPropertyId(), {
                attributes: {
                  name: 'Sort Environment B',
                  stage: 'development'
                },
                relationships,
                type: 'environments'
              });
            });
          });

          cy.visit(`/companies/${companyId}/properties/${getPropertyId()}/environments`);
        });

        it('sorts by name', () => {
          cy.listViewSortByColumn('Name');
          cy.listViewVerifyItemOrder([
            'Sort Environment A',
            'Sort Environment B',
            'Sort Environment C'
          ]);
          cy.listViewSortByColumn('Name');
          cy.listViewVerifyItemOrder([
            'Sort Environment C',
            'Sort Environment B',
            'Sort Environment A'
          ]);
        });

        it('sorts by last modified', () => {
          cy.listViewSortByColumn('Last Modified');
          cy.listViewVerifyItemOrder([
            'Sort Environment A',
            'Sort Environment C',
            'Sort Environment B'
          ]);
          cy.listViewSortByColumn('Last Modified');
          cy.listViewVerifyItemOrder([
            'Sort Environment B',
            'Sort Environment C',
            'Sort Environment A'
          ]);
        });

        it('sorts by environment', () => {
          cy.listViewSortByColumn('Environment');
          cy.listViewVerifyItemOrder([
            'Sort Environment B',
            'Sort Environment A',
            'Sort Environment C'
          ]);
          cy.listViewSortByColumn('Environment');
          cy.listViewVerifyItemOrder([
            'Sort Environment C',
            'Sort Environment A',
            'Sort Environment B'
          ]);
        });
      });
    });

    const hostPromiseByPropertyId = {};

    const listViewOptions = {
      testEnableDisable: false,
      createResource(propertyId, attributes) {
        let hostPromise = hostPromiseByPropertyId[propertyId];

        if (!hostPromise) {
          hostPromiseByPropertyId[propertyId] = hostPromise = createGenericHost(propertyId);
        }

        return hostPromise.then((result) => {
          return getSdk().createEnvironment(propertyId, {
            attributes,
            relationships: {
              host: {
                data: {
                  id: result.data.id,
                  type: 'hosts'
                }
              }
            },
            type: 'environments'
          });
        });
      },
      visitListView(propertyId) {
        return cy.visit(`/companies/${companyId}/properties/${propertyId}/environments?sort=name`);
      },
      getResourceUrl(propertyId, environmentId) {
        return `/companies/${companyId}/properties/${propertyId}/environments/${environmentId}`;
      }
    };

    listViewSpec(listViewOptions);
  });
});
