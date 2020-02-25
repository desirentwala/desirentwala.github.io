import {
    HTTP_INTERCEPTORS,
} from '@adapters/packageAdapter';
import { NgModule } from '@angular/core';
import { HeaderInterceptor } from './header-interceptor';
import { ResponseInterceptor } from './response-interceptor';

@NgModule({
    imports: [],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true }
    ]
})
export class InterceptorModule { }