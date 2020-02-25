import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Logger } from '../../../../core/ui-components/logger';
import { ConfigService } from '../../../../core/services/config.service';
import { MiscSetupInfo } from '../models/miscsetupinfo.model';

@Injectable({
  providedIn: 'root'
})
export class MiscSetupService {
  Miscsetupinfo;
  config: ConfigService;

  constructor(public MiscSetupInfoForm: FormBuilder, public _logger: Logger, config: ConfigService) {
    this.config = config;
    this.Miscsetupinfo = new MiscSetupInfo(MiscSetupInfoForm);
   }
  getMiscSetupFormInfo() {
    return this.Miscsetupinfo.getMiscSetupInfoModel();
  }
  getMiscSetupListInfo() {
    return this.Miscsetupinfo.getMiscSetupListInfoModel();
  }
  setPostalCodeInfo(obj) {
    this.Miscsetupinfo.setMiscSetupInfo(obj);
  }
  doCreateMiscSetup(inputJson){
    let createMiscSetup = this.config.ncpRestServiceCall('aux/insertMiscInfo', inputJson);
    return createMiscSetup;
  }
  getMiscInfoList(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/getMiscInfoList', inputJson);
  }
  getMiscInfoDetails(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/getMiscInfoDetails', inputJson);
  }
  deleteMiscInfo(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/deleteMiscInfo', inputJson);
  }
  updateMiscInfo(inputJson) {
    let postalCodeupdate = this.config.ncpRestServiceCall('aux/updateMiscInfo', inputJson);
    return postalCodeupdate;
  }
}
