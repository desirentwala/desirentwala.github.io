import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';

import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { BranchFormService } from '../services/branchform.service';

@Component({
    selector: 'branch-edit',
    templateUrl: 'branchEdit.html'
})

export class BranchEditComponent implements AfterContentInit, OnInit {
    public branchMaintenanceFormGroup: FormGroup;
    loaderConfig;
    updateBranchModal = false;
    dateFormatService;
    branchModal;
    isError = false;
    errors = [];
    constructor(public userInfoForm: FormBuilder,
        public _logger: Logger,
        public branchService: BranchFormService,
        loaderConfigService: ConfigService,
        public ConfigService: ConfigService,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        public utilsService: UtilsService) {
        this.loaderConfig = loaderConfigService;
        this.branchMaintenanceFormGroup = this.branchService.getbranchformModel();

    }

    ngOnInit() {
        this.branchFormDataInit();
    }

    ngAfterContentInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });
    }

    branchFormDataInit(): void {
        this.loaderConfig.setLoadingSub('no');
        let dataObj = this.loaderConfig.getCustom('branchDetails');
        this.branchMaintenanceFormGroup.patchValue(dataObj);
        this.branchMaintenanceFormGroup.get('branch_id').disable();
    }


    updateBranchDetails() {
        this.branchMaintenanceFormGroup.get('branch_id').enable();
        this.branchService.setBranchFormModel(this.branchMaintenanceFormGroup.value);
        let hashedUserJSON = this.utilsService.hashUserSensitiveInfo(this.branchService.getbranchformModel().value);
        let udatedArray: any[] = [];
        udatedArray.push(hashedUserJSON);
        let updateBranchDetailResponse = this.branchService.updateBranch(udatedArray);
        updateBranchDetailResponse.subscribe(
            (responseData) => {
                if (responseData.error !== null && responseData.error !== undefined && responseData.error.length >= 1) {
                    this.isError = true;
                    this.errors.push({ 'errCode': responseData.error[1].errCode, 'errDesc': responseData.error[1].errDesc });
                    this._logger.error('doUpdateBranch() ===>' + responseData.error);
                    window.scrollTo(150, 150);
                    this.changeRef.markForCheck();
                } else {
                    if (responseData.status === true) {
                        this.updateBranchModal = true;
                    }
                    this.loaderConfig.setLoadingSub('no');
                }
            }
        );
    }

    navigateBranchList() {
        this.updateBranchModal = false;
        this.ConfigService.navigateRouterLink('ncp/branchManagement/branchList');
    }
}