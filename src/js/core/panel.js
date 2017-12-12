import $ from 'jquery';

class Panel {
  constructor() {
    this.admissiblity = $("#admissiblity");
    this.diseaseName = $("#diseaseName");
    this.diseaseDuration = $("#diseaseDuration");
    this.dieseaseRequiredTests = $("#dieseaseRequiredTests");
    this.notAdmissible = $("#notAdmissible");
  }

  setPanel(args) {
    if (args.isOk) {
      this.setOk();
    } else {
      this.setNotOk(args.data);
    }
  }

  setOk() {
    this.admissiblity.text('Admissible');
    this.diseaseName.text('')
    this.diseaseDuration.text('')
    this.dieseaseRequiredTests.text('')
    this.notAdmissible.addClass("hidden");
  }

  setNotOk(data) {
    this.admissiblity.text('Non admissible');
    this.diseaseName.text(data.diseaseName)
    this.diseaseDuration.text(data.diseaseDuration)
    this.dieseaseRequiredTests.text(data.dieseaseRequiredTests)
    this.notAdmissible.removeClass("hidden");
  }
}

export {Panel}
