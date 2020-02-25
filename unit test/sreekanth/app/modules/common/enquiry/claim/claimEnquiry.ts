import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { OrderBy } from '../../../../core/ui-components/table-filter/pipes/orderBy';
import { SearchBy } from '../../../../core/ui-components/table-filter/pipes/searchBy';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { BreadCrumbService } from '../../breadCrumb/index';
import { EnquiryServices } from '../../enquiry/services/enquiry.services';
import { EnquiryServicesImp } from '../index';
import { EnquiryInfoModel } from '../models/enquiryInfo.model';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PickList } from '../../models/picklist.model';
import { ElementConstants } from '../../../transaction/constants/ncpElement.constants';
import { SharedService } from '../../../../core/shared/shared.service';
import { ShareReassignService } from '../../shareReassign/services/shareReassign.service';
import { Subject } from '@adapters/packageAdapter';

export class TableInfo {
    mapping: string;
    header: string;
    showColumn: boolean;
    className: string;
    fieldConfig:any;
}
@Component({
    selector: 'claim-enquiry',
    templateUrl: './claimEnquiry.html'
})
export class ClaimEnquiryComponent implements OnInit, OnChanges {
    public quotOpenHeldFormGroup: FormGroup;
    enquiryServices;
    router;
    claimEnquiryinfo;
    loadingSub;
    enquiryServicesImp;
    utilsServices;
    public copyQuotModal: boolean = false;
    public abandonClaimModal: boolean = false;
    public newClaimNo;
    public claimNo;
    timelineKey;
    currentTimelineObj;
    @Input() tableData: any[] = [];
    @Input() claimActivityHeader: any[];
    @Input() claimActivityMapping: any[];
    @Input() claimActivityIconsClassNames: any[];
    @Input() claimFieldConfiguration: any[] = [];
    @Input() isActionFlag: boolean = true;
    @Input() sortByDefault: any;
    @Input() searchId: string;
    @Input() searchFilterDetails: any;
    sort: any;
    changeRef;
    @Input() tableDetails: TableInfo[];
    columnsList: TableInfo[] = [];
    @Input() showSearch: string = 'Y';
    @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() modalID: string;
    tooltipPlacement = 'left';
    tooltipHide: boolean = false;
    showClaimFields: boolean = false;
    rotateFlag = '';
    eventData: Array<any> = [];
    eventKey: any = {};
    timelineModal: boolean = false;
    eventProdCd: any;
    existingTooltip: any = '';
    confirmAbandonClaimModal: boolean = false;
    inputPickList = new PickList();
    shareReassignInfo: FormGroup
    permissions;
shareWindow: boolean = false;
    sharedService;
    loader: boolean = true;
    userID: string;
    hideAbandonFlag : boolean = false;

    constructor(public _claimnquiryFB: FormBuilder, quotInfo: FormBuilder,shareReassignService:ShareReassignService, _loaderConfigService: ConfigService, public _logger: Logger, public _changeRef: ChangeDetectorRef, orderBy: OrderBy, searchBy: SearchBy, _router: Router, enquiryServices: EnquiryServices, _utilsServices: UtilsService, breadCrumbService: BreadCrumbService, enquiryServicesImp: EnquiryServicesImp,_sharedService: SharedService) {
        this.enquiryServices = enquiryServices;
        this.claimEnquiryinfo = new EnquiryInfoModel(_claimnquiryFB);
        this.changeRef = _changeRef;
        this.router = _router;
        this.loadingSub = _loaderConfigService;
        this.enquiryServicesImp = enquiryServicesImp;
        this.utilsServices = _utilsServices;
        this.sharedService = _sharedService
        this.userID = this.loadingSub.getCustom('user_id');
        this.shareReassignInfo = shareReassignService.getShareReassingInfoModel();
    }
    ngOnInit() {
        if (this.claimActivityMapping) {
            let tableLength = this.claimActivityMapping.length;
            for (let i = 0; i < tableLength; i++) {
                this.columnsList.push({ header: this.claimActivityHeader[i], mapping: this.claimActivityMapping[i], showColumn: true, className: this.claimActivityIconsClassNames[i],fieldConfig:this.claimFieldConfiguration[i] });
            }
        }
        this.tableDetails = this.columnsList;
        this.sort = {
            column: 'NAME',
            descending: false
        };
        this.hideAbandonFlag = this.loadingSub.get('hideAbandonOption');
    }

