import $ from 'jquery';

class Preloader {
  constructor() {
    this.appWrapper = $(".app");
    this.preloaderText = $(".preloader__center__text");
    this.preloaderWrapper = $(".preloader-wrapper");
  }

  nextStep() {
    this.preloaderWrapper.addClass("hidden");
    this.appWrapper.removeClass("hidden");
    this.connector.activate();
  }

  connect(connector) {
    this.connector = connector;
  }
}

export {Preloader}
