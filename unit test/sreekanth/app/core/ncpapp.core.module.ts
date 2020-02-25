import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalStorageModule } from '@adapters/packageAdapter';

import { APP_PROVIDERS } from './providers';
import { APP_SERVICES } from './services';
import { SharedModule } from './shared/shared.module';
import { AllUiComponents } from './ui-components';

//import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    SharedModule,
    LocalStorageModule.withConfig({
      prefix: 'NCP',
      storageType: 'localStorage'
    })
  ],
  exports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AllUiComponents,
    LocalStorageModule
  ]
})
export class CoreModule {
  static start(): ModuleWithProviders {
    return {
      ngModule: CoreModule,

      providers: [...APP_SERVICES, ...APP_PROVIDERS]
    };
  }
}