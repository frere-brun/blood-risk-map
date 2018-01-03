import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import booleanDisjoint from '@turf/boolean-disjoint';
import circle from '@turf/circle';
import { polygon, multiPolygon } from '@turf/helpers';
import intersect from '@turf/intersect';
import lineIntersect from '@turf/line-intersect';

class Intersector {
  constructor() {
    this.polygons = [];
    this.perimeter = 30; // 30km
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

  // Two possible methods: point or perimeter
  checkIntersection(mapMarker) {
    var args = {'isOk': true, 'data': []};
    args = this.perimeterCheck(mapMarker, args);
    // var args = this.pointCheck(mapMarker, args);
    this.connector.setCallArgs(args);
    this.connector.activate();
  }

  // Check if circle is not disjoint from other polygons
  perimeterCheck(mapMarker, args) {
    //  Construct circle
    var radius = this.perimeter;
    var options = {steps: 10, units: 'kilometers'};
    var c = circle(mapMarker, radius, options);

    for (var i=0; i<this.polygons.length; i++) {
      var p = this.polygons[i];
      if (!booleanDisjoint(c, p)) {
        if (args.isOk) {
          args.isOk = false;
        }
        args.data.push(p.properties);
      }
    }
    return args;
  }

  // Check if marker is in polygons
  pointCheck(mapMarker, args) {
    for (var i=0; i<this.polygons.length; i++) {
      var p = this.polygons[i];
      if (booleanPointInPolygon(mapMarker, p)) {
        if (args.isOk) {
          args.isOk = false;
        }
        args.data.push(p.properties);
      }
    }
    return args;
  }
}

export {Intersector}