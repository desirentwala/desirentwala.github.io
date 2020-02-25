import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logger } from '../../../../core/ui-components/logger';
import { ConfigService } from '../../../../core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { MakeModelService } from '../services/makemodel.service';

@Component({
    selector: 'model-edit',
    templateUrl: './modelEdit.component.html'
})

export class ModelEditComponent implements OnInit {
    public modelFormGroup: FormGroup;
    loaderConfig;
    updateMakeModal = false;
    dateFormatService;
    isError = false;
    errors = [];
    constructor(public userInfoForm: FormBuilder,
        public _logger: Logger,
        public makeModelService: MakeModelService,
        loaderConfigService: ConfigService,
        public ConfigService: ConfigService,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        public utilsService: UtilsService) {
        this.loaderConfig = loaderConfigService;
        this.modelFormGroup = this.makeModelService.getMakeModelInfo();

    }

    ngOnInit() {
        this.modelFormDataInit();
    }
    modelFormDataInit(): void {
        this.loaderConfig.setLoadingSub('no');
        let dataObj = this.loaderConfig.getCustom('modelCodeDetails');
        this.modelFormGroup.patchValue(dataObj);
        this.modelFormGroup.get('modelCode').disable();
        this.modelFormGroup.get('makeCode').disable();
    }
    updateModelDetails() {
        this.modelFormGroup.get('modelCode').enable();
        this.modelFormGroup.get('makeCode').enable();
        this.makeModelService.setMakeModelInfo(this.modelFormGroup.value);
        let hashedUserJSON = this.utilsService.hashUserSensitiveInfo(this.makeModelService.getMakeModelInfo().value);
        hashedUserJSON["modelFlag"]=false;
        let udatedArray: any[] = [];
        udatedArray.push(hashedUserJSON);
        let updateMakeDetailResponse = this.makeModelService.updateModel(hashedUserJSON);
        updateMakeDetailResponse.subscribe(
            (responseData) => {
                if (responseData.error !== null && responseData.error !== undefined && responseData.error.length >= 1) {
                    this.isError = true;
                    this.errors.push({ 'errCode': responseData.error[0].errCode, 'errDesc': responseData.error[0].errDesc });
                    this._logger.error('doUpdateMake() ===>' + responseData.error);
                    window.scrollTo(150, 150);
                    this.changeRef.markForCheck();
                } else {
                    if (responseData.status === true) {
                        this.updateMakeModal = true;
                    }
                    this.loaderConfig.setLoadingSub('no');
                }
            }
        );
    }

    navigateModelList() {
        this.updateMakeModal = false;
        this.ConfigService.navigateRouterLink('ncp/makemodel/modelList');
    }
}