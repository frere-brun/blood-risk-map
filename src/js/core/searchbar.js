import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { debounce, uniq } from 'underscore';
import $ from 'jquery';

class SearchBar {
  constructor(datePicker) {
    this.datePicker = datePicker;
    this.provider = new OpenStreetMapProvider();
    this.input = $("#search-input");
    this.placeBox = $("#search");
    this.select = $("#search-results");
    this.selectedItem = null;
    this.selectNumberItems = null;
    this.step = $(".place .step");
    this.select.parent().addClass('hidden');
    this.results = [];
    this.isSelected = false;

    var self = this;
    this.input.on('keyup', debounce(function(e) {
      self.resetData();
      self.requestData();
    }, 200));
    this.input.on('focus', function() {
      if (! self.datePicker.isSet()) {
        alert('Tu dois d\'abord choisir la période de ton voyage');
        self.input.blur();
      } else {
        if (self.isSelected) {
          self.isSelected = false;
          self.input.val('');
          self.placeBox.addClass("box--is-focused");
          self.deactivateReset();
        }
      }

    });
    this.input.on('blur', function() {
      self.placeBox.removeClass("box--is-focused");
    });

    // Select data from list on keyUp and click
    this.select.on('click', function(e) {
      var targetIndex = $(e.target).attr('aria-value')
      self.selectedItem = targetIndex;
      self.selectData(targetIndex);
      self.activateReset();
    });
  }

  connect(connector) {
    this.connector = connector;
  }

  requestData() {
    var self = this;
    let asyncFn = async function() {
      self.results = await self.provider.search({ query: self.input.val() });
      self.injectData();
      
      // Put focus in select tag and force to open it somehow
      // self.select.focus();
      self.select.attr('size', self.results.length < 5 ? self.results.length : 5);
    }
    asyncFn();
  }

  highlightMatches(search, text) {
    var re = new RegExp(search, "gi");
    return text.replace(re, "<b>" + search + "</b>");
  }

  injectData() {
    var self = this;
    this.selectNumberItems = 0;
    this.results = uniq(this.results, 'label');
    this.results.forEach((elt, index) => {
      var option = {
        text: elt.label,
        value:  index
      };
      self.step.addClass("step--valid");
      self.select.append("<li class='touch' aria-value=" + option.value + ">" + this.highlightMatches(self.input.val(), option.text) + "</li>");
      self.selectNumberItems += 1;
    });
    this.select.parent().removeClass('hidden');
  }

  selectData(targetIndex) {
    // Get backdata to clic on
    var i = targetIndex;
    var splitLabel = this.results[i].label.split(', ');
    var country = splitLabel[splitLabel.length-1];
    var target = {'lon': this.results[i].x, 'lat': this.results[i].y, 'country': country};

    // Fill in input, alter behavior and reset data
    this.input.val(this.results[i].label);
    this.isSelected = true;
    this.resetData();

    if(this.connector) {
      this.connector.setCallArgs(target);
      this.connector.activate();
    }
  }

  resetData() {
    this.results = [];
    this.select.empty();
    this.select.parent().addClass('hidden');
  }

  injectAddress(address) {
    console.log('injectAddress', address)
    var lon = address[0];
    var lat = address[1];
    var url = "https://nominatim.openstreetmap.org/reverse?format=json&lat="+lat+"&lon="+lon;
    var self = this;
    let asyncFn = async function() {
      const data = await $.ajax(url);
      self.input.val(data.display_name);
    }
    asyncFn();
  }

  allowReset(reset) {
    this.reset = reset
  }

  activateReset(reset) {
    if (this.reset) {
      this.reset.setActive();
    }
  }

  deactivateReset(reset) {
    if (this.reset) {
      this.reset.setInactive();
    }
  }

  forceReset() {
    this.input.val('');
    this.step.removeClass("step--valid");
  }

}
export {SearchBar}
