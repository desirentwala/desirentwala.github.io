import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Logger } from '../../../../core/ui-components/logger';
import { ConfigService } from '../../../../core/services/config.service';
import { CurrencyInfo } from '../models/currencyinfo.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  CurrencyInfo;
  config: ConfigService;

  constructor(public CurrencyInfoForm: FormBuilder, public _logger: Logger, config: ConfigService) {
    this.config = config;
    this.CurrencyInfo = new CurrencyInfo(CurrencyInfoForm);
   }
  getCurrencyFormInfo() {
    return this.CurrencyInfo.getCurrencyInfoModel();
  }
  getCurrencyListInfo() {
    return this.CurrencyInfo.getCurrencyListInfoModel();
  }
  setCurrencyInfo(obj) {
    this.CurrencyInfo.setCurrencyInfo(obj);
  }
  doCreateCurrency(inputJson){
    let createCurrency = this.config.ncpRestServiceCall('aux/insertCurrency', inputJson);
    return createCurrency;
  }
  getCurrencyList(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/getCurrencyList', inputJson);
  }
  getCurrencyDetails(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/getCurrencyDetails', inputJson);
  }
  deleteCurrency(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/deleteCurrency', inputJson);
  }
  updateCurrency(inputJson) {
    let createCurrencyupdate = this.config.ncpRestServiceCall('aux/updateCurrency', inputJson);
    return createCurrencyupdate;
  }
}
