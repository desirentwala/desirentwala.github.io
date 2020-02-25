import { Injectable } from '@angular/core';
import { HttpClient } from '@adapters/packageAdapter'
import { throwError as observableThrowError, Observable } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { PickList } from '../models/picklist.model';
/**
 * This class provides the PickList service with methods to read PickList datas.
 */
@Injectable()
export class PickListService {
  _config: ConfigService;
  /**
   * Creates a new PickListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(config: ConfigService, public _logger: Logger) {
    this._config = config;
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {PickList[]} The Observable for the HTTP request.
   */
  getPickList(inputJson, displayLoader) {
    if (displayLoader) {
      return this._config.ncpRestServiceCall('aux/getAUXData', inputJson);
    } else {
      return this._config.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', inputJson);
    }

  }

  getPickListCodeDesc(inputJson, displayLoader) {
    if (displayLoader) {
      return this._config.ncpRestServiceCall('aux/getAUXCodeDesc', inputJson);
    } else {
      return this._config.ncpRestServiceWithoutLoadingSubCall('aux/getAUXCodeDesc', inputJson);
    }
  }

  getCurrencyDetails(inputJSON) {
    return this._config.ncpRestServiceCall('aux/getCurrencyDetails', inputJSON);
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