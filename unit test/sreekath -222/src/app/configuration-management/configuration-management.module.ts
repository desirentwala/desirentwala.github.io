import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigurationManagementPageRoutingModule } from './configuration-management-routing.module';

import { ClientViewPage } from './client-view/client-view.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigurationManagementPageRoutingModule
  ],
  declarations: [ClientViewPage]
})
export class ConfigurationManagementPageModule {}
