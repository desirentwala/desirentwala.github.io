import { SharedModule } from './../../core/shared/shared.module';
import { ClaimsComponent } from './claims.component';
import { CoreModule } from '../../core/index';
import { NCPFormUtilsService } from '../../core/ncp-forms/ncp.form.utils';
import { NCPFormModule } from '../../core/ncp-forms/ncp.forms.module';
import { ClaimRoutingModule } from './index';
import { FnolComponent } from './fnol/fnol.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiMiscModule } from '../../core/ui-components/misc-element/misc.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	imports: [
		ClaimRoutingModule,
		CoreModule, ReactiveFormsModule, CommonModule,NCPFormModule,SharedModule,UiMiscModule
	],
	declarations: [
		FnolComponent,ClaimsComponent
	],
	providers: [NCPFormUtilsService],
	entryComponents: [FnolComponent,ClaimsComponent]
})

export class ClaimModules { }
