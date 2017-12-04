/*

  MAIN

*/


var loadingSteps = [
    "Chargement de l'application",
    "Récupération des données",
    "Création de la zone de danger"
];
var rangeOptions = {
  'step': '1',
  'min': '2000',
  'max': (new Date()).getFullYear().toString(),
  'value': (new Date()).getFullYear().toString()
}

/* App Loading */
$("#preloader-text").text(loadingSteps[0]);

// html init
Object.entries(rangeOptions).forEach(function([key, val]) {
  $("#rangeInput").attr(key, val);
});
$("#rangeInput").on('change input', function(e) {
  $("#year").text(this.value)
  if (e.type === 'change') {
    // Compute geojson layers based on the year
    geojsonFeaturesToLayer();

    /*
      Future :
      The server would probably serve a new set of geojson data according to the date
      cf : "/getGeojsonFromYear/"+year
    */
  }
});

// Leaflet init
var mymap = L.map('map', { zoomControl:false }).setView([27, 5.6279968], 2); // Original : .setView([48.6857475, 5.6279968], 2);
var tileLayerUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
var tileLayerOptions = {
  maxZoom: 18,
  attribution: 'Going to be offline attributions soon....' +
    'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets'
}
L.tileLayer(tileLayerUrl, tileLayerOptions).addTo(mymap);
var geojsonLayer = L.layerGroup();
var geojsonLayerSources = [];
var marker = null;



/* Get back data and start */
$("#preloader-text").text(loadingSteps[1]);
getData(null, function(){
  $("#preloader-wrapper").addClass("hidden");
  $("#app-wrapper").removeClass("hidden");
});


/*

  FUNCTIONS

*/

function getData(year, cb) {
  var url = year ? "/getGeojsonFromYear/"+year : "/getGeojson";
  $.get(url, function(data, status){
    if (status !== 'success') {
      alert('An error has occured');
    }
    else if (status === 'success') {
      // Extract geojson and display it as layers
      geojsonLayerSources = [];
      data.forEach(function(disease) {
        diseaseToGeojsonFeature(disease);
      });
      geojsonFeaturesToLayer();

      // Do some extra stuff if needed
      // ie: display map
      cb();
    }
    return status === "success"
  });
}

function diseaseToGeojsonFeature(disease) {
  // console.log('disease', disease.color, disease)
  // Get Geojson objects and put additional data for convenience
  if (disease.featuresCollection && disease.featuresCollection.features) {
    disease.featuresCollection.features.forEach(function(geojsonFeature) {
      geojsonFeature.properties['color'] = disease.color;
      geojsonFeature.properties['diseaseName'] = disease.name;
      geojsonFeature.properties['diseaseBeginDate'] = disease.beginDate;
      geojsonFeature.properties['diseaseEndDate'] = disease.endDate;
      geojsonFeature.properties['diseaseDuration'] = disease.duration;
      geojsonFeature.properties['dieseaseRequiredTests'] = disease.requiredTests;

      // Without the tilemap (gridVector)
      // geojsonLayerSources.push(geojsonFeature);
    });

    // With a gridVector
    geojsonLayerSources.push(disease)
  }
}

function geojsonFeaturesToLayer() {
  // Remove the old geojsonLayer
  if (mymap.hasLayer(geojsonLayer)) {
    mymap.removeLayer(geojsonLayer);
    geojsonLayer = null;
  }

  // Create the list of geojson layers
  var layers = [];

  // Without the tilemap (gridVector)
  // geojsonLayerSources.forEach(function(feature) {
  //    var l = L.geoJSON(feature, {style: , filter:, onEachFeature:, ...)
  //    layers.push(l)
  // });

  // Solution for a gridVector implementation
  geojsonLayerSources.forEach(function(disease) {
    if (displayDisease(disease.beginDate, disease.endDate)) {
      // https://leaflet.github.io/Leaflet.VectorGrid/vectorgrid-api-docs.html#vectorgrid
      // unwrapping automatic of a { type: featureCollection, features: Array} object
      var features = disease.featuresCollection;
      var l = L.vectorGrid.slicer(features, {
        interactive: true,
        rendererFactory: L.svg.tile,
        vectorTileLayerStyles: {
          sliced: diseaseStyle,
        },
      });

      l.on('click', function(e) {
        var properties = e.layer.properties;
        console.log('You just clicked on ', properties.sovereignt, e.latlng);
        $("#admissiblity").text('Non admissible');
        $("#diseaseName").text(properties.diseaseName)
        $("#diseaseDuration").text(properties.diseaseDuration)
        $("#dieseaseRequiredTests").text(properties.dieseaseRequiredTests)
        $("#notAdmissible").removeClass("hidden");

        // Event is triggered so stop it
        L.DomEvent.stopPropagation(e);
        putMarker(e.latlng);
      })
      layers.push(l);
    }
  });

  // Push the list to a layer group and then add it to the map
  geojsonLayer = L.layerGroup(layers);
  mymap.addLayer(geojsonLayer);
}

function diseaseStyle(properties, zoom) {
  return {
    fillColor: properties.color,
    fillOpacity: 0.5,
    stroke: true,
    fill: true,
    color: 'black',
    weight: 0,
  }
}

function coordsToLatLng(coords) {
  // find a way to wrap around the geojson data
  var lat = coords[1];
  var lng = coords[0];
  return L.latLng(lat, lng);
}

// Filter function to display a geojson feature
function displayFeature(feature) {
  var currentYear = $("#rangeInput").val();
  if (feature.properties.diseaseBeginDate) {
    var beginYear = feature.properties.diseaseBeginDate.split('-')[2];
    var isAfter = beginYear <= currentYear;

    if (feature.properties.diseaseEndDate) {
      var endYear = feature.properties.diseaseEndDate.split('-')[2];
      var isBefore = currentYear <= endYear;
      return isAfter && isBefore;
    }
    return isAfter;
  }
  return false;
}

// filter to display a geojson disease
function displayDisease(beginDate, endDate) {
  var currentYear = $("#rangeInput").val();
  if (beginDate) {
    var beginYear = beginDate.split('-')[2];
    var isAfter = beginYear <= currentYear;

    if (endDate) {
      var endYear = endDate.split('-')[2];
      var isBefore = currentYear <= endYear;
      return isAfter && isBefore;
    }
    return isAfter;
  }
  return false;
}


function onEachFeature(feature, layer) {
  if (feature.properties && feature.properties.sovereignt) {
    layer.on('click', function(e) {
      console.log('You just clicked on ', feature.properties.sovereignt, e.latlng);
      $("#admissiblity").text('Non admissible');
      $("#diseaseName").text(feature.properties.diseaseName)
      $("#diseaseDuration").text(feature.properties.diseaseDuration)
      $("#dieseaseRequiredTests").text(feature.properties.dieseaseRequiredTests)
      $("#notAdmissible").removeClass("hidden");

      // Event is triggered so stop it
      L.DomEvent.stopPropagation(e);
      putMarker(e.latlng);
    });
  }
}

function onMapClick(e) {
  console.log('You just clicked on ', e.latlng);

  // Event not triggered before, so it doesn't belong to any layer
  $("#admissiblity").text('Admissible');
  $("#diseaseName").text('')
  $("#diseaseDuration").text('')
  $("#dieseaseRequiredTests").text('')
  $("#notAdmissible").addClass("hidden");
  putMarker(e.latlng);
}
mymap.on('click', onMapClick);

function putMarker(latlng) {
  if(marker === null) {
    marker =  L.marker(latlng).addTo(mymap);
  } else {
    marker.setLatLng(latlng);
  }
  marker.addTo(mymap);
}
