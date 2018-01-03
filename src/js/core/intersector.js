import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { polygon, multiPolygon } from '@turf/helpers';
import intersect from '@turf/intersect';

class Intersector {
  constructor() {
    this.polygons = [];
  }

  connect(connector) {
    this.connector = connector;
  }

  updatePolygones(geojsonFeatures) {
    var self = this;
    this.polygons = [];
    geojsonFeatures.forEach(function(featureCollections) {
      featureCollections.features.forEach(function(f) {        
        var p = undefined;
        var type = f.geometry.type;
        var coords = f.geometry.coordinates;
        var status = self.extractStatus(f);

        if (type == "Polygon") {
          p = polygon(coords, status);
        } else if (type == "MultiPolygon") {
          p = multiPolygon(coords, status);
        } else {
          console.log("UNKNOWN", type)
        }

        if (p !== undefined) {
          self.polygons.push(p);          
        }
      });
    });
  }

  extractStatus(disease) {
    var status = {
      'diseaseName': disease.properties.diseaseName,
      'diseaseDuration': disease.properties.diseaseDuration,
      'dieseaseRequiredTests': disease.properties.dieseaseRequiredTests
    };
    return status;
  }

  // Put some modulo to prevent tilemapping side effects on lat long
  checkIntersection(mapMarker) {
    var count = 0;
    var args = {'isOk': true, 'data': []}
    for (var i=0; i<this.polygons.length; i++) {
      var p = this.polygons[i];
      if (booleanPointInPolygon(mapMarker, p)) {
        if (args.isOk) {
          args.isOk = false;
        }
        args.data.push(p.properties);
        count++;
      }
    }

    console.log("DIseases found", count)

    this.connector.setCallArgs(args);
    this.connector.activate();        
  }
}

export {Intersector}