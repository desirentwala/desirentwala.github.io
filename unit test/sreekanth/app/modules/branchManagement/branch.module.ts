import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/index';
import { OrderBy } from '../../core/ui-components/table-filter/pipes/orderBy';
import { SearchBy } from '../../core/ui-components/table-filter/pipes/searchBy';
import { BranchEditComponent } from './branchEdit/branchEdit';
import { BranchformComponent } from './branchform/branchform.component';
import { BranchListComponent } from './branchList/branchList';
import { BranchRoutingModule, BRANCH_FORM_SERVICES } from './index';
import { NewBranchComponent } from './newBranch/newBranch';
import {  UiMiscModule } from '../../core/ui-components/misc-element/misc.component';


@NgModule({
    imports: [
        BranchRoutingModule, CoreModule, ReactiveFormsModule, CommonModule, UiMiscModule 
    ],
    declarations: [
        BranchformComponent, NewBranchComponent, BranchListComponent, BranchEditComponent
    ],
    providers: [SearchBy, OrderBy, BRANCH_FORM_SERVICES],
    entryComponents: [NewBranchComponent, BranchListComponent, BranchEditComponent]
})

export class BranchModules { }