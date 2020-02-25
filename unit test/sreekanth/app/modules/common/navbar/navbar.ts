import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../core/services/config.service';
import { Component, NgModule } from '@angular/core';
import { HeaderModule } from './header/header';
import { SearchModule } from './search/search';
import { UsernotificationModule } from './userNotification/userNotification';
import { NotificationServices } from './userNotification/services/userNotification.service';
import { BreadCrumbService } from '../breadCrumb/index';
import { SharedService } from '../../../core/shared/shared.service';
import { SharedModule } from '../../../core/shared/shared.module';/**
 * This class represents the navigation bar component.
 */
import { DataSyncModule } from './dataSynv/dataSync.component';
@Component({

  selector: 'ncp-navbar',
  templateUrl: './navbar.html'

})
export class Navbar {
  adminFlag: boolean = false;
  constructor(public configService: ConfigService,
    public shared: SharedService) {
    if (this.configService.getCustom('roleId') === 'ADM') {
      this.adminFlag = true;
    }
  }
}

@NgModule({
  declarations: [Navbar],
  imports: [HeaderModule, SearchModule, UsernotificationModule, CommonModule, SharedModule,DataSyncModule],
  exports: [Navbar],
  providers: [NotificationServices, BreadCrumbService]
})
export class NavbarModule { }
