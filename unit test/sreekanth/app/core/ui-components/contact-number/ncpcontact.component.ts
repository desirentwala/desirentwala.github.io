import { Logger } from '../../../core/ui-components/logger/logger';
import { EventService } from '../../services/event.service';
import { UiDropdownModule } from '../dropdown/index';
import { UiTextBoxModule } from '../textbox/index';
import { TooltipModule } from '../tooltip/index';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ErrorModule } from '../error/error.component';
import { AfterContentInit, Component, forwardRef, Input, NgModule, OnChanges, OnInit } from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule
} from '@angular/forms';
const noop = () => {
};

export const NCP_CUSTOM_CONTACT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NCPContactNumberComponent),
    multi: true
};

@Component({

    selector: 'multicontact-number',
    templateUrl: './ncpcontact.html',
    providers: [NCP_CUSTOM_CONTACT_VALUE_ACCESSOR]
})

export class NCPContactNumberComponent implements ControlValueAccessor, AfterContentInit, OnChanges, OnInit {


    @Input() placeHolder: string = ' ';
    public innerValue;
    @Input() dropdownItems: any[];
    @Input() defaultValue: string = '';
    @Input() elementId: string = '';
    @Input() tooltipPlacement: string = 'right';
    @Input() tooltipTitle: string;
    @Input() textElementWidth: string;
    @Input() dropElementWidth: string;
    @Input() changeId: string;
    @Input() hasStateCode: boolean = false;
    textElementControl = new FormControl();
    textElementControlphone1 = new FormControl();
    textElementControlphone2 = new FormControl();
    textElementControlhome1 = new FormControl();
    textElementControlhome2 = new FormControl();
    textElementControlhome3 = new FormControl();
    textElementControlhome4 = new FormControl();
    textElementControloffice1 = new FormControl();
    textElementControloffice2 = new FormControl();
    textElementControloffice3 = new FormControl();
    textElementControloffice4 = new FormControl();
    textElementControlfax = new FormControl();
    dropElementControl = new FormControl();
    dropElementControlcontacttype = new FormControl();
    elementControl = new FormControl();
    @Input() elementControlhome: FormControl;
    @Input() elementControloffice: FormControl;
    @Input() elementControlfax: FormControl;
    @Input() hideArrowFlag: boolean = false;
    @Input() showCodeFlag: boolean = false;
    @Input() elementValue: any;
    @Input() acceptPattern: any;
    @Input() ph = 'Phone';
    @Input() isEnquiryFlag: boolean = false;
    @Input() customFlag: boolean = false;
    @Input() contactClass: string = '';
    @Input() customNcpContactClass: string = '';
    @Input() elementLabel: string;
    @Input() mandatoryFlag: string;
    @Input() phoneMaxLength: string;
    @Input() faxMaxLength: string;
    @Input() officeHomeMaxLengthArray: any[];
    utils: UtilsService;
    phCode: any;
    callPhoneString: string = '';
    currentPh: string = '';
    phonetype = [
        {
            'code': 'Phone',
            'desc': 'NCPLabel.phone'
        },
        {
            'code': 'Home',
            'desc': 'NCPLabel.Home'
        },
        {
            'code': 'Office',
            'desc': 'NCPLabel.office'
        },
        {
            'code': 'FAX',
            'desc': 'NCPLabel.fax'
        }
    ];
    constructor(_utils: UtilsService, public eventHandler: EventService, public _logger: Logger) {
        this.utils = _utils;
    }

