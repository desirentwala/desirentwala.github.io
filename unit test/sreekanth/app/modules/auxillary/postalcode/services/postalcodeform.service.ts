import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { PostalCodeInfo } from '../models/postalcodeinfo.model';

@Injectable()
export class PostalCodeFormService {
  config: ConfigService;
  routeJson;
  postalCodeinfo;
  constructor(public postalCodeInfoForm: FormBuilder, public _logger: Logger, config: ConfigService) {
    this.config = config;
    this.postalCodeinfo = new PostalCodeInfo(postalCodeInfoForm);
  }
  getPostalCodeFormInfo() {
    return this.postalCodeinfo.getPostalCodeInfoModel();
  }
  getPostalCodeListInfo() {
    return this.postalCodeinfo.getPostalCodeListInfoModel();
  }
  setPostalCodeInfo(obj) {
    this.postalCodeinfo.setPostalCodeInfo(obj);
  }
  doCreatePostalCode(inputJson) {
    let createPostalCode = this.config.ncpRestServiceCall('aux/insertPostalCode', inputJson);
    return createPostalCode;
  }
  getPostalCodeList(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/getPostalCodeList', inputJson);
  }
  getPostalCodeDetails(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/getPostalCodeDetails', inputJson);
  }
  deletePostalCode(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('aux/deletePostalCode', inputJson);
  }
  updatePostalCode(inputJson) {
    let postalCodeupdate = this.config.ncpRestServiceCall('aux/updatePostalCode', inputJson);
    return postalCodeupdate;
  }

}
