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
	window.setTimeout(function(){
		$("#preloader-text").text(loadingSteps[1]);
		window.setTimeout(function(){
			$("#preloader-text").text(loadingSteps[2]);
			$("#preloader-wrapper").addClass("hidden");
			$("#app-wrapper").removeClass("hidden");
		}, 2000);
	}, 2000);


	var slider = new Slider();
	slider.init();
	var searchBar = new SearchBar();
	searchBar.init();
	var map = new Map();
	map.init();
	console.log("Main finished");
});