    ngOnChanges(changes?) {
        if (this.elementValue !== this.value) {
            this.writeValue(this.elementValue);
        }
    }
    ngOnInit() {
        if (!this.ph) this.ph = 'Phone';
        this.phonetype.forEach((type) => {
            if (type.code == this.ph) {
                this.dropElementControlcontacttype.setValue({
                    'code': this.ph,
                    'desc': this.utils.getTranslated(type.desc)
                });
            }
        });
        this.currentPh = this.ph;
        if (this.elementControlhome) {
            if (this.elementControlhome['value']) {
                let homePhoneSplitsArray: string[] = this.elementControlhome.value.split('-');
                this.textElementControlhome1.patchValue(homePhoneSplitsArray[0] ? homePhoneSplitsArray[0] : '');
                this.textElementControlhome2.patchValue(homePhoneSplitsArray[1] ? homePhoneSplitsArray[1] : '');
                this.textElementControlhome3.patchValue(homePhoneSplitsArray[2] ? homePhoneSplitsArray[2] : '');
                this.textElementControlhome4.patchValue(homePhoneSplitsArray[3] ? homePhoneSplitsArray[3] : '');
            }
            if (this.isEnquiryFlag) {
                this.textElementControlhome1.disable();
                this.textElementControlhome2.disable();
                this.textElementControlhome3.disable();
                this.textElementControlhome4.disable();
            }
        }
        if (this.elementControloffice) {
            if (this.elementControloffice !== undefined) {
                if (this.elementControloffice.value != null) {
                    let officePhoneSplitsArray: string[] = this.elementControloffice.value.split('-');
                    this.textElementControloffice1.patchValue(officePhoneSplitsArray[0] ? officePhoneSplitsArray[0] : '');
                    this.textElementControloffice2.patchValue(officePhoneSplitsArray[1] ? officePhoneSplitsArray[1] : '');
                    this.textElementControloffice3.patchValue(officePhoneSplitsArray[2] ? officePhoneSplitsArray[2] : '');
                    this.textElementControloffice4.patchValue(officePhoneSplitsArray[3] ? officePhoneSplitsArray[3] : '');
                }
                if (this.isEnquiryFlag) {
                    this.textElementControloffice1.disable();
                    this.textElementControloffice2.disable();
                    this.textElementControloffice3.disable();
                    this.textElementControloffice4.disable();
                }
            }
        }
        if (this.elementControlfax) {
            if (this.elementControlfax.value != null) this.textElementControlfax = this.elementControlfax;
            if (this.isEnquiryFlag) this.textElementControlfax.disable();
        }

    }
    ngAfterContentInit() {
        this.textElementControl.valueChanges.subscribe(data => {
            let value = '';
            if (!this.dropElementControl.value) {
                value = '-' + data;
            } else {
                value = this.dropElementControl.value.code + '-' + data;
            }
            this.callPhoneString = "tel:" + value;
            this.elementControl.setValue(value);
        });

        this.textElementControlphone1.valueChanges.subscribe(data => {
            let value = '';
            if (!this.dropElementControl.value) {
                value = '-' + data + '-' + (this.textElementControlphone2.value ? this.textElementControlphone2.value : '');
            } else {
                value = this.dropElementControl.value.code + '-' + data + '-' + (this.textElementControlphone2.value ? this.textElementControlphone2.value : '');
            }
            this.callPhoneString = "tel:" + value;
            this.elementControl.setValue(value);
        });
        this.textElementControlphone2.valueChanges.subscribe(data => {
            let value = '';
            if (!this.dropElementControl.value) {
                value = '-' + (this.textElementControlphone1.value ? this.textElementControlphone1.value : '') + '-' + data;
            } else {
                value = this.dropElementControl.value.code + '-' + (this.textElementControlphone1.value ? this.textElementControlphone1.value : '') + '-' + data;
            }
            this.callPhoneString = "tel:" + value;
            this.elementControl.setValue(value);
        });

        this.dropElementControl.valueChanges.subscribe(data => {
            let value = '';
            if (this.hasStateCode) {
                if (!this.textElementControlphone2.value && !this.textElementControlphone1.value) {
                    if (data && data.code) {
                        value = data.code + '-';
                    }
                }
                else if (this.textElementControlphone2.value && !this.textElementControlphone1.value) {
                    if (data && data.code) {
                        value = data.code + '-' + '-' + this.textElementControlphone2.value;
                    }
                }

                else if (!this.textElementControlphone2.value && this.textElementControlphone1.value) {
                    if (data && data.code) {
                        value = data.code + '-' + this.textElementControlphone1.value + '-';
                    }
                }
                else {
                    if (data && data.code) {
                        value = data.code + '-' + this.textElementControlphone1.value + '-' + this.textElementControlphone2.value;
                    }
                }
            } else {
                if (!this.textElementControl.value) {
                    if (data && data.code) {
                        value = data.code + '-';
                    }
                } else {
                    if (data && data.code) {
                        value = data.code + '-' + this.textElementControl.value;
                    }
                }
            }

            this.callPhoneString = "tel:" + value;
            this.elementControl.setValue(value);
        });
        this.dropElementControlcontacttype.valueChanges.subscribe(data => {
            this.ph = data.code;
            this.eventHandler.setEvent('change', this.changeId, data.code);
        })

        this.textElementControlhome1.valueChanges.subscribe(data => {
            if (data.length < this.officeHomeMaxLengthArray[0]) this.concat();
            else document.getElementById('home2').focus();
        });

        this.textElementControlhome2.valueChanges.subscribe(data => {
            if (data.length < this.officeHomeMaxLengthArray[1]) this.concat();
            else document.getElementById('home3').focus();
        });

        this.textElementControlhome3.valueChanges.subscribe(data => {
            if (data.length < this.officeHomeMaxLengthArray[2]) this.concat();
            else document.getElementById('home4').focus();
        });

        this.textElementControlhome4.valueChanges.subscribe(data => {
            this.concat();
        })

        this.textElementControloffice1.valueChanges.subscribe(data => {
            if (data.length < this.officeHomeMaxLengthArray[0]) this.concatoffice();
            else document.getElementById('office2').focus();

        });

        this.textElementControloffice2.valueChanges.subscribe(data => {
            if (data.length < this.officeHomeMaxLengthArray[1]) this.concatoffice();
            else document.getElementById('office3').focus();


        });
        this.textElementControloffice3.valueChanges.subscribe(data => {
            if (data.length < this.officeHomeMaxLengthArray[2]) this.concatoffice();
            else document.getElementById('office4').focus();

        });

        this.textElementControloffice4.valueChanges.subscribe(data => {
            this.concatoffice();
        });

        this.textElementControlfax.valueChanges.subscribe(data => {
            this.elementControlfax.setValue(this.textElementControlfax.value);
        })

        this.elementControl.valueChanges.subscribe(data => {
            this.value = data;
        });

        // this.elementControlhome.valueChanges.subscribe(data => {
        //     this.value = data;
        // });

        // this.elementControloffice.valueChanges.subscribe(data => {
        //     this.value = data;
        // });

        // this.elementControlfax.valueChanges.subscribe(data => {
        //     this.value = data;
        // });

    }

