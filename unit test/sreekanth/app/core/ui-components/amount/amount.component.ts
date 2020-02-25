import { SharedModule } from './../../shared/shared.module';
import { Logger } from '../../../core/ui-components/logger/logger';
import { ConfigService } from '../../services/config.service';
import { TooltipModule } from '../tooltip/index';
import { UtilsService } from '../utils/utils.service';
import { AmountFormat } from './pipes/amountFormat';
import { CommonModule } from '@angular/common';
import { OnInit, Component, forwardRef, Input, NgModule, OnChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule
} from '@angular/forms';
import { EventService } from '../../services/event.service';
const noop = () => {
};

export const CUSTOM_AMOUNT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AmountComponent),
    multi: true
};

@Component({

    selector: 'amount-field',
    templateUrl: './amount.html',
    providers: [CUSTOM_AMOUNT_VALUE_ACCESSOR]
})


export class AmountComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
    @Input() currencyCode: string;
    @Input() symbolDisplay: string = 'false';
    @Input() digit: string;
    @Input() elementId: string;
    @Input() placeHolder: string = 'NCPPlaceHolder.enterAmount';
    elementControl = new FormControl();
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    @Input() customFlag: boolean = false;
    @Input() mandatoryFlag: boolean = false;
    @Input() elementLabel: string;
    @Input() amountClass: string = '';
    @Input() acceptPattern: any = /^[0-9\.]*$/;
    @Input() index: number;
    @Input() parentIndex;
    @Input() superParentIndex;
    @Input() changeId: string;
    @Input() elementValue: any;
    @Input() disabledFlag: boolean = false;
    public innerValue;
    amountValue = '';
    config;
    public utils: UtilsService;
    constructor(config: ConfigService, _utils: UtilsService, public _logger: Logger, public eventHandler: EventService) {
        this.config = config;
        this.utils = _utils;
    }
    //Placeholders for the callbacks which are later provided
    //by the Control Value Accessor
    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;

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
        this.innerValue = value;
        this.formatAmount();
        // if (!this.elementControl.disabled) {
            this.elementControl.valueChanges.subscribe((data) => {
                if (data !== null && !isNaN(data)) {
                    this.value = data;
                }
            });
        // }
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
            this.placeHolder = '';
        } else {
            this.elementControl.enable();
        }
    }

    formatAmount() {
        if (this.utils.isNotNullOrEmpty(this.innerValue)) {
            this.amountValue = new AmountFormat(this.config).transform(this.innerValue, [this.digit, this.getBoolean(this.symbolDisplay), this.currencyCode]);
            if (this.getBoolean(this.symbolDisplay)) {
                this.amountValue = this.amountValue.replace(this.currencyCode, '');
            }
        }
    }

    getActualValue() {
        if (!isNaN(this.innerValue)) {
            if (this.innerValue === '0.00' || this.innerValue === '0') {
                this.amountValue = '';
            } else {
                this.amountValue = this.innerValue;
            }

        }
    }

    getBoolean(a) {
        let TRUTHY_VALUES = [true, 'true', 1];
        return TRUTHY_VALUES.some(function (t) {
            return t === a;
        });
    }

    ngAfterViewInit() {
        this.tooltipTitle = this.utils.getTranslated(this.tooltipTitle);
        this.placeHolder = this.utils.getTranslated(this.placeHolder);
    }

    ngOnChanges(changes?) {
        // this.formatAmount();
        this.getActualValue();
        this.value = this.elementValue && this.elementValue !== undefined ? this.elementValue : this.value;
        if (this.disabledFlag === true) {
            this.elementControl.disable();
        } else if (this.disabledFlag === false) {
            this.elementControl.enable();
        }
    }

    onInputText(event) {
        let target = event.srcElement || event.target;
        if (this.acceptPattern) {
            let pattern: RegExp = new RegExp(<RegExp>this.acceptPattern);
            let validValue = '';
            if (target.value) {
                for (let i = 1; i <= target.value.length; i++) {
                    let elementValue = target.value;
                    let slicedValue = elementValue.slice(0, i);
                    if (!pattern.test(slicedValue)) {
                        target.value = validValue;
                        this.elementControl.patchValue(validValue);
                        this.elementControl.updateValueAndValidity();
                    } else {
                        validValue = slicedValue;
                    }
                }
            }
        }
    }
    changeText(event) {
        let target = event.srcElement || event.target;
        if (event && this.index !== undefined) {
            this.eventHandler.setEvent('change', this.changeId, { value: target, index: this.index, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
        } else {
            if (event)
                this.eventHandler.setEvent('change', this.changeId, target);
        }
    }
}

export const UI_AMOUNT_DIRECTIVES = [AmountComponent, AmountFormat];
@NgModule({
    declarations: UI_AMOUNT_DIRECTIVES,
    imports: [CommonModule, FormsModule, TooltipModule, ReactiveFormsModule, SharedModule],
    exports: [UI_AMOUNT_DIRECTIVES, SharedModule]
})
export class UiAmountModule { }