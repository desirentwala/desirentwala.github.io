import { environment } from '../../../../../environments/environment';
import { ProductDetailsService } from '../../../../modules/product/services/product.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { B2B2CServices } from '../../../../b2b2c/services/b2b2c.service';
import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { LoginFormModel } from '../../model/login-model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from '@adapters/packageAdapter';
import { Subject } from '@adapters/packageAdapter';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { TranslateService } from '@adapters/packageAdapter';
import { ThemeService } from '../../../../core/ui-components/theme/theme.services';

@Injectable()
export class UserService {
  _loggedIn = new BehaviorSubject(false);
  loginFormModel: LoginFormModel;
  isError = false;
  errors = [];
  createNewUserFormGroup;
  createNewUserModal = false;
  firstLoginSub: any = new Subject();
  errorLoginPage: any = new Subject();
  requestSigSub: any = new Subject();
  forceLoginSub: Subject<any> = new Subject();
  configLoadedForExternalUsers: Subject<any> = new Subject();
  isExternal: boolean = false;
  paymentFlag: boolean = false;
  authenticationType;
  thirdPartySiginError: any = {};
  constructor(public _logger: Logger, public _config: ConfigService,
    _loginFormModel: LoginFormModel, public b2b2cServices: B2B2CServices, public localStorageService: LocalStorageService, public productDetailsService: ProductDetailsService,
    public utilsService: UtilsService, public translate: TranslateService, public themeService: ThemeService) {
    this.loginFormModel = _loginFormModel;
    this.createNewUserFormGroup = this.loginFormModel.getnNewUserCreationModel();
  }


  setLoggedIn() {
    this._loggedIn.next(true);
  }

  isLoggedIn() {
    return this._loggedIn.getValue();
  }

  getLoggedIn() {
    return this._loggedIn;
  }

  updateUserPasswordDetails(inputJson) {
    let userupdate = this._config.ncpRestServiceCall('idmServices/updateUserPasswordDetails', inputJson);
    return userupdate;
  }
  getOneTimeSalt(inputJSON) {
    let userupdate = this._config.ncpRestServiceCall('idmServices/getOneTimeSalt', inputJSON);
    return userupdate;
  }
  // + Only For External Users [pricelink] 
  public populateLoginCredentials(user_id: string) {
    let loginForm = [{
      'user_id': user_id,
      'user_lang_code': '',
      'user_name': '',
      'user_branch': '',
      'firstLogin': '',
      'user_password': '',
      'user_prf_group_code': '',
      'user_party_id': '',
      'product_list': '',
      'user_type': ''
    }];
    return loginForm;
  }

