import { EventEmitter, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UserInfo } from '../models/userInfo.model';

@Injectable()
export class UserFormService {
  _config: ConfigService;
  routeJson;
  userinfo;
  partyEE = new EventEmitter();
 
  constructor(public userInfoForm: FormBuilder, public _logger: Logger, config: ConfigService) {
    this._config = config;
    this.userinfo = new UserInfo(userInfoForm);
  }

  doCreateUser(inputJson) {
    let userdetail = this._config.ncpRestServiceCall('idmServices/createUser', inputJson);
    return userdetail;
  }

  doCheckpartyid(inputJson) {
    let userdetail = this._config.ncpRestServiceCall('customer/getPartyDetails', inputJson);
    return userdetail;
  }

  getUserList(inputJson) {
    let userlist = this._config.ncpRestServiceCall('idmServices/getUserList', inputJson);
    return userlist;
  }

  getUserDetails(inputJson) {
    let userprofile = this._config.ncpRestServiceCall('idmServices/getUserDetails', inputJson);
    return userprofile;
  }

  getUserProfileDetails(inputJson) {
    let userprofile = this._config.ncpRestServiceCall('idmServices/getUserProfileDetails', inputJson);
    return userprofile;
  }

  updateUser(inputJson) {
    let userupdate = this._config.ncpRestServiceCall('idmServices/updateUser', inputJson);
    return userupdate;
  }

  updateMyProfile(inputJson) {
    let userupdate = this._config.ncpRestServiceCall('idmServices/updateMyProfile', inputJson);
    return userupdate;
  }

  updatePasswordRecoveryAnswers(inputJson) {
    let updatePasswordRecoveryAnswers = this._config.ncpRestServiceCall('idmServices/updatePasswordRecoveryAnswers', inputJson);
    return updatePasswordRecoveryAnswers;
  }

  deleteUserDetails(inputJson) {
    let deleteuser = this._config.ncpRestServiceCall('idmServices/deleteUser', inputJson);
    return deleteuser;
  }

  public handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    this._logger.error(errMsg);
    return Observable.throw(errMsg);
  }

  getuserformModel() {
    return this.userinfo.getUserInfoModel();
  }

  getuserListmodel() {
    return this.userinfo.getUserListInfomodel();
  }

  getPartyidmodel() {
    return this.userinfo.getPartyidmodel();
  }

  getusersearchmodel() {
    return this.userinfo.getsearchmodal();
  }

  setUserFormModel(obj) {
    this.userinfo.setUserInfoModel(obj);
  }

  setAgentCodeForSalesLogin(inputJSON) {
    let response = this._config.ncpRestServiceWithoutLoadingSubCall('idmServices/setAgentCodeForSalesLogin', inputJSON);
    return response;
  }
  getTechnicaluserModel() {
    return [{
      user_name: '',
      user_group: '',
      user_authgroup:''
    },
    [{
      user_id: '',
      user_email: ''
    }]];
  }

  fetchExistingPolicies(inputJson) {
    let fetchExistingPoliciesResponse = this._config.ncpRestServiceWithoutLoadingSubCall('policy/fetchExistingPolicies', inputJson);
    return fetchExistingPoliciesResponse;
  }

  fetchExistingQuotes(inputJson) {
    let fetchExistingQuotesResponse = this._config.ncpRestServiceWithoutLoadingSubCall('quotes/fetchExistingQuotes', inputJson);
    return fetchExistingQuotesResponse;
  }
  
  getUserPermissionsModel() {
    return this.userinfo.getUserPermissionsModel();
  }
}