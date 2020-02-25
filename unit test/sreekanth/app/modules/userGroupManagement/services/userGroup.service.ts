import { EventEmitter, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { throwError as observableThrowError, Observable } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UserGroupInfo } from '../models/userGroupInfo.model';

@Injectable()
export class UserGroupService {
  _config: ConfigService;
  routeJson;
  userGroupInfo;
  partyEE = new EventEmitter();

  constructor(public userGroupInfoForm: FormBuilder, public _logger: Logger, config: ConfigService) {
    this._config = config;
    this.userGroupInfo = new UserGroupInfo(userGroupInfoForm);

  }

  doCreateUserGroup(inputJson) {
    let userdetail = this._config.ncpRestServiceCall('idmServices/createUserGroup', inputJson);
    return userdetail;
  }

  public handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    this._logger.error(errMsg);
    return observableThrowError(errMsg);
  }

  getuserGroupFormModel() {
    return this.userGroupInfo.getUserGroupInfoModel();
  }

  getuserListmodel() {
    return this.userGroupInfo.getUserListInfomodel();
  }

  getPartyidmodel() {
    return this.userGroupInfo.getPartyidmodel();
  }

  getusersearchmodel() {
    return this.userGroupInfo.getsearchmodal();
  }

  setUserFormModel(obj) {
    this.userGroupInfo.setUserInfoModel(obj);
  }

  getUserPermissionsModel() {
    return this.userGroupInfo.getUserPermissionsModel();
  }

  getUserGroupListModel() {
    return this.userGroupInfo.getUserGroupListInfomodel();
  }

  getUserGroupList(inputJson) {
    let userGroupList = this._config.ncpRestServiceCall('idmServices/getUserGroupList', inputJson);
    return userGroupList;
  }

  getUserGroupDetails(inputJson) {
    let userGroupDetails = this._config.ncpRestServiceCall('idmServices/getUserGroupDetails', inputJson);
    return userGroupDetails;
  }

  deleteUserGroupDetails(inputJson) {
    let deleteUserGroup = this._config.ncpRestServiceCall('idmServices/deleteUserGroup', inputJson);
    return deleteUserGroup;
  }

  updateUserGroup(inputJson) {
    let userGroupUpdate = this._config.ncpRestServiceCall('idmServices/updateUserGroupDetails', inputJson);
    return userGroupUpdate;
  }
}