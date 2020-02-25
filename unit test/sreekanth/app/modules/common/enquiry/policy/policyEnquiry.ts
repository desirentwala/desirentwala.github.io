import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { EventService } from '../../../../core/services/event.service';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { OrderBy } from '../../../../core/ui-components/table-filter/pipes/orderBy';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { EmailIdvalidators } from '../../../../core/ui-components/validators/emailid/emailid.validator';
import { ElementConstants } from '../../../transaction/constants/ncpElement.constants';
import { EnquiryInfoModel } from '../models/enquiryInfo.model';
import { EnquiryServices } from '../services/enquiry.services';
import { EnquiryServicesImp } from '../services/enquiry.servicesImpl';
import { ShareReassignService } from '../../shareReassign/services/shareReassign.service';
import { SharedService } from '../../../../core/shared/shared.service';
import { ConfigService } from '../../../../core/services/config.service';
import { Subject } from '@adapters/packageAdapter';


export class TableInfo {
    mapping: string;
    header: string;
    showColumn: boolean;
    className: string;
    fieldConfig:any;
}

@Component({
    selector: 'policy-enquiry',
    templateUrl: './policyEnquiry.html',
    providers: []

})
export class PolicyEnquiryComponent implements OnInit, OnChanges {
    public policyInfoFormGroup: FormGroup;
    public emailDocumentsFormGroup: FormGroup;

    @Input() tableData: any[] = [];
    @Input() policyActivityHeader: any[] = [];
    @Input() policyActivityMapping: any[] = [];
    @Input() policyActivityIconsClassNames: any[] = [];
    @Input() policyFieldConfiguration: any[] = [];
    
