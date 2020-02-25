import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { SharedService } from './../../shared/shared.service';
import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { TooltipModule } from "../tooltip/index";

@Component({

    selector: 'ncp-label',
    templateUrl: 'label.html',
})
export class LabelComponent {
    @Input() elementLabel: string;
    @Input() elementId: string;
    @Input() mandatoryFlag: boolean = false;
    @Input() customFlag: boolean = false;
    @Input() labelClass: string = '';
    @Input() iconClass: string = '';
    @Input() tooltipPlacement: string = 'right';
    @Input() tooltipTitle: string;
    @Input() labelInnerClass: string = '';
  

    utils: UtilsService;
    constructor(sharedService: SharedService, _utils: UtilsService) {
        this.utils = _utils;
    }
}

@NgModule({
    imports: [CommonModule, SharedModule,TooltipModule],
    declarations: [LabelComponent],
    exports: [LabelComponent, SharedModule],
})
export class LabelModule { }
