import { TranslateService } from '@adapters/packageAdapter';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger';
import { MakeFormValidator } from '../makeform/makeform.validator';
import { MakeModelService } from '../services/makemodel.service';

@Component({
    selector: 'new-make',
    templateUrl: 'newmake.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewMakeComponent implements OnInit {
    public makeFormGroup: FormGroup;
    loaderConfig;
    makeFormValidator;
    isValidCreateMakeForm;
    isError = false;
    createMakeModal = false;
    errors = [];

    constructor(
        public makeModelService: MakeModelService,
        public translate: TranslateService,
        loaderConfigService: ConfigService,
        public _logger: Logger,
        public changeRef: ChangeDetectorRef) {
        this.loaderConfig = loaderConfigService;
        this.makeFormGroup = this.makeModelService.getMakeModelInfo();
        this.makeFormValidator = new MakeFormValidator();
        this.makeFormGroup = this.makeFormValidator.setMakeFormValidator(this.makeFormGroup);
    }

    ngOnInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });
    }

    createNewMake() {
        this.isValidCreateMakeForm = this.makeFormGroup.valid;
        if (this.isValidCreateMakeForm) {
            let addMakeCreationResponse = this.makeModelService.createMake(this.makeFormGroup.value);
            addMakeCreationResponse.subscribe(
                (dataVal) => {
                    if (dataVal && (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1)) {
                        this.createMakeModal = false;
                        this.errors.push({ 'errCode': dataVal.error[0].errCode, 'errDesc': dataVal.error[0].errDesc });
                        this._logger.error('createNewMakeCreation() ===>' + dataVal.error);
                        this.isError = true;
                        window.scrollTo(150, 150);
                        this.changeRef.markForCheck(); this.loaderConfig.setLoadingSub('no');
                    } else {
                        this.isError = false;
                        this.createMakeModal = true;
                        this.loaderConfig.setLoadingSub('no');
                        this.makeFormGroup.reset();
                        this.changeRef.markForCheck();
                    }
                });
        }
    }

    navigateList() {
        this.loaderConfig.navigateRouterLink('ncp/makemodel/makeList');
    }

}