import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreModule } from '../../../core/index';
import { SharedModule } from '../../../core/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { UiMiscModule } from '../../../core/ui-components/misc-element/misc.component';
import { CurrencyRoutingModule } from './currency.routes';
import { CurrencyService } from './services/currency.service';
import { NewCurrencyComponent } from './newCurrency/newCurrency.component';
import { CurrencyFormComponent } from './currencyForm/currencyForm.component';
import { CurrencyListComponent } from './currencyList/currencyList.component';
import { CurrencyEditComponent } from './currencyEdit/currencyEdit.component';

@NgModule({
  declarations: [NewCurrencyComponent,CurrencyFormComponent,CurrencyListComponent,CurrencyEditComponent],
  imports: [
    CommonModule,
    CurrencyRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UiMiscModule
  ],
  providers: [CurrencyService],
  exports: [NewCurrencyComponent,CurrencyFormComponent,CurrencyListComponent,CurrencyEditComponent],
  entryComponents:[NewCurrencyComponent,CurrencyFormComponent,CurrencyListComponent,CurrencyEditComponent]
})
export class CurrencyModule { }
