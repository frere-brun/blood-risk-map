import { OpenStreetMapProvider } from 'leaflet-geosearch';
import $ from 'jquery';

class SearchBar {
  constructor() {
    this.provider = new OpenStreetMapProvider();
    this.input = $("#search-input");
    this.select = $("#search-results");
    this.select.addClass('hidden')
    this.results = [];
    this.isSelected = false;
   
    var self = this;
    this.input.on('keyup', function(e) {
      if (e.which == 13) {
        self.resetData();
        self.requestData();
      }
    });
    this.input.on('focus', function() {
      if (self.isSelected) {
        self.isSelected = false;
        self.input.val('');
      }
    });

    // Select data from list on keyUp and click
    this.select.on('keyup', function(e) {
      if (e.which == 13) {
        self.selectData();
      }      
    }).on('click', function() {
      self.selectData();
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
      self.select.focus();
      self.select.attr('size', self.results.length < 5 ? self.results.length : 5);
    }
    asyncFn();
  }

  injectData() {
    var self = this;
    this.results.forEach((elt, index) => {
      var option = document.createElement('option');
      option.text = elt.label;
      option.value = index;
      self.select.append(option);
    });
    this.select.removeClass('hidden')
  }

  selectData() {
    // Get backdata to clic on
    var i = this.select[0].selectedOptions[0].value;
    var splitLabel = this.results[i].label.split(', ');
    var country = splitLabel[splitLabel.length-1];
    var target = {'lon': this.results[i].x, 'lat': this.results[i].y, 'country': country};
    
    // Fill in input, alter behavior and reset data
    this.input.val(this.select[0].selectedOptions[0].text);
    this.isSelected = true;
    this.resetData();

    if(this.connector) {
      this.connector.setCallArgs(target);
      this.connector.activate();
    }
  }

  resetData() {
    this.results = [];
    this.select.attr('size', 0);
    this.select.empty();
    this.select.addClass('hidden')
  }
}
export {SearchBar}