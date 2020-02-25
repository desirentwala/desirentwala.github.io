import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@adapters/packageAdapter';
import { Injectable } from '@angular/core';
import { Observable, throwError } from '@adapters/packageAdapter';
import { tap, catchError } from '@adapters/packageAdapter';
import { EventService } from '../services/event.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    errorObj = {
        userId: '',
        module: '',
        action: '',
        eventType: '',
        debugContext: ''
    };
    constructor(public event: EventService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(tap(res => this.checkForError(res, req.body, req.url))).pipe(catchError((error: any) => {
            this.processErrorResponse(error, req.url, req.body);
            return throwError(error);
        }));
    }


    checkForError(res: any, input: any, service: any) {
        if (res['body']) {
            if (Array.isArray(res['body'])) {
                if (res['body'][0] && res['body'][0]['errorVOList'] && res['body'][0]['errorVOList'].length > 0) {
                    res['body'][0]['errorVOList'].forEach(element => {
                        if ((element['errCode'] && element['errCode'] !== '') || (element['errType'] && element['errType'] !== '')) {
                            this.prepToLogError(res, service, input);
                        }
                    });
                }
            } else if (res['body']['errorVOList'] && res['body']['errorVOList'].length > 0) {
                res['body']['errorVOList'].forEach(element => {
                    if ((element['errCode'] && element['errCode'] !== '') || (element['errType'] && element['errType'] !== '')) {
                        this.prepToLogError(res, service, input);
                    }
                });
            } else if (res['body']['error'] && (Array.isArray(res['body']['error']) && res['body']['error'].length > 0)) {
                res['body']['error'].forEach(element => {
                    if ((element['errCode'] && element['errCode'] !== '') || (element['errType'] && element['errType'] !== '')) {
                        this.prepToLogError(res, service, input);
                    }
                });
            } else if (res['body']['error'] && (!Array.isArray(res['body']['error']) && res['body']['error'])) {
                if ((res['body']['error']['errCode'] && res['body']['error']['errCode'] !== '') || (res['body']['error']['errType'] && res['body']['error']['errType'] !== '')) {
                    this.prepToLogError(res, service, input);
                }
            }
        }
        return res;
    }

    prepToLogError(res: any, serviceName: string, input: any) {
        if (serviceName.indexOf('logError') < 0) {
            this.errorObj['eventType'] = 'handledHTTPError';
            this.errorObj['serviceName'] = serviceName;
            this.errorObj['error'] = JSON.parse(JSON.stringify(res['body']));
            this.event.setEvent('error', 'logError', this.errorObj);
        }
        return res;
    }

    processErrorResponse(res: HttpErrorResponse, serviceName: any, input: any) {
        if (serviceName.indexOf('logError') < 0) {
            if (res['status'] && res['status'] === 401) {
                this.initiateUnauthorized(res, serviceName, input);
            } else {
                this.errorObj['eventType'] = 'unHandledHTTPError';
                this.errorObj['serviceName'] = serviceName;
                this.errorObj['error'] = res.message;
                this.event.setEvent('error', 'logError', this.errorObj);
            }
        }
        return res;
    }

    initiateUnauthorized(res: HttpErrorResponse, serviceName: any, input: any) {
        if (serviceName.indexOf('logError') < 0) {
            this.errorObj['eventType'] = 'unAuthorized';
            this.errorObj['serviceName'] = serviceName;
            this.errorObj['error'] = res.message;
            this.event.setEvent('error', 'logError', this.errorObj);
        }
        return res;
    }
}



