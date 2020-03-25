#!/bin/bash
# this is meant to be run from root dir

echo "converting test results to html..."
echo "BRANCH=$BRANCH"

ls -al cypress-test-results/$BRANCH/json
mkdir -p cypress-test-results/$BRANCH/json &&
mkdir -p cypress-test-results/$BRANCH/combined-json &&
npx mochawesome-merge@1.0.7 --reportDir cypress-test-results/$BRANCH/json > cypress-test-results/$BRANCH/combined-json/mochawesome.json &&
npx mochawesome-report-generator@3.1.5 -f index.html cypress-test-results/$BRANCH/combined-json/mochawesome.json --no-showPassed --no-showPending --reportDir cypress-test-results/$BRANCH
