import { EventService } from '../../services/event.service';
import { SharedModule } from './../../shared/shared.module';
import { ConfigService } from '../../services/config.service';
import {
    Component,
    ElementRef,
    forwardRef,
    HostListener,
    Input,
    NgModule,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    EventEmitter
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '../tooltip/index';
import { Autosize } from './autosize.directive';
import { UtilsService } from '../utils/utils.service';

const noop = () => {
};

export const CUSTOM_TEXTAREA_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextareaComponent),
    multi: true
};

@Component({
    selector: 'text-area',
    templateUrl: './textarea.html',
    providers: [CUSTOM_TEXTAREA_VALUE_ACCESSOR]
})

export class TextareaComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
    @Input() placeHolder: string = '';
    @Input() elementId: string;
    elementControl = new FormControl();
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    @Input() textAreaRow: number;
    @Input() textAreaCol: number;
    @Input() textareaClass: string;
    @Input() disabledFlag: boolean;
    @Input() customFlag: boolean = false;
    @Input() displayValue: string;
    @Input() maxLength: string;
    @Input() fieldTabId: any;
    @Input() disableClassFlag: boolean = false;
    @Input() mandatoryFlag: boolean = false;
    @Input() elementLabel: string;
    @Input() changeId: string;
    @Output() keypress = new EventEmitter();
    utils: UtilsService;
    public innerValue;
    public invalidFlag;
    public pattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s/g]*$/;
    public allowlang;

    constructor(_utils: UtilsService, public config: ConfigService, public eventHandler: EventService, public ele: ElementRef) {
        this.utils = _utils;
    }

    ngOnInit() {
        this.allowlang = this.config.get('allowLanguages');
        // this.placeHolder = this.utils.getTranslated(this.placeHolder);
        // this.tooltipTitle = this.utils.getTranslated(this.tooltipTitle);
        // this.displayValue = this.utils.getTranslated(this.displayValue);
        if (!this.placeHolder) {
            this.placeHolder = '';
        }
        this.eventHandler.validateTabSub.subscribe((data) => {
            let classNames: string = this.ele.nativeElement.className;
            if (this.fieldTabId === data['id']) {
                if (classNames && classNames.includes('ng-invalid')) {
                    this.invalidFlag = true;
                }
            }
        });
    }

    ngOnChanges(changes?) {

        let classNames: string = this.ele.nativeElement.className;
        if (classNames && classNames.includes('ng-valid')) {
            this.invalidFlag = false;
        }
    }
    ngOnDestroy() {
        this.eventHandler.validateTabSub.observers.pop();;
    }


    //Placeholders for the callbacks which are later provided
    //by the Control Value Accessor
    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any {
        return this.innerValue;
    };


    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            this.value = value;
            if (value) {
                this.validateMaxLength();
            }

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
        } else {
            this.elementControl.enable();
        }
    }

    onInput(event) {
        let target = event.srcElement || event.target;
        if (this.allowlang === 'en') {
            if (!this.pattern.test(target.value)) {
                target.value = '';
            }
        }
        this.validateMaxLength();
        this.keypress.emit(event);
    }
    validateMaxLength() {
        if (this.maxLength) {
            let validValue = '';
            if (this.elementControl.value) {
                for (let i = 1; i <= this.elementControl.value.length; i++) {
                    let elementValue = this.elementControl.value;
                    let slicedValue = elementValue.slice(0, i);
                    if (slicedValue) {
                        if (parseInt(slicedValue.length) > parseInt(this.maxLength)) {
                            this.elementControl.patchValue(validValue);
                            this.elementControl.updateValueAndValidity();
                        } else {
                            validValue = slicedValue;
                        }
                    }
                }
            }
        }
    }
    onTouched() {
        this.onTouchedCallback();
    }
    changeInValue() {
        this.eventHandler.setEvent('change', this.changeId, this.elementControl.value);
    }
}

export const UI_TEXTAREA_DIRECTIVES = [TextareaComponent, Autosize];
@NgModule({
    declarations: UI_TEXTAREA_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule, SharedModule],
    exports: [UI_TEXTAREA_DIRECTIVES, SharedModule]
})
export class UiTextAreaModule { }