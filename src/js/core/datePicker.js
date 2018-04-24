import $ from 'jquery';
import moment from 'moment';

// Should be renamed 'PeriodPicker' instead....'
class DatePicker {
  constructor() {
    this.step = $("#date .step");

    this.input = $("#search-input");

    this.dateStart = $("#dateStart");
    this.dateEnd = $("#dateEnd");

    this.start = null;
    this.end = null;

    // Set up events
    /*
     * Allow user to type in directly before submitting results
    */
    var self = this;
    this.dateStart.on('change', function(e) {
      console.log('dateStart', this.value);
      // Check validity
      if (self.isBefore(this.value)) {
        self.setStart(this.value);
        self.getPeriod();
      } else {
        alert('La date de départ doit précéder la date de retour');
        self.start = null;
        console.log('start', self.start, ' - end -', self.end)
      }
    });
    this.dateEnd.on('change', function(e) {
      console.log('dateEnd', this.value);
      // Check validity
      if (self.isAfter(this.value)) {
        self.setEnd(this.value);
        self.getPeriod();
      } else {
        alert('La date de retour doit succéder la date de départ');
        self.end = null;
        console.log('start', self.start, ' - end -', self.end)
      }
    });
  }

  connect(connector) {
    this.connector = connector;
  }

  putFocusOnStart() {
    this.dateStart.focus();
  }

  putFocusOnEnd() {
    this.dateEnd.focus();
  }

  isBefore(value) {
    if (!this.end) {
      return true;
    }
    return moment(value, "YYYY-MM-DD").isBefore(this.end);
  }

  setStart(value) {
    this.start = moment(value, "YYYY-MM-DD")
  }

  isAfter(value) {
    if(!this.start) {
      return true;
    }
    return moment(value, "YYYY-MM-DD").isAfter(this.start);
  }

  setEnd(value) {
    this.end = moment(value, "YYYY-MM-DD");
  }

  getPeriod() {
    if (this.start && ! this.end) {
      this.putFocusOnEnd();
    }
    if (this.start && this.end) {
      this.step.addClass("step--valid");
      var args = {
        start: this.start,
        end: this.end
      }
      this.connector.setCallArgs(args);
      this.connector.activate();
      this.input.focus();
    }
  }

  isSet() {
    return this.start && this.end;
  }

  forceReset() {
    this.start = null;
    this.dateStart.val('');
    this.end = null;
    this.dateEnd.val('');
    this.step.removeClass("step--valid");
  }
}

export {DatePicker}