    ngOnChanges(changes?) {
        this.changeRef.markForCheck();
    }
    navigateRouterLink(routerUrl: any) {
        this.loadingSub.navigateRouterLink(routerUrl);
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
        this.quotOpenHeldFormGroup = this.claimEnquiryinfo.getClaimInfoModel();
        this.quotOpenHeldFormGroup.controls['claimInfo'].patchValue(object_row);
        this.quotOpenHeldFormGroup.controls['claimInfo'].updateValueAndValidity();

        if (doStatus === 'EC' || doStatus === 'VC') {
            this.getOpenHeldOrEnquiryData(this.quotOpenHeldFormGroup.value, doStatus);
        }
        if (doStatus === 'AC') {
            this.doClaimAbandon(this.quotOpenHeldFormGroup.value);
        } else if (doStatus === 'SH' || doStatus === 'RA') {
            this.shareReassignInfo.reset();
            this.shareReassignInfo.controls['txnId'].patchValue(object_row.claimNo)
            this.shareReassignInfo.controls['txnId'].updateValueAndValidity()
            this.shareReassignInfo.controls['txnType'].patchValue(ElementConstants.claimTxnType)
            this.shareReassignInfo.controls['txnType'].updateValueAndValidity()
            this.shareReassignInfo.controls['type'].patchValue(doStatus)
            this.shareReassignInfo.controls['type'].updateValueAndValidity()
            this.shareReassignInfo.controls['permissions'].patchValue(this.permissions)
            this.shareReassignInfo.controls['permissions'].updateValueAndValidity()
            this.shareWindow = true
            this.changeRef.markForCheck()
        }
    }


