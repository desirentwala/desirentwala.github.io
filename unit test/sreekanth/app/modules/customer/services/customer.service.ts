import { Injectable } from '@angular/core';
import { HttpClient } from '@adapters/packageAdapter';
import { throwError as observableThrowError, Observable } from '@adapters/packageAdapter';
import { PickList } from '../../common/models/picklist.model';
import { ConfigService } from '../../../core/services/config.service';
import {Logger} from         '../../../core/ui-components/logger/logger';
/**
 * This class provides the PickList service with methods to read PickList datas.
 */
@Injectable()
export class customerService {
  config: ConfigService;
  /**
   * Creates a new PickListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(_config: ConfigService, public _logger:Logger) {
  this.config = _config;
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {PickList[]} The Observable for the HTTP request.
   */
  getCustomerDetails(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('customer/customerEnquiry', inputJson);
  }

   retrieveCustomerDetails(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('customer/retrieveCustomerDetails', inputJson);
  }

  retrieveCustomerPolicyDetails(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('policy/policyEnquiry', inputJson);
  }
   retrieveCustomerQuoteDetails(inputJson) {
    return this.config.ncpRestServiceCall('quote/quoteEnquiry', inputJson);
  }

   updateCustomerDetails(inputJson) {
    return this.config.ncpRestServiceWithoutLoadingSubCall('customer/updateCustomerDetails', inputJson);
   
  }

  addNewCustomer(inputJson) {
    return this.config.ncpRestServiceCall('customer/createCustomer', inputJson);
  }

  doCustomerRefresh(identityNo) {
    let customerInfoResponse = this.config.ncpRestServiceCall('customer/doCustomerRefresh', identityNo);
    return customerInfoResponse;
  }

  getpostalCodeRefreshValues(postalCode) {
    let postalCodeRefreshResponse = this.config.ncpRestServiceCall('utils/zipcodeRefresh', postalCode);
    return postalCodeRefreshResponse;
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