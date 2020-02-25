import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/ncpapp.core.module';
import { SharedModule } from '../../core/shared/shared.module';
import { UiMiscModule } from '../../core/ui-components/misc-element/misc.component';
import { ReceiptRoutingModule } from "./receipt.route";
import { ReceiptComponent } from "./receipt/receipt.component";

@NgModule({
  imports: [
    CommonModule, ReceiptRoutingModule, CoreModule, ReactiveFormsModule, SharedModule, UiMiscModule],
  declarations: [ReceiptComponent],
  entryComponents: [ReceiptComponent]
})
export class ReceiptModule { }
