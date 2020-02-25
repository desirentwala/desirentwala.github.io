import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ConfigService } from '../../../../core/services/config.service';
import { SharedService } from '../../../../core/shared/shared.service';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { OrderBy } from '../../../../core/ui-components/table-filter/pipes/orderBy';
import { SearchBy } from '../../../../core/ui-components/table-filter/pipes/searchBy';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { BreadCrumbService } from '../../breadCrumb/index';
import { EnquiryServices } from '../../enquiry/services/enquiry.services';
import { EnquiryServicesImp } from '../index';
import { EnquiryInfoModel } from '../models/enquiryInfo.model';
import { PickList } from '../../models/picklist.model';
import { ElementConstants } from '../../../transaction/constants/ncpElement.constants';
import { ShareReassignService } from '../../shareReassign/services/shareReassign.service';
import { Subject } from '@adapters/packageAdapter';

export class TableInfo {
    mapping: string;
    header: string;
    showColumn: boolean;
    className: string;
    fieldConfig: any;
}
@Component({
    selector: 'quote-enquiry',
    templateUrl: './quoteEnquiry.html'
})
export class QuoteEnquiryComponent implements OnInit, OnChanges {
    public quotOpenHeldFormGroup: FormGroup;
    enquiryServices;
    router;
    quotEnquiryinfo;
    loadingSub;
    enquiryServicesImp;
    utilsServices;
    public copyQuotModal: boolean = false;
    public abandonQuotModal: boolean = false;
    public newQuoteNo;
    public quoteNo;
    @Input() tableData: any[] = [];
    @Input() quoteActivityHeader: any[];
    @Input() quoteActivityMapping: any[];
    @Input() quoteActivityIconsClassNames: any[];
    @Input() quoteFieldConfiguration: any[];
    @Input() isActionFlag: boolean = true;
    @Input() sortByDefault: any;
    @Input() searchId: string;
    sort: any;
    changeRef;
    @Input() tableDetails: TableInfo[];
    columnsList: TableInfo[] = [];
    @Input() showSearch: string = 'Y';
    // Used for getting search filters value from Activity component
    @Input() searchFilterDetails: any;
    @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() modalID: string;
    tooltipPlacement = 'left';
    tooltipHide: boolean = false;
    rotateFlag = '';
    timelineModal: boolean = false;
    timelineKey: any;
    eventData: any;
    eventKey: any = {};
    eventProdCd: any = '';
    currentTimeLineObj: any;
    existingTooltip: any = '';
    confirmAbandonQuotModal: boolean = false;
    inputPickList = new PickList();
    shareReassignInfo: FormGroup
    permissions;
    shareWindow: boolean = false;
    sharedService;
    loader: boolean = true;
    userID: string;
    hideAbandonFlag: boolean = false;