  public isExternalUser(): void {
    let credentials;
    let locationHash: string = window.location.hash;
    if (locationHash.indexOf('?') > -1) {
      let locationPathParamsArray = locationHash.substr(1, locationHash.length).split('?');
      let locationPath = locationPathParamsArray[0].replace('#', '');
      let locationSearch = locationPathParamsArray[1];
      let secure;
      let b2cb2b2cFlag: boolean = false;
      let firstLoginFlag: boolean = false;
      let updatePassword = false;
      if (locationSearch.trim() != '') {
        let locationParamsArray: string[] = locationSearch.trim().split('&');
        if (locationParamsArray[0].trim().split('=')[0].toLowerCase() == 'user')
          credentials = this.populateLoginCredentials(locationParamsArray[0].trim().split('=')[1]);
        if (locationParamsArray[1] && locationParamsArray[1].trim().split('=')[0].toLowerCase() == 'secure')
          secure = locationParamsArray[1].trim().split('=')[1].toLowerCase();
        if (locationParamsArray[0].trim().split('=')[0].toLowerCase() == 'partnerid') {
          b2cb2b2cFlag = true;
          this._config.setCustom('partnerId', locationParamsArray[0].trim().split('=')[1]);
          if (locationParamsArray[1] && locationParamsArray[1].trim().split('=')[0].toLowerCase() == 'promocode') {
            this._config.setCustom('promoCode', locationParamsArray[1].trim().split('=')[1]);
          }
          this._config.setCustom('b2b2cFlag', true);
          // this.setLoggedIn();
          this._config.setLoadingSub('yes');
        }
        if (locationParamsArray[0].trim().split('=')[1].toLowerCase() === 'true') {
          this._config.forceLoadConfig();
          this.isExternal = true;
          this._config.setCustom('token', this._config.getCookie('token'));

          this._config.loggerSub.subscribe(data => {
            if (data === 'configLoaded') {
              this._config.reGenerateToken();
            }
          });
          if (this.isExternal) {
            let userCookieTemp = JSON.parse(this._config.getCookie('userCookie'));
            this._config.setCustom('isExternalLogin', userCookieTemp);
            this._config.setCustom('isExternalUser', true);
            this._config.setCustom('_isExternalUser', true);
            this._config.setCustom('pathname', locationPath);
            let configResponse = this._config._http.get('assets/config/env.json');
            configResponse.subscribe((envData) => {
              this._config._env = envData;
              this._config.baseUrl = envData.baseUrl;
              this._config._http.post(this._config.baseUrl + 'utils/getNCPConfig', { 'businessType': 'B2B' })

                .subscribe((data) => {
                  this._config._config = data;
                  this._config.loggerSub.next('configLoaded');
                  this._config.afterSessionEE.emit('externalLogin');

                  this.doSuccessHandler(userCookieTemp, true, locationPath);
                  this.getBranding();
                });
            });

          }
        }


        if (locationPath === '/FirstLogin' || locationPath === '/UpdatePassword') {
          this._config.setCustom('userid', locationParamsArray[0].trim().split('=')[1]);
          if (locationParamsArray[1] && locationParamsArray[1].trim().split('=')[0].toLowerCase() === 'recoverystring') {
            this._config.setCustom('recoverystring', locationParamsArray[1].trim().split('=')[1]);
            if (locationPath === '/FirstLogin') {
              firstLoginFlag = true;
              this._config.setCustom('firstLoginFlag', true);
            } else if (locationPath === '/UpdatePassword') {
              updatePassword = true;
              this._config.setCustom('updatePassword', true);
            }
            this.setLoggedIn();
            this._config.setLoadingSub('yes');
          }
        }

        if (locationParamsArray[0].trim().split('=')[0].toLowerCase() == 'transrefno') {
          this._config.setCustom('transRefNo', locationParamsArray[0].trim().split('=')[1]);
          this.paymentFlag = true;
          this._config.setCustom('initiatePosting', true);
          this._config.navigateRouterLink('/paymentRedirect');
          this._config.setLoadingSub('yes');
        }
        if (firstLoginFlag) {
          this._config.loggerSub.subscribe(data => {
            if (data === 'configLoaded') {
              this._config.afterSessionEE.next('firstLogin');
              this._config.navigateRouterLink('/FirstLogin');
            }
          });
        }

        if (updatePassword) {
          this._config.loggerSub.subscribe(data => {
            if (data === 'configLoaded') {
              this._config.afterSessionEE.next('updatePassword');
              this._config.navigateRouterLink('/resetPassword');
            }
          });
        }
        
        if (!b2cb2b2cFlag && !firstLoginFlag && !this.paymentFlag && !updatePassword) {
          let url = document.location.href;
          this._config.loggerSub.subscribe(data => {
            if (data === 'configLoaded') {
              if (this.isExternal) {
                this._config.navigateRouterLink('/ncp/home');
              } else if (url.indexOf('thirdPartyLogin') < 0) {
                this.onSubmit(credentials, true, locationPath, secure);
              }
            }
          });
        } else if (b2cb2b2cFlag) {
          this._config.loggerSub.subscribe(data => {
            if (data) {
              if (data === 'configLoaded') {
                this.localStorageService.set('User_lang', this._config.get('b2b2cLang'));
                this.localStorageService.set('User_lang_Desc', this._config.get('b2b2cLangDesc'));
                this._config.setI18NLang(this._config.get('b2b2cLang'));
                this._config.loggerSub.next('langLoaded');
                let sessionResp = this.b2b2cServices.setSession();
                sessionResp.subscribe((sessionData) => {
                  if (sessionData.status === 401) {
                    location.href = (this._config.get('b2b2cRedirectURL'));
                  } else if (sessionData.error !== null && sessionData.error !== undefined && sessionData.error.length > 0) {
                    location.href = (this._config.get('b2b2cRedirectURL'));
                  } else if (sessionData.user_id === undefined && sessionData.login !== undefined && sessionData.login == 'loggedout') {
                    location.href = (this._config.get('b2b2cRedirectURL'));
                  } else if (sessionData) {
                    this._config.setCustom('user_id', sessionData.user_id);
                    this._config.setCustom('user_lang', sessionData.user_lang_code);
                    this._config.setCustom('b2b2c_product_list', sessionData.product_list);
                    this.setLoggedIn();
                    this.productDetailsService.setB2b2cProductCode(sessionData.product_list);
                    // this._config.setCustom('token', sessionData['token']);
                    // this._config.setToken(sessionData['token']);
                    this._config.reGenerateToken();
                    this.b2b2cServices.getChunkingData(this._config.getCustom('partnerId'), this._config.getCustom('promoCode'), sessionData.user_party_id);
                    this._config.addGoogleAnalyticsScript();
                    this._config.afterSessionEE.emit('sessionCreated');
                    this._config.navigateRouterLink(environment.b2b2cLandingUrl);
                    if (environment.themeName) {
                      let b2b2cThemeName = this.themeService.getThemeName(environment.themeName, true);
                      if (b2b2cThemeName) {
                        this._config.loadJsCssFile(b2b2cThemeName, 'css');
                      }
                    }
                  }
                });
              }
            } else {
              location.href = (this._config.get('b2b2cRedirectURL'));
            }
          });
        }
      }
    }
  }

