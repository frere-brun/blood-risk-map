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

    this.mymap = L.map(this.mapElt, { zoomControl:false }).setView([27, 5.6279968], 2); // Original : .setView([48.6857475, 5.6279968], 2);
    L.tileLayer(this.tileLayerUrl, this.tileLayerOptions).addTo(this.mymap);
    
  }

  setMapClick(panel) {
    var self = this;
    this.mymap.on('click', function(e) {
      console.log('You just clicked on ', e.latlng);
      panel.setOk();
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
      });
      this.geojsonLayerSources.push(disease);
    }
  }

  // Build a layer with a particular style and click event from a geojson object
  geojsonFeaturesToLayer(year, panel) {
    // Remove the old geojsonLayer
    var self = this;
    if (this.mymap && this.mymap.hasLayer(this.geojsonLayer)) {
      this.mymap.removeLayer(this.geojsonLayer);
      self.geojsonLayer = null;
    }

    // Create the list of geojson layers [gridVector implementation]
    // https://leaflet.github.io/Leaflet.VectorGrid/vectorgrid-api-docs.html#vectorgrid
    //   unwrapping automatic of a { type: featureCollection, features: Array} object
    var layers = [];
    this.geojsonLayerSources.forEach(function(disease) {
      if (self.displayDisease(year, disease.beginDate, disease.endDate)) {
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
          panel.setNotOk(properties);          
          L.DomEvent.stopPropagation(e); // Event is triggered so stop it
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
