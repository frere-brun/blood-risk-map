import $ from 'jquery';


export function Slider() {

  this.sliderElt = $("#rangeInput");

  this.sliderTextField = $("#year");
  this.rangeOptions = {
    'step': '1',
    'min': '2000',
    'max': (new Date()).getFullYear().toString(),
    'value': (new Date()).getFullYear().toString()
  }

  this.init = function() {
    console.log("slider initialized");
    var self = this;
    Object.entries(this.rangeOptions).forEach(function([key, val]) {
      self.sliderElt.attr(key, val);
    });
    this.sliderElt.on('change input', function(e) {
      self.sliderTextField.text(this.value)
      if (e.type === 'change') {
        // Compute geojson layers based on the year
        geojsonFeaturesToLayer();
        /*
        Future :
        The server would probably serve a new set of geojson data according to the date
        cf : "/getGeojsonFromYear/"+year
        */
      }
    });
  }

}