    @Input() pmovFlag: boolean = false;
    @Input() isActionFlag: boolean = true;
    @Input() sortByDefault: any;
    @Input() searchId: string;
    sort: any;
    Ref
    @Input() showSearch: string = 'Y';
    @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() modalID: string;
    tooltipPlacement = 'left';
    tooltipHide: boolean = false;
    @Input() tableDetails: TableInfo[];
    columnsList: TableInfo[] = [];
    newTableDetails: TableInfo[] = [];
    filterModel;
    policyEnquiryInfo;
    public documentInfo;
    public policyEnquiryInfodataVal;
    public documentViewModal: boolean = false;
    p: FormControl;
    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };
    rotateFlag: '';
    abandonPolicyModal: boolean = false;
    eventData: any = [];
    eventKey: any = {};
    timelineModal: boolean = false;
    timelineKey: any;
    eventProdCd;
    currentTimelineObj;
    existingTooltip: any = '';
    emailDocumentsInput: any = {};
    emailDocumentsSuccessModal: boolean = false;
    errmsg: Boolean = false;
    errmsgSelectDoc: Boolean = false;
    errmsgSelectAtleastDoc: Boolean = false;
    errmsgNoDocuments: Boolean = false;
    isEmailWithDocs: Boolean = true;
    public flagSelected: number = 0;
    public flagDocumentSelected: number = 0;
    public flagDocumentUnSelected: number = 0;
    public flagSelectAll: boolean = false;
    emailTemplateResponse: any = {};
    flagCount: number = 0;
    errmsgUnselectAll: Boolean = false;
    clickSub: any;
    eventHandler: EventService;
    shareReassignInfo: FormGroup
    permissions ;
    shareWindow: boolean = false;
    sharedService;
    loader: boolean = false;
    userID: string;
    hideAbandonFlag : boolean = false;
    constructor(public loaderConfigService: ConfigService,
        _eventHandler: EventService,
        shareReassignService:ShareReassignService,
        _sharedService:SharedService,
        public _logger: Logger,
        policyEnquiryFB: FormBuilder,
        public changeRef: ChangeDetectorRef,
        orderBy: OrderBy,
        public enquiryServices: EnquiryServices,
        public utilsServices: UtilsService,
        public translate: TranslateService,
        public enquiryServicesImp: EnquiryServicesImp) {
        this.eventHandler = _eventHandler;
        this.Ref = changeRef;
        let policyInfo = new EnquiryInfoModel(policyEnquiryFB);
        this.policyEnquiryInfo = policyInfo;
        this.shareReassignInfo = shareReassignService.getShareReassingInfoModel();
        this.sharedService = _sharedService;
        this.userID = this.loaderConfigService.getCustom('user_id');
    }
    ngOnInit() {

        let tableLength = this.policyActivityMapping.length;
        this.columnsList = [];
        for (let i = 0; i < tableLength; i++) {
            this.columnsList.push({ header: this.policyActivityHeader[i], mapping: this.policyActivityMapping[i], showColumn: true, className: this.policyActivityIconsClassNames[i],fieldConfig:this.policyFieldConfiguration[i] });
        }
        this.tableDetails = this.columnsList;
        this.sort = {
            column: 'NAME',
            descending: false
        };
        this.emailDocumentsFormGroup = this.policyEnquiryInfo.getEmailDocumentsInfoModel();
        let emailTemplateResponse = this.loaderConfigService.getJSON({ key: 'META', path: 'emailTemplate' });
        emailTemplateResponse.subscribe(
            (emailTemplateResponseData) => {
                if (emailTemplateResponseData.error !== null
                    && emailTemplateResponseData.error !== undefined
                    && emailTemplateResponseData.error.length >= 1) {
                    this._logger.error('ncpJsonCall()===>' + emailTemplateResponseData.error);
                } else {
                    this.emailTemplateResponse = emailTemplateResponseData;
                }
            });

        this.clickSub = this.eventHandler.clickSub.subscribe((data) => {
            if (data.id === 'sendEmailwithDocuments') {
                this.sendEmailwithDocuments();
            }
            this.changeRef.markForCheck();
        });
        this.hideAbandonFlag = this.loaderConfigService.get('hideAbandonOption');
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
    doActionClickRow(object_row, doStatus) {
        this.loaderConfigService.setCustom('policyMoventBackButton', this.pmovFlag);
        this.policyInfoFormGroup = this.policyEnquiryInfo.getQuotorPolicyInfoModel();
        this.policyInfoFormGroup.controls['policyInfo'].patchValue(object_row);
        this.policyInfoFormGroup.controls['policyInfo'].get('branchCd').patchValue(this.loaderConfigService.getCustom('user_branch'));
        this.policyInfoFormGroup.controls['policyInfo'].get('userId').setValue(object_row.b2bUserId);
        this.policyInfoFormGroup.controls['policyInfo'].updateValueAndValidity();
        let policyLastMovementData = {};
        if (doStatus === 'PENQ' || doStatus === 'ENDT' || doStatus === 'PHLD' || doStatus === 'DOC' || doStatus === 'NC' || doStatus === 'POL_REINI' || doStatus === 'PMOV') {
            if (doStatus === 'NC') {
                let policyNo = this.policyInfoFormGroup.controls['policyInfo'].get('policyNo').value;
                this.loaderConfigService.setCustom('policyNo', policyNo);
                this.getPolicyEnquiryData(this.policyInfoFormGroup.value, doStatus);
            } else if (doStatus === 'ENDT' || doStatus === 'PHLD') {
                // + Patch the last movement premium into summaryInfo as summaryInfo will not be there in defaulting output
                if (doStatus === 'PHLD' || !object_row.plans) this.doSetLastPremium(doStatus);
                else {
                    policyLastMovementData['selectedCoverCode'] = object_row.planTypeCode;
                    policyLastMovementData['selectedCoverDesc'] = object_row.planTypeDesc;
                    policyLastMovementData['lastPremium'] = object_row.netPremium;
                    policyLastMovementData['plans'] = JSON.parse(object_row.plans);
                    this.loaderConfigService.setCustom('policyLastMovementData', policyLastMovementData);
                    this.getPolicyEnquiryData(this.policyInfoFormGroup.value, doStatus);
                }
            } else {
                this.getPolicyEnquiryData(this.policyInfoFormGroup.value, doStatus);
            }
        } else if (doStatus === 'PABN') {
            this.doPolicyAbandon(this.policyInfoFormGroup.value);
        }
        else if (doStatus === 'PMOV') {
            this.getPolicyEnquiryData(this.policyInfoFormGroup.value, doStatus);
        } else if (doStatus === 'SH' || doStatus === 'RA') {
            this.shareReassignInfo.reset();
            this.shareReassignInfo.controls['txnId'].patchValue(object_row.policyNo)
            this.shareReassignInfo.controls['txnVerNo'].patchValue(object_row.policyEndtNo)
            this.shareReassignInfo.controls['txnId'].updateValueAndValidity()
            this.shareReassignInfo.controls['txnType'].patchValue(ElementConstants.policyTxnType)
            this.shareReassignInfo.controls['txnType'].updateValueAndValidity()
            this.shareReassignInfo.controls['type'].patchValue(doStatus)
            this.shareReassignInfo.controls['type'].updateValueAndValidity()
            this.shareReassignInfo.controls['permissions'].patchValue(this.permissions)
            this.shareReassignInfo.controls['permissions'].updateValueAndValidity()
            this.shareWindow = true
            this.changeRef.markForCheck()
        } 
    }
    getPolicyEnquiryData(dataInputValue, eventType) {
        let type = 'PO';
        let policyOutput = this.enquiryServices.getPolicyOpenheldInfo(dataInputValue);
        policyOutput.subscribe(
            (policyEnquiryInfodataVal) => {
                if (policyEnquiryInfodataVal.error !== null
                    && policyEnquiryInfodataVal.error !== undefined
                    && policyEnquiryInfodataVal.error.length >= 1) {
                    this._logger.error('getPolicyEnquiryData()===>' + policyEnquiryInfodataVal.error);
                } else {
                    policyEnquiryInfodataVal.policyInfo.statusDesc = dataInputValue.policyInfo.statusDesc;
                    if (policyEnquiryInfodataVal.policyInfo.endtReasonCode == this.utilsServices.getEndorsementTypeCode('RENEWAL') && (eventType === 'PHLD' || eventType === 'PENQ')) {
                        if (eventType === 'PHLD') {
                            eventType = 'REN_WC';
                            this.loaderConfigService.setCustom('REN', policyEnquiryInfodataVal);
                        }
                        else if (eventType === 'PENQ') {
                            // eventType = 'VQ';
                            this.loaderConfigService.setCustom('openHeld', policyEnquiryInfodataVal);
                        }
                        type = 'REN';
                    } else {
                        if (eventType === 'POL_REINI') {
                            this.doPolicyReiniEndorsement(policyEnquiryInfodataVal);
                            this.loaderConfigService.setLoadingSub('yes');
                        } else {
                            this.loaderConfigService.setCustom('END', policyEnquiryInfodataVal);
                            this.loaderConfigService.setLoadingSub('no');
                        }
                    }
                    if (eventType == 'DOC') {
                        this.policyEnquiryInfodataVal = policyEnquiryInfodataVal;
                        this.documentInfo = this.policyEnquiryInfodataVal.documentInfo;
                        if (this.documentInfo != undefined && this.documentInfo.length == 0) {
                            this.errmsgNoDocuments = true;
                        } else if (this.documentInfo != undefined && this.documentInfo.length > 0) {
                            this.errmsgNoDocuments = false;
                        }
                        if (this.isEmailWithDocs) {
                            this.emailDocumentsFormGroup.get('toAddress').patchValue(this.policyEnquiryInfodataVal.customerInfo.emailId);
                            this.emailDocumentsFormGroup.get('toAddress').updateValueAndValidity();
                            let subject = "Document - " + this.policyEnquiryInfodataVal.policyInfo.policyNo;
                            this.emailDocumentsFormGroup.get('subject').patchValue(subject);
                            this.emailDocumentsFormGroup.get('subject').updateValueAndValidity();
                            this.emailDocumentsFormGroup.get('fromAddress').patchValue(this.emailTemplateResponse.fromAddress);
                            this.emailDocumentsFormGroup.get('fromAddress').updateValueAndValidity();
                            this.emailDocumentsFormGroup.get('emailBody').patchValue(this.emailTemplateResponse.emailBody);
                            this.emailDocumentsFormGroup.get('emailBody').updateValueAndValidity();
                            this.emailDocumentsFormGroup.get('policyNo').patchValue(this.policyEnquiryInfodataVal.policyInfo.policyNo);
                            this.emailDocumentsFormGroup.get('policyNo').updateValueAndValidity();
                            this.emailDocumentsFormGroup.get('policyEndtNo').patchValue(this.policyEnquiryInfodataVal.policyInfo.policyEndtNo);
                            this.emailDocumentsFormGroup.get('policyEndtNo').updateValueAndValidity();
                            this.emailDocumentsFormGroup.get('effectiveDt').patchValue(this.policyEnquiryInfodataVal.policyInfo.effectiveDt);
                            this.emailDocumentsFormGroup.get('effectiveDt').updateValueAndValidity();
                            this.emailDocumentsFormGroup.get('selectAllOption').patchValue(false);
                            this.emailDocumentsFormGroup.get('selectAllOption').updateValueAndValidity();
                            this.emailDocumentsFormGroup.get('isDocumentSelected').patchValue(false);
                            this.emailDocumentsFormGroup.get('isDocumentSelected').updateValueAndValidity();
                            this.emailDocumentsFormGroup.get('ccAddress').setValue(null);
                            this.emailDocumentsFormGroup.get('ccAddress').updateValueAndValidity();
                            this.errmsg = false;
                            this.errmsgSelectDoc = false;
                            this.errmsgSelectAtleastDoc = false;
                            this.flagSelectAll = false;
                            this.flagCount = 0;
                        }
                        this.documentViewModal = true;
                        this.errmsgUnselectAll = false;
                        this.loaderConfigService.setLoadingSub('no');
                        this.Ref.markForCheck();
                    } else {
                        let queryParams = {};
                        let routeUrl = eventType === 'ENDT' ? this.utilsServices.getEndorsementRoute() : this.utilsServices.getLOBRoute(policyEnquiryInfodataVal.policyInfo.productCd);
                        if (eventType === 'ENDT') {
                            routeUrl = this.utilsServices.getEndorsementRoute();
                        } else if (eventType === 'NC') {
                            if (this.loaderConfigService.get('lifeLOBFlag') && policyEnquiryInfodataVal.riskInfo) {
                                let lifeAssuredFullName =  policyEnquiryInfodataVal.riskInfo[0].insuredList[0].appFullName;
                                let lifeAssuredAppCode =  policyEnquiryInfodataVal.riskInfo[0].insuredList[0].appCode;
                                if (lifeAssuredAppCode) {
                                    this.loaderConfigService.setCustom('lifeAssuredCd', lifeAssuredAppCode);
                                    this.loaderConfigService.setCustom('lifeAssuredDesc', lifeAssuredFullName);
                                }
                            }
                            let movementType = this.loaderConfigService.get('movementType');
                            routeUrl = this.utilsServices.getClaimRoute(eventType, movementType);
                        }
                        else if (eventType === 'PMOV') {
                            this.loaderConfigService.setCustom('policyMoventNo', dataInputValue);
                            routeUrl = '/ncp/activity/policyMove';
                        }
                        else {
                            routeUrl = this.utilsServices.getLOBRoute(policyEnquiryInfodataVal.policyInfo.productCd);
                            queryParams = { productCode: policyEnquiryInfodataVal.policyInfo.productCd, eventType: eventType, transactionType: type };
                        }
                        if (routeUrl) {
                            this.loaderConfigService.navigateRouterLink(routeUrl, queryParams);
                        } else {
                            this.utilsServices.loadedSub.subscribe(() => {
                                routeUrl = this.utilsServices.getLOBRoute(policyEnquiryInfodataVal.policyInfo.productCd);
                                if (routeUrl) this.loaderConfigService.navigateRouterLink(routeUrl, queryParams);
                            });
                        }
                    }

                }
                //  this.loaderConfigService.setLoadingSub('no');
            },
            (error) => {
                this._logger.error(error);
                this.loaderConfigService.setLoadingSub('no');
            });

    }
    public documentView(documentIndex) {
        let tempDispatchType;
        for (let i = 0; i < this.documentInfo.length; i++) {
            this.documentInfo[i].isDocumentSelected = (i === documentIndex) ? true : false;
            if (this.documentInfo[i].isDocumentSelected) {
                tempDispatchType = this.documentInfo[i].dispatchType;
                this.documentInfo[i].dispatchType = 'PREVIEW';
            }
        }
        this.policyEnquiryInfodataVal.documentInfo = this.documentInfo;
        this.enquiryServices.getDocumentInfo(this.policyEnquiryInfodataVal);
        for (let j = 0; j < this.documentInfo.length; j++) {
            if (this.documentInfo[j].isDocumentSelected) {
                this.documentInfo[j].dispatchType = tempDispatchType;
            }
        }

    }

    public doPolicyAbandon(dataInputValue) {
        let policyOutput = this.enquiryServices.doPolicyAbandon(dataInputValue);
        policyOutput.subscribe(
            (policyEnquiryInfodataVal) => {
                if (policyEnquiryInfodataVal.error !== null
                    && policyEnquiryInfodataVal.error !== undefined
                    && policyEnquiryInfodataVal.error.length > 0) {
                    this._logger.error('doPolicyAbondon()===>' + policyEnquiryInfodataVal.error);
                } else {
					this.loaderConfigService.resetfilterModel();
                    this.enquiryServicesImp.getPolicyEnquiry(this.loaderConfigService.getfilterModel());
                    this.enquiryServicesImp.policyPushedData.subscribe(data => {
                        if (policyEnquiryInfodataVal) {
                            this.tableData = data;
                            this.abandonPolicyModal = true;
                            this.changeRef.markForCheck();
                        }
                        policyEnquiryInfodataVal = '';
                        this.loaderConfigService.setLoadingSub('no');
                    });
                }
                this.loaderConfigService.setLoadingSub('no');
            },
            (error) => {
                this._logger.error(error);
                this.loaderConfigService.setLoadingSub('no');
            });
    }
    closePolicyAbandonQuotModal() {
        this.abandonPolicyModal = false;
        this.changeRef.markForCheck();
        this.loaderConfigService.setLoadingSub('no');
    }

    openTimeline(policyObj) {
        this.loaderConfigService.setLoadingSub('yes');
        this.eventData = [];
        let eventId = policyObj['policyNo'];
        this.timelineKey = policyObj['policyNo'];
        this.currentTimelineObj = policyObj;
        var timelineResp = this.enquiryServices.getTimeLineDetails({ eventID: eventId, "processType": "POL" });
        timelineResp.subscribe((data) => {
            if (data.error !== null
                && data.error !== undefined
                && data.error.length >= 1) {
                this._logger.error('getTimeLineDetails()===>' + data.error);
                this.loaderConfigService.setLoadingSub('no');
            } else {
                if (data['eventDetails'] instanceof Array && data['eventID']) {
                    let temp = data['eventDetails'];
                    this.eventKey['policyNo'] = data['eventID'];
                    this.eventProdCd = data['productCd'];
                    if (data['dependentEventID']) {
                        var eventJson = { eventID: data['dependentEventID'] };
                        var quotTimelineResp = this.enquiryServices.getTimeLineDetails(eventJson);
                        quotTimelineResp.subscribe((data1) => {
                            if (data1.error !== null
                                && data1.error !== undefined
                                && data1.error.length >= 1) {
                                this._logger.error('getTimeLineDetails()===>' + data1.error);
                            } else {
                                if (data1['eventDetails'] instanceof Array && data1['eventID']) {
                                    temp.push(...data1['eventDetails']);
                                    if (data1['eventID'].length == 14) {
                                        this.eventData = temp;
                                        this.eventKey.quoteNo = data1['eventID'];
                                        this.timelineModal = true;
                                        this.loaderConfigService.setLoadingSub('no');
                                    } else {
                                        this.eventKey.renPolicyNo = this.eventKey.policyNo;
                                        this.eventKey.policyNo = data1['eventID'];
                                        if (data1['dependentEventID']) {
                                            eventJson = { eventID: data1['dependentEventID'] };
                                            var timelineResp = this.enquiryServices.getTimeLineDetails(eventJson);
                                            timelineResp.subscribe((data2) => {
                                                if (data2.error !== null
                                                    && data2.error !== undefined
                                                    && data2.error.length >= 1) {
                                                    this._logger.error('getTimeLineDetails()===>' + data2.error);
                                                } else {
                                                    if (data2['eventDetails'] instanceof Array && data2['eventID']) {
                                                        temp.push(...data2['eventDetails']);
                                                        this.eventData = temp;
                                                        this.eventKey.quoteNo = data2['eventID'];
                                                        this.timelineModal = true;
                                                        this.loaderConfigService.setLoadingSub('no');
                                                    }
                                                }
                                            });
                                        } else {
                                            this.timelineModal = true;
                                            this.loaderConfigService.setLoadingSub('no');
                                        }
                                    }
                                }
                            }
                        });
                    } else {
                        this.timelineModal = true;
                        this.loaderConfigService.setLoadingSub('no');
                    }
                }
            }
        });
    }

    doCloseTimelineModal() {
        this.timelineModal = false;
        this.timelineKey = '';
        this.eventData = [];
        this.eventKey = {};
        this.currentTimelineObj = {};
    }

    doView() {
        if (this.currentTimelineObj) {
            this.doActionClickRow(this.currentTimelineObj, 'PENQ');
        }
    }

    doSetLastPremium(eventType) {
        let object_row_ref = JSON.parse(JSON.stringify(this.policyInfoFormGroup.value));
        let oldPolicyEndtNo: number = parseInt(object_row_ref.policyInfo.policyEndtNo) - 1;
        oldPolicyEndtNo = oldPolicyEndtNo == -1 ? 0 : oldPolicyEndtNo;
        object_row_ref.policyInfo.policyEndtNo = '00' + oldPolicyEndtNo;
        object_row_ref.policyInfo.statusDesc = 'New Business';
        object_row_ref.policyInfo.status = 'PT';
        let policyOutput = this.enquiryServices.getPolicyOpenheldInfo(object_row_ref);
        policyOutput.subscribe(
            (policyEnquiryInfodataVal) => {
                if (policyEnquiryInfodataVal.error !== null
                    && policyEnquiryInfodataVal.error !== undefined
                    && policyEnquiryInfodataVal.error.length >= 1) {
                    this._logger.error('doSetLastPremium()===>' + policyEnquiryInfodataVal.error);
                } else {
                    this.doSetSelectedCoverType(policyEnquiryInfodataVal);
                    this.getPolicyEnquiryData(this.policyInfoFormGroup.value, eventType);
                }
                this.loaderConfigService.setLoadingSub('no');
            },
            (error) => {
                this._logger.error(error);
                this.loaderConfigService.setLoadingSub('no');
            });

    }
    doSetSelectedCoverType(policyEnquiryInfodataVal) {
        if (policyEnquiryInfodataVal) {
            let policyLastMovementData = {};
            policyLastMovementData['lastPremium'] = policyEnquiryInfodataVal.summaryInfo.netPremiumPrime;
            policyEnquiryInfodataVal.riskInfo[0].plans.forEach(element => {
                if (element.isPlanSelected) {
                    policyLastMovementData['selectedCoverCode'] = element.planTypeCode;
                    policyLastMovementData['selectedCoverDesc'] = element.planTypeDesc;
                }
            });
            policyLastMovementData['plans'] = policyEnquiryInfodataVal.riskInfo[0].plans;
            this.loaderConfigService.setCustom('policyLastMovementData', policyLastMovementData);
        }
    }
    selectAllDocuments(documentInfo) {
        this.errmsgSelectDoc = false;
        this.errmsgSelectAtleastDoc = false;
        this.errmsgUnselectAll = false;
        if (this.emailDocumentsFormGroup.get('selectAllOption').value) {
            for (let i = 0; i < documentInfo.length; i++) {
                documentInfo[i].isDocumentSelected = true;
                this.emailDocumentsFormGroup.get('isDocumentSelected').patchValue(true);
                this.emailDocumentsFormGroup.get('isDocumentSelected').updateValueAndValidity();
                this.emailDocumentsFormGroup.get('sendAttachedFiles').patchValue('Y');
                this.emailDocumentsFormGroup.get('sendAttachedFiles').updateValueAndValidity();
            }
            this.documentInfo = documentInfo;
            if (this.flagDocumentSelected == 0) this.errmsgSelectDoc = true;
        } else if (!this.emailDocumentsFormGroup.get('selectAllOption').value) {
            this.flagDocumentSelected = 1;
            this.errmsgSelectAtleastDoc = false;
            for (let i = 0; i < documentInfo.length; i++) {
                documentInfo[i].isDocumentSelected = false;
                this.emailDocumentsFormGroup.get('isDocumentSelected').patchValue(false);
                this.emailDocumentsFormGroup.get('isDocumentSelected').updateValueAndValidity();
                this.emailDocumentsFormGroup.get('sendAttachedFiles').patchValue('N');
                this.emailDocumentsFormGroup.get('sendAttachedFiles').updateValueAndValidity();
            }
            this.errmsgUnselectAll = true;
            this.documentInfo = documentInfo;
        }
        if (this.flagDocumentSelected == 0) {
            this.errmsgSelectDoc = true;
        } else {
            this.errmsgSelectDoc = false;
        }
        this.flagCount = this.emailDocumentsFormGroup.get('selectAllOption').value ? this.documentInfo.length : 0;
    }
    selectDocument(documentId, documentInfo) {
        this.errmsgSelectDoc = false;
        this.errmsgSelectAtleastDoc = false;
        let allDocSelectedFlag: boolean = false;
        if (this.emailDocumentsFormGroup.get('isDocumentSelected').value === true) {
            for (let i = 0; i < documentInfo.length; i++) {
                if (documentInfo[i].documentId === documentId && this.documentInfo[i].isDocumentSelected === true) {
                    allDocSelectedFlag = true;
                    this.documentInfo[i].isDocumentSelected = false;
                } else if (documentInfo[i].documentId === documentId) {
                    this.flagDocumentSelected = 1;
                    documentInfo[i].isDocumentSelected = true;
                    allDocSelectedFlag = false;
                }
            }
            this.documentInfo = documentInfo;
            if (this.emailDocumentsFormGroup.get('isDocumentSelected').value === true) this.flagCount += 1;
            else this.flagCount -= 1;
            if (allDocSelectedFlag && (this.flagCount === this.documentInfo.length)) {
                this.emailDocumentsFormGroup.get('selectAllOption').patchValue(true);
                this.emailDocumentsFormGroup.get('selectAllOption').updateValueAndValidity();
                this.emailDocumentsFormGroup.get('sendAttachedFiles').patchValue('Y');
                this.emailDocumentsFormGroup.get('sendAttachedFiles').updateValueAndValidity();
            }
            if (this.flagDocumentSelected == this.documentInfo.length) {
                this.emailDocumentsFormGroup.get('selectAllOption').patchValue(true);
                this.emailDocumentsFormGroup.get('selectAllOption').updateValueAndValidity();
            }
        } else if (!this.emailDocumentsFormGroup.get('isDocumentSelected').value == true) {
            if (this.emailDocumentsFormGroup.get('selectAllOption').value) {
                this.emailDocumentsFormGroup.get('selectAllOption').patchValue(false);
                this.emailDocumentsFormGroup.get('selectAllOption').updateValueAndValidity();
                this.emailDocumentsFormGroup.get('sendAttachedFiles').patchValue('N');
                this.emailDocumentsFormGroup.get('sendAttachedFiles').updateValueAndValidity();
            }
            for (let i = 0; i < documentInfo.length; i++) {
                if (documentInfo[i].documentId === documentId) {
                    documentInfo[i].isDocumentSelected = false;
                    allDocSelectedFlag = false;
                    this.flagCount -= 1;
                }
            }
        }
        this.documentInfo = documentInfo;
    }

    emailValidate() {
        this.emailDocumentsFormGroup.get('fromAddress').setValidators(Validators.compose([EmailIdvalidators.mailFormat, Validators.required]));
        this.emailDocumentsFormGroup.get('fromAddress').updateValueAndValidity();
        this.emailDocumentsFormGroup.get('toAddress').setValidators(Validators.compose([EmailIdvalidators.multiplemailFormat(), Validators.required]));
        this.emailDocumentsFormGroup.get('toAddress').updateValueAndValidity();
        if (this.emailDocumentsFormGroup.get('ccAddress').value) {
            this.emailDocumentsFormGroup.get('ccAddress').setValidators(Validators.compose([EmailIdvalidators.multiplemailFormat()]));
            this.emailDocumentsFormGroup.get('ccAddress').updateValueAndValidity();
        } else if (this.emailDocumentsFormGroup.get('ccAddress').value === null) {
            this.emailDocumentsFormGroup.get('ccAddress').setValue('');
        }
        if (this.emailDocumentsFormGroup.get('selectAllOption').value) {
            this.flagSelectAll = true;
        }

        if (this.flagSelectAll == false) {
            this.errmsgSelectAtleastDoc = true;
        }
        if (this.flagDocumentSelected == 1) {
            this.errmsgSelectAtleastDoc = false;
            this.errmsgUnselectAll = false;
        }
        let emailTemplateList: any = [];
        if (this.documentInfo != undefined && this.documentInfo.length > 0) {
            let index = 0;
            for (let i = 0; i < this.documentInfo.length; i++) {
                if (this.documentInfo[i].isDocumentSelected === true) {
                    emailTemplateList[index] = this.documentInfo[i].documentId;
                    index++;
                }
            }
            this.emailDocumentsFormGroup.get('emailTemplateIdList').patchValue(emailTemplateList);
            this.emailDocumentsFormGroup.get('emailTemplateIdList').updateValueAndValidity();
            if (index == 0 && this.flagDocumentSelected == 1) {
                this.errmsgSelectAtleastDoc = true;
            } else {
                this.errmsgSelectAtleastDoc = false;
            }
        }
    }

    sendEmailwithDocuments() {

        // this.errmsgSelectAtleastDoc = this.flagCount === 0;

        if (this.emailDocumentsFormGroup.get('toAddress').valid && this.emailDocumentsFormGroup.get('ccAddress').valid && this.emailDocumentsFormGroup.get('fromAddress').valid) {
            let emailTemplateList: any = [];

            if (this.documentInfo != undefined && this.documentInfo.length > 0) {
                let index = 0;
                for (let i = 0; i < this.documentInfo.length; i++) {
                    if (this.documentInfo[i].isDocumentSelected === true) {
                        emailTemplateList[index] = this.documentInfo[i].documentId;
                        index++;
                    }
                }
                this.emailDocumentsFormGroup.get('emailTemplateIdList').patchValue(emailTemplateList);
                this.emailDocumentsFormGroup.get('emailTemplateIdList').updateValueAndValidity();
                // if (index == 0 && this.flagDocumentSelected == 1) {
                //     this.errmsgSelectAtleastDoc = true;
                // } else {
                //     this.errmsgSelectAtleastDoc = false;
                // }
            }
            let emailDocumentsResponse = this.enquiryServices.emailDocuments(this.emailDocumentsFormGroup.value);
            emailDocumentsResponse.subscribe(
                (emailDocumentsResponseStatus) => {
                    if (emailDocumentsResponseStatus.error !== null
                        && emailDocumentsResponseStatus.error !== undefined
                        && emailDocumentsResponseStatus.error.length >= 1) {
                        this._logger.error('EmailDocuments()===>' + emailDocumentsResponseStatus.error);
                        this.loaderConfigService.setLoadingSub('no');
                    } else if (emailDocumentsResponseStatus.SUCCESS === 'TRUE') {
                        this.loaderConfigService.setLoadingSub('no');
                        this.documentViewModal = false;
                        this.emailDocumentsSuccessModal = true;
                        this.Ref.markForCheck();
                    }
                });
        }
    }
    closeEmailDocumentsSuccessModal() {
        this.emailDocumentsSuccessModal = false;
        this.changeRef.markForCheck();
        this.loaderConfigService.setLoadingSub('no');
    }

    doPolicyReiniEndorsement(inputData) {
        this.loaderConfigService.setLoadingSub('yes');
        this.loaderConfigService.setCustom('END', '');
        inputData.policyInfo.ncpEndtReasonCode = '08';
        let fgEndtReasonCode = this.utilsServices.getEndorsementFGCode(inputData.policyInfo.ncpEndtReasonCode);
        inputData.policyInfo.endtReasonCode = fgEndtReasonCode;
        inputData.policyInfo.endtReasonCodeDesc = 'Reinstate';
        let endtDefaultingResponse = this.enquiryServices.doEndorsementDefaultingInfo(inputData);
        endtDefaultingResponse.subscribe(
            (endorsementDefaultingInfo) => {
                if (endorsementDefaultingInfo.error !== null && endorsementDefaultingInfo.error !== undefined && endorsementDefaultingInfo.error.length >= 1) {
                    this._logger.error('doPolicyReiniEndorsement()===>' + endorsementDefaultingInfo.error);
                } else {
                    this.loaderConfigService.setCustom('NCPENDT', '08');
                    this._logger.log('endorsementDefaultingInfo', endorsementDefaultingInfo);
                    this.loaderConfigService.setCustom('END', endorsementDefaultingInfo);
                    let queryParams = { productCode: inputData.policyInfo.productCd, eventType: 'PEND', transactionType: 'PO' };
                    let routeUrl = this.utilsServices.getLOBRoute(inputData.policyInfo.productCd);
                    this.loaderConfigService.navigateRouterLink(routeUrl, queryParams);
                    window.scroll(10, 10);
                }
                this.loaderConfigService.setLoadingSub('no');
            },
            (error) => {
                this._logger.error(error);
            });
    }

    searchForShareReassingPermissions(object_row) {
        if (this.loaderConfigService.getCustom('roleId') !== 'CST') {
            this.tooltipHide = true;
            this.loader = true;
            this.changeRef.markForCheck();
            let permissionsSub = this.sharedService.enablePermissions(object_row);
            permissionsSub.subscribe(data=> {
                this.permissions = data;
                this.loader = false;
                this.tooltipHide = false;
                if(permissionsSub.observers.length > 0){
                    permissionsSub.observers.length = 0;
                }
                this.changeRef.markForCheck();
            });
        } else {
            this.loader = false;
			this.changeRef.markForCheck();
        }
    }

    closeModal() {
        this.shareWindow = false;
        this.changeRef.markForCheck();
        this.loaderConfigService.setLoadingSub('no');
    }

    refreshList() {
        this.loaderConfigService.resetfilterModel();
        this.enquiryServicesImp.getPolicyEnquiry(this.loaderConfigService.getfilterModel());
        this.enquiryServicesImp.policyPushedData.subscribe(data => {
            this.tableData = data;
            this.changeRef.markForCheck();
            this.loaderConfigService.setLoadingSub('no');
        });
        this.shareWindow = false;
        this.changeRef.markForCheck();
        this.loaderConfigService.setLoadingSub('no');
    }
}