    getOpenHeldOrEnquiryData(dataInputValue, eventType) {
        let quotOutput = this.enquiryServices.getclaimOpenheldInfo(dataInputValue);
        quotOutput.subscribe(
            (claimnquiryInfodataVal) => {
                if (claimnquiryInfodataVal.error !== null
                    && claimnquiryInfodataVal.error !== undefined
                    && claimnquiryInfodataVal.error.length >= 1) {
                    this._logger.error('getQuotInfo()===>' + claimnquiryInfodataVal.error);
                } else {
                    this.loadingSub.setCustom('openHeld', claimnquiryInfodataVal);
                    this.quotOpenHeldFormGroup = this.claimEnquiryinfo.getClaimInfoModel();
                    this.showClaimFields = true;
                    let movementType = claimnquiryInfodataVal.claimInfo.movementType;
                    let routeUrl = this.utilsServices.getClaimRoute(eventType, movementType);
                    if (routeUrl) {
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

    doOpenCopyQuotInfo() {
        let copyClaimInputdata = this.loadingSub.getCustom('openHeld');
        let queryParams = { productCode: copyClaimInputdata.policyInfo.productCd, eventType: 'EQ', transactionType: 'QT' };
        let routeUrl = this.utilsServices.getLOBRoute(copyClaimInputdata.policyInfo.productCd);
        this.loadingSub.navigateRouterLink(routeUrl, queryParams);
    }

    openTimeline(claimObj) {
        this.loadingSub.setLoadingSub('yes');
        let eventId = claimObj['claimNo'];
        this.timelineKey = claimObj['claimNo'];
        this.currentTimelineObj = claimObj;
        var timelineResp = this.enquiryServices.getTimeLineDetails({ eventID: eventId });
        timelineResp.subscribe((data) => {
            if (data.error !== null
                && data.error !== undefined
                && data.error.length >= 1) {
                this._logger.error('getClaimTimeline()===>' + data.error);
            } else if (data['eventDetails'] instanceof Array && data['eventID']) {
                let temp = data['eventDetails'];
                this.eventKey['claimNo'] = data['eventID'];
                this.eventProdCd = data['productCd'];
                if (data['dependentEventID']) {
                    var eventJson = {
                        eventID: data['dependentEventID'],
                        "processType": "POL"
                    }
                    var policyTimelineResp = this.enquiryServices.getTimeLineDetails(eventJson);
                    policyTimelineResp.subscribe((data) => {
                        if (data) {
                            if (data.error !== null
                                && data.error !== undefined
                                && data.error.length >= 1) {
                                this._logger.error('getTimeLineDetails()===>' + data.error);
                            } else {
                                if (data['eventDetails'] instanceof Array && data['eventID']) {
                                    temp.push(...data['eventDetails']);
                                    this.eventKey['policyNo'] = data['eventID'];
                                    if (data['dependentEventID']) {
                                        var eventJson = {
                                            eventID: data['dependentEventID']
                                        };
                                        var quoteTimelineResp = this.enquiryServices.getTimeLineDetails(eventJson);
                                        quoteTimelineResp.subscribe((data) => {
                                            if (data.error !== null
                                                && data.error !== undefined
                                                && data.error.length >= 1) {
                                                this._logger.error('getTimeLineDetails()===>' + data.error);

                                            } else {
                                                temp.push(...data['eventDetails']);
                                                this.eventData = temp;
                                                this.eventKey['quoteNo'] = data['eventID'];
                                                this.timelineModal = true;

                                            }
                                        });
                                    } else {
                                        this.eventData = temp;
                                        this.timelineModal = true;
                                    }
                                }
                            }
                        } else {
                            this.eventData = temp;
                            this.timelineModal = true;
                        }
                    });
                } else {
                    this.eventData = temp;
                    this.timelineModal = true;
                }
            }
            this.loadingSub.setLoadingSub('no');
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
            this.doActionClickRow(this.currentTimelineObj, 'VC');
        }
    }

    doClaimAbandon(dataInputValue) {
        let claimOutput = this.enquiryServices.doClaimAbandon(dataInputValue);
        claimOutput.subscribe(
            (claimEnquiryInfodataVal) => {
                if (claimEnquiryInfodataVal.error !== null
                    && claimEnquiryInfodataVal.error !== undefined
                    && claimEnquiryInfodataVal.error.length >= 1) {
                    this._logger.error('doClaimAbandon()===>' + claimEnquiryInfodataVal.error);
                } else {
                    this.abandonClaimModal = true;
                    this.changeRef.markForCheck();
                    this.loadingSub.setLoadingSub('no');
                }
                this.loadingSub.setLoadingSub('no');
            },
            (error) => {
                this._logger.error(error);
                this.loadingSub.setLoadingSub('no');
            });

    }
    doCloseAbandonClaimModal() {
        this.abandonClaimModal = false;
        this.changeRef.markForCheck();
        this.loadingSub.setLoadingSub('no');
    }

    doClaimEnquiry() {
        let filterModel = this.loadingSub.getfilterModel();
        if (this.searchFilterDetails) {
            this.loadingSub.setfilterModel(this.searchFilterDetails)
            filterModel = this.loadingSub.getfilterModel();
        }
        if (!filterModel.status) {
            this.inputPickList.auxType = 'MiscInfo';
            this.inputPickList.auxSubType = 'STAT';
            this.inputPickList.param1 = 'CLM';
            let claimStatusResponse = this.loadingSub.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', this.inputPickList);
            claimStatusResponse.subscribe((claimStatusData) => {
                if (claimStatusData) {
                    let claimStatus = claimStatusData;
                    filterModel.status = claimStatus
                    this.enquiryServicesImp.getClaimEnquiry(filterModel);
                };
            });
        } else {
            this.enquiryServicesImp.getClaimEnquiry(filterModel);
        }
    }

    searchForShareReassingPermissions(object_row) {
        if (this.loadingSub.getCustom('roleId') !== 'CST') {
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
        this.loadingSub.setLoadingSub('no');
    }

    refreshList() {
        this.loadingSub.resetfilterModel();
        this.enquiryServicesImp.getClaimEnquiry(this.loadingSub.getfilterModel());
        this.enquiryServicesImp.policyPushedData.subscribe(data => {
            this.tableData = data;
            this.changeRef.markForCheck();
            this.loadingSub.setLoadingSub('no');
        });
        this.shareWindow = false;
        this.changeRef.markForCheck();
        this.loadingSub.setLoadingSub('no');
    }
}