    concat() {
        let value = '';

        if (this.textElementControlhome1.value)
            value = this.textElementControlhome1.value;
        if (this.textElementControlhome2.value)
            value += '-' + this.textElementControlhome2.value;
        if (this.textElementControlhome3.value)
            value += '-' + this.textElementControlhome3.value;
        if (this.textElementControlhome4.value)
            value += '-' + this.textElementControlhome4.value;
        if (value) {
            this.elementControlhome.patchValue(value);
            this.elementControlhome.updateValueAndValidity();
        }
    }

    concatoffice() {
        let value = '';
        if (this.textElementControloffice1.value)
            value = this.textElementControloffice1.value;
        if (this.textElementControloffice2.value)
            value += '-' + this.textElementControloffice2.value;
        if (this.textElementControloffice3.value)
            value += '-' + this.textElementControloffice3.value;
        if (this.textElementControloffice4.value)
            value += '-' + this.textElementControloffice4.value;
        if (value != '') {
            this.elementControloffice.patchValue(value);
            this.elementControloffice.updateValueAndValidity();
        }
    }

    //called when click on dropdown  
    changeValue() {
        var temp;
        temp = this.textElementWidth;
        this.textElementWidth = this.dropElementWidth;
        this.dropElementWidth = temp;

    }

    //Placeholders for the callbacks which are later provided
    //by the Control Value Accessor
    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;
    public item: string;



    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }


    writeValue(value: any) {
        if (value && value !== this.value) {
            this.value = value
            let _value: string = this.value;
            let sepratorIndex = _value.indexOf('-');
            let code = _value.substring(0, sepratorIndex);
            let phone = _value.substr(sepratorIndex + 1);

            if (phone) {
                if (this.hasStateCode) {
                    let _phone: string = phone;
                    let stateSpearatorIndex = _phone.indexOf('-');
                    this.textElementControlphone1.patchValue(_phone.substring(0, stateSpearatorIndex));
                    this.textElementControlphone2.patchValue(_phone.substring(stateSpearatorIndex + 1));
                } else {
                    this.textElementControl.patchValue(phone);
                }
            }
            if (code && (!this.dropElementControl.value || (this.dropElementControl.value && this.dropElementControl.value.code !== code))) {
                this.dropElementControl.patchValue({ code: code });
            }
        }
        else if (!value) {
            this.value = '';
            if (this.hasStateCode) {
                this.textElementControlphone1.patchValue('');
                this.textElementControlphone2.patchValue('');
            } else {
                this.textElementControl.patchValue('');
            }
            // this.dropElementControl.patchValue({ code: '' }); #1041
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.textElementControlphone1.disable();
            this.textElementControlphone2.disable();
            this.textElementControl.disable();
            this.elementControl.disable();
            this.dropElementControl.disable();
            this.dropElementControlcontacttype.disable();
        } else {
            this.elementControl.enable();
            this.textElementControl.enable();
            this.textElementControlphone1.enable();
            this.textElementControlphone2.enable();
            this.dropElementControl.enable();
        }
    }


}

export const NCP_UI_CONTACT_DIRECTIVES = [NCPContactNumberComponent];
@NgModule({
    declarations: NCP_UI_CONTACT_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule, UiDropdownModule, UiTextBoxModule, SharedModule, ErrorModule],
    exports: [NCP_UI_CONTACT_DIRECTIVES, SharedModule],
})
export class NCPUiContactNumberComponentModule { }
