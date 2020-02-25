import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../login/services/user/user.service';
import { ConfigService } from '../../core/services/config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  user: UserService;
  constructor(public router: Router, _user: UserService, public config: ConfigService) {
    this.user = _user;
  }
  canActivate() {
    if (this.user.isLoggedIn()) {
      return true;
    } else {
      let type = localStorage.getItem('type');
      if (type) {
        this.config.loggerSub.next('reloadingScreen');
        this.user.redirectToStoredUrl();
        return true;
      } else {
        this.router.navigate(['/Login']);
        return false;
      }
    }
  }
}