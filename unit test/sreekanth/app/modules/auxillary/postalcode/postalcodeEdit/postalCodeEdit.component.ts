import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logger } from '../../../../core/ui-components/logger';
import { ConfigService } from '../../../../core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { PostalCodeFormService } from '../services/postalcodeform.service';

@Component({
    selector: 'postalCode-edit',
    templateUrl: './postalCodeEdit.component.html'
})

export class PostalCodeEditComponent implements OnInit {
    public postalCodeFormGroup: FormGroup;
    loaderConfig;
    updatePostalCodeModal = false;
    dateFormatService;
    isError = false;
    errors = [];
    constructor(public userInfoForm: FormBuilder,
        public _logger: Logger,
        public postalCodeService: PostalCodeFormService,
        loaderConfigService: ConfigService,
        public ConfigService: ConfigService,
        public changeRef: ChangeDetectorRef,
        public translate: TranslateService,
        public utilsService: UtilsService) {
        this.loaderConfig = loaderConfigService;
        this.postalCodeFormGroup = this.postalCodeService.getPostalCodeFormInfo();

    }

    ngOnInit() {
        this.postalCodeFormDataInit();
    }
    postalCodeFormDataInit(): void {
        this.loaderConfig.setLoadingSub('no');
        let dataObj = this.loaderConfig.getCustom('postalCodeDetails');
        this.postalCodeFormGroup.patchValue(dataObj);
        this.postalCodeFormGroup.get('zipCode').disable();
    }
    updatePostalCodeDetails() {
        this.postalCodeFormGroup.get('zipCode').enable();
        this.postalCodeService.setPostalCodeInfo(this.postalCodeFormGroup.value);
        let hashedUserJSON = this.utilsService.hashUserSensitiveInfo(this.postalCodeService.getPostalCodeFormInfo().value);
        let updateMakeDetailResponse = this.postalCodeService.updatePostalCode(hashedUserJSON);
        updateMakeDetailResponse.subscribe(
            (responseData) => {
                if (responseData.error !== null && responseData.error !== undefined && responseData.error.length >= 1) {
                    this.isError = true;
                    this.errors.push({ 'errCode': responseData.error[0].errCode, 'errDesc': responseData.error[0].errDesc });
                    this._logger.error('updatePostalCode() ===>' + responseData.error);
                    window.scrollTo(150, 150);
                    this.changeRef.markForCheck();
                } else {
                    if (responseData.status === true) {
                        this.updatePostalCodeModal = true;
                    }
                    this.loaderConfig.setLoadingSub('no');
                }
            }
        );
    }

    navigatepostalCodeList() {
        this.updatePostalCodeModal = false;
        this.ConfigService.navigateRouterLink('ncp/postalcode/postalCodeList');
    }
}