import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewPostalCodeComponent } from './newpostalcode/newPostalCode.component';
import { PostalCodeListComponent } from './postalcodelist/postalCodeList.component';
import { PostalCodeEditComponent } from './postalcodeEdit/postalCodeEdit.component';

const routes: Routes = [
  { path: '', redirectTo: 'newPostalCode', pathMatch: 'full' },
  { path: 'newPostalCode', component:  NewPostalCodeComponent},
  { path: 'postalCodeList', component:  PostalCodeListComponent},
  { path: 'postalCodeEdit', component:  PostalCodeEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostalCodeRoutingModule { }