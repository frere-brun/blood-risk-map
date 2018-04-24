import $ from 'jquery';

const SPACEKEYCODE = 32;

class Reset {
  constructor(periodPicker, searchBar, panel, map) {
    this.window = $(window);
    this.resetElement = $(".reset-form");

    this.isActive = false;

    this.periodPicker = periodPicker;
    this.searchBar = searchBar;
    this.panel = panel;
    this.map = map;

    var self = this;
    this.window.on('keypress', function(e) {
      if(e.keyCode == SPACEKEYCODE && self.isActive) {
        self.forceReset();
      }
    });
  }

  forceReset() {
    this.periodPicker.forceReset();
    this.searchBar.forceReset();
    this.panel.forceReset();
    this.map.forceReset();

    this.setInactive();
    this.periodPicker.putFocusOnStart();
  }

  setInactive() {
    this.isActive = false;
    this.resetElement.removeClass("reset-form--visible");
  }

  setActive() {
    this.isActive = true;
    this.resetElement.addClass("reset-form--visible");
  }

}

export { Reset }
