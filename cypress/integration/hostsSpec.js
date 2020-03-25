import {getSdk, isolateTestsToNewWebProperty} from '../support/utils';
import listViewSpec from './listViewSpec';
import roles from '../support/roles';

const companyId = Cypress.env('companyId');

describe('Hosts', function() {
  describe('with manage environments right', () => {
    before(() => {
      cy.logIn(roles.ADMIN);
    });

    isolateTestsToNewWebProperty((getPropertyId) => {
      describe('with hosts for sorting', () => {
        before(() => {
          cy.then(() => {
            return getSdk().createHost(getPropertyId(), {
              attributes: {
                name: 'Sort Host A',
                type_of: 'aws'
              },
              type: 'hosts'
            });
          }).then(() => {
            return getSdk().createHost(getPropertyId(), {
              attributes: {
                name: 'Sort Host C',
                type_of: 'aws'
              },
              type: 'hosts'
            });
          }).then(() => {
            return getSdk().createHost(getPropertyId(), {
              attributes: {
                name: 'Sort Host B',
                type_of: 'sftp',
                username: 'John Doe',
                encrypted_private_key: '...',
                server: '//example.com',
                path: 'assets',
                port: 22
              },
              type: 'hosts'
            });
          });

          return cy.visit(`/companies/${companyId}/properties/${getPropertyId()}/hosts`);
        });

        it('sorts by name', () => {
          cy.listViewSortByColumn('Name');
          cy.listViewVerifyItemOrder([
            'Sort Host A',
            'Sort Host B',
            'Sort Host C'
          ]);
          cy.listViewSortByColumn('Name');
          cy.listViewVerifyItemOrder([
            'Sort Host C',
            'Sort Host B',
            'Sort Host A'
          ]);
        });

        it('sorts by type', () => {
          cy.listViewSortByColumn('Type');
          cy.listViewGetRowsContainingName('Sort Host B')
            .invoke('index')
            .should('eq', 2);

          cy.listViewSortByColumn('Type');
          cy.listViewGetRowsContainingName('Sort Host B')
            .invoke('index')
            .should('eq', 0);
        });

        // Note that when we create an SFTP-based host, the backend will asynchronously test
        // the SFTP connection. In our case, the connection will fail because we're using bogus
        // SFTP settings. The backend then sets a failed status on the host, which changes
        // the host's last modified date. For this reason, we create the SFTP host last so
        // that we can get a consistent order when sorting by last modified.
        it('sorts by last modified', () => {
          cy.listViewSortByColumn('Last Modified');
          cy.listViewVerifyItemOrder([
            'Sort Host A',
            'Sort Host C',
            'Sort Host B'
          ]);
          cy.listViewSortByColumn('Last Modified');
          cy.listViewVerifyItemOrder([
            'Sort Host B',
            'Sort Host C',
            'Sort Host A'
          ]);
        });
      });
    });

    const listViewOptions = {
      testEnableDisable: false,
      createResource(propertyId, attributes) {
        return getSdk().createHost(propertyId, {
          attributes: Object.assign({
            type_of: 'aws'
          }, attributes),
          type: 'hosts'
        });
      },
      visitListView(propertyId) {
        // The sort querystring is necessary right now because hosts are not sorted by
        // name by default, which makes the pagination tests fail.
        return cy.visit(`/companies/${companyId}/properties/${propertyId}/hosts?sort=name`);
      },
      getResourceUrl(propertyId, hostId) {
        return `/companies/${companyId}/properties/${propertyId}/hosts/${hostId}`;
      }
    };

    listViewSpec(listViewOptions);
  });
});
