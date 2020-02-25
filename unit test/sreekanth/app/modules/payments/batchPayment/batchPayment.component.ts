import { AfterContentInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ConfigService } from '../../../core/services/config.service';
import { SharedService } from '../../../core/shared/shared.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { DateDuration } from '../../../core/ui-components/ncp-date-picker/index';
import { DateFormatService } from '../../../core/ui-components/ncp-date-picker/index';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { BreadCrumbService } from '../../common';
import { EnquiryInfoModel } from '../../common/enquiry/models/enquiryInfo.model';
import { EnquiryServices } from '../../common/enquiry/services/enquiry.services';
import { EnquiryServicesImp } from '../../common/enquiry/services/enquiry.servicesImpl';
import { DashBoardService } from '../../common/services/dashboard.service';
import { PaymentService } from '../../../core/ui-components/payment/payment.service';
import { PaymentEnquiryInfoModel } from '../models/paymentEnquiryInfoModel';
import { FactoryProvider } from '../../../core/factory/factoryprovider';
import { ProductFactory } from '../../../core/factory/productfactory';
import { TranslateService } from '@adapters/packageAdapter';

export class TableInfo {
  mapping: string;
  header: string;
  showColumn: boolean;
  className: string;
}
@Component({
  selector: 'batchPayment',
  templateUrl: './batchPayment.template.html',
})
export class BatchPaymentComponent implements OnInit, AfterContentInit, OnDestroy {
  doViewMoreFlag: boolean = false;
  selectedPolicyList: Array<any> = [];
  batchPaymentFormGroup: FormGroup;
  batchPaymentFilterFormGroup: FormGroup;
  batchSettlementInfoFormGroup: FormGroup;
  disableShowMoreButton: boolean = false;
  policiesDataListForSearch: any;
  amountTypeIDList = [{ "value": "Net", "display": "Net" }, { "value": "Gross", "display": "Gross" }];
  _dashboardService: DashBoardService;
  startIndex: number = 0;
  filterJSON: any = {};
  sliceIndex: any;
  maxRecords: number = 5;
  maxRecordsValue: number = 5;
  totalPayAmount: any;
  setThroughFilter: boolean;
  filtersub;
  tableDetails: any[];
  columnsList: any[];
  isShowTableFlag: boolean;
  filterModel;
  customerQuotInfoHeaderMultiCheckArray: FormGroup;
  customerPolicyInfoHeaderMultiCheckArray: FormGroup;
  customerClaimInfoHeaderMultiCheckArray: FormGroup;
  searchlDetailsFormGroup: FormGroup;
  enquiryServices: EnquiryServices;
  enquiryServicesImp: EnquiryServicesImp;
  enquiryinfoModel: EnquiryInfoModel;
  quoteEnquiryInput;
  policyEnquiryInput;
  claimEnquiryInput;
  Ref;
  logger: Logger;
  utils: UtilsService;
  public translated: boolean = false;
  sort: any;
  errors = [];
  placeHolder: string = 'NCPBtn.search';
  hideFilterModal: boolean = true;
  @ViewChild('paymentSuccessModal') paymentSuccessModal;
  @ViewChild("customerEditView") customerEditView;
  errmsg: Boolean = false;
  batchPaymentHeader = ['NCPLabel.dueDate', 'NCPLabel.noOfDueDays', 'NCPLabel.policyNo', 'NCPLabel.clientName', 'NCPLabel.product', 'NCPLabel.grossAmt', 'NCPLabel.netAmt', 'NCPLabel.payAmount'];
  batchPaymentMapping = ['dueDate', 'noOfDueDays', 'policyNo', 'clientName', 'productDesc', 'grossAmt', 'netAmt', 'amount'];
  batchPaymentIconsClassNames = ['', '', '', '', '', '', 'fa fa-gear showPopover indexre'];
  batchPaymentList: Array<any> = [];
  _batchPaymentHeader = [];
  _batchPaymentMapping = [];
  _batchPaymentIconsClassNames = [];
  searchId: string;
  paymentInfo: any;
  paymentEnquiryInfo: any;
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
  public factoryInstance: ProductFactory;
  constructor(public _quotEnquiryFormGroup: FormBuilder, public config: ConfigService, _enquiryServicesImp: EnquiryServicesImp,
    enquiryServices: EnquiryServices, _logger: Logger, public changeRef: ChangeDetectorRef,
    _dateFormatService: DateFormatService, _dateduration: DateDuration,
    public breadcrumbService: BreadCrumbService, _utils: UtilsService, shared: SharedService, public paymentService: PaymentService,public translate: TranslateService) {
    this.utils = _utils;
    this.Ref = changeRef;
    this._batchPaymentHeader.push(...this.batchPaymentHeader);
    this._batchPaymentMapping.push(...this.batchPaymentMapping);
    this._batchPaymentIconsClassNames.push(...this.batchPaymentIconsClassNames);
    this.filterModel = this.config.getfilterModel();
    this.logger = _logger;
    this.factoryInstance = FactoryProvider.getFactoryInstance(this.config, this.logger, this._quotEnquiryFormGroup);
    let policyModelInstance = this.factoryInstance.getPolicyModelInstance();
    this.paymentEnquiryInfo = policyModelInstance.getEnquiryPaymentModel();

    this.enquiryServices = enquiryServices;
    this.enquiryServicesImp = _enquiryServicesImp;
    this.getPoliciesData();
  }


