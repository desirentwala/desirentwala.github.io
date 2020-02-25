import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/index';
import { OrderBy } from '../../core/ui-components/table-filter/pipes/orderBy';
import { SearchBy } from '../../core/ui-components/table-filter/pipes/searchBy';
import { USER_GROUP_SERVICES } from './index';
import { NewUserGroupComponent } from './newUserGroup/newUserGroup';
import { UserGroupRoutingModule } from './usergroup.routes';
import { UserGroupFormComponent } from './usergroup/userGroupForm.component';
import { UserGroupEditComponent } from './userGroupEdit/userGroupEdit';
import { UserGroupListComponent } from './userGroupList/userGroupList';


@NgModule({
    imports: [
        UserGroupRoutingModule, CoreModule, ReactiveFormsModule, CommonModule,
    ],
    declarations: [
        UserGroupFormComponent, NewUserGroupComponent, UserGroupListComponent, UserGroupEditComponent
    ],
    providers: [SearchBy, OrderBy, USER_GROUP_SERVICES],
    entryComponents: [NewUserGroupComponent, UserGroupListComponent, UserGroupEditComponent]
})

export class UserGroupModule { }
