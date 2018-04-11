import $ from 'jquery';

class Panel {
  constructor() {
    this.response = $("#response");

    this.status = $("#admissibility-status");
    this.delay = $("#admissibility-delay");
    this.duration = $("#admissibility-duration");

    this.diseases = $("#diagnosis-details");

  }

  setPanel(args) {
    this.diseases.empty();
    if (args.isOk) {
      this.setOk();
    } else {
      this.setNotOk(args.data);
    }
  }

  setOk() {

    this.status.text("Admissible");
    this.duration.text("C'est fantastique");
    this.delay.text("");

    this.response.addClass("response--is-valid").removeClass("response--is-invalid");
  }

  setNotOk(data) {

    this.status.text("Non admissible");
    this.duration.text("6 Mois d'attente");
    this.delay.text("Admissible à partir du 24/11/18");

    // dump data
    var self = this;

    data.forEach(function(d) {
      var tests = "";
      if( d.dieseaseRequiredTests )
        tests = "<p class='diagnosis__details__item__test'>" + d.dieseaseRequiredTests + "</p>";
      self.diseases.append("<li class='diagnosis__details__item'><div class='diagnosis__details__item__head'><h3 class='diagnosis__details__item__title'>" + d.diseaseName + "</h3><label class='diagnosis__details__item__label'>" + d.diseaseDuration + "</label></div>" + tests + "</li>");
    });

    this.response.addClass("response--is-invalid").removeClass("response--is-valid");
  }

}

export {Panel}
