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
import { Intersector }from 'core/intersector';
import { GeojsonManager } from 'core/geojsonManager';
import { Data } from '../data/data';

$(document).ready(function() {

	var preloader = new Preloader();
	var disclaimer = new Disclaimer();
  var searchBar = new SearchBar();
  var slider = new Slider();
  var panel = new Panel();
  var mapObj = new Map();
  var intersector = new Intersector();
  var manager = new GeojsonManager(mapObj, intersector);

  // Connect composants between them with a specific handler
  var c0 = new Connector(preloader, disclaimer, "display");
  // Slider updates the data to display
  var c1 = new Connector(slider, manager, "updateCurrentGeojson");
  // Map interections need to be checked afterward
  var c2 = new Connector(mapObj, intersector, "checkIntersection");
  // Searchbar puts marker on map
  var c3 = new Connector(searchBar, mapObj, "enableReverseGeocoding");
  // Check result is finally displayed in the panel
  var c4 = new Connector(intersector, panel, "setPanel");


  // Get data with timing
  window.setTimeout(function() {
    Data.forEach(function(disease) {
      manager.diseaseToGeojsonFeature(disease);
    });
    preloader.nextStep();
    // Load danger zone with timing
    window.setTimeout(function() {
      manager.updateCurrentGeojson(slider.getYear());
      preloader.nextStep();
    }, 100);
  }, 3000);
});
