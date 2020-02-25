import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from "../../../../core/adapters/packageAdapter";
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ProductFactory } from '../../../../core/factory/productfactory';
import { UtilsService } from "../../../../core/ui-components/utils/utils.service";
import { EventService } from "../../../../core/services/event.service";
import { BreadCrumbService } from "../../../common/index";
import { ConfigService } from "../../../../core/services/config.service";
import { Logger } from '../../../../core/ui-components/logger';
import { MakeModelService } from '../services/makemodel.service';


export class TableInfo {
  mapping: string;
  header: string;
  showColumn: boolean;
  className: string;
}

@Component({
  selector: 'model-list',
  templateUrl: './modelList.component.html'
})
export class ModelListComponent implements OnInit {
  modelListFormGroup: FormGroup;
  formBuilder: FormBuilder;
  personalDetailsFormGroup: FormGroup;
  searchPersonalDetailsFormGroup: FormGroup;
  loaderConfig;
  modelCodeValue;
  makeCodeValue;
  searchId: any = '';
  @ViewChild("columnFilterModal") columnFilterModal;
  @ViewChild('myTooltip') myTooltip;
  @ViewChild('modelDeleteModel') modelDeleteModel;
  enableShowMoreButton: boolean = true;
  disableShowMoreButton: boolean = false;
  policyHolderTypeFlag: boolean = false;
  ModelCreationDetailsTableData: any[] = [];
  backupTableData = [];
  //getBranchMaxRecords = 5;
  getModelStartIndex = 0;
  searchErrmsg: boolean = false;
  viewMore: boolean = true;
  inputJson;
  mappingList = ['modelCode', 'modelCodeDesc', 'makeCode'];
  headerList = ['NCPLabel.modelCode', 'NCPLabel.modelCodeDescription', 'NCPLabel.make'];
  columnsList = [];
  tableDetails: TableInfo[] = [];
  iconsClassNames = ['', '', ''];
  sortByDefault = "name";
  sort: any;
  newTableDetails = [];
  setTableFlag: boolean = true;
  changeRef: any;
  placeHolder: string = 'NCPBtn.search';
  constructor(public translate: TranslateService,
    public makeModelService: MakeModelService,
    public utilsService: UtilsService,
    public _partyRoleFormFB: FormBuilder,
    _eventHandler: EventService,
    public config: ConfigService,

    public _logger: Logger,
    _makeModelService: MakeModelService,
    breadCrumbService: BreadCrumbService) {
    this.loaderConfig = config;
    this.modelListFormGroup = this.makeModelService.getModelListInfo();
    //this.modelListFormGroup = this.makeModelService.getModelList();  
  }

  ngOnInit() {
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.loaderConfig.currentLangName);
      }
    });
    this.columnsList = [];
    this.getModelCreationDataByLazyLoading(this.modelListFormGroup.value);
    let tableLength = this.mappingList.length;
    for (let i = 0; i < tableLength; i++) {
      this.columnsList.push({ header: this.headerList[i], mapping: this.mappingList[i], showColumn: true, className: this.iconsClassNames[i] });
    }
    this.tableDetails = this.columnsList;
    this.sort = {
      column: this.sortByDefault,
      descending: false
    };
  };
  selectedClass(columnName): any {
    return columnName === this.sort.column ? 'sort-' + this.sort.descending : false;
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

  getModelCreationDataByLazyLoading(inputJson) {
    inputJson['modelFlag'] = false;
    let getModelCreationDetails = this.makeModelService.getMakeModelList(inputJson);
    getModelCreationDetails.subscribe(
      (MakeDataVal) => {
        if (MakeDataVal) {
          let getModelCreationDetailsResponse = MakeDataVal;
          if (getModelCreationDetailsResponse.length < 5) {
            this.viewMore = false;
          } else {
            this.viewMore = true;
          }

          this.ModelCreationDetailsTableData.push(...getModelCreationDetailsResponse);
          this.backupTableData = this.ModelCreationDetailsTableData;
        }
        else {
          this.loaderConfig.setLoadingSub('no');
          this.viewMore = false
          this.changeRef.markForCheck();
        }
      });
  }
  convertSorting(): string {
    return this.sort.descending ? '-' + this.sort.column : this.sort.column;
  }
  getValueobject(value, value2) {
    this.modelCodeValue = value;
    this.makeCodeValue = value2;
    this.modelDeleteModel.open();
  }
  deleteModelDetail(modelCodevalue, makeCodevalue) {
    let getModeldetailsArray = { "modelCode": modelCodevalue, 'makeCode': makeCodevalue, 'modelFlag': false };
    //getModeldetailsArray["modelCode"] = value;
    let userprofileresponse = this.makeModelService.deleteMake(getModeldetailsArray);
    userprofileresponse.subscribe(
      (userdetail) => {
        if (userdetail.error) {

          this._logger.error('Delete User() ===>' + userdetail.error);
        } else {
          if (userdetail.status == true) {
            this.ModelCreationDetailsTableData = [];
            this.modelListFormGroup.reset();
            this.getModelStartIndex = 0;
            this.modelListFormGroup.controls['startIndex'].patchValue(this.getModelStartIndex);
            this.modelListFormGroup.controls['maxRecords'].patchValue(5);
            this.getModelCreationDataByLazyLoading(this.modelListFormGroup.value);
          }
        }
        this.loaderConfig.setLoadingSub('no');
        this.changeRef.markForCheck();
      });
  }
  editModelDetail(modelCodevalue) {
    this.modelListFormGroup.reset();
    let tempJson = { "modelCode": modelCodevalue, "modelFlag": false };
    let modelprofileresponse = this.makeModelService.getMakeModelDetails(tempJson);
    modelprofileresponse.subscribe(
      (modeldetail) => {
        if (modeldetail.error) {
          this._logger.error('Edit() ===>' + modeldetail.error);
        } else {
          this.modelListFormGroup.get('modelCode').disable();
          this.modelListFormGroup.get('makeCode').disable();
          this.config.setCustom('modelCodeDetails', modeldetail[0]);
          this.config.navigateRouterLink('ncp/makemodel/modelEdit');
          this.loaderConfig.setLoadingSub('no');
        }
      }
    );
  }
  doViewMore() {
    this.getModelStartIndex = 5 + this.getModelStartIndex;
    this.modelListFormGroup.controls['startIndex'].patchValue(this.getModelStartIndex);
    this.getModelCreationDataByLazyLoading(this.modelListFormGroup.value);
  }
  navigateModelList() {
    this.modelDeleteModel.close();
    this.ModelCreationDetailsTableData = [];
    this.modelListFormGroup.reset();
    this.getModelCreationDataByLazyLoading(this.modelListFormGroup.value);
  }
  filterModels() {
    this.ModelCreationDetailsTableData = [];
    this.getModelStartIndex = 0;
    this.modelListFormGroup.controls['startIndex'].patchValue(this.getModelStartIndex);
    this.getModelCreationDataByLazyLoading(this.modelListFormGroup.value);
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
}
