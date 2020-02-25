import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ElementRef, Input, NgModule, OnChanges, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, AfterViewInit, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { UiButtonModule } from '../button/index';
import { UiMiscModule } from '../misc-element/misc.component';
import { TooltipModule } from '../tooltip/index';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
/*import { RangeSliderModule } from 'ngx-range-slider';*/
import { IonRangeSliderModule } from '@adapters/packageAdapter';

/*const noop = () => {
};*/

/*export const CUSTOM_RANGESLIDER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RangesliderComponent),
    multi: true
};*/

@Component({

    selector: 'rangeslider',
    templateUrl: './rangeslider.html'
})

export class RangesliderComponent implements OnDestroy, OnChanges, OnInit {
    @Input() min: number;
    @Input() max: number;
    @Input() from: number;
    @Input() to: number;
    @Input() from_min: number;
    @Input() from_max: number;
    @Input() to_min: number;
    @Input() to_max: number;
    @Input() from_shadow: boolean;
    @Input() to_shadow: boolean;
    @Input() grid: boolean;
    @Input() grid_num: number;
    @Input() prefix: string;
    @Input() postfix: string;
    @Input() decorate_both: string;
    @Input() isDisabled: boolean = false;
    @Input() values: any[];
    @Input() elementControl: FormControl;
    @Input() type:string;
    @Input() customFlag: boolean = false;
    @Input() rangeSliderCustomClass: string = '';
    @Input() step:number;
    @Input() changeId: string;

    public range = { "from": "", "to": "" };
    /* onModelChange: Function = () => { };
    onModelTouched: Function = () => { };*/

    public innerValue;
    public utils;
    eventHndler: EventService;
    public element;
    constructor(_utils: UtilsService, _eventHandler: EventService, public config: ConfigService, ele: ElementRef) {
        this.utils = _utils;
        this.eventHndler = _eventHandler;
        this.element = ele;
    }

    ngOnInit() {
        this.isDisabled = this.elementControl.disabled
        /* this.elementControl.valueChanges.subscribe(data => {
            if (data) {
                if (this.values) {
                    this.from = this.values.indexOf(data['from']);
                    this.to = this.values.indexOf(data['to']);
                } else {
                    this.from = data['from'];
                    this.to = data['to'];
                }
                this.range.from = data['from']
                this.range.to = data['to']
                this.elementControl.patchValue(this.range)
                this.elementControl.updateValueAndValidity()
            }
        }); */

        /* if(this.values){
            if(this.type === "double"){
                if(this.from){
                    this.range.from = String(this.values[this.from]);
                }else{
                    this.range.from = String(this.values[0])
                }
                if(this.to){
                    this.range.to = String(this.values[this.to]);
                }else{
                    this.range.to = String(this.values[this.values.length-1])
                }
            }else{
                this.range.from = String(this.values[0]);
                if(this.from){
                    this.range.to = String(this.values[this.from])
                }else{
                    this.range.to = String(this.values[this.values.length-1])
                }
            }
            this.elementControl.patchValue(this.range);
            this.elementControl.updateValueAndValidity();
        }else{
            if(this.type === "double"){
                if(this.from){ 
                    this.range.from = String(this.from);
                }else{
                    this.range.from = String[this.min]
                }
                if(this.to){ 
                    this.range.to = String(this.to);
                }else{
                    this.range.to = String[this.max]
                }
            }else{
                this.range.from = String(this.min);
                if(this.from){ 
                    this.range.to = String(this.from);
                }else{
                    this.range.to = String[this.max]
                }
            }
            this.elementControl.patchValue(this.range);
            this.elementControl.updateValueAndValidity();
        }*/
    
    }

    ngOnChanges(changes: SimpleChanges) {
        this.isDisabled = this.elementControl.disabled

        if (this.elementControl.value) {
            this.from = this.elementControl.value['from'];
            this.to = this.elementControl.value['to'];
            //this.isDisabled = true;
        } else {
            if (this.values) {
                if(this.type === "double"){
                    if (this.from) {
                        this.range.from = this.values[this.from];
                    } else {
                        this.range.from = this.values[0];
                    }

                    if (this.to) {
                        this.range.to = this.values[this.to];
                    } else {
                        this.range.to = this.values[this.values.length - 1]
                    }    
                }else{
                     this.range.from = this.values[0];

                     if (this.from) {
                        this.range.to = this.values[this.from];
                    } else {
                        this.range.to = this.values[this.values.length - 1];
                    }
                }
                this.elementControl.patchValue(this.range);
                this.elementControl.updateValueAndValidity();
            } else {
                if(this.type === "double"){
                    if (this.from) {
                        this.range.from = String(this.from);
                    } else {
                        this.range.from = String(this.min);
                    }
                    if (this.to) {
                        this.range.to = String(this.to);
                    } else {
                        this.range.to = String(this.max)
                    }
                }else{
                    this.range.from = String(this.min);
                    if (this.from) {
                        this.range.to = String(this.from);
                    } else {
                        this.range.to = String(this.max);
                    }
                }
                this.elementControl.patchValue(this.range);
                this.elementControl.updateValueAndValidity();
            }
        }
    }

    afterValueChanges(event: any) {
        if (this.values !== null && this.values !== undefined) {
            if(this.type === "double"){
                this.range.from = this.values[event.from]
                this.range.to = this.values[event.to]
            }else{
                this.range.from = this.values[0]
                this.range.to = this.values[event.from]
            }
            
        } else {
            if(this.type === "double"){
                this.range.from = event.from
                this.range.to = event.to
            }else{
                this.range.from = String(this.min)
                this.range.to = event.from
            }
        }
        this.elementControl.patchValue(this.range);
        this.elementControl.updateValueAndValidity();
        this.eventHndler.setEvent('change', this.changeId, this.range);
    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.isDisabled = true;
            this.elementControl.disable();
        } else {
            this.elementControl.enable();
            this.isDisabled = false;
        }
    }

    ngOnDestroy() {
        this.eventHndler.validateTabSub.observers.pop();
    }

}

export const UI_RANGESLIDER_DIRECTIVES = [RangesliderComponent];
@NgModule({
    declarations: UI_RANGESLIDER_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule, UiButtonModule, SharedModule, UiMiscModule, IonRangeSliderModule],
    exports: [UI_RANGESLIDER_DIRECTIVES, SharedModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UiRangeSliderModule { } 