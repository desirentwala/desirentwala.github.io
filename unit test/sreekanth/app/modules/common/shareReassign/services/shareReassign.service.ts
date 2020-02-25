
import { Injectable } from '@angular/core';
import { ShareReassignInfo } from '../models/shareReassignInfo.model';
import { FormBuilder } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config.service';

@Injectable()
export class ShareReassignService {
  config : ConfigService;
  shareReassignInfo: ShareReassignInfo;

  constructor(public _config: ConfigService,public shareReassignInfoForm: FormBuilder) {
    this.config = _config;
    this.shareReassignInfo = new ShareReassignInfo(shareReassignInfoForm);
  }
  shareTxn(inputJson) {
    return this.config.ncpRestServiceCall('idmServices/shareTxn', inputJson);
  }
  reAssignTxn(inputJson) {
    return this.config.ncpRestServiceCall('utils/reAssignTxn', inputJson);
  }
  getAuxData(inputJson) {
    let auxDataResponse = this._config.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', inputJson);
    return auxDataResponse;
  }
  getShareReassingInfoModel(){
    return this.shareReassignInfo.getShareReassingInfoModel();
  }
  getSharedUsersList(inputJson){
    return this.config.ncpRestServiceCall('idmServices/getSharedUsersList', inputJson);
  }
}