import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import $ from 'jquery';

class SearchBar {
  constructor() {
    this.provider = new OpenStreetMapProvider();
    this.input = $("#search-input");
    this.select = $("#search-results");
    this.results = [];
   
    var self = this;
    this.input.on('keyup', function(e) {
      if (e.which == 13) {
        self.requestData();
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


    console.log("search bar initialized");
  }

  connect(connector) {
    this.connector = connector;
  }

  requestData() {
    var self = this;
    let asyncFn = async function() {
      self.results = await self.provider.search({ query: self.input.val() });
      self.injectData();

      // Put focus and force to open it somehow
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
  }

  selectData() {
    // Get backdata to clic on
    var i = this.select[0].selectedOptions[0].value;
    var point2click = {'lat': this.results[i].x, 'lon': this.results[i].y};
    
    // Fill in input
    this.input.val(this.select[0].selectedOptions[0].text);

    // Clean the old select tag
    this.select.attr('size', 0);
    this.select.empty();

    console.log('POINT (ltlng): ', point2click)
    if(this.connector) {
      this.connector.setCallArgs(point2click)
      this.connector.activate();
    }
  }
}
export {SearchBar}