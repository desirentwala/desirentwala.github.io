import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { MakemodelRoutingModule } from './makemodel.routes';
import { CoreModule } from '../../../core/index';
import { SharedModule } from './../../../core/shared/shared.module';
import { MakeListComponent } from './makemaintenance/makeList.component';
import { MakeEditComponent } from "./makeEdit/makeEdit.component";
import { MakeFormComponent } from './makeform/makeform.component';
import { NewMakeComponent } from './newmake/newmake.component';
import { MakeModelService } from './services/makemodel.service';
import { NewModelComponent } from './newModel/newModel.component';
import { ModelListComponent } from './modelList/modelList.component';
import { ModelEditComponent } from './modelEdit/modelEdit.component';
import { ModelFormComponent } from './modelform/modelform.component';

@NgModule({
  declarations: [MakeEditComponent,MakeFormComponent,NewMakeComponent,NewModelComponent,ModelListComponent,ModelEditComponent,ModelFormComponent,MakeListComponent],
  imports: [
    CommonModule,
    MakemodelRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [MakeModelService],
  exports:[MakeEditComponent,MakeFormComponent,NewMakeComponent,NewModelComponent,ModelListComponent,ModelEditComponent,ModelFormComponent, MakeListComponent],
  entryComponents:[MakeEditComponent,MakeFormComponent,NewMakeComponent,NewModelComponent,ModelListComponent,ModelEditComponent,ModelFormComponent,MakeListComponent]
})
export class MakemodelModule { }
