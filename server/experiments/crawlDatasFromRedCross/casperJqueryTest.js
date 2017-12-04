//Resource listener
function onResourceRequested(requestData, request) {
    if (/\/jquery\.min\.js/.test(requestData.url)) {
        currentRequest = requestData;
    }
}

casper.test.begin('JQuery Test', 1, {
    setUp: function() {
        // Attach the resource listener
        casper.on('resource.requested', onResourceRequested);
    },

    tearDown: function() {
        // Remove the resource listener
        casper.removeListener('resource.requested', onResourceRequested);
        currentRequest = undefined;
    },

    test: function(test) {
        casper.start('http://casperjs.org/', function() {
            test.assert(currentRequest !== undefined, "JQuery Exists");
        });

        casper.run(function() {
            test.done();
        });
    }
});