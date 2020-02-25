import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@adapters/packageAdapter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../../../../core/services/event.service';
import { ConfigService } from "../../../../core/services/config.service";
import { Logger } from '../../../../core/ui-components/logger';
import { CurrencyService } from '../services/currency.service';
import { CurrencyFormValidator } from '../currencyForm/currencyForm.validator';

@Component({
  selector: 'newCurrency',
  templateUrl: './newCurrency.component.html'
})
export class NewCurrencyComponent implements OnInit {
  currencyFormGroup: FormGroup;
  loaderConfig;
  isValidCreateCurrencyForm;
  isError = false;
  createCurrency = false;
  errors = [];
  currencyFormValidator: CurrencyFormValidator;
  constructor(public formBuilder: FormBuilder,
    public currencyService: CurrencyService,
    public config: ConfigService,
    public translate: TranslateService,
    loaderConfigService: ConfigService,
    public _logger: Logger,
    public changeRef: ChangeDetectorRef, ) {
    this.loaderConfig = loaderConfigService;
    this.currencyFormValidator = new CurrencyFormValidator();
    this.currencyFormGroup = this.currencyService.getCurrencyFormInfo();
    this.currencyFormGroup = this.currencyFormValidator.setCurrencyFormValidator(this.currencyFormGroup);
  }

  ngOnInit() {
    this.config.setLoadingSub('no');
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.loaderConfig.currentLangName);
      }
    });
  }

  doCreateNewCurrency() {
    this.isValidCreateCurrencyForm = this.currencyFormGroup.valid;
    if (this.isValidCreateCurrencyForm) {
      let addCurrencyResponse = this.currencyService.doCreateCurrency(this.currencyFormGroup.value);
      addCurrencyResponse.subscribe(
        (dataVal) => {
          if (dataVal && (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1)) {
            this.createCurrency = false;
            this.errors.push({ 'errCode': dataVal.error[0].errCode, 'errDesc': dataVal.error[0].errDesc });
            this._logger.error('doCreateCurrency() ===>' + dataVal.error);
            this.isError = true;
            window.scrollTo(150, 150);
            this.changeRef.markForCheck(); this.loaderConfig.setLoadingSub('no');
          } else {
            this.isError = false;
            this.createCurrency = true;
            this.loaderConfig.setLoadingSub('no');
            this.changeRef.markForCheck();
          }
        });
    }
  }

  navigateList() {
    this.loaderConfig.navigateRouterLink('ncp/currency/currencyList');
  }


}
