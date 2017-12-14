import '../index.html';
import '../css/main.scss';

import { Map } from 'core/map';
import { Panel } from 'core/panel';
import { Slider } from 'core/slider';
import { SearchBar } from 'core/searchbar';
import { Connector } from 'core/connector';
import $ from 'jquery';
import { Data } from '../data/data';

$(document).ready(function() {
	var loadingSteps = [
    "Chargement de l'application",
    "Récupération des données",
    "Création de la zone de danger"
  ];

  // Objects initialization
	$("#preloader-text").text(loadingSteps[0]);
	var mapObj = new Map();
  var panel = new Panel();
  var slider = new Slider();
  var searchBar = new SearchBar();

  // Connect composants between them with a specific handler
  var c1 = new Connector(slider, mapObj, "geojsonFeaturesToLayer");
  slider.bindToMap();
  var c2 = new Connector(mapObj, panel, "setPanel");
  mapObj.setMapClick();

  // Retrieve data and load actual data
	$("#preloader-text").text(loadingSteps[1]);
	getData(slider.getYear(), mapObj, function(){
		$("#preloader-text").text(loadingSteps[2]);
		$("#preloader-wrapper").addClass("hidden");
		$("#app-wrapper").removeClass("hidden");
	});

	console.log("Main finished");
});


function getData(year, mapObj, cb) {

	Data.forEach(function(disease) {
		mapObj.diseaseToGeojsonFeature(disease);
	});
  mapObj.geojsonFeaturesToLayer(year);
	cb();

	// $.get(url, function(data, status){
  //   if (status !== 'success') {
  //     alert('An error has occured');
  //   }
  //   else if (status === 'success') {
  //     // Extract geojson and display it as layers
	// 		data.forEach(function(disease) {
	// 			mapObj.diseaseToGeojsonFeature(disease);
	// 		});
  //     mapObj.geojsonFeaturesToLayer(year);
  //
	// 		// Do some extra stuff if needed
	// 		// ie: display map
	// 		cb();
  //   }
  //   return status === "success"
  // });
}
