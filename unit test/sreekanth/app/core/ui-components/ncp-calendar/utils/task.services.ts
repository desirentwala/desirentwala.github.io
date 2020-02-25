import { Injectable } from '@angular/core';
import { Observable } from '@adapters/packageAdapter';

import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger/logger';

/**
 * This class provides the Task service with methods to read Task data.
 */
@Injectable()
export class TaskService {
    _config;

    /**
     * Creates a new TaskService with the injected Http.
     * @param {Http} http - The injected Http.
     * @constructor
     */
    constructor(config: ConfigService, public _logger: Logger) {
        this._config = config;
    }

    createTask(inputJson) {
        return this._config.ncpRestServiceCall('task/createTask', inputJson);
    }

    retrieveTask(inputJson) {
        return this._config.ncpRestServiceCall('task/retrieveTask', inputJson);
    }

    updateTask(inputJson) {
        return this._config.ncpRestServiceCall('task/updateTask', inputJson);
    }

    deleteTask(inputJson) {
        return this._config.ncpRestServiceCall('task/deleteTask', inputJson);
    }

    getTaskList(inputJson) {
        return this._config.ncpRestServiceCall('task/getTaskList', inputJson);
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
        return Observable.throw(errMsg);
    }

}