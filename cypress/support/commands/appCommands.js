import appSelectors from '../../selectors/appSelectors.json';

// Get by selector
  Cypress.Commands.add('breadcrumb', () => {
    return cy.get(appSelectors.breadcrumb);
  });

  Cypress.Commands.add('companyBreadcrumb', () => {
    return cy.get(appSelectors.companyBreadcrumb);
  });

  Cypress.Commands.add('dialogHeader', () => {
    return cy.get(appSelectors.dialog.header);
  });

  Cypress.Commands.add('dialogContent', () => {
    return cy.get(appSelectors.dialog.content);
  });

  Cypress.Commands.add('dialogFooter', () => {
    return cy.get(appSelectors.dialog.footer);
  });

  Cypress.Commands.add('editContent', () => {
    return cy.get(appSelectors.editContent);
  });

  Cypress.Commands.add('editActions', () => {
    return cy.get(appSelectors.editActions);
  });

  /**
   * Gets the arrow button that opens the dropdown on a SplitButton
   */
  Cypress.Commands.add('getSplitButtonTrigger', (label) => {
    cy.contains(label)
      .closest('.reactView-SplitButton')
      .find('.reactView-SplitButton-trigger');
  });

  Cypress.Commands.add('heading', () => {
    return cy.get(appSelectors.heading);
  });

  Cypress.Commands.add('popover', () => {
    return cy.get(appSelectors.popover);
  });

  Cypress.Commands.add('tooltip', () => {
    return cy.get(appSelectors.tooltip);
  });

// Get by text or selector
  /**
   * Gets any reactView button containing the passed in text or selector
   */
  Cypress.Commands.add('actionButtonContains', {
    prevSubject: 'optional'
  }, (subject, content) => {
    if (subject) {
      return cy.wrap(subject).contains(appSelectors.actionButton, content);
    } else {
      return cy.contains(appSelectors.actionButton, content);
    }
  });

  /**
   * Gets any reactView button containing the passed in text or selector
   */
  Cypress.Commands.add('buttonContains', {
    prevSubject: 'optional'
  }, (subject, content) => {
    if (subject) {
      return cy.wrap(subject).contains(appSelectors.button, content);
    } else {
      return cy.contains(appSelectors.button, content);
    }
  });

  /**
   * Gets any reactView button containing the passed in text or selector
   */
  Cypress.Commands.add('clearButtonContains', {
    prevSubject: 'optional'
  }, (subject, content) => {
    if (subject) {
      return cy.wrap(subject).contains(appSelectors.clearButton, content);
    } else {
      return cy.contains(appSelectors.clearButton, content);
    }
  });

  /**
   * Gets any reactView button containing the passed in text or selector
   */
  Cypress.Commands.add('cycleButtonContains', {
    prevSubject: 'optional'
  }, (subject, content) => {
    if (subject) {
      return cy.wrap(subject).contains(appSelectors.cycleButton, content);
    } else {
      return cy.contains(appSelectors.cycleButton, content);
    }
  });

  /**
   * Gets any reactView button containing the passed in text or selector
   */
  Cypress.Commands.add('fieldButtonContains', {
    prevSubject: 'optional'
  }, (subject, content) => {
    if (subject) {
      return cy.wrap(subject).contains(appSelectors.fieldButton, content);
    } else {
      return cy.contains(appSelectors.fieldButton, content);
    }
  });

  /**
   * Gets any reactView list item containing the passed in text or selector
   */
  Cypress.Commands.add('listItemContains', {
    prevSubject: 'optional'
  }, (subject, content) => {
    if (subject) {
      return cy.wrap(subject).contains(appSelectors.listItem, content);
    } else {
      return cy.contains(appSelectors.listItem, content);
    }
  });

  /**
   * Gets any reactView button containing the passed in text or selector
   */
  Cypress.Commands.add('logicButtonContains', {
    prevSubject: 'optional'
  }, (subject, content) => {
    if (subject) {
      return cy.wrap(subject).contains(appSelectors.logicButton, content);
    } else {
      return cy.contains(appSelectors.logicButton, content);
    }
  });

  /**
   * Gets any reactView button containing the passed in text or selector
   */
  Cypress.Commands.add('splitButtonContains', {
    prevSubject: 'optional'
  }, (subject, content) => {
    if (subject) {
      return cy.wrap(subject).contains(appSelectors.splitButton, content);
    } else {
      return cy.contains(appSelectors.splitButton, content);
    }
  });

/**
 * Looks for the delegate iframe on the page, waits for it to load and the delegate view to initialize,
 * then returns the iframe's body element.
 */
Cypress.Commands.add('delegateIframe', (options = { focusWindow: true }) => {
  return cy.get(appSelectors.delegateIframe)
    .then(($iframe) => {
      return new Cypress.Promise(function(resolve) {
        function delegateViewInitialized() {
          // When the delegate iframe window receives focus, it notifies the frontend and the frontend marks the delegate as dirty.
          // Usually when interacting with elements inside the iframe using Cypress, it will automatically ensure
          // that the iframe's window receives focus, thereby causing the frontend to mark the delegate dirty as expected.
          // However, when the browser doesn't have focus, something prevents the iframe window from actually
          // receiving focus. The code below is intended to make tests run reliably when the testing browser does
          // not have focus by manually triggering a focus event on the iframe's window.
          if (options.focusWindow) {
            $iframe[0].contentWindow.dispatchEvent(new Event('focus'));
          }
          resolve($iframe.contents().find('body'));
        }

        // dataset.initialized gets set by the frontend after the delegate view is initialized.
        $iframe[0].dataset.initialized ? delegateViewInitialized() : $iframe.on('initialized', delegateViewInitialized);
      });
    });
});

/**
 * Determines whether a form field is showing a validation error.
 */
Cypress.Commands.add('showsValidationError', {prevSubject: 'element'}, (element, error) => {
  cy.wrap(element)
    .should('have.class', 'is-invalid')
    .trigger('mouseover');
  cy.tooltip()
    .contains(error);
});
