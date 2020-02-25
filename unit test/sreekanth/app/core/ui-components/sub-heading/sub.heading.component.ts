import { SharedModule } from '../../shared/shared.module';
import { Component, NgModule, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../utils/utils.service';
import { LabelModule } from '../label/label.component';
import { TooltipModule } from '../tooltip/index';
@Component({

    selector: 'sub-heading',
    templateUrl: './sub.heading.html',
})

export class SubHeadingComponent implements OnInit {
    @Input() heading: string;
    @Input() customFlag: boolean = false;
    @Input() subheadingCustomClass: string = '';
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    @Input() elementId: any = '';
    utils: UtilsService;
    constructor(_utils: UtilsService) {
        this.utils = _utils;
    }
    ngOnInit() {
        // this.heading = this.utils.getTranslated(this.heading);
    }
}

@NgModule({
    declarations: [SubHeadingComponent],
    imports: [CommonModule, LabelModule,TooltipModule,SharedModule],
    exports: [SubHeadingComponent]
})
export class SubHeadingModule { }
