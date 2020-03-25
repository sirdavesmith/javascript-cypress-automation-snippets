import shortid from 'shortid';
import AppSdk from './sdk/appSDK';
import roles from './roles';
const backendHost = Cypress.env('backendHost');
const companyId = Cypress.env('companyId');
const clientId = Cypress.env('clientId');

before(() => {
  Cypress.env('runId', shortid.generate());
  cy.logIn(roles.ADMIN).then((accessToken) => {
    const sdk = new AppSdk(backendHost, accessToken);
    // We need to share this SDK instance with the spec files so that they can make requests to the server.
    Cypress.env('sdk', sdk);
    // This cleans up test properties older than one day.
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 1);
    return sdk.listProperties(companyId, {
      'filter[created_at]': `LT ${thresholdDate.toISOString()}`
    }).then((result) => {
      return Promise.all(result.data.map((property) => {
        return sdk.deleteProperty(property.id);
      }));
    });
  });
});
