import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyEndorsementsComponent } from './endorsement/policyEndorsements';
import { AviationComponent } from './lineOfBusiness/aviation/aviation.component';
import { FireHomeComponent } from './lineOfBusiness/fireInsurance/fireHome/fh.component';
import { LifeComponent } from './lineOfBusiness/life/life.component';
import { MarineComponent } from './lineOfBusiness/marine/marine.component';
import { PersonalMotorComponent } from './lineOfBusiness/motor/personal/pm.component';
import { PersonalAccidentComponent } from './lineOfBusiness/personalAccidental/pa.component';
import { TravelComponent } from './lineOfBusiness/travel/travel.component';

const routes: Routes = [
  { path: '', redirectTo: 'travelProtector', pathMatch: 'full' },
  { path: 'endorsement', component: PolicyEndorsementsComponent },
  { path: 'travel', component: TravelComponent },
  { path: 'personalAccident', component: PersonalAccidentComponent },
  { path: 'fire', component: FireHomeComponent },
  { path: 'motor', component: PersonalMotorComponent },
  { path: 'life', component: LifeComponent },
  { path: 'droneInsurance', component: AviationComponent },
  { path: 'marine', component: MarineComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotRoutingModule { }


