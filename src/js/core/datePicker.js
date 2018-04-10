import $ from 'jquery';
import moment from 'moment';
class DatePicker {
  constructor() {
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
        console.log('start', self.start, ' - end -', self.end)
      }
    });
  }

  connect(connector) {
    this.connector = connector;
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
      var args = {
        start: this.start,
        end: this.end
      }
      this.connector.setCallArgs(args);
      this.connector.activate();
    }
  }
}

export {DatePicker}