  ngOnInit() {
    this.config.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
          this.translate.use(this.config.currentLangName);
      }
  });
    let tableLength = this.batchPaymentMapping.length;
    this.columnsList = [];
    for (let i = 0; i < tableLength; i++) {
      this.columnsList.push({ header: this.batchPaymentHeader[i], mapping: this.batchPaymentMapping[i], showColumn: true, className: this.batchPaymentIconsClassNames[i] });
    }
    this.tableDetails = this.columnsList;
    this.batchPaymentFormGroup = this.paymentEnquiryInfo.getBatchInfoModel();
    this.batchPaymentFilterFormGroup = this.paymentEnquiryInfo.getBatchFilterInfoModel();
    this.batchSettlementInfoFormGroup = this.paymentEnquiryInfo.getBatchSettlementInfoModel();
    for (let i = 0; i < this.batchPaymentList.length; i++) {
      this.batchPaymentList[i].amount = this.batchPaymentList[i].grossAmt;
    }
    this.batchPaymentFormGroup.get('amountTypeCode').patchValue('Gross');
    this.batchPaymentFormGroup.get('amountTypeCode').updateValueAndValidity();
    this.batchPaymentFormGroup.get('amountTypeDesc').patchValue('Gross');
    this.batchPaymentFormGroup.get('amountTypeDesc').updateValueAndValidity();
    this.sort = {
      column: 'NAME',
      descending: false
    };
    this.changeSorting('noOfDueDays');
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

  ngAfterContentInit() {
    this.paymentService.initPostEmitter.subscribe((data) => {
      if (data) {
        this.batchPaymentFormGroup.controls['paymentInfo'].patchValue(data);
        this.batchPaymentFormGroup.controls['paymentInfo'].updateValueAndValidity();

        if (data.status === 'NO') {
          this.paymentService.initPaymentEmitter.emit({ 'isPayment': false });
        } else if (data.status === 'YES') {
          this.paymentSuccessModal.open();
          // let batchPaymentList = this.getBatchSettlementInfo(this.selectedPolicyList);
          let batchPaymentList = this.paymentService.getBatchSettleMentInfoFromLocalstorage();
          this.doPolicyPost(batchPaymentList);
        }
      }
      //this.doPostAndSettlement(this.formGroup.getRawValue());
    });
    this.paymentService.initRePostEmitter.subscribe((data) => {
      if (data) {
        let batchPaymentList = this.paymentService.getBatchSettleMentInfoFromLocalstorage();
        this.doPolicyPost(batchPaymentList);
      }
    });

    this.filtersub = this.config.loggerSub.subscribe((data) => {
      if (data === 'filterSet') {
        this.filterModel = this.config.getfilterModel();
        this.setThroughFilter = true;
      }
    });
  }
  doPayment() {
    this.selectedPolicyList = [];
    this.getSelectedPolicyObjects();
    this.batchSettlementInfoFormGroup = this.getBatchSettlementInfo(this.selectedPolicyList);
    this.paymentInfo = this.getPaymentInfoData()
    this.paymentService.paymentPushedData.emit(this.paymentInfo);
  }
  public getPaymentInfoData() {
    let totalAmount = this.totalPayAmount;
    return [
      {
        'isGrossAndNet': false
      },
      {
        'totalAmount': totalAmount
      },
      {
        'currency': this.config.get('currencyCode')
      },
      {
        'showPGSelectionModal': true
      }
    ];

  }
  getPoliciesData() {
    this.batchPaymentList = [];
    let policies;
    this.maxRecords = 5;
    this.filterJSON['startIndex'] = this.startIndex;
    this.filterJSON['maxRecords'] = this.maxRecords;
    //policies = this._dashboardService.getPoliciesData(this.filterJSON);
    // policies.subscribe(
    //   (data) => {
    //     if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
    //       this.errmsg = true;
    //       this.errors = [];
    //       for (let i = 1; i < data.error.length; i++) {
    //         this.errors.push({ 'errCode': data.error[i].errCode, 'errDesc': data.error[i].errDesc });
    //       }
    //       this.config.setLoadingSub('no');
    //     } else {
    //       this.policiesDataListForSearch = data;
    //       this.batchPaymentList.push(...data);
    //       this.isShowTableFlag = true;
    //       this.config.setLoadingSub('no');
    //     }
    //   }
    // );

  }
  ngOnDestroy() {
    this.filtersub.unsubscribe();
    this.config.resetfilterModel();
    this.paymentService.initPostEmitter.observers.pop();

  }
  public doActionClickRow(object, amountTypeCode, i) {
    if (amountTypeCode === 'Net') {
      object.isCommision = false;
      object.amount = object.netAmt;
    }
    if (amountTypeCode === 'Gross') {
      object.isCommision = true;
      object.amount = object.grossAmt;
    }
  }
  selectAllRow(batchPaymentList) {
    if (this.batchPaymentFormGroup.get('selectAllOption').value) {
      this.totalPayAmount = 0;
      for (let i = 0; i < batchPaymentList.length; i++) {
        batchPaymentList[i].isAmtSelected = true;
        this.batchPaymentFormGroup.get('isAmtSelected').patchValue(true);
        this.batchPaymentFormGroup.get('isAmtSelected').updateValueAndValidity();
        this.totalPayAmount = parseFloat(this.totalPayAmount) + parseFloat(batchPaymentList[i].amount);
        this.totalPayAmount = this.totalPayAmount.toFixed(2);
      }
      this.batchPaymentList = batchPaymentList;
    } else if (!this.batchPaymentFormGroup.get('selectAllOption').value) {
      for (let i = 0; i < batchPaymentList.length; i++) {
        batchPaymentList[i].isAmtSelected = false;
        this.batchPaymentFormGroup.get('isAmtSelected').patchValue(false);
        this.batchPaymentFormGroup.get('isAmtSelected').updateValueAndValidity();
      }
      this.batchPaymentList = batchPaymentList;
      this.totalPayAmount = 0;
    }
  }
  selectRow(policyNo, endtNo, batchPaymentList) {
    let allDocSelectedFlag: boolean = false;
    let flagCount: number = 0;
    if (this.batchPaymentFormGroup.get('isAmtSelected').value) {
      for (let i = 0; i < batchPaymentList.length; i++) {
        if (batchPaymentList[i].policyNo === policyNo && batchPaymentList[i].endtNo === endtNo) {
          batchPaymentList[i].isAmtSelected = true;
          this.totalPayAmount = parseFloat(this.totalPayAmount) + parseFloat(batchPaymentList[i].amount);
          this.totalPayAmount = this.totalPayAmount.toFixed(2);
        }
      }
      this.batchPaymentList = batchPaymentList;
      for (let i = 0; i < this.batchPaymentList.length; i++) {
        if (this.batchPaymentList[i].isAmtSelected === true) {
          allDocSelectedFlag = true;
          flagCount += 1;
        }
        else {
          allDocSelectedFlag = false;
          flagCount -= 1;
        };
      }
      if (allDocSelectedFlag && (flagCount === this.batchPaymentList.length)) {
        this.batchPaymentFormGroup.get('selectAllOption').patchValue(true);
        this.batchPaymentFormGroup.get('selectAllOption').updateValueAndValidity();
      }
    } else if (!this.batchPaymentFormGroup.get('isAmtSelected').value) {
      if (this.batchPaymentFormGroup.get('selectAllOption').value) {
        this.batchPaymentFormGroup.get('selectAllOption').patchValue(false);
        this.batchPaymentFormGroup.get('selectAllOption').updateValueAndValidity();
      }
      for (let i = 0; i < batchPaymentList.length; i++) {
        if (batchPaymentList[i].policyNo === policyNo && batchPaymentList[i].endtNo === endtNo) {
          this.totalPayAmount = this.totalPayAmount - parseFloat(batchPaymentList[i].amount);
          batchPaymentList[i].isAmtSelected = false;
          allDocSelectedFlag = false;
          flagCount -= 1;
        }
      }
      this.totalPayAmount = this.totalPayAmount.toFixed(2);
      this.batchPaymentList = batchPaymentList;
    }
  }
  doPolicyPost(postInputData) {
    let policies = this.paymentService.doUpdatePostedPoliciesWithPaymentDetails(postInputData);
    policies.subscribe(
      (data) => {
        if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
          this.errmsg = true;
          this.errors = [];
          for (let i = 1; i < data.error.length; i++) {
            this.errors.push({ 'errCode': data.error[i].errCode, 'errDesc': data.error[i].errDesc });
          }
          this.config.setLoadingSub('no');
        } else {
          this.policiesDataListForSearch = data;
          this.batchPaymentList.push(...data);
          this.isShowTableFlag = true;
          this.config.setLoadingSub('no');
        }
      }
    );
  }
  batchPaymentSearchModel() {
    this.totalPayAmount = 0;
    this.batchPaymentFormGroup.get('selectAllOption').setValue(null);
    this.batchPaymentFormGroup.get('isAmtSelected').patchValue(false);
    let batchPaymentList = [];
    let sliceIndex: any;
    let startIndex = "" + (5 + Number(this.startIndex));
    sliceIndex = startIndex;
    let maxRecords = 5;
    let productCode = this.batchPaymentFilterFormGroup.get('productCode').value;
    this.batchPaymentFilterFormGroup.controls['product'].setValue(productCode.code);
    this.batchPaymentFilterFormGroup.controls['startRow'].setValue(this.startIndex);
    if (this.doViewMoreFlag) {
      this.batchPaymentFilterFormGroup.controls['size'].setValue(this.maxRecordsValue.toString());
    } else {
      this.batchPaymentFilterFormGroup.controls['size'].setValue(maxRecords);
    }
    let policies = this.paymentService.getBatchPaymentPolicyList(this.batchPaymentFilterFormGroup.value);
    policies.subscribe(
      (data) => {
        if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
          this.errmsg = true;
          this.errors = [];
          for (let i = 1; i < data.error.length; i++) {
            this.errors.push({ 'errCode': data.error[i].errCode, 'errDesc': data.error[i].errDesc });
          }
          this.config.setLoadingSub('no');
        } else {
          this.policiesDataListForSearch = data;
          batchPaymentList.push(...data);
          this.batchPaymentList = batchPaymentList;
          // this.sliceIndex = 5 + Number(sliceIndex);
          this.disableShowMoreButton = false;
          this.isShowTableFlag = true;
          this.doViewMoreFlag = false;
          this.config.setLoadingSub('no');
        }
      }
    );

  }

  doViewMore() {
    // if (this.sliceIndex >= this.policiesDataListForSearch.length) {
    //   this.disableShowMoreButton = true;
    // }
    // let showMoreList = this.policiesDataListForSearch;
    // this.batchPaymentList = showMoreList.slice(0, this.sliceIndex);
    // this.sliceIndex = 5 + Number(this.sliceIndex);
    this.doViewMoreFlag = true;
    this.maxRecordsValue = parseInt(this.batchPaymentFilterFormGroup.controls['size'].value);
    this.maxRecordsValue += 5;
    this.batchPaymentSearchModel();
  }

  clearBatchPaymentSearchModel() {
    //this.batchPaymentFilterFormGroup.reset();
    this.batchPaymentFilterFormGroup.get('policyNo').patchValue('');
    this.batchPaymentFilterFormGroup.get('productCode').patchValue('');
    this.batchPaymentFilterFormGroup.get('dueFromDate').patchValue('');
    this.batchPaymentFilterFormGroup.get('dueToDate').patchValue('');
  }
  getSelectedPolicyObjects() {
    for (let i = 0; i < this.batchPaymentList.length; i++) {
      if (this.batchPaymentList[i].isAmtSelected) {
        this.selectedPolicyList.push(this.batchPaymentList[i]);
      }
    }
    return this.selectedPolicyList;
  }

  getBatchSettlementInfo(selectedPolicyList) {
    this.batchSettlementInfoFormGroup.controls['policyEndorsements'].reset();
    this.batchSettlementInfoFormGroup.controls['currency'].setValue(this.config.get('currencyCode'));
    this.batchSettlementInfoFormGroup.controls['amount'].setValue(this.totalPayAmount);
    this.batchSettlementInfoFormGroup.controls['accountHolder'].setValue(this.config.getCustom('user_name'));
    this.batchSettlementInfoFormGroup.controls['paymentInfo'].get('amount').setValue(this.totalPayAmount);
    let removeTempFormGroup: any = this.batchSettlementInfoFormGroup;
    if (removeTempFormGroup.controls['policyEndorsements'].length > 0) {
      for (let j = 0; j <= removeTempFormGroup.controls['policyEndorsements'].length; j++) {
        removeTempFormGroup.controls['policyEndorsements'].removeAt(j);
      }
    }
    this.batchSettlementInfoFormGroup = removeTempFormGroup;
    let tempFormGroup: any = this.batchSettlementInfoFormGroup.get('policyEndorsements');
    selectedPolicyList.forEach(element => {
      tempFormGroup.push(this.paymentEnquiryInfo.getPolicyEndorsementsInfoModel());
    });
    this.batchSettlementInfoFormGroup.controls['policyEndorsements'].patchValue(selectedPolicyList);
    this.batchSettlementInfoFormGroup.controls['policyEndorsements'].updateValueAndValidity();
    this.config.setCustom('batchSettlementInfoFormGroup', this.batchSettlementInfoFormGroup);
    return this.batchSettlementInfoFormGroup;
  }
}

