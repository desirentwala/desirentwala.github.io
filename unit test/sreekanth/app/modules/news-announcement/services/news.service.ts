import { NewsModel } from './../models/news.model';
import { FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient } from '@adapters/packageAdapter';
import { throwError as observableThrowError, Observable } from '@adapters/packageAdapter';
import { PickList } from '../../common/models/picklist.model';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';

/**
 * This class provides the PickList service with methods to read PickList datas.
 */
@Injectable()
export class NewsService {
  _config;
  newsModel;
  newsModelId;
  test = "My Test";

  /**
   * Creates a new PickListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(config: ConfigService, public _logger: Logger, public _newsModel: FormBuilder) {
    this._config = config;
    let newsModelClass = new NewsModel(_newsModel);
    if (!this.newsModel) {
      this.newsModel = newsModelClass.getNewsCreationModel();
    }
    if (!this.newsModelId) {
      this.newsModelId = newsModelClass.getNewsListModel();
    }

  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {PickList[]} The Observable for the HTTP request.
   */
  setTest(x) {
    this.test = x;
  }
  getTest() {
    return this.test;
  }
  createNews(inputJson) {
    return this._config.ncpRestServiceCall('news/createNews', inputJson);
  }

  retrieveNews(inputJson) {
    return this._config.ncpRestServiceCall('news/retrieveNews', inputJson);
  }

  updateNews(inputJson) {
    return this._config.ncpRestServiceCall('news/updateNews', inputJson);
  }

  deleteNews(inputJson) {
    return this._config.ncpRestServiceCall('news/deleteNews', inputJson);
  }

  getNewsCreationModel() {
    return this.newsModel;

  }

  getNewsListModel() {
    return this.newsModelId;
  }

  setNewsFormModel(obj) {
    this.newsModel.patchValue(obj);
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