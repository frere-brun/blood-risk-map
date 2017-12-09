import '../index.html';
import '../css/main.scss';

import { Slider } from 'core/slider';
import { SearchBar } from 'core/searchbar';
import { Map } from 'core/map';
import $ from 'jquery';




$(document).ready(function() {
	var loadingSteps = [
	      "Chargement de l'application",
	      "Récupération des données",
	      "Création de la zone de danger"
	  ];

	$("#preloader-text").text(loadingSteps[0]);
	var searchBar = new SearchBar();
	var slider = new Slider();
	var mapObj = new Map();
	slider.bindToMap(mapObj);

	$("#preloader-text").text(loadingSteps[1]);
	getData(slider.getYear(), mapObj, function(){
		$("#preloader-text").text(loadingSteps[2]);
		$("#preloader-wrapper").addClass("hidden");
		$("#app-wrapper").removeClass("hidden");
	});

	console.log("Main finished");
});


function getData(year, mapObj, cb) {
  // var url = year ? "/getGeojsonFromYear/"+year : "/getGeojson";
  var url = "/getGeojson";
  $.get(url, function(data, status){
    if (status !== 'success') {
      alert('An error has occured');
    }
    else if (status === 'success') {
      // Extract geojson and display it as layers
      mapObj.resetLayerSources();
			data.forEach(function(disease) {
				mapObj.diseaseToGeojsonFeature(disease);
			});
      mapObj.geojsonFeaturesToLayer(year);

			// Do some extra stuff if needed
			// ie: display map
			cb();
    }
    return status === "success"
  });
}