// Retrieve all users who starred a repository on github with CasperJS
// Configure the repository url below
// Run this bot with: casperjs --ssl-protocol=any 2_github_stargazers.js
// Check our awesome CasperJS cheatsheet: http://bit.ly/phantom-cheatsheet


// 1. Variables Initialization


var casper;
var $ = require('jquery');

var casper = require('casper').create({   
	    //verbose: true, 
		    logLevel: 'debug',
			pageSettings: {
         loadImages:  false,         // The WebPage instance used by Casper will
          loadPlugins: false,         // use these settings
           userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
}
});

url = 'http://www.croix-rouge.lu/les-contre-indications-au-don/';

casper.start(url);
casper.then(function() {
    this.echo('First Page: ' + this.getTitle());
});

casper.on('remote.message', function(msg) {
    this.echo('remote : ' + msg);
})

function getTables() {
	console.log("yayaya");
	var matchingElements = [];

    var tables = document.querySelectorAll('table');
	  for (var i = 0, n = tables.length; i < n; i++)
	  {
    	var thead = tables[i].querySelectorAll('tbody tr:nth-child(1) td').length;
	    if (parseInt(thead) >= 4)
	    {
	      matchingElements.push(tables[i].innerHTML);
	    }
	    else
	      matchingElements.push(" ");
	  }
	return matchingElements;
}

casper.then(function() {
    tables = this.evaluate(getTables);
	console.log("js", JSON.stringify(tables));

});

// 4. Run Casper

casper.run();
