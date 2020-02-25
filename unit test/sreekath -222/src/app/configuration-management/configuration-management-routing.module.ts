import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientViewPage } from './client-view/client-view.page';

const routes: Routes = [
  {
    path: '',
    component: ClientViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationManagementPageRoutingModule {}
