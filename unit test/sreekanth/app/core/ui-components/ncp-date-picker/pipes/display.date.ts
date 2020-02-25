import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { DateDuration } from './date.duration';
import * as jalaali from 'jalaali-js';
import { NonGregorianTypes } from '../non-gregorian-types.constants';
@Pipe({
    name: 'displayDate'
})

export class DisplayDate implements PipeTransform {
    dateFormat: any = '';
    constructor(public configService: ConfigService, public dateDuration: DateDuration) {
    }
    transform(dateString, dateDisplayType): any {
        let transformedDateString: String = '';
        let dateFormat = this.configService.get('dateFormat');
        if (dateFormat) {
            this.dateFormat = dateFormat.toLowerCase();
        }
        if (dateString) {
            let date = this.dateDuration.transform(dateString).startDate;
            if (dateDisplayType === NonGregorianTypes.PERSIAN) {
                transformedDateString = this.displayInPersian(date);
            }
            // else if(){
            // For other Date Types.
            // }
        }
        return transformedDateString;
    }
    preZero(val: string): string {
        // Prepend zero if smaller than 10
        return parseInt(val) < 10 ? '0' + val : val;
    }
    displayInPersian(date: Date) {
        let transformedDateString: String = ''
        let jalaaliDate = jalaali.toJalaali(date.getFullYear(), date.getMonth(), date.getDate());
        if (jalaali.isValidJalaaliDate(jalaaliDate['jy'], jalaaliDate['jm'], jalaaliDate['jd'])) {
            transformedDateString = this.dateFormat.replace('yyyy', jalaaliDate['jy'])
                .replace('mm', this.preZero(jalaaliDate['jm']))
                .replace('dd', this.preZero(jalaaliDate['jd']));
        }
        return transformedDateString;
    }

}
