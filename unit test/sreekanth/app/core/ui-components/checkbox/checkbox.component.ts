import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '../tooltip/index';
import { Component, forwardRef, Input, NgModule, OnChanges, ElementRef } from '@angular/core';
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

export const CUSTOM_CHECKBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
};

@Component({
    selector: 'check-box',
    templateUrl: './checkbox.html',
    providers: [CUSTOM_CHECKBOX_VALUE_ACCESSOR]
})
export class CheckboxComponent implements ControlValueAccessor, OnChanges {
    @Input() parentIndex;
    @Input() indexes;
    @Input() superParentIndex;
    @Input() itemLabel: string;
    @Input() elementId: string;
    @Input() disabledFlag: boolean;
    @Input() alignment: string = 'left';
    @Input() changeId: string;
    @Input() iconClass: string;
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    @Input() checkBoxClass: string = '';
    @Input() mandatoryFlag: boolean;
    @Input() isLabel: boolean;
    @Input() clickId: string;
    @Input() elementValue: any;
    @Input() fieldTabId: any;
    elementControl = new FormControl();
    public innerValue;
    utils: UtilsService;
    readOnlyFlag: boolean = false;
    eventHandler: EventService;
    public invalidFlag: boolean;
    public element;
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
        if (v) {
            v = JSON.parse(JSON.stringify(v));
        }
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
            this.eventHandler.setEvent('change', this.changeId, { 'innerValue': this.innerValue, 'index': this.indexes - 1, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
        }
    }

    writeValue(value: any) {
        try {
            if (value) {
                value = JSON.parse(JSON.stringify(value));
            }
            if (value !== this.innerValue) {
                this.value = value;
            }
        } catch (e) {
            // console.log(e);
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
        // this.elementControl.valueChanges.subscribe();
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    setCheckBoxValue() {
        this.value = !this.value;
        if (this.clickId !== undefined || this.clickId !== null) {
            this.eventHandler.setEvent('click', this.clickId, { 'innerValue': this.innerValue, 'index': this.indexes - 1, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
        }
    }

    constructor(_utils: UtilsService, _eventHandler: EventService, ele: ElementRef) {
        this.utils = _utils;
        this.eventHandler = _eventHandler;
        this.element = ele;
        this.eventHandler.validateTabSub.subscribe((data) => {
            let classNames: string = this.element.nativeElement.className;
            if (this.fieldTabId === data['id']) {
                if (classNames && classNames.includes('ng-invalid')) {
                    this.invalidFlag = true;
                }
            }
        });
        this.elementControl.statusChanges.subscribe(status => {
            if (!this.elementControl.disabled) {
                this.invalidFlag = status !== 'VALID';
            }
        });
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

    ngOnChanges() {
        this.value = this.elementValue !== undefined ? this.elementValue : this.value;
    }
}


export const UI_CHEECKBOX_DIRECTIVES = [CheckboxComponent];
@NgModule({
    declarations: UI_CHEECKBOX_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, TooltipModule],
    exports: [UI_CHEECKBOX_DIRECTIVES, SharedModule],
})
export class UiCheckboxModule { }