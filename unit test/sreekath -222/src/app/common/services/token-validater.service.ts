import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

// import { MatSnackBar } from '@angular/material/snack-bar';
const jwtHelper = new JwtHelperService();
// tslint:disable-next-line:max-line-length
const dToken = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjI1MjI4Mzg5MjAsImlhdCI6MTU3Njc1ODkyMCwic3ViIjoiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5Lk1nLmFMTlZia1A3czFyb1lIaS13SEVGQ2hya2o0OGlMWF96Y3BndjJuRUIzanMifQ.m6Xh6i8RwU3AUyhe8RcMk1WfuFzk11kGvbTIUD35QC4`;
const secretKey =  `0ED7E366D006949930A538DF72A83E5380B936B872B9D2AB5D0450EFCA6B3B54`;
@Injectable({
  providedIn: 'root'
})
export class TokenValidaterService {

  constructor(
    private http: HttpClient
    // private _snackBar: MatSnackBar
    ) { }

  /**
   * Checking jwt token validation
   * @param token jwt token
   */
  public validateToken(token): any {
    if (token) {
      if (jwtHelper.isTokenExpired(token)) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  /**
   * get decoded token info
   * @param token token
   */
  public getTokenInfo(token): any {
    return jwtHelper.decodeToken(token);
  }

  /**
   * Clearing application data stored in localStorage
   */
  public clearLoaclStorages(): any {
    window.localStorage.clear();
  }

  public defaultToken(): string {
    return dToken;
  }

  public secretToken(): string {
    return secretKey;
  }
}
