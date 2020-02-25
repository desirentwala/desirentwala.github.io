import { TranslateService } from '@adapters/packageAdapter';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from "../../../../core/services/config.service";
import { Logger } from '../../../../core/ui-components/logger';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { PostalCodeFormService } from '../services/postalcodeform.service';
import { PostalCodeFormValidator } from '../postalcodeform/postalcode.validator';
@Component({
    selector: 'new-postalcode',
    templateUrl: './newPostalCode.component.html'
})
export class NewPostalCodeComponent implements OnInit {
    public postalCodeFormGroup: FormGroup;
    createPostalCodeModal: boolean = false;
    postalCodeFormValidator;
    isValidCreatePostalCodeForm;
    isError = false;
    errors = [];
    loaderConfig;
    constructor(
        public formBuilder: FormBuilder,
        public postalCodeService: PostalCodeFormService,
        public config: ConfigService,
        public translate: TranslateService,
        loaderConfigService: ConfigService,
        public _logger: Logger,
        public changeRef: ChangeDetectorRef,
        public utilsService: UtilsService) {
        this.loaderConfig = loaderConfigService;
        this.postalCodeFormGroup = this.postalCodeService.getPostalCodeFormInfo();
        this.postalCodeFormValidator = new PostalCodeFormValidator();
        this.postalCodeFormGroup = this.postalCodeFormValidator.setPostalCodeFormValidator(this.postalCodeFormGroup);
    }

    ngOnInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });
    }
    createNewPostalCode() {
        this.isValidCreatePostalCodeForm = this.postalCodeFormGroup.valid;
        if (this.isValidCreatePostalCodeForm) {
            let postalCodeCreationResponse = this.postalCodeService.doCreatePostalCode(this.postalCodeFormGroup.value);
            postalCodeCreationResponse.subscribe(
                (createPostalCodedetail) => {
                    if (createPostalCodedetail.error !== null && createPostalCodedetail.error !== undefined && createPostalCodedetail.error.length >= 1) {
                        this.isError = true;
                        this.errors.push({ 'errCode': createPostalCodedetail.error[0].errCode, 'errDesc': createPostalCodedetail.error[0].errDesc });
                        this._logger.error('doCreatePostalCode() ===>' + createPostalCodedetail.error);
                        window.scrollTo(150, 150);
                        this.changeRef.markForCheck();
                    } else {
                        this.createPostalCodeModal = true;
                        this._logger.log('PostalCode created');
                        this.loaderConfig.setLoadingSub('no');
                        this.changeRef.markForCheck();
                    }
                }
            );
        }
    }
    navigateList() {
        this.loaderConfig.navigateRouterLink('ncp/postalcode/postalCodeList');
    }
}