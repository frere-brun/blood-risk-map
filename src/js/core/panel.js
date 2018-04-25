import $ from 'jquery';
import moment from 'moment';

moment.locale('fr', {
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact : true,
    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Aujourd’hui à] LT',
        nextDay : '[Demain à] LT',
        nextWeek : 'dddd [à] LT',
        lastDay : '[Hier à] LT',
        lastWeek : 'dddd [dernier à] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : '%s',
        past : '%s',
        s : 'quelques secondes',
        m : 'une minute',
        mm : '%d minutes',
        h : 'une heure',
        hh : '%d heures',
        d : 'un jour',
        dd : '%d jours',
        M : 'un mois',
        MM : '%d mois',
        y : 'un an',
        yy : '%d ans'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse : /PD|MD/,
    isPM : function (input) {
        return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});


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
      this.diseases.append("<p>Aucune</p>");
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

  durationToMoment(diseaseDuration) {
    var momDuration;
    if (diseaseDuration.toLowerCase().includes('day')) {
      var nbDays = parseInt(diseaseDuration.split(' ')[0]);
      momDuration = moment($('#dateEnd').val()).add(nbDays, 'days');
    }
    else if (diseaseDuration.toLowerCase().includes('month')) {
      var nbMonths = parseInt(diseaseDuration.split(' ')[0]);
      momDuration = moment($('#dateEnd').val()).add(nbMonths, 'months');
    }
    else if (diseaseDuration.toLowerCase().includes('year')) {
      var nbYears = parseInt(diseaseDuration.split(' ')[0]);
      momDuration = moment($('#dateEnd').val()).add(nbYears, 'years');
    }
    return momDuration;

  }

  setNotOk(data) {

    var longestDurationToWait =  moment($('#dateEnd').val());

    console.log(data);

    // dump data
    var self = this;
    data.map(function(disease) {

      var title = "Maladie Inconnue";
      if (disease.diseaseName) {
        title = "<h3 class='diagnosis__details__item__title'>" + disease.diseaseName + "</h3>";
      }
      var label = "Délai inconnu";
      if (disease.diseaseDuration) {
        label = "<label class='diagnosis__details__item__label'>" + disease.diseaseDuration + "</label>";
        // We need to compare each diseaseDuration to get the longest
        var duration = self.durationToMoment(disease.diseaseDuration);
        if(duration.isAfter(longestDurationToWait))
          longestDurationToWait = duration;
      }
      var tests = "Tests inconnus";
      if( disease.diseaseRequiredTests ) {
        tests = "<p class='diagnosis__details__item__test'>" + disease.diseaseRequiredTests + "</p>";
      }
      var div = "<div class='diagnosis__details__item__head'>" + title + label + "</div>";
      var li = "<li class='diagnosis__details__item'>" + div + tests + "</li>";
      self.diseases.append(li);
    });

    console.log("longest", longestDurationToWait);

    // If the endDate + longestDuration is after the actual time
    if (!longestDurationToWait.isBefore(moment())) {

      this.status.text("Non admissible");
      this.duration.text(longestDurationToWait.add(1, "day").fromNow() + " d'attente");
      this.delay.text("Admissible à partir du " + longestDurationToWait.format("DD/MM/YY"));
      this.response.addClass("response--is-invalid").removeClass("response--is-valid");

    }
    else {
      this.setOk();
    }
  }

  forceReset() {
    this.response.removeClass("response--is-invalid").removeClass("response--is-valid");
    this.status.empty();
    this.delay.empty();
    this.duration.empty();
    this.diseases.empty();
  }

}

export {Panel}
