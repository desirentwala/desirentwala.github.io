import { UtilsService } from '../utils/utils.service';
import { ChangeDetectorRef, Component, forwardRef, HostListener, Input, NgModule, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../core/services/config.service';
import { TooltipModule } from "../tooltip/index";
const noop = () => {
};

export const CUSTOM_TIME_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimePicker),
    multi: true
};

@Component({
    selector: 'time-picker',
    templateUrl: './time-picker.component.html',
    providers: [CUSTOM_TIME_VALUE_ACCESSOR],
})

export class TimePicker implements ControlValueAccessor, OnInit {

    public innerValue;
    public hour;
    public minute;
    public second;
    public meridiem;
    public time;
    public timeValue;
    public showTimepicker: boolean = false;
    public today = new Date();
    public hourString;
    public minuteString;
    public secondString;
    public maxLength = 8;
    public acceptPattern: RegExp = /^[0-9]{2}/;
    backspaceFlag: boolean = false;
    elementControl = new FormControl();
    config;
    @Input() minuteInterval: number = 1;
    @Input() placeHolder = 'hh:mm:ss';
    @Input() timeFormat: string = '24:00';
    @Input() readOnlyFlag = false;
    @Input() elementId: any;
    @Input() customFlag: boolean = false;
    @Input() timePickerClass: any;
    @Input() inputClass: any;
    @Input() time12hrControl = new FormControl();

    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    @Input() elementLabel: string;
    @Input() mandatoryFlag: string;
    @Input() defaultTime: boolean = true;
    previousTime;
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    height: string = '34px';
    constructor(_config: ConfigService, public utilsService: UtilsService, public changeRef: ChangeDetectorRef) {
        this.config = _config;
        this.hour = this.today.getHours();
        this.minute = this.today.getMinutes();
        this.second = this.today.getSeconds();
        this.setTime(this.hour, this.minute, this.second);
        this.value = this.time;
        // this.timeFormat = this.config.get('timeFormat');
        this.elementControl.patchValue(this.time);
        this.elementControl.updateValueAndValidity();
    }


