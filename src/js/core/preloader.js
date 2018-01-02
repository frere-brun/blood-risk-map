import $ from 'jquery';

class Preloader {
  constructor() {
    this.appWrapper = $(".app");
    this.preloaderText = $(".preloader__center__text");
    this.preloaderWrapper = $(".preloader-wrapper");

    this.step = 0;
    this.loadingSteps = [
      "Chargement de l'application",
      "Récupération des données",
      "Création de la zone de danger"
    ];
    this.nextStep();
  }

  nextStep() {
    if (this.step + 1 < this.loadingSteps.length) {
      // Display message and prepare next
      this.preloaderText.html(this.loadingSteps[this.step]); 
      this.step += 1;
    } else {
      // Or go to following element
      this.preloaderWrapper.addClass("hidden");
      this.appWrapper.removeClass("hidden");
      this.connector.activate();
    }
  }

  connect(connector) {
    this.connector = connector;
  }
}

export {Preloader}
