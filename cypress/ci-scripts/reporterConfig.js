
module.exports = {
  'reporterEnabled': 'mocha-junit-reporter, mochawesome',
  'mochaJunitReporterReporterOptions': {
    'mochaFile': 'cypress-test-results/' + process.env.BRANCH + '/junit/junit.[hash].xml'
  },
  'mochawesomeReporterOptions': {
    'reportDir': 'cypress-test-results/' + process.env.BRANCH + '/json',
    'overwrite': false,
    'html': false,
    'json': true,
    'timestamp': true
  }
};
