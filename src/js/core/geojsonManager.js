// Loads the data and only dispatch the useful one
class GeojsonManager {
  constructor(map, intersector) {
    this.geojsonLayerSources = [];
    this.currentGeojson = [];
    this.oldYear = null;

    this.mapRef = map;
    this.intersectorRef = intersector;
  }

  // Get Geojson objects and put additional data for convenience
  // Can be optimized, such information should not be needed for display
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
    if (this.oldYear != year) {
      var self = this;
      this.oldYear = year;
      this.currentGeojson = [];
      this.geojsonLayerSources.forEach(function(disease) {
        if (self.yearFilter(year, disease.beginDate, disease.endDate)) {
          self.currentGeojson.push(disease.featuresCollection)
        }
      });
      
      // Update the map display
      this.updateReferences();
    }
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

  updateReferences() {
    if (this.mapRef !== undefined) {
      this.mapRef.updateDiseaseLayers(this.currentGeojson);
    }
    if (this.intersectorRef !== undefined) {
      this.intersectorRef.updatePolygones(this.currentGeojson);
    }
  }
}

export {GeojsonManager};