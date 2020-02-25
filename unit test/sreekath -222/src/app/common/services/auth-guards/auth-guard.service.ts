import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwtHelper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  token: any;
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.token = localStorage.getItem('accessToken');
    if (this.token && !jwtHelper.isTokenExpired(this.token) ) {
      return true;
    } else {
        this.router.navigate(['/']);
        return false;
    }
  }}
