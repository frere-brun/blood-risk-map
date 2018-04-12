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
      var title = "Maladie Inconnue";
      if (d.diseaseName) {
        title = "<h3 class='diagnosis__details__item__title'>" + d.diseaseName + "</h3>";
      }
      var label = "Délai inconnu";
      if (d.diseaseDuration) {
        label = "<label class='diagnosis__details__item__label'>" + d.diseaseDuration + "</label>";
      }
      var tests = "Tests inconnus";
      if( d.dieseaseRequiredTests ) {
        tests = "<p class='diagnosis__details__item__test'>" + d.dieseaseRequiredTests + "</p>";
      }
      var div = "<div class='diagnosis__details__item__head'>" + title + label + "</div>";
      var li = "<li class='diagnosis__details__item'>" + div + tests + "</li>";
      self.diseases.append(li);
    });

    this.response.addClass("response--is-invalid").removeClass("response--is-valid");
  }

}

export {Panel}
