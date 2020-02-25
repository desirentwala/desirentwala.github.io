import { EnquiryInfoModel } from '../../../modules/common/enquiry/models/enquiryInfo.model';
import { EnquiryServices } from '../../../modules/common/enquiry/services/enquiry.services';
import { ConfigService } from '../../services/config.service';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../shared/shared.service';
import { Logger } from '../logger';
import { TooltipModule } from '../tooltip/index';
import { UtilsService } from '../utils/utils.service';
import { OrderBy } from './pipes/orderBy';
import { SearchBy } from './pipes/searchBy';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
export class TableInfo {
    mapping: string;
    header: string;
    showColumn: boolean;
    className: string;
    dataClickId: string;
}

@Component({

    selector: 'table-filter',
    templateUrl: './table.filter.html',
    providers: [EnquiryServices]
})

export class TableFilter implements OnChanges {
    @Input() tableData: string[];
    @Input() mappingList: string[];
    @Input() headerList: string[];
    @Input() classNameList: string[];
    @Input() isActionFlag: boolean = false;
    @Input() dataClickIdList: string[] = [];
    placeHolder: string = 'NCPBtn.search';
    tableDetails: TableInfo[] = [];
    columnsList: TableInfo[] = [];
    newTableDetails: TableInfo[] = [];
    tableDataReceived = [];
    @Input() sortByDefault: any;
    sort: any;
    @Input() showSearch: string = 'Y';
    searchId: any = '';
    @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() public doDataClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() modalID: string;
    tooltipPlacement = 'left';
    tooltipHide: boolean = false;
    translated: boolean = false;
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };
    rotateFlag = '';
    quotOpenHeldFormGroup: FormGroup;
    quotEnquiryinfo;
    constructor(shared: SharedService, quotEnquiryFB: FormBuilder, public enquiryServices: EnquiryServices, public utils: UtilsService, public loadingSub: ConfigService, public _logger: Logger,public loaderConfigService: ConfigService) {
        this.quotEnquiryinfo = new EnquiryInfoModel(quotEnquiryFB);
    }


    ngOnChanges(changes?) {
        this.tableDataReceived = this.tableData;
        this.columnsList = [];
        let tableLength = this.mappingList.length;
        for (let i = 0; i < tableLength; i++) {
            this.columnsList.push({ header: this.headerList[i], mapping: this.mappingList[i], showColumn: true, className: this.classNameList[i], dataClickId: this.dataClickIdList[i] });
        }
        this.tableDetails = this.columnsList;
        this.sort = {
            column: this.sortByDefault,
            descending: false
        };

    }


    selectedClass(columnName): any {
        return columnName === this.sort.column ? 'sort-' + this.sort.descending : false;

    }

    changeSorting(columnName): void {
        if (columnName) {
            var sort = this.sort;
            if (sort.column === columnName) {
                sort.descending = !sort.descending;
            } else {
                sort.column = columnName;
                sort.descending = false;
            }
        }
    }


    convertSorting(): string {
        return this.sort.descending ? '-' + this.sort.column : this.sort.column;
    }

    changeColumns(): any {
        this.newTableDetails = [];
        for (var i = 0; i < this.columnsList.length; i++) {
            if (this.columnsList[i].showColumn === true) {
                this.newTableDetails.push(this.columnsList[i]);
            }
        }
        this.tableDetails = this.newTableDetails;
    }

    doAction(inputParam) {

    }
    doActionProcess(inputParam, actionObject) {
        this.doClick.emit({ event: inputParam, ui: actionObject });
    }

    // From ControlValueAccessor interface 
    registerOnChange(fn: any) {
        this.onModelChange = fn;
    }
    doDataAction(inputParam, dataClickId) {
        if (dataClickId === 'referenceId') {
            if (inputParam.process === 'POL') {
                let getPolicyNo = inputParam.referenceNo;
                let policyNo = getPolicyNo.split('-');
                let policyEndtNo = policyNo[1];
                this.quotOpenHeldFormGroup = this.quotEnquiryinfo.getQuotorPolicyInfoModel();
                this.quotOpenHeldFormGroup.controls['policyInfo'].get('policyNo').setValue(policyNo[0]);
                this.quotOpenHeldFormGroup.controls['policyInfo'].get('policyEndtNo').setValue(policyEndtNo);
                this.quotOpenHeldFormGroup.controls['policyInfo'].get('status').setValue(inputParam.status);
                this.quotOpenHeldFormGroup.controls['policyInfo'].get('productCd').setValue(inputParam.productCd);
                this.quotOpenHeldFormGroup.controls['policyInfo'].updateValueAndValidity();
                this.getOpenHeldInfo(this.enquiryServices.getPolicyOpenheldInfo(this.quotOpenHeldFormGroup.value), inputParam.process);
            }
            if (inputParam.process === 'QT') {
                let quoteNumber = inputParam.referenceNo;
                let quoteNo = quoteNumber.split('-');
                let quoteVerNo = quoteNo[1];
                this.quotOpenHeldFormGroup = this.quotEnquiryinfo.getQuotorPolicyInfoModel();
                this.quotOpenHeldFormGroup.controls['policyInfo'].get('quoteNo').setValue(quoteNo[0]);
                this.quotOpenHeldFormGroup.controls['policyInfo'].get('quoteVerNo').setValue(quoteVerNo);
                this.quotOpenHeldFormGroup.controls['policyInfo'].get('status').setValue(inputParam.status);
                this.quotOpenHeldFormGroup.controls['policyInfo'].get('productCd').setValue(inputParam.productCd);
                this.quotOpenHeldFormGroup.controls['policyInfo'].updateValueAndValidity();
                this.getOpenHeldInfo(this.enquiryServices.getQuotOpenheldInfo(this.quotOpenHeldFormGroup.value));
            }
            if (inputParam.process === 'CLM') {
                let claimNumber = inputParam.referenceNo;
                this.quotOpenHeldFormGroup = this.quotEnquiryinfo.getClaimInfoModel();
                this.quotOpenHeldFormGroup.controls['claimInfo'].get('claimNo').setValue(claimNumber);
                this.quotOpenHeldFormGroup.controls['claimInfo'].get('status').setValue(inputParam.status);
                this.quotOpenHeldFormGroup.controls['claimInfo'].get('productCd').setValue(inputParam.productCd);
                this.quotOpenHeldFormGroup.controls['claimInfo'].updateValueAndValidity();
                this.getOpenHeldInfo(this.enquiryServices.getclaimOpenheldInfo(this.quotOpenHeldFormGroup.value), inputParam.process);
            }
        }
    }

    getOpenHeldInfo(enquiry, process?) {
        let quotOutput = enquiry;
        quotOutput.subscribe(
            (quotEnquiryInfodataVal) => {
                if (quotEnquiryInfodataVal.error !== null
                    && quotEnquiryInfodataVal.error !== undefined
                    && quotEnquiryInfodataVal.error.length >= 1) {
                    this._logger.error('getQuotInfo()===>' + quotEnquiryInfodataVal.error);
                } else {
                    this.loadingSub.setCustom('openHeld', quotEnquiryInfodataVal);
                    if (!quotEnquiryInfodataVal.claimInfo) {
                        let routeUrl, queryParams = {}, eventType, transactionType;
                        if (process === 'POL') {
                            this.loadingSub.setCustom('END', quotEnquiryInfodataVal);
                            eventType = 'PENQ';
                            transactionType = 'PO';
                            routeUrl = this.utils.getLOBRoute(quotEnquiryInfodataVal.policyInfo.productCd);
                        } else if (process === 'CLM') {
                            let movementType = this.loaderConfigService.get('movementType');
							let routeUrl = this.utils.getClaimRoute('VC',movementType);                     							
                        } else {
                            eventType = 'VQ';
                            transactionType = 'QT';
                            routeUrl = this.utils.getLOBRoute(quotEnquiryInfodataVal.policyInfo.productCd);
                        }
                        if (routeUrl) {
                            let queryParams = { productCode: quotEnquiryInfodataVal.policyInfo.productCd, eventType: eventType, transactionType: transactionType };
                            this.loadingSub.navigateRouterLink(routeUrl, queryParams);
                        } else { }
                    }
                    else {
                       let movementType = this.loaderConfigService.get('movementType');
                        let routeUrl = this.utils.getClaimRoute('VC',movementType);                     
                        this.loadingSub.navigateRouterLink(routeUrl);
                    }
                }
                this.loadingSub.setLoadingSub('no');
            },
            (error) => {
                this._logger.error(error);
                this.loadingSub.setLoadingSub('no');
            });
    }
}

export const UI_TABLE_FILTER_DIRECTIVES = [TableFilter, SearchBy, OrderBy];
@NgModule({
    declarations: UI_TABLE_FILTER_DIRECTIVES,
    imports: [CommonModule, FormsModule, TooltipModule, SharedModule],
    exports: UI_TABLE_FILTER_DIRECTIVES,

})
export class UiTableFilterModule { }