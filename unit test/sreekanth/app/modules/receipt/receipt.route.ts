import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptComponent } from "./receipt/receipt.component";

const routes: Routes = [
  { path: '', component: ReceiptComponent },
  { path: 'receipt', component: ReceiptComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptRoutingModule { }



