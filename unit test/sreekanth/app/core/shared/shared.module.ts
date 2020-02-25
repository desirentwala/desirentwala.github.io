import { HttpClient } from '@adapters/packageAdapter';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslatePipe, TranslateService } from '@adapters/packageAdapter';

import { CustomLoader } from './customLoader';
import { SharedService } from './shared.service';

export function createTranslateLoader(http: HttpClient) {
    return new CustomLoader(http);
}

@NgModule({
    imports: [TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useClass: CustomLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
        }
    }), ],
    exports: [TranslatePipe, TranslateModule],
    providers: [SharedService, TranslateService]
})
export class SharedModule { }
