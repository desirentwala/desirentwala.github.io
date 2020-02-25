import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Market } from '@ionic-native/market/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ApiInterceptorService } from './common/services/api-interceptor.service';
import { HomePopoverPage } from './common/components/home-popover/home-popover.page';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import { LoaderComponent } from './common/components/loader/loader.component';
import { IonicStorageModule } from '@ionic/storage';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@NgModule({
  declarations: [AppComponent, HomePopoverPage, LoaderComponent],
  entryComponents: [HomePopoverPage],
  imports: [BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: '_mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    IonicModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    FileOpener,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptorService,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    File,
    Market,
    AndroidPermissions,
    InAppBrowser
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
