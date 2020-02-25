import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseComponent } from './collapse.component';
import { TooltipModule } from '../tooltip/index';

@NgModule({
  imports:[CommonModule,SharedModule,TooltipModule],
  declarations: [ CollapseComponent],
  exports: [ CollapseComponent,SharedModule]
})
export class CollapseModule { }
