import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectorRef, Component, Input, NgModule, OnChanges, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Logger } from '../../../core/ui-components/logger/logger';
import { PickListService } from '../../../modules/common/services/picklist.service';
import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { UiDropdownModule } from '../dropdown';
import { ErrorModule } from '../error/error.component';
import { UiTextBoxModule } from '../textbox';
import { TooltipModule } from '../tooltip';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';


const noop = () => {
};

export const MULTI_CURRENCY_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiCurrencyComponent),
    multi: true
};

@Component({

    selector: 'multi-currency',
    templateUrl: './multicurrency.html',
    providers: [MULTI_CURRENCY_VALUE_ACCESSOR]
})

export class MultiCurrencyComponent implements ControlValueAccessor, AfterContentInit, OnChanges, OnInit {
    displayLoader: any = false;

    @Input() placeHolder = ' ';
    @Input() dropdownItems: any[];
    @Input() defaultValue = '';
    @Input() elementId = '';
    @Input() tooltipPlacement = 'right';
    @Input() tooltipTitle: string;
    @Input() textElementWidth: string;
    @Input() dropElementWidth: string;
    @Input() changeId: string;
    @Input() elementControl = new FormControl();
    @Input() secondaryFormName: FormControl;
    @Input() thirdFormName: FormControl;
    @Input() hideArrowFlag = false;
    @Input() showCodeFlag = false;
    @Input() elementValue: any;
    @Input() isEnquiryFlag = false;
    @Input() customFlag = false;
    @Input() contactClass = '';
    @Input() customNcpContactClass = '';


    dropdownItemsResponse;
    public innerValue = '';
    rate = '';
    utils: UtilsService;


    constructor(_utils: UtilsService, public eventHandler: EventService,
        public _logger: Logger,
        public pickListService: PickListService,
        public configService: ConfigService,
        public ref: ChangeDetectorRef) {
        this.utils = _utils;
        this.getCurrencyList();
    }

    ngOnChanges(changes?) {
        if (this.elementValue !== this.value) {
            this.writeValue(this.elementValue);
        }
    }
    ngOnInit() {
    }
    ngAfterContentInit() {

    }
    getRate(code) {
        let rateValue = '';
        if (this.dropdownItemsResponse) {
            for (let i = 0; i < this.dropdownItemsResponse.length; i++) {
                if (this.dropdownItemsResponse[i].code === code) {
                    rateValue = this.dropdownItemsResponse[i].sellRate;
                }
            }
        }
        return rateValue;
    }

    changeValue() {
        let temp;
        temp = this.textElementWidth;
        this.textElementWidth = this.dropElementWidth;
        this.dropElementWidth = temp;

    }

    // Placeholders for the callbacks which are later provided
    // by the Control Value Accessor
    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;
    public item: string;



    // get accessor
    get value(): any {
        return this.innerValue;
    };

    // set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }


    writeValue(value: any) {
        if (value && value !== this.value) {
            this.value = value;
            let currRate = this.getRate(this.value);
            this.thirdFormName.patchValue(currRate);
            this.rate = currRate;
            this.ref.markForCheck();
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.elementControl.disable();
        } else {
            this.elementControl.enable();
        }
    }
    getCurrencyList() {
        let inputPickList = {
            auxType: 'Currency',
            param1: '',
            param2: ''
        };
        let dropdownValues = this.pickListService.getPickList(inputPickList, this.displayLoader);
        dropdownValues.subscribe(
            (resDataVal) => {
                if (resDataVal.error !== null && resDataVal.error !== undefined && resDataVal.error.length >= 1) {
                    // TODO error Handling
                } else {
                    this.dropdownItemsResponse = resDataVal;
                    let dataListData = [];
                    let dataList;
                    for (let i = 0; i < resDataVal.length; i++) {
                        dataList = { code: '', desc: '', key: '' };
                        dataList.code = resDataVal[i].code;
                        dataList.key = resDataVal[i].code;
                        dataList.desc = resDataVal[i].desc;
                        dataListData[i] = dataList;
                        if (this.elementControl.value && this.elementControl.value === resDataVal[i].code && (!this.secondaryFormName.value || !this.thirdFormName.value)) {
                            this.elementControl.patchValue(resDataVal[i].code);
                            this.secondaryFormName.patchValue(resDataVal[i].desc);
                            this.thirdFormName.patchValue(resDataVal[i].sellRate);
                        } else if (resDataVal[i].currencyType === 'H' && !this.elementControl.value) {
                            this.elementControl.patchValue(resDataVal[i].code);
                            this.secondaryFormName.patchValue(resDataVal[i].desc);
                            this.thirdFormName.patchValue(resDataVal[i].sellRate);
                        }
                    }
                    this.dropdownItems = dataListData;
                }
                if (this.elementControl.disabled) {
                    this.writeValue(this.elementValue);
                }
                this.configService.setLoadingSub('no');
                this.ref.markForCheck();
            },
            (error) => {
                this._logger.error(error);
            }
        );
    }

}

export const NCP_UI_MULTI_CURRENCY_DIRECTIVES = [MultiCurrencyComponent];
@NgModule({
    declarations: NCP_UI_MULTI_CURRENCY_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule, UiDropdownModule, UiTextBoxModule, SharedModule, ErrorModule],
    exports: [NCP_UI_MULTI_CURRENCY_DIRECTIVES, SharedModule],
})
export class NCPUiMultiCurrencyComponentModule { }