  getBranding() {
    // let brandJsonResponse = this._config.getJSON({ key: 'META', path: 'branding' });
    let brandJsonResponse = this._config.ncpRestServiceCall('utils/getNCPBranding', '');
    brandJsonResponse.subscribe(
      (brandResponseData) => {
        if (brandResponseData == null
          && brandResponseData === undefined) {
          this._logger.error('ncpJsonCall()===> Branding is undefined');
          this._config.setLoadingSub('no');
        } else {
          //  this.brandingJson = brandUrl['login'];
          if (brandResponseData) {
            this._config.setCustom('branding', brandResponseData[0]);
            this._config.loggerSub.next('brandingLoaded');
          }
          this._config.setLoadingSub('no');
        }
      });
  }
  public onSubmit(credentials, isExternalUser?: boolean, pathname?: string, secure?: boolean) {
    let result = "";
    let loginCred = [];
    let loginResp;
    let errorVOList = [{ errCode: '', errDesc: '' }];
    let userPassword = credentials && credentials.user_password ? credentials.user_password : '';
    credentials.user_password = null;
    if (!isExternalUser) {
      credentials.errorVOList = errorVOList;
      loginCred.push(credentials);
    }
    let userDetailResponse = this._config.ncpRestServiceCall('idmServices/getAuthenticationType', { userid: credentials.user_id });
    userDetailResponse.subscribe(
      (itemUploadResponse) => {
        if (itemUploadResponse.error !== null && itemUploadResponse.error !== undefined && itemUploadResponse.error.length >= 1) {
          this.isError = true;
          this.errors = [];
          for (let i = 1; i < itemUploadResponse.error.length; i++) {
            this.errors.push({ 'errCode': itemUploadResponse.error[i].errCode, 'errDesc': itemUploadResponse.error[i].errDesc });
          }
        } else {
          this.authenticationType = itemUploadResponse['authenticationType'];
          if (this.authenticationType === null || this.authenticationType === 'DB') {
            let oneTimeSaltResp = !isExternalUser ? this._config.ncpRestServiceCall('idmServices/getOneTimeSalt', loginCred) : this._config.ncpRestAuthServiceCall('idmServices/getUserDetails', loginCred, 'true');
            oneTimeSaltResp.subscribe(
              (oneTimeSaltResponse) => {
                if (oneTimeSaltResponse.salt === undefined || oneTimeSaltResponse.salt == null) {
                  oneTimeSaltResponse.salt = '';
                }
                let hashedPassword = this.utilsService.doHashValue(oneTimeSaltResponse.salt + userPassword);
                hashedPassword = this.utilsService.doHashValue(oneTimeSaltResponse.oneTimeSalt + hashedPassword);
                credentials.user_password = hashedPassword;
                this.validateLogin(credentials, userPassword, isExternalUser, pathname);
              },
              (error) => {
                this.getNCPLocalDBData(loginCred[0]['user_id']);
              }
            );
          }
          else if (this.authenticationType === 'ADS') {
            credentials.user_password = userPassword;
            this.validateLogin(credentials, userPassword, isExternalUser, pathname);
          }
        }
      }
    );
  }

