import { SharedModule } from '../../shared/shared.module';
import { WizardComponent } from './wizard.component';
import { WizardStepComponent } from './wizard-step.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UiButtonModule } from '../button';
import { UiMiscModule } from '../misc-element/misc.component';
/**
 * This barrel file provides the exports for all ui components).
*/
export * from './wizard.component';
export * from './wizard-step.component';


export const WIZARD_DIRECTIVES = [
    WizardComponent, WizardStepComponent
];


@NgModule({
  declarations: WIZARD_DIRECTIVES,
  imports: [ CommonModule,ReactiveFormsModule, SharedModule, UiButtonModule, UiMiscModule],
  exports: [WIZARD_DIRECTIVES, SharedModule],
})
export class UiStepNavigatorModule { }