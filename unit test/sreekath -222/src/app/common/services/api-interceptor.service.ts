import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TokenValidaterService } from './token-validater.service';
import { NotificationService } from './notification.service';
import { CommonService } from './common.service';
import { LoaderService } from './loader.service';
import { BusyIndicatorService } from './busy-indicator.service';
const errMsg = '';
@Injectable({
  providedIn: 'root'
})
export class ApiInterceptorService implements HttpInterceptor {
  token: any;
  accessToken: any;
  constructor(
    private notificationService: NotificationService,
    private tokenService: TokenValidaterService,
    private commonService: CommonService,
    // private loaderService: LoaderService
    private busyIndicator: BusyIndicatorService,
    private authService: AuthService
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.showLoader();
    if (this.commonService.getToken) {
      if (this.tokenService.validateToken(this.commonService.getToken)) {
        this.authService.signOut();
      } else {
        this.token = this.commonService.getToken;
      }
    } else {
      this.token = this.tokenService.defaultToken();
    }

    const req: any = request.clone({
      url: `${environment.baseUri}${request.url}`,
      setHeaders: { Authorization: `Bearer ${this.token}` }
    });
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'multipart/form-data') });
    }
    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    return next.handle(req)
      .pipe(
        tap(evt => {
          if (evt instanceof HttpResponse) {
            if (evt.body) {
              this.customException(evt);
            }
          }
        }),
        catchError((error: HttpErrorResponse) => {
          // Client Side Error
          if (error.error instanceof ErrorEvent) {
            this.customException(error);
          } else {  // Server Side Error
            this.customException(error);
          }
          return throwError(errMsg);
        }),
        finalize(() => this.hideLoader())
      );
  }

  private customException(resp): any {
    switch (resp.status) {
      case 0:
        this.notificationService.notification('Application is busy, please try after few minutes!', 'danger');
        break;
      case 500:
        this.notificationService.notification(resp.error.message, 'danger');
        break;
      case 401:
        this.notificationService.notification(resp.error.message, 'danger');
        break;
      case (resp.status > 200 && resp.status <= 299):
        this.notificationService.notification(resp.body.message, 'success');
        break;
      case 201:
        this.notificationService.notification(resp.body.message, 'success');
        break;
      default:
        break;
    }
  }

  private showLoader(): void {
    // this.loaderService.show();
    this.busyIndicator.setStatus(true);
  }
  private hideLoader(): void {
    // this.loaderService.hide();
    this.busyIndicator.setStatus(false);
  }
}
