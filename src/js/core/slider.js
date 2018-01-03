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

    // Initialize attributes
    for (var k in this.rangeOptions) {
      this.sliderElt.attr(k, this.rangeOptions[k]);
      if (k === 'value') {
        this.sliderTextField.text(this.rangeOptions[k])
      }
    }

    // Set up events
    var self = this;
    this.sliderElt.on('change input', function(e) {
      self.sliderTextField.text(this.value)
      if (e.type === 'change') {
        if (self.connector) {
          var args = self.getYear();
          self.connector.setCallArgs(args);
          self.connector.activate();
        }
      }
    });
  }

  connect(connector) {
    this.connector = connector;
  }

  // bindToMap() {
  //   var self = this;
  //   this.sliderElt.on('change input', function(e) {
  //     self.sliderTextField.text(this.value)
  //     if (e.type === 'change') {
  //       if (self.connector) {
  //         var args = self.getYear();
  //         self.connector.setCallArgs(args);
  //         self.connector.activate();
  //       }
  //     }
  //   });
  // }

  getYear() {
    return parseInt(this.sliderTextField.text());
  }
}

export {Slider}
