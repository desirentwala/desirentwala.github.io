import { AllUiComponents } from './../../../core/ui-components/all.uicomponents.module';
import { ModalModule } from './../../../core/ui-components/modal/index';
import { NgModule, Component } from '@angular/core';
import { FooterlogoModule } from './footerLogo/footerLogo';
import { MapModule } from './map/map';
import { FootercontactModule } from './footerContact/footerContact';
import { SharedService } from '../../../core/shared/shared.service';
import { SharedModule } from '../../../core/shared/shared.module';
import { CommonModule } from '@angular/common';

/**
 * This class represents the navigation bar component.
 */
@Component({
  

  selector: 'ncp-footer',
  templateUrl: './footer.html'
})
export class Footer { 
  constructor(public shared: SharedService){}
}

@NgModule({
  declarations: [Footer],
  imports: [FooterlogoModule, MapModule,FootercontactModule,AllUiComponents, SharedModule, CommonModule],
  exports: [Footer]
})
export class FooterModule { } 
