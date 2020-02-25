import { Injectable } from '@angular/core';
import { IMyDate } from '../interfaces/ncp-date.interface';
import * as jalaali from 'jalaali-js';
import { NonGregorianTypes } from '../non-gregorian-types.constants';

@Injectable()
export class DateValidatorService {
    public enDaysInMonth: Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    public jlDaysInMonth: Array<number> = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    isDateValid(date: string, dateFormat: string, nonGregorianType: string): IMyDate {
        let daysInMonth = this.enDaysInMonth;
        let returnDate: IMyDate = { day: 0, month: 0, year: 0, dayTxt: '' };
        if (date) {

            if (date.length !== 10) {
                return returnDate;
            }

            let separator = dateFormat.replace(/[dmy]/g, '')[0];

            let parts = date.split(separator);
            if (parts.length !== 3) {
                return returnDate;
            }

            let dpos = dateFormat.indexOf('dd');
            let mpos = dateFormat.indexOf('mm');
            let ypos = dateFormat.indexOf('yyyy');

            if (dpos !== -1 && mpos !== -1 && ypos !== -1) {
                let day = parseInt(date.substring(dpos, dpos + 2)) || 0;
                let month = parseInt(date.substring(mpos, mpos + 2)) || 0;
                let year = parseInt(date.substring(ypos, ypos + 4)) || 0;

                if (day === 0 || month === 0 || year === 0) {
                    return returnDate;
                }
                if (nonGregorianType === NonGregorianTypes.PERSIAN) {
                    if (jalaali.isValidJalaaliDate(year, month, day)) {
                        return { day: day, month: month, year: year, dayTxt: '' }
                    } else {
                        return returnDate;
                    }
                } else {
                    if (year < 1900 || year > 2222 || month < 1 || month > 12) {
                        return returnDate;
                    }

                    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                        daysInMonth[1] = 29;
                    }

                    if (day < 1 || day > daysInMonth[month - 1]) {
                        return returnDate;
                    }

                    // Valid date
                    return { day: day, month: month, year: year, dayTxt: '' };
                }
            }
            return returnDate;
        }
    }
}