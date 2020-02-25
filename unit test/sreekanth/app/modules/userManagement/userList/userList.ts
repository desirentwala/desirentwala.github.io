import { AfterContentInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UserFormService } from '../services/userform.service';
import { ConfigService } from './../../../core/services/config.service';
import { UtilsService } from './../../../core/ui-components/utils/utils.service';
import { SharedService } from '../../../core/shared/shared.service';
import { PickList } from '../../common/models/picklist.model';

export class TableInfo {
    mapping: string;
    header: string;
    showColumn: boolean;
    className: string;
}
@Component({
    selector: 'user-list',
    templateUrl: 'userList.html',

})
export class UserListComponent implements OnInit, AfterContentInit {
    loaderConfig;
    userArray: any[] = [];
    deleteUserModal = false;
    userMaintenanceFormGroup: FormGroup;
    userListFormGroup: FormGroup;

    errmsg = false;
    searchId: any = '';
    UserCheckboxFormGroup: FormGroup;
    tooltipHide: boolean = false;
    tableDetails: TableInfo[] = [];
    sort: any;
    columnsList = [];
    sortByDefault = "user_id";
    mappingList = ['user_id', 'user_name', 'user_branch', 'user_prf_group_desc', 'roleId_desc'];
    headerList = ['NCPLabel.UserID', 'NCPLabel.userName', 'NCPLabel.branchCode', 'NCPLabel.userProfileGroup', 'NCPLabel.roleId'];
    iconsClassNames = ['', '', '', ''];
    headerListBackUp = [];
    mappingListBackUp = [];
    iconsClassNamesBackUp = [];
    placeHolder: string = 'NCPBtn.search';
    @ViewChild("columnFilterModal") columnFilterModal;
    @ViewChild('myTooltip') myTooltip;
    @ViewChild('userDeleteModel') userDeleteModel;
    newcolumnlist = [];
    newcolumnlist1 = [];
    rotateFlag = '';
    useridValue;
    objectValue;
    existingTooltip: any = '';
    public translated: boolean = false;
    getUsersMaxRecords = 5;
    getUsersStartIndex = 0;
    viewMore: boolean = true;
    childUsers = []
    childUsersPickList = new PickList();
    userstatus: any[] = [
        { label: 'NCPLabel.Active', value: 'A' },
        { label: 'NCPLabel.suspend', value: 'S' }
    ];
    switchbutton: any = "";
    currentUserBranch: string;

