import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class VHDAdminGuard implements CanActivate {
  constructor(private router: Router , private commonService: CommonService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.commonService.getStorage['userroles.role.roleName'] === 'VHDA') {
        return true;
      }
      // this.router.navigateByUrl('/vhdadmin');
      this.router.navigate(['/vhdadmin']);
      return false;
  }
}
