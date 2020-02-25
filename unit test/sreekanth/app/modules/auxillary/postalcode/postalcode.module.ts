import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreModule } from '../../../core/index';
import { SharedModule } from './../../../core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { PostalCodeRoutingModule } from './postalcode.routes';
import { PostalCodeFormComponent } from './postalcodeform/postalcodeform.component';
import { PostalCodeFormService } from './services/postalcodeform.service';
import { NewPostalCodeComponent } from './newpostalcode/newPostalCode.component';
import { UiMiscModule } from '../../../core/ui-components/misc-element/misc.component';
import { PostalCodeListComponent } from './postalcodelist/postalCodeList.component';
import { PostalCodeEditComponent } from './postalcodeEdit/postalCodeEdit.component';

@NgModule({
  declarations: [PostalCodeFormComponent, NewPostalCodeComponent, PostalCodeListComponent, PostalCodeEditComponent],
  imports: [
    CommonModule,
    PostalCodeRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UiMiscModule
  ],
  providers: [PostalCodeFormService],
  exports: [PostalCodeFormComponent, NewPostalCodeComponent, PostalCodeListComponent, PostalCodeEditComponent],
  entryComponents: [PostalCodeFormComponent, NewPostalCodeComponent, PostalCodeListComponent, PostalCodeEditComponent]
})
export class PostalCodeModule { }
