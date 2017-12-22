import 'owl.carousel/dist/assets/owl.carousel.css';
import $ from 'jquery';
// import { Owl } from '../lib/owl.carousel.min.js';
// import 'imports?jQuery=jquery!owl.carousel';

class Disclamer {
  constructor() {

    this.body = $("body");
    this.modal = $(".disclamer.modal");
    this.appWrapper = $(".app");
    this.isModalOpen = false;
    this.isModalOpening = false;
    console.log("disclamer initialized");
  }

  init() {
    var self = this;
    this.modal.addClass("-opening");
    window.setTimeout(function() {
      self.body.addClass("no-scroll");
      self.modal.addClass("-open");
      self.modal.removeClass("-opening");
    }, 4250);
  }

}

export {Disclamer}
