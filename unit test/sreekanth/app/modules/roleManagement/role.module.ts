import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/index';
import { UiMiscModule } from '../../core/ui-components/misc-element/misc.component';
import { OrderBy } from '../../core/ui-components/table-filter/pipes/orderBy';
import { SearchBy } from '../../core/ui-components/table-filter/pipes/searchBy';
import { RoleRoutingModule, ROLE_FORM_SERVICES } from './index';
import { NewRoleComponent } from './newRole/newRole';
import { RoleEditComponent } from './roleEdit/roleEdit';
import { RoleformComponent } from './roleform/roleform.component';
import { RoleListComponent } from './roleList/roleList';

@NgModule({
    imports: [
        RoleRoutingModule, CoreModule, ReactiveFormsModule, CommonModule, UiMiscModule
    ],
    declarations: [
        RoleformComponent, NewRoleComponent, RoleListComponent, RoleEditComponent
    ],
    providers: [SearchBy, OrderBy, ROLE_FORM_SERVICES],
    entryComponents: [NewRoleComponent, RoleListComponent, RoleEditComponent]
})

export class RoleModule { }