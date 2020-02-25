import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { SharedService } from './../../shared/shared.service';


@Component({

    selector: 'ncp-errorHandler',
    templateUrl: 'errorHandler.html',
})
export class ErrorHandlerComponent implements OnChanges {
    @Input() isError: string;
    @Input() errors: any[];
    @Input() errorInfo: any[];
    @Input() customFlag: boolean = false;
    @Input() errorCustomClass: string = '';

    utils: UtilsService;
    constructor(sharedService: SharedService, _utils: UtilsService) {
        this.utils = _utils;
    }
    ngOnChanges(change?) {
        window.scroll(0, 0);
        if (this.errors && this.errors.length > 0) {
            this.errors.forEach(element => {
                let errorCode = this.utils.getTranslated(element['errCode']);
                if (errorCode === element['errCode']) {
                    element['errCode'] = element['errDesc'];
                } else {
                    element['errCode'] = errorCode;
                }
            });
        }
        if (this.errorInfo) {
            if (this.errorInfo && this.errorInfo.length > 0 ? (this.errorInfo[0].errCode || this.errorInfo[0].errDesc) : false) {
                this.errors = [];
            }
            this.errorInfo.forEach(element => {
                if(element.errCode && element.errDesc){
                let tempErrorObject: any = { errCode: '', errDesc: '' };
                tempErrorObject.errCode = element.errDesc;
                tempErrorObject.errDesc = element.errDesc;
                this.errors.push(tempErrorObject);
            }
            });
        }
    }
}
@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [ErrorHandlerComponent],
    exports: [ErrorHandlerComponent, SharedModule],
})
export class ErrorHandlerModule { }