    constructor(public _quotEnquiryFB: FormBuilder, quotInfo: FormBuilder, _loaderConfigService: ConfigService, public _logger: Logger, public _changeRef: ChangeDetectorRef, orderBy: OrderBy, shareReassignService: ShareReassignService, searchBy: SearchBy, _router: Router, enquiryServices: EnquiryServices, _utilsServices: UtilsService, breadCrumbService: BreadCrumbService, enquiryServicesImp: EnquiryServicesImp, shared: SharedService, public logger: Logger, _sharedService: SharedService,
    ) {
        this.enquiryServices = enquiryServices;
        this.quotEnquiryinfo = new EnquiryInfoModel(_quotEnquiryFB);
        this.changeRef = _changeRef;
        this.router = _router;
        this.loadingSub = _loaderConfigService;
        this.enquiryServicesImp = enquiryServicesImp;
        this.utilsServices = _utilsServices;
        this.sharedService = _sharedService;
        this.userID = this.loadingSub.getCustom('user_id');
        this.shareReassignInfo = shareReassignService.getShareReassingInfoModel();
    }
    ngOnInit() {
        if (this.quoteActivityMapping) {
            let tableLength = this.quoteActivityMapping.length;
            for (let i = 0; i < tableLength; i++) {
                this.columnsList.push({ header: this.quoteActivityHeader[i], mapping: this.quoteActivityMapping[i], showColumn: true, className: this.quoteActivityIconsClassNames[i], fieldConfig: this.quoteFieldConfiguration[i] });
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
        this.quotOpenHeldFormGroup = this.quotEnquiryinfo.getQuotorPolicyInfoModel();
        this.quotOpenHeldFormGroup.controls['policyInfo'].patchValue(object_row);
        this.quotOpenHeldFormGroup.controls['policyInfo'].updateValueAndValidity();
        this.quotOpenHeldFormGroup.controls['policyInfo'].get('userId').setValue(object_row.b2bUserId);

        if (doStatus === 'EQ' || doStatus === 'VQ') {
            this.getOpenHeldOrEnquiryData(this.quotOpenHeldFormGroup.value, doStatus);
        } else if (doStatus === 'CQ') {
            this.quoteNo = object_row.quoteNo;
            this.getCopyQuotData(this.quotOpenHeldFormGroup.value);
        } else if (doStatus === 'AQ') {
            this.quoteNo = object_row.quoteNo;
            this.confirmAbandonQuotModal = true;
            this.changeRef.markForCheck();
        } else if (doStatus === 'SH' || doStatus === 'RA') {
            this.shareReassignInfo.reset();
            this.shareReassignInfo.controls['txnId'].patchValue(object_row.quoteNo)
            this.shareReassignInfo.controls['txnVerNo'].patchValue(object_row.quoteVerNo)
            this.shareReassignInfo.controls['txnId'].updateValueAndValidity()
            this.shareReassignInfo.controls['txnType'].patchValue(ElementConstants.quoteTxnType)
            this.shareReassignInfo.controls['txnType'].updateValueAndValidity()
            this.shareReassignInfo.controls['type'].patchValue(doStatus)
            this.shareReassignInfo.controls['type'].updateValueAndValidity()
            this.shareReassignInfo.controls['permissions'].patchValue(this.permissions)
            this.shareReassignInfo.controls['permissions'].updateValueAndValidity()
            this.shareWindow = true
            this.changeRef.markForCheck()
        }
        window.scroll(0, 0);
    }

    getOpenHeldOrEnquiryData(dataInputValue, eventType) {
        let quotOutput = this.enquiryServices.getQuotOpenheldInfo(dataInputValue);
        quotOutput.subscribe(
            (quotEnquiryInfodataVal) => {
                if (quotEnquiryInfodataVal.error !== null
                    && quotEnquiryInfodataVal.error !== undefined
                    && quotEnquiryInfodataVal.error.length >= 1) {
                    this._logger.error('getQuotInfo()===>' + quotEnquiryInfodataVal.error);
                } else {
                    this.loadingSub.setCustom('openHeld', quotEnquiryInfodataVal);
                    let routeUrl = this.utilsServices.getLOBRoute(quotEnquiryInfodataVal.policyInfo.productCd);
                    let queryParams = { productCode: quotEnquiryInfodataVal.policyInfo.productCd, eventType: eventType, transactionType: 'QT' };
                    if (routeUrl) {
                        this.loadingSub.navigateRouterLink(routeUrl, queryParams);
                    } else {
                        this.utilsServices.loadedSub.subscribe(() => {
                            routeUrl = this.utilsServices.getLOBRoute(quotEnquiryInfodataVal.policyInfo.productCd);
                            if (routeUrl) this.loadingSub.navigateRouterLink(routeUrl, queryParams);
                        });
                    }
                    this.loadingSub.setLoadingSub('no');
                }
            },
            (error) => {
                this._logger.error(error);
                this.loadingSub.setLoadingSub('no');
            });

    }
    getCopyQuotData(dataInputValue) {
        let quotOutput = this.enquiryServices.doQuoteCopyInfo(dataInputValue);
        quotOutput.subscribe(
            (quotEnquiryInfodataVal) => {
                if (quotEnquiryInfodataVal.error !== null
                    && quotEnquiryInfodataVal.error !== undefined
                    && quotEnquiryInfodataVal.error.length >= 1) {
                    this._logger.error('getQuotInfo()===>' + quotEnquiryInfodataVal.error);
                    this.loadingSub.setLoadingSub('no');
                } else {
                    this.loadingSub.setCustom('openHeld', quotEnquiryInfodataVal);
                    this.newQuoteNo = quotEnquiryInfodataVal.policyInfo.quoteNo;
                    this.copyQuotModal = true;
                    this.changeRef.markForCheck();
                }
                this.loadingSub.setLoadingSub('no');
            },
            (error) => {
                this._logger.error(error);
                this.loadingSub.setLoadingSub('no');
            });
    }
    doOpenCopyQuotInfo() {
        let copyQuoteInputdata = this.loadingSub.getCustom('openHeld');
        let queryParams = { productCode: copyQuoteInputdata.policyInfo.productCd, eventType: 'EQ', transactionType: 'QT' };
        let routeUrl = this.utilsServices.getLOBRoute(copyQuoteInputdata.policyInfo.productCd);
        this.loadingSub.navigateRouterLink(routeUrl, queryParams);
    }
    doQuotAbandon(dataInputValue) {
        let quotOutput = this.enquiryServices.doQuotAbandonInfo(dataInputValue);
        quotOutput.subscribe(
            (quotEnquiryInfodataVal) => {
                if (quotEnquiryInfodataVal.error !== null
                    && quotEnquiryInfodataVal.error !== undefined
                    && quotEnquiryInfodataVal.error.length >= 1) {
                    this._logger.error('getQuotInfo()===>' + quotEnquiryInfodataVal.error);
                    this.loadingSub.setLoadingSub('no');
                } else {
                    this.copyQuotModal = false;
                    this.abandonQuotModal = true;
                    this.changeRef.markForCheck();
                    this.loadingSub.setLoadingSub('no');
                }
            },
            (error) => {
                this._logger.error(error);
                this.loadingSub.setLoadingSub('no');
            });

    }
    doCloseAbandonQuotModal() {
        this.abandonQuotModal = false;
        this.changeRef.markForCheck();
        this.loadingSub.setLoadingSub('no');
    }
    doCloseCopyQuotModal() {
        this.copyQuotModal = false;
        this.changeRef.markForCheck();
        this.loadingSub.setLoadingSub('no');
        this.doQuotEnquiry();
    }

    openTimeline(quoteObj) {
        this.currentTimeLineObj = quoteObj;
        this.timelineKey = quoteObj['quoteNo'];
        this.eventKey['quoteNo'] = quoteObj['quoteNo'];
        let eventId = quoteObj['quoteNo'] + '-' + quoteObj['quoteVerNo'];
        var timelineResp = this.enquiryServices.getTimeLineDetails({ eventID: eventId });
        timelineResp.subscribe((data) => {
            if (data.error !== null
                && data.error !== undefined
                && data.error.length >= 1) {
                this._logger.error('getTimeLineDetails()===>' + data.error);
            } else {
                if (data['eventDetails'] instanceof Array && data['eventID']) {
                    this.eventData = data['eventDetails'];
                    this.eventProdCd = data['productCd'];
                    this.timelineModal = true;
                    this.loadingSub.setLoadingSub('no');
                }
            }
        });
    }

    doCloseTimelineModal() {
        this.timelineKey = '';
        this.eventData = [];
        this.eventKey = {};
        this.eventProdCd = '';
        this.currentTimeLineObj = {};
        this.timelineModal = false;
    }

    doView() {
        if (this.currentTimeLineObj) {
            this.doActionClickRow(this.currentTimeLineObj, 'VQ');
        }
    }

    doQuotEnquiry() {
        let filterModel = this.loadingSub.getfilterModel();
        if (this.searchFilterDetails) {
            this.loadingSub.setfilterModel(this.searchFilterDetails)
            filterModel = this.loadingSub.getfilterModel();
        }
        if (!filterModel.status) {
            this.inputPickList.auxType = 'MiscInfo';
            this.inputPickList.auxSubType = 'STAT';
            this.inputPickList.param1 = 'QOT';
            let quoteStatusResponse = this.loadingSub.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', this.inputPickList);
            quoteStatusResponse.subscribe((quoteStatusData) => {
                if (quoteStatusData) {
                    let quoteStatus = quoteStatusData;
                    filterModel.status = quoteStatus
                    this.enquiryServicesImp.getQuoteEnquiry(filterModel);
                    this.enquiryServicesImp.quotePushedData.subscribe(
                        (data) => {
                            this.tableData = data;
                            this.loadingSub.setLoadingSub('no');
                        }, (error) => {
                            this._logger.error(error);
                            this.loadingSub.setLoadingSub('no');
                        }
                    );
                };
            });
        } else {
            this.enquiryServicesImp.getQuoteEnquiry(filterModel);
            this.enquiryServicesImp.quotePushedData.subscribe(
                (data) => {
                    this.tableData = data;
                    this.loadingSub.setLoadingSub('no');
                }, (error) => {
                    this._logger.error(error);
                    this.loadingSub.setLoadingSub('no');
                }
            );
        }
    }

    searchForShareReassingPermissions(object_row) {
        if (this.loadingSub.getCustom('roleId') !== 'CST') {
            this.tooltipHide = true;
            this.loader = true;
            this.changeRef.markForCheck();
            let permissionsSub = this.sharedService.enablePermissions(object_row);
            permissionsSub.subscribe(data => {
                this.permissions = data;
                this.loader = false;
                this.tooltipHide = false;
                if (permissionsSub.observers.length > 0) {
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
        this.enquiryServicesImp.getQuoteEnquiry(this.loadingSub.getfilterModel());
        this.enquiryServicesImp.quotePushedData.subscribe(data => {
            this.tableData = data;
            this.changeRef.markForCheck();
            this.loadingSub.setLoadingSub('no');
        });
        this.shareWindow = false;
        this.changeRef.markForCheck();
        this.loadingSub.setLoadingSub('no');
    }
}

