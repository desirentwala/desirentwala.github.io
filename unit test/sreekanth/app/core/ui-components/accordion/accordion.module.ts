import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from '../collapse/collapse.module';
import { AccordionPanelComponent } from './accordion-group.component';
import { AccordionComponent } from './accordion.component';

@NgModule({
  imports: [CommonModule, CollapseModule,SharedModule],
  declarations: [AccordionComponent, AccordionPanelComponent],
  exports: [AccordionComponent, AccordionPanelComponent,SharedModule]
})
export class AccordionModule {
}
