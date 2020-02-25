import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ConfigService } from '../../../../core/services/config.service';
import { SharedService } from '../../../../core/shared/shared.service';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { OrderBy } from '../../../../core/ui-components/table-filter/pipes/orderBy';
import { UtilsService } from './../../../../core/ui-components/utils/utils.service';
import { RenewalService } from './../../../transaction/services/renewal.service';
import { EnquiryInfoModel } from './../models/enquiryInfo.model';
import { EnquiryServices } from './../services/enquiry.services';
import { EnquiryServicesImp } from './../services/enquiry.servicesImpl';

export class TableInfo {
    mapping: string;
    header: string;
    showColumn: boolean;
    className: string;
    fieldConfig:any;
}

@Component({
    selector: 'renewal-enquiry',
    templateUrl: './renewalEnquiry.html'

})
export class RenewalEnquiryComponent implements OnInit, OnChanges {
    public renewalFormGroup: FormGroup;
    @Input() tableData: any[] = [];
    @Input() renewalActivityHeader: any[] = [];
    @Input() renewalActivityMapping: any[] = [];
    @Input() renewalActivityIconsClassNames: any[] = [];
    @Input() renewalFieldConfiguration: any[] = [];

    @Input() isActionFlag: boolean = true;
    @Input() sortByDefault: any;
    @Input() searchId: string;
    sort: any;
    Ref
    @Input() showSearch: string = 'Y';
    renewalService: RenewalService;
    errmsg: boolean;
    errors = [];
    @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() modalID: string;
    tooltipPlacement = 'left';
    tooltipHide: boolean = false;
    @Input() tableDetails: TableInfo[];
    columnsList: TableInfo[] = [];
    newTableDetails: TableInfo[] = [];
    filterModel;
    policyRenewal;
    public documentInfo;
    public policyRenewalDataVal;
    public documentViewModal: boolean = false;
    isError: boolean = false;
    previewTemplateModal: boolean = false;
    isRenewalError: boolean = false;
    renewalWithoutChangesModalView: boolean = false;
    renewalNoticeModal: boolean = false;
    errorModal: boolean = false;
    p: FormControl;
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };
    rotateFlag: '';
    abandonPolicyModal: boolean = false;
    eventData: any = [];
    eventKey: any = {};
    previewTemplateData: any;
    renewalPolicyDetailsWithoutChanges: any = {};
    timelineModal: boolean = false;
    timelineKey: any;
    eventProdCd;
    currentTimelineObj;
    existingTooltip: any = '';
    constructor(public loaderConfigService: ConfigService,
        public _logger: Logger,
        policyRenewalFB: FormBuilder,
        public changeRef: ChangeDetectorRef,
        orderBy: OrderBy,
        public enquiryServices: EnquiryServices,
        public utilsServices: UtilsService,
        shared: SharedService,
        public enquiryServicesImp: EnquiryServicesImp,
        renewalService: RenewalService) {
        this.Ref = changeRef;
        this.renewalService = renewalService;
        let policyRenewal = new EnquiryInfoModel(policyRenewalFB);
        this.policyRenewal = policyRenewal;
    }
    ngOnInit() {
        let tableLength = this.renewalActivityMapping.length;
        this.columnsList = [];
        for (let i = 0; i < tableLength; i++) {
            this.columnsList.push({ header: this.renewalActivityHeader[i], mapping: this.renewalActivityMapping[i], showColumn: true, className: this.renewalActivityIconsClassNames[i],fieldConfig:this.renewalFieldConfiguration[i]});
        }
        this.tableDetails = this.columnsList;
        this.sort = {
            column: 'NAME',
            descending: false
        };
        this.Ref.markForCheck();
    }

    ngOnChanges(changes?) {
        this.Ref.markForCheck();
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

    doAction(inputParam) {

    }

    doActionClickRow(object_row, doStatus) {
        this.renewalFormGroup = this.policyRenewal.getQuotorPolicyInfoModel();
        this.renewalFormGroup.controls['policyInfo'].patchValue(object_row);
        this.renewalFormGroup.controls['policyInfo'].updateValueAndValidity();
        let inputJSON = object_row; if (doStatus == 'REN_WC' || doStatus == 'REN_WOC') {
            this.getPolicyRenewalData(inputJSON, doStatus);
        } else if (doStatus == 'PRE_TEMP') {
            this.previewTemplate(inputJSON, doStatus);
        } else if (doStatus == 'SEN_NOT') {
            this.sendRenewalNotice(inputJSON, doStatus);
        }
    }

    previewTemplate(inputJSON, eventType) {
        this.previewTemplateModal = false;
        let previewTemplateInputJSON: any = [{ "uniqueField": inputJSON.policyNo + inputJSON.policyEndtNo, "prodCode": inputJSON.productCode, "effdate": inputJSON.effectiveDate, "fromSource": "NCP" }];
        let previewTemplateResponse = this.renewalService.getPreviewTemplate(previewTemplateInputJSON);
        previewTemplateResponse.subscribe(
            (previewTemplateResponse) => {
                if (previewTemplateResponse === null) {
                    this.loaderConfigService.setLoadingSub('no');
                } else if (previewTemplateResponse.indexOf('error') > 0 && JSON.parse(previewTemplateResponse).error !== null && JSON.parse(previewTemplateResponse).error !== undefined && JSON.parse(previewTemplateResponse).error.length >= 1) {
                    this.updateErrorObject(JSON.parse(previewTemplateResponse));
                    this.errorModal = true;
                } else {
                    this.previewTemplateData = previewTemplateResponse;
                    this.previewTemplateModal = true;
                }
                this.loaderConfigService.setLoadingSub('no');
            },
            (error) => {
                this._logger.error(error);
                this.loaderConfigService.setLoadingSub('no');
            });
    }

    sendRenewalNotice(inputJSON, eventType) {
        this.renewalNoticeModal = false;
        let renewalNoticeInput: any = { "policyInfo": { "policyNo": inputJSON.policyNo, "policyEndtNo": inputJSON.policyEndtNo, "status": "", "fromSource": "NCP", "productCd": inputJSON.productCode }, "documentInfo": [{ "dispatchType": "", "documentId": "", "isDocumentSelected": true }] };
        this.renewalService.ncpTriggerEmail(renewalNoticeInput);
        this.utilsServices.emitData.emit({ inputJSON });
        this.renewalNoticeModal = true;
    }

    getPolicyRenewalData(inputJSON, eventType) {
        let policyRenewalResponse = this.renewalService.initiateRenewal(inputJSON);
        policyRenewalResponse.subscribe(
            (policyRenewalResponse) => {
                if (policyRenewalResponse.error !== null
                    && policyRenewalResponse.error !== undefined
                    && policyRenewalResponse.error.length >= 1) {
                    this.errorModal = true;
                    this.updateErrorObject(policyRenewalResponse);
                } else {
                    this.loaderConfigService.setCustom('REN', policyRenewalResponse);
                    if (eventType == 'DOC') {
                        this.policyRenewalDataVal = policyRenewalResponse;
                        this.documentInfo = this.policyRenewalDataVal.documentInfo;
                        this.documentViewModal = true;
                        this.Ref.markForCheck();
                    } else {
                        let queryParams = { productCode: policyRenewalResponse.policyInfo.productCd, eventType: eventType, transactionType: 'REN' };
                        let routeUrl = this.utilsServices.getLOBRoute(policyRenewalResponse.policyInfo.productCd);
                        if (routeUrl) {
                            this.loaderConfigService.navigateRouterLink(routeUrl, queryParams);
                        } else {
                            this.utilsServices.loadedSub.subscribe(() => {
                                queryParams = { productCode: policyRenewalResponse.policyInfo.productCd, eventType: eventType, transactionType: 'REN' };
                                routeUrl = this.utilsServices.getLOBRoute(policyRenewalResponse.policyInfo.productCd);
                                if (routeUrl) this.loaderConfigService.navigateRouterLink(routeUrl, queryParams);
                            });
                        }
                    }
                }
                this.loaderConfigService.setLoadingSub('no');
            },
            (error) => {
                this._logger.error(error);
                this.loaderConfigService.setLoadingSub('no');
            });
    }

    public updateErrorObject(errorObject) {
        this.isError = false;
        this.isRenewalError = false;
        this.errors = [];
        for (let i = 0; i < errorObject.error.length; i++) {
            if (errorObject.error[i].errCode) {
                this.errors.push({ 'errCode': errorObject.error[i].errCode, 'errDesc': errorObject.error[i].errDesc });
                this._logger.log('Error===>' + errorObject.error[i].errCode + ':' + errorObject.error[i].errDesc);
            }
        }
        this.isError = true;
        this.isRenewalError = true;
        this.changeRef.markForCheck();
    }
    closePolicyAbandonQuotModal() {
        this.abandonPolicyModal = false;
        this.changeRef.markForCheck();
        this.loaderConfigService.setLoadingSub('no');
    }

    closeErrorModal() {
        this.errorModal = false;
        this.changeRef.markForCheck();
        this.loaderConfigService.setLoadingSub('no');
    }

    doCloseTimelineModal() { }

    public documentView(documentIndex) {
        let tempDispatchType;
        for (let i = 0; i < this.documentInfo.length; i++) {
            this.documentInfo[i].isDocumentSelected = (i === documentIndex) ? true : false;
            if (this.documentInfo[i].isDocumentSelected) {
                tempDispatchType = this.documentInfo[i].dispatchType;
                this.documentInfo[i].dispatchType = 'PREVIEW';
            }
        }
        this.policyRenewalDataVal.documentInfo = this.documentInfo;
        this.enquiryServices.getDocumentInfo(this.policyRenewalDataVal);
        for (let j = 0; j < this.documentInfo.length; j++) {
            if (this.documentInfo[j].isDocumentSelected) {
                this.documentInfo[j].dispatchType = tempDispatchType;
            }
        }

    }

    doView() {
        if (this.currentTimelineObj) {
            this.doActionClickRow(this.currentTimelineObj, 'PENQ');
        }
    }
}