    constructor(public userInfoForm: FormBuilder,
        public userService: UserFormService,
        public _logger: Logger,
        public config: ConfigService,
        public utils: UtilsService,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        public sharedService: SharedService
    ) {
        this.UserCheckboxFormGroup = this.userService.getusersearchmodel();
        this.loaderConfig = config;
        this.errmsg = false;
        this.userMaintenanceFormGroup = this.userService.getuserformModel();
        this.userListFormGroup = this.userService.getuserListmodel()
        this.headerListBackUp.push(...this.headerList);
        this.mappingListBackUp.push(...this.mappingList);
        this.iconsClassNamesBackUp.push(...this.iconsClassNames);
        this.getUserList();
        this.currentUserBranch = this.config.getCustom('user_branch')
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
    getUserList() {
        let userlistResponse = this.userService.getUserList(this.userListFormGroup.value);
        userlistResponse.subscribe(
            (userdetail) => {
                if (userdetail) {
                    if (userdetail.error) {
                        this._logger.error('getUserList() ===>' + userdetail.error);
                    } else {
                        for (let i = 0; i < userdetail.length; i++) {
                            this.userArray.push(userdetail[i]);
                            this.changeRef.markForCheck();
                        }
                        if (userdetail.length < 5) {
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
    editUserDetail(value, actionObject) {
        let getUserdetailsArray: any[] = [];
        this.userMaintenanceFormGroup.reset();
        getUserdetailsArray.push(this.userService.getuserformModel().value);
        getUserdetailsArray[0].user_id = value;
        let userprofileresponse = this.userService.getUserDetails(getUserdetailsArray);
        userprofileresponse.subscribe(
            (userdetail) => {
                if (userdetail.error) {
                    this._logger.error('Edit() ===>' + userdetail.error);
                } else {
                    if (userdetail.product_list === ' ') {
                        userdetail.product_list = '';
                    }
                    this.userMaintenanceFormGroup.get('user_id').disable();
                    this.userService.setUserFormModel(userdetail);
                    this.config.setCustom('userDetails', userdetail);
                    this.config.navigateRouterLink('ncp/userManagement/userEdit');
                    this.loaderConfig.setLoadingSub('no');
                }
                if (userprofileresponse.observers && userprofileresponse.observers.length > 0) {
                    userprofileresponse.observers.pop();
                }
            }
        );
    }

    getValueobject(value, actionObject) {
        this.useridValue = value;
        this.objectValue = actionObject;
        this.checkForChildUsers(this.useridValue)
        this.userDeleteModel.open();
    }

    deleteUserDetail(value, actionObject) {
        let getUserdetailsArray: any[] = [];
        getUserdetailsArray.push(this.userService.getuserformModel().value);
        getUserdetailsArray[0].user_id = value;
        let userprofileresponse = this.userService.deleteUserDetails(getUserdetailsArray);
        userprofileresponse.subscribe(
            (userdetail) => {
                if (userdetail.error) {
                    this._logger.error('Delete User() ===>' + userdetail.error);
                } else {
                    if (userdetail.status == true) {
                        this.loaderConfig.setLoadingSub('no');
                        this.deleteUserModal = true;
                    }
                }
                this.userArray = [];
                this.getUserList();
                this.changeRef.markForCheck();
            });
    }
    navigateUserList() {    
        this.userArray = [];
        this.getUserList();
        this.deleteUserModal = false;
    }

    checkForChildUsers(userId) {
        this.childUsers = [];
        this.childUsersPickList.auxType = 'ChildUsers';
        this.childUsersPickList.param1 = userId;
        let userGroupsResponse = this.loaderConfig.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', this.childUsersPickList);
        userGroupsResponse.subscribe((userGroupsResponseData) => {
            if (userGroupsResponseData) {
                for (let ci = 0; ci < userGroupsResponseData.length; ci++) {
                    this.childUsers.push(userGroupsResponseData[ci].code);
                }
            }
        });
    }

    
    doAction(inputParam) {
    }
    setUserEditDisableFields(userMaintenanceFormGroup) {
        this.userMaintenanceFormGroup = userMaintenanceFormGroup;
        this.userMaintenanceFormGroup.get('user_id').disable();
        this.userMaintenanceFormGroup.get('user_name').disable();
        this.userMaintenanceFormGroup.get('user_status').disable();
        return this.userMaintenanceFormGroup;
    }
    multicheckarray: any[];
    ngAfterContentInit() {
        this.multicheckarray = [
            { value: 'NM', label: 'NCPLabel.userName', elementControl: this.UserCheckboxFormGroup.controls['user_name'] },
            { value: 'ID', label: 'NCPLabel.UserID', elementControl: this.UserCheckboxFormGroup.controls['user_id'] },
            { value: 'GC', label: 'NCPLabel.userProfileGroup', elementControl: this.UserCheckboxFormGroup.controls['user_prf_group_desc'] },
            { value: 'UT', label: 'NCPLabel.roleId', elementControl: this.UserCheckboxFormGroup.controls['roleId_desc'] },
            { value: 'BC', label: 'NCPLabel.branchCode', elementControl: this.UserCheckboxFormGroup.controls['user_branch'] },
        ];
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
        if (this.UserCheckboxFormGroup.controls['user_name'].value == true || this.UserCheckboxFormGroup.controls['user_id'].value == true || this.UserCheckboxFormGroup.controls['user_prf_group_desc'].value == true || this.UserCheckboxFormGroup.controls['roleId_desc'].value == true || this.UserCheckboxFormGroup.controls['user_branch'].value == true) {
            this.newcolumnlist = [];
            this.newcolumnlist1 = [];
            for (var i = 0; i < this.headerListBackUp.length; i++) {
                if (this.UserCheckboxFormGroup.controls['user_name'].value == false && this.headerListBackUp[i] == "NCPLabel.userName") { continue; }
                if (this.UserCheckboxFormGroup.controls['user_id'].value == false && this.headerListBackUp[i] == "NCPLabel.UserID") { continue; }
                if (this.UserCheckboxFormGroup.controls['user_prf_group_desc'].value == false && this.headerListBackUp[i] == "NCPLabel.userProfileGroup") { continue; }
                if (this.UserCheckboxFormGroup.controls['roleId_desc'].value == false && this.headerListBackUp[i] == "NCPLabel.roleId") { continue; }
                if (this.UserCheckboxFormGroup.controls['user_branch'].value == false && this.headerListBackUp[i] == "NCPLabel.branchCode") { continue; }

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
    }

    doViewMore() {
        this.getUsersStartIndex = (5 + this.getUsersStartIndex)
        this.userListFormGroup.controls['startIndex'].patchValue(this.getUsersStartIndex);
        this.getUserList();
    }

    filterUsers() {
        this.userArray = []
        this.getUsersStartIndex = 0
        this.userListFormGroup.controls['startIndex'].patchValue(this.getUsersStartIndex);
        this.getUserList()
    }
}











