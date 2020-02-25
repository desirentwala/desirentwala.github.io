import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logger } from '../../../../core/ui-components/logger';
import { ConfigService } from '../../../../core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { CurrencyService } from '../services/currency.service';


@Component({
  selector: 'currencyEdit',
  templateUrl: './currencyEdit.component.html'
})
export class CurrencyEditComponent implements OnInit {
  public currencyFormGroup: FormGroup;
  loaderConfig;
  updateCurrencyModal = false;
  dateFormatService;
  isError = false;
  errors = [];
  constructor(public userInfoForm: FormBuilder,
    public _logger: Logger,
    public currencyService: CurrencyService,
    loaderConfigService: ConfigService,
    public ConfigService: ConfigService,
    public changeRef: ChangeDetectorRef,
    public translate: TranslateService,
    public utilsService: UtilsService) {
    this.loaderConfig = loaderConfigService; 
    this.currencyFormGroup = this.currencyService.getCurrencyFormInfo();
  }

  ngOnInit() {
    this.currencyFormDataInit();
}
currencyFormDataInit(): void {
    this.loaderConfig.setLoadingSub('no');
    let dataObj = this.loaderConfig.getCustom('currencyDetails');
    this.currencyFormGroup.patchValue(dataObj);
    this.currencyFormGroup.get('currencyCode').disable();
}
updateCurrencyDetails() {
    this.currencyFormGroup.get('currencyCode').enable();
    this.currencyService.setCurrencyInfo(this.currencyFormGroup.value);
    let hashedUserJSON = this.utilsService.hashUserSensitiveInfo(this.currencyService.getCurrencyFormInfo().value);
    let updateCurrencyDetailResponse = this.currencyService.updateCurrency(hashedUserJSON);
    updateCurrencyDetailResponse.subscribe(
        (responseData) => {
            if (responseData.error !== null && responseData.error !== undefined && responseData.error.length >= 1) {
                this.isError = true;
                this.errors.push({ 'errCode': responseData.error[0].errCode, 'errDesc': responseData.error[0].errDesc });
                this._logger.error('updateCurrency() ===>' + responseData.error);
                window.scrollTo(150, 150);
                this.changeRef.markForCheck();
            } else {
                if (responseData.status === true) {
                    this.updateCurrencyModal = true;
                }
                this.loaderConfig.setLoadingSub('no');
            }
        }
    );
}

navigateCurrencyList() {
    this.updateCurrencyModal = false;
    this.ConfigService.navigateRouterLink('ncp/currency/currencyList');
}
}
