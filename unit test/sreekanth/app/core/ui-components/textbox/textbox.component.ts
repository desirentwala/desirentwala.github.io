import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ElementRef, EventEmitter, Input, NgModule, OnChanges, OnDestroy, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { UiButtonModule } from '../button/index';
import { UiMiscModule } from '../misc-element/misc.component';
import { TooltipModule } from '../tooltip/index';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
const noop = () => {
};

export const CUSTOM_TEXTBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextboxComponent),
    multi: true
};

@Component({

    selector: 'text-box',
    templateUrl: './textbox.html',
    providers: [CUSTOM_TEXTBOX_VALUE_ACCESSOR]
})

export class TextboxComponent implements ControlValueAccessor, AfterContentInit, OnChanges, OnDestroy {
    @Input() inputType: string;
    @Input() placeHolder: string = ' ';
    @Input() disabledFlag: boolean = false;
    @Input() loadingFlag: boolean = false;
    @Input() textAlign: string = '';
    @Input() elementId: string;
    elementControl = new FormControl();
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    @Input() buttonText: string;
    @Input() customFlag: boolean = false;
    @Input() clickId: string;
    @Input() changeId: string;
    @Input() elementValue: any;
    @Input() textBoxClass: any = '';
    @Input() buttonType: string = '';
    @Input() buttonClass: string = '';
    @Input() index: number;
    @Input() parentIndex;
    @Input() superParentIndex;
    @Input() acceptPattern: RegExp;
    @Input() maxLength: string;
    @Input() maxValue: string;
    @Input() minValue: string;
    @Input() fieldTabId: any;
    @Input() updateOnChange: boolean = false;
    @Input() trimInput: boolean = true;
    @Input() mandatoryFlag: boolean = false;
    @Input() elementLabel: string;
    @Input() textBoxInputClass: string = '';
    @Input() iconClass: string = '';
    @Input() hasImageIcon: boolean = false;
    @Input() customImageIcon: any = '';
    @Input() imgIconSrc: string = '';
    @Output() onBlur = new EventEmitter();
    public invalidFlag: boolean;
    public innerValue;
    public utils;
    eventHndler: EventService;
    public pattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s/g]*$/;
    public allowlang;
    public element;
    public fileName;
    constructor(_utils: UtilsService, _eventHandler: EventService, public config: ConfigService, ele: ElementRef) {
        this.utils = _utils;
        this.eventHndler = _eventHandler;
        this.element = ele;
    }

    ngAfterContentInit() {
        // this.validFlag=this.elementControl1.valid;
        this.allowlang = this.config.get('allowLanguages');
        this.elementControl.valueChanges.subscribe((data) => {
            if (!this.elementControl.disabled && typeof data !== 'undefined') {
                this.value = data;
                this.invalidFlag = false;
            }
        });

        if (!this.inputType) {
            this.inputType = 'text';
        }
        this.eventHndler.validateTabSub.subscribe((data) => {
            let classNames: string = this.element.nativeElement.className;
            if (this.fieldTabId === data['id']) {
                if (classNames && classNames.includes('ng-invalid')) {
                    this.invalidFlag = true;
                }
            }
        });
    }




    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    //get accessor
    get value(): any {
        return this.innerValue;
    };


    //set accessor including call the onchange callback
    set value(v: any) {
        if ((v !== null) && (v !== this.innerValue || v !== this.elementControl.value)) {
            this.validatePattern(v, false);
            this.onModelChange(v);
        }
    }

    ngOnChanges(changes?) {
        this.value = this.elementValue && this.elementValue !== undefined ? this.elementValue : this.value;
        if (this.disabledFlag === true) {
            this.elementControl.disable();
        } else if (this.disabledFlag === false) {
            this.elementControl.enable();
        }
    }
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            this.value = value;
            this.validateMinValue();
            this.validateMaxValue();
        }
        if (this.inputType === 'file') {
            this.fileName = this.value;
        }
    }

    onInputText(event) {
        let target = event.srcElement || event.target;
        if (this.allowlang === 'en') {
            if (!this.pattern.test(target.value)) {
                target.value = '';
            }
        }
        this.validatePattern(target.value, true);
        this.validateMaxValue();
        if (this.updateOnChange)
            this.value = target.value;
    }
    validatePattern(value, fromInputText: boolean) {
        if (this.acceptPattern && typeof this.acceptPattern === 'string') {
            let pattern: RegExp = new RegExp(<RegExp>this.acceptPattern);
            let validValue = '';
            if (value) {
                for (let i = 1; i <= value.length; i++) {
                    let elementValue = value;
                    let slicedValue = elementValue.slice(0, i);

                    if (!pattern.test(slicedValue) && !elementValue.slice(i - 1, i).includes(".")) {
                        value = validValue;
                        if (!fromInputText) {
                            this.innerValue = validValue;
                        }
                        this.elementControl.patchValue(validValue);
                        this.elementControl.updateValueAndValidity();
                    } else {
                        validValue = slicedValue;
                    }
                    if (i == value.length) {
                        if (!fromInputText) {
                            this.innerValue = validValue;
                        }
                        this.elementControl.patchValue(validValue);
                        this.elementControl.updateValueAndValidity();
                    }
                }
            }
        } else {
            this.innerValue = value;
            this.elementControl.patchValue(value);
            this.elementControl.updateValueAndValidity();
        }
    }
    validateMinValue() {
        if (this.minValue) {
            if (this.elementControl.value && !isNaN(this.elementControl.value)) {
                if (parseInt(this.elementControl.value) < parseInt(this.minValue)) {
                    this.elementControl.patchValue(this.minValue);
                    this.elementControl.updateValueAndValidity();
                }
            }
        }
    }
    validateMaxValue() {
        if (this.maxValue) {
            let validValue = '';
            if (this.elementControl.value) {
                for (let i = 1; i <= this.elementControl.value.length; i++) {
                    let elementValue = this.elementControl.value;
                    let slicedValue = elementValue.slice(0, i);
                    if (parseInt(slicedValue) > parseInt(this.maxValue)) {
                        this.elementControl.patchValue(validValue);
                        this.elementControl.updateValueAndValidity();
                    } else {
                        validValue = slicedValue;
                    }
                }
            }

        }
    }
    //Set touched on blur
    onTouched(event) {
        this.onModelTouched();
        let classNames: string = this.element.nativeElement.className;
        if (classNames && classNames.includes('ng-valid')) {
            this.invalidFlag = false;
        }
        let valid = true;
        if (this.acceptPattern) {
            if (Array.isArray(this.acceptPattern)) {
                let target = event.srcElement || event.target;
                let validValue = '';
                if (target.value) {
                    if (this.acceptPattern.indexOf(target.value) === -1) {
                        valid = false;
                        target.value = validValue;
                        this.elementControl.patchValue(validValue);
                        this.elementControl.updateValueAndValidity();
                    }
                }
            }
        }
        if (valid) {
            this.value = this.elementValue && this.elementValue !== undefined ? this.elementValue : this.value;
        }
        this.onBlur.emit(this.elementControl.value);
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onModelChange = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onModelTouched = fn;
    }

    onbuttonclick() {
        this.eventHndler.setEvent('click', this.clickId);
    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.elementControl.disable();
            this.placeHolder = '';
        } else {
            this.elementControl.enable();
        }
    }

    changeText(event) {
        this.validateMinValue();
        let target = event.srcElement || event.target;
        if (this.inputType !== 'file') {
            if (this.trimInput) {
                target.value = target.value.trim();
                this.elementControl.setValue(target.value);
            }
        }
        if (this.inputType !== 'file' && this.index === undefined) {
            this.eventHndler.setEvent('change', this.changeId, this.elementControl.value);
        } else {
            if (this.inputType !== 'file' && this.index !== undefined) {
                this.eventHndler.setEvent('change', this.changeId, { value: this.elementControl.value, index: this.index, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
            } else {
                if (event && this.index !== undefined) {
                    if (event.target && event.target.files) this.fileName = target.files[0]['name'];
                    this.eventHndler.setEvent('change', this.changeId, { value: target, index: this.index, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
                } else {
                    if (event)
                        this.eventHndler.setEvent('change', this.changeId, target);
                }
            }

        }
    }

    ngOnDestroy() {
        this.eventHndler.validateTabSub.observers.pop();
    }

}

export const UI_TEXTBOX_DIRECTIVES = [TextboxComponent];
@NgModule({
    declarations: UI_TEXTBOX_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule, UiButtonModule, SharedModule, UiMiscModule],
    exports: [UI_TEXTBOX_DIRECTIVES, SharedModule]
})
export class UiTextBoxModule { }