    @HostListener('mouseleave')
    closeTimePicker() {
        this.showTimepicker = false;
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
        if (this.timeFormat == '12:00') {
            this.validateTime(this.time12hrControl.value);
        } else {
            if (value){
                this.validateTime(value);
            }
        }
    }


    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onModelChange = fn;
    }
    inputTime(event) {
        this.showTimepicker = false;

        if (event.code !== 'Backspace') {
            if (this.timeFormat == '24:00') {
                if (this.elementControl.value && this.elementControl.value.length < 9) {
                    if (!this.backspaceFlag) {

                        if (this.elementControl.value.length == 2 || this.elementControl.value.length == 5) {
                            let formatString = this.elementControl.value + ':';
                            this.elementControl.patchValue(formatString);
                            this.elementControl.updateValueAndValidity();

                        }

                    } else if (this.backspaceFlag) {
                        if (this.elementControl.value.length === 3 || this.elementControl.value.length == 6) {
                            let formatString: string = this.elementControl.value;
                            let previousValue = formatString.substr(0, this.elementControl.value.length - 1);
                            let newKey = formatString.substr(this.elementControl.value.length - 1, 1);
                            let formatValue = previousValue + ':' + newKey;
                            this.elementControl.patchValue(formatValue);
                            this.elementControl.updateValueAndValidity();

                        }
                    }
                }
                if (this.elementControl.value.length == 8) {
                    this.validateTime(this.elementControl.value);
                    this.setTime(this.hour, this.minute, this.second);
                }
            } else if (this.timeFormat === '12:00') {
                if (this.elementControl.value && this.elementControl.value.length < 12) {
                    if (!this.backspaceFlag) {

                        if (this.elementControl.value.length == 2 || this.elementControl.value.length == 5) {
                            let formatString = this.elementControl.value + ':';
                            this.elementControl.patchValue(formatString);
                            this.elementControl.updateValueAndValidity();

                        }
                        if (this.elementControl.value.length == 8) {
                            let formatString = this.elementControl.value + ' ';
                            this.elementControl.patchValue(formatString);
                            this.elementControl.updateValueAndValidity();

                        }

                    } else if (this.backspaceFlag) {
                        if (this.elementControl.value.length === 3 || this.elementControl.value.length == 6) {
                            let formatString: string = this.elementControl.value;
                            let previousValue = formatString.substr(0, this.elementControl.value.length - 1);
                            let newKey = formatString.substr(this.elementControl.value.length - 1, 1);
                            let formatValue = previousValue + ':' + newKey;
                            this.elementControl.patchValue(formatValue);
                            this.elementControl.updateValueAndValidity();

                        }
                        if (this.elementControl.value.length == 9) {
                            let formatString: string = this.elementControl.value;
                            let previousValue = formatString.substr(0, this.elementControl.value.length - 1);
                            let newKey = formatString.substr(this.elementControl.value.length - 1, 1);
                            let formatValue = previousValue + ' ' + newKey;
                            this.elementControl.patchValue(formatValue);
                            this.elementControl.updateValueAndValidity();
                        }
                    }
                }

                if (this.elementControl.value.length == 11) {
                    this.validateTime(this.elementControl.value);
                    this.setTime(this.hour, this.minute, this.second);
                    this.convert_to_24h(this.time);
                }
            }
        } else {
            this.backspaceFlag = true;
        }
    }
    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onModelTouched = fn;
    }


    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.elementControl.disable();
            this.readOnlyFlag = true;
        } else {
            this.elementControl.enable();
            this.readOnlyFlag = false;
        }
    }

    ngOnInit() {
        if (this.timeFormat === '12:00') {
            this.maxLength = 11;
            this.placeHolder = 'hh:mm:ss PM';
        }
    }

    openTimePicker() {

        this.showTimepicker = !this.showTimepicker;
    }

    closeTimepicker() {
        this.showTimepicker = false;
    }

    inputClick() {
        this.showTimepicker = false;
        this.elementControl.patchValue('');
        this.elementControl.updateValueAndValidity();
    }
    inputBlur() {
        this.validateTime(this.value);
    }
    hourUp() {
        this.hour++;
        if (this.hour >= 24)
            this.hour = 0;
        this.setTime(this.hour, this.minute, this.second);

    }
    hourDown() {
        this.hour--;
        if (this.hour == -1)
            this.hour = 23;
        this.setTime(this.hour, this.minute, this.second);
    }
    minuteUp() {
        this.minute = this.minute + this.minuteInterval;
        if (this.minute >= 60) {
            this.minute = 0;
            // this.hour++;
            this.hourUp();
        }

        this.setTime(this.hour, this.minute, this.second);
    }
    minuteDown() {
        this.minute = this.minute - this.minuteInterval;
        if (this.minute <= -1) {
            this.minute = 59;
            // this.hour--;
            this.hourDown();
        }

        this.setTime(this.hour, this.minute, this.second);
    }

    secondUp() {
        this.second = this.second + 1;
        if (this.second >= 60) {
            this.second = 0;
            this.minute++;
            this.minuteUp();
        }

        this.setTime(this.hour, this.minute, this.second);
    }
    secondDown() {
        this.second = this.second - 1;
        if (this.second <= -1) {
            this.second = 59;
            this.minute--;
            this.minuteDown();
        }

        this.setTime(this.hour, this.minute, this.second);
    }
    meridiemChange() {

        this.meridiem === 'AM' ? this.meridiem = 'PM' : this.meridiem = 'AM';
        this.setTime(this.hour, this.minute, this.second, this.meridiem);
    }

    setTime(hr, mins, sec, meridiem?) {
        if (this.timeFormat == '12:00') {
            if (!meridiem) {
                if (hr > 12) {
                    hr = ((hr + 11) % 12 + 1);
                    this.meridiem = 'PM';
                } else if (hr <= 12) {
                    hr = ((hr + 11) % 12 + 1);
                    this.meridiem = 'AM';
                }

                hr = ('0' + hr).slice(-2);
                mins = ('0' + mins).slice(-2);
                sec = ('0' + sec).slice(-2);
                this.hourString = hr;
                this.minuteString = mins;
                this.secondString = sec;
                this.time = hr + ':' + mins + ':' + sec + ' ' + this.meridiem;
                // this.timeValue = hr + ':' + mins + ' ' + this.meridiem;
                this.convert_to_24h(this.time);
            } else if (meridiem) {
                if (hr > 12) {
                    hr = ((hr + 11) % 12 + 1);
                } else if (hr <= 12) {
                    hr = ((hr + 11) % 12 + 1);
                }

                hr = ('0' + hr).slice(-2);
                mins = ('0' + mins).slice(-2);
                sec = ('0' + sec).slice(-2);
                this.hourString = hr;
                this.minuteString = mins;
                this.secondString = sec;
                this.time = hr + ':' + mins + ':' + sec + ' ' + meridiem;
                // this.timeValue = hr + ':' + mins + ' ' + meridiem;
                this.convert_to_24h(this.time);

            }
        } else if (this.timeFormat == '24:00') {
            hr = ('0' + hr).slice(-2);
            mins = ('0' + mins).slice(-2);
            sec = ('0' + sec).slice(-2);
            this.hourString = hr;
            this.minuteString = mins;
            this.secondString = sec;
            this.time = hr + ':' + mins + ':' + sec;
            this.timeValue = hr + ':' + mins + ':' + sec;
        }
        this.value = this.time;
    }

    validateTime(val) {
        let hour, mins, sec, mer;
        let pattern: RegExp = new RegExp(<RegExp>this.acceptPattern);
        if (val && pattern.test(val)) {
            if (this.timeFormat === '24:00') {
                let timeString: string = val;
                hour = timeString.substr(0, 2);
                mins = timeString.substr(3, 2);
                sec = timeString.substr(6, 2);
                this.today = new Date();
                if (hour > 23 && mins > 59 && sec > 59) {
                    this.hour = this.today.getHours();
                    this.minute = this.today.getMinutes();
                    this.second = this.today.getSeconds();
                } else if (hour > 23) {
                    this.hour = this.today.getHours();
                    this.minute = mins;
                    this.second = sec;
                } else if (mins > 59) {
                    this.hour = hour;
                    this.minute = this.today.getMinutes();
                    this.second = sec;
                } else if (sec > 59) {
                    this.hour = hour;
                    this.minute = mins;
                    this.second = this.today.getSeconds();
                } else {
                    this.hour = hour;
                    this.minute = mins;
                    this.second = sec;
                    this.time = val;
                    this.value = this.time;
                    this.elementControl.patchValue(this.time);
                    this.elementControl.updateValueAndValidity();
                }
            } else {
                let timeString: string = val;
                hour = timeString.substr(0, 2);
                mins = timeString.substr(3, 2);
                sec = timeString.substr(6, 2);
                mer = timeString.substr(9, 2).toUpperCase();
                this.today = new Date();
                if (hour > 12 && mins > 59 && sec > 59) {
                    this.hour = 12;
                    this.minute = this.today.getMinutes();
                    this.second = this.today.getSeconds();
                    this.meridiem = mer;
                } else if (hour > 12) {
                    this.hour = 12;
                    this.minute = mins;
                    this.second = sec;
                    this.meridiem = mer;
                } else if (mins > 59) {
                    this.hour = hour;
                    this.minute = this.today.getMinutes();
                    this.second = sec;
                    this.meridiem = mer;
                } else if (sec > 59) {
                    this.hour = hour;
                    this.minute = mins;
                    this.second = this.today.getSeconds();
                    this.meridiem = mer;
                } else if (mer !== 'PM' || mer !== 'AM') {
                    this.hour = hour;
                    this.minute = mins;
                    this.second = sec;
                    this.meridiem = 'PM';
                } else {
                    this.hour = hour;
                    this.minute = mins;
                    this.second = sec;
                    this.time = val;
                    this.elementControl.patchValue(this.time);
                    this.elementControl.updateValueAndValidity();
                }
                this.setTime(this.hour, this.minute, this.second, this.meridiem);
                this.convert_to_24h(this.time);
            }
            this.setTime(this.hour, this.minute, this.second);
        } else if (this.defaultTime === undefined || this.defaultTime) {
            if (this.timeFormat == '24:00') {
                this.today = new Date();
                this.hour = this.today.getHours();
                this.minute = this.today.getMinutes();
                this.second = this.today.getSeconds();
                this.setTime(this.hour, this.minute, this.second);
                this.time = this.value;
                this.elementControl.patchValue(this.time);
                this.elementControl.updateValueAndValidity();
            } else {
                this.today = new Date();
                this.hour = this.today.getHours();
                this.minute = this.today.getMinutes();
                this.second = this.today.getSeconds();
                this.setTime(this.hour, this.minute, this.second);
                this.time = this.value;
                this.elementControl.patchValue(this.time);
                this.convert_to_24h(this.time);
                this.elementControl.updateValueAndValidity();

            }
        } else {
            this.time = '';
            this.value = '';
            this.elementControl.patchValue('');
            this.elementControl.updateValueAndValidity();
        }
    }

    convert_to_24h(time_str) {

        let time = time_str.match(/(\d+):(\d+):(\d+) (\w+)/);
        let hrs = Number(time[1]);
        let mins = Number(time[2]);
        let sec = Number(time[3]);
        let mer = time[4];

        if (mer == 'PM' && hrs < 12) {
            hrs = hrs + 12;
        }
        else if (mer == 'AM' && hrs == 12) {
            hrs = hrs - 12;
        }

        let hr = ('0' + hrs).slice(-2);
        let min = ('0' + mins).slice(-2);
        let se = ('0' + sec).slice(-2);
        let value = hr + ':' + min + ':' + se;
        this.time12hrControl.setValue(value);
        this.time12hrControl.updateValueAndValidity();
    };

}
export const UI_TIME_DIRECTIVES = [TimePicker];
@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule],
    declarations: UI_TIME_DIRECTIVES,
    exports: UI_TIME_DIRECTIVES,
})
export class UiTimepickerModule { }