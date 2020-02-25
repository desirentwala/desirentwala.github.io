import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/index';
import { NCPFormUtilsService } from '../../core/ncp-forms/ncp.form.utils';
import { NCPFormModule } from '../../core/ncp-forms/ncp.forms.module';
import { PolicyEndorsementsComponent } from './endorsement/policyEndorsements';
import { QUOT_SERVICES, QuotRoutingModule } from './index';
import { AviationComponent } from './lineOfBusiness/aviation/aviation.component';
import { FireHomeComponent } from './lineOfBusiness/fireInsurance/fireHome/fh.component';
import { LifeComponent } from './lineOfBusiness/life/life.component';
import { MarineComponent } from './lineOfBusiness/marine/marine.component';
import { PersonalMotorComponent } from './lineOfBusiness/motor/personal/pm.component';
import { PersonalAccidentComponent } from './lineOfBusiness/personalAccidental/pa.component';
import { TravelComponent } from './lineOfBusiness/travel/travel.component';
import { TransactionComponent } from './transaction.component';

@NgModule({
	imports: [
		QuotRoutingModule,
		CoreModule, ReactiveFormsModule, CommonModule, NCPFormModule
	],
	declarations: [
		PolicyEndorsementsComponent, PersonalAccidentComponent, FireHomeComponent, PersonalMotorComponent, TravelComponent, TransactionComponent, LifeComponent, AviationComponent, MarineComponent
	],
	providers: [QUOT_SERVICES, NCPFormUtilsService],
	entryComponents: [TravelComponent, PolicyEndorsementsComponent, PersonalAccidentComponent, FireHomeComponent, PersonalMotorComponent, LifeComponent, AviationComponent, MarineComponent]
})

export class TransactionModules { }
