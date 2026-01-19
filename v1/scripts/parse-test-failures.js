const fs = require('fs');

try {
    const data = fs.readFileSync('test-results.json', 'utf8');
    const results = JSON.parse(data);

    console.log(`\n📊 Total Tests: ${results.numTotalTests}`);
    console.log(`❌ Failed Tests: ${results.numFailedTests}\n`);

    if (results.numFailedTests > 0) {
        console.log('--- FAILURE REASONS ---\n');

        results.testResults.forEach(suite => {
            if (suite.status === 'failed') {
                suite.assertionResults.forEach(test => {
                    if (test.status === 'failed') {
                        console.log(`📁 File: ${suite.name}`);
                        console.log(`   Test: ${test.fullName}`);
                        console.log(`   Error: ${test.failureMessages.join('\n')}\n`);
                    }
                });
            }
        });
    }
} catch (e) {
    console.error('Error parsing JSON:', e);
}
