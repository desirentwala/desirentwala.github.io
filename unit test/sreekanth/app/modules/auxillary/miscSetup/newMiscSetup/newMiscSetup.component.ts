import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@adapters/packageAdapter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../../../../core/services/event.service';
import { ConfigService } from "../../../../core/services/config.service";
import { Logger } from '../../../../core/ui-components/logger';
import { MiscSetupService } from '../services/miscsetup.service';
import { MiscSetupFormValidator } from '../miscSetupForm/miscSetupForm.validator';

@Component({
  selector: 'newMiscSetup',
  templateUrl: './newMiscSetup.component.html'
})
export class NewMiscSetupComponent implements OnInit {
  miscSetupFormGroup: FormGroup;
  loaderConfig;
  isValidCreateMiscSetupForm;
  isError = false;
  createMiscSetup = false;
  errors = [];
  miscSetupFormValidator: MiscSetupFormValidator;
  constructor(public formBuilder: FormBuilder,
    public miscSetupService: MiscSetupService,
    public config: ConfigService,
    public translate: TranslateService,
    loaderConfigService: ConfigService,
    public _logger: Logger,
    public changeRef: ChangeDetectorRef, ) {
    this.loaderConfig = loaderConfigService;
    this.miscSetupFormValidator = new MiscSetupFormValidator();
    this.miscSetupFormGroup = this.miscSetupService.getMiscSetupFormInfo();
    this.miscSetupFormGroup = this.miscSetupFormValidator.setPostalCodeFormValidator(this.miscSetupFormGroup);
  }

  ngOnInit() {
    this.config.setLoadingSub('no');
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.loaderConfig.currentLangName);
      }
    });
  }

  doCreateNewMiscSetup() {
    this.isValidCreateMiscSetupForm = this.miscSetupFormGroup.valid;
    if (this.isValidCreateMiscSetupForm) {
      let addMakeCreationResponse = this.miscSetupService.doCreateMiscSetup(this.miscSetupFormGroup.value);
      addMakeCreationResponse.subscribe(
        (dataVal) => {
          if (dataVal && (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1)) {
            this.createMiscSetup = false;
            this.errors.push({ 'errCode': dataVal.error[0].errCode, 'errDesc': dataVal.error[0].errDesc });
            this._logger.error('doCreateMiscSetup() ===>' + dataVal.error);
            this.isError = true;
            window.scrollTo(150, 150);
            this.changeRef.markForCheck(); this.loaderConfig.setLoadingSub('no');
          } else {
            this.isError = false;
            this.createMiscSetup = true;
            this.loaderConfig.setLoadingSub('no'); 
            this.changeRef.markForCheck();
          }
        });
    }
  }

  navigateList() {
    this.loaderConfig.navigateRouterLink('ncp/miscsetup/miscSetupList');
  }


}
