import $ from 'jquery';
import 'owl.carousel';

class Disclaimer {
  constructor() {
    this.body = $("body");
    this.modal = $(".disclaimer.modal");
    this.acceptBtn = $("#acceptBtn");
    this.declineBtn = $("#declineBtn");
    this.appWrapper = $(".app");
    this.isDisclamedActive = false;
    this.isModalOpen = false;
    this.isModalOpening = false;

    var self = this;
    this.acceptBtn.on('click', function() {
      self.hide();
    });
    this.declineBtn.on('click', function() {
      self.hide();
    });
  }

  display() {
    if(this.isDisclamedActive) {
      this.modal.addClass("-opening");
      this.body.addClass("no-scroll");
      this.modal.addClass("-open");
      this.modal.removeClass("-opening");
    }
  }

  hide() {
    if(this.isDisclamedActive) {
      this.modal.addClass("-closing");
      var self = this;
      window.setTimeout(function() {
        self.modal.removeClass("-open");
        self.modal.removeClass("-closing");
        self.body.removeClass("no-scroll");
      }, 350);
    }
  }
}

export {Disclaimer}
