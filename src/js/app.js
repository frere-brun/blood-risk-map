import '../index.html';
import '../css/main.scss';
import $ from 'jquery';

import { Map } from 'core/map';
import { Panel } from 'core/panel';
import { Slider } from 'core/slider';
import { SearchBar } from 'core/searchbar';
import { Preloader } from 'core/preloader';
import { Disclamer } from 'core/disclamer';
import { Connector } from 'core/connector';
import { Data } from '../data/data';

$(document).ready(function() {

	var preloader = new Preloader();
	var disclamer = new Disclamer();
	var mapObj = new Map();
  var panel = new Panel();
  var slider = new Slider();
  var searchBar = new SearchBar();

	preloader.init();
	disclamer.init();

  // Connect composants between them with a specific handler
  var c1 = new Connector(slider, mapObj, "geojsonFeaturesToLayer");
  slider.bindToMap();
  var c2 = new Connector(mapObj, panel, "setPanel");
  mapObj.setMapClick();

	getData(slider.getYear(), mapObj, function(){
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
