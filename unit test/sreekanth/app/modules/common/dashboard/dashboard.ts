import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@adapters/packageAdapter';
import { LocalStorageService } from '@adapters/packageAdapter';
import { DashboardComponent } from '@adapters/packageAdapter';

import { ConfigService } from '../../../core/services/config.service';
import { SharedService } from '../../../core/shared/shared.service';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { DashBoardService } from '../../../modules/common/services/dashboard.service';
import { QuotService } from '../../transaction/services/quote.service';
import { BreadCrumbService } from '../breadCrumb/index';
import { ReportService } from '../reports/services/report.service';
import { DateDuration } from './../../../core/ui-components/ncp-date-picker/pipes/date.duration';
import { NewsService } from './../../news-announcement/services/news.service';
import { EnquiryInfoModel } from './../enquiry/models/enquiryInfo.model';
import { TranslateService } from '@adapters/packageAdapter';


export class TableInfo {
  mapping: string;
  header: string;
  showColumn: boolean;
  className: string;
}

@Component({
  selector: 'dash-board',
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit, AfterContentInit {
  @ViewChild("thirdModal") thirdModal;
  @ViewChild("viewNewsModel") viewNewsModel;
  @ViewChild("customerEditView") customerEditView;
  @ViewChild(DashboardComponent) dashboard: DashboardComponent;
  pieView = [500, 250];
  errmsg: boolean;
  dataSingle = [];
  dataCard = [];
  dataMulti = [];
  searchErrmsg: boolean = false;
  searchlDetailsFormGroup: FormGroup;
  NCPDatePickerToDateOptions = {
    todayBtnTxt: 'Today',
    alignSelectorRight: true,
    indicateInvalidDate: true,
    showDateFormatPlaceholder: true,
    disabledUntil: {}
  };

  NCPDatePickerNormalOptions = {
    todayBtnTxt: 'Today',
    firstDayOfWeek: 'mo',
    alignSelectorRight: true,
    inline: true,
    indicateInvalidDate: true,
    showDateFormatPlaceholder: true
  };
  renewalSearchlDetailsFormGroup: FormGroup;
  fromDate;
  toDate;
  currentActivityHeader = ['NCPLabel.reference', 'NCPLabel.customer', 'NCPLabel.product', 'NCPLabel.adate', 'NCPLabel.status', 'NCPLabel.issuedBy'];
  currentActivityMapping = ['referenceNo', 'clientFullName', 'productDesc', 'initiatedDate', 'statusDesc', 'operatorID'];
  currentActivityList: Array<any> = [];
  currentActivityIconsClassNames = ['', '', '', '', 'fa fa-gear showPopover indexre', '', ''];
  currentActivityDataClickId = ['referenceId', '', '', '', '', '', ''];
  checkBoxItemLabel = ['NCPLabel.customer', 'NCPLabel.reference', 'NCPLabel.product', 'NCPLabel.adate', 'NCPLabel.status', 'NCPLabel.issuedBy'];
  renewalActivityHeader = ['NCPLabel.policyNo', 'NCPLabel.customer', 'NCPLabel.product', 'NCPLabel.expiryDate', 'NCPLabel.Premium', 'NCPLabel.status'];
  renewalActivityMapping = ['policyNo', 'clientName', 'productDesc', 'expiryDate', 'premium', 'statusDesc'];
  renewalActivityList: Array<any> = [];
  renewalActivityIconsClassNames = ['', '', '', '', 'fa fa-gear showPopover indexre', ''];
  activityType = 'CA';
  newsService;
  errors = [];
  _currentActivityHeader: any = [];
  _currentActivityMapping: any = [];
  _currentActivityIconsClassNames: any = [];
  _dashFlag;
  _dashpicklist;
  _respo;
  _sam;
  _dashpicklistService: DashBoardService;
  inputPickList;
  loadingSub;
  newlistarray = [];
  isShowTableFlag = false;
  newcolumnlist = [];
  newcolumnlist1 = [];
  newcolumnlist2 = [];
  getCustomerStartIndex = "0";
  getCustomerMaxRecords = "5";
  disableShowMoreButton: boolean = false;
  currentActivityDataList = [];
  inputJson;
  userLang: string = '';
  user_technical: any;
  userGroup: string = '';
  renewalPoliciesStartIndex: number = 0;
  renewalPoliciesMaxRecords: number = 5;
  renewalPoliciesExpiringInDays: number = 365;
  currentActivityListBackup = [];
  multicheckarray: any[];
  columnsList: TableInfo[] = [];
  renewalFilterJSON: any = {};
  checkboxarrayform = new FormGroup({
    SELECTALL: new FormControl(false),
    CUSTOMER: new FormControl(true),
    REFERENCE: new FormControl(true),
    PRODUCT: new FormControl(true),
    DATE: new FormControl(true),
    STATUS: new FormControl(true),
    PLAN_SELECTED: new FormControl(true),
    ISSUED_BY: new FormControl(true),
  });
  newsData = [];
  displayDate;
  newsDataForModel;
  newsDataForModelTitle;
  newsDataForModelDate;
  newsDataForModelNewsDetails;
  newsDate;
  newsType;
  showDashBoardTable: boolean = true;
  b2CFlag: boolean;
  public translated: boolean = false;
  insurance: any[];
  enquiryinfoModel: EnquiryInfoModel;
  clientNameSearchID;
  referenceSearchID;
  identitySearchID;
  renewalClientNameSearchID;
  policyNoSearchID;
  productSearchID;
  statusSearchID;
  tableDataListForSearch = [];
  renewalDataListForSearch = [];
  searchedData = [];
  sliceIndex: any;
  enableSearchBtn: boolean = false;
  enableFilterBtn: boolean = false;
  showMoreRenewalActivityFlag = true;
  text;
  policyExpFilterObj = {
    isProductWise: false,
    lobCode: '',
    isLOBWise: false,
    quarter: '',
    quarterYear: ''
  };
  repFilter: FormGroup;
  widgetsSize: number[] = [260, 250];
  dashboardMargin: number = 34.2;
  widgetList: Array<any> = [];
  appWidgetList: Array<any> = [];
  missingWidgetList: Array<any> = [];
  editFlag: Boolean = false;
  widgetControl: FormControl = new FormControl();
  labelMoreActivity: any = 'NCPBtn.activityseeAllTravelActivity';
  constructor(
    public dateDuration: DateDuration,
    breadCrumbService: BreadCrumbService,
    public config: ConfigService,
    public utils: UtilsService,
    Http: HttpClient,
    DashBoardService: DashBoardService,
    public loaderConfigService: ConfigService,
    _newsService: NewsService,
    public quotService: QuotService,
    public sharedService: SharedService,
    _quotEnquiryFormGroup: FormBuilder,
    public repService: ReportService,
    public ref: ChangeDetectorRef,
    public ele: ElementRef,
    public localStorage: LocalStorageService,
    public translate: TranslateService
  ) {
    this.repFilter = this.repService.getFilterModel();
    this._dashpicklistService = DashBoardService;
    this.loadingSub = loaderConfigService;
    this.userLang = this.loadingSub.getCustom('user_lang');
    this.userGroup = this.loadingSub.getCustom('user_prf_group_code');
    this.user_technical = this.loadingSub.getCustom('user_technical');

    if (loaderConfigService.getCustom('isExternalUser')) {
      loaderConfigService.setCustom('isExternalUser', false);
      if (loaderConfigService.getCustom('pathname'))
        loaderConfigService._router.navigate([loaderConfigService.getCustom('pathname')]);
    }
    this.newsService = _newsService;
    this.getDashBoardDataByLazyLoading();
    //this.getRenewalPoliciesData();
    this.getNewsData();
    this._currentActivityHeader.push(...this.currentActivityHeader);
    this._currentActivityMapping.push(...this.currentActivityMapping);
    this._currentActivityIconsClassNames.push(...this.currentActivityIconsClassNames);
    this._dashFlag = false;
    this.errmsg = false;
    this.enquiryinfoModel = new EnquiryInfoModel(_quotEnquiryFormGroup);
    this.searchlDetailsFormGroup = this.enquiryinfoModel.getEnquiryInfoModel();
    this.renewalSearchlDetailsFormGroup = this.enquiryinfoModel.getEnquiryInfoModel();
    this.getTransactionCount();
    this.getPolicyExpiringData();
    this.getPremiumData();
    // To Hide breadCrumb 
    // this.sharedService.doTriggerScreenManipulatorEvent({showBreadCrumb: false})
  }



  ngOnInit() {
    this.loaderConfigService.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.loaderConfigService.currentLangName);
      }
    });
    window.scroll(0, 0);
    this.widgetList = this._dashpicklistService.getWidgetList();
    this.appWidgetList = this._dashpicklistService.getAppWidgetList();
    if (this.widgetList && this.widgetList.length === 0) {
      this._dashpicklistService.widgetOrderSub.subscribe(data => {
        if (data === 'loaded') {
          this.widgetList = this._dashpicklistService.getWidgetList();
          // this.ref.detectChanges();
          this.onResize(null);
          // this.ref.detectChanges();
        }
        if (data === 'awl') {
          this.appWidgetList = this._dashpicklistService.getAppWidgetList();
        }
        if (typeof data === 'object') {
          if (data['name'] === 'addWidgetHeight') {
            this.setWidgetHeight(data['widgedID'], data['height']);
            this.dashboard.ngOnChanges(null);
          }
        }
      });
    } else {
      this.ref.detectChanges();
      this.onResize(null);
      this.ref.detectChanges();
      // this.dashboard.height = this.dashboard.height - this.dashboardMargin * this.widgetList.length;
    }
    this._currentActivityHeader = this.currentActivityHeader;
    let hideDashBoardByGroup = this.loadingSub.getCustom('user_prf_group_code');
    if (hideDashBoardByGroup === 'ADMN') {
      this.showDashBoardTable = false;
      this.isShowTableFlag = false;
    }
    this.searchlDetailsFormGroup.controls['clientName'].valueChanges.subscribe((clientNameSearchID) => {
      this.clientNameSearchID = clientNameSearchID;
      if (clientNameSearchID || this.referenceSearchID) {
        this.enableSearchBtn = true;
      }
      else {
        this.enableSearchBtn = false;
        this.searchErrmsg = false;
      }
    });
    this.searchlDetailsFormGroup.controls['quoteNo'].valueChanges.subscribe((quoteSearchID) => {
      this.referenceSearchID = quoteSearchID;
      if (quoteSearchID || this.clientNameSearchID) {
        this.enableSearchBtn = true;
      }
      else {
        this.enableSearchBtn = false;
        this.searchErrmsg = false;
      }
    });
    this.searchlDetailsFormGroup.controls['identityNo'].valueChanges.subscribe((identitySearchID) => {
      this.identitySearchID = identitySearchID;
      if (identitySearchID || this.clientNameSearchID || this.referenceSearchID) {
        this.enableSearchBtn = true;
      }
      else {
        this.enableSearchBtn = false;
        this.searchErrmsg = false;
      }
    });
    this.renewalSearchlDetailsFormGroup.controls['clientName'].valueChanges.subscribe((renewalClientNameSearchID) => {
      this.renewalClientNameSearchID = renewalClientNameSearchID;
      if (renewalClientNameSearchID || this.policyNoSearchID || this.productSearchID || this.statusSearchID) {
        this.enableFilterBtn = true;
      }
      else {
        this.enableFilterBtn = false;
        this.searchErrmsg = false;
      }
    });
    this.renewalSearchlDetailsFormGroup.controls['policyNo'].valueChanges.subscribe((policyNoSearchID) => {
      this.policyNoSearchID = policyNoSearchID;
      if (policyNoSearchID || this.renewalClientNameSearchID || this.productSearchID || this.statusSearchID) {
        this.enableFilterBtn = true;
      }
      else {
        this.enableFilterBtn = false;
        this.searchErrmsg = false;
      }
    });
    this.renewalSearchlDetailsFormGroup.controls['product'].valueChanges.subscribe((productSearchID) => {
      this.productSearchID = productSearchID;
      if (productSearchID || this.policyNoSearchID || this.renewalClientNameSearchID || this.statusSearchID) {
        this.enableFilterBtn = true;
      }
      else {
        this.enableFilterBtn = false;
        this.searchErrmsg = false;
      }
    });
    this.renewalSearchlDetailsFormGroup.controls['status'].valueChanges.subscribe((statusSearchID) => {
      this.statusSearchID = statusSearchID;
      if (statusSearchID || this.productSearchID || this.policyNoSearchID || this.renewalClientNameSearchID) {
        this.enableFilterBtn = true;
      }
      else {
        this.enableFilterBtn = false;
        this.searchErrmsg = false;
      }
    });
    let userLang = this.localStorage.get('User_lang');
    if (!userLang) {
      this.localStorage.add("User_lang", "en");
    }
    this.renewalSearchlDetailsFormGroup.get('fromDate').valueChanges.subscribe(() => {
      this.setNCPDatePickerToDateOptions();
    });
    this.renewalSearchlDetailsFormGroup.get('toDate').valueChanges.subscribe(() => {
      this.setNCPDatePickerToDateOptions();
    });
    this.config.setCustom('checkboxarrayform', this.checkboxarrayform.value);
    }

  searchTableData(filterError, myArray, keyOne, keyTwo, keyThree, sliceIndex?) {
    let currentActivityList = [];
    this.searchedData = [];
    currentActivityList = myArray.filter((data) => {
      if (keyOne) {
        if (data.clientFullName.toLowerCase().indexOf(keyOne.toLowerCase()) !== -1) {
          return true;
        }
      }
      if (keyTwo) {
        if (data.referenceNo.toLowerCase().indexOf(keyTwo.toLowerCase()) !== -1) {
          return true;
        }
      }
      if (keyThree) {
        if (data.identityNo !== null && data.identityNo !== '') {
          if (data.identityNo.toLowerCase().indexOf(keyThree.toLowerCase()) !== -1) {
            return true;
          }
        }

      }
    });
    if (currentActivityList.length >= 1) {
      this.currentActivityList = currentActivityList.slice(0, sliceIndex);
      this.searchErrmsg = false;
      this.customerEditView.close();
      this.ref.detectChanges();
    } else {
      if (filterError === true) {
        this.searchErrmsg = true;
      }
      else {
        this.searchErrmsg = false;
      }
    }
    return this.searchedData;
  }

  renewalSearchTableData(myArray, clientName, policyNo, productCode, status, fromDate, toDate, sliceIndex?) {
    let renewalActivityList = [];
    this.searchedData = [];
    renewalActivityList = myArray.filter((data) => {
      if (clientName) {
        if (data.clientName.toLowerCase().indexOf(clientName.toLowerCase()) !== -1) {
          return true;
        }
      }
      if (policyNo) {
        if (data.policyNo.toLowerCase().indexOf(policyNo.toLowerCase()) !== -1) {
          return true;
        }
      }
      if (productCode) {
        if (data.productCode.toLowerCase().indexOf(productCode.code.toLowerCase()) !== -1) {
          return true;
        }
      }
      if (status) {
        if (data.statusCode.toLowerCase().indexOf(status.code.toLowerCase()) !== -1) {
          return true;
        }
      }
      if (fromDate) {
        if (data.expiryDate >= fromDate && data.expiryDate <= toDate) {
          if (data.expiryDate.toLowerCase().indexOf(data.expiryDate.toLowerCase()) !== -1) {
            return true;
          }
        }
      }
    });
    if (renewalActivityList.length >= 1) {
      this.renewalActivityList = renewalActivityList.slice(0, sliceIndex);
      this.searchErrmsg = false;
      this.customerEditView.close();
      this.ref.detectChanges();
    } else {
      this.searchErrmsg = true;
    }
    return this.searchedData;
  }

  closeSearchModol() {
    this.searchErrmsg = false;
    this.searchlDetailsFormGroup.reset();
    this.getDashBoardDataByLazyLoading();
    this.customerEditView.close();
  }

  renewalCloseSearchModol() {
    this.searchErrmsg = false;
    this.renewalSearchlDetailsFormGroup.reset();
    this.getRenewalPoliciesData();
    this.customerEditView.close();
  }

  customerDetailsSearch() {
    let filterError = true;
    this.searchTableData(filterError, this.tableDataListForSearch, this.clientNameSearchID, this.referenceSearchID, this.identitySearchID, 5);
  }

  renewalDetailsSearch() {
    this.renewalSearchTableData(this.renewalActivityList, this.renewalClientNameSearchID, this.policyNoSearchID, this.productSearchID, this.statusSearchID, this.fromDate, this.toDate, 5);
  }

  clearSearchModol() {
    this.searchErrmsg = false;
    this.searchlDetailsFormGroup.reset();
    this.renewalSearchlDetailsFormGroup.reset();
  }

  viewAllNewsModel(newsDataReceived) {
    this.newsDataForModel = newsDataReceived;
    this.newsDataForModelTitle = this.newsDataForModel.newsTitle;
    this.newsType = this.newsDataForModel.newsType;
    this.newsDate = this.newsDataForModel.creationDate;
    this.newsDataForModelNewsDetails = this.newsDataForModel.newsDetails;
    // let date = this.dateDuration.transform(this.newsDataForModel.creationDate).startDate;
    // this.displayDate = date.toDateString();
    // this.newsDate = this.displayDate;
    this.viewNewsModel.open();
  }

  getNewsData() {
    let getNewsDetails = this.newsService.retrieveNews(this.inputJson);
    getNewsDetails.subscribe(
      (dataVal) => {
        let newsDataResponse = dataVal;
        let importantNews = [];
        let normalNews = [];
        for (let i = 0; i < dataVal.length; i++) {
          if (this.dateDuration.transform(dataVal[i].creationDate) != null) {

            let date: Date = this.dateDuration.transform(dataVal[i].creationDate).startDate;
            dataVal[i].creationDate = date.toDateString();
            if (dataVal[i].isArticleImpo == true) {
              importantNews.push(dataVal[i]);
            }
            else {
              normalNews.push(dataVal[i]);
            }
          }
        }
        let finalNewsData = [];
        finalNewsData.push(...importantNews);
        finalNewsData.push(...normalNews);
        finalNewsData = finalNewsData.splice(0, 4);
        this.newsData = finalNewsData;
      });
  }

  getDashBoardDataByLazyLoading() {
      this.currentActivityList = [];
      let currentActivityList = [];
      let sliceIndex: any;
      let maxLimit: number;
      maxLimit = 15;
      let getCustomerStartIndex = "" + (5 + Number(this.getCustomerStartIndex));
      sliceIndex = getCustomerStartIndex;

      this.inputJson = { "startIndex": this.getCustomerStartIndex, "maxRecords": this.getCustomerMaxRecords }
      let dropdownValus;
      let currentActivityDataList = [];
      let dashboardTablejson;
      dropdownValus = this._dashpicklistService.getDashboardUpdatedTableList(dashboardTablejson);
      dropdownValus.subscribe(
        (dataVal) => {
          if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
            this.errmsg = true;
            this.errors = [];
            for (let i = 1; i < dataVal.error.length; i++) {
              this.errors.push({ 'errCode': dataVal.error[i].errCode, 'errDesc': dataVal.error[i].errDesc });
            }
            this.loadingSub.setLoadingSub('no');
          } else {
            currentActivityDataList = this.configureCurrentActivityJSONList(dataVal);
            this.tableDataListForSearch = dataVal;
            for (let i = 0; i < currentActivityDataList.length; i++) {
            }
            currentActivityList.push(...currentActivityDataList);
            this.currentActivityList = currentActivityList.splice(0, sliceIndex);
            this.sliceIndex = 5 + Number(sliceIndex);
            this.isShowTableFlag = true;
            this.loadingSub.setLoadingSub('no');
          }
        }
      );
    }
  label = 'NCPBtn.showMoreActivity';
  showMoreActivity() {
    if (this.sliceIndex > 15) {
      this.config.navigateRouterLink('/ncp/activity');
      window.scroll(0, 0);
    }
    if (this.sliceIndex == 15) {
      this.label = 'NCPBtn.activityseeAllTravelActivity';
      this.sliceIndex = 17;
    }
    let showMoreList = this.tableDataListForSearch;
    this.currentActivityList = showMoreList.slice(0, this.sliceIndex);
    let filterError = false;
    this.searchTableData(filterError, this.tableDataListForSearch, this.clientNameSearchID, this.referenceSearchID, this.identitySearchID, this.sliceIndex);
    this.sliceIndex = 5 + Number(this.sliceIndex);
    if (this.tableDataListForSearch.length <= 15) {
      this.disableShowMoreButton = true;
    }
    if (this.sliceIndex > 5) {
      this.labelMoreActivity = 'NCPBtn.activityshowMoreActivity';
      this.ref.detectChanges();
    } else {
      this.labelMoreActivity = 'NCPBtn.activityseeAllTravelActivity';
      this.ref.detectChanges();
    }
    if (this.sliceIndex - 5 > 11) {
      if (window.innerWidth < 767) {
        this.adjustWidgetHeight('currentActivity', 1.7);
      } else {
        this.widgetsSize[1] = 235;
        this.setWidgetHeight('currentActivity', 4);
      }
    } else if (this.sliceIndex - 5 > 7) {
      if (window.innerWidth < 767) {
        this.adjustWidgetHeight('currentActivity', 1.9);
      } else {
        this.setWidgetHeight('currentActivity', 3);
      }
    }
    this.dashboard.ngOnChanges(null);
    this.ref.detectChanges();
    // this.ele.nativeElement.children[1].style.height = this.dashboard.height - this.dashboard.margin * 4 + 'px';
  }

  dashvalue() {
    let dropdownValus;
    let outputData = [];
    dropdownValus = this._dashpicklistService.getDashboardTablelist(this.inputPickList);
    dropdownValus.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this.errmsg = true;
          this.errors = [];
          for (let i = 1; i < dataVal.error.length; i++) {
            this.errors.push({ 'errCode': dataVal.error[i].errCode, 'errDesc': dataVal.error[i].errDesc });
          }
        } else {
          this.currentActivityList = this.configureCurrentActivityJSONList(dataVal);
          this.loadingSub.setLoadingSub('no');
          this.isShowTableFlag = true;
        }
        this.loadingSub.setLoadingSub('no');
      }
    );
    window.scrollTo(0, 0);  // Changed from 100,100 to 0,0
  }

  private configureCurrentActivityJSONList(currentActivityList) {
    for (let i = 0; i < currentActivityList.length; i++) {
      if (currentActivityList[i].process == 'POL') {
        let productDesc: string = currentActivityList[i].productDesc;
        if (currentActivityList[i].planTypeCode != undefined && currentActivityList[i].planTypeCode != null && currentActivityList[i].planTypeCode != '' && this.checkboxarrayform.controls['PLAN_SELECTED'].value === true) {
          productDesc = productDesc.replace('-'.concat(currentActivityList[i].planTypeDesc), '');
          productDesc = productDesc.concat('-').concat(currentActivityList[i].planTypeDesc);
          currentActivityList[i].productDesc = productDesc;
        } else {
          productDesc = productDesc.replace('-'.concat(currentActivityList[i].planTypeDesc), '');
          currentActivityList[i].productDesc = productDesc;
        }
      }
    }
    return currentActivityList;
  }

  ngAfterContentInit() {
    this.multicheckarray = [
      { value: 'CS', label: 'NCPLabel.customer', elementControl: this.checkboxarrayform.controls['CUSTOMER'], disabledFlag: true },
      { value: 'RF', label: 'NCPLabel.reference', elementControl: this.checkboxarrayform.controls['REFERENCE'] },
      { value: 'PT', label: 'NCPLabel.product', elementControl: this.checkboxarrayform.controls['PRODUCT'], hasAdjField: true, adjFieldIndexes: [5] },
      { value: 'DT', label: 'NCPLabel.adate', elementControl: this.checkboxarrayform.controls['DATE'] },
      { value: 'ST', label: 'NCPLabel.status', elementControl: this.checkboxarrayform.controls['STATUS'] },
      { value: 'PS', label: 'NCPLabel.planSelected', elementControl: this.checkboxarrayform.controls['PLAN_SELECTED'], isAdjField: true },
      { value: 'IB', label: 'NCPLabel.issuedBy', elementControl: this.checkboxarrayform.controls['ISSUED_BY'] },
    ];


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
      this.loadingSub.setLoadingSub('no');
    });
    this.checkboxarrayform.valueChanges.subscribe(() => {
      if (this.checkboxarrayform.controls['CUSTOMER'].value !== true &&
        this.checkboxarrayform.controls['REFERENCE'].value !== true &&
        this.checkboxarrayform.controls['PRODUCT'].value !== true &&
        this.checkboxarrayform.controls['DATE'].value !== true &&
        this.checkboxarrayform.controls['STATUS'].value !== true &&
        this.checkboxarrayform.controls['ISSUED_BY'].value !== true) {
        this.errmsg = true;
      } else {
        this.errmsg = false;
      }
    });
  }


  colhide(): any {
    if (this.checkboxarrayform.controls['CUSTOMER'].value == true || this.checkboxarrayform.controls['REFERENCE'].value == true || this.checkboxarrayform.controls['PRODUCT'].value == true || this.checkboxarrayform.controls['DATE'].value == true || this.checkboxarrayform.controls['STATUS'].value == true || this.checkboxarrayform.controls['ISSUED_BY'].value == true) {
      this.newcolumnlist = [];
      this.newcolumnlist1 = [];
      this.newcolumnlist2 = [];
      for (var i = 0; i < this._currentActivityHeader.length; i++) {
        if (this.checkboxarrayform.controls['CUSTOMER'].value == false && this._currentActivityHeader[i] == "NCPLabel.customer") { continue; }
        if (this.checkboxarrayform.controls['REFERENCE'].value == false && this._currentActivityHeader[i] == "NCPLabel.reference") { continue; }
        if (this.checkboxarrayform.controls['PRODUCT'].value == false && this._currentActivityHeader[i] == "NCPLabel.product") { continue; }
        if (this.checkboxarrayform.controls['DATE'].value == false && this._currentActivityHeader[i] == "NCPLabel.adate") { continue; }
        if (this.checkboxarrayform.controls['STATUS'].value == false && this._currentActivityHeader[i] == "NCPLabel.status") { continue; }
        if (this.checkboxarrayform.controls['PLAN_SELECTED'].value == false && this._currentActivityHeader[i] == "NCPLabel.planSelected") { continue; }
        if (this.checkboxarrayform.controls['ISSUED_BY'].value == false && this._currentActivityHeader[i] == "NCPLabel.issuedBy") { continue; }
        this.newcolumnlist.push(this._currentActivityHeader[i]);
        this.newcolumnlist1.push(this._currentActivityMapping[i]);
        this.newcolumnlist2.push(this._currentActivityIconsClassNames[i]);
      }

      this.currentActivityList = this.configureCurrentActivityJSONList(this.currentActivityList);

      this.currentActivityHeader = [];
      this.currentActivityMapping = [];
      this.currentActivityIconsClassNames = [];
      this.currentActivityHeader.push(...this.newcolumnlist);
      this.currentActivityMapping.push(...this.newcolumnlist1);
      this.currentActivityIconsClassNames.push(...this.newcolumnlist2);
      this.thirdModal.close();
      this.errmsg = false;
    }
    else {
      this.errmsg = true;
    }
    this.config.setCustom('checkboxarrayform', this.checkboxarrayform.value);
  }

  settingsClose() {
    this.checkboxarrayform.patchValue(this.config.getCustom('checkboxarrayform'));
  }
  selectall() {
    this.currentActivityHeader = [];
    this.currentActivityMapping = [];
    this.currentActivityIconsClassNames = [];
    this.currentActivityHeader.push(...this._currentActivityHeader);
    this.currentActivityMapping.push(...this._currentActivityMapping);
    this.currentActivityIconsClassNames.push(...this._currentActivityIconsClassNames);
    this.errmsg = false;
    this.checkboxarrayform.controls['CUSTOMER'].setValue(true);
    this.checkboxarrayform.controls['REFERENCE'].setValue(true);
    this.checkboxarrayform.controls['PRODUCT'].setValue(true);
    this.checkboxarrayform.controls['DATE'].setValue(true);
    this.checkboxarrayform.controls['STATUS'].setValue(true);
    this.checkboxarrayform.controls['PLAN_SELECTED'].setValue(true);
    this.checkboxarrayform.controls['ISSUED_BY'].setValue(true);
  }

  openActivity(e) {
    if (e && e['name'].indexOf('Policies') !== -1) {
    } else if (e['name'].indexOf('Quotes') !== -1) {
    } else if (e['name'].indexOf('Claims') !== -1) {
    }
    // this.loadingSub.navigateRouterLink('/ncp/activity');
  }

  getTransactionCount() {
    let countResp = this.config.ncpRestServiceWithoutLoadingSubCall('dashboard/getCurrentTransactionCount', {});
    countResp.subscribe((data) => {
      if (!data['error'] && data instanceof Array) {
        this.dataCard = data;
      }
      this.config.loadingSub.next('no');
    });
  }

  getPolicyExpiringData() {
    this.policyExpFilterObj = {
      isProductWise: false,
      lobCode: '',
      isLOBWise: false,
      quarter: '2',
      quarterYear: '2017'
    };
    let expResp = this.config.ncpRestServiceWithoutLoadingSubCall('dashboard/retrievePolicyCountForRenewal', this.policyExpFilterObj);
    expResp.subscribe((data) => {
      if (!data['error'] && data instanceof Array) {
        this.dataSingle = data;
      }
    });
  }

  getPremiumData() {
    let currentDate = new Date();
    this.dataMulti = [];
    this.repFilter.get('isQuarterly').setValue(true);
    this.repFilter.get('isReportDateWise').setValue(false);
    this.repFilter.get('isYearly').setValue(false);
    this.repFilter.get('isMonthly').setValue(false);
    this.repFilter.get('isProductWise').setValue(false);
    this.repFilter.get('quarter').setValue(1);
    this.repFilter.get('quarterYear').setValue(currentDate.getFullYear());
    this.repFilter.get('isDataforAllQuarter').setValue(true);
    this.repFilter.get('reportType').setValue('');
    let reportsResp = this.config.ncpRestServiceWithoutLoadingSubCall('report/retrievePolicyPremiumForReports', this.repFilter.value);
    reportsResp.subscribe((data) => {
      if (!data['error'] && data instanceof Array) {
        this.dataMulti = data;
      }
      this.config.loadingSub.next('no');
    });
  }

  getProductLevelPremiumData(graphData: any) {
    if (typeof graphData !== 'string') {
      /* condition for click event triggered when legend is clicked */
      let tempQuarter: string = graphData['series'];
      if (tempQuarter) {
        let temp: Array<string> = tempQuarter.split('-');
        this.dataMulti = [];
        this.repFilter.get('isQuarterly').setValue(true);
        this.repFilter.get('isReportDateWise').setValue(false);
        this.repFilter.get('isYearly').setValue(false);
        this.repFilter.get('isMonthly').setValue(false);
        this.repFilter.get('isProductWise').setValue(true);
        this.repFilter.get('lobCodeForProduct').setValue(graphData['name']);
        this.repFilter.get('quarter').setValue(temp[0].charAt(1));
        this.repFilter.get('quarterYear').setValue(temp[1]);
        this.repFilter.get('isDataforAllQuarter').setValue(true);
        this.repFilter.get('reportType').setValue('');
        let reportsResp = this.config.ncpRestServiceWithoutLoadingSubCall('report/retrievePolicyPremiumForReports', this.repFilter.value);
        reportsResp.subscribe((data) => {
          if (!data['error'] && data instanceof Array) {
            this.dataMulti = data;
          }
          this.config.loadingSub.next('no');
        });
      }
    }
  }

  getLobLevelExpiringData(graphData: any) {
    if (typeof graphData !== 'string') {
      /* condition for click event triggered when legend is clicked */
      let tempQuarter: string = graphData['name'];
      if (tempQuarter) {
        let temp: Array<string> = tempQuarter.split('-');
        this.policyExpFilterObj['isProductWise'] = false,
          this.policyExpFilterObj['lobCode'] = '',
          this.policyExpFilterObj['isLOBWise'] = true,
          this.policyExpFilterObj['quarter'] = temp[0].charAt(1);
        this.policyExpFilterObj['quarterYear'] = temp[1];
        this.policyExpFilterObj['isDataforAllQuarter'] = true;
        this.policyExpFilterObj['reportType'] = '';
        let expResp = this.config.ncpRestServiceWithoutLoadingSubCall('dashboard/retrievePolicyCountForRenewal', this.policyExpFilterObj);
        expResp.subscribe((data) => {
          if (!data['error'] && data instanceof Array) {
            this.dataSingle = data;
          }
        });
      }
    }
  }

  getProductLevelExpiringData(graphObj: any) {
    this.policyExpFilterObj['isProductWise'] = true;
    this.policyExpFilterObj['lobCode'] = graphObj['name'];
    this.policyExpFilterObj['isLOBWise'] = false;
    let expResp = this.config.ncpRestServiceWithoutLoadingSubCall('dashboard/retrievePolicyCountForRenewal', this.policyExpFilterObj);
    expResp.subscribe((data) => {
      if (!data['error'] && data instanceof Array) {
        this.dataSingle = data;
      }
    });
  }

  @HostListener('window:resize')
  private onResize(event: any) {
    if (this.dashboard) {
      this.dashboard.dragEnable = false;
      if (window.innerWidth < 767) {
        this.dashboardMargin = 25;
        this.getDashBoardDataByLazyLoading();
        this.widgetsSize = [this.dashboard.width / 2 - this.dashboardMargin, 255];
        this.adjustWidgetHeight('currentActivity', 3);
        this.setWidgetHeight('newsWidget', 4);
        this.ref.detectChanges();
        this.dashboard.ngOnChanges(null);
      } else {
        this.dashboardMargin = 30;
        this.getDashBoardDataByLazyLoading();
        this.setWidgetHeight('currentActivity', 2);
        this.setWidgetHeight('newsWidget', 2.1);
        this.widgetsSize = [this.dashboard.width / 4 - this.dashboardMargin, 200];
        this.ref.detectChanges();
        this.dashboard.ngOnChanges(null);
      }
      // this.ele.nativeElement.children[1].style.height = this.dashboard.height - this.dashboard.margin * 5 + 'px';
    }
  }


  setWidgetHeight(widgetId: String, height: number) {
    let index = this.widgetList.findIndex(element => {
      if (element.widgetID === widgetId) {
        return true;
      } else {
        return false;
      }
    });
    if (index > -1) {
      this.widgetList[index].size[1] = height;
    }
  }

  adjustWidgetHeight(widgetId: String, height: number) {
    let index = this.widgetList.findIndex(element => {
      if (element.widgetID === widgetId) {
        return true;
      } else {
        return false;
      }
    });
    if (index > -1) {
      this.widgetList[index].size[1] = this.widgetList[index].size[1] * height;
    }
  }

  addWidgetHeight(widgetId: String, height: number) {
    let index = this.widgetList.findIndex(element => {
      if (element.widgetID === widgetId) {
        return true;
      } else {
        return false;
      }
    });
    if (index > -1) {
      this.widgetList[index].size[1] = this.widgetList[index].size[1] + height;
    }
  }

  makeDashEditable() {
    this.missingWidgetList = [];
    let missingWidgetList = [];
    missingWidgetList = this.appWidgetList.filter(element => {
      let index = this.widgetList.findIndex(elem => {
        if (elem.widgetID === element.widgetID) {
          return true;
        } else {
          return false;
        }
      });
      if (index > -1) {
        return false;
      } else {
        return true;
      }
    });
    if (missingWidgetList && missingWidgetList.length > 0) {
      missingWidgetList.forEach(elem => {
        let obj = {
          desc: this.utils.getTranslated('NCPLabel.' + elem.widgetID),
          code: elem.widgetID
        }
        this.missingWidgetList.push(obj);
      });
    }
  }

  removeWidget(widgetID: string) {
    let index = this.widgetList.findIndex(element => {
      if (element.widgetID === widgetID) {
        return true;
      } else {
        return false;
      }
    });
    if (index > -1) {
      this.widgetList.splice(index, 1);
      this.dashboard.removeItemById(widgetID);
      this.makeDashEditable();
    }
  }

  setEditable() {
    this.makeDashEditable();
    this.dashboard.dragEnable = true;
    this.widgetsSize[1] = 240;
    this.setWidgetHeight('currentActivity', 2);
    this.setWidgetHeight('renewalPolicies', 2);
    this.dashboard.ngOnChanges(null);
  }

  setNonEditable() {
    this.makeDashEditable();
    if (this.dashboard) {
      this.dashboard.dragEnable = false;
    }
    this.widgetsSize[1] = 200;
    this.dashboard.ngOnChanges(null);
  }

  addWidgets() {
    if (this.widgetControl.value && this.widgetControl.value.length > 0) {
      let addWidgets = this.widgetList;
      this.widgetList = [];
      this.ref.detectChanges();
      let widget;
      this.widgetControl.value.forEach(elem => {
        widget = this.appWidgetList.find(element => {
          if (element.widgetID === elem.code) {
            return true;
          } else {
            return false;
          }
        });
        addWidgets.push(widget);
      });
      this.widgetList = addWidgets;
      this.widgetControl.setValue([]);
      this.saveConfig();
    }
  }

  saveConfig() {
    let updateWidgetsResp = this._dashpicklistService.updateWidgets(this.widgetList);
    this._dashpicklistService.setWidgetList(this.widgetList);
    updateWidgetsResp.subscribe(data => {
      if (data.status === true) {

      }
    });
  }

  orderChange(data) {
    let temp = this.widgetList;
    this.widgetList = [];
    let result = [];
    data.forEach(function (key) {
      var found = false;
      temp = temp.filter(function (item) {
        if (!found && item.widgetID === key) {
          result.push(item);
          found = true;
          return false;
        } else {
          return true;
        }
      });
    });
    this.widgetList = result;
    this.dashboard.ngOnChanges(null);
  }

  getRenewalPoliciesData() {
    this.renewalActivityList = [];
    let renewalPolicies;
    this.renewalPoliciesMaxRecords = 5;
    this.renewalFilterJSON['policiesExpiringInDays'] = this.renewalPoliciesExpiringInDays;
    this.renewalFilterJSON['startIndex'] = this.renewalPoliciesStartIndex;
    this.renewalFilterJSON['maxRecords'] = this.renewalPoliciesMaxRecords;
    renewalPolicies = this._dashpicklistService.getRenewalPoliciesData(this.renewalFilterJSON);
    renewalPolicies.subscribe(
      (renewalPolicies) => {
        if (renewalPolicies.error !== null && renewalPolicies.error !== undefined && renewalPolicies.error.length >= 1) {
          this.errmsg = true;
          this.errors = [];
          for (let i = 1; i < renewalPolicies.error.length; i++) {
            this.errors.push({ 'errCode': renewalPolicies.error[i].errCode, 'errDesc': renewalPolicies.error[i].errDesc });
          }
          this.loadingSub.setLoadingSub('no');
        } else {
          this.renewalDataListForSearch = renewalPolicies;
          this.renewalActivityList.push(...renewalPolicies);
          this.isShowTableFlag = true;
          this.loadingSub.setLoadingSub('no');
        }
      }
    );
  }

  showTabContent(event, onPageLoad?: boolean, showContent?: string, ) {
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
      var target = event.target || event.srcElement || event.currentTarget;
      var value = target.attributes.id.nodeValue;
      let content = 'content' + value.substr(value.length - 1, 1);
      let activityDataTable = document.getElementsByClassName("activityDataTable");
      for (let i = 0; i < activityDataTable.length; i++) {
        (<HTMLElement>activityDataTable[i]).style.display = "none";
      }

      document.getElementById(content).style.display = "block";
    }

  }

  showMoreRenewalPolicies() {
    if (this.renewalActivityList.length <= 15) {
      if (this.renewalPoliciesMaxRecords <= this.renewalActivityList.length) {
        this.renewalFilterJSON['maxRecords'] = this.renewalPoliciesMaxRecords + 5;
      }
      this.renewalActivityList = [];
      let renewalPolicies;
      renewalPolicies = this._dashpicklistService.getRenewalPoliciesData(this.renewalFilterJSON);
      renewalPolicies.subscribe(
        (renewalPolicies) => {
          if (renewalPolicies.error !== null && renewalPolicies.error !== undefined && renewalPolicies.error.length >= 1) {
            this.errmsg = true;
            this.errors = [];
            for (let i = 1; i < renewalPolicies.error.length; i++) {
              this.errors.push({ 'errCode': renewalPolicies.error[i].errCode, 'errDesc': renewalPolicies.error[i].errDesc });
            }
            this.loadingSub.setLoadingSub('no');
          } else {
            this.renewalDataListForSearch = renewalPolicies;
            this.renewalActivityList.push(...renewalPolicies);
            this.isShowTableFlag = true;
            this.loadingSub.setLoadingSub('no');
          }
        }
      );
    } else {
      this.showMoreRenewalActivityFlag = false;
    }
  }
  public setNCPDatePickerToDateOptions() {
    if (this.renewalSearchlDetailsFormGroup.get('fromDate').value) {
      if (this.renewalSearchlDetailsFormGroup.get('toDate').value) {
        this.enableFilterBtn = true;
        this.fromDate = this.renewalSearchlDetailsFormGroup.get('fromDate').value;
        this.toDate = this.renewalSearchlDetailsFormGroup.get('toDate').value;
        if (this.toDate < this.fromDate) {
          this.renewalSearchlDetailsFormGroup.get('toDate').patchValue(this.fromDate);
          this.toDate = this.fromDate;
          return (this.renewalSearchlDetailsFormGroup.get('toDate').value);
        }
        else {
          return (this.renewalSearchlDetailsFormGroup.get('toDate').value);
        }
      }
    }
  }
  }



