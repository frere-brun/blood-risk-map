import $ from 'jquery';
class Slider {
  constructor() {
    this.sliderElt = $("#rangeInput");
    this.sliderTextField = $("#year");
    this.rangeOptions = {
      'step': '1',
      'min': '2000',
      'max': (new Date()).getFullYear().toString(),
      'value': (new Date()).getFullYear().toString()
    }

    for (var k in this.rangeOptions) {
      this.sliderElt.attr(k, this.rangeOptions[k]);
      if (k === 'value') {
        this.sliderTextField.text(this.rangeOptions[k])
      }
    }
  }

  bindToMap(map) {
    var self = this;
    this.sliderElt.on('change input', function(e) {
      self.sliderTextField.text(this.value)
      if (e.type === 'change') {
        // Compute geojson layers based on the year
        map.geojsonFeaturesToLayer(this.value);
        /*
        Future :
        The server would probably serve a new set of geojson data according to the date
        cf : "/getGeojsonFromYear/"+year
        */
      }
    });    
  }

  getYear() {
    return parseInt(this.sliderTextField.text());
  }
}

export {Slider}