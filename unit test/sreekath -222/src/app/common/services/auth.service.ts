import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiList } from './api-list';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { TokenValidaterService } from './token-validater.service';
import { map } from 'rxjs/operators';
import { CommonService } from './common.service';
import { Compiler } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MagicLinkService } from 'src/app/common/services/magic-link/magic-link.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenValidaterService: TokenValidaterService,
    private commonService: CommonService,
    private magicLinkService: MagicLinkService,
    private compiler: Compiler, private storage: Storage) {
  }

  /**
   * Login service using email and password
   * param loginObj
   */
  public authCheckByEmail(loginObj): Observable<any> {
    return this.http.post(`${ApiList.AUTH_APIS.loginChecker}`, { email: `${loginObj.email}` })
      .pipe(map((res: any) => res));
  }

  /**
   * Encrypting password using secrete key.
   * @param password entered by User
   * @param skey secrete key
   */
  public encryptPassword(password, skey: any = ''): any {
    const key = CryptoJS.enc.Utf8.parse(skey);
    const civ = CryptoJS.enc.Utf8.parse('encryptionIntVec');
    const encryptedPassword = CryptoJS.AES.encrypt(password, key, {
      iv: civ,
      keySize: key,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encryptedPassword;
  }

      /**
     * password decryption using AES algorithm
     * @param password to decrypt
     * @param secret set default secretKey / randomSalt
     */
    public passwordDecrypt(password, secret = ''): any {
      secret = (secret !== '' ? secret : this.tokenValidaterService.secretToken());
      const key = CryptoJS.enc.Utf8.parse(secret);
      const civ = CryptoJS.enc.Utf8.parse('encryptionIntVec');
      const decryptedPassword = CryptoJS.AES.decrypt(password, key, {
          keySize: secret.length,
          iv: civ,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      return decryptedPassword.toString(CryptoJS.enc.Utf8);
  }

  /**
   * respose with message, status, data
   * @param loginObj as request (emailId, password)
   */
  public signIn(authObj: any, saltValue): Observable<any> {
    const param = new HttpParams().set('q', saltValue);
    return this.http.post(`${ApiList.AUTH_APIS.signIn}`, authObj, { params: param })
      .pipe(map((res: any) => {
        const data = res.data;
        // set localstorages
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('result', JSON.stringify(data.eRsul));
        return res;
      }));

  }

  /**
   * mailId, password as request
   * @param resetObj to reset password
   */
  public resetPassword(resetObj: any, userId): Observable<any> {
    return this.http.post(`${ApiList.AUTH_APIS.resetPassword}?q=${userId}`, resetObj);
  }

  /**
   * response message
   * @param obj of mailId will send with resetpassword mail link
   */
  public forgotPassword(obj: any): Observable<any> {
    return this.http.post(`${ApiList.AUTH_APIS.forgotPassword}`, obj);
  }

  /**
   * random salt generation for password
   */
  public randomSalt(): Observable<any> {
    return this.http.post(`${ApiList.AUTH_APIS.token}`, '');
  }

  /**
   * Signing out from application.
   * Clearing all application realted data from LocalStorage.
   */
  public signOut(): void {
    if (this.commonService.getStorage) {
      const userId = this.commonService.getStorage.id;
      this.logout({id: userId}).subscribe();
      this.compiler.clearCache();
      this.storage.clear();
      localStorage.clear();
      this.router.navigateByUrl('/auth');
    }
  }

  /**
   * Handling naviation using auth token
   * @param token access token
   */
  public autoNavigate(token): void {
    if (!this.tokenValidaterService.validateToken(token)) {
      this.commonService.navigateByRole();
    } else {
      this.tokenValidaterService.clearLoaclStorages();
      this.router.navigateByUrl('/');
    }
  }

  // fetching captcha
  getCaptcha() {
    return this.http.get(`${ApiList.AUTH_APIS.captcha}`);
  }

  /**
   *  user registeration
   * @param Data User data
   */
  registerUser(data): Observable<any> {
    return this.http.post(`${ApiList.AUTH_APIS.signUp}`, data)
      .pipe(map((res: any) => {
        if (res.secret !== 201) {
          localStorage.setItem('secret', res.secret);
        }
        this.setUser(res.data);

      }));
  }

  resendotp(resendotpDetails): Observable<any> {
    return this.http.post(`${ApiList.AUTH_APIS.resendOtpVerification}`, resendotpDetails);
  }

  verifyOTP(otpDetails): Observable<any> {
    return this.http.post(`${ApiList.AUTH_APIS.otpVerification}`, otpDetails);
  }

  setUser(res) {
    this.userData = res;
  }

  getUser() {
    return this.userData;
  }

  logout(obj: any): Observable<any> {
    return this.http.post(`${ApiList.AUTH_APIS.signOut}`, obj);
  }
}
