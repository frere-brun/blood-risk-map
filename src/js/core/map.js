import L from 'leaflet';
import $ from 'jquery';
import {vectorGrid} from 'leaflet.vectorgrid';

// NEED TO BE MOVED IN A CONFIG FILE
const PERIMETER = 100;
const ORIGIN = [51.505, -0.09];
var SHOWDISEASES = false;
const SHOWDISEASESKEY = 13;

class Map {
  constructor(periodPicker) {
    this.periodPicker = periodPicker;
    this.window = $(window);
    this.hasToDisplayDiseases = false;

    // Create the map object (L.map)
    this.mymap = null;
    this.mapElt = 'map';
    this.bounds = L.latLngBounds(L.latLng(-89.98155760646617, -180), L.latLng(89.99346179538875, 180));
    this.mapOptions = {
      zoomControl:false,
      minZoom: 3,
      maxZoom: 6,
      maxBounds: this.bounds,
      maxBoundsViscosity: 1.0
     };
    this.mymap = L.map(this.mapElt, this.mapOptions).setView(ORIGIN, 2); // Original : .setView([48.6857475, 5.6279968], 2);
    // this.mymap.setMaxBounds(this.bounds);

    // Create the tile layer, keep reference, and add it to mymap
    this.tileLayer = null;
    this.tileLayerUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    this.tileLayerOptions = {
      minZoom: 3,
      maxZoom: 6,
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
    this.perimeter = null;
    this.perimeterRadius = PERIMETER * 1000; // 30km;
    this.icon = L.divIcon({ className: 'marker' });

    // Init event
    var self = this;
    this.mymap.on('click', function(e) {
      if (! self.periodPicker.isSet()) {
        self.periodPicker.putFocusOnStart();
      } else {
        self.putMarker(e.latlng);
        self.runConnector();
      }
    });

    this.window.on('keypress', function(e) {
      if(e.keyCode == SHOWDISEASESKEY) {
        SHOWDISEASES = !SHOWDISEASES;
      }
    });

  }

  connect(connector) {
    if (!this.connector) {
      this.connector = connector;
    } else {
      this.secondConnector = connector;
    }
  }

  runConnector() {
    var tmp = this.marker.getLatLng();
    var args = [this.normalizeLng(tmp.lng), tmp.lat];
    if (this.connector) {
      this.connector.setCallArgs(args);
      this.connector.activate();
    }
    if (this.secondConnector) {
      this.secondConnector.setCallArgs(args);
      this.secondConnector.activate();
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

  diseaseStyle() {
    // Hidden to prevent bad behavior
    return {
      fillColor: "rgba(255,0,0,0.2)",
      fillOpacity: SHOWDISEASES ? 1 : 0,
      opacity: SHOWDISEASES ? 1 : 0,
      stroke: true,
      fill: true,
      color: 'blue',
      weight: 0,
    }
  }

  perimeterStyle() {
    // Hidden perimeter
    return {
      fillColor: "rgba(255,0,0,0.2)",
      fillOpacity: SHOWDISEASES ? 1 : 0,
      opacity: SHOWDISEASES ? 1 : 0,
      stroke: true,
      fill: true,
      color: '#FF0000',
      weight: 2,
    }
  }

  putMarker(latlng) {
    if(this.marker === null) {
      this.marker = L.marker(latlng, {icon: this.icon}).addTo(this.mymap);
      this.mymap.panTo(this.marker.getLatLng());
    } else {
      this.marker.setLatLng(latlng);
      this.mymap.panTo(this.marker.getLatLng());
    }

    if (this.perimeter === null) {
      this.perimeter = L.circle(latlng, {radius: this.perimeterRadius, ...(this.perimeterStyle()) }).addTo(this.mymap);
    } else {
      this.perimeter.setLatLng(latlng);
    }
  }

  enableReverseGeocoding(target) {
    var latlng =  L.latLng(target.lat, target.lon)
    this.putMarker(latlng);
    this.runConnector();
  }

  forceReset() {
    if(this.marker) {
      this.marker.remove();
      this.marker = null;
    }

    if(this.perimeter) {
      this.perimeter.remove();
      this.perimeter = null;
    }

    this.mymap.setView(ORIGIN, 2);
  }

}


export {Map}
