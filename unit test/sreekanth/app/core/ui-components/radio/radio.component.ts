import { Logger } from './../logger/logger';
import { EventService } from '../../services/event.service';
import { SharedModule } from '../../shared/shared.module';
import { Component, ElementRef, forwardRef, Input, NgModule, OnChanges, OnDestroy, OnInit, ChangeDetectorRef, AfterContentInit, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '../tooltip/index';
import { UtilsService } from '../utils/utils.service';
import { UiButtonModule } from '../button/index';
import { ConfigService } from '../../services/config.service';
import { UiMiscModule } from '../misc-element/misc.component';
import { PickListHelper } from '../utils/picklist.helper.service';


const noop = () => {
};

export const CUSTOM_RADIO_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioComponent),
    multi: true
};

@Component({
    selector: 'radio-button',
    templateUrl: './radio.html',
    providers: [CUSTOM_RADIO_VALUE_ACCESSOR]
})

export class RadioComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy, AfterContentInit, AfterViewInit {
    @Input() radioArray: any[];
    @Input('value') radioValue: any;
    @Input() horizontalflag: boolean = false;
    @Input() elementId: string;
    @Input() radioName: string;
    @Input() customFlag: boolean = false;
    @Input() radioCustomClass: string = '';
    @Input() hasImageIcon: boolean = false;
    @Input() customImageIcon: string = '';
    @Input() imgIconSrc: string = '';
    @Input() indexes;
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    @Input() type: string = '';
    @Input() changeId: string;
    @Input() iconClass: string;
    @Input() fieldTabId: any;
    @Input() elementLabel: string;
    @Input() mandatoryFlag: string;
    @Input() pickListFlag = false;
    @Input() wrapperClass: string;
    @Input() miscType: string;
    @Input() miscSubType: string;
    @Input() productCode: string;
    @Input() param1: string;
    @Input() param2: string;
    @Input() param3: string;
    @Input() param4: string;
    @Input() param1Control: FormControl;
    @Input() param2Control: FormControl;
    @Input() param3Control: FormControl;
    @Input() param4Control: FormControl;
    @Input() displayLoader = false;
    @Input() descControl: FormControl;
    @Input() countPerRow: number;
    @Input() parentIndex;
    @Input() superParentIndex;
    public innerValue: any;
    public invalidFlag: boolean;
    pushValue: boolean = true;
    elementControl = new FormControl();
    utils: UtilsService;
    radioButtonflag: boolean = false;

    constructor(_utils: UtilsService, public eventHandler: EventService, public ele: ElementRef,
        public ref: ChangeDetectorRef,
        public logger: Logger,
        public configService: ConfigService,
        public pickListHelper: PickListHelper) {
        this.utils = _utils;

    }

    //get accessor
    get value(): any {

        return this.innerValue;
    };

    ngAfterContentInit() {
        this.radioButtonflag = this.elementControl.valid;
        if (this.value !== false && this.value !== true && this.radioArray.length > 0) {
            this.pushValue = (this.value === this.radioArray[0].value) ? true : false;
        }
    }
    ngAfterViewInit() {}
    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onModelChange(v);
            let classNames: string = this.ele.nativeElement.className;
            if (classNames && classNames.includes('ng-valid')) {
                this.invalidFlag = false;
            }            
            if( this.indexes ){
                this.eventHandler.setEvent('change', this.changeId, { value: this.innerValue, index: this.indexes,'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex  });
            } else {
                this.eventHandler.setEvent('change', this.changeId,this.innerValue);
            }
        }
    }


    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onModelChange = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onModelTouched = fn;
    }
    setPushButtonValue(value) {
        this.value = this.radioArray[(value === true) ? 0 : 1].value;
    }

    ngOnInit() {
        // if (this.radioArray.length > 0) {
        //     for (var i = 0; i < this.radioArray.length; i++) {
        //         if (this.radioArray[i].label) {
        //             this.radioArray[i].label = this.utils.getTranslated(this.radioArray[i].label);
        //         }
        //     }
        //     this.tooltipTitle = this.utils.getTranslated(this.tooltipTitle);
        // }
        if (this.pickListFlag) {
            this.radioArray = [];
            this.pickListHelper.getAUXData(this.radioArray, this.miscType, this.miscSubType, this.productCode, this.param1, this.param2, this.param3, this.param4, this.param1Control, this.param2Control, this.param3Control, this.param4Control);
        }
        this.eventHandler.validateTabSub.subscribe((data) => {
            let classNames: string = this.ele.nativeElement.className;
            if (this.fieldTabId === data['id']) {
                if (classNames && classNames.includes('ng-invalid')) {
                    this.invalidFlag = true;
                }
            }
        });
        this.elementControl.valueChanges.subscribe((data) => {
            if (!this.elementControl.disabled) {
                this.value = data;
                this.invalidFlag = false;
            }
        });

    }
    ngOnChanges(changes?) {
        this.indexes = this.indexes ? this.indexes : '';
        this.elementId = this.elementId + this.indexes;
        this.radioName = this.radioName + this.indexes;

    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.elementControl.disable();
        } else {
            this.elementControl.enable();
        }

    }

    ngOnDestroy() {
        this.eventHandler.validateTabSub.observers.pop();
    }
};

export const UI_RADIO_DIRECTIVES = [RadioComponent];
@NgModule({
    declarations: UI_RADIO_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule, SharedModule, UiButtonModule, UiMiscModule],
    exports: [UI_RADIO_DIRECTIVES, SharedModule],
})
export class UiRadioModule { }