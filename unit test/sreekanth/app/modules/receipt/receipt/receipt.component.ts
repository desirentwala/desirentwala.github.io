import { AfterContentInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { environment } from '../../../../environments/environment';
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
import { DocumentInfo } from '../../common/models/documentInfo.model';
import { ReceiptService } from '../services/receipt.service';


export class TableInfo {
  mapping: string;
  header: string;
  showColumn: boolean;
  className: string;
}
@Component({
  selector: 'receipt',
  templateUrl: './receipt.template.html',
  providers: [ReceiptService]
})
export class ReceiptComponent implements OnInit, AfterContentInit, OnDestroy {
  clientCode;
  productCode;
  policyNo;
  agentCode;
  policyAcntDetailsInfo: any;
  receptViewmodal: boolean = false;
  disableShowMoreButton: boolean = false;
  receiptServices: ReceiptService;
  showErrorFlag: boolean = false;
  isActionFlag: boolean = true;
  isShowTableFlag: boolean;
  enableFilterBtn: boolean = false;
  filterModel;
  customerPolicyInfoHeaderMultiCheckArray: FormGroup;
  searchlDetailsFormGroup: FormGroup;
  existingTooltip: any = '';
  enquiryServices: EnquiryServices;
  tableDataListForSearch = [];
  enquiryServicesImp: EnquiryServicesImp;
  enquiryinfoModel: EnquiryInfoModel;
  documentInfoModel: DocumentInfo;
  policyEnquiryInput: Array<any> = [];
  startIndex = '0';
  maxRecords = '5';
  Ref;
  sliceIndex: any;
  logger: Logger;
  utils: UtilsService;
  policyTableDetails: TableInfo[] = [];
  public translated: boolean = false;
  sort: any;
  errors = [];
  placeHolder: string = 'NCPBtn.search';
  hideFilterModal: boolean = true;
  @ViewChild('customerEditView') customerEditView;
  errmsg: Boolean = false;

  policyActivityHeader = ['NCPLabel.policyNo', 'NCPLabel.clientName', 'NCPLabel.product', 'NCPLabel.endtReason', 'NCPLabel.Premium'];
  policyActivityMapping = ['policyNo', 'clientName', 'productDesc', 'endtReason', 'premium'];
  policyActivityIconsClassNames = ['', '', '', '', '', 'fa fa-gear showPopover indexre'];
  _policyActivityHeader = [];
  _policyActivityMapping = [];
  _policyActivityIconsClassNames = [];
  tableDetails: any[];
  columnsList: any[];
  searchId: string;
  policyInfoHeaderMultiCheckArray = [];
  noPolicyEnquiryInputFlag = false;
  patchedPolicyMaxRecordsValue;
  viewMoreClicked = false;
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
  quoteModelInstance;

  constructor(_quotEnquiryFormGroup: FormBuilder, public config: ConfigService, _enquiryServicesImp: EnquiryServicesImp,
    enquiryServices: EnquiryServices,public translate: TranslateService, receiptServices: ReceiptService, _logger: Logger, public changeRef: ChangeDetectorRef,
    _dateFormatService: DateFormatService, _dateduration: DateDuration,
    _utils: UtilsService, shared: SharedService) {
    this.utils = _utils;
    this.Ref = changeRef;
    this._policyActivityHeader.push(...this.policyActivityHeader);
    this._policyActivityMapping.push(...this.policyActivityMapping);
    this._policyActivityIconsClassNames.push(...this.policyActivityIconsClassNames);
    this.filterModel = this.config.getfilterModel();
    this.logger = _logger;
    this.enquiryinfoModel = new EnquiryInfoModel(_quotEnquiryFormGroup);
    this.enquiryServices = enquiryServices;
    this.receiptServices = receiptServices;
    this.enquiryServicesImp = _enquiryServicesImp;
    this.dateFormatService = _dateFormatService;
    this.dateDuration = _dateduration;

  }

  ngOnInit() {
    this.config.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
          this.translate.use(this.config.currentLangName);
      }
  });
    let tableLength = this.policyActivityMapping.length;
    this.columnsList = [];
    for (let i = 0; i < tableLength; i++) {
      this.columnsList.push({ header: this.policyActivityHeader[i], mapping: this.policyActivityMapping[i], showColumn: true, className: this.policyActivityIconsClassNames[i] });
    }
    this.policyTableDetails = this.columnsList;
    this.sort = {
      column: 'NAME',
      descending: false
    };
    this.config.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.placeHolder = this.utils.getTranslated(this.placeHolder);
        this.translated = true;
      }
    });
    let project = environment.project;
    if (project == 'aw') {
      this.hideFilterModal = false;
    }

    this.customerPolicyInfoHeaderMultiCheckArray = this.enquiryinfoModel.getReceiptInfoHeader();
    this.searchlDetailsFormGroup = this.enquiryinfoModel.getEnquiryInfoModel();
    this.searchlDetailsFormGroup.controls['agentCode'].valueChanges.subscribe((agentCode) => {
      this.agentCode = agentCode;
      if (agentCode || this.policyNo || this.productCode || this.clientCode) {
        this.enableFilterBtn = true;
      }
      else {
        this.enableFilterBtn = false;
      }
    });
    this.searchlDetailsFormGroup.controls['policyNo'].valueChanges.subscribe((policyNo) => {
      this.policyNo = policyNo;
      if (policyNo || this.agentCode || this.productCode || this.clientCode) {
        this.enableFilterBtn = true;
      }
      else {
        this.enableFilterBtn = false;
      }
    });
    this.searchlDetailsFormGroup.controls['productCode'].valueChanges.subscribe((productCode) => {
      this.productCode = productCode;
      if (productCode || this.agentCode || this.policyNo || this.clientCode) {
        this.enableFilterBtn = true;
      }
      else {
        this.enableFilterBtn = false;
      }
    });
    this.searchlDetailsFormGroup.controls['clientCode'].valueChanges.subscribe((clientCode) => {
      this.clientCode = clientCode;
      if (clientCode || this.productCode || this.agentCode || this.policyNo) {
        this.enableFilterBtn = true;
      }
      else {
        this.enableFilterBtn = false;
      }
    });
    this.dateDelimiter = this.config.get('dateDelimiter');
    this.dateFormat = this.config.get('dateFormat');
    this.dateDelimiterIndex;
    this.todayDate = new Date();
    this.todayDate.setHours(0, 0, 0, 0);
    this.todayString = this.dateFormatService.formatDate(this.todayDate);
    this.searchlDetailsFormGroup.get('inceptionDate').valueChanges.subscribe(() => {
      this.setNCPDatePickerToDateOptions();
    });
    this.searchlDetailsFormGroup.get('expiryDate').valueChanges.subscribe(() => {
      this.setNCPDatePickerToDateOptions();
    });
    this.Ref.markForCheck();
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
  getInfo(filterModel) {
    this.getPolicyInfo();
    this.config.resetfilterModel();
    this.filterModel = this.config.getfilterModel();
    this.changeRef.markForCheck();
  }

  getPolicyInfo() {
    let policyEnquiryInput = [];
    let sliceIndex: any;
    let startIndex = '' + (5 + Number(this.startIndex));
    sliceIndex = startIndex;
    let policyOutput = this.receiptServices.getPolicyList(this.filterModel);
    policyOutput.subscribe(
      (policyEnquiryInfodataVal) => {
        if (policyEnquiryInfodataVal.error !== null && policyEnquiryInfodataVal.error !== undefined && policyEnquiryInfodataVal.error.length >= 1) {
          this.noPolicyEnquiryInputFlag = true;
          this.logger.error('getPolicyInfo()===>' + policyEnquiryInfodataVal.error);
          this.config.setLoadingSub('no');
        } else {
          if (policyEnquiryInfodataVal.length < this.searchlDetailsFormGroup.controls['maxRecords'].value) {
            this.noPolicyEnquiryInputFlag = true;
          } else {
            this.noPolicyEnquiryInputFlag = false;
          }
          this.tableDataListForSearch = policyEnquiryInfodataVal;
          policyEnquiryInput = policyEnquiryInfodataVal;
          this.policyEnquiryInput = policyEnquiryInput.splice(0, sliceIndex);
          this.sliceIndex = 5 + Number(sliceIndex);
          this.disableShowMoreButton = false;
          this.Ref.markForCheck();
          this.config.setLoadingSub('no');
        }
      },
      (error) => {
        this.logger.error(error);
        this.config.setLoadingSub('no');
      });

  }

  doViewMore() {
    if (this.sliceIndex >= this.tableDataListForSearch.length) {
      this.disableShowMoreButton = true;
    }
    let showMoreList = this.tableDataListForSearch;
    this.policyEnquiryInput = showMoreList.slice(0, this.sliceIndex);
    this.sliceIndex = 5 + Number(this.sliceIndex);
  }



  searchCustomerModel() {
    this.policyEnquirySearch();
  }

  policyEnquirySearch() {
    let productCode = this.searchlDetailsFormGroup.get('productCode').value;
    this.searchlDetailsFormGroup.controls['product'].setValue(productCode.code);
    let policyOutput = this.receiptServices.getPolicyList(this.searchlDetailsFormGroup.value);
    this.config.setLoadingSub('no');
    policyOutput.subscribe(
      (policyEnquiryInfodataVal) => {
        if (policyEnquiryInfodataVal.error !== null && policyEnquiryInfodataVal.error !== undefined && policyEnquiryInfodataVal.error.length >= 1) {
          this.noPolicyEnquiryInputFlag = true;
          this.logger.error('getPolicyInfo()===>' + policyEnquiryInfodataVal.error);
          this.config.setLoadingSub('no');
        } else {
          if (policyEnquiryInfodataVal.length < this.searchlDetailsFormGroup.controls['maxRecords'].value) {
            this.noPolicyEnquiryInputFlag = true;
          } else {
            this.noPolicyEnquiryInputFlag = false;
          }
          this.policyEnquiryInput = policyEnquiryInfodataVal;
          this.Ref.markForCheck();
          this.config.setLoadingSub('no');
        }
      },
      (error) => {
        this.logger.error(error);
        this.config.setLoadingSub('no');
      });
  }
  resetCustomer() {
    this.getInfo(this.filterModel);
    this.clearCustomerSearchModel();
  }

  clearCustomerSearchModel() {
    this.searchlDetailsFormGroup.reset();
    // this.searchlDetailsFormGroup = this.enquiryinfoModel.getEnquiryInfoModel();
    this.Ref.markForCheck();
  }

  ngOnDestroy() {
    this.filtersub.unsubscribe();
    this.config.resetfilterModel();

  }
  viewReceiptDocument(object_row) {
    let documentInfo: Array<any> = [{
      'documentId': '',
      'copyTypeCd': '',
      'dispatchType': 'PRINT',
      'requestType': 'ONLINE',
      'isDocumentSelected': 'TRUE',
      'documentDesc': 'Receipt Template',
      'key': 'RECTTEMPL'
    }];
    let inputObject = {
      documentInfo,
      'agentID': '',
      'source': object_row.source,
      'reference': object_row.targetReference,
      'documentId': '',
      'dispatchType': 'PREVIEW'
    };
    this.receiptServices.getDocumentInfo(inputObject);
  }
  viewReceiptModal(inputObjectRow) {
    this.receptViewmodal = true;
    this.showErrorFlag = false;
    this.policyAcntDetailsInfo = inputObjectRow.policyAcntDetailsInfo;
    if (this.policyAcntDetailsInfo === null || this.policyAcntDetailsInfo === undefined) {
      this.showErrorFlag = true;
    }
  }
}

