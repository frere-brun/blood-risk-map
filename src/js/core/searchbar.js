import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { debounce } from 'underscore';
import $ from 'jquery';

class SearchBar {
  constructor() {
    this.provider = new OpenStreetMapProvider();
    this.input = $("#search-input");
    this.placeBox = $("#search");
    this.select = $("#search-results");
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
      if (self.isSelected) {
        self.isSelected = false;
        self.input.val('');
        this.placeBox.addClass("box--is-focused");
      }
    });
    this.input.on('blur', function() {
      self.resetData();
      this.placeBox.removeClass("box--is-focused");
    });
    // Select data from list on keyUp and click
    this.select.on('keyup', function(e) {
      if (e.which == 13) {
        self.selectData();
      }
    }).on('click', function(e) {
      console.log(e.target);
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
    this.results.forEach((elt, index) => {
      var option = {
        text: elt.label,
        value:  index
      };
      this.step.addClass("step--valid");
      self.select.append("<li class='touch' aria-value=" + option.value + ">" + this.highlightMatches(self.input.val(), option.text) + "</li>");
    });
    this.select.parent().removeClass('hidden');
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
    // this.select.attr('size', 0);
    this.select.empty();
    this.select.parent().addClass('hidden');
  }
}
export {SearchBar}
