var express = require('express');
var app = express();
var http = require('http');
var jsonfile = require('jsonfile');
const path = require( 'path' );
var geojsonFile = path.join( __dirname, 'server/ressources/generatedData.json' );

app.set('port', (process.env.PORT || 5000));

app.get("/", function(req, res, next) {
    console.log('return default')
    res.sendfile("index.html", { root: __dirname + "/build" });
});


// url requested by webpack-dev-server in dev mode
// --> see webpack/config.js: devServer options
app.get('/getGeojson', function(req, res, next) {
  console.log('return /getGeojson', geojsonFile)
  jsonfile.readFile(geojsonFile, function(err,obj) {
    if (err) {
      return res.send(404);
    }
    else {
      return res.send(200, obj);
    }
  });
});

// SAY HELLO
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
