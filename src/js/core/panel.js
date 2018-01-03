import $ from 'jquery';

class Panel {
  constructor() {
    this.panel = $("#panel");
    this.status = $("#panel-status");
    this.diseases = $("#panel-details");
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
    this.status.text('Admissible');
    if (!this.panel.hasClass("is-valid")) {
      this.panel.removeClass("is-not-valid");
      this.panel.addClass("is-valid");
    }
  }

  setNotOk(data) {
    this.status.text('Non admissible');

    // dump data
    var self = this;
    data.forEach(function(d) {
      var div = self.createDiseaseDetails(d);
      self.diseases.append(div);     
    });

    if (this.panel.hasClass("is-valid")) {
      this.panel.removeClass("is-valid");
      this.panel.addClass("is-not-valid");
    }
  }

  createDiseaseDetails(d) {
    var div = document.createElement('div');
    div.appendChild(this.createParagraph(d.diseaseName));
    div.appendChild(this.createParagraph(d.diseaseDuration));
    div.appendChild(this.createParagraph(d.dieseaseRequiredTests));
    return div;
  }

  createParagraph(text) {
    var p = document.createElement('p')
    var t = document.createTextNode(text);
    p.appendChild(t);
    return p;
  }

}

export {Panel}
