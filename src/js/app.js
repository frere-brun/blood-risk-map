import '../index.html';
import '../css/main.scss';

import { Map } from 'core/map';
import { Panel } from 'core/panel';
import { Slider } from 'core/slider';
import { SearchBar } from 'core/searchbar';
import $ from 'jquery';




$(document).ready(function() {
	var loadingSteps = [
	      "Chargement de l'application",
	      "Récupération des données",
	      "Création de la zone de danger"
	  ];

	$("#preloader-text").text(loadingSteps[0]);
	var mapObj = new Map();
  var panel = new Panel();
  var slider = new Slider();
  var searchBar = new SearchBar();
  mapObj.setMapClick(panel);
	slider.bindToMap(mapObj);

	$("#preloader-text").text(loadingSteps[1]);
	getData(slider.getYear(), mapObj, panel, function(){
		$("#preloader-text").text(loadingSteps[2]);
		$("#preloader-wrapper").addClass("hidden");
		$("#app-wrapper").removeClass("hidden");
	});

	console.log("Main finished");
});


function getData(year, mapObj, panel, cb) {
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
      mapObj.geojsonFeaturesToLayer(year, panel);

			// Do some extra stuff if needed
			// ie: display map
			cb();
    }
    return status === "success"
  });
}