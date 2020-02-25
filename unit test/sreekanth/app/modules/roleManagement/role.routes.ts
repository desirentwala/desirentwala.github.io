import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewRoleComponent } from './newRole/newRole';
import { RoleEditComponent } from './roleEdit/roleEdit';
import { RoleListComponent } from './roleList/roleList';

const routes: Routes = [
  { path: '', redirectTo: 'newRole', pathMatch: 'full' },
  { path: 'newRole', component: NewRoleComponent },
  { path: 'roleList', component: RoleListComponent },
  { path: 'roleEdit', component: RoleEditComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleRoutingModule { }