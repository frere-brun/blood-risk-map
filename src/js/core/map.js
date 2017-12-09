import L from 'leaflet';
import $ from 'jquery';
import {vectorGrid} from 'leaflet.vectorgrid';

class Map {
  constructor() {
    this.mymap = null;
    this.mapElt = 'map';
    this.mapOptions = { zoomControl:false };
    this.tileLayerUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    this.tileLayerOptions = {
      maxZoom: 18,
      attribution: 'Going to be offline attributions soon....' +
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    };

    this.geojsonLayer = L.layerGroup();
    this.geojsonLayerSources = [];
    this.marker = null;

    this.panel = {
      admissiblity: $("#admissiblity"),
      diseaseName: $("#diseaseName"),
      diseaseDuration: $("#diseaseDuration"),
      dieseaseRequiredTests: $("#dieseaseRequiredTests"),
      notAdmissible: $("#notAdmissible"),
    }

    this.mymap = L.map(this.mapElt, { zoomControl:false }).setView([27, 5.6279968], 2); // Original : .setView([48.6857475, 5.6279968], 2);
    L.tileLayer(this.tileLayerUrl, this.tileLayerOptions).addTo(this.mymap);
    var self = this;
    this.mymap.on('click', function(e) {

      console.log('You just clicked on ', e.latlng);

      // Event not triggered before, so it doesn't belong to any layer
      self.panel.admissiblity.text('Admissible');
      self.panel.diseaseName.text('')
      self.panel.diseaseDuration.text('')
      self.panel.dieseaseRequiredTests.text('')
      self.panel.notAdmissible.addClass("hidden");
      self.putMarker(e.latlng);
    });
  }

  diseaseToGeojsonFeature(disease) {
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
      this.geojsonLayerSources.push(disease);
    }
  }


  geojsonFeaturesToLayer(year) {
    // Remove the old geojsonLayer
    var self = this;
    if (this.mymap && this.mymap.hasLayer(this.geojsonLayer)) {
      this.mymap.removeLayer(this.geojsonLayer);
      self.geojsonLayer = null;
    }

    // Create the list of geojson layers
    var layers = [];

    // Without the tilemap (gridVector)
    // geojsonLayerSources.forEach(function(feature) {
    //    var l = L.geoJSON(feature, {style: , filter:, onEachFeature:, ...)
    //    layers.push(l)
    // });
    // Solution for a gridVector implementation
    this.geojsonLayerSources.forEach(function(disease) {
      if (self.displayDisease(year, disease.beginDate, disease.endDate)) {
        // https://leaflet.github.io/Leaflet.VectorGrid/vectorgrid-api-docs.html#vectorgrid
        // unwrapping automatic of a { type: featureCollection, features: Array} object
        var features = disease.featuresCollection;
        var l = L.vectorGrid.slicer(features, {
          interactive: true,
          rendererFactory: L.svg.tile,
          vectorTileLayerStyles: {
            sliced: self.diseaseStyle,
          },
        });

        l.on('click', function(e) {
          var properties = e.layer.properties;
          console.log('You just clicked on ', properties.sovereignt, e.latlng);
          self.panel.admissiblity.text('Non admissible');
          self.panel.diseaseName.text(properties.diseaseName)
          self.panel.diseaseDuration.text(properties.diseaseDuration)
          self.panel.dieseaseRequiredTests.text(properties.dieseaseRequiredTests)
          self.panel.notAdmissible.removeClass("hidden");

          // Event is triggered so stop it
          L.DomEvent.stopPropagation(e);
          self.putMarker(e.latlng);
        })
        layers.push(l);
      }

      
    });

    // Push the list to a layer group and then add it to the map
    this.geojsonLayer = L.layerGroup(layers);

    if (this.mymap) {
      this.mymap.addLayer(this.geojsonLayer);
    }
  }

  diseaseStyle(properties, zoom) {
    return {
      fillColor: properties.color,
      fillOpacity: 0.5,
      stroke: true,
      fill: true,
      color: 'black',
      weight: 0,
    }
  }

  coordsToLatLng(coords) {
    // find a way to wrap around the geojson data
    var lat = coords[1];
    var lng = coords[0];
    return L.latLng(lat, lng);
  }

  // Filter function to display a geojson feature
  displayFeature(currentYear, feature) {
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
  displayDisease(currentYear, beginDate, endDate) {
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


  onEachFeature(feature, layer) {
    var self = this;
    if (feature.properties && feature.properties.sovereignt) {
      layer.on('click', function(e) {
        console.log('You just clicked on ', feature.properties.sovereignt, e.latlng);
        self.panel.admissiblity.text('Non admissible');
        self.panel.diseaseName.text(feature.properties.diseaseName)
        self.panel.diseaseDuration.text(feature.properties.diseaseDuration)
        self.panel.dieseaseRequiredTests.text(feature.properties.dieseaseRequiredTests)
        self.panel.notAdmissible.removeClass("hidden");

        // Event is triggered so stop it
        L.DomEvent.stopPropagation(e);
        putMarker(e.latlng);
      });
    }
  }

  putMarker(latlng) {
    if(this.marker === null) {
      this.marker = L.marker(latlng).addTo(this.mymap);
    } else {
      this.marker.setLatLng(latlng);
    }
    this.marker.addTo(this.mymap);
  }

  resetLayerSources() {
    this.geojsonLayerSources = [];
  }
}


export {Map}
