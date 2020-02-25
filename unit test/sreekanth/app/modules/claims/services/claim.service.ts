import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';

/**
 * This class provides the ClaimService service with methods to read ClaimService datas.
 */
@Injectable()
export class ClaimService {
  config: ConfigService;
  routeJson;
  /**
   * Creates a new ClaimService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(public _logger: Logger, config: ConfigService) {
    this.config = config;
  }
  get(key) {
    return this.routeJson[key] ? this.routeJson[key] : null;
  }

  getClaimInfo(inputJson) {
    let claimResponse = this.config.ncpRestServiceCall('claim/claimDefaulting', inputJson);
    return claimResponse;
  }

  getClaimFNOLPosting(inputJson) {
    let claimPostResponse = this.config.ncpRestServiceCall('claim/claimPosting', inputJson);
    return claimPostResponse;
  }
  getClaimEnquiryInfo(inputJson) {
    let claimEnquiryResponse = this.config.ncpRestServiceCall('claim/claimEnquiry', inputJson);
    return claimEnquiryResponse;
  }
  getClaimOpenheldInfo(inputJson) {
    let claimEnquiryResponse = this.config.ncpRestServiceCall('claim/claimOpenheld', inputJson);
    return claimEnquiryResponse;
  }
  getClaimCodes(inputJson) {
    let claimEnquiryResponse = this.config.ncpRestServiceCall('claim/getClaimCodes', inputJson);
    return claimEnquiryResponse;
  }

  getClaimDocAndQuesList(inputJson) {
    let claimEnquiryResponse = this.config.ncpRestServiceCall('claim/getClaimDocAndQuesList', inputJson);
    return claimEnquiryResponse;
  }
  claimFNOLSaveInfo(inputJson) {
    let claimSaveResponse = this.config.ncpRestServiceCall('claim/claimSave', inputJson);
    return claimSaveResponse;
  }
  generateClaimNumber(inputJSON) {
    let generateClaimNumberResponse = this.config.ncpRestServiceCall('claim/generateClaimNumber', inputJSON);
    return generateClaimNumberResponse;
  }
  refreshPolicyDetails(inputJSON) {
    let refreshPolicyDetailsResponse = this.config.ncpRestServiceCall('claim/refreshPolicyDetails', inputJSON);
    return refreshPolicyDetailsResponse;
  }
  getemailTemplateResponse(inputJson) {
    let emailTemplateResponse = this.config.ncpRestServiceCallWithoutJsonResponse('utils/previewTemplate', inputJson);
    return emailTemplateResponse;
  }
  sendEmail(inputJson) {
    this.config.ncpViewDocument('utils/viewDocument', inputJson);
  }

  /**
    * Handle HTTP error
    */
  public handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    this._logger.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }

}