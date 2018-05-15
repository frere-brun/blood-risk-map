import $ from 'jquery';
import moment from 'moment';

// Should be renamed 'PeriodPicker' instead....'
class PeriodPicker {
  constructor() {
    this.step = $("#date .step");
    this.box = $("#date.box");
    this.input = $("#search-input");

    this.dateStart = $("#dateStart");
    this.dateEnd = $("#dateEnd");
    this.dateInputs = $("#dateStart, #dateEnd");

    this.start = null;
    this.end = null;

    // Set up events
    /*
     * Allow user to type in directly before submitting results
    */
    var self = this;
    this.dateInputs.on('focus', function(e) {
      self.box.removeClass("box--is-focused");
      self.box.addClass("box--is-focused");
    });
    this.dateInputs.on('blur', function(e) {
      self.box.removeClass("box--is-focused");
    });
    this.dateStart.on('change', function(e) {
      // Force reset on dateEnd
      self.dateEnd.val('');
      self.end = null;

      // Set dateStart and put focus on dateEnd
      self.setStart(this.value);
      this.putFocusOnEnd();
    });
    this.dateEnd.on('change', function(e) {
      if (!self.start) {
        self.putFocusOnStart();
        return;
      }

      if (self.isAfter(this.value)) {
        self.setEnd(this.value);
        self.getPeriod();
      } else {
        self.dateEnd.val('');
        self.end = null;
        self.box.addClass("box--is-invalid");
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
    if (this.start && this.end) {
      this.box.removeClass("box--is-invalid");
      this.step.addClass("step--is-valid");
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
    this.step.removeClass("step--is-valid");
  }
}

export {PeriodPicker}
