import $ from 'jquery';

class Preloader {
  constructor() {

    this.loadingSteps = [
      "Chargement de l'application",
      "Récupération des données",
      "Création de la zone de danger"
    ];

    this.preloaderWrapper = $(".preloader-wrapper");
    this.preloaderText = $(".preloader__center__text");
    this.appWrapper = $(".app");
    console.log("preloader initialized");
  }

  init() {
    var self = this;
    this.preloaderText.html(this.loadingSteps[0]);
    window.setTimeout(function() {
      self.preloaderText.html(self.loadingSteps[1]);
      window.setTimeout(function() {
      	self.preloaderText.html(self.loadingSteps[2]);
        window.setTimeout(function() {
        	self.preloaderWrapper.addClass("hidden");
        	self.appWrapper.removeClass("hidden");
        }, 1500);
      }, 1500);
    }, 1500);
  }

}

export {Preloader}
