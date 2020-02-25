import { ChangeDetectorRef, Component, ViewChild, OnInit, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { UserGroupService } from '../services/userGroup.service';
import { SharedService } from '../../../core/shared/shared.service';


export class TableInfo {
    mapping: string;
    header: string;
    showColumn: boolean;
    className: string;
}
@Component({
    selector: 'userGroup-list',
    templateUrl: 'userGroupList.html',

})

export class UserGroupListComponent implements OnInit, AfterContentInit {
    loaderConfig;
    userGroupArray: any[] = [];
    deleteUserGroupModal = false;
    userGroupListFormGroup: FormGroup;
    errmsg = false;
    searchId: any = '';
    userGroupboxFormGroup: FormGroup;
    tooltipHide: boolean = false;
    tableDetails: TableInfo[] = [];
    sort: any;
    columnsList = [];
    sortByDefault = "user_group_code";
    mappingList = ['user_group_code', 'branch_desc', 'user_group_desc', 'oprId'];
    headerList = ['NCPLabel.userGroupId', 'NCPLabel.BranchDesc', 'NCPLabel.userGroupDesc', 'NCPLabel.createdBy'];
    iconsClassNames = ['', '', '', ''];
    headerListBackUp = [];
    mappingListBackUp = [];
    iconsClassNamesBackUp = [];
    placeHolder: string = 'NCPBtn.search';
    @ViewChild("columnFilterModal") columnFilterModal;
    @ViewChild('myTooltip') myTooltip;
    @ViewChild('userGroupDeleteModel') userGroupDeleteModel;
    newcolumnlist = [];
    newcolumnlist1 = [];
    rotateFlag = '';
    objectValue;
    userGroupIdValue;
    existingTooltip: any = '';
    deletedUserGroupID: any = '';
    getUgMaxRecords = 5;
    getUgStartIndex = 0;
    viewMore: boolean = true;
    userBranchCode: string;
    public translated: boolean = false;
    multicheckarray: any[];
    
    constructor(public userInfoForm: FormBuilder,
        public userGroupService: UserGroupService,
        public _logger: Logger,
        public config: ConfigService,
        public utils: UtilsService,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        shared: SharedService
    ) {
        this.userGroupboxFormGroup = this.userGroupService.getusersearchmodel();
        this.loaderConfig = config;
        this.userGroupListFormGroup = this.userGroupService.getUserGroupListModel();
        this.getUserGroupList(this.userGroupListFormGroup.value);
        this.errmsg = false;
        this.headerListBackUp.push(...this.headerList);
        this.mappingListBackUp.push(...this.mappingList);
        this.iconsClassNamesBackUp.push(...this.iconsClassNames);
        this.userBranchCode = this.config.getCustom('user_branch');
      
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

    getUserGroupList(inputJson) {
        let userGrouplistResponse = this.userGroupService.getUserGroupList(inputJson);
        userGrouplistResponse.subscribe(
            (userGroupdetail) => {
                if(userGroupdetail){
                    if (userGroupdetail.error) {
                        this._logger.error('getUserGroupList() ===>' + userGroupdetail.error);
                    } else {
                        this.userGroupArray.push(...userGroupdetail);
                        this.loaderConfig.setLoadingSub('no');
                        this.changeRef.markForCheck();
                    }
                    if(userGroupdetail.length <5){
                        this.viewMore = false 
                        this.changeRef.markForCheck();
                    }else{
                        this.viewMore = true
                        this.changeRef.markForCheck();
                    }
                }else{
                    this.loaderConfig.setLoadingSub('no');
                    this.viewMore = false 
                    this.changeRef.markForCheck();
                }
            }
        );
    }

    editUserGroupDetail(value, actionObject) {
        this.userGroupListFormGroup.reset();
        let tempJson = { "user_group_code": value };
        let userGroupProfileResponse = this.userGroupService.getUserGroupDetails(tempJson);
        userGroupProfileResponse.subscribe(
            (userGroupdetail) => {
                if (userGroupdetail.error) {
                    this._logger.error('Edit() ===>' + userGroupdetail.error);
                } else {
                    this.userGroupListFormGroup.get('user_group_code').disable();
                    this.config.setCustom('userGroupDetails', userGroupdetail);
                    this.config.navigateRouterLink('ncp/userGroupManagement/userGroupEdit');
                    this.loaderConfig.setLoadingSub('no');
                }
            }
        );
    }

    getValueobject(value, actionObject) {
        this.userGroupIdValue = value;
        this.objectValue = actionObject;
        this.userGroupDeleteModel.open();
    }

    deleteUserGroupDetail(value, actionObject) {
        let getUserGroupdetailsArray: any[] = [];
        getUserGroupdetailsArray.push(this.userGroupService.getuserGroupFormModel().value);
        getUserGroupdetailsArray[0].user_group_code = value;
        this.deletedUserGroupID = value;
        let userGroupProfileResponse = this.userGroupService.deleteUserGroupDetails(getUserGroupdetailsArray);
        userGroupProfileResponse.subscribe(
            (userGroupdetail) => {
                if (userGroupdetail.error) {
                    this._logger.error('Delete User Group() ===>' + userGroupdetail.error);
                } else {
                    if (userGroupdetail.status == true) {
                        this.loaderConfig.setLoadingSub('no');
                        this.deleteUserGroupModal = true;
                    }
                }
                this.userGroupArray = [];
                this.getUserGroupList(this.userGroupListFormGroup.value);
                this.changeRef.markForCheck();
            });
    }
    navigateUserGroupList() {
        this.userGroupArray = [];
        this.getUserGroupList(this.userGroupListFormGroup.value);
        this.deleteUserGroupModal = false;
    }

    ngAfterContentInit() {

        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });
        this.multicheckarray = [
            { value: 'UI', label: 'NCPLabel.userGroupId', elementControl: this.userGroupboxFormGroup.controls['user_group_code'] },
            { value: 'DS', label: 'NCPLabel.BranchDesc', elementControl: this.userGroupboxFormGroup.controls['branch_desc'] },
            { value: 'UD', label: 'NCPLabel.userGroupDesc', elementControl: this.userGroupboxFormGroup.controls['user_group_desc'] },
            { value: 'CB', label: 'NCPLabel.createdBy', elementControl: this.userGroupboxFormGroup.controls['created_by'] },
        ];
        this.config.setCustom('userGroupboxFormGroup', this.userGroupboxFormGroup.value);
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
        if (this.userGroupboxFormGroup.controls['user_group_code'].value == true || this.userGroupboxFormGroup.controls['branch_id'].value == true || this.userGroupboxFormGroup.controls['branch_desc'].value == true || this.userGroupboxFormGroup.controls['user_group_desc'].value == true || this.userGroupboxFormGroup.controls['created_by'].value == true) {
            this.newcolumnlist = [];
            this.newcolumnlist1 = [];
            for (var i = 0; i < this.headerListBackUp.length; i++) {
                if (this.userGroupboxFormGroup.controls['user_group_code'].value == false && this.headerListBackUp[i] == "NCPLabel.userGroupId") { continue; }
                if (this.userGroupboxFormGroup.controls['branch_desc'].value == false && this.headerListBackUp[i] == "NCPLabel.BranchDesc") { continue; }
                if (this.userGroupboxFormGroup.controls['branch_id'].value == false && this.headerListBackUp[i] == "NCPLabel.BranchID") { continue; }
                if (this.userGroupboxFormGroup.controls['user_group_desc'].value == false && this.headerListBackUp[i] == "NCPLabel.userGroupDesc") { continue; }
                if (this.userGroupboxFormGroup.controls['created_by'].value == false && this.headerListBackUp[i] == "NCPLabel.createdBy") { continue; }
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
        this.config.setCustom('userGroupboxFormGroup', this.userGroupboxFormGroup.value);
    }

    settingsClose() {
        this.userGroupboxFormGroup.patchValue(this.config.getCustom('userGroupboxFormGroup'));
    }

    doViewMore() {
        this.getUgStartIndex =  5 + this.getUgStartIndex
        this.userGroupListFormGroup.controls['startIndex'].patchValue(this.getUgStartIndex);
        this.getUserGroupList(this.userGroupListFormGroup.value);
    }

    filterUserGroups(){
        this.userGroupArray = []
        this.getUgStartIndex = 0
        this.userGroupListFormGroup.controls['startIndex'].patchValue(this.getUgStartIndex);
        this.getUserGroupList(this.userGroupListFormGroup.value);
    }
}











