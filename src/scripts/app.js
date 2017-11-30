var loadingSteps = [
    "Chargement de l'application",
    "Récupération des données",
    "Création de la zone de danger"
];

/* App Loading */
$("#preloader-text").text(loadingSteps[0]);

/* Leaflet initialization */
var mymap = L.map('map').setView([48.6857475, 5.6279968], 2);
var tileLayerUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
L.tileLayer(tileLayerUrl, {
  maxZoom: 18,
  attribution: 'Going to be offline attributions soon....' +
    'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(mymap);
var marker = null;



/* Get back data */
$("#preloader-text").text(loadingSteps[1]);
$.get("/getGeojson", function(data, status){
  // '/getGeojsonFromYear/:year'

  if (status !== 'success') {
    alert('An error has occured');
  } 
  else if (status === 'success') {
    /* Final setup */
    $("#preloader-text").text(loadingSteps[2]);
    data.forEach(function(disease) {
      diseaseToLayer(disease);
    });

    /* Go ! */
    $("#preloader-wrapper").addClass("hidden");
    $("#app-wrapper").removeClass("hidden");
  }
  return status === "success"
});


function diseaseToLayer(disease) {
  console.log('disease', disease)
  var diseaseStyle = {
    "color": disease.color
  };
  // Get Geojson objects and create specific geoJSON Leaflet layer
  if (disease.featuresCollection && disease.featuresCollection.features) {
    disease.featuresCollection.features.forEach(function(geojsonFeature) {
      // Put additional data into the feature props
      geojsonFeature.properties['diseaseName'] = disease.name;
      geojsonFeature.properties['diseaseBeginDate'] = disease.beginDate;
      geojsonFeature.properties['diseaseEndDate'] = disease.endDate;
      geojsonFeature.properties['diseaseDuration'] = disease.duration;
      geojsonFeature.properties['dieseaseRequiredTests'] = disease.requiredTests;

      L.geoJSON(geojsonFeature, {
        style: diseaseStyle,
        onEachFeature: onEachFeature
      }).addTo(mymap);
    });
  }
}

function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.sovereignt) {
    layer.on('click', function(e) {
      console.log('You just clicked on ', feature.properties.sovereignt);
      $("#admissiblity").text('Non admissible');
      $("#diseaseName").text(feature.properties.diseaseName)
      $("#diseaseDuration").text(feature.properties.diseaseDuration)
      $("#dieseaseRequiredTests").text(feature.properties.dieseaseRequiredTests)
      $("#notAdmissible").removeClass("hidden");
    });
  }
}



function onMapClick(e) {
  console.log('You just clicked on ', e);
  if(marker === null) {
    marker =  L.marker(e.latlng).addTo(mymap);
  } else {
    marker.setLatLng(e.latlng);
  }
  marker.addTo(mymap);
}
mymap.on('click', onMapClick);



/*
var app = angular.module('app', ['ngAutocomplete', 'mobileDetect', 'searchActive', 'forceTouchUI', 'trustHtmlFilter', 'idle', 'cutFilter', 'toggleTouchActive', 'toggleActive', 'inputFocus', 'resize', 'toggleHeight', 'ui.router', 'ngMap']);

app.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $urlRouterProvider.when('', '/');
    $locationProvider.hashPrefix('!');
    moment.locale('fr', {
      months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
      monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
      weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
      weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
      weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
      longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
      },
      calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
      },
      relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "une année",
        yy : "%d ans"
      },
      ordinalParse : /\d{1,2}(er|ème)/,
      ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'ème');
      },
      meridiemParse: /PD|MD/,
      isPM: function (input) {
        return input.charAt(0) === 'M';
      },
      // in case the meridiem units are not separated around 12, then implement
      // this function (look at locale/id.js for an example)
      // meridiemHour : function (hour, meridiem) {
      //     return /* 0-23 hour, given meridiem token and hour 1-12 
      // },
      meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
      },
      week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
      }
    });
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/templates/home.html',
            controller: 'homeCtrl',
            resolve: {
                 optionsProvider: function ($q, Options) {
                     return Options.getData();
                 },
                 geojsonProvider: function ($q, Geojson) {
                     return Geojson.getData();
                 }
            }
        });
});

app.run(function($rootScope, $timeout) {

    $rootScope.isMapLoaded = false;

    var loadingSteps = [
        "Chargement de l'application",
        "Récupération des données",
        "Création de la zone de danger"
    ];

    $("#preloader-text").text(loadingSteps[1]);

    $rootScope.$watch('isMapLoaded', function () {

        if ($rootScope.isMapLoaded) {
            
            $("#preloader-text").text(loadingSteps[2]);
            
            $timeout(function(){
                $("#preloader-wrapper").addClass("hidden");
                $("#app-wrapper").removeClass("hidden");
            }, 1500);
        }
      });
});*/