  forceLogout(input: any, loginInput) {
    let logoutResp = this._config.ncpRestServiceCall('idmServices/forceLogout', input);
    logoutResp.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this.isError = true;
          this.errors = [];
          for (let i = 1; i < dataVal.error.length; i++) {

            this.errors.push({ 'errCode': dataVal.error[i].errCode, 'errDesc': dataVal.error[i].errDesc });
          }
        } else {
          this.onSubmit(loginInput);
        }
      });
  }

  doSuccessHandler(dataVal, isExternalUser?: boolean, pathname?: string) {
    if (dataVal.user_lang_code) {
      this._config.setCustom('user_lang', dataVal.user_lang_code);
      this._config.setCustom('user_name', dataVal.user_name);
      this._config.setCustom('user_id', dataVal.user_id);
      this._config.setCustom('user_branch', dataVal.user_branch);
      this._config.setCustom('user_prf_group_code', dataVal.user_prf_group_code);
      this._config.setCustom('user_party_id', dataVal.user_party_id);
      this._config.setCustom('product_list', dataVal.product_list);
      this._config.setCustom('user_type', dataVal.user_type);
      this._config.setCustom('user_email', dataVal.user_email);
      this._config.setCustom('currency_code', dataVal.currency_code);
      this._config.setCustom('user_technical', dataVal.user_technical);
      this._config.setCustom('userPermissions', dataVal.userPermissions);
      this._config.setCustom('userDetails', dataVal.details);
      if (dataVal.systemRoleId) {
        this._config.setCustom('roleId', dataVal.systemRoleId);
      } else {
        this._config.setCustom('roleId', dataVal.roleId);
      }
      this._config.setCustom('user_agency_code', dataVal.user_agency_code);
      this.translate.use(dataVal.user_lang_code);
      this.themeService.ncpThemeServicesSub.next(dataVal.user_lang_code);
      this._config.currentLangName = dataVal.user_lang_code;
      this.localStorageService.set('User_lang', dataVal.user_lang_code);

      this._config.getI18NLang();
      if (dataVal.token) {
        this._config.setCustom('token', dataVal.token);
        this._config.reGenerateToken();
      }
      // }
      // });
    }
    if (dataVal.firstLogin === 'Y') {
      this.firstLoginSub.next({ user_id: dataVal.user_id, firstLogin: true });
    } else {
      this.setLoggedIn();
      if (isExternalUser) {
        this._config.setCustom('isExternalUser', true);
        this._config.setCustom('_isExternalUser', true);
        this._config.setCustom('pathname', pathname);
        // this._config.afterSessionEE.next('externalLogin');
        this._config._router.navigate(['/ncp/home']);
      }
      else {
        this.getBranding();
        this._config._router.navigate(['/ncp/home']);
        this.utilsService.getEndorsementTypes();
      }
    }
    this._config.loggerSub.subscribe(data => {
      if (data === 'configLoaded') {
        this.utilsService.getEndorsementTypes();
      }
    });
  }
  insertUpdateIndexedDB(dataVal) {
    // + Store Response in IndexedDB for offline usage
    // let ncpIndexedDB = this._config.getNCPIndexedDB();
    // this._config.ncpIndexedDBSub.subscribe(() => {
    //   ncpIndexedDB.getByIndex('users', 'user_id', dataVal.user_id).then((user) => {
    //     if (user !== undefined) {
    //       ncpIndexedDB.update('users', dataVal).then(() => {
    //         this._logger.info('Successfully Updated login data To localDB =>', dataVal.user_id);
    //       }, (error) => {
    //         this._logger.error(error);
    //       });
    //     } else {
    //       ncpIndexedDB.add('users', dataVal).then(() => {
    //         this._logger.info('Successfully Insertetd login data To localDB =>', dataVal.user_id);
    //       }, (error) => {
    //         this._logger.error(error);
    //       });
    //     }
    //   }, (error) => {
    //     this._logger.error(error);
    //   });
    // });
    // - Store Response in IndexedDB for offline usage
  }
  doErrorHandler(error) {
    this._config.setLoadingSub('no');
    this.isError = true;
    this.errors = [];
    this.errors.push({ 'errDesc': 'Server Error' });
    this._logger.error('URL Error:===>' + error);
  }
  getNCPLocalDBData(user_id: string) {
    // let ncpIndexedDB = this._config.getNCPIndexedDB();
    // this._config.ncpIndexedDBSub.subscribe(() => {
    //   ncpIndexedDB.getByIndex('users', 'user_id', user_id).then((user) => {
    //     delete user['id'];
    //     this.doSuccessHandler(user);
    //   }, (error) => {
    //     this.doErrorHandler(error);
    //     this.errorLoginPage.next(this.errors);
    //   });
    // });
  }

  logoutUser() {
    let logoutResponse;
    var user_id = this._config.getCustom('user_id');
    var token = this._config.getCustom('token');
    logoutResponse = this._config.ncpRestServiceCall('idmServices/doLogout', [{ token }]);
    logoutResponse.subscribe((logoutData) => {
      if (logoutResponse.errors) {
        this._logger.error('doLogout()===>' + logoutData.error);
      } else {
        this._config.navigateRouterLink('Login');
        this._config.setLoadingSub('no');
        window.location.reload();
      }
    });
  }
  redirectToStoredUrl() {
    localStorage.setItem('type', 'false');
    location.href = (localStorage.getItem('url'));
  }
  verifySecondaryLogin(inputJson) {
    return this._config.ncpRestServiceCall('idmServices/verifySecondaryLogin', inputJson);
  }
  validateLogin(credentials, userPassword, isExternalUser?: boolean, pathname?: string) {
    let loginCred = [];
    let loginResp;
    loginCred.push(credentials);
    loginResp = this._config.ncpRestServiceCall('idmServices/validateLogin', loginCred);
    loginResp.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this.isError = true;
          this.errors = [];
          for (let i = 1; i < dataVal.error.length; i++) {

            this.errors.push({ 'errCode': dataVal.error[i].errCode, 'errDesc': dataVal.error[i].errDesc });
          }
          this.errorLoginPage.next(this.errors);
        } else if (dataVal.user_id === undefined && dataVal.login !== undefined && dataVal.login == 'loggedout') {
          this.errors.push({ 'errCode': '0000', 'errDesc': 'USER NOT FOUND' });
          this.errorLoginPage.next(this.errors);
        } else if (dataVal.error == false) {

        }
        else {
          this.insertUpdateIndexedDB(dataVal);
          if (!isExternalUser && dataVal.sig_request)
            this.requestSigSub.next({ sig_request: dataVal.sig_request, dataVal: dataVal, isExternalUser: isExternalUser, pathname: pathname });
          else {
            if (dataVal['concurrentLogin'] === 'Y') {
              this.forceLoginSub.next(dataVal);
            }
            else {
              this.doSuccessHandler(dataVal, isExternalUser, pathname);
            }
          }
        }
        credentials.user_password = userPassword;
        this._config.setLoadingSub('no');
      },
      (error) => {
        this.getNCPLocalDBData(loginCred[0]['user_id']);
      }
    );
  }

  validateLoginByTheThirdParty(credentials, isExternalUser?: boolean, pathname?: string) {
    let loginCred = [];
    let loginResp;
    let errorVOList = [{ errCode: '', errDesc: '' }];
    if (!isExternalUser) {
      credentials.errorVOList = errorVOList;
    }
    loginCred.push(credentials);
    loginResp = this._config.ncpRestServiceCall('idmServices/getTokenForThirdPartySignIn', loginCred);
    loginResp.subscribe(
      (dataVal) => {
        if (!dataVal.user_id) {
          this.thirdPartySiginError.errorType = 'thirdPartySiginError';
          this.thirdPartySiginError.errCode = 204;
          this.thirdPartySiginError.errDesc = 'NCPLabel.thirdPartySigninErrorTPIdNotValid';
          this._config.setCustom('thirdPartySiginError', this.thirdPartySiginError);
          this._logger.info('NCPLabel.thirdPartySigninErrorTPIdNotValid');
          this._config._router.navigate(['/Login']);
        } else {
          this.insertUpdateIndexedDB(dataVal);
          if (!isExternalUser && dataVal.sig_request)
            this.requestSigSub.next({ sig_request: dataVal.sig_request, dataVal: dataVal, isExternalUser: isExternalUser, pathname: pathname });
          else {
            if (dataVal['concurrentLogin'] === 'Y') {
              this.forceLoginSub.next(dataVal);
            } else {
              dataVal.firstLogin = 'N';
              this.doSuccessHandler(dataVal, isExternalUser, pathname);
            }
          }
        }
        credentials.user_password = '';
        this._config.setLoadingSub('no');
      },
      (error) => {
        this.thirdPartySiginError.errorType = 'thirdPartySiginError';
        this.thirdPartySiginError.errCode = 500;
        this.thirdPartySiginError.errDesc = 'NCPLabel.thirdPartySigninErrorValidationTPId';
        this._config.setCustom('thirdPartySiginError', this.thirdPartySiginError);
        this._logger.error('NCPLabel.thirdPartySigninErrorValidationTPId');
        this._config._router.navigate(['/Login']);
      }
    );
  }
}
