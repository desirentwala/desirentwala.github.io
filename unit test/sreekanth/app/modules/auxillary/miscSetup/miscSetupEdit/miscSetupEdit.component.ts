import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logger } from '../../../../core/ui-components/logger';
import { ConfigService } from '../../../../core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { MiscSetupService } from '../services/miscsetup.service';

@Component({
  selector: 'miscSetupEdit',
  templateUrl: './miscSetupEdit.component.html'
})
export class MiscSetupEditComponent implements OnInit {
  public miscSetupFormGroup: FormGroup;
  loaderConfig;
  updatemiscSetupModal = false;
  dateFormatService;
  isError = false;
  errors = [];
  constructor(public userInfoForm: FormBuilder,
    public _logger: Logger,
    public miscSetupService: MiscSetupService,
    loaderConfigService: ConfigService,
    public ConfigService: ConfigService,
    public changeRef: ChangeDetectorRef,
    public translate: TranslateService,
    public utilsService: UtilsService) {
    this.loaderConfig = loaderConfigService; 
    this.miscSetupFormGroup = this.miscSetupService.getMiscSetupFormInfo();
  }

  ngOnInit() {
    this.miscSetupFormDataInit();
}
miscSetupFormDataInit(): void {
    this.loaderConfig.setLoadingSub('no');
    let dataObj = this.loaderConfig.getCustom('miscSetupDetails');
    this.miscSetupFormGroup.patchValue(dataObj);
    this.miscSetupFormGroup.get('miscType').disable();
    this.miscSetupFormGroup.get('miscCode').disable();
}
updateMiscSetupDetails() {
    this.miscSetupFormGroup.get('miscType').enable();
    this.miscSetupFormGroup.get('miscCode').enable();
    this.miscSetupService.setPostalCodeInfo(this.miscSetupFormGroup.value);
    let hashedUserJSON = this.utilsService.hashUserSensitiveInfo(this.miscSetupService.getMiscSetupFormInfo().value);
    let updateMiscDetailResponse = this.miscSetupService.updateMiscInfo(hashedUserJSON);
    updateMiscDetailResponse.subscribe(
        (responseData) => {
            if (responseData.error !== null && responseData.error !== undefined && responseData.error.length >= 1) {
                this.isError = true;
                this.errors.push({ 'errCode': responseData.error[0].errCode, 'errDesc': responseData.error[0].errDesc });
                this._logger.error('updateMiscInfo() ===>' + responseData.error);
                window.scrollTo(150, 150);
                this.changeRef.markForCheck();
            } else {
                if (responseData.status === true) {
                    this.updatemiscSetupModal = true;
                }
                this.loaderConfig.setLoadingSub('no');
            }
        }
    );
}

navigatemiscSetupList() {
    this.updatemiscSetupModal = false;
    this.ConfigService.navigateRouterLink('ncp/miscsetup/miscSetupList');
}
}
