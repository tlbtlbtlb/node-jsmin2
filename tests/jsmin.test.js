var fs = require('fs'),
    assert = require('assert'),
    jsmin = require('../lib/jsmin'),
    testFilesDir = __dirname + '/test_files',
    expectedDir = __dirname + '/expected_files',
    jQuerySrc = fs.readFileSync(testFilesDir + '/jquery.js', 'utf8'),
    expectedJQuery = fs.readFileSync(expectedDir + '/jquery.min.js', 'utf8'),
    actualJQuery = jsmin(jQuerySrc);

// Assert that the minified jQuery matches the expected version
assert.strictEqual(expectedJQuery, actualJQuery, 'Minified jQuery does not match as expected.');

// Log success when done
console.log('Success!');