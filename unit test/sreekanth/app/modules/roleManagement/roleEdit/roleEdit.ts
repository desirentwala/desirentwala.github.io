import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { RoleFormService } from '../services/roleform.service';


@Component({
    selector: 'role-edit',
    templateUrl: 'roleEdit.html'
})

export class RoleEditComponent implements AfterContentInit, OnInit {
    public roleMaintenanceFormGroup: FormGroup;
    loaderConfig;
    updateRoleModal = false;
    dateFormatService;
    roleModal;
    isError = false;
    errors = [];
    constructor(public userInfoForm: FormBuilder,
        public _logger: Logger,
        public roleService: RoleFormService,
        loaderConfigService: ConfigService,
        public ConfigService: ConfigService,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        public utilsService: UtilsService) {
        this.loaderConfig = loaderConfigService;
        this.roleMaintenanceFormGroup = this.roleService.getroleformModel();

    }

    ngOnInit() {
        this.roleFormDataInit();
    }

    ngAfterContentInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });
    }

    roleFormDataInit(): void {
        this.loaderConfig.setLoadingSub('no');
        let dataObj = this.loaderConfig.getCustom('roleDetails');
        this.roleMaintenanceFormGroup.patchValue(dataObj);
        this.roleMaintenanceFormGroup.get('roleId').disable();
    }


    updateRoleDetails() {
        this.roleMaintenanceFormGroup.get('roleId').enable();
        this.roleService.setRoleFormModel(this.roleMaintenanceFormGroup.value);
        let hashedUserJSON = this.utilsService.hashUserSensitiveInfo(this.roleService.getroleformModel().value);
        let udatedArray: any[] = [];
        udatedArray.push(hashedUserJSON);
        let updateRoleDetailResponse = this.roleService.updateRole(udatedArray);
        updateRoleDetailResponse.subscribe(
            (responseData) => {
                if (responseData.error !== null && responseData.error !== undefined && responseData.error.length >= 1) {
                    this.isError = true;
                    this.errors.push({ 'errCode': responseData.error[1].errCode, 'errDesc': responseData.error[1].errDesc });
                    this._logger.error('doUpdateRole() ===>' + responseData.error);
                    window.scrollTo(150, 150);
                    this.changeRef.markForCheck();
                } else {
                    if (responseData.status === true) {
                        this.updateRoleModal = true;
                    }
                    this.loaderConfig.setLoadingSub('no');
                }
            }
        );
    }

    navigateRoleList() {
        this.updateRoleModal = false;
        this.ConfigService.navigateRouterLink('ncp/roleManagement/roleList');
    }
}