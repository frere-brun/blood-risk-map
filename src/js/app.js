import '../index.html';
import '../css/main.scss';
import $ from 'jquery';

import { Map } from 'core/map';
import { Panel } from 'core/panel';
import { Slider } from 'core/slider';
import { SearchBar } from 'core/searchbar';
import { Preloader } from 'core/preloader';
import { Disclaimer } from 'core/disclaimer';
import { Connector } from 'core/connector';
import { Data } from '../data/data';

$(document).ready(function() {

	var preloader = new Preloader();
	var disclaimer = new Disclaimer();
	var mapObj = new Map();
  var panel = new Panel();
  var slider = new Slider();
  var searchBar = new SearchBar();
  
  // Connect composants between them with a specific handler
  var c0 = new Connector(preloader, disclaimer, "display");
  var c1 = new Connector(slider, mapObj, "geojsonFeaturesToLayer");
  slider.bindToMap();
  var c2 = new Connector(searchBar, mapObj, "enableReverseGeocoding");
  var c3 = new Connector(mapObj, panel, "setPanel");
  mapObj.setMapClick();


  // Get data with timing
  window.setTimeout(function() {
    Data.forEach(function(disease) {
      mapObj.diseaseToGeojsonFeature(disease);
    });
    preloader.nextStep();

    // Load danger zone with timing
    window.setTimeout(function() {
      mapObj.geojsonFeaturesToLayer(slider.getYear());
      preloader.nextStep();
      // console.log("Main finished");
    }, 100);
  }, 100);
});