import { ErrorHandler, Injectable } from '@angular/core';
import { NgModule } from '@angular/core';

import { EventService } from '../services/event.service';

@Injectable()
export class NCPErrorHandler implements ErrorHandler {
    errorObj = {
        userId: '',
        module: '',
        action: '',
        eventType: '',
        error: '',
        debugContext: ''
    };
    constructor(public event: EventService) { }

    handleError(error: Error) {
        this.errorObj['eventType'] = 'uiError';
        this.errorObj['error'] = error.message;
        this.errorObj['debugContext'] = error.stack;
        this.event.setEvent('error', 'logError', this.errorObj);
        throw error;
    }
}


@NgModule({
    providers: [{
        provide: ErrorHandler, useClass: NCPErrorHandler
    }],
})
export class NCPErrorModule { }
