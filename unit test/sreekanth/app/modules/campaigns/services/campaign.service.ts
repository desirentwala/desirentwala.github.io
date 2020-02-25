import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable } from '@adapters/packageAdapter';

/**
 * This class provides the ClaimService service with methods to read ClaimService datas.
 */
@Injectable()
export class CampaignService {
  config: ConfigService;
  /**
   * Creates a new ClaimService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(public _logger: Logger, config: ConfigService) {
    this.config = config;
  }
  getAllCampaigns(inputJson) {
    return this.config.ncpRestServiceCall('campaign/getAllCampaigns', inputJson);
  }
  getCampaignDetailsByCode(inputJson) {
    return this.config.ncpRestServiceCall('campaign/getCampaignDetailsByCode', inputJson);
  }
  sendEmail(inputJson) {
    this.config.ncpViewDocument('utils/viewDocument', inputJson);
  }
  getNoteDetails(inputJson) {
    return this.config.ncpRestServiceCall('utils/getNoteDetails', inputJson);
  }
  getDocumentInfo(inputJson) {
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