// Loads the data and only dispatch the useful one
import $ from 'jquery';

class GeojsonManager {
  constructor(map) {
    this.geojsonLayerSources = [];
    this.currentGeojson = [];
    this.oldYear = null;

    this.mapRef = map;
  }

  // Get Geojson objects and put additional data for convenience
  diseaseToGeojsonFeature(disease) {
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

  // Filter on selected year, only returns the featureCollections
  updateCurrentGeojson(year) {
    console.log('updating data');
    if (this.oldYear != year) {
      var self = this;
      this.oldYear = year;
      this.currentGeojson = [];
      this.geojsonLayerSources.forEach(function(disease) {
        if (self.yearFilter(year, disease.beginDate, disease.endDate)) {
          self.currentGeojson.push(disease.featuresCollection)
        }
      });
    }

    // Update the map display
    this.updateMap();
  }

  // Filtering function
  yearFilter(currentYear, beginDate, endDate) {
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

  updateMap() {
    console.log('updating ap')
    if (this.mapRef !== undefined) {
      console.log('2')
      this.mapRef.updateDiseaseLayers(this.currentGeojson);
    }
  }
}

export {GeojsonManager}