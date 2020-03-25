// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const path = require('path');
const fs = require('fs');

module.exports = (on, config) => {
  // Due to https://github.com/cypress-io/cypress/issues/1951
  // Without it, Chrome throws a cross-origin error.
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.name === 'chrome') {
      args.push('--disable-site-isolation-trials');
      // whatever you return here becomes the new args
      return args;
    }
  });

  const file = config.env.configFile || 'qe';
  const pathToConfigFile = path.resolve(__dirname, '..', 'config', `${file}.json`);
  return JSON.parse(fs.readFileSync(pathToConfigFile));
};
