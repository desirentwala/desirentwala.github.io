import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewUserGroupComponent } from './newUserGroup/newUserGroup';
import { UserGroupEditComponent } from './userGroupEdit/userGroupEdit';
import { UserGroupListComponent } from './userGroupList/userGroupList';

const routes: Routes = [
  { path: '', redirectTo: 'newUser', pathMatch: 'full' },
  { path: 'newUserGroup', component: NewUserGroupComponent },
  { path: 'userGroupList', component: UserGroupListComponent },
  { path: 'userGroupEdit', component: UserGroupEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserGroupRoutingModule { }


