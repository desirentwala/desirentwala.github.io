import { AfterContentInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { SharedService } from '../../../core/shared/shared.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { OrderBy } from '../../../core/ui-components/table-filter/pipes/orderBy';
import { SearchBy } from '../../../core/ui-components/table-filter/pipes/searchBy';
import { PickList } from '../../common/models/picklist.model';
import { RoleFormService } from '../services/roleform.service';
import { ConfigService } from './../../../core/services/config.service';
import { UtilsService } from './../../../core/ui-components/utils/utils.service';

export class TableInfo {
    mapping: string;
    header: string;
    showColumn: boolean;
    className: string;
}
@Component({
    selector: 'role-list',
    templateUrl: 'roleList.html',

})
export class RoleListComponent implements OnInit, AfterContentInit {
    loaderConfig;
    roleArray: any[] = [];
    deleteUserModal = false;
    roleListFormGroup: FormGroup;
    errmsg = false;
    searchId: any = '';
    RoleCheckboxFormGroup: FormGroup;
    tooltipHide: boolean = false;
    tableDetails: TableInfo[] = [];
    sort: any;
    columnsList = [];
    sortByDefault = "roleId";
    mappingList = ['roleId', 'roleDesc', 'systemRoleId', 'oprId'];
    headerList = ['NCPLabel.roleId', 'NCPLabel.roleDesc', 'NCPLabel.systemRoleId', 'NCPLabel.createdBy'];
    iconsClassNames = ['', '', '', ''];
    headerListBackUp = [];
    mappingListBackUp = [];
    iconsClassNamesBackUp = [];
    placeHolder: string = 'NCPBtn.search';
    @ViewChild("columnFilterModal") columnFilterModal;
    @ViewChild('myTooltip') myTooltip;
    @ViewChild('RoleDeleteModel') RoleDeleteModel;
    //@ViewChild('errorMessageModel') errorMessageModel;
    newcolumnlist = [];
    newcolumnlist1 = [];
    rotateFlag = '';
    roleidValue;
    objectValue;
    existingTooltip: any = '';
    public translated: boolean = false;
    roleUsersPickList = new PickList();
    childRoleesPickList = new PickList();
    roleUsers = [];
    childRolees = [];
    userGroups = [];
    getRoleMaxRecords = 5;
    getRoleStartIndex = 0;
    viewMore: boolean = true;
    errorMessage;
    userRoleCode: string;
    multicheckarray: any[];

    constructor(public userInfoForm: FormBuilder,
        public roleService: RoleFormService,
        public _logger: Logger,
        public config: ConfigService,
        public utils: UtilsService,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        orderBy: OrderBy,
        searchBy: SearchBy,
        shared: SharedService) {
        this.RoleCheckboxFormGroup = this.roleService.getrolesearchmodel();
        this.loaderConfig = config;
        this.errmsg = false;
        this.roleListFormGroup = this.roleService.getroleListModel();
        this.headerListBackUp.push(...this.headerList);
        this.mappingListBackUp.push(...this.mappingList);
        this.iconsClassNamesBackUp.push(...this.iconsClassNames);
        this.userRoleCode = this.config.getCustom('user_role')
        this.getRoleList(this.roleListFormGroup.value);
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

    getRoleList(inputJson) {
        let rolelistResponse = this.roleService.getRoleList(inputJson);
        rolelistResponse.subscribe(
            (roledetail) => {
                if (roledetail) {
                    if (roledetail.error) {
                        this._logger.error('getRoleList() ===>' + roledetail.error);
                    } else if (roledetail instanceof Array) {
                        this.roleArray.push(...roledetail)
                        if (roledetail.length < 5) {
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

    editRoleDetail(value, actionObject) {
        this.roleListFormGroup.reset();
        let tempJson = { "roleId": value };

        let roleprofileresponse = this.roleService.getRoleDetails(tempJson);
        roleprofileresponse.subscribe(
            (roledetail) => {
                if (roledetail.error) {
                    this._logger.error('Edit() ===>' + roledetail.error);
                } else {
                    this.roleListFormGroup.get('roleId').disable();
                    this.config.setCustom('roleDetails', roledetail);
                    this.config.navigateRouterLink('ncp/roleManagement/roleEdit');
                    this.loaderConfig.setLoadingSub('no');
                }
            }
        );
    }

    getValueobject(value, actionObject) {
        this.roleidValue = value;
        this.objectValue = actionObject;
        this.RoleDeleteModel.open();
    }

    deleteRoleDetail(value, actionObject) {
        let getRoledetailsArray: any[] = [];
        getRoledetailsArray.push(this.roleService.getroleformModel().value);
        getRoledetailsArray[0].roleId = value;
        let roleprofileresponse = this.roleService.deleteRoleDetails(getRoledetailsArray);
        roleprofileresponse.subscribe(
            (roledetail) => {
                if (roledetail.error) {
                    this._logger.error('Delete Role() ===>' + roledetail.error);
                    this.RoleDeleteModel.close();
                    this.errorMessage = roledetail.error[0].errDesc
                    //this.errorMessageModel.open();
                } else {
                    if (roledetail.status == true) {
                        this.loaderConfig.setLoadingSub('no');
                        this.deleteUserModal = true;
                    }
                }
                this.roleArray = [];
                this.roleListFormGroup = this.roleService.getroleformModel();
                this.getRoleList(this.roleListFormGroup.value);
                this.changeRef.markForCheck();
            });
    }

    navigateRoleList() {
        this.roleService.getroleformModel().reset();
        this.getRoleList(this.roleService.getroleformModel().value);
    }

    doAction(inputParam) {
    }

    setRoleEditDisableFields(roleListFormGroup) {
        this.roleListFormGroup = roleListFormGroup;
        this.roleListFormGroup.get('roleId').disable();
        return this.roleListFormGroup;
    }
    ngAfterContentInit() {
        this.multicheckarray = [
            { value: 'ID', label: 'NCPLabel.roleId', elementControl: this.RoleCheckboxFormGroup.controls['roleId'] },
            { value: 'DS', label: 'NCPLabel.roleDesc', elementControl: this.RoleCheckboxFormGroup.controls['roleDesc'] },
            { value: 'LC', label: 'NCPLabel.systemRoleId', elementControl: this.RoleCheckboxFormGroup.controls['systemRoleId'] },
            { value: 'CB', label: 'NCPLabel.createdBy', elementControl: this.RoleCheckboxFormGroup.controls['oprId'] },
        ];
        this.config.setCustom('RoleCheckboxFormGroup', this.RoleCheckboxFormGroup.value); // storing the initial RoleCheckboxFormGroup value config file array
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
        if (this.RoleCheckboxFormGroup.controls['roleId'].value == true || this.RoleCheckboxFormGroup.controls['roleDesc'].value == true || this.RoleCheckboxFormGroup.controls['systemRoleId'].value == true || this.RoleCheckboxFormGroup.controls['oprId'].value == true ) {
            this.newcolumnlist = [];
            this.newcolumnlist1 = [];
            for (var i = 0; i < this.headerListBackUp.length; i++) {
                if (this.RoleCheckboxFormGroup.controls['roleId'].value == false && this.headerListBackUp[i] == "NCPLabel.roleId") { continue; }
                if (this.RoleCheckboxFormGroup.controls['roleDesc'].value == false && this.headerListBackUp[i] == "NCPLabel.roleDesc") { continue; }
                if (this.RoleCheckboxFormGroup.controls['systemRoleId'].value == false && this.headerListBackUp[i] == "NCPLabel.systemRoleId") { continue; }
                if (this.RoleCheckboxFormGroup.controls['oprId'].value == false && this.headerListBackUp[i] == "NCPLabel.createdBy") { continue; }
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
        this.config.setCustom('RoleCheckboxFormGroup', this.RoleCheckboxFormGroup.value);

    }
    settingsClose() {
        this.RoleCheckboxFormGroup.patchValue(this.config.getCustom('RoleCheckboxFormGroup'));
    }

    doViewMore() {
        this.getRoleStartIndex = 5 + this.getRoleStartIndex
        this.roleListFormGroup.controls['startIndex'].patchValue(this.getRoleStartIndex);
        this.getRoleList(this.roleListFormGroup.value);
    }

    filterRolees() {
        this.roleArray = [];
        this.getRoleStartIndex = 0
        this.roleListFormGroup.controls['startIndex'].patchValue(this.getRoleStartIndex);
        this.getRoleList(this.roleListFormGroup.value);
    }
}
