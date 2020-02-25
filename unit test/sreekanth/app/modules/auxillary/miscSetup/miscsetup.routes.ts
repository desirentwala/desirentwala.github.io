import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewMiscSetupComponent } from './newMiscSetup/newMiscSetup.component';
import { MiscSetupListComponent } from './miscSetupList/miscSetupList.component';
import { MiscSetupEditComponent } from './miscSetupEdit/miscSetupEdit.component';

const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'newMiscSetup'},
  {path:'newMiscSetup',component:NewMiscSetupComponent},
  {path:'miscSetupList',component:MiscSetupListComponent},
  {path:'miscSetupEdit',component:MiscSetupEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiscsetupRoutingModule { }
