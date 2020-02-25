import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from '@adapters/packageAdapter';
import { ConfigService } from '../../../../../core/services/config.service';
import { Logger } from '../../../../../core/ui-components/logger/logger';
import { UserProfileViewModel } from '../models/userProfileView.model';

/**
 * This class provides the QuotService service with methods to read QuotService datas.
 */
@Injectable()
export class UserProfileService {
  _config: ConfigService;
  routeJson;
  userprofile;

  /**
   * Creates a new QuotServiceService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */

  constructor(public userProfileForm: FormBuilder, public _logger: Logger, config: ConfigService) {
    this._config = config;
    this.userprofile = new UserProfileViewModel(userProfileForm);
    
  }

  validateUserPassword(inputJson) {
    let currentpwd = this._config.ncpRestServiceCall('idmServices/validateUserPassword', inputJson);
    return currentpwd;
  }
  updatePassword(inputJson) {
    let newpassword = this._config.ncpRestServiceCall('idmServices/updatePassword', inputJson);
    return newpassword;
  }
  fetchPasswordRecoveryQuestions(inputJson) {
    let recoveryQuestions = this._config.ncpRestServiceCall('idmServices/fetchPasswordRecoveryQuestions', inputJson);
    return recoveryQuestions;
  }
  updateUserProfilePassword(inputJson){
   let newpassword = this._config.ncpRestServiceCall('idmServices/updateUserProfilePassword', inputJson);
   return newpassword;
 }
  getOneTimeSalt(inputJSON) {
    let oneTimeSalt = this._config.ncpRestServiceCall('idmServices/getOneTimeSalt', inputJSON);
    return oneTimeSalt;
  }

}