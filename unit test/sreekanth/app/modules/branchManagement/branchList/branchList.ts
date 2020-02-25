import { AfterContentInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { SharedService } from '../../../core/shared/shared.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { OrderBy } from '../../../core/ui-components/table-filter/pipes/orderBy';
import { SearchBy } from '../../../core/ui-components/table-filter/pipes/searchBy';
import { PickList } from '../../common/models/picklist.model';
import { BranchFormService } from '../services/branchform.service';
import { ConfigService } from './../../../core/services/config.service';
import { UtilsService } from './../../../core/ui-components/utils/utils.service';

export class TableInfo {
    mapping: string;
    header: string;
    showColumn: boolean;
    className: string;
}
@Component({
    selector: 'branch-list',
    templateUrl: 'branchList.html',

})
export class BranchListComponent implements OnInit, AfterContentInit {
    loaderConfig;
    branchArray: any[] = [];
    deleteUserModal = false;
    branchListFormGroup: FormGroup;
    errmsg = false;
    searchId: any = '';
    BranchCheckboxFormGroup: FormGroup;
    tooltipHide: boolean = false;
    tableDetails: TableInfo[] = [];
    sort: any;
    columnsList = [];
    sortByDefault = "branch_id";
    mappingList = ['branch_id', 'branch_desc', 'branch_loc', 'parent_branch_id'];
    headerList = ['NCPLabel.BranchID', 'NCPLabel.BranchDesc', 'NCPLabel.location', 'NCPLabel.parentBranchID'];
    iconsClassNames = ['', '', '', ''];
    headerListBackUp = [];
    mappingListBackUp = [];
    iconsClassNamesBackUp = [];
    placeHolder: string = 'NCPBtn.search';
    @ViewChild("columnFilterModal") columnFilterModal;
    @ViewChild('myTooltip') myTooltip;
    @ViewChild('BranchDeleteModel') BranchDeleteModel;
    @ViewChild('errorMessageModel') errorMessageModel;
    newcolumnlist = [];
    newcolumnlist1 = [];
    rotateFlag = '';
    branchidValue;
    objectValue;
    existingTooltip: any = '';
    public translated: boolean = false;
    branchUsersPickList = new PickList();
    childBranchesPickList = new PickList();
    branchUsers = [];
    childBranches = [];
    userGroups = [];
    getBranchMaxRecords = 5;
    getBranchStartIndex = 0;
    viewMore: boolean = true;
    errorMessage;
    userBranchCode: string;
    multicheckarray: any[];

    constructor(public userInfoForm: FormBuilder,
        public branchService: BranchFormService,
        public _logger: Logger,
        public config: ConfigService,
        public utils: UtilsService,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        orderBy: OrderBy,
        searchBy: SearchBy,
        shared: SharedService) {
        this.BranchCheckboxFormGroup = this.branchService.getbranchsearchmodel();
        this.loaderConfig = config;
        this.errmsg = false;
        this.branchListFormGroup = this.branchService.getbranchListModel();
        this.headerListBackUp.push(...this.headerList);
        this.mappingListBackUp.push(...this.mappingList);
        this.iconsClassNamesBackUp.push(...this.iconsClassNames);
        this.userBranchCode = this.config.getCustom('user_branch');
        this.getBranchList(this.branchListFormGroup.value);
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

    getBranchList(inputJson) {
        let branchlistResponse = this.branchService.getBranchList(inputJson);
        branchlistResponse.subscribe(
            (branchdetail) => {
                if(branchdetail){
                    if (branchdetail.error) {
                        this._logger.error('getBranchList() ===>' + branchdetail.error);
                    } else if(branchdetail instanceof Array) {
                        this.branchArray.push(...branchdetail)
                        if(branchdetail.length < 5){
                            this.viewMore = false 
                            this.changeRef.markForCheck();
                        }else{
                            this.viewMore = true
                            this.changeRef.markForCheck();
                        }
                        this.loaderConfig.setLoadingSub('no');
                    }
                }else{
                    this.loaderConfig.setLoadingSub('no');
                    this.viewMore = false 
                    this.changeRef.markForCheck();
                }
            }
        );
    }

    editBranchDetail(value, actionObject) {
        this.branchListFormGroup.reset();
        let tempJson = { "branch_id": value };

        let branchprofileresponse = this.branchService.getBranchDetails(tempJson);
        branchprofileresponse.subscribe(
            (branchdetail) => {
                if (branchdetail.error) {
                    this._logger.error('Edit() ===>' + branchdetail.error);
                } else {
                    this.branchListFormGroup.get('branch_id').disable();
                    this.config.setCustom('branchDetails', branchdetail[0]);
                    this.config.navigateRouterLink('ncp/branchManagement/branchEdit');
                    this.loaderConfig.setLoadingSub('no');
                }
            }
        );
    }

    getValueobject(value, actionObject) {
        this.branchidValue = value;
        this.objectValue = actionObject;
        this.checkForBranchUsers(this.branchidValue);
        this.checkForChildBranches(this.branchidValue);
        this.checkForUserGroups(this.branchidValue);
        this.BranchDeleteModel.open();
    }

    checkForBranchUsers(branchid){
        this.branchUsers = [];
        this.branchUsersPickList.auxType = 'BranchUsers';
        this.branchUsersPickList.param1 = branchid;
        let branchUsersResponse = this.loaderConfig.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', this.branchUsersPickList);
        branchUsersResponse.subscribe((branchUsersResponseData) => {
            if (branchUsersResponseData) {
                for (let ci = 0; ci < branchUsersResponseData.length; ci++) {
                    this.branchUsers.push(branchUsersResponseData[ci].code);
                }
            }
        });
    }

    checkForChildBranches(branchid) {
        this.childBranches = [];
        this.branchUsersPickList.auxType = 'BranchGroup';
        this.branchUsersPickList.param1 = branchid;
        let childBranchesResponse = this.loaderConfig.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', this.branchUsersPickList);
        childBranchesResponse.subscribe((childBranchesResponseData) => {
            if (childBranchesResponseData) {
                for (let ci = 0; ci < childBranchesResponseData.length; ci++) {
                    this.childBranches.push(childBranchesResponseData[ci].code);
                }
            }
        });
    }

    checkForUserGroups(branchid) {
        this.userGroups = [];
        this.branchUsersPickList.auxType = 'UserGroup';
        this.branchUsersPickList.param1 = branchid;
        let userGroupsResponse = this.loaderConfig.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', this.branchUsersPickList);
        userGroupsResponse.subscribe((userGroupsResponseData) => {
            if (userGroupsResponseData) {
                for (let ci = 0; ci < userGroupsResponseData.length; ci++) {
                    this.userGroups.push(userGroupsResponseData[ci].code);
                }
            }
        });
    }

    deleteBranchDetail(value, actionObject) {
        let getBranchdetailsArray: any[] = [];
        getBranchdetailsArray.push(this.branchService.getbranchformModel().value);
        getBranchdetailsArray[0].branch_id = value;
        let branchprofileresponse = this.branchService.deleteBranchDetails(getBranchdetailsArray);
        branchprofileresponse.subscribe(
            (branchdetail) => {
                if (branchdetail.error) {
                    this._logger.error('Delete Branch() ===>' + branchdetail.error);
                    this.BranchDeleteModel.close();
                    this.errorMessage = branchdetail.error[0].errDesc
                    this.errorMessageModel.open();
                } else {
                    if (branchdetail.status == true) {
                        this.loaderConfig.setLoadingSub('no');
                        this.deleteUserModal = true;
                    }
                }
                this.branchArray = [];
                this.branchListFormGroup = this.branchService.getbranchformModel();
                this.getBranchList(this.branchListFormGroup.value);
                this.changeRef.markForCheck();
            });
    }

    navigateBranchList() {
        this.branchService.getbranchformModel().reset();
        this.getBranchList(this.branchService.getbranchformModel().value);    
    }

    doAction(inputParam) {
    }

    setBranchEditDisableFields(branchListFormGroup) {
        this.branchListFormGroup = branchListFormGroup;
        this.branchListFormGroup.get('branch_id').disable();
        return this.branchListFormGroup;
    }
    ngAfterContentInit() {
        this.multicheckarray = [
            { value: 'ID', label: 'NCPLabel.BranchID', elementControl: this.BranchCheckboxFormGroup.controls['branch_id'] },
            { value: 'DS', label: 'NCPLabel.BranchDesc', elementControl: this.BranchCheckboxFormGroup.controls['branch_desc'] },
            { value: 'LC', label: 'NCPLabel.location', elementControl: this.BranchCheckboxFormGroup.controls['branch_loc'] },
            { value: 'PI', label: 'NCPLabel.parentBranchID', elementControl: this.BranchCheckboxFormGroup.controls['parent_branch_id'] },
        ];
        this.config.setCustom('BranchCheckboxFormGroup', this.BranchCheckboxFormGroup.value); // storing the initial BranchCheckboxFormGroup value config file array

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
    colhide(): any {
        if (this.BranchCheckboxFormGroup.controls['branch_id'].value == true || this.BranchCheckboxFormGroup.controls['branch_desc'].value == true || this.BranchCheckboxFormGroup.controls['branch_loc'].value == true || this.BranchCheckboxFormGroup.controls['parent_branch_id'].value == true) {
            this.newcolumnlist = [];
            this.newcolumnlist1 = [];
            for (var i = 0; i < this.headerListBackUp.length; i++) {
                if (this.BranchCheckboxFormGroup.controls['branch_id'].value == false && this.headerListBackUp[i] == "NCPLabel.BranchID") { continue; }
                if (this.BranchCheckboxFormGroup.controls['branch_desc'].value == false && this.headerListBackUp[i] == "NCPLabel.BranchDesc") { continue; }
                if (this.BranchCheckboxFormGroup.controls['branch_loc'].value == false && this.headerListBackUp[i] == "NCPLabel.location") { continue; }
                if (this.BranchCheckboxFormGroup.controls['parent_branch_id'].value == false && this.headerListBackUp[i] == "NCPLabel.parentBranchID") { continue; }
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
            this.columnFilterModal.close();
            this.errmsg = false;
        }
        else {
            this.errmsg = true;
        }
        this.config.setCustom('BranchCheckboxFormGroup', this.BranchCheckboxFormGroup.value); 

    }
    settingsClose() {
        this.BranchCheckboxFormGroup.patchValue(this.config.getCustom('BranchCheckboxFormGroup')); 
    }

    doViewMore() {
        this.getBranchStartIndex =  5 + this.getBranchStartIndex
        this.branchListFormGroup.controls['startIndex'].patchValue(this.getBranchStartIndex);
        this.getBranchList(this.branchListFormGroup.value);
    }

    filterBranches(){
        this.branchArray =[];
        this.getBranchStartIndex = 0
        this.branchListFormGroup.controls['startIndex'].patchValue(this.getBranchStartIndex);
        this.getBranchList(this.branchListFormGroup.value);
    }
}
