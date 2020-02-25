import {IMyDayLabels} from './ncp-day-labels.interface';
import {IMyMonthLabels} from './ncp-month-labels.interface';
import {IMyDatesLabels} from './ncp-dates-labels.interface';
import {IMyDate} from './ncp-date.interface';

export interface IMyOptions {
    dayLabels?: IMyDayLabels;
    monthLabels?: IMyMonthLabels;
    datesLabels?: IMyDatesLabels;
    dateFormat?: string;
    todayBtnTxt?: string;
    firstDayOfWeek?: string;
    sunHighlight?: boolean;
    disabledUntil?: IMyDate;
    disabledSince?: IMyDate;
    disableWeekends?: boolean;
    height?: string;
    width?: string;
    inline?: boolean;
}