import listViewSelectors from '../selectors/listViewSelectors.json';
import {isolateTestsToNewWebProperty} from '../support/utils';

function testPagination(options) {
  isolateTestsToNewWebProperty((getPropertyId) => {
    describe('list view pagination', () => {
      before(() => {
        cy.then(() => {
          const creationPromises = [];

          for (let i = 0; i < 21; i++) {
            const letter = String.fromCharCode(65 + i);
            creationPromises.push(options.createResource(getPropertyId(), {
              name: `Pagination Resource ${letter}`
            }));
          }

          return Promise.all(creationPromises);
        });
      });

      it('navigates through pages', () => {
        let pushStateSpy;
        options.visitListView(getPropertyId());
        cy.window().then((win) => {
          pushStateSpy = cy.spy(win.history, 'pushState');
        });
        cy.get(listViewSelectors.previousResultsButton)
          .should('be.disabled');
        cy.get(listViewSelectors.nextResultsButton)
          .should('not.be.disabled');
        cy.get(listViewSelectors.nextResultsButton)
          .click();
        cy.listViewGetRowsContainingName('Pagination Resource K');
        cy.get(listViewSelectors.previousResultsButton)
          .should('not.be.disabled');
        cy.get(listViewSelectors.nextResultsButton)
          .should('not.be.disabled');
        cy.get(listViewSelectors.nextResultsButton)
          .click();
        cy.listViewGetRowsContainingName('Pagination Resource U');
        cy.get(listViewSelectors.previousResultsButton)
          .should('not.be.disabled');
        cy.get(listViewSelectors.nextResultsButton)
          .should('be.disabled');
        cy.get(listViewSelectors.previousResultsButton)
          .click();
        cy.listViewGetRowsContainingName('Pagination Resource K');
        cy.get(listViewSelectors.previousResultsButton)
          .should('not.be.disabled');
        cy.get(listViewSelectors.nextResultsButton)
          .should('not.be.disabled');
        cy.get(listViewSelectors.previousResultsButton)
          .click();
        cy.listViewGetRowsContainingName('Pagination Resource A');
        cy.get(listViewSelectors.previousResultsButton)
          .should('be.disabled');
        cy.get(listViewSelectors.nextResultsButton)
          .should('not.be.disabled');
        cy.then(()=>{
          // Navigating to a new page of data should not create a browser history step.
          expect(pushStateSpy).to.not.be.called;
        });
      });

      it('navigates user to new last page if resources on last page are deleted', () => {
        options.visitListView(getPropertyId());
        cy.get(listViewSelectors.nextResultsButton)
          .click();
        cy.listViewGetRowsContainingName('Pagination Resource K');
        cy.get(listViewSelectors.nextResultsButton)
          .click();
        cy.listViewSelectItemsContainingName('Pagination Resource U');
        cy.listViewDeleteSelectedItems();
        cy.listViewGetRowsContainingName('Pagination Resource K');
        cy.get(listViewSelectors.nextResultsButton)
          .should('be.disabled');
      });
    });
  });
}

function testFiltering(options) {
  isolateTestsToNewWebProperty((getPropertyId) => {
    describe('list view filtering', () => {
      before(() => {
        cy.then(() => {
          const creationPromises = [];

          for (let i = 0; i < 3; i++) {
            creationPromises.push(options.createResource(getPropertyId(), {
              name: `Fruit ${i + 1}`
            }));
          }

          for (let i = 0; i < 3; i++) {
            creationPromises.push(options.createResource(getPropertyId(), {
              name: `Vegetable ${i + 1}`
            }));
          }

          return Promise.all(creationPromises);
        });
        options.visitListView(getPropertyId());
      });

      it('shows results matching search text', () => {
        let pushStateSpy;
        cy.window().then((win) => {
          pushStateSpy = cy.spy(win.history, 'pushState');
        });
        cy.get(listViewSelectors.searchTextfield)
          .type('Vegetable');
        cy.listViewGetRowsContainingName('Fruit')
          .should('not.exist');
        cy.listViewGetRowsContainingName('Vegetable 1');
        cy.listViewGetRowsContainingName('Vegetable 2');
        cy.listViewGetRowsContainingName('Vegetable 3');
        cy.then(()=>{
          // Filtering data should not create a browser history step.
          expect(pushStateSpy).to.not.be.called;
        });
      });

      it('shows no results', () => {
        let pushStateSpy;
        cy.window().then((win) => {
          pushStateSpy = cy.spy(win.history, 'pushState');
        });
        cy.get(listViewSelectors.searchTextfield)
          .type('nomatch');
        cy.contains('No results based on your chosen filters.');
        cy.then(() => {
          // Filtering data should not create a browser history step.
          expect(pushStateSpy).to.not.be.called;
        });
      });
    });
  });
}

