try {
  stage('Cypress Testing') {
    parallel (
      'company and properties': {
        stage('company and properties') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/companyEditSpec.js,cypress/integration/propertiesSpec.js,cypress/integration/propertyEditSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-company-and-properties'
          }
        }
      },
      'data element edit': {
        stage('data element edit') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/dataElementEditSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-data-element-edit'
          }
        }
      },
      'data element selector': {
        stage('data element edit') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/dataElementSelectorSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-data-element-selector'
          }
        }
      },
      'data elements': {
        stage('data elements') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/dataElementsSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-data-elements'
          }
        }
      },
      'environments': {
        stage('environments') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/environmentEditSpec.js,cypress/integration/environmentsSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-environments'
          }
        }
      },
      'hosts': {
        stage('hosts') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/hostEditSpec.js,cypress/integration/hostsSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-hosts'
          }
        }
      },
      'library edit': {
        stage('library edit') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/libraryEditSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-library-edit'
          }
        }
      },
      'publishing web': {
        stage('publishing web') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/publishingWebSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-publishing-web'
          }
        }
      },
      'publishing mobile': {
        stage('publishing mobile') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/publishingMobileSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-publishing-mobile'
          }
        }
      },
      'regex and toasts': {
        stage('regex and toasts') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/regexTesterSpec.js,cypress/integration/toastsSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-regex-and-toasts'
          }
        }
      },
      'revision selector': {
        stage('revision selector') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/revisionSelectorSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-revision-selector'
          }
        }
      },
      'rule builder': {
        stage('rule builder') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/ruleBuilderSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-rule-builder'
          }
        }
      },
      'rules': {
        stage('rules') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/rulesSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-rules'
          }
        }
      },
     'upstream resources': {
        stage('upstream resources') {
          // npm is not installed on the jenkins slave so we must manually run the script
          node {
            checkoutToLocalBranch()

            sh (
              label: 'run cypress tests',
              script: 'CYPRESS_SPEC=cypress/integration/upstreamResourcesSpec.js BUILD_HTML=false ./cypress/ci-scripts/run-tests-isolated.sh'
            )
            stash includes: 'cypress-test-results/local/json/**,cypress-test-results/local/junit/**', name: 'testresult-upstream-resources'
          }
        }
      }
    )
  }
} finally {
  node {
    stage('Cypress Reporting') {
      checkoutToLocalBranch()

      // the folder here must be cleaned to avoid permission problems due to it being mounted previously in the docker containers.
      sh script: 'docker run --rm -v $(pwd)/cypress-test-results:/srv/app/cypress-test-results manual-docker-cypress-tests /bin/bash -c "rm -rf /srv/app/cypress-test-results/*"';
      sh script: 'rm -rf cypress-test-results'
      unstash 'testresult-company-and-properties'
      unstash 'testresult-compare-view'
      unstash 'testresult-data-element-edit'
      unstash 'testresult-data-element-selector'
      unstash 'testresult-data-elements'
      unstash 'testresult-environments'
      unstash 'testresult-hosts'
      unstash 'testresult-library-edit'
      unstash 'testresult-publishing-web'
      unstash 'testresult-publishing-mobile'
      unstash 'testresult-regex-and-toasts'
      unstash 'testresult-resource-copy'
      unstash 'testresult-revision-selector'
      unstash 'testresult-rule-builder'
      unstash 'testresult-rules'
      unstash 'testresult-upstream-resources'
      sh script: 'find cypress-test-results'
      sh script: 'docker run --rm -v $(pwd)/cypress-test-results:/srv/app/cypress-test-results manual-docker-cypress-tests /bin/bash -c "BRANCH=local /srv/app/cypress/ci-scripts/convert-test-results-to-html.sh"';

      publishHTML([
        allowMissing: false,
        alwaysLinkToLastBuild: false,
        keepAll: false,
        reportDir: 'cypress-test-results/local',
        reportFiles: 'index.html',
        reportName: 'Cypress_HTML_Report',
        reportTitles: ''
      ])
      junit (
        testResults: 'cypress-test-results/local/junit/**/*.xml'
      )

    }

    stage('Workspace Cleanup') {
    // this needs to be here for job re-runs since the workspace is reused
      sh script: 'docker run --rm -v $(pwd)/cypress-test-results:/srv/app/cypress-test-results manual-docker-cypress-tests /bin/bash -c "rm -rf /srv/app/cypress-test-results/*"';
      sh script: 'rm -rf ./cypress-test-results'
    }
  }
}
