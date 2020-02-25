import { environment } from '../../../environments/environment';
import { ConfigService } from '../../core/services/config.service';
import { UserService } from '../login/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';

@Component({
  selector: 'redirect-component',
  template: ``
})

export class RedirectComponent implements OnInit {
  user: UserService;
  public isB2bcFlag: boolean = true;
  public isB2cFlag: boolean = true;
  constructor(_user: UserService, public config: ConfigService) {

  }

  ngOnInit() {

    if (this.config.getCustom('b2b2cFlag')) {
      this.config.navigateRouterLink(environment.b2b2cLandingUrl);
    } else if (this.config.getCustom('b2cFlag')) {
      this.config.navigateRouterLink(environment.b2cLandingUrl);
    } else if (localStorage.getItem('url') && localStorage.getItem('type')) {
      location.href  = (localStorage.getItem('url'));
      location.reload(true);
    } else {
      this.config.navigateRouterLink('/Login');
    }
  }
}
@NgModule({
  declarations: [RedirectComponent],
  imports: [CommonModule],
  exports: [RedirectComponent]
})
export class RedirectModule { }