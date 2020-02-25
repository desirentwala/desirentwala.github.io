import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as jalaali from 'jalaali-js';
import { ConfigService } from '../../../core/services/config.service';
import { EventService } from '../../services/event.service';
import { IMyDate, IMyDatesLabels, IMyDayLabels, IMyMonth, IMyMonthLabels, IMyWeek } from './interfaces/index';
import { NonGregorianTypes } from './non-gregorian-types.constants';
import { DateDuration } from './pipes/date.duration';
import { DateFormatService } from './services/ncp-date-picker.date.format.service';
import { DateValidatorService } from './services/ncp-date-picker.date.validator.service';
import { LocaleService } from './services/ncp-date-picker.locale.service';


const noop = () => {
};
export const CUSTOM_DATE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NcpDatePicker),
    multi: true
};

@Component({
    selector: 'ncp-date-picker',
    templateUrl: './ncp-date-picker.component.html',
    providers: [CUSTOM_DATE_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None
})

export class NcpDatePicker implements OnChanges, ControlValueAccessor, OnInit, OnDestroy {
    @Input() parentIndex;
    @Input() indexes;
    @Input() superParentIndex;
    @Input() options: any;
    @Input() locale: string;
    @Input() defaultMonth: string;
    @Input() selDate: string;
    @Input() disableDate: boolean = false;
    @Input() readonlyInput: boolean = false;
    @Input() customFlag: boolean = false;
    @Input() datepickerClass: string = '';
    @Input() changeId: string;
    @Input() overrideDisableDates: boolean = false;
    @Input() fieldTabId: any;
    @Input() tooltipPlacement: string = 'right';
    @Input() tooltipTitle: string;
    @Input() elementId: string;
    @Input() elementLabel: string;
    @Input() mandatoryFlag: string;
    @Input() datePickerInputClass: string = '';
    @Input() hasImageIcon: boolean = false;
    @Input() customImageIcon: any = '';
    @Input() imgIconSrc: string = '';
    @Input() overwriteNonGregorianType: boolean = false;
    @Input() nonGregorianType: string = '';
    gregorianFormControl = new FormControl();
    public innerValue;
    showSelector: boolean = false;
    visibleMonth: IMyMonth = { monthTxt: '', monthNbr: 0, yearTxt: '', year: 0 };
    selectedMonth: IMyMonth = { monthTxt: '', monthNbr: 0, yearTxt: '', year: 0 };
    selectedDate: IMyDate = { year: 0, month: 0, day: 0, dayTxt: '' };
    weekDays: Array<string> = [];
    dates: Array<Object> = [];
    selectionDayTxt: string = '';
    invalidDate: boolean = false;
    dayIdx: number = 0;
    today: Date = null;
    dateDelimiter: string;
    dateDelimitterIndex: number[] = [];
    backspaceFlag: boolean = false;

    PREV_MONTH: number = 1;
    CURR_MONTH: number = 2;
    NEXT_MONTH: number = 3;

    dayLabels: IMyDayLabels = {};
    monthLabels: IMyMonthLabels = {};
    datesLabels: IMyDatesLabels = {};
    dateFormat: string = '';
    todayBtnTxt: string = '';
    firstDayOfWeek: string = '';
    sunHighlight: boolean = true;
    readOnlyFlag: boolean = false;

    height: string = '30px';
    width: string = '100%';
    selectionTxtFontSize: string = '18px';
    disabledUntil: IMyDate = { year: 0, month: 0, day: 0, dayTxt: '' };
    disableSince: IMyDate = { year: 0, month: 0, day: 0, dayTxt: '' };
    disableWeekends: boolean = false;
    inline: boolean = false;
    alignSelectorRight: boolean = false;
    indicateInvalidDate: boolean = true;
    showDateFormatPlaceholder: boolean = false;
    elementControl = new FormControl();
    config: ConfigService;
    dateDuration;
    dateFormatService;
    eventHandler: EventService;
    datePickerTop: boolean = false;
    invalidFlag: boolean = false;
    constructor(public elem: ElementRef,
        public localeService: LocaleService,
        public dateValidatorService: DateValidatorService,
        config: ConfigService,
        _dateDuration: DateDuration,
        _dateFormatService: DateFormatService,
        _eventHandler: EventService,
        public changeRef: ChangeDetectorRef) {
        this.config = config;
        this.setLocaleOptions();
        this.dateDuration = _dateDuration;
        this.dateFormatService = _dateFormatService;
        this.eventHandler = _eventHandler;
        this.today = new Date();
    }
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    @HostListener('mouseleave')
    closeDatePicker() {
        this.showSelector = false;
        this.changeRef.detectChanges();
        this.changeRef.markForCheck();
    }
    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onModelChange(v);
        }
    }

    writeValue(value: any) {

        this.dateFormat = this.config.get('dateFormat');
        this.dateFormat = this.dateFormat.toLowerCase();
        this.dateDelimiter = this.config.get('dateDelimiter');

        if (this.selectionDayTxt === value) {
            this.value = this.selectionDayTxt;
            this.selectedDate = this.parseSelectedDate(this.selectionDayTxt);
            this.elementControl.patchValue(this.selectionDayTxt);
            this.elementControl.updateValueAndValidity();
        } else if (value) {
            let dateDuration = this.dateDuration.transform(value);
            let date = dateDuration.startDate;
            if (this.nonGregorianType) {
                this.selectDate({ day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() });
            } else {
                this.selectionDayTxt = this.dateFormatService.formatDate(date);
                this.selectedDate = this.parseSelectedDate(this.selectionDayTxt);
                this.value = this.selectionDayTxt;
                this.elementControl.patchValue(this.selectionDayTxt);
                this.elementControl.updateValueAndValidity();

            }
        }
        else {
            this.assignNullValue();
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onModelChange = fn;
    }
    ngOnInit() {
        this.nonGregorianType = this.overwriteNonGregorianType ? this.nonGregorianType : this.config.get('nonGregorianType') ? this.config.get('nonGregorianType') : '';
        this.eventHandler.validateTabSub.subscribe((data) => {
            let classNames: string = this.elem.nativeElement.className;
            if (this.fieldTabId === data['id']) {
                if (classNames && classNames.includes('ng-invalid')) {
                    this.invalidFlag = true;
                    this.invalidDate = true
                }
            }
        });
        this.today = new Date();
        if (this.nonGregorianType === NonGregorianTypes.PERSIAN) {
            this.today = jalaali.toJalaali(this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate());
            this.today = new Date(this.today['jy'], this.today['jm'] - 1, this.today['jd']);
        }

    }
    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onModelTouched = fn;
    }
    setLocaleOptions(): void {
        if (this.locale === undefined)
            this.locale = this.config.getCustom('user_lang');
        let options = this.localeService.getLocaleOptions(this.locale);
        for (let prop in options) {
            if (options[prop] instanceof Object) {
                (this)[prop] = JSON.parse(JSON.stringify(options[prop]));
            } else {
                (this)[prop] = options[prop];
            }
        }
    }

    setOptions(): void {
        let options = ['dayLabels',
            'monthLabels',
            'dateFormat',
            'datesLabels',
            'todayBtnTxt',
            'firstDayOfWeek',
            'sunHighlight',
            'disabledUntil',
            'disableSince',
            'disableWeekends',
            'height',
            'width',
            'selectionTxtFontSize',
            'inline',
            'alignSelectorRight',
            'indicateInvalidDate',
            'showDateFormatPlaceholder'];
        for (let prop of options) {
            if (this.options && (this.options)[prop] !== undefined && (this.options)[prop] instanceof Object) {
                (this)[prop] = JSON.parse(JSON.stringify((this.options)[prop]));
            } else if (this.options && (this.options)[prop] !== undefined) {
                (this)[prop] = (this.options)[prop];
            }
        }
        if (this.nonGregorianType === NonGregorianTypes.PERSIAN) {
            if (this.disabledUntil && this.disabledUntil.year && this.disabledUntil.month && this.disabledUntil.day) {
                this.disabledUntil = jalaali.toJalaali(this.disabledUntil.year, this.disabledUntil.month, this.disabledUntil.day);
                this.disabledUntil = { year: this.disabledUntil['jy'], month: this.disabledUntil['jm'], day: this.disabledUntil['jd'], dayTxt: this.disabledUntil.dayTxt };
            }
            if (this.disableSince && this.disableSince.year && this.disableSince.month && this.disableSince.day) {
                this.disableSince = jalaali.toJalaali(this.disableSince.year, this.disableSince.month, this.disableSince.day);
                this.disableSince = { year: this.disableSince['jy'], month: this.disableSince['jm'], day: this.disableSince['jd'], dayTxt: this.disableSince.dayTxt };
            }
        }
        this.options['dateFormat'] = this.config.get('dateFormat');
        this.dateFormat = this.options['dateFormat'];
        this.dateFormat = this.dateFormat.toLowerCase();
        this.options['dateFormat'] = this.dateFormat;
        let datedelimiter = this.config.get('dateDelimiter');
        if (this.dateFormat !== null) {
            for (let i = 0; i < this.dateFormat.length; i++) {
                if (this.dateFormat[i] === datedelimiter) this.dateDelimitterIndex.push(i);
            }
        }
    }

    userDateInput(event: any): void {

        if (!this.disableDate) {
            this.invalidDate = false;
            this.invalidFlag = false;
            let target = event.srcElement || event.target;
            let elementValue = target.value;
            if (elementValue != this.selectionDayTxt) {
                let date: IMyDate = this.dateValidatorService.isDateValid(elementValue, this.dateFormat, this.nonGregorianType);
                if (event.code !== 'Backspace') {

                    if (elementValue) {
                        if ((elementValue.length == this.dateDelimitterIndex[0]
                            || elementValue.length == this.dateDelimitterIndex[1]) && !this.backspaceFlag) {
                            let formatString = elementValue + this.config.get('dateDelimiter');
                            if (this.nonGregorianType) {
                                this.gregorianFormControl.patchValue(formatString);
                                this.gregorianFormControl.updateValueAndValidity();
                            } else {
                                this.elementControl.patchValue(formatString);
                                this.elementControl.updateValueAndValidity();
                            }

                        } else if (this.backspaceFlag && (elementValue.length - 1 == this.dateDelimitterIndex[0]
                            || elementValue.length - 1 == this.dateDelimitterIndex[1])) {
                            let formatString: string = elementValue;
                            let previousValue = formatString.substr(0, elementValue.length - 1);
                            let newKey = formatString.substr(elementValue.length - 1, 1);
                            let formatValue = previousValue + this.config.get('dateDelimiter') + newKey;
                            if (this.nonGregorianType) {
                                this.gregorianFormControl.patchValue(formatValue);
                                this.gregorianFormControl.updateValueAndValidity();
                            } else {
                                this.elementControl.patchValue(formatValue);
                                this.elementControl.updateValueAndValidity();
                            }
                        }
                        if (date.day === 0 && date.month === 0 && date.year === 0) {
                            this.assignNullValue();
                        } else if ((date.day != 0 && date.month != 0 && date.year != 0) && elementValue.length === 10) {
                            this.selectDate({ day: date.day, month: date.month, year: date.year }, true);
                            this.elementControl.updateValueAndValidity();
                            this.gregorianFormControl.updateValueAndValidity();
                        }
                    }
                    else if (elementValue === "") {
                        this.assignNullValue();
                    }
                }
                else {
                    this.backspaceFlag = true;
                    if (elementValue === "") {
                        this.assignNullValue();
                    }
                }
            }
        }
    }
    parseOptions(): void {
        this.setOptions();
        if (this.locale) {
            this.setLocaleOptions();
        }
        let days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        this.dayIdx = days.indexOf(this.firstDayOfWeek);
        if (this.dayIdx !== -1) {
            let idx = this.dayIdx;
            for (let i = 0; i < days.length; i++) {
                this.weekDays.push(this.dayLabels[days[idx]]);
                idx = days[idx] === 'sa' ? 0 : idx + 1;
            }
        }
        if (this.inline) {
            // this.openBtnClicked();
        }

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('selDate')) {
            this.selectionDayTxt = changes['selDate'].currentValue;
            if (this.nonGregorianType === NonGregorianTypes.PERSIAN) {
                this.selectedDate = this.parsePersianSelectedDate(this.selectionDayTxt);
            } else {
                this.selectedDate = this.parseSelectedDate(this.selectionDayTxt);
            }
            this.elementControl.patchValue(this.selectionDayTxt);
            this.value = this.selectionDayTxt;
        }

        if (changes.hasOwnProperty('defaultMonth')) {
            this.selectedMonth = this.parseSelectedMonth((changes['defaultMonth'].currentValue).toString());
        }

        if (changes.hasOwnProperty('locale')) {
            this.locale = changes['locale'].currentValue;
        }

        if (changes.hasOwnProperty('options')) {
            this.options = changes['options'].currentValue;
        }
        let classNames: string = this.elem.nativeElement.className;
        if (classNames && classNames.includes('ng-valid')) {
            this.invalidFlag = false;
        }

        this.weekDays.length = 0;
        this.parseOptions();
    }

    ngOnDestroy() {
        this.eventHandler.validateTabSub.observers.pop();
    }
    openBtnClicked(): void {

        if (!this.disableDate) {
            this.invalidFlag = false;
            this.showSelector = !this.showSelector;
            if (this.showSelector || this.inline) {
                let y = 0, m = 0;
                if (this.selectedDate.year === 0 && this.selectedDate.month === 0 && this.selectedDate.day === 0) {
                    if (this.selectedMonth.year === 0 && this.selectedMonth.monthNbr === 0) {
                        y = this.today.getFullYear();
                        m = this.today.getMonth() + 1;
                    } else {
                        y = this.selectedMonth.year;
                        m = this.selectedMonth.monthNbr;
                    }
                } else {
                    y = this.selectedDate.year;
                    m = this.selectedDate.month;
                }
                // Set current month
                // this.visibleMonth = { monthTxt: this.monthLabels[m], monthNbr: m, year: this.setLocaleYear(y) };
                this.visibleMonth = { monthTxt: this.monthLabels[m], monthNbr: m, yearTxt: this.setLocaleYear(y), year: y };

                // Create current month
                this.generateCalendar(m, y);
                let height = window.innerHeight;
                let clientTop = document.getElementById('inputId').getBoundingClientRect();
                // let datePick = document.getElementById('datePick').getBoundingClientRect();
                if (clientTop.top + 240 >= height) {
                    this.datePickerTop = true;
                } else {
                    this.datePickerTop = false;
                }
            }

        }

    }

    prevMonth(): void {
        let m = this.visibleMonth.monthNbr;
        let y = this.visibleMonth.year;
        if (m === 1) {
            m = 12;
            y--;
        } else {
            m--;
        }
        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, yearTxt: this.setLocaleYear(y), year: y };
        this.generateCalendar(m, y);
    }

    nextMonth(): void {
        let m = this.visibleMonth.monthNbr;
        let y = this.visibleMonth.year;
        if (m === 12) {
            m = 1;
            y++;
        } else {
            m++;
        }
        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, yearTxt: this.setLocaleYear(y), year: y };
        this.generateCalendar(m, y);
    }

    prevYear(): void {
        this.visibleMonth.year--;
        this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year);
    }

    nextYear(): void {
        this.visibleMonth.year++;
        this.generateCalendar(this.visibleMonth.monthNbr, this.visibleMonth.year);
    }

    todayClicked(): void {
        // Today selected
        let m = this.today.getMonth() + 1;
        let y = this.today.getFullYear();
        this.selectDate({ day: this.today.getDate(), month: m, year: y }, true);
        if (this.inline) {
            this.visibleMonth = { monthTxt: this.monthLabels[m], monthNbr: m, yearTxt: this.setLocaleYear(y), year: y };
            this.generateCalendar(m, y);
        }
    }

    cellClicked(cell: any): void {
        // Cell clicked in the selector
        if (cell.cmo === this.PREV_MONTH) {
            // Previous month of day
            this.prevMonth();
            this.selectDate(cell.dateObj, true);
        } else if (cell.cmo === this.CURR_MONTH) {
            // Current month of day
            this.selectDate(cell.dateObj, true);
        } else if (cell.cmo === this.NEXT_MONTH) {
            // Next month of day
            this.nextMonth();
            this.selectDate(cell.dateObj, true);
        }
        this.changeRef.markForCheck();

    }

    selectDate(date: any, fromCellClick?: boolean): void {
        if (!fromCellClick && this.nonGregorianType) {
            if (this.nonGregorianType === NonGregorianTypes.PERSIAN) {
                date = jalaali.toJalaali(date.year, date.month, date.day);
                date = { day: date.jd, month: date.jm, year: date.jy };
            }
        }

        if (this.nonGregorianType) {
            let greGorianSelectedDate;
            if (this.nonGregorianType === NonGregorianTypes.PERSIAN) {
                let greGorianDate = jalaali.toGregorian(date.year, date.month, date.day);
                greGorianSelectedDate = { day: greGorianDate.gd, month: greGorianDate.gm, year: greGorianDate.gy };
            }
            let greGorianSelectedDayTxt = this.formatDate(greGorianSelectedDate);
            if (this.gregorianFormControl.value === null || this.gregorianFormControl.value != greGorianSelectedDayTxt) {
                this.gregorianFormControl.patchValue(greGorianSelectedDayTxt);
                this.gregorianFormControl.updateValueAndValidity();
            }
            this.selectedDate = { day: date.day, month: date.month, year: date.year, dayTxt: this.datesLabels[date.day] };
            this.selectionDayTxt = this.formatDate(this.selectedDate);
            this.value = greGorianSelectedDayTxt;
        } else {
            this.selectedDate = { day: date.day, month: date.month, year: date.year, dayTxt: this.datesLabels[date.day] };
            this.selectionDayTxt = this.formatDate(this.selectedDate);
            this.elementControl.patchValue(this.selectionDayTxt);
            this.elementControl.updateValueAndValidity();
            this.value = this.selectionDayTxt;
        }
        this.showSelector = false;
        this.eventHandler.setEvent('change', this.changeId, { date: this.selectedDate, formatted: this.selectionDayTxt, epoc: this.getEpocTime(this.selectedDate), 'index': this.indexes - 1, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
        this.invalidDate = false;
    }

    getEpocTime(date: IMyDate): number {
        // Returns epoc timestamp from given date
        return Math.round(new Date(date.year, date.month - 1, date.day).getTime() / 1000.0);
    }

    preZero(val: string): string {
        // Prepend zero if smaller than 10
        return parseInt(val) < 10 ? '0' + val : val;
    }

    formatDate(val: any): string {
        return this.dateFormat.replace('yyyy', val.year)
            .replace('mm', this.preZero(val.month))
            .replace('dd', this.preZero(val.day));
    }

    monthText(m: number): string {
        // Returns mont as a text
        return this.monthLabels[m];
    }

    monthStartIdx(y: number, m: number): number {
        // Month start index
        let d = new Date();
        d.setDate(1);
        d.setMonth(m - 1);
        d.setFullYear(y);
        let idx = d.getDay() + this.sundayIdx();
        return idx >= 7 ? idx - 7 : idx;
    }

    daysInMonth(m: number, y: number): number {
        // Return number of days of current month
        switch (this.nonGregorianType) {
            case NonGregorianTypes.PERSIAN: {
                return jalaali.jalaaliMonthLength(y, m);
            }
            default: {
                return new Date(y, m, 0).getDate();
            }
        }
    }

    daysInPrevMonth(m: number, y: number): number {
        // Return number of days of the previous month
        if (m === 1) {
            m = 12;
            y--;
        } else {
            m--;
        }
        return this.daysInMonth(m, y);
    }

    isCurrDay(d: number, m: number, y: number, cmo: any): boolean {
        // Check is a given date the current date
        return d === this.today.getDate() && m === this.today.getMonth() + 1 && y === this.today.getFullYear() && cmo === 2;
    }

    isDisabledDay(date: IMyDate): boolean {
        if (this.overrideDisableDates) return false;
        // Check is a given date <= disabledUntil or given date >= disabledSince or disabled weekend
        let givenDate = this.getTimeInMilliseconds(date);
        if (this.disabledUntil.year !== 0 && this.disabledUntil.month !== 0 && this.disabledUntil.day !== 0 && givenDate <= this.getTimeInMilliseconds(this.disabledUntil)) {
            return true;
        }
        if (this.disableSince.year !== 0 && this.disableSince.month !== 0 && this.disableSince.day !== 0 && givenDate >= this.getTimeInMilliseconds(this.disableSince)) {
            return true;
        }
        if (this.disableWeekends) {
            let dayNbr = this.getDayNumber(date);
            if (dayNbr === 0 || dayNbr === 6) {
                return true;
            }
        }
        return false;
    }

    getTimeInMilliseconds(date: IMyDate): number {
        return new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0).getTime();
    }

    getDayNumber(date: IMyDate): number {
        // Get day number: sun=0, mon=1, tue=2, wed=3 ...
        let d = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
        return d.getDay();
    }

    sundayIdx(): number {
        // Index of Sunday day
        return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
    }

    generateCalendar(m: number, y: number, fromHtml?: boolean): void {
        this.dates.length = 0;
        let monthStart = this.monthStartIdx(y, m);
        let dInThisM = this.daysInMonth(m, y);
        let dInPrevM = this.daysInPrevMonth(m, y);
        let dayNbr = 1;
        let cmo = this.PREV_MONTH;
        this.setOptions();
        for (let i = 1; i < 7; i++) {
            let week: IMyWeek[] = [];
            if (i === 1) {
                // First week
                let pm = dInPrevM - monthStart + 1;
                // Previous month
                for (let j = pm; j <= dInPrevM; j++) {
                    let date: IMyDate;

                    date = { year: y, month: m - 1, day: j, dayTxt: this.datesLabels[j] };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(j, m, y, cmo), dayNbr: this.getDayNumber(date), disabled: this.isDisabledDay(date) });
                }

                cmo = this.CURR_MONTH;
                // Current month
                let daysLeft = 7 - week.length;
                for (let j = 0; j < daysLeft; j++) {
                    let date: IMyDate;
                    date = { year: y, month: m, day: dayNbr, dayTxt: this.datesLabels[dayNbr] };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(dayNbr, m, y, cmo), dayNbr: this.getDayNumber(date), disabled: this.isDisabledDay(date) });
                    dayNbr++;
                }
            } else {
                // Rest of the weeks
                for (let j = 1; j < 8; j++) {
                    if (dayNbr > dInThisM) {
                        // Next month
                        dayNbr = 1;
                        cmo = this.NEXT_MONTH;
                    }
                    let date: IMyDate;
                    date = { year: y, month: cmo === this.CURR_MONTH ? m : m + 1, day: dayNbr, dayTxt: this.datesLabels[dayNbr] };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(dayNbr, m, y, cmo), dayNbr: this.getDayNumber(date), disabled: this.isDisabledDay(date) });
                    dayNbr++;
                }
            }
            this.dates.push(week);
        }
        this.visibleMonth.yearTxt = this.setLocaleYear(y);
    }

    parseSelectedDate(ds: string): IMyDate {
        let date: IMyDate = { day: 0, month: 0, year: 0, dayTxt: '' };
        if (ds) {
            let fmt = this.options && this.options.dateFormat !== undefined ? this.options.dateFormat : this.dateFormat;
            let dpos = fmt.indexOf('dd');
            if (dpos >= 0) {
                date.day = parseInt(ds.substring(dpos, dpos + 2));
            }
            let mpos = fmt.indexOf('mm');
            if (mpos >= 0) {
                date.month = parseInt(ds.substring(mpos, mpos + 2));
            }
            let ypos = fmt.indexOf('yyyy');
            if (ypos >= 0) {
                date.year = parseInt(ds.substring(ypos, ypos + 4));
            }
        }
        return date;
    }

    parsePersianSelectedDate(ds: string): IMyDate {
        let date: IMyDate = { day: 0, month: 0, year: 0, dayTxt: '' };
        if (ds) {
            let fmt = this.options && this.options.dateFormat !== undefined ? this.options.dateFormat : this.dateFormat;
            let jDate = jalaali.toJalaali(new Date(ds));
            let dpos = fmt.indexOf('dd');
            if (dpos >= 0) {
                date.day = jDate['jd'];
                ds = [ds.slice(0, dpos), jDate['jd'].toString(), ds.slice(dpos + 2)].join('');
            }
            let mpos = fmt.indexOf('mm');
            if (mpos >= 0) {
                date.month = jDate['jm'];
                ds = [ds.slice(0, mpos), jDate['jm'].toString(), ds.slice(mpos + 2)].join('');
            }
            let ypos = fmt.indexOf('yyyy');
            if (ypos >= 0) {
                date.year = jDate['jy'];
                ds = [ds.slice(0, ypos), jDate['jy'].toString(), ds.slice(ypos + 4)].join('');
            }
        }
        this.selectionDayTxt = ds;
        return date;
    }

    parseSelectedMonth(ms: string): IMyMonth {
        let split = ms.split(ms.match(/[^0-9]/)[0]);
        return (parseInt(split[0]) > parseInt(split[1])) ?
            { monthTxt: '', monthNbr: parseInt(split[1]), yearTxt: '', year: parseInt(split[0]) } :
            { monthTxt: '', monthNbr: parseInt(split[0]), yearTxt: '', year: parseInt(split[1]) };
    }

    inputBlur() {
        if (!this.disableDate && !this.nonGregorianType) {
            let date: IMyDate = this.dateValidatorService.isDateValid(this.value, this.dateFormat, this.nonGregorianType);
            if (date) {
                if (date.day === 0 && date.month === 0 && date.year === 0 || this.elementControl.value === null) {
                    this.selectDate({ day: this.today.getDate(), month: this.today.getMonth() + 1, year: this.today.getFullYear() }, true);
                    this.elementControl.updateValueAndValidity();
                } else if (date.day != 0 && date.month != 0 && date.year != 0) {
                    this.selectDate({ day: date.day, month: date.month, year: date.year }, true);
                    this.elementControl.updateValueAndValidity();
                }
            }
            else if (!date) {
                this.value = "";
                this.elementControl.patchValue(this.value);
                this.elementControl.updateValueAndValidity();
            }
        }

    }
    selectAllContent(event) {
        event.target.select();
    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.elementControl.disable();
            this.gregorianFormControl.disable();
            this.readOnlyFlag = true;
        } else {
            this.elementControl.enable();
            this.gregorianFormControl.enable();
            this.readOnlyFlag = false;
        }
    }

    setLocaleYear(year: number): string {
        let localeYear: string = '', tempRem: number = 0;
        do {
            tempRem = Math.floor(year % 10);
            year = Math.floor(year / 10);
            localeYear = this.datesLabels[tempRem] + localeYear;
        } while (year >= 10);
        localeYear = this.datesLabels[year] + localeYear;
        return localeYear;
    }
    assignNullValue() {
        this.value = "";
        this.elementControl.updateValueAndValidity();
        this.selectionDayTxt = "";
        this.eventHandler.setEvent('change', this.changeId, { 'index': this.indexes - 1, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
        this.changeRef.markForCheck();
    }
}
