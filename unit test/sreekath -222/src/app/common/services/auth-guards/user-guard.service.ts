import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router , private commonService: CommonService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.commonService.getStorage['userroles.role.roleName'] === 'PO') {
        return true;
      }
      // this.router.navigateByUrl('/practiceadmin');
      this.router.navigate(['/pets']);
      return false;
  }
}
