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

export class TableInfo {
    mapping: string;
    header: string;
    showColumn: boolean;
    className: string;
    fieldConfig:any;
}
@Component({
    selector: 'proposal-enquiry',
    templateUrl: './proposal.html'
})
export class ProposalEnquiryComponent implements OnInit, OnChanges {
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
    @Input() proposalActivityHeader: any[];
    @Input() proposalActivityMapping: any[];
    @Input() proposalActivityIconsClassNames: any[];
    @Input() proposalFieldConfiguration: any[];
    @Input() isActionFlag: boolean = true;
    @Input() sortByDefault: any;
    @Input() searchId: string;
    sort: any;
    changeRef;
    @Input() tableDetails: TableInfo[];
    columnsList: TableInfo[] = [];
    @Input() showSearch: string = 'Y';
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
    constructor(public _quotEnquiryFB: FormBuilder, quotInfo: FormBuilder, _loaderConfigService: ConfigService, public _logger: Logger, public _changeRef: ChangeDetectorRef, orderBy: OrderBy, searchBy: SearchBy, _router: Router, enquiryServices: EnquiryServices, _utilsServices: UtilsService, breadCrumbService: BreadCrumbService, enquiryServicesImp: EnquiryServicesImp, shared: SharedService) {
        this.enquiryServices = enquiryServices;
        this.quotEnquiryinfo = new EnquiryInfoModel(_quotEnquiryFB);
        this.changeRef = _changeRef;
        this.router = _router;
        this.loadingSub = _loaderConfigService;
        this.enquiryServicesImp = enquiryServicesImp;
        this.utilsServices = _utilsServices;

    }
    ngOnInit() {
        if (this.proposalActivityMapping) {
            let tableLength = this.proposalActivityMapping.length;
            for (let i = 0; i < tableLength; i++) {
                this.columnsList.push({ header: this.proposalActivityHeader[i], mapping: this.proposalActivityMapping[i], showColumn: true, className: this.proposalActivityIconsClassNames[i],fieldConfig:this.proposalFieldConfiguration[i] });
            }
        }
        this.tableDetails = this.columnsList;
        this.sort = {
            column: 'NAME',
            descending: false
        };
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

        if (doStatus === 'EQ' || doStatus === 'VQ') {
            this.getOpenHeldOrEnquiryData(this.quotOpenHeldFormGroup.value, doStatus);
        } else if (doStatus === 'CQ') {
            this.quoteNo = object_row.quoteNo;
            this.getCopyQuotData(this.quotOpenHeldFormGroup.value);
        } else if (doStatus === 'AQ') {
            this.doQuotAbandon(this.quotOpenHeldFormGroup.value);
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
                } else {
                    this.loadingSub.setCustom('openHeld', quotEnquiryInfodataVal);
                    this.newQuoteNo = quotEnquiryInfodataVal.policyInfo.quoteNo;
                    this.enquiryServicesImp.getQuoteEnquiry(this.loadingSub.getfilterModel());
                    this.enquiryServicesImp.quotePushedData.subscribe(
                        data => {
                            if (quotEnquiryInfodataVal) {
                                this.tableData = data;
                                this.abandonQuotModal = false;
                                this.copyQuotModal = true;
                                this.changeRef.markForCheck();
                            }
                            quotEnquiryInfodataVal = '';
                            this.loadingSub.setLoadingSub('no');
                        }
                    );
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
                } else {
                    this.enquiryServicesImp.getQuoteEnquiry(this.loadingSub.getfilterModel());
                    this.enquiryServicesImp.quotePushedData.subscribe(
                        data => {
                            if (quotEnquiryInfodataVal) {
                                this.tableData = data;
                                this.copyQuotModal = false;
                                this.abandonQuotModal = true;
                                this.changeRef.markForCheck();
                            }
                            quotEnquiryInfodataVal = '';
                            this.loadingSub.setLoadingSub('no');
                        }
                    );
                }
                this.loadingSub.setLoadingSub('no');
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
}

