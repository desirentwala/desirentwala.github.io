import { AfterContentInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from "../../../../core/adapters/packageAdapter";
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UtilsService } from "../../../../core/ui-components/utils/utils.service";
import { EventService } from "../../../../core/services/event.service";
import { BreadCrumbService } from "../../../common/index";
import { ConfigService } from "../../../../core/services/config.service";
import { Logger } from '../../../../core/ui-components/logger';
import { CurrencyService } from '../services/currency.service';


export class TableInfo {
  mapping: string;
  header: string;
  showColumn: boolean;
  className: string;
}
@Component({
  selector: 'currencyList',
  templateUrl: './currencyList.component.html'
})
export class CurrencyListComponent implements OnInit {
  currencyFormGroup:FormGroup;
  formBuilder: FormBuilder;
  currencyArray: any[] = [];
  mappingList = ['currencyType', 'currencyCode', 'currencyCodeDesc','currencyRate'];
  headerList = ['NCPLabel.currencyType', 'NCPLabel.currencyCode', 'NCPLabel.currencyCodeDesc','NCPLabel.currencyRate'];
  columnsList = [];
  loaderConfig;
  tableDetails: TableInfo[] = [];
  setTableFlag: boolean = true;
  iconsClassNames = ['', '', ''];
  sortByDefault = "name";
  sort: any;
  getMaxRecords = 5;
  getStartIndex = 0;
  viewMore: boolean = true;
  multicheckarray: any[];
  searchId: any = '';
  searchErrmsg: boolean = false;
  placeHolder: string = 'NCPBtn.search';
  @ViewChild("columnFilterModal") columnFilterModal;
  @ViewChild('myTooltip') myTooltip;
  @ViewChild('currencyDeleteModel') currencyDeleteModel;
  // zipCodeValue;
  // countryCodeValue;
  enableShowMoreButton: boolean = true;
  disableShowMoreButton: boolean = false;
  policyHolderTypeFlag: boolean = false;
  newTableDetails = [];
  currencyCodeValue;
  currencyTypeValue;
  constructor(public translate: TranslateService,
    public currencyService: CurrencyService,
    public utilsService: UtilsService,
    public changeRef: ChangeDetectorRef,
    _eventHandler: EventService,
    public config: ConfigService,
    public _logger: Logger,
    breadCrumbService: BreadCrumbService) {
    this.loaderConfig = config;
    this.currencyFormGroup = this.currencyService.getCurrencyFormInfo(); }

  ngOnInit() {
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.loaderConfig.currentLangName);
      }
    });
    this.columnsList = [];
    this.getCurrencyList(this.currencyFormGroup.value);
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
  getCurrencyList(inputJson) {
    //inputJson['modelFlag'] = false;
    let getCurrencyResponce = this.currencyService.getCurrencyList(inputJson);
    getCurrencyResponce.subscribe(
      (currencyDetail) => {
        if (currencyDetail) {
          if (currencyDetail.error) {
            this._logger.error('getCurrencyList() ===>' + currencyDetail.error);
          } else if (currencyDetail instanceof Array) {
            this.currencyArray.push(...currencyDetail)
            if (currencyDetail.length < 5) {
              this.viewMore = false
              this.changeRef.markForCheck();
            } else {
              this.viewMore = true
              this.changeRef.markForCheck();
            }
            this.loaderConfig.setLoadingSub('no');
          }
        } else {
          this.loaderConfig.setLoadingSub('no');
          this.viewMore = false
          this.changeRef.markForCheck();
        }
      }
    );
  }
  getValueobject(value, type) {
    this.currencyCodeValue = value;
    this.currencyTypeValue = type;
    this.currencyDeleteModel.open();
  }
  deleteCurrencyDetail(currencyCodeValue, currencyTypeValue) {
    let getCurrencyDetailsArray = { "currencyCode": currencyCodeValue, "currencyType": currencyTypeValue };
    let currencyResponse = this.currencyService.deleteCurrency(getCurrencyDetailsArray);
    currencyResponse.subscribe(
      (data) => {
        if (data.error) {

          this._logger.error('Delete Currency() ===>' + data.error);
        } else {
          if (data.status == true) {
            this.currencyArray = [];
            this.getStartIndex = 0;
            this.currencyFormGroup.reset();
            this.currencyFormGroup.controls['startIndex'].patchValue(this.getStartIndex);
            this.currencyFormGroup.controls['maxRecords'].patchValue(5);
            this.getCurrencyList(this.currencyFormGroup.value);
          }
        }
        this.loaderConfig.setLoadingSub('no');
        this.changeRef.markForCheck();
      });
  }
  editCurrencyDetail(currencyCodeValue) {
    this.currencyFormGroup.reset();
    let tempJson = { "currencyCode": currencyCodeValue };
    let currencyprofileresponse = this.currencyService.getCurrencyDetails(tempJson);
    currencyprofileresponse.subscribe(
      (currencyDetail) => {
        if (currencyDetail.error) {
          this._logger.error('Edit() ===>' + currencyDetail.error);
        } else {
          this.currencyFormGroup.get('currencyCode').disable();
          this.config.setCustom('currencyDetails', currencyDetail[0]);
          this.config.navigateRouterLink('ncp/currency/currencyEdit');
          this.loaderConfig.setLoadingSub('no');
        }
      }
    );
  }
 
  selectedClass(columnName): any {
    return columnName === this.sort.column ? 'sort-' + this.sort.descending : false;
  }
  
  doViewMore() {
    this.getStartIndex = 5 + this.getStartIndex;
    this.currencyFormGroup.controls['startIndex'].patchValue(this.getStartIndex);
    this.getCurrencyList(this.currencyFormGroup.value);
  }
  navigateCurrencyList() {
    this.currencyArray = [];
    this.currencyFormGroup.reset();
    this.currencyFormGroup.controls['startIndex'].patchValue(this.getStartIndex);
    this.currencyFormGroup.controls['maxRecords'].patchValue(5);
    this.getCurrencyList(this.currencyFormGroup.value);
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
  changeColumns(): any {
    this.newTableDetails = [];
    for (var i = 0; i < this.columnsList.length; i++) {
      if (this.columnsList[i].showColumn === true) {
        this.newTableDetails.push(...this.columnsList[i]);
      }
    }
    this.tableDetails = this.newTableDetails;
  }
  filterModels() {
    this.currencyArray = [];
    this.getStartIndex = 0;
    this.currencyFormGroup.controls['startIndex'].patchValue(this.getStartIndex);
    this.currencyFormGroup.controls['maxRecords'].patchValue(5);
    this.getCurrencyList(this.currencyFormGroup.value);
  }
  convertSorting(): string {
    return this.sort.descending ? '-' + this.sort.column : this.sort.column;
  }
  doAction(inputParam) {
  }
}
