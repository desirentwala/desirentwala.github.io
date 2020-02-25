import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, NgModule, OnChanges, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { TooltipModule } from '../tooltip/index';
const noop = () => {
};

export const CUSTOM_SELECTDROPDOWNCOMPONENT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectdropdownComponent),
    multi: true
};

@Component({
    selector: 'select-drop',
    templateUrl: './selectdropdown.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CUSTOM_SELECTDROPDOWNCOMPONENT_VALUE_ACCESSOR]
})

export class SelectdropdownComponent implements ControlValueAccessor, OnChanges, OnDestroy, OnInit {

    @Input() elementId: string;
    elementControl = new FormControl();
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    @Input() dropdownItems: any[] = [];
    @Input() customFlag: boolean = false;
    @Input() changeId: string;
    @Input() selectDropCustomClass: string = '';
    @Input() fieldTabId: any;
    @Input() mandatoryFlag: boolean = false;
    @Input() hasOnlyCode: boolean = false;
    @Input() elementLabel: string;
    public innerValue;
    public invalidFlag;

    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };
    eventHandler: EventService;

    constructor(_eventHandler: EventService, public ele: ElementRef) {
        this.eventHandler = _eventHandler;
    }
    // get accessor
    get value(): any {
        return this.innerValue;
    };

    // set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;

        }
    }
    ngOnInit() {

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
        this.eventHandler.validateTabSub.observers.pop();
    }

    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
            this.value = value;
            this.elementControl.setValue(this.value);   // setting default value 
            this.invalidFlag = false;
        }
    }

    // From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onModelChange = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onModelTouched = fn;
    }

    onTouched() {
        this.onModelTouched();
    }

    onChange(param) {
        this.writeValue(param);
        if (this.elementControl.value)
            this.onModelChange(this.elementControl.value);
        this.eventHandler.setEvent('change', this.changeId, this.value);
    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.elementControl.disable();
        } else {
            this.elementControl.enable();
        }
    }

}

export const UI_SELECTDROPDOWNCOMPONENT_DIRECTIVES = [SelectdropdownComponent];
@NgModule({
    declarations: UI_SELECTDROPDOWNCOMPONENT_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule],
    exports: UI_SELECTDROPDOWNCOMPONENT_DIRECTIVES
})
export class UiSelectdropdownModule { }
