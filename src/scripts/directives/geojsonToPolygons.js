var addGeojson = function(map, geojson, currentYear) {

    var featuresCollections = [];

      for (var i in geojson) {
          if (isDeseaseActive(geojson[i].beginDate, geojson[i].endDate, currentYear)) {
            featuresCollections.push(map.data.addGeoJson(geojson[i].featuresCollection));
          }
      }

    return featuresCollections;
}

var removeGeojson = function(map, featuresCollections) {
  //console.log(map.data);
  for (var i = 0; i < featuresCollections.length; i++) {
    for (var y = 0; y < featuresCollections[i].length; y++) {
        map.data.remove(featuresCollections[i][y]);
    }
  }
  return [];
}

var updateGeojson = function(map, geojson, featuresCollections, currentYear) {
    featuresCollections = removeGeojson(map, featuresCollections);
    featuresCollections = addGeojson(map, geojson, currentYear);
    return featuresCollections;
}

// On recentre la map à la position donnée
// avec éventuellement un délais
//
// Spécificité mobile, on se téléporte au lieu de
// faire une transition smooth, pour des raisons 
// de fluidité
// =============================

var setMapCenter = function(map, position, delay, isMobile) {
    window.setTimeout(function() {
        if (isMobile)
            map.setCenter(position);
        else
            map.panTo(position);
    }, delay);
}


// Reset de la map à son état initial
// en vérifiant bien qu'elle soit déjà chargée
// =============================
var resetMap = function(map, isLoaded, options, isMobile) {
    console.log("resetMapInvoked");
    if (isLoaded) {
        map.setZoom(options.zoom);
        setMapCenter(map, options.center, 100, isMobile);
    }
}


var isDeseaseActive = function(beginDate, endDate, currentYear) {

      var startMoment = moment(beginDate, "DD-MM-YYYY");
      if (endDate)
        var endMoment = moment(endDate, "DD-MM-YYYY");
      var currentMoment = moment([currentYear]);
      var isActive = false;

      if (!endDate && !beginDate)
        isActive = true;
      if (!endDate && currentMoment.isAfter(startMoment))
        isActive = true;
      else if(endDate && currentMoment.isBetween(startMoment, endMoment))
        isActive = true;

    return isActive;

}

var setStyleToMap = function(map) {
    map.data.setStyle(function(feature) {
        var color = feature.getProperty('fillColor');
        //console.log(color);
        return {
            fillColor: color,
            strokeWeight: 0.5,
            fillOpacity: 0.2
        };
    });
}

var setStyleToData = function(geojson) {

    geojson.map(function(desease){

        var color = desease.color;
        //console.log(desease);

        desease.featuresCollection.features.map(function(feature){
            //console.log(feature);
            feature.properties.fillColor = color;
        });

    });
}

var arrayToPoly = function(google, arrayOfCoordinates) {
    var arrayOfLatLng = [];
    //console.log(arrayOfCoordinates);
    for (var key in arrayOfCoordinates)
    {
        //console.log(4);
        var latLng = {lat:arrayOfCoordinates[key][1], lng:arrayOfCoordinates[key][0]};
        arrayOfLatLng[key] = latLng;
    }

    polygon = new google.maps.Polygon({paths:arrayOfLatLng});
    return polygon;
}

var geojsonToPolygons = function(google, geojson) {
    var polygons = [];

    for(var key in geojson)
    {
        polygons[key] = [];
        for(var i in geojson[key].featuresCollection.features)
        {
            if (geojson[key].featuresCollection.features[i].geometry.type == "Polygon") {
                polygons[key].push(arrayToPoly(google, geojson[key].featuresCollection.features[i].geometry.coordinates[0]));
            }
            else if (geojson[key].featuresCollection.features[i].geometry.type == "MultiPolygon") {
                for (var y in geojson[key].featuresCollection.features[i].geometry.coordinates) {
                    polygons[key].push(arrayToPoly(google, geojson[key].featuresCollection.features[i].geometry.coordinates[y][0]));
                }
            }
        }
    }
    //console.log(polygons);
    return polygons;  
}


var isMarkerInBounds = function(google, marker, polygons, geojson, currentYear) {
    var response = {};
    response.isAdmissible = true;
    response.data = [];
    
    if (!marker)
        return response;

    var latLng =  new google.maps.LatLng(marker.position.lat, marker.position.lng);


    for(var i in polygons)
    {
        for(var key in polygons[i])
        {
            if (isDeseaseActive(geojson[i].beginDate, geojson[i].endDate, currentYear)) {
                if(google.maps.geometry.poly.containsLocation(latLng, polygons[i][key])) {
                   response.isAdmissible = false;
                   response.data.push({
                       name: geojson[i].name,
                       requiredTests: geojson[i].requiredTests,
                       duration: geojson[i].duration
                   });
                }
            }
        }
    }
    //console.log(response);
    return response;
}

