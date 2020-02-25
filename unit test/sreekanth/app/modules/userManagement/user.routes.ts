import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewUserComponent } from './newUser/newUser';
import { UserEditComponent } from './userEdit/userEdit';
import { UserListComponent } from './userList/userList';

const routes: Routes = [
  { path: '', redirectTo: 'newUser', pathMatch: 'full' },
  { path: 'newUser', component: NewUserComponent },
  { path: 'userList', component: UserListComponent },
  { path: 'userEdit', component: UserEditComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }


