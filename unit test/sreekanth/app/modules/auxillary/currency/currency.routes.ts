import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewCurrencyComponent } from './newCurrency/newCurrency.component';
import { CurrencyListComponent } from './currencyList/currencyList.component';
import { CurrencyEditComponent } from './currencyEdit/currencyEdit.component';


const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'newCurrency'},
  {path:'newCurrency',component:NewCurrencyComponent},
  {path:'currencyList',component:CurrencyListComponent},
  {path:'currencyEdit',component:CurrencyEditComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyRoutingModule { }
