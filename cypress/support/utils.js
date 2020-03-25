import shortid from 'shortid';
import {
  createGenericWebTesterExtension,
} from './webTesterExtensionUtils';

const companyId = Cypress.env('companyId');

export function getSdk() {
  // This environment variable is set at runtime. See globalSetupAndTeardown.js for more info.
  return Cypress.env('sdk');
}

export function generatePropertyNameRunPrefix() {
  return `Run:${Cypress.env('runId')}`;
}

export function generatePropertyName() {
  return `${generatePropertyNameRunPrefix()} Prop:${shortid.generate()}`;
}

function isolateTestsToNewProperty(createProperty, type, getPropertyIdsCallback) {
  describe(`with new ${type} property`, () => {
    let propertyId;
    let testerExtensionId;

    before(() => {
      cy.then(() => {
        return createProperty();
      }).then(({propertyResult, testerExtensionResult}) => {
        propertyId = propertyResult.data.id;
        testerExtensionId = testerExtensionResult.data.id;
      });
    });

    getPropertyIdsCallback && getPropertyIdsCallback(
      function getPropertyId() {
        if (propertyId) {
          return propertyId;
        } else {
          throw new Error('Property hasn\'t been created yet. It\'s generated in a before() function.');
        }
      },
      function getTesterExtensionId() {
        if (testerExtensionId) {
          return testerExtensionId;
        } else {
          throw new Error('Tester extension hasn\'t been created yet. It\'s generated in a before() function.');
        }
      }
    );
  });
}

export function isolateTestsToNewWebProperty(getPropertyIdsCallback) {
  isolateTestsToNewProperty(createGenericWebProperty, 'web', getPropertyIdsCallback);
}

// These generic resource creation functions are utilities rather than commands because commands
// can't be run in parallel. For efficiency, our tests sometimes need to create many generic
// resources in parallel, so we can't use commands for this.
// https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html

export function createGenericWebProperty({
  development = false,
  installTesterExtension = true
} = {}) {
  return getSdk().createProperty(companyId, {
    attributes: {
      name: generatePropertyName(),
      domains: [
        'example.com'
      ],
      development,
      platform: 'web'
    },
    type: 'properties'
  }).then((propertyResult)=>{
    return (
      installTesterExtension ?
      Promise.all([propertyResult, createGenericWebTesterExtension(propertyResult.data.id)]) :
      [propertyResult]
    );
  }).then(([propertyResult, testerExtensionResult])=>{
    return installTesterExtension ? {
      propertyResult,
      testerExtensionResult
    } : {
      propertyResult
    };
  });
}

export function createGenericHost(propertyId, name = 'Generic Host') {
  return getSdk().createHost(propertyId, {
    attributes: {
      name,
      type_of: 'aws'
    },
    type: 'hosts'
  });
}

export function createGenericEnvironment(propertyId, hostId, name = 'Generic Environment') {
  return getSdk().createEnvironment(propertyId, {
    attributes: {
      name
    },
    relationships: {
      host: {
        data: {
          id: hostId,
          type: 'hosts'
        }
      }
    },
    type: 'environments'
  });
}
