import { TranslateService } from '@adapters/packageAdapter';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config.service';
import { SharedService } from '../../../../core/shared/shared.service';
import { Logger } from '../../../../core/ui-components/logger';
import { MakeModelService } from "../services/makemodel.service";

export class TableInfo {
    mapping: string;
    header: string;
    showColumn: boolean;
    className: string;
}
@Component({
    selector: 'makeList',
    templateUrl: './makeList.component.html'
})
export class MakeListComponent implements OnInit {
    loaderConfig;
    makeArray: any[] = [];
    deleteUserModal = false;
    makeListFormGroup: FormGroup;
    errmsg = false;
    searchId: any = '';
    //makeCheckboxFormGroup: FormGroup;
    tooltipHide: boolean = false;
    tableDetails: TableInfo[] = [];
    sort: any;
    columnsList = [];
    sortByDefault = "makeCode";
    mappingList = ['makeCode', 'makeCodeDesc'];
    headerList = ['NCPLabel.makeCode', 'NCPLabel.makeCodeDescription'];
    iconsClassNames = ['', '', '', ''];
    headerListBackUp = [];
    mappingListBackUp = [];
    iconsClassNamesBackUp = [];
    placeHolder: string = 'NCPBtn.search';
    @ViewChild("columnFilterModal") columnFilterModal;
    @ViewChild('myTooltip') myTooltip;
    @ViewChild('makeDeleteModal') makeDeleteModal;
    @ViewChild('makeDeleteModel') makeDeleteModel;
    newcolumnlist = [];
    newcolumnlist1 = [];
    rotateFlag = '';
    makeCodeValue;
    objectValue;
    existingTooltip: any = '';
    public translated: boolean = false;

    branchUsers = [];
    childBranches = [];
    userGroups = [];
    getBranchMaxRecords = 5;
    getMakeStartIndex = 0;
    viewMore: boolean = true;
    errorMessage;
    userBranchCode: string;
    multicheckarray: any[];

    constructor(public userInfoForm: FormBuilder,
        public makeModelService: MakeModelService,
        public _logger: Logger,
        public config: ConfigService,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        sharedService: SharedService) {
        //this.makeCheckboxFormGroup = this.makeModelService.getbranchsearchmodel();
        this.loaderConfig = config;
        this.errmsg = false;
        this.makeListFormGroup = this.makeModelService.getMakeListInfo();
        this.headerListBackUp.push(...this.headerList);
        this.mappingListBackUp.push(...this.mappingList);
        this.iconsClassNamesBackUp.push(...this.iconsClassNames);
        this.userBranchCode = this.config.getCustom('user_branch');
        this.getMakelist(this.makeListFormGroup.value);
    }

    ngOnInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });

        if (this.mappingList) {
            let tableLength = this.mappingList.length;
            for (let i = 0; i < tableLength; i++) {
                this.columnsList.push({ header: this.headerList[i], mapping: this.mappingList[i], showColumn: true, className: this.iconsClassNames[i] });
            }
        }
        this.tableDetails = this.columnsList;
        this.sort = {
            column: this.sortByDefault,
            descending: false
        };
    }

    getMakelist(inputJson) {
        inputJson['modelFlag'] = true;
        let makeModelResponse = this.makeModelService.getMakeModelList(inputJson);
        makeModelResponse.subscribe(
            (makeDetails) => {
                if (makeDetails) {
                    if (makeDetails.error) {
                        this._logger.error('getMakelist() ===>' + makeDetails.error);
                    } else if (makeDetails instanceof Array) {
                        this.makeArray.push(...makeDetails)
                        if (makeDetails.length < 5) {
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

    editMakeDetail(value, actionObject) {
        this.makeListFormGroup.reset();
        let tempJson = { "makeCode": value, "modelFlag": true };
        let makeprofileresponse = this.makeModelService.getMakeModelDetails(tempJson);
        makeprofileresponse.subscribe(
            (makedetail) => {
                if (makedetail.error) {
                    this._logger.error('Edit() ===>' + makedetail.error);
                } else {
                    this.makeListFormGroup.get('makeCode').disable();
                    this.config.setCustom('makeCodeDetails', makedetail[0]);
                    this.config.navigateRouterLink('ncp/makemodel/makeEdit');
                    this.loaderConfig.setLoadingSub('no');
                }
            }
        );
    }

    getValueobject(value, actionObject) {
        this.makeCodeValue = value;
        this.objectValue = actionObject;
        this.makeDeleteModal.open();
    }




    deleteMakeDetail(value) {
        let getMakedetailsArray = { 'makeCode': value, 'modelFlag': true };
        let userprofileresponse = this.makeModelService.deleteMake(getMakedetailsArray);
        userprofileresponse.subscribe(
            (userdetail) => {
                if (userdetail.error) {
                    this._logger.error('Delete User() ===>' + userdetail.error);
                } else {
                    if (userdetail.status == true) {
                        this.makeArray = [];
                        this.makeListFormGroup.reset();
                        this.getMakeStartIndex = 0;
                        this.makeListFormGroup.controls['startIndex'].patchValue(this.getMakeStartIndex);
                        this.makeListFormGroup.controls['maxRecords'].patchValue(5);
                        this.getMakelist(this.makeListFormGroup.value);

                    }

                }
                this.loaderConfig.setLoadingSub('no');
                this.changeRef.markForCheck();
            });
    }

    navigateBranchList() {
        this.makeModelService.getMakeModelInfo().reset();
        this.getMakelist(this.makeModelService.getMakeModelInfo().value);
    }

    doAction(inputParam) {
    }

    setBranchEditDisableFields(makeListFormGroup) {
        this.makeListFormGroup = makeListFormGroup;
        this.makeListFormGroup.get('branch_id').disable();
        return this.makeListFormGroup;
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
    selectedClass(columnName): any {
        return columnName === this.sort.column ? 'sort-' + this.sort.descending : false;
    }
    convertSorting(): string {
        return this.sort.descending ? '-' + this.sort.column : this.sort.column;
    }

    doViewMore() {
        this.getMakeStartIndex = 5 + this.getMakeStartIndex
        this.makeListFormGroup.controls['startIndex'].patchValue(this.getMakeStartIndex);
        this.getMakelist(this.makeListFormGroup.value);
    }

    filterMake() {
        this.makeArray = [];
        this.getMakeStartIndex = 0
        this.makeListFormGroup.controls['startIndex'].patchValue(this.getMakeStartIndex);
        this.getMakelist(this.makeListFormGroup.value);
    }
    navigateModelList() {

    }

}
