import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { DateDuration } from '../ncp-date-picker/pipes/date.duration';
import { DateFormatService } from '../ncp-date-picker/services/ncp-date-picker.date.format.service';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, forwardRef, HostListener, Input, NgModule, OnInit } from '@angular/core';
import { LabelModule } from '../label/label.component';
import { UiTextBoxModule } from '../textbox/textbox.component';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { TooltipModule } from "../tooltip/index";

const noop = () => {
};


@Component({
    selector: 'manufacturing-age',
    templateUrl: './manufacturingage.html',
    providers: [DateFormatService]
})

export class ManufacturingAgeComponent implements OnInit, AfterViewInit {
    @Input() elementId: string;
    @Input() ageControl: FormControl;
    @Input() placeHolder: string;
    @Input() mandatoryFlag: boolean = false;
    @Input() customFlag: boolean = false;
    @Input() dobCustomClass: string = '';
    @Input() changeId: string;
    @Input() elementControl: FormControl;
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    @Input() hideAgeControl: boolean = false;
    @Input() elementLabel: string; 
    eventHandler: EventService;
    public innerValue;
    years: any[] = [];
    public day = '';
    public year = '';
    public age;
    ascOrDescFlag: boolean = false;
    config;
    utils: UtilsService;
    readOnlyFlag: boolean = false;
    ngOnInit() {
        let date = new Date();
        let presentYear = date.getFullYear();
        let j = 0;
        if (this.ascOrDescFlag === true) {
            for (let i = 1900; i <= presentYear; i++) {
                this.years[j] = i;
                j++;
            }
        } else {
            for (let i = presentYear; i >= 1900; i--) {
                this.years[j] = i;
                j++;
            }
        }
        this.year = this.elementControl.value;
    }
    ngAfterViewInit(){
        this.manufacturingYearSelect();
    }
    constructor(configservice: ConfigService, _utils: UtilsService, public dateFormatService: DateFormatService,
        public dateduration: DateDuration, _eventHandler: EventService) {
        this.config = configservice;
        this.utils = _utils;
        this.eventHandler = _eventHandler;
    }

    @HostListener("window:scroll", []) onWindowScroll() {
        this.manufacturingYearSelect();
    }
    daymonthyearSelected(year: number) {
        if (year !== undefined) {
            if (year > 0) {
                this.ageControl.markAsDirty({onlySelf: true});
                this.age = this.getAge(this.year);
                this.ageControl.patchValue(this.age);
                this.elementControl.patchValue(this.year);
                this.eventHandler.setEvent('change', this.changeId, year);
            } else {
                this.ageControl.reset();
                this.ageControl.updateValueAndValidity();
            }
        }
    }

    public getAge(_year: string): number {
        let today = new Date();
        let age = today.getFullYear() - parseInt(_year);
       if (age <= 0) {
           age = 0;
        }
        return age;
    }

    public manufacturingYearSelect(): void {
        let manufacturingYearSelect = document.getElementById("elementID");
        this.ascOrDescFlag = this.isElementInViewport(manufacturingYearSelect);
        this.years.sort(!this.ascOrDescFlag ? this.sortDescending : this.sortAscending);
    }
    isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        let relativeOffset = rect.top - window.scrollY ;
        return (relativeOffset > window.innerHeight / 2) || (relativeOffset < 260 && relativeOffset > 100);
    }
    sortAscending(a, b) { return a - b }
    sortDescending(a, b) { return b - a }
}
export const UI_DOB_DIRECTIVES = [ManufacturingAgeComponent];
@NgModule({
    declarations: UI_DOB_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, LabelModule, UiTextBoxModule, TooltipModule],
    exports: [UI_DOB_DIRECTIVES, SharedModule],
})
export class UiManufacturingAgeModule { }