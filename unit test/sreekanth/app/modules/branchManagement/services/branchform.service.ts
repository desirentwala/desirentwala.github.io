import { EventEmitter, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { BranchInfo } from '../models/branchInfo.model';

@Injectable()
export class BranchFormService {
  _config: ConfigService;
  routeJson;
  branchinfo;
  partyEE = new EventEmitter();
  /**
   * Creates a new QuotServiceService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(public BranchInfoForm: FormBuilder, public _logger: Logger, config: ConfigService) {
    this._config = config;
    this.branchinfo = new BranchInfo(BranchInfoForm);

  }

  getbranchformModel() {
    return this.branchinfo.getBranchInfoModel();
  }

  getbranchsearchmodel() {
    return this.branchinfo.getsearchmodal();
  }

  getbranchListModel() {
    return this.branchinfo.getBranchListInfomodel();
  }

  setBranchFormModel(obj) {
    this.branchinfo.setBranchInfoModel(obj);
  }

  doCreateBranch(inputJson) {
    let createBranch = this._config.ncpRestServiceCall('idmServices/createBranch', inputJson);
    return createBranch;
  }

  getBranchList(inputJson) {
    let branchlist = this._config.ncpRestServiceCall('idmServices/getBranchList', inputJson);
    return branchlist;
  }

  updateBranch(inputJson) {
    let branchupdate = this._config.ncpRestServiceCall('idmServices/updateBranchDetails', inputJson);
    return branchupdate;
  }

  deleteBranchDetails(inputJson) {
    let deletebranch = this._config.ncpRestServiceCall('idmServices/deleteBranch', inputJson);
    return deletebranch;
  }

  getBranchDetails(inputJson) {
    let getBranchDetails = this._config.ncpRestServiceCall('idmServices/getBranchDetails', inputJson);
    return getBranchDetails;

  }
}