import { AfterContentInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from "../../../../core/adapters/packageAdapter";
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UtilsService } from "../../../../core/ui-components/utils/utils.service";
import { EventService } from "../../../../core/services/event.service";
import { BreadCrumbService } from "../../../common/index";
import { ConfigService } from "../../../../core/services/config.service";
import { Logger } from '../../../../core/ui-components/logger';
import { MiscSetupService } from '../services/miscsetup.service';

export class TableInfo {
  mapping: string;
  header: string;
  showColumn: boolean;
  className: string;
}
@Component({
  selector: 'miscSetupList',
  templateUrl: './miscSetupList.component.html'
})
export class MiscSetupListComponent implements OnInit {
  miscSetupFormGroup: FormGroup;
  formBuilder: FormBuilder;
  miscSetupArray: any[] = [];
  mappingList = ['miscType', 'miscCode', 'miscCodeDesc'];
  headerList = ['NCPLabel.miscType', 'NCPLabel.miscCode', 'NCPLabel.miscCodeDesc'];
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
  @ViewChild('miscSetupDeleteModel') miscSetupDeleteModel;
  enableShowMoreButton: boolean = true;
  disableShowMoreButton: boolean = false;
  policyHolderTypeFlag: boolean = false;
  newTableDetails = [];
  miscCodeValue;
  miscTypeValue;
  constructor(public translate: TranslateService,
    public miscSetupService: MiscSetupService,
    public utilsService: UtilsService,
    public _partyRoleFormFB: FormBuilder,
    public changeRef: ChangeDetectorRef,
    _eventHandler: EventService,
    public config: ConfigService,
    public _logger: Logger,
    breadCrumbService: BreadCrumbService) {
    this.loaderConfig = config;
    this.miscSetupFormGroup = this.miscSetupService.getMiscSetupFormInfo();
  }

  ngOnInit() {
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.loaderConfig.currentLangName);
      }
    });
    this.columnsList = [];
    this.getMiscInfoList(this.miscSetupFormGroup.value);
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
  getMiscInfoList(inputJson) {
    let getMiscSetupResponce = this.miscSetupService.getMiscInfoList(inputJson);
    getMiscSetupResponce.subscribe(
      (miscSetupDetail) => {
        if (miscSetupDetail) {
          if (miscSetupDetail.error) {
            this._logger.error('getMiscInfoList() ===>' + miscSetupDetail.error);
          } else if (miscSetupDetail instanceof Array) {
            this.miscSetupArray.push(...miscSetupDetail)
            if (miscSetupDetail.length < 5) {
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
  getValueobject(type, value) {
    this.miscTypeValue = type;
    this.miscCodeValue = value;
    this.miscSetupDeleteModel.open();
  }
  deleteMiscSetupDetail(miscTypeValue, miscCodeValue) {
    let getmiscSetupDetailsArray = { "miscType": miscTypeValue, "miscCode": miscCodeValue };
    let miscSetupResponse = this.miscSetupService.deleteMiscInfo(getmiscSetupDetailsArray);
    miscSetupResponse.subscribe(
      (data) => {
        if (data.error) {

          this._logger.error('Delete MiscCode() ===>' + data.error);
        } else {
          if (data.status == true) {
            this.miscSetupArray = [];
            this.miscSetupFormGroup.reset();
            this.getStartIndex = 0;
            this.miscSetupFormGroup.controls['startIndex'].patchValue(this.getStartIndex);
            this.miscSetupFormGroup.controls['maxRecords'].patchValue(5);
            this.getMiscInfoList(this.miscSetupFormGroup.value);
          }
        }
        this.loaderConfig.setLoadingSub('no');
        this.changeRef.markForCheck();
      });
  }
  editMiscSetupDetail(miscCodeValue) {
    this.miscSetupFormGroup.reset();
    let tempJson = { "miscCode": miscCodeValue };
    let miscSetupprofileresponse = this.miscSetupService.getMiscInfoDetails(tempJson);
    miscSetupprofileresponse.subscribe(
      (miscSetupDetail) => {
        if (miscSetupDetail.error) {
          this._logger.error('Edit() ===>' + miscSetupDetail.error);
        } else {
          this.miscSetupFormGroup.get('miscCode').disable();
          this.config.setCustom('miscSetupDetails', miscSetupDetail[0]);
          this.config.navigateRouterLink('ncp/miscsetup/miscSetupEdit');
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
    this.miscSetupFormGroup.controls['startIndex'].patchValue(this.getStartIndex);
    this.getMiscInfoList(this.miscSetupFormGroup.value);
  }
  navigateMiscSetupList() {
    this.miscSetupArray = [];
    this.miscSetupFormGroup.reset();
    this.miscSetupFormGroup.controls['startIndex'].patchValue(this.getStartIndex);
    this.miscSetupFormGroup.controls['maxRecords'].patchValue(5);
    this.getMiscInfoList(this.miscSetupFormGroup.value);
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
    this.miscSetupArray = [];
    this.getStartIndex = 0;
    this.miscSetupFormGroup.controls['startIndex'].patchValue(this.getStartIndex);
    this.miscSetupFormGroup.controls['maxRecords'].patchValue(5);
    this.getMiscInfoList(this.miscSetupFormGroup.value);
  }
  convertSorting(): string {
    return this.sort.descending ? '-' + this.sort.column : this.sort.column;
  }
  doAction(inputParam) {
  }
}
