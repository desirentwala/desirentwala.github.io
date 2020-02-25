import { Injectable } from '@angular/core';
import * as moment from 'moment';
@Injectable({
    providedIn: 'root'
})
export class MockDateConvertorService {

    /**
     * @param data contains full slot
     * data format ex: 2019-01-01T09:15:00+01:30
     */
    slotConvertion(data, duration) {
        const dateSplit = data.split('T');
        const dateToModify = dateSplit.slice(0, 1).toString();

        const time = moment(data).format('HH:mm');
        const endAt = moment(time, 'HH:mm:ss').add(duration, 'minutes').format('HH:mm');

        const now = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD');
        const startDate = moment(moment(data).utcOffset(data).format('YYYY-MM-DD'), 'YYYY-MM-DD');
        const diffDays = moment.duration(startDate.diff(now)).asDays();

        const cTime = moment().format('HH:mm');
        const appTime = Number(time.split(':').slice(0, 1).toString()) * 60 + Number(time.split(':').slice(1).toString());
        const currTime = Number(cTime.split(':').slice(0, 1).toString()) * 60 + Number(cTime.split(':').slice(1).toString());
        const diffTime =  appTime - currTime;
        const timeDate = {
            date: this.dateConvertion(dateToModify),
            start: time,
            end: endAt,
            dateDiff: diffDays,
            timeDiff: diffTime
        };
        return timeDate;
    }

    /**
     * @param data contains date to be converted
     */
    dateConvertion(data) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
            'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date(data);
        const date = {
            day: days[now.getDay()],
            month: months[now.getMonth()],
            year: now.getFullYear(),
            date: data.split('-').splice(2).toString()
        };
        return date;
    }
}
