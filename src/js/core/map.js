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

    // Init event
    var self = this;
    this.mymap.on('click', function(e) {
      self.putMarker(e.latlng);
      self.runConnector();
    });
  }

  connect(connector) {
    this.connector = connector;
  }

  runConnector() {
    if (this.connector) {
      var tmp = this.marker.getLatLng();
      var args = [this.normalizeLng(tmp.lng), tmp.lat];
      this.connector.setCallArgs(args);
      this.connector.activate();        
    }
  }

  // Ensure a longitude is always in bound
  normalizeLng(lng) {
    return L.Util.wrapNum(lng, [-180, 180], true);
  }

  updateDiseaseLayers(geojsonFeatures) {
    if (this.mymap && this.mymap.hasLayer(this.geojsonLayer)) {
      this.mymap.removeLayer(this.geojsonLayer);
      this.geojsonLayer = null;
    }

    var self = this;
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

  diseaseStyle(properties, zoom) {
    return {
      fillColor: properties.color,
      fillOpacity: 0.5,
      stroke: true,
      fill: true,
      color: 'blue',
      weight: 0,
    }
  }

  putMarker(latlng) {
    if(this.marker === null) {
      this.marker = L.marker(latlng, {icon: this.icon}).addTo(this.mymap);
    } else {
      this.marker.setLatLng(latlng);
    }

    // Add the circle here and find a way to extract a big geojson repr (more than 2 points....)
  }

  enableReverseGeocoding(target) {
    var latlng =  L.latLng(target.lat, target.lon)
    this.putMarker(latlng);
    this.runConnector();
  }
}


export {Map}
