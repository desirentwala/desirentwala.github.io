import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit, forwardRef, ElementRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { TooltipModule } from '../tooltip/index';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';

const noop = () => {
};

export const CUSTOM_BUTTONRADIO_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ButtonRadioComponent),
    multi: true
};

@Component({
    selector: 'button-radio',
    templateUrl: './buttonradio.html',
    providers: [CUSTOM_BUTTONRADIO_VALUE_ACCESSOR]
})

export class ButtonRadioComponent implements ControlValueAccessor, OnInit {

    @Input() buttonValue1: any;
    @Input() buttonValue2: any;
    @Input() buttonName: string;
    @Input() connectorName: string;
    @Input() clickId: string;
    @Input() defaultbuttonOne: boolean = false;
    @Input() defaultbuttonTwo: boolean = false;
    @Input() defaultButtonValue: any;
    @Input() elementId: string;
    @Input() buttonRadioId1: string;
    @Input() buttonRadioId2: string;
    @Input() customFlag: boolean = false;
    @Input() buttonradioCustomClass: string = '';
    @Input() tooltipTitle: string;
    @Input() iconClass: string;
    @Input() iconClass1: string;
    @Input() tooltipPlacement: string = 'right';
    tooltipShow: boolean = false;
    @Input() elementLabel: string;
    @Input() mandatoryFlag: string;
    elementControl = new FormControl();
    public innerValue;
    buttonId1: any;
    buttonId2: any;
    utils: UtilsService;
    eventHandler: EventService;
    @Input() fieldTabId: any;
    public invalidFlag: boolean;
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };
    writeValue(value: any) {
        if (value !== this.innerValue && value) {
            this.innerValue = value;
            if (value === this.buttonValue1) {

                this.defaultbuttonOne = true;
                this.elementControl.patchValue(value);
                this.elementControl.updateValueAndValidity();
            }
            if (value === this.buttonValue2) {
                this.defaultbuttonTwo = true;
                this.elementControl.patchValue(value);
                this.elementControl.updateValueAndValidity();
            }
        }
		else{
            if (value === this.buttonValue1) {
                this.defaultbuttonOne = true;
            }
            if (value === this.buttonValue2) {
                this.defaultbuttonTwo = true;
            }
            
            this.elementControl.patchValue(value);
            this.elementControl.updateValueAndValidity();
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onModelChange = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onModelTouched = fn;
    }

    onbuttonclick(param) {
        this.writeValue(param);
        this.onModelChange(this.elementControl.value);
        if (this.elementControl.valid) {
            this.invalidFlag = false;
        }
        this.eventHandler.setEvent('click', this.clickId, param);
    }

    constructor(_utils: UtilsService, _eventHandler: EventService, public element: ElementRef) {
        this.utils = _utils;
        this.eventHandler = _eventHandler;
    }
    ngOnInit() {
        this.buttonId1 = Math.random().toString();
        this.buttonId2 = Math.random().toString();
    }
    ngAfterContentInit() {
        this.tooltipShow = this.elementControl.valid;
        this.eventHandler.validateTabSub.subscribe((data) => {
            let classNames: string = this.element.nativeElement.className;
            if (this.fieldTabId === data['id']) {
                if (classNames && classNames.includes('ng-invalid')) {
                    this.invalidFlag = true;
                }
            }
        });
    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.elementControl.disable();
        } else {
            this.elementControl.enable();
        }
    }
};
export const UI_BUTTONRADIO_DIRECTIVES = [ButtonRadioComponent];
@NgModule({
    declarations: UI_BUTTONRADIO_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule, SharedModule],
    exports: [UI_BUTTONRADIO_DIRECTIVES, SharedModule],
})
export class UiButtonRadioModule { }