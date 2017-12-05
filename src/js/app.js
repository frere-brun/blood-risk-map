import '../index.html';
import '../css/main.scss';

import { Slider } from 'core/slider';
import { SearchBar } from 'core/searchbar';
import { Map } from 'core/map';
import $ from 'jquery';


$(document).ready(function() {
	var slider = new Slider();
	slider.init();
	var searchBar = new SearchBar();
	searchBar.init();
	var map = new Map();
	map.init();
	console.log("Main finished");
});
