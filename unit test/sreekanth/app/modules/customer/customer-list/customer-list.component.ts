import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { EventService } from '../../../core/services/event.service';
import { SharedService } from '../../../core/shared/shared.service';
import { BreadCrumbService } from '../../common/breadCrumb/index';
import { EnquiryServices } from '../../common/enquiry/services/enquiry.services';
import { customerService } from '../services/customer.service';
import { FactoryProvider } from './../../../core/factory/factoryprovider';
import { Logger } from './../../../core/ui-components/logger/logger';
import { DateDuration } from './../../../core/ui-components/ncp-date-picker/pipes/date.duration';
import { UtilsService } from './../../../core/ui-components/utils/utils.service';
import { EnquiryInfoModel } from './../../common/enquiry/models/enquiryInfo.model';
import { EnquiryServicesImp } from './../../common/enquiry/services/enquiry.servicesImpl';
import { customerDetailValidator } from './customer-list.validator';
import { ProductFactory } from '../../../core/factory/productfactory';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
})
export class CustomerListComponent implements OnInit, AfterContentInit {
  @ViewChild("customerListEditView") customerListEditView;
  @ViewChild("showHideColumnModal") showHideColumnModal;
  public oneAtATime: boolean = true;
  retrieveQuoteDetailsFormGroup: FormGroup;
  personalDetailsFormGroup: FormGroup;
  searchPersonalDetailsFormGroup: FormGroup;
  customermultiCheckArray: FormGroup;
  customerInfoOpenHeldPolicyFormGroup: FormGroup;
  quotEnquiryinfo;
  customerPerDetails;
  customerService: customerService;
  customerDetailValidator;
  inputJson;
  loaderConfig;
  searchErrmsg: boolean = false;
  enableEditButton: boolean = true;
  enableUpdateButton: boolean = false;
  CustomerDetailsPatchValue;
  retrieveCustomerPolicyDetailsResponse;
  rotateFlag: any;
  clickedItem ='default';
  prefixItems=  [
    {
      "code": "Mr",
      "desc": "Mr"
    },
    {
      "code": "Miss",
      "desc": "Miss"
    },
    {
      "code": "Mrs",
      "desc": "Mrs"
    },
    {
      "code": "Dr",
      "desc": "Dr"
    }
  ];
  mappingList = ['clientFullName', 'clientMobile', 'clientEmail', 'customerID'];
  headerList = ['NCPLabel.policyholdername', 'NCPLabel.phoneNumber', 'NCPLabel.emailId', 'NCPLabel.customerId'];
  iconsClassNames = ['', '', ''];
  quoteActivityIconsClassNames = ['', '', '', '', ''];
  quoteActivityMapping = ['quoteNo', 'productDesc', 'issueDate', 'statusDesc', 'customerID'];
  quoteActivityHeader = ['Quote', 'Product', 'Date', 'Status', 'NCPLabel.issuedBy'];
  CustomerDetailsTableData = [];
  setCustomerId: any;
  viewFlag: boolean = true;
  editFlag: boolean = false;
  setTableFlag: boolean = true;
  setDashboardFlag: boolean = true;
  setPersonalDetailFlag: boolean = false;
  setPolicyDetailFlag: boolean = false;
  setSuggestedDetailFlag: boolean = false;
  setContactDetailFlag: boolean = false;
  setPersonalDetailButtonFlag: boolean = false;
  setPolicyDetailButtonFlag: boolean = false;
  setTimelineFlag: boolean = false;
  public factoryInstance: ProductFactory;
  breadCrumbService;
  retrieveCustomerQuoteDetailsResponse;
  multicheckarray;
  newcolumnlist = [];
  newcolumnlist1 = [];
  errmsg: boolean = false;
  headerListBackUp = [];
  mappingListBackUp = [];
  iconsClassNamesBackUp = [];
  columnsList = [];
  tableDetails;
  public zipCodePattern: any = /^[0-9]*$/;
  showMoreField: boolean = true;
  enableShowMoreButton: boolean = true;
  disableShowMoreButton: boolean = false;
  policyHolderTypeFlag: boolean = false;
  getCustomerStartIndex = "-5";
  getCustomerMaxRecords = "5";
  backupTableData = [];
  newTableDetails = [];
  elementRef;
  imageSrc = 'assets/img/icon_profile.png';
  sortByDefault = "name";
  sort: any;
  showSearch = "y";
  searchId;
  userLang: string = '';
  placeHolder: string = 'NCPBtn.search';
  modalID = "CustomerDetailsTableData";
  documentViewmodal = false;
  EnquiryServicesImp: EnquiryServicesImp;
  customerPolicyInfoOpenHeldresponse;
  policyIssueDate = [];
  policyExpiryDate = [];
  policyIssueDateFin = [];
  policyExpiryDateFin = [];
  displayDateIssueDate;
  displayDateExpireyDate;
  customerPolicyDocInfo;
  customerName = "";
  showErrorMsg: boolean = false;
  public translated: boolean = false;
  showPostalCode: boolean = true;
  isPersonalDetailActive: string;
  isPolicyDetailActive: string;
  isSuggestedDetailActive: string;
  isContactDetailActive: string;
  isDashboardActive: string = "active";
  isTimelineActive: string;
  eventData: Array<any> = [];
  eventProdCd: any = '';
  eventKey: any = {};
  build;
  text;
  existingTooltip: any = '';
  isCustomer: boolean = false;
  eventHandler: EventService;
  isCurrentQuote: boolean = true;
  tooltipHide: any;
  onModelChange: Function = () => { };
  onModelTouched: Function = () => { };
  isUpdateCustomerModal: boolean = false;
  pageWidth = window.innerWidth;
  userID: string;
  constructor(public formBuilder: FormBuilder,
    public change: ChangeDetectorRef,
    _element: ElementRef,
    public config: ConfigService,
    public translate: TranslateService,
    public dateDuration: DateDuration,
    public enquiryServices: EnquiryServices,
    _enquiryServicesImp: EnquiryServicesImp,
    _quotEnquiryFormGroup: FormBuilder,
    public customerDetails: FormBuilder,
    _customerService: customerService,
    _customerDetailValidator: customerDetailValidator,
    _loaderConfigService: ConfigService,
    _breadCrumbService: BreadCrumbService,
    public utils: UtilsService,
    public _logger: Logger,
    sharedService: SharedService,
    _eventHandler: EventService
  ) {
    this.eventHandler = _eventHandler;
    this.loaderConfig = _loaderConfigService;
    this.elementRef = _element;
    this.userLang = this.loaderConfig.getCustom('userLang');
    this.customerService = _customerService;
    this.customerDetailValidator = _customerDetailValidator;
    this.breadCrumbService = _breadCrumbService;
    this.factoryInstance = FactoryProvider.getFactoryInstance(this.loaderConfig, this._logger, this.formBuilder);   // + Country Creation Factory
    let policyModelInstance = this.factoryInstance.getPolicyModelInstance();
    let customerPerDetails = policyModelInstance.getCustomerPersonalDetailsInfo();
    this.customerPerDetails = customerPerDetails;
    this.mappingListBackUp.push(...this.mappingList);
    this.iconsClassNamesBackUp.push(...this.iconsClassNames);
    this.quotEnquiryinfo = new EnquiryInfoModel(_quotEnquiryFormGroup);
    this.EnquiryServicesImp = _enquiryServicesImp;
    let i = 0;
    this.headerListBackUp.push(...this.headerList);
    this.build = this.config.get('build');
    if (this.build) {
      if (this.build == 'hk') {
        this.showPostalCode = false;
      }
    }
    this.userID = this.config.getCustom('user_id');
  }

