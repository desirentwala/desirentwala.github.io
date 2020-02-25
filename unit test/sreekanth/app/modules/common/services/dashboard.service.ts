import { Injectable } from '@angular/core';
import { HttpClient } from '@adapters/packageAdapter'
import { throwError as observableThrowError, Observable ,  Subject } from '@adapters/packageAdapter';
import { PickList } from '../models/picklist.model';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
/**
 * This class provides the PickList service with methods to read PickList datas.
 */
@Injectable()
export class DashBoardService {
  _config: ConfigService;
  widgetOrderList: Array<any> = [];
  applicableWidgetList: Array<any> = [];
  widgetOrderSub = new Subject();
  editWidgetOrderSub = new Subject();
  dataSub = new Subject();

  /**
   * Creates a new PickListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(config: ConfigService, public _logger: Logger) {
    this._config = config;
    let widgetResp = this._config.ncpRestServiceCall('dashboard/getUserWidgetConfig', {});
    widgetResp.subscribe((data) => {
      if (data instanceof Array) {
        this.widgetOrderList = data;
        this.widgetOrderSub.next('loaded');
      }
    });
    let appWidgetResp = this._config.ncpRestServiceCall('dashboard/getUserApplicableWidgetConfig', {});
    appWidgetResp.subscribe((data) => {
      if (data instanceof Array) {
        this.applicableWidgetList = data;
        this.widgetOrderSub.next('awl');
      }
    });
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {PickList[]} The Observable for the HTTP request.
   */
  getDashboardTablelist(inputJson) {
    return this._config.ncpRestServiceCall('quote/quoteDetailsForAgent', inputJson);
  }

  getDashboardUpdatedTableList(inputJson) {
    return this._config.ncpRestServiceCall('dashboard/getRecentTransactionDetails', inputJson);
  }

  getWidgetList() {
    return this.widgetOrderList;
  }

  getAppWidgetList() {
    return this.applicableWidgetList;
  }

  setWidgetList(data) {
    if (data instanceof Array) {
      this.widgetOrderList = data;
    }
  }

  updateWidgets(data: Array<any>) {
    this.widgetOrderList = data;
    return this._config.ncpRestServiceWithoutLoadingSubCall('dashboard/updateUserWidgetConfig', data);
  }

  getRenewalPoliciesData(inputJSON) {
    return this._config.ncpRestServiceCall('renewal/getRenewalPolices', inputJSON);
  }

  getPoliciesData(inputJSON) {
    return this._config.ncpRestServiceCall('renewal/getPolices', inputJSON);
  }

  /**
    * Handle HTTP error
    */
  public handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    this._logger.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }
}