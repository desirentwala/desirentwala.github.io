import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicLoader } from './dynamic-loader/dynamic-loader.component';

var routes: Routes = [
  { path: ':activity', component: DynamicLoader, pathMatch: 'full' },
  { path: ':module/:activity', component: DynamicLoader, pathMatch: 'full' },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllRouteModule { }


