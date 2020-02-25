import { SharedModule } from '../../shared/shared.module';
import { Component, Input, OnInit, NgModule } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { CommonModule }        from '@angular/common';
@Component({
    selector: 'tab-error',
    templateUrl: 'tab.error.msg.html'
})
export class TabErrorComponent implements OnInit {
    @Input() displayFlag: boolean;
    @Input() errorMessage: any;
    utils: UtilsService;
    constructor(_utils: UtilsService) {
        this.utils = _utils;
    }
    ngOnInit() {
        // this.errorMessage = this.utils.getTranslated(this.errorMessage);
    }
}



@NgModule({
    imports: [CommonModule,SharedModule],
    exports: [TabErrorComponent],
    declarations: [TabErrorComponent],
})
export class TabErrorModule { }
