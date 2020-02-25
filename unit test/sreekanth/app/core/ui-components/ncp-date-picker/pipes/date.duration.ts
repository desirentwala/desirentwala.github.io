import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../../../services/config.service';

@Pipe({
    name: 'dateDuration',
    pure: true
})

export class DateDuration implements PipeTransform {
    config;
    dateFormat: string;
    dateDelimiter;
    constructor(config: ConfigService) {
        this.config = config;
    }
    transform(_startDate?: string, _endDate?: string): any {
        this.dateFormat = this.config.get('dateFormat');
        this.dateFormat = this.dateFormat.toLowerCase();
        this.dateDelimiter = this.config.get('dateDelimiter');
        let startDate = new Date(_startDate);
        let endDate = new Date(_endDate);
        let noOfDays;
        let returnValue = { startDate: new Date(0), 'endDate': new Date(0), 'noOfDays': 0 };
        if (_startDate && _endDate) {
            if (this.dateFormat.indexOf('dd') === 0
                && this.dateFormat.indexOf('mm') === 3
                && this.dateFormat.indexOf('yyyy') === 6) {
                let startDateSplit = _startDate.split(this.dateDelimiter);
                startDate = new Date(parseInt(startDateSplit[2]), parseInt(startDateSplit[1]) - 1, parseInt(startDateSplit[0]));
                let endDateSplit = _endDate.split(this.dateDelimiter);
                endDate = new Date(parseInt(endDateSplit[2]), parseInt(endDateSplit[1]) - 1, parseInt(endDateSplit[0]));
            }

            noOfDays = ((endDate.valueOf() - startDate.valueOf()) / (1000 * 60 * 60 * 24));

            returnValue.startDate = startDate;
            returnValue.endDate = endDate;
            returnValue.noOfDays = noOfDays + 1;

        } else if (_startDate) {
            if (this.dateFormat.indexOf('dd') === 0
                && this.dateFormat.indexOf('mm') === 3
                && this.dateFormat.indexOf('yyyy') === 6) {
                let startDateSplit = _startDate.split(this.dateDelimiter);
                startDate = new Date(parseInt(startDateSplit[2]), parseInt(startDateSplit[1]) - 1, parseInt(startDateSplit[0]));
                returnValue.startDate = startDate;
            }
            returnValue.startDate = startDate;

        } else if (_endDate) {
            if (this.dateFormat.indexOf('dd') === 0
                && this.dateFormat.indexOf('mm') === 3
                && this.dateFormat.indexOf('yyyy') === 6) {
                let endDateSplit = _endDate.split(this.dateDelimiter);
                endDate = new Date(parseInt(endDateSplit[2]), parseInt(endDateSplit[1]) - 1, parseInt(endDateSplit[0]));

                returnValue.endDate = endDate;
            }
            returnValue.endDate = endDate;
        }
        if (!_endDate && !_startDate) {
            return null;
        } else {
            return returnValue;
        }

    }

}
