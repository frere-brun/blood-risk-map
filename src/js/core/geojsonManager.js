import moment from 'moment';

// Loads the data and only dispatch the useful one
class GeojsonManager {
  constructor(map, intersector) {
    this.geojsonLayerSources = [];
    this.currentGeojson = [];
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
  updateCurrentGeojson(periodObj) {
    var self = this;
    this.currentGeojson = [];
    this.geojsonLayerSources.forEach(function(disease) {
      if (self.periodFilter(periodObj, disease.beginDate, disease.endDate, disease.duration)) {
        self.currentGeojson.push(disease.featuresCollection)
      }
    });

    // Update the map display
    this.updateReferences();
  }

  periodFilter(periodObj, beginDate, endDate, duration) {
    // If no begin date, stop here
    if (!beginDate) {
      return false;
    }

    var momBegin = moment(beginDate, "YYYY-MM-DD");

    // Disease began after the journey
    if (momBegin.isAfter(periodObj.end)) {
      return true;
    }

    // Check end date first
    if (endDate) {
      var momEnd = moment(endDate, "YYYY-MM-DD");
      return momBegin.isBefore(periodObj.start) && momEnd.isAfter(periodObj.end);
    }

    // If no end date is specified, check duration
    if (duration) {
      var momDuration
      if (duration.toLowerCase().includes('day')) {
        var nbDays = parseInt(duration.split(' ')[0]);
        momDuration = momBegin.add(nbDays, 'days');
      }
      else if (duration.toLowerCase().includes('month')) {
        var nbMonths = parseInt(duration.split(' ')[0]);
        momDuration = momBegin.add(nbMonths, 'months');
      }
      else if (duration.toLowerCase().includes('year')) {
        var nbYears = parseInt(duration.split(' ')[0]);
        momDuration = momBegin.add(nbYears, 'years');
      }
      return momBegin.isBefore(periodObj.start) && momDuration.isAfter(periodObj.end);
    }

    // Default case again
    return false;
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
