import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/index';
import { OrderBy } from '../../core/ui-components/table-filter/pipes/orderBy';
import { SearchBy } from '../../core/ui-components/table-filter/pipes/searchBy';
import { UserRoutingModule } from './index';
import { NewUserComponent } from './newUser/newUser';
import { UserEditComponent } from './userEdit/userEdit';
import { UserformComponent } from './userform/userform.component';
import { UserListComponent } from './userList/userList';
import { UiMiscModule } from '../../core/ui-components/misc-element/misc.component';

@NgModule({
    imports: [
        UserRoutingModule, CoreModule, ReactiveFormsModule, CommonModule, UiMiscModule
    ],
    declarations: [
        UserformComponent, NewUserComponent, UserListComponent, UserEditComponent
    ],
    providers: [SearchBy, OrderBy],
    entryComponents: [NewUserComponent, UserListComponent, UserEditComponent]
})

export class UserModules { }
