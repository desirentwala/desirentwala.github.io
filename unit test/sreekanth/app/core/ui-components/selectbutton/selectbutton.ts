import { EventService } from '../../services/event.service';
import { SharedModule } from '../../shared/shared.module';
import { SelectButtonWithTexts } from '../common/api';
import { TooltipModule } from '../tooltip/index';
import { UtilsService } from '../utils/utils.service';
import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, NgModule, OnInit, ChangeDetectorRef, ElementRef, AfterViewInit } from '@angular/core';
import { UiButtonModule } from '../button/index';
import { Logger } from '../logger/logger';
import { ConfigService } from '../../services/config.service';

import {
    ControlValueAccessor,
    FormControl,
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule
} from '@angular/forms';
import { PickListHelper } from '../utils/picklist.helper.service';
import { UiMiscModule } from '../misc-element/misc.component';


export const SELECTBUTTON_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectButton),
    multi: true
};

@Component({

    selector: 'ncp-selectButton',
    templateUrl: './ncpselectbutton.html',
    providers: [SELECTBUTTON_VALUE_ACCESSOR]
})
export class SelectButton implements ControlValueAccessor, OnInit, AfterViewInit {

    @Input() tabindex: number;
    @Input() multiple: boolean;
    @Input() style: any;
    @Input() styleClass: string;
    @Input() disabled: boolean;
    @Input() elementId: string;
    @Input() changeId: string;
    @Input() mandatoryFlag: boolean = false;
    @Input() customFlag: boolean = false;
    @Input() selectButtonClass: string = '';
    @Input() tooltipPlacement: string = 'right';
    @Input() tooltipTitle: string = '';
    @Input() iconClass: string = '';
    @Input() elementLabel: string;
    @Input() pickListFlag = true;
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
    @Input() favLabel: any;
    value: any;
    selectedItems: any[] = [];
    selectedItemsIndex: number = 0;
    readOnlyFlag: boolean = false;

    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };
    elementControl = new FormControl();
    hoveredItem: any;
    utils: UtilsService;
    eventHandler: EventService;
    private _options: any;
    public optionsWrapper: SelectButtonWithTexts[][] = [];
    @Input('options')
    set options(options: SelectButtonWithTexts[]) {
        if (typeof options !== 'undefined' && options.hasOwnProperty('length') === true) {
            this._options = options;
            let wrapperIndex = 0;
            options.forEach((option, index) => {
                if (this.optionsWrapper[wrapperIndex] === undefined) this.optionsWrapper[wrapperIndex] = [];
                this.optionsWrapper[wrapperIndex].push(option);
                wrapperIndex += (index + 1) % this.countPerRow === 0 ? 1 : 0;
            });
        }
    }
    get options(): SelectButtonWithTexts[] {
        return this._options;
    }

    constructor(_utils: UtilsService, public logger: Logger,
        public configService: ConfigService, _eventHandler: EventService,
        public ref: ChangeDetectorRef, public ele: ElementRef,
        public pickListHelper: PickListHelper) {
        this.utils = _utils;
        this.eventHandler = _eventHandler;
    }
    ngOnInit() {
        // if (this.options.length > 0) {
        // for (var i = 0; i < this.options.length; i++) {
        //     if (this.options[i].label) {
        // this.options[i].label = this.utils.getTranslated(this.options[i].label);
        //         }
        //     }
        // }
        if (this.pickListFlag) {
            this.pickListHelper.getAUXData(this.options, this.miscType, this.miscSubType, this.productCode, this.param1, this.param2, this.param3, this.param4, this.param1Control, this.param2Control, this.param3Control, this.param4Control);
            this.pickListHelper.InputArrayLoaded.subscribe(data => this.options = data);
        }

    }
    ngAfterViewInit() { }

    writeValue(value: any): void {
        if (!this.multiple) {
            this.value = value;
        } else {
            if (value) {
                for (var i = 0; i < value.length; i++) {
                    this.selectedItems[this.selectedItemsIndex] = value[i];
                    this.selectedItemsIndex++;
                }
            }
            this.value = this.selectedItems;
        }

    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
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

    onItemClick(event, option: SelectButtonWithTexts) {
        if (this.readOnlyFlag) {
            return;
        }

        if (this.multiple) {

            let itemIndex = this.findItemIndex(option);
            if (itemIndex != -1) {
                this.selectedItems.splice(itemIndex, 1);
                this.value = this.selectedItems;
                this.selectedItemsIndex = this.selectedItems.length;
            } else {
                this.selectedItemsIndex = this.selectedItems.length;
                this.selectedItems[this.selectedItemsIndex] = option.value;
                this.value = this.selectedItems;
            }
        } else {
            this.value = option.value;
            if (this.descControl) {
                this.descControl.patchValue(option.label);
                this.descControl.updateValueAndValidity();
            }
        }
        this.onModelTouched();
        this.onModelChange(this.value);
        this.eventHandler.setEvent('change', this.changeId, {
            originalEvent: event,
            value: this.value
        });
    }

    isSelected(option: SelectButtonWithTexts) {
        if (this.multiple) {
            return this.findItemIndex(option) != -1;
        } else
            return option.value == this.value;
    }

    findItemIndex(option: SelectButtonWithTexts) {
        let index = -1;
        if (this.value) {
            for (let i = 0; i < this.value.length; i++) {
                if (this.value[i] == option.value) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
}

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, TooltipModule, UiButtonModule, UiMiscModule],
    exports: [SelectButton, SharedModule],
    declarations: [SelectButton]
})
export class SelectButtonModule { }