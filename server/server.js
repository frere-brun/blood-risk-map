var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var cors = require('cors');
var jsonfile = require('jsonfile');
var app = express();

var ressourcesUrl = __dirname + "/ressources/";
var dataFile = __dirname + "/ressources/data.json";
var jsonFilesUrl = __dirname + "/ressources/places/";
var geojsonFile = __dirname + "/ressources/generatedData.json";

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));
app.use(cors());

app.use('/', express.static(__dirname + '/../dist/'));
app.use("/vendor", express.static(__dirname + "/../dist/vendor"));
app.use("/bower_components", express.static(__dirname + "/../bower_components"));
app.use("/scripts", express.static(__dirname + "/../dist/scripts"));
app.use("/ressources", express.static(__dirname + "/../dist/ressources"));
app.use("/assets", express.static(__dirname + "/../dist/assets"));
app.use("/styles", express.static(__dirname + "/../dist/styles"));
app.use("/templates", express.static(__dirname + "/../dist/templates"));

app.get('/getGeojsonFromYear/:year', function(req,res) {

	var file = ressourcesUrl + req.params.year + ".json";
	jsonfile.readFile(file, function(err,obj) {
		if (err) {
			return res.send(404);
		}
		else {
			return res.send(200, obj);
		}
	});
});


app.get('/generateDeseases', function(req,res) {
	jsonfile.readFile(dataFile, function(err,deseases) {
		if (err) {
			console.log(err);
			return res.send(404);
		}
		else {

			deseases.map(function(desease) {

				var countryList = [];
				var countryStr = "";
				var featuresCollection = {
										type:"FeatureCollection",
										features:[]
									 };

				desease.featuresCollection = featuresCollection;

				for(var key in desease.places)
				{
					console.log(1);
					if (desease.places[key].file != null) {
						jsonfile.readFile(jsonFilesUrl + desease.places[key].file, function(err,obj) {
							if (err)
								console.log(err);
							else {
								console.log(obj[0]);
								desease.featuresCollection.features.push(obj[0]);
							}
						});
					}
				}

			});

			//return res.send(200, "fichier généré");

			setTimeout(function() {
				console.log(deseases.length);
				jsonfile.writeFile( ressourcesUrl + "generatedData.json",
									deseases,
									{spaces: 2},
									function(err) {
					console.error(err);
				});
				return res.send(200, "fichier généré");
			},200);
		}
	});
});

app.get('/getGeojson', function(req,res) {
	jsonfile.readFile(geojsonFile, function(err,obj) {
		if (err) {
			return res.send(404);
		}
		else {
			return res.send(200, obj);
		}
	});
});

app.all("/*", function(req, res, next) {
    res.sendfile("index.html", { root: __dirname + "/dist" });
});

// SAY HELLO

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
