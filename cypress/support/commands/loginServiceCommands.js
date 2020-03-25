import {
  cacheLocalStorageAuth,
  clearLocalStorageAuth
} from '../globalSetupAndTeardown';

const {
  baseUrl
} = Cypress.config();
const {
  host,
  servicesHost,
  clientId,
  clientScope
} = Cypress.env();

const cb = `https://${ host }/login_service/companyid/${ clientId }/CompanyID/token?` +
  `redirect_uri=${ baseUrl }?post-login=true`;
const deniedCallback = `https://${ host }/login_service/denied/${ clientId }`;

let loggedInRole;
let previousLoginPromise;

function getLogInError(error, username, password) {
  return new Error(`Logging in did not go as planned. Log in as the user manually ` +
    `(username: ${username} password: ${password}) to ensure the user isn't being asked for a ` +
    `phone number or something similar. Error: ${error?.message || error.toString()}`);
}

Cypress.Commands.add('logIn', (role) => {
  if (loggedInRole === role) {
    return previousLoginPromise;
  }

  const username = Cypress.env(`${role}Username`);
  const password = Cypress.env(`${role}Password`);

  Cypress.log({name: 'Log In', message: `Username: ${username} Password: ${password}`});

  clearLocalStorageAuth();

  const loginPromise = cy.request({
    method: 'POST',
    url: `https://${ servicesHost }/system-idprovider/pages/login.do`,
    headers: {
      Referer: `https://${ servicesHost }`,
    },
    form: true, // regular form body
    body: {
      callback: cb,
      client_id: clientId,
      denied_callback: deniedCallback,
      display: 'web_v2',
      flow_type: 'token',
      idp_flow_type: 'login',
      scope: clientScope,
      username,
      password,
    },
  }).then((response) => {
    let loginServiceRedirectUrl;
    const httpRedirectUrl = decodeURIComponent(/content="0;url=(.*)"/.exec(response.body)[1]);
    loginServiceRedirectUrl = httpRedirectUrl;

    return loginServiceRedirectUrl.indexOf(baseUrl) >= 0 ? cy.visit(loginServiceRedirectUrl) : cy.request({url: loginServiceRedirectUrl});
  }).then((result) => {
    const httpRedirectUrl = decodeURIComponent(/content="0;url=(.*)"/.exec(result.body)[1]);

    return cy.visit(httpRedirectUrl);
  }).then((window) => {
    cacheLocalStorageAuth();
    return window.userData.loginServiceAccessToken;
  });

  loggedInRole = role;
  previousLoginPromise = loginPromise;
  return loginPromise;
});