function testSelection(options) {
  isolateTestsToNewWebProperty((getPropertyId) => {
    describe('list view selection', () => {
      before(() => {
        cy.then(() => {
          const creationPromises = [];

          for (let i = 0; i < 3; i++) {
            creationPromises.push(options.createResource(getPropertyId(), {
              name: `Selection Resource ${i + 1}`
            }));
          }

          return Promise.all(creationPromises);
        }).then(() => {
          return options.visitListView(getPropertyId());
        });
      });

      it('toggles all rows when "select all" checkbox is toggled', () => {
        cy.get(listViewSelectors.rowCheckbox)
          .should('be.length', 3);
        cy.get(listViewSelectors.selectAllCheckbox)
          .click();
        cy.get(listViewSelectors.rowCheckbox)
          .each(($checkbox) => {
            expect($checkbox).to.be.checked;
          });
        cy.get(listViewSelectors.selectAllCheckbox)
          .click();
        cy.get(listViewSelectors.rowCheckbox)
          .each(($checkbox) => {
            expect($checkbox).not.to.be.checked;
          });
      });

      it('toggles the "select all" checkbox when row checkboxes are toggled', () => {
        cy.get(listViewSelectors.rowCheckbox)
          .should('be.length', 3)
          .click({multiple: true});
        cy.get(listViewSelectors.selectAllCheckbox)
          .should('be.checked');
        cy.get(listViewSelectors.rowCheckbox)
          .last()
          .uncheck();
        cy.get(listViewSelectors.selectAllCheckbox)
          .should('not.be.checked');
      });
    });
  });
}

function testEnableDisable(options) {
  isolateTestsToNewWebProperty((getPropertyId) => {

    describe('list view enable/disable', () => {
      before(() => {
        cy.then(() => {
          return Promise.all([
            options.createResource(getPropertyId(), {
              name: 'Resource To Disable',
              enabled: true
            }),
            options.createResource(getPropertyId(), {
              name: 'Resource To Enable',
              enabled: false
            })
          ]);
        }).then(() => {
          return options.visitListView(getPropertyId());
        });
      });

      it('disables the resource', () => {
        cy.listViewSelectItemsContainingName('Resource To Disable');
        cy.listViewDisableSelectedItems();
        cy.listViewVerifyItemContainingNameIsDisabled('Resource To Disable');
      });

      it('enables the resource', () => {
        cy.listViewSelectItemsContainingName('Resource To Enable');
        cy.listViewEnableSelectedItems();
        cy.listViewVerifyItemContainingNameIsEnabled('Resource To Enable');
      });
    });
  });
}

function testDelete(options) {
  isolateTestsToNewWebProperty((getPropertyId) => {
    describe('list view delete', () => {
      before(() => {
        cy.then(() => {
          return options.createResource(getPropertyId(), {
            name: 'Resource To Delete'
          });
        }).then(() => {
          return options.createResource(getPropertyId(), {
            name: 'Resource To Delete 2'
          });
        }).then(() => {
          return options.visitListView(getPropertyId());
        });
      });

      it('deletes resource', () => {
        cy.listViewSelectItemsContainingName('Resource To Delete')
          .listViewDeleteSelectedItems();
        cy.contains('Resource To Delete')
          .should('not.exist');
      });
    });
  });
}

function testOpen(options) {
  isolateTestsToNewWebProperty((getPropertyId) => {
    describe('list view open', () => {
      let resourceId;

      before(() => {
        cy.then(() => {
          return options.createResource(getPropertyId(), {
            name: 'Resource To Open'
          });
        }).then((result) => {
          resourceId = result.data.id;
        });
        options.visitListView(getPropertyId());
      });

      it('opens resource', () => {
        cy.listViewOpenItemContainingName('Resource To Open');
        cy.location('pathname')
          .should('eq', options.getResourceUrl(getPropertyId(), resourceId));
      });
    });
  });
}

/**
 * Tests common list view functionality.
 * @param options
 * @param options.createResource A function that creates a single resource. Will be provided
 * a property ID.
 * @param options.visitListView A function that visits the resource list view. Will be provided
 * a property ID.
 * @param [options.getResourceUrl] A function that provide the URL to a resource's edit view.
 * Will be provided a property ID and a resource ID. Only required when testing opening.
 * @param [options.testPagination=true] Whether pagination should be tested.
 * @param [options.testFiltering=true] Whether filtering should be tested.
 * @param [options.testSelection=true] Whether selection should be tested.
 * @param [options.testEnableDisable=true] Whether enable/disable should be tested.
 * @param [options.testDelete=true] Whether delete should be tested.
 * @param [options.testOpen=true] Whether open should be tested.
 */
export default (options) => {
  describe('common list view functionality', () => {
    if (options.testPagination !== false) {
      testPagination(options);
    }

    if (options.testFiltering !== false) {
      testFiltering(options);
    }

    if (options.testSelection !== false) {
      testSelection(options);
    }

    if (options.testEnableDisable !== false) {
      testEnableDisable(options);
    }

    if (options.testDelete !== false) {
      testDelete(options);
    }

    if (options.testOpen !== false) {
      testOpen(options);
    }
  });
};

export const namesForFiltering = [
  'Fruit 1',
  'Vegetable 2',
  'Fruit 3',
  'Vegetable 4',
  'Fruit 5',
  'Vegetable 6'
];
