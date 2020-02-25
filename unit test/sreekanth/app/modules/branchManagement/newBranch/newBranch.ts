import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';

import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { BranchFormValidator } from '../branchform/branchform.validator';
import { BranchFormService } from '../services/branchform.service';

@Component({
    selector: 'new-branch',
    templateUrl: 'newBranch.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewBranchComponent implements OnInit {
    public branchMaintenanceFormGroup: FormGroup;
    loaderConfig;
    branchFormValidator;
    isValidCreateBranchForm;
    isError = false;
    createBranchModal = false;
    errors = [];
    parentBranchIDList = [];

    constructor(public branchInfoForm: FormBuilder,
        public branchService: BranchFormService,
        public _logger: Logger,
        public changeRef: ChangeDetectorRef,
        public ConfigService: ConfigService,
        public translate: TranslateService,
        loaderConfigService: ConfigService,
        public utilsService: UtilsService) {
        this.loaderConfig = loaderConfigService;
        this.branchMaintenanceFormGroup = this.branchService.getbranchformModel();
        this.branchFormValidator = new BranchFormValidator();
        this.branchMaintenanceFormGroup = this.branchFormValidator.setBranchFormValidator(this.branchMaintenanceFormGroup);
        this.branchMaintenanceFormGroup.reset();
    }

    ngOnInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });
    }

    CreateNewBranch() {
        this.isValidCreateBranchForm = this.branchMaintenanceFormGroup.valid;
        let branchdetailArray: any[] = [];
        this.errors = [];
        this.branchMaintenanceFormGroup = this.branchService.getbranchformModel();
        branchdetailArray.push(this.branchMaintenanceFormGroup.value);
        if (this.isValidCreateBranchForm) {
            let branchDetailResponse = this.branchService.doCreateBranch(branchdetailArray);
            branchDetailResponse.subscribe(
                (createbranchdetail) => {
                    if (createbranchdetail.error !== null && createbranchdetail.error !== undefined && createbranchdetail.error.length >= 1) {
                        this.isError = true;
                        this.errors.push({ 'errCode': createbranchdetail.error[1].errCode, 'errDesc': createbranchdetail.error[1].errDesc });
                        this._logger.error('doCreateBranch() ===>' + createbranchdetail.error);
                        window.scrollTo(150, 150);
                        this.changeRef.markForCheck();
                    } else {
                        this.createBranchModal = true;
                        this._logger.log('branch created');
                        this.loaderConfig.setLoadingSub('no');
                        this.changeRef.markForCheck();
                    }
                }
            );
        }
    }
    navigateList() {
        this.ConfigService.navigateRouterLink('ncp/branchManagement/branchList');
    }

    
}