import { SharedModule } from '../../shared/shared.module';
import { Ng2WizardStep } from './ng2-wizard-step.component';
import { Ng2WizardTab } from './ng2-wizard-tab.component';
import { Ng2Wizard } from './ng2-wizard.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
/**
 * This barrel file provides the exports for all ui components).
*/
export * from './ng2-wizard-step.component';
export * from './ng2-wizard-tab.component';
export * from './ng2-wizard.component';
export * from './ng2-wizard.component';


export const WIZARD_DIRECTIVES = [
  Ng2WizardStep, Ng2WizardTab,Ng2Wizard
];


@NgModule({
  declarations: WIZARD_DIRECTIVES,
  imports: [ CommonModule,ReactiveFormsModule,SharedModule],
  exports: [WIZARD_DIRECTIVES,SharedModule],
})
export class UiWizardModule { }