  ngOnInit() {
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
          this.translate.use(this.loaderConfig.currentLangName);
      }
  });

    this.customermultiCheckArray = this.customerPerDetails.getCheckBoxArrayForCustomerDetails();
    this.searchPersonalDetailsFormGroup = this.customerPerDetails.getCustomerDetailsBySearch();
    this.personalDetailsFormGroup = this.customerPerDetails.getCustomerDetailsForm();
    this.retrieveQuoteDetailsFormGroup = this.quotEnquiryinfo.getEnquiryInfoModel();
    this.customerInfoOpenHeldPolicyFormGroup = this.customerPerDetails.getCustomerpolicyInfo();
    this.breadCrumbService.addRouteName('/ncp/customer', [{ 'name': 'NCPBreadCrumb.customer' }]);
    this.getCustomerDataByLazyLoading();
    this.columnsList = [];
    let tableLength = this.mappingList.length;
    for (let i = 0; i < tableLength; i++) {
      this.columnsList.push({ header: this.headerList[i], mapping: this.mappingList[i], showColumn: true, className: this.iconsClassNames[i] });
    }
    this.tableDetails = this.columnsList;
    this.sort = {
      column: this.sortByDefault,
      descending: false
    };

  }

  ngAfterContentInit() {
    this.multicheckarray = [
      { value: 'NM', label: 'NCPLabel.policyholdername', elementControl: this.customermultiCheckArray.controls['clientName'], disabledFlag: true },
      { value: 'PN', label: 'NCPLabel.phoneNumber', elementControl: this.customermultiCheckArray.controls['clientMobile'] },
      { value: 'EI', label: 'NCPLabel.emailId', elementControl: this.customermultiCheckArray.controls['clientEmail'] },
      { value: 'AN', label: 'NCPLabel.customerId', elementControl: this.customermultiCheckArray.controls['customerID'] }
    ];
  }

  documentView(policyDetails) {
    this.customerInfoOpenHeldPolicyFormGroup.controls['policyInfo'].patchValue(policyDetails);
    let customerPolicyInfoOpenHeld = this.enquiryServices.getPolicyOpenheldInfo(this.customerInfoOpenHeldPolicyFormGroup.value);
    customerPolicyInfoOpenHeld.subscribe(
      (dataVal) => {
        this.customerPolicyInfoOpenHeldresponse = dataVal;
        this.customerPolicyDocInfo = this.customerPolicyInfoOpenHeldresponse.documentInfo;
        this.loaderConfig.setLoadingSub('no');
        this.documentViewmodal = true;
      });
  }

  doEndorse(policyDetails) {
    let policyLastMovementData = {};
    this.customerInfoOpenHeldPolicyFormGroup.controls['policyInfo'].patchValue(policyDetails);
    policyLastMovementData['selectedCoverCode'] = policyDetails.planTypeCode;
    policyLastMovementData['selectedCoverDesc'] = policyDetails.planTypeDesc;
    policyLastMovementData['lastPremium'] = policyDetails.netPremium;
    policyLastMovementData['plans'] = JSON.parse(policyDetails.plans);
    this.loaderConfig.setCustom('policyLastMovementData', policyLastMovementData);
    this.getPolicyEnquiryData(this.customerInfoOpenHeldPolicyFormGroup.value, 'ENDT');
  }

  doEdit(policyDetails) {
    this.customerInfoOpenHeldPolicyFormGroup.controls['policyInfo'].patchValue(policyDetails);
    this.doSetLastPremium('PHLD');
  }

  doSetLastPremium(eventType) {
    let object_row_ref = JSON.parse(JSON.stringify(this.customerInfoOpenHeldPolicyFormGroup.value));
    let oldPolicyEndtNo: number = parseInt(object_row_ref.policyInfo.policyEndtNo) - 1;
    oldPolicyEndtNo = oldPolicyEndtNo == -1 ? 0 : oldPolicyEndtNo;
    object_row_ref.policyInfo.policyEndtNo = '00' + oldPolicyEndtNo
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
          this.getPolicyEnquiryData(object_row_ref, eventType);
        }
        this.loaderConfig.setLoadingSub('no');
      },
      (error) => {
        this._logger.error(error);
        this.loaderConfig.setLoadingSub('no');
      });
    object_row_ref.policyInfo.policyEndtNo = this.setPolicyEndtNo(object_row_ref.policyInfo.policyEndtNo);
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

          this.loaderConfig.setCustom('END', policyEnquiryInfodataVal);
          this.loaderConfig.setLoadingSub('no');

          let queryParams = {};
          let routeUrl = eventType === 'ENDT' ? this.utils.getEndorsementRoute() : this.utils.getLOBRoute(policyEnquiryInfodataVal.policyInfo.productCd);
          if (eventType === 'ENDT') {
            routeUrl = this.utils.getEndorsementRoute();
          }
          else {
            routeUrl = this.utils.getLOBRoute(policyEnquiryInfodataVal.policyInfo.productCd);
            queryParams = { productCode: policyEnquiryInfodataVal.policyInfo.productCd, eventType: eventType, transactionType: type };
          }
          if (routeUrl) {
            this.loaderConfig.navigateRouterLink(routeUrl, queryParams);
          } else {
            this.utils.loadedSub.subscribe(() => {
              routeUrl = this.utils.getLOBRoute(policyEnquiryInfodataVal.policyInfo.productCd);
              if (routeUrl) this.loaderConfig.navigateRouterLink(routeUrl, queryParams);
            });
          }
        }
      },
      (error) => {
        this._logger.error(error);
        this.loaderConfig.setLoadingSub('no');
      });

  }

  setPolicyEndtNo(value) {
    let result = "00" + (parseInt(value) + 1);
    return (result);
  }

  doNotifyClaim(policyDetails) {
    this.config.setCustom('policyNo', policyDetails.policyNo);
   let movementType = this.config.get('movementType');
    let routeUrl = this.utils.getClaimRoute('NC', movementType);
    this.config.navigateRouterLink(routeUrl); 
  }
  deletePhoto() {
    this.imageSrc = 'assets/img/icon_profile.png';
    this.change.detectChanges();
    this.change.markForCheck();

  }
  y;
  particularDocumentView(index) {
    let tempDispatchType;
    for (let i = 0; i < this.customerPolicyDocInfo.length; i++) {
      this.customerPolicyDocInfo[i].isDocumentSelected = (i == index) ? true : false;
      if (this.customerPolicyDocInfo[i].isDocumentSelected) {
        tempDispatchType = this.customerPolicyDocInfo[i].dispatchType;
        this.customerPolicyDocInfo[i].dispatchType = 'PREVIEW';
      }
    }
    this.customerPolicyInfoOpenHeldresponse.documentInfo = this.customerPolicyDocInfo;
    let y = this.enquiryServices.getDocumentInfo(this.customerPolicyInfoOpenHeldresponse);
    for (let j = 0; j < this.customerPolicyDocInfo.length; j++) {
      if (this.customerPolicyDocInfo[j].isDocumentSelected) {
        this.customerPolicyDocInfo[j].dispatchType = tempDispatchType;
      }
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

  changeColumns(): any {
    this.newTableDetails = [];
    for (var i = 0; i < this.columnsList.length; i++) {
      if (this.columnsList[i].showColumn === true) {
        this.newTableDetails.push(...this.columnsList[i]);
      }
    }
    this.tableDetails = this.newTableDetails;
  }

  getCustomerDataByLazyLoading() {

    this.getCustomerStartIndex = "" + (5 + Number(this.getCustomerStartIndex));
    this.inputJson = {
      "startIndex": this.getCustomerStartIndex,
      "maxRecords": this.getCustomerMaxRecords
    }
    let getCustomerDetails = this.customerService.getCustomerDetails(this.inputJson);
    getCustomerDetails.subscribe(
      (dataVal) => {
        let getCustomerDetailsResponse = dataVal;
        for (let i = 0; i < getCustomerDetailsResponse.length; i++) {
          if (getCustomerDetailsResponse[i].companyName) {
            getCustomerDetailsResponse[i].clientFullName = getCustomerDetailsResponse[i].companyName;
          }
        }
        this.loaderConfig.setLoadingSub('no');
        if (getCustomerDetailsResponse.length < 1) {
          this.disableShowMoreButton = true;
        }
        this.CustomerDetailsTableData.push(...getCustomerDetailsResponse);
        this.backupTableData = this.CustomerDetailsTableData;
      });
  }

  resetCustomer() {
    this.searchErrmsg = false;
    this.CustomerDetailsTableData = [];
    this.CustomerDetailsTableData.push(...this.backupTableData);
    this.clearCustomerSearchModel();
    this.customerListEditView.close();
  }
  searchCustomerModel() {
    let getPersonalDetailBySearch = this.searchPersonalDetailsFormGroup.value;
    if (getPersonalDetailBySearch.clientName == "" && getPersonalDetailBySearch.clientEmail == "" && getPersonalDetailBySearch.clientPhoneNo == "" && getPersonalDetailBySearch.identityNo == "") {
      this.CustomerDetailsTableData.push(...this.backupTableData);
    }
    else {
      this.setTableFlag = true;

      let getCustomerDetails = this.customerService.getCustomerDetails(getPersonalDetailBySearch);
      getCustomerDetails.subscribe(
        (dataVal) => {
          if ((dataVal.error !== null
            && dataVal.error !== undefined
            && dataVal.error.length >= 1) || dataVal == '') {
            this.searchErrmsg = true;
          } else {
            this.searchErrmsg = false;
            let getCustomerDetailsResponse = dataVal;
            this.loaderConfig.setLoadingSub('no');
            this.CustomerDetailsTableData = getCustomerDetailsResponse;
            this.customerListEditView.close();
          }
        });
    }
  }

  clearCustomerSearchModel() {
    this.searchErrmsg = false;
    this.searchPersonalDetailsFormGroup.reset();
  }

  getUserDetailByPolicyNumberView(customerID, customerName, customerMobile, customerEmail) {
    this.personalDetailsFormGroup.disable();
    this.showMoreField = false;
    this.customerName = customerName;
    this.viewFlag = true;
    this.editFlag = false;
    this.setTableFlag = false;
    this.setPersonalDetailButtonFlag = true;
    this.setPolicyDetailButtonFlag = true;
    this.setPersonalDetailFlag = false;
    this.setPolicyDetailFlag = false;
    this.enableEditButton = false;
    this.change.detectChanges();
    this.setCustomerId = { "customerID": customerID, "clientFirstName": customerName, "clientMobile": customerMobile }
    let retrieveCustomerDetails = this.customerService.retrieveCustomerDetails(this.setCustomerId);
    retrieveCustomerDetails.subscribe(
      (dataVal) => {
        let retrieveCustomerDetailsResponse = dataVal;

        this.CustomerDetailsPatchValue = retrieveCustomerDetailsResponse.customerInfo;
        if (this.CustomerDetailsPatchValue.policyHolderType === 'I') {
          this.policyHolderTypeFlag = true;
        }
        else {
          this.policyHolderTypeFlag = false;
        }
        this.loaderConfig.setLoadingSub('no');
        this.personalDetailsFormGroup.controls['customerInfo'].patchValue(this.CustomerDetailsPatchValue);
        if (this.personalDetailsFormGroup.controls['customerInfo'].get('pic').value) {
          this.imageSrc = this.personalDetailsFormGroup.controls['customerInfo'].get('pic').value;
        }
        this.showMoreField = false;
        this.breadCrumbService.addRouteName('/ncp/customer', [{ 'name': 'Customer' }, { 'name': this.customerName }]);
      });

    this.personalDetailsFormGroup.disable();
    let retrieveCustomerPolicyDetails = this.customerService.retrieveCustomerPolicyDetails(this.setCustomerId);
    retrieveCustomerPolicyDetails.subscribe(
      (dataVal) => {
        this.retrieveCustomerPolicyDetailsResponse = dataVal;
        for (let i = 0; i < this.retrieveCustomerPolicyDetailsResponse.length; i++) {

          let date = this.dateDuration.transform(this.retrieveCustomerPolicyDetailsResponse[i].issueDate).startDate;
          this.displayDateIssueDate = date.toDateString();
          this.policyIssueDateFin.push(this.displayDateIssueDate);
        }

        for (let i = 0; i < this.retrieveCustomerPolicyDetailsResponse.length; i++) {

          let date = this.dateDuration.transform(this.retrieveCustomerPolicyDetailsResponse[i].expiryDate).startDate;
          this.displayDateExpireyDate = date.toDateString();
          this.policyExpiryDateFin.push(this.displayDateExpireyDate);
        }

        this.loaderConfig.setLoadingSub('no');
      });

    this.retrieveQuoteDetailsFormGroup.get('clientName').setValue(customerName);
    this.retrieveQuoteDetailsFormGroup.get('clientEmail').setValue(customerEmail);
    this.retrieveQuoteDetailsFormGroup.get('clientPhoneNo').setValue(customerMobile);
    this.retrieveQuoteDetailsFormGroup.get('statusCode').setValue('QT');
    this.retrieveQuoteDetailsFormGroup.get('status').setValue('QT');

    this.EnquiryServicesImp.getQuoteEnquiry(this.retrieveQuoteDetailsFormGroup.value);

    this.EnquiryServicesImp.quotePushedData.subscribe(
      (data) => {
        this.retrieveCustomerQuoteDetailsResponse = data;
        if (this.retrieveCustomerQuoteDetailsResponse.length === 0) {
          this.isCurrentQuote = false;
        }
        this.loaderConfig.setLoadingSub('no');
        this.EnquiryServicesImp.isLodingSub = true;
        this.EnquiryServicesImp.setLoadingSub();
      });
    this.dashboardFlag();
  }

  getUserDetailByPolicyNumberEdit(customerID, customerName, customerMobile, customerEmail) {
    this.personalDetailsFormGroup.enable();
    this.showMoreField = false;
    this.viewFlag = false;
    this.editFlag = true;
    this.breadCrumbService.addRouteName('/ncp/customer', [{ 'name': 'Customer' }, { 'name': customerName }]);
    this.setTableFlag = false;
    this.setPersonalDetailButtonFlag = true;
    this.setPolicyDetailButtonFlag = true;
    this.setPersonalDetailFlag = false;
    this.setPolicyDetailFlag = false;
    this.enableUpdateButton = true;
    this.enableEditButton = false;
    this.setCustomerId = { "customerID": customerID, "clientFirstName": customerName, "clientMobile": customerMobile }
    this.change.detectChanges();
    let retrieveCustomerDetails = this.customerService.retrieveCustomerDetails(this.setCustomerId);
    retrieveCustomerDetails.subscribe(
      (dataVal) => {
        let retrieveCustomerDetailsResponse = dataVal;
        this.CustomerDetailsPatchValue = retrieveCustomerDetailsResponse.customerInfo;
        if (this.CustomerDetailsPatchValue.policyHolderType === 'I') {
          this.policyHolderTypeFlag = true;
        }
        else {
          this.policyHolderTypeFlag = false;
        }
        this.personalDetailsFormGroup.controls['customerInfo'].patchValue(this.CustomerDetailsPatchValue);
        if (this.personalDetailsFormGroup.controls['customerInfo'].get('pic').value) {
          this.imageSrc = this.personalDetailsFormGroup.controls['customerInfo'].get('pic').value;
        }
        this.loaderConfig.setLoadingSub('no');
      });


    let retrieveCustomerPolicyDetails = this.customerService.retrieveCustomerPolicyDetails(this.setCustomerId);
    retrieveCustomerPolicyDetails.subscribe(
      (dataVal) => {
        this.retrieveCustomerPolicyDetailsResponse = dataVal;
        for (let i = 0; i < this.retrieveCustomerPolicyDetailsResponse.length; i++) {

          let date = this.dateDuration.transform(this.retrieveCustomerPolicyDetailsResponse[i].issueDate).startDate;
          this.displayDateIssueDate = date.toDateString();
          this.policyIssueDateFin.push(this.displayDateIssueDate);
        }

        for (let i = 0; i < this.retrieveCustomerPolicyDetailsResponse.length; i++) {

          let date = this.dateDuration.transform(this.retrieveCustomerPolicyDetailsResponse[i].expiryDate).startDate;
          this.displayDateExpireyDate = date.toDateString();
          this.policyExpiryDateFin.push(this.displayDateExpireyDate);
        }

        this.loaderConfig.setLoadingSub('no');
      });

    this.retrieveQuoteDetailsFormGroup.get('clientName').setValue(customerName);
    this.retrieveQuoteDetailsFormGroup.get('clientEmail').setValue(customerEmail);
    this.retrieveQuoteDetailsFormGroup.get('clientPhoneNo').setValue(customerMobile);
    this.retrieveQuoteDetailsFormGroup.get('statusCode').setValue('QT');
    this.retrieveQuoteDetailsFormGroup.get('status').setValue('QT');


    this.EnquiryServicesImp.getQuoteEnquiry(this.retrieveQuoteDetailsFormGroup.value);
    this.EnquiryServicesImp.quotePushedData.subscribe(
      (data) => {
        this.retrieveCustomerQuoteDetailsResponse = data;

        this.loaderConfig.setLoadingSub('no');
      });
    this.dashboardFlag();

  }
  editCustomerDetail() {
    this.personalDetailsFormGroup.enable();
    this.personalDetailsFormGroup.controls['customerInfo'].patchValue(this.CustomerDetailsPatchValue);
    this.enableEditButton = false;
    this.enableUpdateButton = true;
    this.personalDetailsFormGroup = this.customerDetailValidator.setcustomerDetailValidator(this.personalDetailsFormGroup);

  }

  contactDetailValidation(){
    this.personalDetailsFormGroup = this.customerDetailValidator.setcustomerDetailValidator(this.personalDetailsFormGroup);
  }

  retrieveCustomerDetails() {
    let customerID = this.personalDetailsFormGroup.controls['customerInfo'].get('appCode').value;
    let customerName = this.personalDetailsFormGroup.controls['customerInfo'].get('appFName').value;
    let customerMobile = this.personalDetailsFormGroup.controls['customerInfo'].get('mobilePh').value;
    // let customerMobile = this.personalDetailsFormGroup.controls['customerInfo'].get('mobilePh').value;
    // let customerHome = this.personalDetailsFormGroup.controls['customerInfo'].get('homePh').value;
    // let customerOffice = this.personalDetailsFormGroup.controls['customerInfo'].get('office').value;
    // let customerFax = this.personalDetailsFormGroup.controls['customerInfo'].get('fax').value;
    let setCustomer = { "customerID": customerID, "clientFirstName": customerName, "clientMobile": customerMobile }
    let retrieveCustomerDetails = this.customerService.retrieveCustomerDetails(setCustomer);
    retrieveCustomerDetails.subscribe(
      (dataVal) => {
        let retrieveCustomerDetailsResponse = dataVal;
        if(dataVal){
        this.CustomerDetailsPatchValue = retrieveCustomerDetailsResponse.customerInfo;

        this.personalDetailsFormGroup.controls['customerInfo'].patchValue(this.CustomerDetailsPatchValue);
        if (this.personalDetailsFormGroup.controls['customerInfo'].get('pic').value) {
          this.imageSrc = this.personalDetailsFormGroup.controls['customerInfo'].get('pic').value;
        }
      }
        this.loaderConfig.setLoadingSub('no');
      });
  }
  updateCustomerDetail() {

    if (this.personalDetailsFormGroup.valid) {
      this.isCustomer = false;
      let image = this.elementRef.nativeElement.querySelector('.img-responsive');
      this.personalDetailsFormGroup.controls['customerInfo'].get('pic').setValue(image.currentSrc);
      let updateCustomerDetails = this.customerService.updateCustomerDetails(this.personalDetailsFormGroup.value);
      updateCustomerDetails.subscribe((dataVal) => {
        let updateCustomerDetailsResponse = dataVal;
        this.loaderConfig.setLoadingSub('no');
        this.retrieveCustomerDetails();
        this.enableUpdateButton = true;
        this.personalDetailsFormGroup.enable();
      });
      this.isUpdateCustomerModal = true;
    }
    else {
      this.eventHandler.validateTabSub.next({ value: '', id: 'customer' });
      this.isCustomer = true;
      window.scroll(0, 200);
    }




  }
  navigateToHome() {
    this.config.navigateRouterLink('ncp/home');
  }

  imageUploaded(input) {
    let reader = new FileReader();
    let image = this.elementRef.nativeElement.querySelector('.img-responsive');
    reader.onload = (e) => {
      let src = reader.result;
      image.src = src;
    };
    reader.readAsDataURL(input.target.files[0]);
    this.change.detectChanges();
    this.change.markForCheck();
  }

  showMoreButton() {

    this.showMoreField = true;
    this.enableShowMoreButton = false;
    this.retrieveCustomerDetails();
  }

  showLessButton() {
    this.showMoreField = false;
    this.enableShowMoreButton = true;

  }

  colhide(): any {
    if (this.customermultiCheckArray.controls['clientName'].value == true || this.customermultiCheckArray.controls['clientMobile'].value == true || this.customermultiCheckArray.controls['clientEmail'].value == true || this.customermultiCheckArray.controls['customerID'].value == true) {
      this.newcolumnlist = [];
      this.newcolumnlist1 = [];
      for (var i = 0; i < this.headerListBackUp.length; i++) {
        if (this.customermultiCheckArray.controls['clientName'].value == false && this.headerListBackUp[i] == "NCPLabel.policyholdername") { continue; }
        if (this.customermultiCheckArray.controls['clientMobile'].value == false && this.headerListBackUp[i] == "NCPLabel.phoneNumber") { continue; }
        if (this.customermultiCheckArray.controls['clientEmail'].value == false && this.headerListBackUp[i] == "NCPLabel.emailId") { continue; }
        if (this.customermultiCheckArray.controls['customerID'].value == false && this.headerListBackUp[i] == "NCPLabel.customerId") { continue; }
        this.newcolumnlist.push(this.headerListBackUp[i]);
        this.newcolumnlist1.push(this.mappingListBackUp[i]);
      }
      this.mappingList = [];
      this.headerList = [];
      this.headerList.push(...this.newcolumnlist);
      this.mappingList.push(...this.newcolumnlist1);
      this.columnsList = [];
      let tableLength = this.mappingList.length;
      for (let i = 0; i < tableLength; i++) {
        this.columnsList.push({ header: this.headerList[i], mapping: this.mappingList[i], showColumn: true, className: this.iconsClassNames[i] });
      }
      this.tableDetails = this.columnsList;
      this.showHideColumnModal.close();
      this.errmsg = false;
    }
    else {
      this.errmsg = true;
    }
  }

  selectAllColumn() {
    this.headerList = [];
    this.mappingList = [];
    this.iconsClassNames = [];
    this.headerList.push(...this.headerListBackUp);
    this.mappingList.push(...this.mappingListBackUp);
    this.iconsClassNames.push(...this.iconsClassNamesBackUp);
    this.columnsList = [];
    let tableLength = this.mappingList.length;
    for (let i = 0; i < tableLength; i++) {
      this.columnsList.push({ header: this.headerList[i], mapping: this.mappingList[i], showColumn: true, className: this.iconsClassNames[i] });
    }
    this.tableDetails = this.columnsList;
    this.errmsg = false;
    this.customermultiCheckArray.controls['clientName'].setValue(true);
    this.customermultiCheckArray.controls['clientMobile'].setValue(true);
    this.customermultiCheckArray.controls['clientEmail'].setValue(true);
    this.customermultiCheckArray.controls['customerID'].setValue(true);

  }

  personalDetailFlag() {
    this.retrieveCustomerDetails();

    if (this.viewFlag == true || this.editFlag == false) {
      this.personalDetailsFormGroup.disable();
      this.enableEditButton = false;
    } else if (this.viewFlag == false || this.editFlag == true) {
      this.personalDetailsFormGroup.enable();
      this.enableEditButton = false;
      this.enableUpdateButton = true;
    }
    this.setPersonalDetailFlag = true;
    this.setPolicyDetailFlag = false;
    this.setSuggestedDetailFlag = false;
    this.setContactDetailFlag = false;
    this.setDashboardFlag = false;
    this.setTimelineFlag = false;
    this.isPersonalDetailActive = "active";
    this.isPolicyDetailActive = "deactive";
    this.isSuggestedDetailActive = "deactive";
    this.isContactDetailActive = "deactive";
    this.isDashboardActive = "deactive";
    this.isTimelineActive = "deactive";
  }

  policyDetailFlag() {
    this.retrieveCustomerDetails();
    this.personalDetailsFormGroup.enable();
    this.setPersonalDetailFlag = false;
    this.setPolicyDetailFlag = true;
    this.enableUpdateButton = false;
    this.setSuggestedDetailFlag = false;
    this.setContactDetailFlag = false;
    this.setDashboardFlag = false;
    this.setTimelineFlag = false;
    this.isPersonalDetailActive = "deactive";
    this.isPolicyDetailActive = "active";
    this.isSuggestedDetailActive = "deactive";
    this.isContactDetailActive = "deactive";
    this.isDashboardActive = "deactive";
    this.isTimelineActive = "deactive";
  }

  // suggestedDetailFlag() { Currently this method is Void
  //   this.retrieveCustomerDetails();
  //   this.personalDetailsFormGroup.enable();
  //   this.setPersonalDetailFlag = false;
  //   this.setPolicyDetailFlag = false;
  //   this.enableUpdateButton = false;
  //   this.setSuggestedDetailFlag = true;
  //   this.setContactDetailFlag = false;
  //   this.setDashboardFlag = false;
  //   this.setTimelineFlag = false;
  //   this.isPersonalDetailActive = "deactive";
  //   this.isPolicyDetailActive = "deactive";
  //   this.isSuggestedDetailActive = "active";
  //   this.isContactDetailActive = "deactive";
  //   this.isDashboardActive = "deactive";
  //   this.isTimelineActive = "deactive";
  // }

  contactDetailFlag() {
    this.retrieveCustomerDetails();
    this.personalDetailsFormGroup.enable();
    this.setPersonalDetailFlag = false;
    this.setPolicyDetailFlag = false;
    this.enableUpdateButton = false;
    this.setSuggestedDetailFlag = false;
    this.setContactDetailFlag = true;
    this.setDashboardFlag = false;
    this.setTimelineFlag = false;
    this.isPersonalDetailActive = "deactive";
    this.isPolicyDetailActive = "deactive";
    this.isSuggestedDetailActive = "deactive";
    this.isContactDetailActive = "active";
    this.isDashboardActive = "deactive";
    this.isTimelineActive = "deactive";
  }

  dashboardFlag() {
    this.retrieveCustomerDetails();
    this.personalDetailsFormGroup.enable();
    this.setPersonalDetailFlag = false;
    this.setPolicyDetailFlag = false;
    this.enableUpdateButton = false;
    this.setSuggestedDetailFlag = false;
    this.setContactDetailFlag = false;
    this.setDashboardFlag = true;
    this.setTimelineFlag = false;
    this.isPersonalDetailActive = "deactive";
    this.isPolicyDetailActive = "deactive";
    this.isSuggestedDetailActive = "deactive";
    this.isContactDetailActive = "deactive";
    this.isDashboardActive = "active";
    this.isTimelineActive = "deactive";
  }

  timelineFlag() {
    let customerID = this.personalDetailsFormGroup.controls['customerInfo'].get('appCode').value;
    this.eventKey['clientID'] = customerID;
    var eventdataclient: Array<any> = [];
    var timelineResp = this.enquiryServices.getTimeLineDetails({ clientID: customerID });
    timelineResp.subscribe((data) => {
      if (data.error !== null
        && data.error !== undefined
        && data.error.length >= 1) {
        this._logger.error('getTimeLineDetails()===>' + data.error);
      } else {
        this.eventKey['quoteNo'] = data['eventID'];
        if (data['dependentEventID']) {
          eventdataclient.push(...data['eventDetails']);
          this.eventProdCd = data['productCd'];
          this.eventKey['claimNo'] = data['eventID'];
          this.eventKey['policyNo'] = data['eventID'];
          var clientResp = this.enquiryServices.getTimeLineDetails({ eventID: data['dependentEventID'] });
          clientResp.subscribe((datac) => {
            if (datac.error !== null
              && datac.error !== undefined
              && datac.error.length >= 1) {
              this._logger.error('getTimeLineDetails()===>' + datac.error);
            } else {
              this.eventKey['quoteNo'] = datac['eventID'];
              if (datac['dependentEventID']) {
                eventdataclient.push(...datac['eventDetails']);
                this.eventProdCd = datac['productCd'];
                this.eventKey['policyNo'] = datac['eventID'];
                var clientRespclaim = this.enquiryServices.getTimeLineDetails({ eventID: datac['dependentEventID'] });
                clientRespclaim.subscribe((datacl) => {
                  if (datacl.error !== null
                    && datacl.error !== undefined
                    && datacl.error.length >= 1) {
                    this._logger.error('getTimeLineDetails()===>' + datacl.error);
                  } else {
                    this.eventKey['quoteNo'] = datacl['eventID'];
                    if (data['dependentEventID']) {
                      eventdataclient.push(...datacl['eventDetails']);
                      this.eventData = eventdataclient;
                      this.eventProdCd = datacl['productCd'];
                      this.config.loadingSub.next('no');
                    }
                  }
                });
              }
              else
                if (datac['eventDetails'] instanceof Array && datac['eventID']) {
                  eventdataclient.push(...datac['eventDetails']);
                  this.eventData = eventdataclient;
                  this.eventProdCd = datac['productCd'];
                  this.config.loadingSub.next('no');
                }
            }
          });
        } else {
          if (data['eventDetails'] instanceof Array && data['eventID']) {
            eventdataclient.push(...data['eventDetails']);
            this.eventData = eventdataclient;
            this.eventProdCd = data['productCd'];
            this.config.loadingSub.next('no');
          }
        }
      }
    });
    this.retrieveCustomerDetails();
    this.personalDetailsFormGroup.enable();
    this.setPersonalDetailFlag = false;
    this.setPolicyDetailFlag = false;
    this.enableUpdateButton = false;
    this.setSuggestedDetailFlag = false;
    this.setContactDetailFlag = false;
    this.setDashboardFlag = false;
    this.setTimelineFlag = true;
    this.isPersonalDetailActive = "deactive";
    this.isPolicyDetailActive = "deactive";
    this.isSuggestedDetailActive = "deactive";
    this.isContactDetailActive = "deactive";
    this.isDashboardActive = "deactive";
    this.isTimelineActive = "active";
  }
  goBack() {
    this.setPersonalDetailButtonFlag = false;
    this.setPolicyDetailButtonFlag = false;
    this.setTableFlag = true;
    this.personalDetailsFormGroup.reset();
    this.searchPersonalDetailsFormGroup.reset();
    this.enableShowMoreButton = true;
  }
  public doPostalCodeRefresh() {
    let PostalCodeResponse = this.customerService.getpostalCodeRefreshValues({ customerInfo: this.personalDetailsFormGroup.controls['customerInfo'].value });
    PostalCodeResponse.subscribe(
      (postalCodeResponseData) => {
        if (postalCodeResponseData == null) {
          this.resetCustomerInfoAddress();
        }
        else if (postalCodeResponseData.error !== null && postalCodeResponseData.error !== undefined && postalCodeResponseData.error.length >= 1) {
          this.resetCustomerInfoAddress();
        } else {
          this.personalDetailsFormGroup.controls['customerInfo'].get('appUnitNumber').patchValue(postalCodeResponseData.address1.trim());
          this.personalDetailsFormGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
          this.personalDetailsFormGroup.controls['customerInfo'].get('blockNumber').patchValue(postalCodeResponseData.address2.trim());
          this.personalDetailsFormGroup.controls['customerInfo'].get('blockNumber').updateValueAndValidity();
          this.personalDetailsFormGroup.controls['customerInfo'].get('address1').patchValue(postalCodeResponseData.address3.trim());
          this.personalDetailsFormGroup.controls['customerInfo'].get('address1').updateValueAndValidity();
          this.personalDetailsFormGroup.controls['customerInfo'].get('address2').patchValue(postalCodeResponseData.address4.trim());
          this.personalDetailsFormGroup.controls['customerInfo'].get('address2').updateValueAndValidity();
          this.personalDetailsFormGroup.controls['customerInfo'].get('cityCode').patchValue(postalCodeResponseData.cityCode.trim());
          this.personalDetailsFormGroup.controls['customerInfo'].get('cityCode').updateValueAndValidity();
          this.personalDetailsFormGroup.controls['customerInfo'].get('cityDesc').patchValue(postalCodeResponseData.cityDesc.trim());
          this.personalDetailsFormGroup.controls['customerInfo'].get('cityDesc').updateValueAndValidity();
          this.personalDetailsFormGroup.controls['customerInfo'].get('state').patchValue(postalCodeResponseData.stateCode.trim());
          this.personalDetailsFormGroup.controls['customerInfo'].get('state').updateValueAndValidity();
          this.personalDetailsFormGroup.controls['customerInfo'].get('stateDesc').patchValue(postalCodeResponseData.state.trim());
          this.personalDetailsFormGroup.controls['customerInfo'].get('stateDesc').updateValueAndValidity();
          this.personalDetailsFormGroup.controls['customerInfo'].get('countryCode').patchValue(postalCodeResponseData.countryCode);
          this.personalDetailsFormGroup.controls['customerInfo'].get('countryCode').updateValueAndValidity();
          this.personalDetailsFormGroup.controls['customerInfo'].get('countryDesc').patchValue(postalCodeResponseData.countryDesc);
          this.personalDetailsFormGroup.controls['customerInfo'].get('countryDesc').updateValueAndValidity();
          this.loaderConfig.setLoadingSub('no');
          this.change.markForCheck();
        }
      }
    );
  }
  public resetCustomerInfoAddress() {
    this.personalDetailsFormGroup.controls['customerInfo'].get('appUnitNumber').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('blockNumber').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('address1').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('address2').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('cityCode').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('cityDesc').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('state').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('stateDesc').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('countryCode').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('countryDesc').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('appUnitNumber').reset();
    this.personalDetailsFormGroup.controls['customerInfo'].get('blockNumber').reset();
    this.personalDetailsFormGroup.controls['customerInfo'].get('address1').reset();
    this.personalDetailsFormGroup.controls['customerInfo'].get('address2').reset();
    this.personalDetailsFormGroup.controls['customerInfo'].get('cityCode').reset();
    this.personalDetailsFormGroup.controls['customerInfo'].get('cityDesc').reset();
    this.personalDetailsFormGroup.controls['customerInfo'].get('state').reset();
    this.personalDetailsFormGroup.controls['customerInfo'].get('stateDesc').reset();
    this.personalDetailsFormGroup.controls['customerInfo'].get('countryCode').reset();
    this.personalDetailsFormGroup.controls['customerInfo'].get('countryDesc').reset();
    this.loaderConfig.setLoadingSub('no');

  }

  public doCustomerRefresh() {
    
    let customerInfoResponse = this.customerService.doCustomerRefresh({ identityNo: this.personalDetailsFormGroup.controls['customerInfo'].get('identityNo').value });
    customerInfoResponse.subscribe((data) => {
      if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
        this.loaderConfig.setLoadingSub('no');
      } else {
        let identityNo = this.personalDetailsFormGroup.controls['customerInfo'].get('identityNo').value;
        let identityTypeCode = this.personalDetailsFormGroup.controls['customerInfo'].get('identityTypeCode').value;
        let identityTypeDesc = this.personalDetailsFormGroup.controls['customerInfo'].get('identityTypeDesc').value;
        let maritalStatusBeforePatch = this.personalDetailsFormGroup.controls['customerInfo'].get('maritalStatus').value;
        this.personalDetailsFormGroup.controls['customerInfo'].patchValue(data);
        let maritalStatusAfterPatch = this.personalDetailsFormGroup.controls['customerInfo'].get('maritalStatus').value;
        this.personalDetailsFormGroup.controls['customerInfo'].get('prefix').patchValue(data.prefix);
        this.personalDetailsFormGroup.controls['customerInfo'].get('prefixDesc').patchValue(data.prefix);
        if (identityNo && !this.personalDetailsFormGroup.controls['customerInfo'].get('identityNo').value) {
          this.personalDetailsFormGroup.controls['customerInfo'].get('identityNo').patchValue(identityNo);
        }
        this.personalDetailsFormGroup.controls['customerInfo'].get('identityTypeCode').patchValue(identityTypeCode);
        this.personalDetailsFormGroup.controls['customerInfo'].get('identityTypeDesc').patchValue(identityTypeDesc);
        if (maritalStatusAfterPatch !== "I" && maritalStatusAfterPatch !== "O") {
          this.personalDetailsFormGroup.controls['customerInfo'].get('maritalStatus').patchValue(maritalStatusBeforePatch);
        }
        this.personalDetailsFormGroup.controls['customerInfo'].updateValueAndValidity();
        this.disableCustomerInfo();
      }
      this.change.markForCheck();
      this.loaderConfig.setLoadingSub('no');
    });

  
  }

  public disableCustomerInfo() {
    this.personalDetailsFormGroup.controls['customerInfo'].get('policyHolderType').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('identityNo').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('identityTypeCode').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].get('identityTypeDesc').enable();
    this.personalDetailsFormGroup.controls['customerInfo'].updateValueAndValidity();
  }
  @HostListener('window:resize')
  private changePageWidth() {
    this.pageWidth = window.innerWidth;
  }
}
