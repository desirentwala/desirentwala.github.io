import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { RoleFormValidator } from '../roleform/roleform.validator';
import { RoleFormService } from '../services/roleform.service';

@Component({
    selector: 'new-role',
    templateUrl: 'newRole.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewRoleComponent implements OnInit {
    public roleMaintenanceFormGroup: FormGroup;
    loaderConfig;
    roleFormValidator;
    isValidCreateRoleForm;
    isError = false;
    createRoleModal = false;
    errors = [];
    parentRoleIDList = [];

    constructor(public roleInfoForm: FormBuilder,
        public roleService: RoleFormService,
        public _logger: Logger,
        public changeRef: ChangeDetectorRef,
        public ConfigService: ConfigService,
        public translate: TranslateService,
        loaderConfigService: ConfigService,
        public utilsService: UtilsService) {
        this.loaderConfig = loaderConfigService;
        this.roleMaintenanceFormGroup = this.roleService.getroleformModel();
        this.roleFormValidator = new RoleFormValidator();
        this.roleMaintenanceFormGroup = this.roleFormValidator.setRoleFormValidator(this.roleMaintenanceFormGroup);
        this.roleMaintenanceFormGroup.reset();
    }

    ngOnInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });
    }

    createNewRole() {
        this.isValidCreateRoleForm = this.roleMaintenanceFormGroup.valid;
        let roledetailArray: any[] = [];
        this.errors = [];
        this.roleMaintenanceFormGroup = this.roleService.getroleformModel();
        let roleId = this.roleMaintenanceFormGroup.controls['roleId'].value.toUpperCase();
        this.roleMaintenanceFormGroup.controls['roleId'].patchValue(roleId);
        roledetailArray.push(this.roleMaintenanceFormGroup.value);
        if (this.isValidCreateRoleForm) {
            let roleDetailResponse = this.roleService.doCreateRole(roledetailArray);
            roleDetailResponse.subscribe(
                (createroledetail) => {
                    if (createroledetail.error !== null && createroledetail.error !== undefined && createroledetail.error.length >= 1) {
                        this.isError = true;
                        this.errors.push({ 'errCode': createroledetail.error[1].errCode, 'errDesc': createroledetail.error[1].errDesc });
                        this._logger.error('doCreateRole() ===>' + createroledetail.error);
                        window.scrollTo(150, 150);
                        this.changeRef.markForCheck();
                    } else {
                        this.createRoleModal = true;
                        this._logger.log('role created');
                        this.loaderConfig.setLoadingSub('no');
                        this.changeRef.markForCheck();
                    }
                }
            );
        }
    }
    navigateList() {
        this.ConfigService.navigateRouterLink('ncp/roleManagement/roleList');
    }

}