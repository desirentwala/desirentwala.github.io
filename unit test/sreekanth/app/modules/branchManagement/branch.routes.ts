import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchEditComponent } from './branchEdit/branchEdit';
import { BranchListComponent } from './branchList/branchList';
import { NewBranchComponent } from './newBranch/newBranch';

const routes: Routes = [
  { path: '', redirectTo: 'newBranch', pathMatch: 'full' },
  { path: 'newBranch', component: NewBranchComponent },
  { path: 'branchList', component: BranchListComponent },
  { path: 'branchEdit', component: BranchEditComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchRoutingModule { }