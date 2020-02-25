import { NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineConsultationPageRoutingModule } from './online-consultation-routing.module';

//Pages - Import 
import { VideosessionLandingPage } from './videosession-landing/videosession-landing.page';
import { VideosessionPage } from './videosession/videosession.page';
import { DeviceInputsPage } from './device-inputs/device-inputs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    OnlineConsultationPageRoutingModule
  ],
  declarations: [
    VideosessionPage,
    DeviceInputsPage,
    VideosessionLandingPage
  ],
  entryComponents: [
    DeviceInputsPage,
  ],
  exports: [],
  schemas: [NO_ERRORS_SCHEMA]
})
export class OnlineConsultationPageModule {}
