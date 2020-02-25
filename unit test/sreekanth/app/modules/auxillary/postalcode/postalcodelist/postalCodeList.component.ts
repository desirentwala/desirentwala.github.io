import { AfterContentInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from "../../../../core/adapters/packageAdapter";
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ProductFactory } from '../../../../core/factory/productfactory';
import { UtilsService } from "../../../../core/ui-components/utils/utils.service";
import { EventService } from "../../../../core/services/event.service";
import { BreadCrumbService } from "../../../common/index";
import { ConfigService } from "../../../../core/services/config.service";
import { Logger } from '../../../../core/ui-components/logger';
import { PostalCodeFormService } from '../services/postalcodeform.service';

export class TableInfo {
  mapping: string;
  header: string;
  showColumn: boolean;
  className: string;
}


@Component({
  selector: 'postalcode-list',
  templateUrl: 'postalCodeList.component.html'
})
export class PostalCodeListComponent implements OnInit {
  postalCodeListFormGroup: FormGroup;
  formBuilder: FormBuilder;
  postalCodeArray: any[] = [];
  mappingList = ['zipCode', 'zipName', 'countryCodeDesc','stateCodeDesc','districtCodeDesc','cityCodeDesc','zipAddr1'];
  headerList = ['NCPLabel.zipCode', 'NCPLabel.zipName', 'NCPLabel.country','NCPLabel.state','NCPLabel.district','NCPLabel.city','NCPLabel.addressline1'];
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
  @ViewChild('postalCodeDeleteModel') postalCodeDeleteModel;
  zipCodeValue;
  zipIdValue;
  countryCodeValue;
  enableShowMoreButton: boolean = true;
  disableShowMoreButton: boolean = false;
  policyHolderTypeFlag: boolean = false;
  newTableDetails = [];
  constructor(public translate: TranslateService,
    public postalCodeFormService: PostalCodeFormService,
    public utilsService: UtilsService,
    public _partyRoleFormFB: FormBuilder,
    public changeRef: ChangeDetectorRef,
    _eventHandler: EventService,
    public config: ConfigService,
    public _logger: Logger,
    breadCrumbService: BreadCrumbService) {
    this.loaderConfig = config;
    this.postalCodeListFormGroup = this.postalCodeFormService.getPostalCodeListInfo();
  }
  ngOnInit() {
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.loaderConfig.currentLangName);
      }
    });
    this.columnsList = [];
    this.getPostalCodeList(this.postalCodeListFormGroup.value);
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
  getPostalCodeList(inputJson) {
    let getPostalCodeResponce = this.postalCodeFormService.getPostalCodeList(inputJson);
    getPostalCodeResponce.subscribe(
      (postalCodeDetail) => {
        if (postalCodeDetail) {
          if (postalCodeDetail.error) {
            this._logger.error('getPostalCodeList() ===>' + postalCodeDetail.error);
          } else if (postalCodeDetail instanceof Array) {
            this.postalCodeArray.push(...postalCodeDetail)
            if (postalCodeDetail.length < 5) {
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
  getValueobject(value) {
    this.zipIdValue = value;
    this.postalCodeDeleteModel.open();
  }
  deletePostalCodeDetail(zipIdValue) {
    let getpostalCodeDetailsArray = { "zipId": zipIdValue};
    let postalCodeResponse = this.postalCodeFormService.deletePostalCode(getpostalCodeDetailsArray);
    postalCodeResponse.subscribe(
      (postalCodedDtail) => {
        if (postalCodedDtail.error) {

          this._logger.error('Delete PostalCode() ===>' + postalCodedDtail.error);
        } else {
          if (postalCodedDtail.status == true) {
            this.postalCodeArray = [];
            this.postalCodeListFormGroup.reset();
            this.getStartIndex = 0;
            this.postalCodeListFormGroup.controls['startIndex'].patchValue(this.getStartIndex);
            this.postalCodeListFormGroup.controls['maxRecords'].patchValue(5);
            this.getPostalCodeList(this.postalCodeListFormGroup.value);
          }
        }
        this.loaderConfig.setLoadingSub('no');
        this.changeRef.markForCheck();
      });
  }
  editPostalCodeDetail(zipIdValue) {
    this.postalCodeListFormGroup.reset();
    let tempJson = { "zipId": zipIdValue };
    let postalcodeprofileresponse = this.postalCodeFormService.getPostalCodeDetails(tempJson);
    postalcodeprofileresponse.subscribe(
      (postalCodeDetail) => {
        if (postalCodeDetail.error) {
          this._logger.error('Edit() ===>' + postalCodeDetail.error);
        } else {
          this.postalCodeListFormGroup.get('zipCode').disable();
          this.config.setCustom('postalCodeDetails', postalCodeDetail[0]);
          this.config.navigateRouterLink('ncp/postalcode/postalCodeEdit');
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
    this.postalCodeListFormGroup.controls['startIndex'].patchValue(this.getStartIndex);
    this.getPostalCodeList(this.postalCodeListFormGroup.value);
  }
  navigatePostalCodeList() {
    this.postalCodeArray = [];
    this.postalCodeListFormGroup.reset();
    this.postalCodeListFormGroup = this.postalCodeFormService.getPostalCodeFormInfo();
    this.getPostalCodeList(this.postalCodeListFormGroup.value);
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
    this.postalCodeArray = [];
    this.getStartIndex = 0;
    this.postalCodeListFormGroup.controls['startIndex'].patchValue(this.getStartIndex);
    this.postalCodeListFormGroup.controls['maxRecords'].patchValue(5);
    this.getPostalCodeList(this.postalCodeListFormGroup.value);
  }
  convertSorting(): string {
    return this.sort.descending ? '-' + this.sort.column : this.sort.column;
  }
  doAction(inputParam) {
  }
}
