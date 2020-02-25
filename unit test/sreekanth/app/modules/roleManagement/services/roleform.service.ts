import { EventEmitter, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { RoleInfo } from '../models/roleInfo.model';

@Injectable()
export class RoleFormService {
  _config: ConfigService;
  routeJson;
  roleinfo;
  partyEE = new EventEmitter();
  /**
   * Creates a new QuotServiceService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(public RoleInfoForm: FormBuilder, public _logger: Logger, config: ConfigService) {
    this._config = config;
    this.roleinfo = new RoleInfo(RoleInfoForm);

  }

  getroleformModel() {
    return this.roleinfo.getRoleInfoModel();
  }

  getrolesearchmodel() {
    return this.roleinfo.getsearchmodal();
  }

  getroleListModel() {
    return this.roleinfo.getRoleListInfomodel();
  }

  setRoleFormModel(obj) {
    this.roleinfo.setRoleInfoModel(obj);
  }

  doCreateRole(inputJson) {
    let createRole = this._config.ncpRestServiceCall('idmServices/createRole', inputJson);
    return createRole;
  }

  getRoleList(inputJson) {
    let rolelist = this._config.ncpRestServiceCall('idmServices/getRoleList', inputJson);
    return rolelist;
  }

  updateRole(inputJson) {
    let roleupdate = this._config.ncpRestServiceCall('idmServices/updateRoleDetails', inputJson);
    return roleupdate;
  }

  deleteRoleDetails(inputJson) {
    let deleterole = this._config.ncpRestServiceCall('idmServices/deleteRole', inputJson);
    return deleterole;
  }

  getRoleDetails(inputJson) {
    let getRoleDetails = this._config.ncpRestServiceCall('idmServices/getRoleDetails', inputJson);
    return getRoleDetails;

  }
}