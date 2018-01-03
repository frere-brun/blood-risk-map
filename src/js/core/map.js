import L from 'leaflet';
import $ from 'jquery';
import {vectorGrid} from 'leaflet.vectorgrid';

class Map {
  constructor() {
    // Create the map object (L.map)
    this.mymap = null;
    this.mapElt = 'map';
    this.mapOptions = { zoomControl:false };
    this.mymap = L.map(this.mapElt, this.mapOptions).setView([27, 5.6279968], 2); // Original : .setView([48.6857475, 5.6279968], 2);

    // Create the tile layer, keep reference, and add it to mymap
    this.tileLayer = null;
    this.tileLayerUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    this.tileLayerOptions = {
      maxZoom: 18,
      attribution: 'Going to be offline attributions soon....' +
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    };
    this.tileLayer = L.tileLayer(this.tileLayerUrl, this.tileLayerOptions);
    this.tileLayer.addTo(this.mymap);

    // Create reference to future geojson tile layer
    // * Layer group => there are several geojson diseases
    this.geojsonLayer = L.layerGroup();
    this.activeDiseases = {};

    // Create the custom marker with its css (refer to main.scss)
    this.marker = null;
    this.icon = L.divIcon({ className: 'pin pulse' });
  }

  connect(connector) {
    this.connector = connector;
  }

  setMapClick() {
    var self = this;
    this.mymap.on('click', function(e) {
      console.log('You just clicked on ', e.latlng);
      var args = {"isOk": true};
      self.connector.setCallArgs(args);
      self.connector.activate();
      self.putMarker(e.latlng);
    });
  }

  updateDiseaseLayers(geojsonFeatures) {
    console.log('updateDiseaseLayers', geojsonFeatures)
    var self = this;
    if (this.mymap && this.mymap.hasLayer(this.geojsonLayer)) {
      this.mymap.removeLayer(this.geojsonLayer);
      self.geojsonLayer = null;
      self.activeDiseases = {};
    }

    var layers = [];
    geojsonFeatures.forEach(function(features) {
      var l = L.vectorGrid.slicer(features, {
        rendererFactory: L.svg.tile,
        vectorTileLayerStyles: {
          sliced: self.diseaseStyle,
        },
      });
      layers.push(l);
    });

    // Push the list to a layer group and then add it to the map
    this.geojsonLayer = L.layerGroup(layers);
    if (this.mymap) {
      this.mymap.addLayer(this.geojsonLayer);
    }
  }

  // // Build a layer with a particular style and click event from a geojson object
  // geojsonFeaturesToLayer(year) {
  //   // Remove the old geojsonLayer
  //   var self = this;
  //   if (this.mymap && this.mymap.hasLayer(this.geojsonLayer)) {
  //     this.mymap.removeLayer(this.geojsonLayer);
  //     self.geojsonLayer = null;
  //     self.activeDiseases = {};
  //   }

  //   // Create the list of geojson layers [gridVector implementation]
  //   // https://leaflet.github.io/Leaflet.VectorGrid/vectorgrid-api-docs.html#vectorgrid
  //   //   unwrapping automatic of a { type: featureCollection, features: Array} object
  //   var layers = [];
  //   this.geojsonLayerSources.forEach(function(disease) {
  //     if (self.displayDisease(year, disease.beginDate, disease.endDate)) {
  //       var features = disease.featuresCollection;
  //       var l = L.vectorGrid.slicer(features, {
  //         interactive: true,
  //         rendererFactory: L.svg.tile,
  //         vectorTileLayerStyles: {
  //           sliced: self.diseaseStyle,
  //         },
  //       });

  //       l.on('click', function(e) {
  //         var properties = e.layer.properties;
  //         console.log('You just clicked on ', properties.sovereignt, e.latlng);   
  //         var args = {"isOk": false, "data": properties};
  //         self.connector.setCallArgs(args);
  //         self.connector.activate();

  //         L.DomEvent.stopPropagation(e); // Event is triggered so stop it
  //         self.putMarker(e.latlng);
  //       });
  //       layers.push(l);

  //       // Additional data extraction for searchbar
  //       if (!self.activeDiseases[disease.name]) {
  //         self.activeDiseases[disease.name] = {
  //           'properties': {
  //             'diseaseName': disease.name,
  //             'diseaseDuration': disease.duration,
  //             'dieseaseRequiredTests': disease.requiredTests
  //           },
  //           'countries': disease.countries.map(function(country) {
  //             return country.name;
  //           })
  //         };
  //       }
  //     }
  //   });

  //   // Push the list to a layer group and then add it to the map
  //   this.geojsonLayer = L.layerGroup(layers);
  //   console.log('this.geojsonLayer', this.geojsonLayer)
  //   if (this.mymap) {
  //     this.mymap.addLayer(this.geojsonLayer);
  //   }
  // }

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

  putMarker(latlng) {
    if(this.marker === null) {
      this.marker = L.marker(latlng, {icon: this.icon}).addTo(this.mymap);
    } else {
      this.marker.setLatLng(latlng);
    }
    this.marker.addTo(this.mymap);
  }


  enableReverseGeocoding(target) {
    var latlng =  L.latLng(target.lat, target.lon)
    this.putMarker(latlng);

    // Some formatting
    // * Will need a simplification of data.json file 
    // * and language format with OSM provider (searchBar component)
    if (target.country == "États-Unis d'Amérique") {
      target.country = "USA";
    }

    // Look for the given country in the list
    var self = this;
    var args = {"isOk": true};
    Object.keys(this.activeDiseases).forEach(function(key,index) {
      var d = self.activeDiseases[key];
      for (var i=0; i<=d.countries.length; i++) {
        if (d.countries[i] == target.country) {
          args = {"isOk": false, "data": d.properties};
          break;
        }
      }
    });

    // And display result
    this.connector.setCallArgs(args);
    this.connector.activate();
  }
}


export {Map}
