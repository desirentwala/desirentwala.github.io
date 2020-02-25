import { EventService } from '../../services/event.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UiDropdownModule } from '../dropdown/index';
import { UiTextBoxModule } from '../textbox/index';
import { TooltipModule } from '../tooltip/index';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import {
    AfterContentInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    Input,
    NgModule,
    OnChanges,
    OnDestroy
} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule
} from '@angular/forms';
const noop = () => {
};

export const CUSTOM_CONTACT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ContactNumberComponent),
    multi: true
};

@Component({

    selector: 'contact-number',
    templateUrl: './contact.html',
    providers: [CUSTOM_CONTACT_VALUE_ACCESSOR]
})

export class ContactNumberComponent implements ControlValueAccessor, AfterContentInit, OnChanges, OnDestroy {


    @Input() placeHolder: string = ' ';
    public innerValue;
    @Input() dropdownItems: any[];
    @Input() defaultValue: string = '';
    @Input() elementId: string = '';
    @Input() tooltipPlacement: string = 'right';
    @Input() tooltipTitle: string;
    @Input() textElementWidth: string;
    @Input() dropElementWidth: string;
    textElementControl = new FormControl();
    dropElementControl = new FormControl();
    elementControl = new FormControl();
    @Input() hideArrowFlag: boolean = false;
    @Input() showCodeFlag: boolean = false;
    @Input() elementValue: any;
    @Input() acceptPattern: any = /^[0-9]/;
    @Input() customFlag: boolean = false;
    @Input() contactClass: string = '';
    @Input() displayOnClick: any;
    @Input() typeAheadSearch: boolean = true;
    @Input() fieldTabId: any;
    @Input() maxLength: string;
    @Input() disableCode: boolean = false;
    @Input() elementLabel: string;
    @Input() mandatoryFlag: string;
    @Input() changeId: string;
    @Input() isLazyLoading: boolean = false;
    @Input() lazyLoadingOffsetValue: number = 5;
    @Input() initialItemsNumber: number = 7;
    @Input() isEnquiryFlag: boolean = false;
    @Input() doDisplayCountryCode: boolean = false;
    @Input() separatorPatternArray: number[] = [];
    invalidFlag: boolean;
    utils: UtilsService;
    phCode: any;
    constructor(_utils: UtilsService, public ref: ChangeDetectorRef, public _logger: Logger, public eventHandler: EventService, public ele: ElementRef) {
        this.utils = _utils;
    }

    ngOnChanges(changes?) {
        if (this.elementValue !== this.value) {
            this.writeValue(this.elementValue);
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
            this.elementControl.setValue(value);
        });
        this.dropElementControl.valueChanges.subscribe(data => {
            let value = '';
            if (!this.textElementControl.value) {
                if (data && data.code) {
                    value = data.code + '-';
                }
            } else {
                if (data && data.code) {
                    value = data.code + '-' + this.textElementControl.value;
                }
            }
            this.elementControl.setValue(value);

        });
        this.elementControl.valueChanges.subscribe(data => {
            this.value = data;
            let classNames: string = this.ele.nativeElement.className;
            if (classNames && classNames.includes('ng-valid')) {
                this.invalidFlag = false;
                this.ref.markForCheck();
            }
        });

        this.eventHandler.validateTabSub.subscribe((data) => {
            let classNames: string = this.ele.nativeElement.className;
            if (this.fieldTabId === data['id']) {
                if (classNames && classNames.includes('ng-invalid')) {
                    this.invalidFlag = true;
                    this.ref.markForCheck();
                }
            }
        });
        if (this.disableCode) {
            this.dropElementControl.disable();
        }
        if (this.isEnquiryFlag) {
            this.textElementControl.disable();
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
                this.textElementControl.patchValue(phone);
            }
            if (code && (!this.dropElementControl.value || (this.dropElementControl.value && this.dropElementControl.value.code !== code))) {
                this.dropElementControl.patchValue({ code: code });
            }
        }
        else if (!value) {
            this.value = '';
            this.textElementControl.patchValue('');
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
            this.elementControl.disable();
            this.textElementControl.disable();
            this.dropElementControl.disable();
        } else {
            this.elementControl.enable();
            this.textElementControl.enable();
            this.dropElementControl.enable();
        }
    }

    formatInput(data: any) {
        if (data && this.separatorPatternArray) {
            data = data.replace(/-/g, '');
            data = data.slice(0, this.separatorPatternArray[0]) + '-' + data.slice(this.separatorPatternArray[0], this.separatorPatternArray[1] + this.separatorPatternArray[0]) + '-' + data.slice(this.separatorPatternArray[1] + this.separatorPatternArray[0], this.separatorPatternArray[2] + this.separatorPatternArray[1] + this.separatorPatternArray[0]);
            this.textElementControl.patchValue(data);
        }
    }

    ngOnDestroy() {
        this.eventHandler.validateTabSub.observers.pop();
    }


}

export const UI_CONTACT_DIRECTIVES = [ContactNumberComponent];
@NgModule({
    declarations: UI_CONTACT_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule, UiDropdownModule, UiTextBoxModule, SharedModule],
    exports: [UI_CONTACT_DIRECTIVES, SharedModule],
})
export class UiContactNumberComponentModule { }
