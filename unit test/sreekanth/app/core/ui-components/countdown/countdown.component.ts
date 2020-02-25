import { Component, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../../core/services/config.service';

@Component({
  selector: 'countdown',
  templateUrl: 'countdown.html'
})

export class CountDownComponent {
  @Input() units: any;
  @Input() end: any;
  @Input() displayString: string = '';
  @Input() text: any;
  @Input() divider: any;
  @Output() reached: EventEmitter<Date> = new EventEmitter();
  display: any = [];
  displayNumbers: any = [];
  dateDelimiter: string = '/';
  dateFormat;
  private wasReached = false;
  config: ConfigService;
  constructor(config: ConfigService) {
    this.config = config;
    this.dateFormat = this.config.get('dateFormat');
    this.dateDelimiter = this.config.get('dateDelimiter');
    setInterval(() => this._displayString(), 100);
  }

  _displayString() {

    if (typeof this.units === 'string') {
      this.units = this.units.split('|');
    }
    let givenDate: any = new Date(this.parseSelectedDate(this.end));
    let now: any = new Date();

    let dateDifference: any = givenDate - now;
    if (dateDifference < 100 && dateDifference > 0 && !this.wasReached) {
      this.wasReached = true;
      this.reached.next(now);
    }

    let lastUnit = this.units[this.units.length - 1],
      unitConstantForMillisecs = {
        year: (((1000 * 60 * 60 * 24 * 7) * 4) * 12),
        month: ((1000 * 60 * 60 * 24 * 7) * 4),
        weeks: (1000 * 60 * 60 * 24 * 7),
        days: (1000 * 60 * 60 * 24),
        hours: (1000 * 60 * 60),
        minutes: (1000 * 60),
        seconds: 1000
      },
      unitsLeft = {},
      returnText = '',
      returnNumbers = '',
      totalMillisecsLeft = dateDifference,
      i,
      unit: any;
    for (i in this.units) {
      if (this.units.hasOwnProperty(i)) {

        unit = this.units[i].trim();
        if (unitConstantForMillisecs[unit.toLowerCase()] === false) {
          //$interval.cancel(countDownInterval);
          throw new Error('Cannot repeat unit: ' + unit);

        }
        if (unitConstantForMillisecs.hasOwnProperty(unit.toLowerCase()) === false) {
          throw new Error('Unit: ' + unit + ' is not supported. Please use following units: year, month, weeks, days, hours, minutes, seconds, milliseconds');
        }

        unitsLeft[unit] = totalMillisecsLeft / unitConstantForMillisecs[unit.toLowerCase()];

        if (lastUnit === unit) {
          unitsLeft[unit] = Math.ceil(unitsLeft[unit]);
        } else {
          unitsLeft[unit] = Math.floor(unitsLeft[unit]);
        }
        totalMillisecsLeft -= unitsLeft[unit] * unitConstantForMillisecs[unit.toLowerCase()];
        unitConstantForMillisecs[unit.toLowerCase()] = false;

        returnNumbers += ' ' + unitsLeft[unit] + ' | ';
        returnText += ' ' + unit;
      }
    }

    if (this.text === null || !this.text) {
      this.text = {
        Year: 'Year',
        Month: 'Month',
        Weeks: 'Weeks',
        Days: 'Days',
        Hours: 'Hrs',
        Minutes: 'Min',
        Seconds: 'Sec',
        MilliSeconds: 'Milliseconds'
      };
    }

    this.displayString = returnText
      .replace('Year', this.text.Year + ' | ')
      .replace('Month', this.text.Month + ' | ')
      .replace('Weeks', this.text.Weeks + ' | ')
      .replace('Days', this.text.Days + ' | ')
      .replace('Hours', this.text.Hours + ' | ')
      .replace('Minutes', this.text.Minutes + ' | ')
      .replace('Seconds', this.text.Seconds);
    this.displayNumbers = returnNumbers.split('|');
    this.ignoreTimerIfReached();
    if (this.displayString.lastIndexOf('|') + 1 === this.displayString.length - 1)
      this.displayString = this.displayString.substring(this.displayString.lastIndexOf('|'), 1);
    this.display = this.displayString.split('|');
  }

  parseSelectedDate(ds: string) {
    let date: any = { day: 0, month: 0, year: 0 };
    if (ds) {
      let fmt = this.config.get('dateFormat');
      let dpos = fmt.indexOf('dd');
      if (dpos >= 0) {
        date.day = parseInt(ds.substring(dpos, dpos + 2));
      }
      let mpos = fmt.indexOf('MM');
      if (mpos >= 0) {
        date.month = parseInt(ds.substring(mpos, mpos + 2));
      }
      let ypos = fmt.indexOf('yyyy');
      if (ypos >= 0) {
        date.year = parseInt(ds.substring(ypos, ypos + 4));
      }
    }
    return date.month + this.dateDelimiter + date.day + this.dateDelimiter + date.year;
  }
  ignoreTimerIfReached() {
    if (parseInt(this.displayNumbers[0].trim()) < 0)
      for (let p = 0; p < this.displayNumbers.length; p++)
        this.displayNumbers[p] = " -- "
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule],
  declarations: [CountDownComponent],
  exports: [CountDownComponent]
})
export class UiNCPCountDownModule { }