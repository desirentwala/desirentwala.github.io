import { AfterContentInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';

import { environment } from '../../../environments/environment';
import { ConfigService } from '../../core/services/config.service';
import { Logger } from '../../core/ui-components/logger/logger';
import { DateDuration, DateFormatService } from '../../core/ui-components/ncp-date-picker';
import { UtilsService } from '../../core/ui-components/utils/utils.service';
import { BreadCrumbService } from '../common';
import { EnquiryInfoModel } from '../common/enquiry/models/enquiryInfo.model';
import { EnquiryServices } from '../common/enquiry/services/enquiry.services';
import { EnquiryServicesImp } from '../common/enquiry/services/enquiry.servicesImpl';
import { PickList } from '../common/models/picklist.model';
import { ElementConstants } from '../transaction/constants/ncpElement.constants';


export class TableInfo {
  mapping: string;
  header: string;
  showColumn: boolean;
  className: string;
}
@Component({
  selector: 'activity',
  templateUrl: './activity.component.html',
})
export class ActivityComponent implements OnInit, AfterContentInit, OnDestroy {
  isShowTableFlag: boolean;
  filterModel;
  customerQuotInfoHeaderMultiCheckArray: FormGroup;
  customerPolicyInfoHeaderMultiCheckArray: FormGroup;
  customerClaimInfoHeaderMultiCheckArray: FormGroup;
  customerRenewalInfoHeaderMultiCheckArray: FormGroup;
  searchlDetailsFormGroup: FormGroup;
  enquiryServices: EnquiryServices;
  enquiryServicesImp: EnquiryServicesImp;
  enquiryinfoModel: EnquiryInfoModel;
  quoteEnquiryInput;
  policyEnquiryInput;
  claimEnquiryInput;
  renewalActivityList;
  proposalEnquiryList;
  Ref;
  logger: Logger;
  utils: UtilsService;
  quotTableDetails: TableInfo[] = [];
  policyTableDetails: TableInfo[] = [];
  claimTableDetails: TableInfo[] = [];
  renewalTableDetails: TableInfo[] = [];
  public translated: boolean = false;
  sort: any;
  errors = [];
  placeHolder: string = 'NCPBtn.search';
  hideFilterModal: boolean = true;
  @ViewChild("customerEditView") customerEditView;
  errmsg: Boolean = false;
  @Input() quoteActivityHeader = ['NCPLabel.quoteNo', 'NCPLabel.prospect', 'NCPLabel.product', 'NCPLabel.quoteDate', 'NCPLabel.status', 'NCPLabel.issuedBy'];
  @Input() quoteActivityMapping = ['quoteNo', 'clientFullName', 'productDesc', 'issueDate', 'statusDesc', 'userName'];
  @Input() quoteActivityIconsClassNames = ['', '', '', '', 'fa fa-gear showPopover indexre'];
  @Input() quoteFieldConfiguration=[{"showTimelineOnClick":true},'','','','']
  _quoteActivityHeader = [];
  _quoteActivityMapping = [];
  _quoteActivityIconsClassNames = [];
  @Input() policyActivityHeader = ['NCPLabel.policyNo', 'NCPLabel.policyholderName', 'NCPLabel.product', 'NCPLabel.endtReason','NCPLabel.effectiveDate', 'NCPLabel.inceptionDate', 'NCPLabel.enddate', 'NCPLabel.status', 'NCPLabel.issuedBy'];
  @Input() policyActivityMapping = ['reference', 'clientFullName', 'productDesc', 'endtReasonCodeDesc','effectiveDate', 'inceptionDate', 'expiryDate', 'statusDesc', 'userName'];
  @Input() policyActivityIconsClassNames = ['', '', '', '', '', 'fa fa-gear showPopover indexre'];
  @Input() policyFieldConfiguration=[{"showTimelineOnClick":true},'','','','']
  _policyActivityHeader = [];
  _policyActivityMapping = [];
  _policyActivityIconsClassNames = [];
  @Input() claimActivityHeader = ['NCPLabel.ClaimNo', 'NCPLabel.claimantName', 'NCPLabel.policyNo', 'NCPLabel.product', 'NCPLabel.lossDateFrom', 'NCPLabel.noticeDateFrom', 'NCPLabel.status', 'NCPLabel.issuedBy'];
  @Input() claimActivityMapping = ['claimNo', 'clientFullName', 'policyNo', 'productDesc', 'lossDate', 'noticeDate', 'statusDesc', 'userName'];
  @Input() claimActivityIconsClassNames = ['', '', '', '', '', '', 'fa fa-gear showPopover indexre'];
  @Input() claimFieldConfiguration=[{"showTimelineOnClick":true},'','','',''];
  _claimActivityHeader = [];
  _claimActivityMapping = [];
  _claimActivityIconsClassNames = [];

  @Input() renewalActivityHeader = ['NCPLabel.policyNo', 'NCPLabel.customer', 'NCPLabel.product', 'NCPLabel.expiryDate', 'NCPLabel.Premium', 'NCPLabel.status'];
  @Input() renewalActivityMapping = ['policyNo', 'clientName', 'productDesc', 'expiryDate', 'premium', 'statusDesc'];
  @Input() renewalActivityIconsClassNames = ['', '', '', '', 'fa fa-gear showPopover indexre', ''];
  @Input() renewalFieldConfiguration=[{"keyField":true},'','','',{ 'pipeTransformRequired': true, 'type': 'amount'}];

  @Input() proposalActivityHeader = ['NCPLabel.proposalNo', 'NCPLabel.prospect', 'NCPLabel.product', 'NCPLabel.quoteDate', 'NCPLabel.status', 'NCPLabel.issuedBy'];
  @Input() proposalActivityMapping = ['quoteNo', 'clientFullName', 'productDesc', 'issueDate', 'statusDesc', 'issuedBy'];
  @Input() proposalActivityIconsClassNames = ['', '', '', '', 'fa fa-gear showPopover indexre'];
  @Input() proposalFieldConfiguration=[{"showTimelineOnClick":true},'','','','']
  _renewalActivityHeader = [];
  _renewalActivityMapping = [];
  _renewalActivityIconsClassNames = [];

  searchId: string;
  quotInfoHeaderMultiCheckArray = [];
  policyInfoHeaderMultiCheckArray = [];
  claimInfoHeaderMultiCheckArray = [];
  renewalInfoHeaderMultiCheckArray = [];
  renewalDataListForSearch = [];
  renewalPoliciesStartIndex: number = 0;
  renewalPoliciesMaxRecords: number = 5;
  renewalPoliciesExpiringInDays: number = 365;
  renewalFilterJSON: any = {};
  enquiryType = 'QT';
  noProposalEnquiryInputFlag = false;
  noPolicyEnquiryInputFlag = false;
  noQuotEnquiryInputFlag = false;
  noClaimEnquiryInputFlag = false;
  noRenewalEnquiryInputFlag = false;
  public checkQuoteEnquiry: boolean = false;
  public checkProposalEnquiry: boolean = false;
  public checkPolicyEnquiry: boolean = false;
  public checkClaimEnquiry: boolean = false;
  public checkRenewalEnquiry: boolean = false;
  patchedQuotMaxRecordsValue;
  patchedPolicyMaxRecordsValue;
  patchedClaimMaxRecordsValue;
  patchedRenewalMaxRecordsValue;
  viewMoreClicked = false;
  pageWidth = window.innerWidth;
  NCPDatePickerNormalOptions = {
    todayBtnTxt: 'Today',
    alignSelectorRight: true,
    indicateInvalidDate: true,
    showDateFormatPlaceholder: true,

  };
  NCPDatePickerToDateOptions = {
    todayBtnTxt: 'Today',
    alignSelectorRight: true,
    indicateInvalidDate: true,
    showDateFormatPlaceholder: true,
    disabledUntil: {}
  };
  public setNCPDatePickerToDateOptions() {
    if (this.searchlDetailsFormGroup.get('inceptionDate').value) {
      if (this.searchlDetailsFormGroup.get('expiryDate').value) {
        let activityFromDate = this.searchlDetailsFormGroup.get('inceptionDate').value;
        let activityToDate = this.searchlDetailsFormGroup.get('expiryDate').value;
        if (activityToDate < activityFromDate) {
          this.searchlDetailsFormGroup.get('expiryDate').patchValue(activityFromDate);
          return (this.searchlDetailsFormGroup.get('expiryDate').value);
        }
        else {
          return (this.searchlDetailsFormGroup.get('expiryDate').value);
        }
      }
    }
  }
  public todayString: string;
  dateDelimiter: string;
  dateFormat: string;
  dateDelimiterIndex: number[];
  todayDate: Date;
  dateFormatService;
  dateDuration;
  filtersub;
  setThroughFilter: boolean = false;
  subordinateUserIDList: any[] = [];
  lifeLOBFlag: boolean = false;
  quoteStatus: any[];
  proposalStatus: any[];
  inputPickList = new PickList();
  userID: string;
  roleId: string;
  constructor(_quotEnquiryFormGroup: FormBuilder, public config: ConfigService, _enquiryServicesImp: EnquiryServicesImp,
    enquiryServices: EnquiryServices, _logger: Logger, public changeRef: ChangeDetectorRef,
    _dateFormatService: DateFormatService, _dateduration: DateDuration,
    public breadcrumbService: BreadCrumbService, _utils: UtilsService, public translate: TranslateService) {
    this.utils = _utils;
    this.Ref = changeRef;


    this._quoteActivityHeader.push(...this.quoteActivityHeader);
    this._quoteActivityMapping.push(...this.quoteActivityMapping);
    this._quoteActivityIconsClassNames.push(...this.quoteActivityIconsClassNames);
    
    this._policyActivityHeader.push(...this.policyActivityHeader);
    this._policyActivityMapping.push(...this.policyActivityMapping);
    this._policyActivityIconsClassNames.push(...this.policyActivityIconsClassNames);


    this._claimActivityHeader.push(...this.claimActivityHeader);
    this._claimActivityMapping.push(...this.claimActivityMapping);
    this._claimActivityIconsClassNames.push(...this.claimActivityIconsClassNames);

    this._renewalActivityHeader.push(...this.renewalActivityHeader);
    this._renewalActivityMapping.push(...this.renewalActivityMapping);
    this._renewalActivityIconsClassNames.push(...this.renewalActivityIconsClassNames);

    // this.quoteActivityHeader.map(key => this.utils.getTranslated(key));
    // this.policyActivityHeader.map(key => this.utils.getTranslated(key));
    // this.claimActivityHeader.map(key => this.utils.getTranslated(key));
    this.breadcrumbService.addRouteName('/ncp/activity', [{ 'name': 'NCPLabel.activity' }]);
    this.filterModel = this.config.getfilterModel();
    this.logger = _logger;

    this.enquiryinfoModel = new EnquiryInfoModel(_quotEnquiryFormGroup);
    this.enquiryServices = enquiryServices;
    this.enquiryServicesImp = _enquiryServicesImp;
    this.dateFormatService = _dateFormatService;
    this.dateDuration = _dateduration;
    this.lifeLOBFlag = this.config.get('lifeLOBFlag');
  }

  ngOnInit() {
    this.config.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.config.currentLangName);
        this.placeHolder = this.utils.getTranslated(this.placeHolder);
        this.translated = true;

      }
    });
    let project = environment.project;
    if (project == 'aw') {
      this.hideFilterModal = false;
    }
    this.customerQuotInfoHeaderMultiCheckArray = this.enquiryinfoModel.getQuotInfoHeader();
    this.customerPolicyInfoHeaderMultiCheckArray = this.enquiryinfoModel.getPolicyInfoHeader();
    this.customerClaimInfoHeaderMultiCheckArray = this.enquiryinfoModel.getClaimInfoHeader();
    this.customerRenewalInfoHeaderMultiCheckArray = this.enquiryinfoModel.getRenewalInfoHeader();
    this.searchlDetailsFormGroup = this.enquiryinfoModel.getEnquiryInfoModel();
    // + Changes to implement SearchByDate
    this.dateDelimiter = this.config.get('dateDelimiter');
    this.dateFormat = this.config.get('dateFormat');
    this.dateDelimiterIndex;
    this.todayDate = new Date();
    this.todayDate.setHours(0, 0, 0, 0);
    this.todayString = this.dateFormatService.formatDate(this.todayDate);
    this.showTabContent(null, true);
    this.searchlDetailsFormGroup.get('inceptionDate').valueChanges.subscribe(() => {
      this.setNCPDatePickerToDateOptions();
    });
    this.searchlDetailsFormGroup.get('expiryDate').valueChanges.subscribe(() => {
      this.setNCPDatePickerToDateOptions();
    });
    this.config.setCustom('customerQuotInfoHeaderMultiCheckArray', this.customerQuotInfoHeaderMultiCheckArray.value);
    this.config.setCustom('customerPolicyInfoHeaderMultiCheckArray', this.customerPolicyInfoHeaderMultiCheckArray.value);
    this.config.setCustom('customerClaimInfoHeaderMultiCheckArray', this.customerClaimInfoHeaderMultiCheckArray.value);
    this.config.setCustom('customerRenewalInfoHeaderMultiCheckArray', this.customerRenewalInfoHeaderMultiCheckArray.value);
    this.userID = this.config.getCustom('user_id');
	let roleParam = this.config.get('roleParam');
    if(roleParam ){
     let role = this.config.getCustom('roleId');
     if(role==='EMP'){
      this.roleId='AGT'
     }else if(role==='AGT'){
      this.roleId='OPR'
     }
    }
  }


  ngAfterContentInit() {

    this.filtersub = this.config.loggerSub.subscribe((data) => {
      if (data === 'filterSet') {
        this.filterModel = this.config.getfilterModel();
        this.setThroughFilter = true;
        this.getInfo(this.filterModel);
      }
    });
    if (!this.setThroughFilter) {
      this.getInfo(this.filterModel);
    }
    this.quotInfoHeaderMultiCheckArray = [
      { value: 'RF', label: 'NCPLabel.quoteNo', elementControl: this.customerQuotInfoHeaderMultiCheckArray.controls['quoteNo'] },
      { value: 'CS', label: 'NCPLabel.prospect', elementControl: this.customerQuotInfoHeaderMultiCheckArray.controls['clientFullName'], disabledFlag: true },
      { value: 'PR', label: 'NCPLabel.product', elementControl: this.customerQuotInfoHeaderMultiCheckArray.controls['productDesc'] },
      { value: 'DT', label: 'NCPLabel.quoteDate', elementControl: this.customerQuotInfoHeaderMultiCheckArray.controls['issueDate'] },
      { value: 'ST', label: 'NCPLabel.status', elementControl: this.customerQuotInfoHeaderMultiCheckArray.controls['statusDesc'] },
      { value: 'IB', label: 'NCPLabel.issuedBy', elementControl: this.customerQuotInfoHeaderMultiCheckArray.controls['issuedBy'] }
    ];
    this.policyInfoHeaderMultiCheckArray = [
      { value: 'RF', label: 'NCPLabel.policyNo', elementControl: this.customerPolicyInfoHeaderMultiCheckArray.controls['policyNo'] },
      { value: 'CS', label: 'NCPLabel.policyholderName', elementControl: this.customerPolicyInfoHeaderMultiCheckArray.controls['clientFullName'], disabledFlag: true },
      { value: 'ER', label: 'NCPLabel.endtReason', elementControl: this.customerPolicyInfoHeaderMultiCheckArray.controls['endtReasonCodeDesc'] },
      { value: 'PR', label: 'NCPLabel.product', elementControl: this.customerPolicyInfoHeaderMultiCheckArray.controls['productDesc'], hasAdjField: true, adjFieldIndexes: [6] },
      { value: 'DT', label: 'NCPLabel.inceptionDate', elementControl: this.customerPolicyInfoHeaderMultiCheckArray.controls['issueDate'] },
      { value: 'ET', label: 'NCPLabel.enddate', elementControl: this.customerPolicyInfoHeaderMultiCheckArray.controls['expiryDate'] },
      { value: 'PS', label: 'NCPLabel.apPlanSelected', elementControl: this.customerPolicyInfoHeaderMultiCheckArray.controls['planTypeDesc'], isAdjField: true },
      { value: 'ST', label: 'NCPLabel.status', elementControl: this.customerPolicyInfoHeaderMultiCheckArray.controls['statusDesc'] },
      { value: 'IB', label: 'NCPLabel.issuedBy', elementControl: this.customerPolicyInfoHeaderMultiCheckArray.controls['issuedBy'] }
    ];
    this.claimInfoHeaderMultiCheckArray = [
      { value: 'RF', label: 'NCPLabel.ClaimNo', elementControl: this.customerClaimInfoHeaderMultiCheckArray.controls['claimNo'] },
      { value: 'CS', label: 'NCPLabel.claimantName', elementControl: this.customerClaimInfoHeaderMultiCheckArray.controls['clientFullName'], disabledFlag: true },
      { value: 'PN', label: 'NCPLabel.policyNo', elementControl: this.customerClaimInfoHeaderMultiCheckArray.controls['policyNo'] },
      { value: 'PR', label: 'NCPLabel.product', elementControl: this.customerClaimInfoHeaderMultiCheckArray.controls['productDesc'] },
      { value: 'DT', label: 'NCPLabel.lossDateFrom', elementControl: this.customerClaimInfoHeaderMultiCheckArray.controls['lossDateFrom'] },
      { value: 'ST', label: 'NCPLabel.noticeDateFrom', elementControl: this.customerClaimInfoHeaderMultiCheckArray.controls['noticeDateFrom'] },
      { value: 'ST', label: 'NCPLabel.status', elementControl: this.customerClaimInfoHeaderMultiCheckArray.controls['statusDesc'] },
      { value: 'IB', label: 'NCPLabel.issuedBy', elementControl: this.customerClaimInfoHeaderMultiCheckArray.controls['issuedBy'] }
    ];
    this.renewalInfoHeaderMultiCheckArray = [
      { value: 'PN', label: 'NCPLabel.policyNo', elementControl: this.customerRenewalInfoHeaderMultiCheckArray.controls['policyNo'], disabledFlag: true },
      { value: 'CN', label: 'NCPLabel.customer', elementControl: this.customerRenewalInfoHeaderMultiCheckArray.controls['clientName'] },
      { value: 'PR', label: 'NCPLabel.product', elementControl: this.customerRenewalInfoHeaderMultiCheckArray.controls['productDesc'] },
      { value: 'ED', label: 'NCPLabel.expiryDate', elementControl: this.customerRenewalInfoHeaderMultiCheckArray.controls['expiryDate'] },
      { value: 'PM', label: 'NCPLabel.Premium', elementControl: this.customerRenewalInfoHeaderMultiCheckArray.controls['premium'] },
      { value: 'ST', label: 'NCPLabel.status', elementControl: this.customerRenewalInfoHeaderMultiCheckArray.controls['statusDesc'] }
    ];




    this.enquiryServicesImp.quotePushedData.subscribe(
      data => {
        this.noQuotEnquiryInputFlag = data.length < this.searchlDetailsFormGroup.controls['maxRecords'].value ? true : false;
        for (let i = 0; i < data.length; i++) {
          if (data[i].clientFullName == false) {
            data[i].clientFullName = data[i].companyName;
          } else {
            data[i].clientFullName = data[i].clientFullName;
          }
          if (data[i].referralStatusDesc == false) {
            data[i].referralStatusDesc = data[i].statusDesc;
          } else {
            data[i].statusDesc = data[i].referralStatusDesc;
          }
        }
        this.checkQuoteEnquiry = true;
        this.quoteEnquiryInput = data;
        this.Ref.markForCheck();
      }
    );
    this.enquiryServicesImp.policyPushedData.subscribe(
      data => {
        this.noPolicyEnquiryInputFlag = data.length > this.searchlDetailsFormGroup.controls['maxRecords'].value ? true : false;
        for (let i = 0; i < data.length; i++) {
          data[i].reference = data[i].policyNo + '-' + data[i].policyEndtNo;
          if (data[i].clientFullName == false) {
            data[i].clientFullName = data[i].companyName;
          }
        }
        this.checkPolicyEnquiry = true;
        this.policyEnquiryInput = this.configurePolicyEnquiryJSONList(data);
        this.Ref.markForCheck();
      }
    );
    this.enquiryServicesImp.claimPushedData.subscribe(
      data => {
        this.noClaimEnquiryInputFlag = data.length < this.searchlDetailsFormGroup.controls['maxRecords'].value ? true : false;
        for (let i = 0; i < data.length; i++) {
          // data[i].reference = data[i].policyNo + '-' + data[i].policyEndtNo;
          data[i].reference = data[i].claimNo;
          if (data[i].clientFullName == false) {
            data[i].clientFullName = data[i].companyName;
          }
        }
        this.checkClaimEnquiry = true;
        this.claimEnquiryInput = data;
        this.Ref.markForCheck();
      }
    );
    this.enquiryServicesImp.renewalPushedData.subscribe(
      data => {
        this.noRenewalEnquiryInputFlag = data.length < this.searchlDetailsFormGroup.controls['maxRecords'].value ? true : false;
        this.checkRenewalEnquiry = true;
        this.renewalActivityList = data;
        this.Ref.markForCheck();
      }
    );
    this.utils.emitData.subscribe((data) => {
      let statusCode = 'RNSN';
      let statusDesc = 'Renewal Notice Sent';
      let obj = data.inputJSON;
      for (let i = 0; i < this.renewalActivityList.length; i++) {
        if (this.renewalActivityList[i].policyNo === obj.policyNo && this.renewalActivityList[i].statusCode != statusCode) {
          this.renewalActivityList[i].statusDesc = statusDesc;
          this.renewalActivityList[i].statusCode = statusCode;
          break;
        }
      }
    });
    this.enquiryServicesImp.proposalPushedData.subscribe(
      data => {
        this.noProposalEnquiryInputFlag = data.length < this.searchlDetailsFormGroup.controls['maxRecords'].value ? true : false;
        for (let i = 0; i < data.length; i++) {
          if (data[i].clientFullName == false) {
            data[i].clientFullName = data[i].companyName;
          } else {
            data[i].clientFullName = data[i].clientFullName;
          }
          if (data[i].referralStatusDesc == false) {
            data[i].referralStatusDesc = data[i].statusDesc;
          } else {
            data[i].statusDesc = data[i].referralStatusDesc;
          }
        }
        this.checkProposalEnquiry = true;
        this.proposalEnquiryList = data;
        this.Ref.markForCheck();
      }
    );
    //this.getSubordinateUserIDList();

    this.customerQuotInfoHeaderMultiCheckArray.valueChanges.subscribe(() => {
      if (this.customerQuotInfoHeaderMultiCheckArray.controls['clientFullName'].value !== true &&
        this.customerQuotInfoHeaderMultiCheckArray.controls['quoteNo'].value !== true &&
        this.customerQuotInfoHeaderMultiCheckArray.controls['productDesc'].value !== true &&
        this.customerQuotInfoHeaderMultiCheckArray.controls['statusDesc'].value !== true &&
        this.customerQuotInfoHeaderMultiCheckArray.controls['issueDate'].value !== true &&
        this.customerQuotInfoHeaderMultiCheckArray.controls['issuedBy'].value !== true) {
        this.errmsg = true;

      } else {
        this.errmsg = false;
      }
    });

    this.customerPolicyInfoHeaderMultiCheckArray.valueChanges.subscribe(() => {
      if (this.customerPolicyInfoHeaderMultiCheckArray.controls['clientFullName'].value !== true &&
        this.customerPolicyInfoHeaderMultiCheckArray.controls['policyNo'].value !== true &&
        this.customerPolicyInfoHeaderMultiCheckArray.controls['endtReasonCodeDesc'].value !== true &&
        this.customerPolicyInfoHeaderMultiCheckArray.controls['productDesc'].value !== true &&
        this.customerPolicyInfoHeaderMultiCheckArray.controls['statusDesc'].value !== true &&
        this.customerPolicyInfoHeaderMultiCheckArray.controls['expiryDate'].value !== true &&
        this.customerPolicyInfoHeaderMultiCheckArray.controls['issueDate'].value !== true &&
        this.customerPolicyInfoHeaderMultiCheckArray.controls['planTypeDesc'].value !== true &&
        this.customerPolicyInfoHeaderMultiCheckArray.controls['issuedBy'].value !== true) {
        this.errmsg = true;
      } else {
        this.errmsg = false;
      }
    });


    this.customerClaimInfoHeaderMultiCheckArray.valueChanges.subscribe(() => {
      if (this.customerClaimInfoHeaderMultiCheckArray.controls['clientFullName'].value !== true &&
        this.customerClaimInfoHeaderMultiCheckArray.controls['claimNo'].value !== true &&
        this.customerClaimInfoHeaderMultiCheckArray.controls['policyNo'].value !== true &&
        this.customerClaimInfoHeaderMultiCheckArray.controls['productDesc'].value !== true &&
        this.customerClaimInfoHeaderMultiCheckArray.controls['lossDateFrom'].value !== true &&
        this.customerClaimInfoHeaderMultiCheckArray.controls['noticeDateFrom'].value !== true &&
        this.customerClaimInfoHeaderMultiCheckArray.controls['statusDesc'].value !== true &&
        this.customerClaimInfoHeaderMultiCheckArray.controls['issuedBy'].value !== true) {
        this.errmsg = true;

      } else {
        this.errmsg = false;
      }
    });


    this.customerRenewalInfoHeaderMultiCheckArray.valueChanges.subscribe(() => {
      if (this.customerRenewalInfoHeaderMultiCheckArray.controls['policyNo'].value !== true &&
        this.customerRenewalInfoHeaderMultiCheckArray.controls['clientName'].value !== true &&
        this.customerRenewalInfoHeaderMultiCheckArray.controls['productDesc'].value !== true &&
        this.customerRenewalInfoHeaderMultiCheckArray.controls['expiryDate'].value !== true &&
        this.customerRenewalInfoHeaderMultiCheckArray.controls['premium'].value !== true &&
        this.customerRenewalInfoHeaderMultiCheckArray.controls['statusDesc'].value !== true) {
        this.errmsg = true;
      } else {
        this.errmsg = false;
      }
    });

    this.searchlDetailsFormGroup.controls['subOrdinateUser'].valueChanges.subscribe((data)=>{
      if(data && data.length>0){
        this.searchlDetailsFormGroup.controls['ownTransaction'].setValue(false);
      }else{
        this.searchlDetailsFormGroup.controls['ownTransaction'].setValue(true);
      }
      
    });

  }

  getInfo(filterModel) {
    if (filterModel.isNotificationFlag) {
      if (filterModel.isPolicyOrQuote === 'QT') {
        this.enquiryType = 'QT';
        this.getQuoteInfo();
        this.config.resetfilterModel();
        this.filterModel = this.config.getfilterModel();
        this.getPolicyInfo();
        this.getClaimInfo();
        this.showTabContent(null, true, 'content1');
      } else if (filterModel.isPolicyOrQuote === 'PO') {
        this.enquiryType = 'PO';
        this.getPolicyInfo();
        this.showTabContent(null, true, 'content3');
        this.config.resetfilterModel();
        this.filterModel = this.config.getfilterModel();
        this.getQuoteInfo();
        this.getClaimInfo();
      } else if (filterModel.isPolicyOrQuote === 'CL') {
        this.enquiryType = 'CL';
        this.getClaimInfo();
        this.config.resetfilterModel();
        this.filterModel = this.config.getfilterModel();
        this.getQuoteInfo();
        this.getPolicyInfo();
        this.showTabContent(null, true, 'content4');
      }
    } else if (filterModel.isSEOSearchFlag) {
      if (filterModel.isPolicyOrQuote === 'QT') {
        this.enquiryType = 'QT';
        this.getSEOQuoteInfo();
        this.config.resetfilterModel();
        this.filterModel = this.config.getfilterModel();
        this.getPolicyInfo();
        this.getClaimInfo();
        this.getRenewalPoliciesData();
        this.showTabContent(null, true, 'content1');
      } else if (filterModel.isPolicyOrQuote === 'PO') {
        this.enquiryType = 'PO';
        this.getSEOPolicyInfo();
        this.showTabContent(null, true, 'content3');
        this.config.resetfilterModel();
        this.filterModel = this.config.getfilterModel();
        this.getQuoteInfo();
        this.getClaimInfo();
        this.getRenewalPoliciesData();
      }
      else if (filterModel.isPolicyOrQuote === 'CL') {
        this.enquiryType = 'CL';
        this.getSEOClaimsInfo();
        this.config.resetfilterModel();
        this.filterModel = this.config.getfilterModel();
        this.getQuoteInfo();
        this.getPolicyInfo();
        this.getRenewalPoliciesData();
        this.showTabContent(null, true, 'content4');
      }
      else if (filterModel.isPolicyOrQuote === 'RP') {
        this.enquiryType = 'RP';
        this.getSEORenewalInfo();
        this.config.resetfilterModel();
        this.filterModel = this.config.getfilterModel();
        this.getQuoteInfo();
        this.getPolicyInfo();
        this.getClaimInfo();
        this.showTabContent(null, true, 'content5');
      }
    } else {
      if (!this.setThroughFilter) {
        this.getDefaultQuoteInfo();
        if (this.lifeLOBFlag)
          this.getDefaultProposalInfo();
        this.getPolicyInfo();
        this.getClaimInfo();
        this.getRenewalPoliciesData();
        this.setThroughFilter = false;
        this.showTabContent(null, true, 'content1');
      }
    }
    this.changeRef.markForCheck();
  }
  getDefaultQuoteInfo() {
    this.inputPickList.auxType = 'MiscInfo';
    this.inputPickList.auxSubType = 'STAT';
    this.inputPickList.param1 = 'QOT';
    let quoteStatusResponse = this.config.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', this.inputPickList);
    quoteStatusResponse.subscribe((quoteStatusData) => {
      if (quoteStatusData) {
        this.quoteStatus = quoteStatusData;
        this.filterModel.status = this.quoteStatus;
        this.enquiryServicesImp.getQuoteEnquiry(this.filterModel);
      }
    });
  }

  getDefaultProposalInfo() {
    this.inputPickList.auxType = 'MiscInfo';
    this.inputPickList.auxSubType = 'STAT';
    this.inputPickList.param1 = 'PRP';
    let proposalStatusResponse = this.config.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', this.inputPickList);
    proposalStatusResponse.subscribe((proposalStatusData) => {
      if (proposalStatusData) {
        this.proposalStatus = proposalStatusData;
        this.filterModel.status = this.proposalStatus;
        this.enquiryServicesImp.getProposalEnquiry(this.filterModel);
      }
    });
  }

  getQuoteInfo() {
    this.enquiryServicesImp.getQuoteEnquiry(this.filterModel);
  }

  getProposalInfo() {
    this.enquiryServicesImp.getProposalEnquiry(this.filterModel);
  }

  getPolicyInfo() {
    this.enquiryServicesImp.getPolicyEnquiry(this.filterModel);
  }

  getClaimInfo() {
    this.enquiryServicesImp.getClaimEnquiry(this.filterModel);
  }

  getSEOQuoteInfo() {
    this.enquiryServicesImp.getSEOQuoteEnquiry(this.filterModel.filterString);
  }

  getSEOPolicyInfo() {
    this.enquiryServicesImp.getSEOPolicyEnquiry(this.filterModel.filterString);
  }

  getSEOClaimsInfo() {
    this.enquiryServicesImp.getSEOClaimsEnquiry(this.filterModel.filterString);
  }
  getSEORenewalInfo() {
    this.enquiryServicesImp.getSEOClaimsEnquiry(this.filterModel.filterString);
  }

  doViewMore() {
    if (this.viewMoreClicked === false) {
      this.patchedQuotMaxRecordsValue = parseInt(this.searchlDetailsFormGroup.controls['maxRecords'].value);
      this.patchedPolicyMaxRecordsValue = parseInt(this.searchlDetailsFormGroup.controls['maxRecords'].value);
      this.patchedClaimMaxRecordsValue = parseInt(this.searchlDetailsFormGroup.controls['maxRecords'].value);
      this.patchedRenewalMaxRecordsValue = parseInt(this.searchlDetailsFormGroup.controls['maxRecords'].value);
      this.viewMoreClicked = true;
    }
    this.config.setLoadingSub('yes');
    if (this.enquiryType === 'QT') {
      this.patchedQuotMaxRecordsValue += 5;
      this.searchlDetailsFormGroup.controls['maxRecords'].patchValue(this.patchedQuotMaxRecordsValue.toString());
      this.quotEnquirySearch();
    } else if (this.enquiryType === 'PO') {
      this.patchedPolicyMaxRecordsValue += 5;
      this.searchlDetailsFormGroup.controls['maxRecords'].patchValue(this.patchedPolicyMaxRecordsValue.toString());
      this.policyEnquirySearch();
    }
    else if (this.enquiryType === 'CL') {
      this.patchedClaimMaxRecordsValue += 5;
      this.searchlDetailsFormGroup.controls['maxRecords'].patchValue(this.patchedClaimMaxRecordsValue.toString());
      this.claimEnquirySearch();
    } else if (this.enquiryType === 'RP') {
      this.patchedRenewalMaxRecordsValue += 5;
      this.searchlDetailsFormGroup.controls['maxRecords'].patchValue(this.patchedRenewalMaxRecordsValue.toString());
      this.searchlDetailsFormGroup.controls['policiesExpiringInDays'].patchValue(365);
      this.renewalEnquirySearch();
    }
    else if (this.enquiryType === 'PR') {
      this.patchedQuotMaxRecordsValue += 5;
      this.searchlDetailsFormGroup.controls['maxRecords'].patchValue(this.patchedQuotMaxRecordsValue.toString());
      this.proposalEnquirySearch();
    }
  }



  searchCustomerModel() {
	if(this.config.get('selectAllWithSamePartyId')){
      this.searchlDetailsFormGroup.controls['selectAllWithSamePartyId'].patchValue(true);
      this.searchlDetailsFormGroup.controls['isHierarchySearch'].patchValue(true);
    }
    if (this.enquiryType === 'QT') {
      this.searchlDetailsFormGroup.controls['txnType'].patchValue(ElementConstants.quoteTxnType)
      this.config.setfilterModel(this.searchlDetailsFormGroup.value);
      this.quotEnquirySearch();
    } else if (this.enquiryType === 'PO') {
      this.searchlDetailsFormGroup.controls['txnType'].patchValue(ElementConstants.policyTxnType)
      this.config.setfilterModel(this.searchlDetailsFormGroup.value);
      this.policyEnquirySearch();
    } else if (this.enquiryType === 'CL') {
      this.searchlDetailsFormGroup.controls['txnType'].patchValue(ElementConstants.claimTxnType)
      this.config.setfilterModel(this.searchlDetailsFormGroup.value);
      this.claimEnquirySearch();
    } else if (this.enquiryType === 'RP') {
      this.renewalEnquirySearch();
    } else if (this.enquiryType === 'PR') {
      this.proposalEnquirySearch();
    }
  }

  getSubordinateUserIDList() {
    let subordinateUsers = this.enquiryServices.getSubordinateUserIDList(this.searchlDetailsFormGroup.value);
    subordinateUsers.subscribe(
      (subordinateUserList) => {
        if (subordinateUserList.error !== null && subordinateUserList.error !== undefined && subordinateUserList.error.length >= 1) {
          this.logger.error('getSubordinateUserIDList()===>' + subordinateUserList.error);
        } else {
          let tempList: Array<Object>[] = new Array();
          let tempJSON: any = { "value": "", "display": "" };
          tempList.push(tempJSON);
          subordinateUserList.forEach(element => {
            tempJSON = { "value": element, "display": element };
            tempList.push(tempJSON);
          });
          this.subordinateUserIDList = tempList;
        }
      },
      (error) => {
        this.logger.error(error);
        this.config.setLoadingSub('no');
      }
    );
  }


  quotEnquirySearch() {
    let quotOutput = this.enquiryServices.getQuotEnquiryInfo(this.searchlDetailsFormGroup.value);
    quotOutput.subscribe(
      (quotEnquiryInfodataVal) => {
        if (quotEnquiryInfodataVal.error !== null && quotEnquiryInfodataVal.error !== undefined && quotEnquiryInfodataVal.error.length >= 1) {
          this.logger.error('getQuotInfo()===>' + quotEnquiryInfodataVal.error);
          this.noQuotEnquiryInputFlag = true;
        } else {
          if (quotEnquiryInfodataVal.length < this.searchlDetailsFormGroup.controls['maxRecords'].value) {
            this.noQuotEnquiryInputFlag = true;
          } else {
            this.noQuotEnquiryInputFlag = false;
          }

          for (let i = 0; i < quotEnquiryInfodataVal.length; i++) {
            if (quotEnquiryInfodataVal[i].clientFullName == false) {
              quotEnquiryInfodataVal[i].clientFullName = quotEnquiryInfodataVal[i].companyName;
            }
            if (quotEnquiryInfodataVal[i].referralStatusDesc == false) {
              quotEnquiryInfodataVal[i].referralStatusDesc = quotEnquiryInfodataVal[i].statusDesc;
            } else {
              quotEnquiryInfodataVal[i].statusDesc = quotEnquiryInfodataVal[i].referralStatusDesc;
            }
          }
          this.quoteEnquiryInput = quotEnquiryInfodataVal;
          this.Ref.markForCheck();
          this.config.setLoadingSub('no');
          // this.isShowTableFlag = true;
        }

      },
      (error) => {
        this.logger.error(error);
        this.config.setLoadingSub('no');
      });
  }

  policyEnquirySearch() {
    let policyOutput = this.enquiryServices.getPolicyEnquiryInfo(this.searchlDetailsFormGroup.value);
    policyOutput.subscribe(
      (policyEnquiryInfodataVal) => {
        if (policyEnquiryInfodataVal.error !== null && policyEnquiryInfodataVal.error !== undefined && policyEnquiryInfodataVal.error.length >= 1) {
          this.noPolicyEnquiryInputFlag = true;
          this.logger.error('getPolicyInfo()===>' + policyEnquiryInfodataVal.error);
        } else {
          if (policyEnquiryInfodataVal.length < this.searchlDetailsFormGroup.controls['maxRecords'].value) {
            this.noPolicyEnquiryInputFlag = true;
          } else {
            this.noPolicyEnquiryInputFlag = false;
          }
          for (let i = 0; i < policyEnquiryInfodataVal.length; i++) {

            policyEnquiryInfodataVal[i].reference = policyEnquiryInfodataVal[i].policyNo + '-' + policyEnquiryInfodataVal[i].policyEndtNo;
            if (policyEnquiryInfodataVal[i].clientFullName == false) {
              policyEnquiryInfodataVal[i].clientFullName = policyEnquiryInfodataVal[i].companyName;
            }
          }
          this.policyEnquiryInput = this.configurePolicyEnquiryJSONList(policyEnquiryInfodataVal);
          this.Ref.markForCheck();
          this.config.setLoadingSub('no');
          //this.searchlDetailsFormGroup.controls['status'].reset();
          // this.isShowTableFlag = true;
        }

      },
      (error) => {
        this.logger.error(error);
        this.config.setLoadingSub('no');
      });
  }

  private configurePolicyEnquiryJSONList(policyEnquiryJSONList) {
    for (let i = 0; i < policyEnquiryJSONList.length; i++) {
      let productDesc: string = policyEnquiryJSONList[i].productDesc;
      if (policyEnquiryJSONList[i].planTypeCode != undefined && policyEnquiryJSONList[i].planTypeCode != null && policyEnquiryJSONList[i].planTypeCode != '' && this.customerPolicyInfoHeaderMultiCheckArray.controls['planTypeDesc'].value === true) {
        productDesc = productDesc.replace('-'.concat(policyEnquiryJSONList[i].planTypeDesc), '');
        productDesc = productDesc.concat('-').concat(policyEnquiryJSONList[i].planTypeDesc);
        policyEnquiryJSONList[i].productDesc = productDesc;
      } else {
        productDesc = productDesc.replace('-'.concat(policyEnquiryJSONList[i].planTypeDesc), '');
        policyEnquiryJSONList[i].productDesc = productDesc;
      }
    }
    return policyEnquiryJSONList;
  }

  claimEnquirySearch() {
    let claimOutput = this.enquiryServices.getClaimEnquiryInfo(this.searchlDetailsFormGroup.value);
    claimOutput.subscribe(
      (claimEnquiryInfodataVal) => {
        if (claimEnquiryInfodataVal.error !== null && claimEnquiryInfodataVal.error !== undefined && claimEnquiryInfodataVal.error.length >= 1) {
          this.logger.error('getClaimInfo()===>' + claimEnquiryInfodataVal.error);
          this.noClaimEnquiryInputFlag = true;
        } else {
          if (claimEnquiryInfodataVal.length < this.searchlDetailsFormGroup.controls['maxRecords'].value) {
            this.noClaimEnquiryInputFlag = true;
          } else {
            this.noClaimEnquiryInputFlag = false;
          }
          for (let i = 0; i < claimEnquiryInfodataVal.length; i++) {
            if (claimEnquiryInfodataVal[i].clientFullName == false) {
              claimEnquiryInfodataVal[i].clientFullName = claimEnquiryInfodataVal[i].companyName;
            }
          }
          this.claimEnquiryInput = claimEnquiryInfodataVal;
          this.Ref.markForCheck();
          this.config.setLoadingSub('no');
          // this.isShowTableFlag = true;
        }

      },
      (error) => {
        this.logger.error(error);
        this.config.setLoadingSub('no');
      });
  }

  renewalEnquirySearch() {
    this.renewalActivityList = [];
    let renewalPoliciesResponse = this.enquiryServices.getRenewalPoliciesData(this.searchlDetailsFormGroup.value);
    renewalPoliciesResponse.subscribe(
      (renewalPolicies) => {
        if (renewalPolicies.error !== null && renewalPolicies.error !== undefined && renewalPolicies.error.length >= 1) {
          this.errmsg = true;
          this.errors = [];
          for (let i = 1; i < renewalPolicies.error.length; i++) {
            this.errors.push({ 'errCode': renewalPolicies.error[i].errCode, 'errDesc': renewalPolicies.error[i].errDesc });
          }
          this.config.setLoadingSub('no');
        } else {
          this.renewalDataListForSearch = renewalPolicies;
          this.renewalActivityList.push(...renewalPolicies);
          this.isShowTableFlag = true;
          this.config.setLoadingSub('no');
        }
      }
    );
  }
  proposalEnquirySearch() {
    this.searchlDetailsFormGroup.controls['status'].value ? '' : this.searchlDetailsFormGroup.controls['status'].patchValue(this.proposalStatus);
    let quotOutput = this.enquiryServices.getQuotEnquiryInfo(this.searchlDetailsFormGroup.value);
    quotOutput.subscribe(
      (proposalEnquiryList) => {
        if (proposalEnquiryList.error !== null && proposalEnquiryList.error !== undefined && proposalEnquiryList.error.length >= 1) {
          this.logger.error('getQuotInfo()===>' + proposalEnquiryList.error);
          this.noProposalEnquiryInputFlag = true;
        } else {
          if (proposalEnquiryList.length < this.searchlDetailsFormGroup.controls['maxRecords'].value) {
            this.noProposalEnquiryInputFlag = true;
          } else {
            this.noProposalEnquiryInputFlag = false;
          }

          for (let i = 0; i < proposalEnquiryList.length; i++) {
            if (proposalEnquiryList[i].referralStatusDesc == false) {
              proposalEnquiryList[i].referralStatusDesc = proposalEnquiryList[i].statusDesc;
            } else {
              proposalEnquiryList[i].statusDesc = proposalEnquiryList[i].referralStatusDesc;
            }
          }
          this.proposalEnquiryList = proposalEnquiryList;
          this.Ref.markForCheck();
          this.config.setLoadingSub('no');
          this.searchlDetailsFormGroup.controls['status'].reset();
          // this.isShowTableFlag = true;
        }
      },
      (error) => {
        this.logger.error(error);
        this.config.setLoadingSub('no');
      });
  }
  resetCustomer() {
    this.searchlDetailsFormGroup = this.enquiryinfoModel.resetfilterModel();
    if (this.enquiryType === 'QT') {
      this.quotEnquirySearch();
    } else if (this.enquiryType === 'PO') {
      this.policyEnquirySearch();
    } else if (this.enquiryType === 'CL') {
      this.claimEnquirySearch();
    } else if (this.enquiryType === 'RP') {
      this.renewalEnquirySearch();
    }
    this.clearCustomerSearchModel();
  }

  clearCustomerSearchModel() {
    for (let key in this.searchlDetailsFormGroup.controls) {
      this.searchlDetailsFormGroup.get(key).setValue('');
      this.searchlDetailsFormGroup.get(key).updateValueAndValidity();
    }
    this.searchlDetailsFormGroup.setValue(this.enquiryinfoModel.getEnquiryInfoModel().value);
    this.Ref.markForCheck();
  }

  colhide(): any {
    let newcolumnlistquot = [];
    let newcolumnlist1quot = [];
    let newcolumnlist2quot = [];
    let newcolumnlistpolicy = [];
    let newcolumnlist1policy = [];
    let newcolumnlist2policy = [];
    let newcolumnlistclaim = [];
    let newcolumnlist1claim = [];
    let newcolumnlist2claim = [];
    let newcolumnlistrenewal = [];
    let newcolumnlist1renewal = [];
    let newcolumnlist2renewal = [];
    let columnsList1 = [];
    let quoteCheckSort: boolean = true;
    let policyCheckSort: boolean = true;
    let claimsCheckSort: boolean = true;
    let renewalCheckSort: boolean = true;

    if (this.customerQuotInfoHeaderMultiCheckArray.controls['clientFullName'].value === true ||
      this.customerQuotInfoHeaderMultiCheckArray.controls['quoteNo'].value === true ||
      this.customerQuotInfoHeaderMultiCheckArray.controls['productDesc'].value === true ||
      this.customerQuotInfoHeaderMultiCheckArray.controls['statusDesc'].value === true ||
      this.customerQuotInfoHeaderMultiCheckArray.controls['issueDate'].value === true ||
      this.customerQuotInfoHeaderMultiCheckArray.controls['issuedBy'].value === true
    ) {
      for (var i = 0; i < this._quoteActivityHeader.length; i++) {
        if (this.customerQuotInfoHeaderMultiCheckArray.controls['clientFullName'].value === false && this._quoteActivityHeader[i] === "NCPLabel.prospect") { continue; }
        if (this.customerQuotInfoHeaderMultiCheckArray.controls['quoteNo'].value === false && this._quoteActivityHeader[i] === "NCPLabel.quoteNo") { continue; }
        if (this.customerQuotInfoHeaderMultiCheckArray.controls['productDesc'].value === false && this._quoteActivityHeader[i] === "NCPLabel.product") { continue; }
        if (this.customerQuotInfoHeaderMultiCheckArray.controls['issueDate'].value === false && this._quoteActivityHeader[i] === "NCPLabel.quoteDate") { continue; }
        if (this.customerQuotInfoHeaderMultiCheckArray.controls['statusDesc'].value === false && this._quoteActivityHeader[i] === "NCPLabel.status") { continue; }
        if (this.customerQuotInfoHeaderMultiCheckArray.controls['issuedBy'].value === false && this._quoteActivityHeader[i] === "NCPLabel.issuedBy") { continue; }

        newcolumnlistquot.push(this._quoteActivityHeader[i]);
        newcolumnlist1quot.push(this._quoteActivityMapping[i]);
        newcolumnlist2quot.push(this._quoteActivityIconsClassNames[i]);
        
      }
      this.quoteActivityMapping = [];
      this.quoteActivityHeader = [];
      this.quoteActivityIconsClassNames = [];
      this.quoteActivityHeader.push(...newcolumnlistquot);
      this.quoteActivityMapping.push(...newcolumnlist1quot);
      this.quoteActivityIconsClassNames.push(...newcolumnlist2quot);
      let tableLength = this.quoteActivityMapping.length;
      for (let i = 0; i < tableLength; i++) {
        columnsList1.push({ header: this.quoteActivityHeader[i], mapping: this.quoteActivityMapping[i], showColumn: true, className: this.quoteActivityIconsClassNames[i]});
      }
      this.quotTableDetails = columnsList1;
      columnsList1 = [];
      this.errmsg = false;
      quoteCheckSort = true;
    }
    else {
      this.errmsg = true;
      quoteCheckSort = false;
    }

    if (this.customerPolicyInfoHeaderMultiCheckArray.controls['clientFullName'].value === true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['policyNo'].value === true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['endtReasonCodeDesc'].value === true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['productDesc'].value === true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['statusDesc'].value === true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['issueDate'].value === true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['expiryDate'].value === true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['planTypeDesc'].value === true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['issuedBy'].value === true) {
      for (var i = 0; i < this._policyActivityHeader.length; i++) {
        if (this.customerPolicyInfoHeaderMultiCheckArray.controls['clientFullName'].value === false && this._policyActivityHeader[i] === "NCPLabel.policyholderName") { continue; }
        if (this.customerPolicyInfoHeaderMultiCheckArray.controls['policyNo'].value === false && this._policyActivityHeader[i] === "NCPLabel.policyNo") { continue; }
        if (this.customerPolicyInfoHeaderMultiCheckArray.controls['endtReasonCodeDesc'].value === false && this._policyActivityHeader[i] === "NCPLabel.endtReason") { continue; }
        if (this.customerPolicyInfoHeaderMultiCheckArray.controls['productDesc'].value === false && this._policyActivityHeader[i] === "NCPLabel.product") { continue; }
        if (this.customerPolicyInfoHeaderMultiCheckArray.controls['issueDate'].value === false && this._policyActivityHeader[i] === "NCPLabel.inceptionDate") { continue; }
        if (this.customerPolicyInfoHeaderMultiCheckArray.controls['expiryDate'].value === false && this._policyActivityHeader[i] === "NCPLabel.enddate") { continue; }
        if (this.customerPolicyInfoHeaderMultiCheckArray.controls['statusDesc'].value === false && this._policyActivityHeader[i] === "NCPLabel.status") { continue; }
        if (this.customerPolicyInfoHeaderMultiCheckArray.controls['issuedBy'].value === false && this._policyActivityHeader[i] === "NCPLabel.issuedBy") { continue; }

        newcolumnlistpolicy.push(this._policyActivityHeader[i]);
        newcolumnlist1policy.push(this._policyActivityMapping[i]);
        newcolumnlist2policy.push(this._policyActivityIconsClassNames[i]);
      }

      this.policyEnquiryInput = this.configurePolicyEnquiryJSONList(this.policyEnquiryInput);

      this.policyActivityHeader = [];
      this.policyActivityMapping = [];
      this.policyActivityIconsClassNames = [];

      this.policyActivityHeader.push(...newcolumnlistpolicy);
      this.policyActivityMapping.push(...newcolumnlist1policy);
      this.policyActivityIconsClassNames.push(...newcolumnlist2policy);

      let tableLength = this.policyActivityMapping.length;
      for (let i = 0; i < tableLength; i++) {
        columnsList1.push({ header: this.policyActivityHeader[i], mapping: this.policyActivityMapping[i], showColumn: true, className: this.policyActivityIconsClassNames[i] });
      }
      this.policyTableDetails = columnsList1;
      columnsList1 = [];
      this.errmsg = false;
      policyCheckSort = true;
    } else {
      this.errmsg = true;
      policyCheckSort = false;
    }

    if (this.customerClaimInfoHeaderMultiCheckArray.controls['clientFullName'].value === true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['claimNo'].value === true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['policyNo'].value === true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['productDesc'].value === true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['lossDateFrom'].value === true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['noticeDateFrom'].value === true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['statusDesc'].value === true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['issuedBy'].value === true) {
      for (var i = 0; i < this._claimActivityHeader.length; i++) {
        if (this.customerClaimInfoHeaderMultiCheckArray.controls['clientFullName'].value === false && this._claimActivityHeader[i] === "NCPLabel.claimantName") { continue; }
        if (this.customerClaimInfoHeaderMultiCheckArray.controls['claimNo'].value === false && this._claimActivityHeader[i] === "NCPLabel.ClaimNo") { continue; }
        if (this.customerClaimInfoHeaderMultiCheckArray.controls['policyNo'].value === false && this._claimActivityHeader[i] === "NCPLabel.policyNo") { continue; }
        if (this.customerClaimInfoHeaderMultiCheckArray.controls['productDesc'].value === false && this._claimActivityHeader[i] === "NCPLabel.product") { continue; }
        if (this.customerClaimInfoHeaderMultiCheckArray.controls['lossDateFrom'].value === false && this._claimActivityHeader[i] === "NCPLabel.lossDateFrom") { continue; }
        if (this.customerClaimInfoHeaderMultiCheckArray.controls['noticeDateFrom'].value === false && this._claimActivityHeader[i] === "NCPLabel.noticeDateFrom") { continue; }
        if (this.customerClaimInfoHeaderMultiCheckArray.controls['statusDesc'].value === false && this._claimActivityHeader[i] === "NCPLabel.status") { continue; }
        if (this.customerClaimInfoHeaderMultiCheckArray.controls['issuedBy'].value === false && this._claimActivityHeader[i] === "NCPLabel.issuedBy") { continue; }

        newcolumnlistclaim.push(this._claimActivityHeader[i]);
        newcolumnlist1claim.push(this._claimActivityMapping[i]);
        newcolumnlist2claim.push(this._claimActivityIconsClassNames[i]);
      }

      this.claimActivityHeader = [];
      this.claimActivityMapping = [];
      this.claimActivityIconsClassNames = [];

      this.claimActivityHeader.push(...newcolumnlistclaim);
      this.claimActivityMapping.push(...newcolumnlist1claim);
      this.claimActivityIconsClassNames.push(...newcolumnlist2claim);

      let tableLength = this.claimActivityMapping.length;
      for (let i = 0; i < tableLength; i++) {
        columnsList1.push({ header: this.claimActivityHeader[i], mapping: this.claimActivityMapping[i], showColumn: true, className: this.claimActivityIconsClassNames[i] });
      }
      this.claimTableDetails = columnsList1;
      columnsList1 = [];
      this.errmsg = false;
      claimsCheckSort = true;
    } else {
      this.errmsg = true;
      claimsCheckSort = false;
    }
    /*-------------------------*/

    if (this.customerRenewalInfoHeaderMultiCheckArray.controls['policyNo'].value === true ||
      this.customerRenewalInfoHeaderMultiCheckArray.controls['clientName'].value === true ||
      this.customerRenewalInfoHeaderMultiCheckArray.controls['productDesc'].value === true ||
      this.customerRenewalInfoHeaderMultiCheckArray.controls['expiryDate'].value === true ||
      this.customerRenewalInfoHeaderMultiCheckArray.controls['premium'].value === true ||
      this.customerRenewalInfoHeaderMultiCheckArray.controls['statusDesc'].value === true) {

      for (var i = 0; i < this._renewalActivityHeader.length; i++) {
        if (this.customerRenewalInfoHeaderMultiCheckArray.controls['policyNo'].value === false && this._renewalActivityHeader[i] === "NCPLabel.policyNo") { continue; }
        if (this.customerRenewalInfoHeaderMultiCheckArray.controls['clientName'].value === false && this._renewalActivityHeader[i] === "NCPLabel.customer") { continue; }
        if (this.customerRenewalInfoHeaderMultiCheckArray.controls['productDesc'].value === false && this._renewalActivityHeader[i] === "NCPLabel.product") { continue; }
        if (this.customerRenewalInfoHeaderMultiCheckArray.controls['expiryDate'].value === false && this._renewalActivityHeader[i] === "NCPLabel.expiryDate") { continue; }
        if (this.customerRenewalInfoHeaderMultiCheckArray.controls['premium'].value === false && this._renewalActivityHeader[i] === "NCPLabel.Premium") { continue; }
        if (this.customerRenewalInfoHeaderMultiCheckArray.controls['statusDesc'].value === false && this._renewalActivityHeader[i] === "NCPLabel.status") { continue; }

        newcolumnlistrenewal.push(this._renewalActivityHeader[i]);
        newcolumnlist1renewal.push(this._renewalActivityMapping[i]);
        newcolumnlist2renewal.push(this._renewalActivityIconsClassNames[i]);
      }

      //this.renewalEnquiryInput = this.configureRenewalEnquiryJSONList(this.renewalEnquiryInput);

      this.renewalActivityHeader = [];
      this.renewalActivityMapping = [];
      this.renewalActivityIconsClassNames = [];

      this.renewalActivityHeader.push(...newcolumnlistrenewal);
      this.renewalActivityMapping.push(...newcolumnlist1renewal);
      this.renewalActivityIconsClassNames.push(...newcolumnlist2renewal);

      let tableLength = this.renewalActivityMapping.length;
      for (let i = 0; i < tableLength; i++) {
        columnsList1.push({ header: this.renewalActivityHeader[i], mapping: this.renewalActivityMapping[i], showColumn: true, className: this.renewalActivityIconsClassNames[i] });
      }
      this.renewalTableDetails = columnsList1;
      columnsList1 = [];
      this.errmsg = false;
      renewalCheckSort = true;
    } else {
      this.errmsg = true;
      renewalCheckSort = false;
    }

    if (quoteCheckSort && policyCheckSort && claimsCheckSort && renewalCheckSort == true) {
      this.customerEditView.close();
    } else {
      this.errmsg = true;
    }
    this.config.setCustom('customerQuotInfoHeaderMultiCheckArray', this.customerQuotInfoHeaderMultiCheckArray.value);
    this.config.setCustom('customerPolicyInfoHeaderMultiCheckArray', this.customerPolicyInfoHeaderMultiCheckArray.value);
    this.config.setCustom('customerClaimInfoHeaderMultiCheckArray', this.customerClaimInfoHeaderMultiCheckArray.value);
    this.config.setCustom('customerRenewalInfoHeaderMultiCheckArray', this.customerRenewalInfoHeaderMultiCheckArray.value);

  }

  settingsClose() {
    this.customerQuotInfoHeaderMultiCheckArray.patchValue(this.config.getCustom('customerQuotInfoHeaderMultiCheckArray'));
    this.customerPolicyInfoHeaderMultiCheckArray.patchValue(this.config.getCustom('customerPolicyInfoHeaderMultiCheckArray'));
    this.customerClaimInfoHeaderMultiCheckArray.patchValue(this.config.getCustom('customerClaimInfoHeaderMultiCheckArray'));
    this.customerRenewalInfoHeaderMultiCheckArray.patchValue(this.config.getCustom('customerRenewalInfoHeaderMultiCheckArray'));
  }

  selectAllColumn() {

    this.quoteActivityHeader = [];
    this.quoteActivityMapping = [];
    this.quoteActivityIconsClassNames = [];
    let quotColumnsList = [];

    let policyColumnsList = [];
    let claimColumnsList = [];
    let renewalColumnsList = [];

    this.quoteActivityHeader.push(...this._quoteActivityHeader);
    this.quoteActivityMapping.push(...this._quoteActivityMapping);
    this.quoteActivityIconsClassNames.push(...this._quoteActivityIconsClassNames);

    this.policyActivityHeader = [];
    this.policyActivityMapping = [];
    this.policyActivityIconsClassNames = [];


    this.policyActivityHeader.push(...this._policyActivityHeader);
    this.policyActivityMapping.push(...this._policyActivityMapping);
    this.policyActivityIconsClassNames.push(...this._policyActivityIconsClassNames);

    this.claimActivityHeader = [];
    this.claimActivityMapping = [];
    this.claimActivityIconsClassNames = [];

    this.claimActivityHeader.push(...this._claimActivityHeader);
    this.claimActivityMapping.push(...this._claimActivityMapping);
    this.claimActivityIconsClassNames.push(...this._claimActivityIconsClassNames);

    this.renewalActivityHeader = [];
    this.renewalActivityMapping = [];
    this.renewalActivityIconsClassNames = [];

    this.renewalActivityHeader.push(...this._renewalActivityHeader);
    this.renewalActivityMapping.push(...this._renewalActivityMapping);
    this.renewalActivityIconsClassNames.push(...this._renewalActivityIconsClassNames);

    let tableLength = this.quoteActivityMapping.length;
    for (let i = 0; i < tableLength; i++) {
      quotColumnsList.push({ header: this.quoteActivityHeader[i], mapping: this.quoteActivityMapping[i], showColumn: true, className: this.quoteActivityIconsClassNames[i]});
    }
    tableLength = this.policyActivityMapping.length;
    for (let i = 0; i < tableLength; i++) {
      policyColumnsList.push({ header: this.policyActivityHeader[i], mapping: this.policyActivityMapping[i], showColumn: true, className: this.policyActivityIconsClassNames[i] });
    }
    tableLength = this.claimActivityMapping.length;
    for (let i = 0; i < tableLength; i++) {
      claimColumnsList.push({ header: this.claimActivityHeader[i], mapping: this.claimActivityMapping[i], showColumn: true, className: this.claimActivityIconsClassNames[i] });
    }

    tableLength = this.renewalActivityMapping.length;
    for (let i = 0; i < tableLength; i++) {
      renewalColumnsList.push({ header: this.renewalActivityHeader[i], mapping: this.renewalActivityMapping[i], showColumn: true, className: this.renewalActivityIconsClassNames[i] });
    }
    this.quotTableDetails = quotColumnsList;
    this.policyTableDetails = policyColumnsList;
    this.claimTableDetails = claimColumnsList;
    this.renewalTableDetails = renewalColumnsList;
    this.errmsg = false;
    if (this.customerQuotInfoHeaderMultiCheckArray.controls['clientFullName'].value !== true ||
      this.customerQuotInfoHeaderMultiCheckArray.controls['quoteNo'].value !== true ||
      this.customerQuotInfoHeaderMultiCheckArray.controls['productDesc'].value !== true ||
      this.customerQuotInfoHeaderMultiCheckArray.controls['statusDesc'].value !== true ||
      this.customerQuotInfoHeaderMultiCheckArray.controls['issueDate'].value !== true ||
      this.customerQuotInfoHeaderMultiCheckArray.controls['issuedBy'].value !== true ||

      this.customerPolicyInfoHeaderMultiCheckArray.controls['clientFullName'].value !== true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['policyNo'].value !== true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['endtReasonCodeDesc'].value !== true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['productDesc'].value !== true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['statusDesc'].value !== true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['expiryDate'].value !== true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['issueDate'].value !== true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['planTypeDesc'].value !== true ||
      this.customerPolicyInfoHeaderMultiCheckArray.controls['issuedBy'].value !== true ||


      this.customerClaimInfoHeaderMultiCheckArray.controls['clientFullName'].value !== true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['claimNo'].value !== true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['policyNo'].value !== true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['productDesc'].value !== true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['lossDateFrom'].value !== true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['noticeDateFrom'].value !== true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['statusDesc'].value !== true ||
      this.customerClaimInfoHeaderMultiCheckArray.controls['issuedBy'].value !== true ||

      this.customerRenewalInfoHeaderMultiCheckArray.controls['policyNo'].value !== true ||
      this.customerRenewalInfoHeaderMultiCheckArray.controls['clientName'].value !== true ||
      this.customerRenewalInfoHeaderMultiCheckArray.controls['productDesc'].value !== true ||
      this.customerRenewalInfoHeaderMultiCheckArray.controls['expiryDate'].value !== true ||
      this.customerRenewalInfoHeaderMultiCheckArray.controls['premium'].value !== true ||
      this.customerRenewalInfoHeaderMultiCheckArray.controls['statusDesc'].value !== true

    ) {

      this.customerQuotInfoHeaderMultiCheckArray.controls['clientFullName'].setValue(true);
      this.customerQuotInfoHeaderMultiCheckArray.controls['quoteNo'].setValue(true);
      this.customerQuotInfoHeaderMultiCheckArray.controls['productDesc'].setValue(true);
      this.customerQuotInfoHeaderMultiCheckArray.controls['statusDesc'].setValue(true);
      this.customerQuotInfoHeaderMultiCheckArray.controls['issueDate'].setValue(true);
      this.customerQuotInfoHeaderMultiCheckArray.controls['issuedBy'].setValue(true);

      this.customerPolicyInfoHeaderMultiCheckArray.controls['clientFullName'].setValue(true);
      this.customerPolicyInfoHeaderMultiCheckArray.controls['policyNo'].setValue(true);
      this.customerPolicyInfoHeaderMultiCheckArray.controls['endtReasonCodeDesc'].setValue(true);
      this.customerPolicyInfoHeaderMultiCheckArray.controls['productDesc'].setValue(true);
      this.customerPolicyInfoHeaderMultiCheckArray.controls['statusDesc'].setValue(true);
      this.customerPolicyInfoHeaderMultiCheckArray.controls['issueDate'].setValue(true);
      this.customerPolicyInfoHeaderMultiCheckArray.controls['expiryDate'].setValue(true);
      this.customerPolicyInfoHeaderMultiCheckArray.controls['planTypeDesc'].setValue(true);
      this.customerPolicyInfoHeaderMultiCheckArray.controls['issuedBy'].setValue(true);


      this.customerClaimInfoHeaderMultiCheckArray.controls['clientFullName'].setValue(true);
      this.customerClaimInfoHeaderMultiCheckArray.controls['claimNo'].setValue(true);
      this.customerClaimInfoHeaderMultiCheckArray.controls['policyNo'].setValue(true);
      this.customerClaimInfoHeaderMultiCheckArray.controls['productDesc'].setValue(true);
      this.customerClaimInfoHeaderMultiCheckArray.controls['lossDateFrom'].setValue(true);
      this.customerClaimInfoHeaderMultiCheckArray.controls['noticeDateFrom'].setValue(true);
      this.customerClaimInfoHeaderMultiCheckArray.controls['statusDesc'].setValue(true);
      this.customerClaimInfoHeaderMultiCheckArray.controls['issuedBy'].setValue(true);

      this.customerRenewalInfoHeaderMultiCheckArray.controls['policyNo'].setValue(true);
      this.customerRenewalInfoHeaderMultiCheckArray.controls['clientName'].setValue(true);
      this.customerRenewalInfoHeaderMultiCheckArray.controls['productDesc'].setValue(true);
      this.customerRenewalInfoHeaderMultiCheckArray.controls['expiryDate'].setValue(true);
      this.customerRenewalInfoHeaderMultiCheckArray.controls['premium'].setValue(true);
      this.customerRenewalInfoHeaderMultiCheckArray.controls['statusDesc'].setValue(true);
    }

  }


  showTabContent(event, onPageLoad?: boolean, showContent?: string) {
    if (onPageLoad && showContent) {
      let activityDataTable = document.getElementsByClassName("activityDataTable")
      for (let i = 0; i < activityDataTable.length; i++) {
        if ((<HTMLElement>activityDataTable[i])) {
          (<HTMLElement>activityDataTable[i]).style.display = "none";
        }
      }
      document.getElementById(showContent).style.display = "block";
    } else if (onPageLoad) {
      let content = 'content1';
      document.getElementById(content).style.display = "block";
    } else {
      this.searchlDetailsFormGroup.setValue(this.enquiryinfoModel.getEnquiryInfoModel().value);
      var target = event.target || event.srcElement || event.currentTarget;
      if (event.target && event.target.attributes.id) target = event.target;
      else if (event.srcElement && event.srcElement.attributes.id) target = event.srcElement;
      else if (event.currentTarget && event.currentTarget.attributes.id) target = event.currentTarget;
      var value = target.attributes.id.nodeValue;
      let content = 'content' + value.substr(value.length - 1, 1);
      //let content = 'content1'
      let activityDataTable = document.getElementsByClassName("activityDataTable");
      for (let i = 0; i < activityDataTable.length; i++) {
        (<HTMLElement>activityDataTable[i]).style.display = "none";
      }

      document.getElementById(content).style.display = "block";
    }

  }
  getRenewalPoliciesData() {
    this.renewalActivityList = [];
    let renewalPolicies;
    this.renewalPoliciesMaxRecords = 5;
    this.renewalFilterJSON['policiesExpiringInDays'] = this.renewalPoliciesExpiringInDays;
    this.renewalFilterJSON['startIndex'] = this.renewalPoliciesStartIndex;
    this.renewalFilterJSON['maxRecords'] = this.renewalPoliciesMaxRecords;
    renewalPolicies = this.enquiryServices.getRenewalPoliciesData(this.renewalFilterJSON);
    renewalPolicies.subscribe(
      (renewalPolicies) => {
        if (renewalPolicies.error !== null && renewalPolicies.error !== undefined && renewalPolicies.error.length >= 1) {
          this.errmsg = true;
          this.errors = [];
          for (let i = 1; i < renewalPolicies.error.length; i++) {
            this.errors.push({ 'errCode': renewalPolicies.error[i].errCode, 'errDesc': renewalPolicies.error[i].errDesc });
          }
          this.config.setLoadingSub('no');
        } else {
          this.renewalDataListForSearch = renewalPolicies;
          this.renewalActivityList.push(...renewalPolicies);
          this.isShowTableFlag = true;
          this.config.setLoadingSub('no');
        }
      }
    );
  }
  ngOnDestroy() {
    this.filtersub.unsubscribe();
    this.config.resetfilterModel();

  }


  @HostListener('window:resize')
  private changePageWidth() {
    this.pageWidth = window.innerWidth;
  }

}

