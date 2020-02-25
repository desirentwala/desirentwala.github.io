import { HeaderModule } from '../..';
import { BreadCrumbService } from '../../breadCrumb/index';
import { Component, NgModule } from '@angular/core';

/**
 * This class represents the navigation bar component.
 */
@Component({

  selector: 'b2c-ncp-navbar',
  templateUrl: './navbar.html'

})
export class NavbarB2C {

}

@NgModule({
  declarations: [NavbarB2C],
  imports: [HeaderModule],
  exports: [NavbarB2C],
  providers: [BreadCrumbService]
})
export class NavbarModuleB2C {
  constructor() {

  }
}
