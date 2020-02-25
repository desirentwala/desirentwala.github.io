import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@adapters/packageAdapter';
import { Injectable } from '@angular/core';
import { Observable } from '@adapters/packageAdapter';
import { tap } from '@adapters/packageAdapter';
import { environment } from '../../../environments/environment';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!environment.production) {
            request = request.clone({ withCredentials: true });
        }
        return next.handle(request).pipe(tap((ev: HttpEvent<any>) => {
                if (ev instanceof HttpResponse) {
                }
            }))
    }
}
