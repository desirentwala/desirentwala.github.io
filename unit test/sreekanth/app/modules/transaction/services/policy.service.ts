import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';

/**
 * This class provides the PolicyService service with methods to read PolicyService datas.
 */
@Injectable()
export class PolicyService {
  _config: ConfigService;

  /**
   * Creates a new QuotServiceService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private _logger: Logger, config: ConfigService) {
    this._config = config;

  }



  getDocumentInfo(inputJson) {
    this._config.ncpViewDocument('utils/viewDocument', inputJson);
  }

  getPolicyEnquiryInfo(inputJson) {
    let policyEnquiryResponse = this._config.ncpRestServiceCall('policy/policyEnquiry', inputJson);
    return policyEnquiryResponse;
  }
  getPolicyOpenheldInfo(inputJson) {
    let policyEnquiryResponse = this._config.ncpRestServiceCall('policy/policyOpenheld', inputJson);
    return policyEnquiryResponse;
  }

  doEndorsementDefaultingInfo(inputJson) {
    // Services Name change
    // Old services name: 'policy/endorsementDefaulting'
    // New services name: 'policy/policyEndtDefaulting'
    let endorsementDefaultingResponse = this._config.ncpRestServiceCall('policy/policyEndtDefaulting', inputJson);
    return endorsementDefaultingResponse;
  }
  getRegionDetails(inputJson) {
    let regionResponse = this._config.ncpRestServiceCall('quote/getRegionDetails', inputJson);
    return regionResponse;
  }
  getPolicyRatingInfo(inputJson) {
    let policyRatingResponse = this._config.ncpRestServiceCall('policy/policyRating', inputJson);
    return policyRatingResponse;
  }
  doPolicyEndtPostingOnCreditInfo(inputJson) {
    let policyPostingResponse = this._config.ncpRestServiceCall('policy/policyPosting', inputJson);
    return policyPostingResponse;
  }
  doPolicySave(inputJson) {
    let policySaveResponse = this._config.ncpRestServiceCall('policy/policySave', inputJson);
    return policySaveResponse;
  }
  getpostalCodeRefreshValues(postalCode) {
    let postalCodeRefreshResponse = this._config.ncpRestServiceCall('utils/zipcodeRefresh', postalCode);
    return postalCodeRefreshResponse;
  }
  addItemMastertoWork(inputJson) {
    let policyInfoDetails = this._config.ncpRestServiceCall('policy/addItemMastertoWork', inputJson);
    return policyInfoDetails;
  }
  addItemDetails(inputJson) {
    let ItemInfoDetails = this._config.ncpRestServiceCall('policy/addItemDetails', inputJson);
    return ItemInfoDetails;
  }
  doCustomerRefresh(identityNo) {
    let customerInfoResponse = this._config.ncpRestServiceCall('customer/doCustomerRefresh', identityNo);
    return customerInfoResponse;
  }
  policyValidate(inputJson) {
    return this._config.ncpRestServiceCall('policy/policyValidate', inputJson);
  }
  createPolicy(inputJson) {
    let policyInfoResponse = this._config.ncpRestServiceCall('policy/createPolicy', inputJson, inputJson.isUpdateToTargetSystem);
    return policyInfoResponse;
  }
  // deleteItemFromWork(inputJson) {
  //   let policyInfoDetails = this._config.ncpRestServiceCall('policy/deleteItemFromWork', inputJson);
  //   return policyInfoDetails;
  // }
  /**
    * Handle HTTP error 
    */
  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    this._logger.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }

};
