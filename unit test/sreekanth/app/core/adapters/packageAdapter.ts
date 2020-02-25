/**
 * PackageAdapter works as a wrapper of all external packages
 * which is used to make existing classes work with the same package interfaces
 * without modifying their source code
 *
 * @summary   Node-package Wrapper
 *
 * @since     21.11.2018
 */

/** jshint {inline configuration here} */

export { TranslateService, TranslatePipe, TranslateModule, TranslateLoader } from '@ngx-translate/core';
export { AgmCoreModule, MapsAPILoader } from '@agm/core';
export { animate, style, transition, trigger, state } from '@angular/animations';
export { BasePortalHost, ComponentPortal, PortalHostDirective, TemplatePortal, PortalModule, PortalInjector, ComponentType } from '@angular/cdk/portal';
export { CommonModule, CurrencyPipe } from '@angular/common';
export { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS, HttpHeaders, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
export {
    Injectable,
    OnInit,
    AfterContentInit,
    Component,
    NgModule,
    ChangeDetectorRef,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    Input,
    OnDestroy,
    ComponentRef,
    ElementRef,
    EmbeddedViewRef,
    HostBinding,
    HostListener,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    Pipe,
    PipeTransform,
    forwardRef,
    AfterViewInit,
    ChangeDetectionStrategy,
    Optional,
    Sanitizer,
    Renderer,
    Output,
    ContentChildren,
    enableProdMode
} from '@angular/core';
export { JwtHelperService } from '@auth0/angular-jwt';
export {
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbDateStruct,
    NgbTimeStruct,
    NgbModalModule
} from '@ng-bootstrap/ng-bootstrap';
export { NgIdleModule, DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
export { NgxChartsModule } from '@swimlane/ngx-charts';
export { TooltipModule } from '@swimlane/ngx-charts/release';
export { NgxDnDModule } from '@swimlane/ngx-dnd';
export { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
export { CKEditorModule } from 'ng2-ckeditor';
export { HaversineService, GeoCoord } from 'ng2-haversine';
export { IonRangeSliderModule } from 'ng2-ion-range-slider';
export { ContextMenuModule } from 'ngx-contextmenu';
export { NgDashboardModule, DashboardComponent } from 'ngx-dashboard';
export { GooglePlaceModule } from 'ngx-google-places-autocomplete';
export {
    Observable,
    Subject,
    Subscription,
    BehaviorSubject,
    throwError,
    forkJoin,
    throwError as observableThrowError,
    timer,
    interval
} from 'rxjs';
export {
    map,
    tap,
    catchError,
    take,
    delay,
    filter,
    share,
    takeUntil
} from 'rxjs/operators';
