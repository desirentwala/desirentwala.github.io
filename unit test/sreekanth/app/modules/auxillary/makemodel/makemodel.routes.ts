import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewMakeComponent } from './newmake/newmake.component';
import { MakeListComponent } from './makemaintenance/makeList.component';
import { MakeEditComponent } from './makeEdit/makeEdit.component';
import { NewModelComponent } from './newModel/newModel.component';
import { ModelListComponent } from './modelList/modelList.component';
import { ModelEditComponent } from './modelEdit/modelEdit.component';

const routes: Routes = [
  { path: '', redirectTo: 'newMake', pathMatch: 'full' },
  { path: 'newMake', component:  NewMakeComponent},
  { path: 'makeList', component: MakeListComponent },
  { path: 'makeEdit', component: MakeEditComponent },
  { path: 'newModel', component:  NewModelComponent},
  { path: 'modelList', component: ModelListComponent },
  { path: 'modelEdit', component: ModelEditComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MakemodelRoutingModule { }
