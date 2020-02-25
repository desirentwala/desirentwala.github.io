import { HttpClient, HttpHeaders } from '@adapters/packageAdapter';
import { EventEmitter, Injectable, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@adapters/packageAdapter';
import { JwtHelperService } from '@adapters/packageAdapter';
import { Observable, throwError, Subject } from '@adapters/packageAdapter';
import { catchError } from '@adapters/packageAdapter';

import { environment } from '../../../environments/environment';
import { FilterModel } from '../../modules/common/models/filter.model';
// import { AngularIndexedDB } from '../../utilities/indexedDB/indexeddb';
declare var Crypt: any;
const ASSET_PATH: any = {
  PROD: 'products/quotes/',
  ENDT: 'products/endorsements/',
  REN: 'products/renewal/',
  META: 'meta/',
  SNIPPET: 'products/snippets/',
  WALKTHROUGH: 'walkthrough/'
};

@Injectable()
export class ConfigService {
  errors = [];
  currentThemeName: any;
  public _config: Object;
  public _env: Object;
  public isRTL: boolean = false;
  // public _ncpLocalDB: AngularIndexedDB;
  public baseUrl: string = '';
  configCustom = [];
  _http;
  _router: Router;
  jwtTimer;
  result: Object;
  i18NLang;
  currentLangName = 'en';
  loadingSub = new Subject();
  loggerSub = new Subject();
  assetLoadedSub = new Subject();
  ncpIndexedDBSub = new Subject();
  public routeNameAddSub = new Subject();
  afterSessionEE = new EventEmitter();
  taskNotificationFlag = new EventEmitter();
  filterModel = new FilterModel();
  jwthelper: JwtHelperService = new JwtHelperService();
  private waitFlag: boolean = false;
  public _headerName = 'X-CSRF-TOKEN';
  public _headerTokenName = 'Authorization';
  jwtStartTime: number;
  token = this.configCustom['token'];
  project = environment.project;
  screenSnippetsBuffer: Object = {};
  snippetRootElement: any;
  snippetCount: number = 0;
  useLegacy: boolean = true;
  constructor(http: HttpClient, router: Router, public localStorageService: LocalStorageService) {
    this._http = http;
    this._router = router;
    let configResponse = this._http.get('assets/config/env.json');
    configResponse.subscribe((envData) => {
      this._env = envData;
      this.baseUrl = envData.baseUrl;
      this._http.post(this.baseUrl + 'utils/getNCPConfig', { 'businessType': 'B2B' })

        .subscribe((data) => {
          this._config = data;
          this.loggerSub.next('configLoaded');
        });
    });
    let url = window.location.href;
    if (url.indexOf('thirdPartyLogin') > -1) {
      url = url.substring(0, url.indexOf('thirdPartyLogin')) + 'Login';
    }
    if(url.indexOf('paymentRedirect') > -1){
      url = url.substring(0, url.indexOf('paymentRedirect')) + 'Login';
    }
    this.setCustom('appLoadingUrl', url);
  }
  forceLoadConfig() {
    let configResponse = this._http.get('assets/config/env.json');
    configResponse.subscribe((envData) => {
      this._env = envData;
      this.baseUrl = envData.baseUrl;
      this._http.post(this.baseUrl + 'utils/getNCPConfig', { 'businessType': 'B2B' })

        .subscribe((data) => {
          this._config = data;
          this.loggerSub.next('configLoaded');
        });
    });
  }
  getAuthHeaders() {
    let headers = this.getJsonHeaders();
    return headers;
  }

  getCookie(name) {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length == 2)
      return parts.pop().split(';').shift();
  }


  getJsonHeaders() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');
    headers = headers.set('Accept', 'application/json');

    if (this.configCustom['token']) {
      headers = headers.set(this._headerTokenName, 'Bearer ' + this.configCustom['token']); // Adding xsrfToken header
      //headers.append('user_id', this.getCustom('user_id'));
    }
    if (this.configCustom['hash']) {
      headers = headers.set('Digest', this.configCustom['hash']);
    }
    if (this.getCookie('CSRF-TOKEN')) {
      headers = headers.append(this._headerName, this.getCookie('CSRF-TOKEN'));
    }
    return headers;
  }
  getEnv(key: any) {
    return this._env[key];
  }

  get(key: any) {
    if (this._config) {
      return this._config[key];
    } else {
      return null;
    }
  }

  setCustom(key: any, val: any) {
    this.configCustom[key] = val;
  }

  getCustom(key: any) {
    return this.configCustom[key];
  }

  private setToken(token: any) {
    if (token) {
      this.jwtStartTime = new Date().getTime();
      this.jwtTimer = setTimeout(() => {
        let regenerate = this.ncpRestServiceWithoutLoadingSubCall('idmServices/regenerateToken', [{ token }]);
        regenerate.subscribe((tokenData) => {
          if (tokenData) {
            if (tokenData.token)
              token = tokenData.token;
            this.setToken(token);
          }
        });
      }, environment.reGenDelay);
      this.configCustom['token'] = token;
    }
    else {
      clearTimeout(this.jwtTimer);
    }
  }

  reGenerateToken() {
    let token = this.configCustom['token'];
    if (token) {
      let regenerate = this.ncpRestServiceWithoutLoadingSubCall('idmServices/regenerateToken', [{ token }]);
      regenerate.subscribe((tokenData) => {
        if (tokenData) {
          if (tokenData.token)
            token = tokenData.token;
          this.setToken(token);
        }
      });
    }
  }
  getRemaningTimeOnJwt() {
    if (this.jwtStartTime) {
      return environment.reGenDelay - (new Date().getTime() - this.jwtStartTime);
    }
  }

  getI18NLang(): any {
    if (this.i18NLang) {
      return this.i18NLang;
    } else {
      return null;
    }

  }
  setI18NLang(lang) {
    this.i18NLang = lang;
  }

  ncpRestServiceCall(url, inputJson, isupdateToTargetSystem?) {
    this.setLoadingSub('yes');
    inputJson = this.addTargetConfig(inputJson, isupdateToTargetSystem);
    let input = this.getStringfy(inputJson);
    this.hashing(input);
    let postsResponse = this.makeHttpCall(this.baseUrl + url, inputJson, true);
    return postsResponse;
  }

  ncpRestAuthServiceCall(url, inputJson, secure, isupdateToTargetSystem?) {
    this.setLoadingSub('yes');
    inputJson = this.addTargetConfig(inputJson, isupdateToTargetSystem);
    let headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('secure', secure);
    headers = headers.append('user_id', inputJson[0].user_id);
    if (this.getCookie('CSRF-TOKEN')) {
      headers = headers.append(this._headerName, this.getCookie('CSRF-TOKEN')); // Adding xsrfToken header
    }
    let postsResponse = this.makeHttpCall(this.baseUrl + url, inputJson, true, headers);
    return postsResponse;
  }
  ncpRestServiceCallWithoutJsonResponse(url, inputJson, isupdateToTargetSystem?) {
    this.setLoadingSub('yes');
    inputJson = this.addTargetConfig(inputJson, isupdateToTargetSystem);
    let input = this.getStringfy(inputJson);
    this.hashing(input);
    let postsResponse = this.makeHttpCall(this.baseUrl + url, inputJson, false);
    return postsResponse;
  }

  ncpRestServiceWithoutLoadingSubCall(url, inputJson, isupdateToTargetSystem?) {
    inputJson = this.addTargetConfig(inputJson, isupdateToTargetSystem);
    let input = this.getStringfy(inputJson);
    this.hashing(input);
    let postsResponse = this.makeHttpCall(this.baseUrl + url, inputJson, true);
    return postsResponse;
  }

  ncpRestServiceCallWithoutJsonResponseAndLoadingSubCall(url, inputJson, isupdateToTargetSystem?) {
    inputJson = this.addTargetConfig(inputJson, isupdateToTargetSystem);
    let input = this.getStringfy(inputJson);
    this.hashing(input);
    let postsResponse = this.makeHttpCall(this.baseUrl + url, inputJson, false);
    return postsResponse;
  }
  ncpRestAuthServiceCallWithoutJsonResponse(url, inputJson, secure, isupdateToTargetSystem?) {
    inputJson = this.addTargetConfig(inputJson, isupdateToTargetSystem);
    this.setLoadingSub('yes');
    let headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('secure', secure);
    headers = headers.append('user_id', inputJson[0].user_id);
    if (this.getCookie('CSRF-TOKEN')) {
      headers = headers.append(this._headerName, this.getCookie('CSRF-TOKEN')); // Adding xsrfToken header
    }
    let postsResponse = this.makeHttpCall(this.baseUrl + url, inputJson, false, headers);
    return postsResponse;
  }

  ncpViewDocument(url, inputJson, viewDocumentModal?, isupdateToTargetSystem?) {
    inputJson = this.addTargetConfig(inputJson, isupdateToTargetSystem);
    this.setLoadingSub('yes');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.baseUrl + url, true);
    xhr.responseType = 'arraybuffer';
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    xhr.setRequestHeader('Accept', 'application/pdf');
    if (this.configCustom['token']) {
      xhr.setRequestHeader(this._headerTokenName, 'Bearer ' + this.configCustom['token']); // Adding xsrfToken header
    }
    let input = this.getStringfy(inputJson);
    this.hashing(input);
    if (this.configCustom['hash']) {
      xhr.setRequestHeader('Digest', this.configCustom['hash']);
    }
    if (this.getCookie('CSRF-TOKEN')) {
      xhr.setRequestHeader(this._headerName, this.getCookie('CSRF-TOKEN')) // Adding xsrfToken header
    }
    xhr.onload = function () {
      var arrayBufferView = new Uint8Array(xhr.response);
      var blob = new Blob([arrayBufferView], { type: 'application/pdf' });
      if (arrayBufferView.length > 234) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob);
        } else {
          let objectUrl = URL.createObjectURL(blob);
          window.open(objectUrl);
        }
      } else {
        let documents = inputJson.documentInfo;
        let result = false;
        if (documents.length > 0) {
          for (let j = 0; j < documents.length; j++) {
            if (documents[j].dispatchType === 'EMAIL') {
              result = true;
            }
          }
        }
        viewDocumentModal = viewDocumentModal == undefined ? true : false;
        if (!result && viewDocumentModal) {
          window.alert('Document not Available');
        }
      }


    }
    xhr.send(JSON.stringify(inputJson));
    this.setLoadingSub('no');
  }
  ncpJsonCall(path, responseType?: any) {
    return this._http.get(path, responseType || {});
  }

  makeHttpCall(serviceName: string, input, isJsonResp, headers?) {
    let resp;
    headers = headers ? headers : this.getJsonHeaders();
    if (navigator.onLine) {
      if (isJsonResp) {
        resp = this._http.post(serviceName, input, { headers: headers });
        return resp;
      } else {
        resp = this._http.post(serviceName, input, { headers: headers, responseType: 'text' });
        return resp;
      }
    } else {
      if (serviceName.indexOf('idmServices/regenerateToken') > -1) {
        this.loggerSub.next('sessionExpired');
      } else {
        this.loggerSub.next('netWorkOffline');
      }
      this.setLoadingSub('no');
      return this._http.post(serviceName, input, { headers: headers });
    }
  }

  setLoadingSub(value: string) {
    this.loadingSub.next(value);
  }
  navigateRouterLink(routerUrl: any, params?: any) {
    if (routerUrl !== '' && routerUrl !== null) {
      this._router.navigate([routerUrl], { queryParams: params });
      this.setLoadingSub('no');
    } else {
    }
  }

  navigateRouterByURL(routeUrl) {
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this._router.navigate([routeUrl]));
  }

  public handleError(error: any) {
    // this.setLoadingSub('no');
    return throwError(error);
  }

  getfilterModel() {
    return this.filterModel.getfilterModel();
  }
  setfilterModel(obj) {
    this.filterModel.setfilterModel(obj);
    this.loggerSub.next('filterSet');
  }
  resetfilterModel() {
    this.filterModel.resetfilterModel();
  }
  getProductElements(productCode) {
    this.errors = [];
    let businessTypePath = this.getCustom('b2cFlag') ? 'b2c' : 'b2b';
    let userRole = this.getCustom('user_prf_group_code');
    let path = businessTypePath + '/' + productCode;
    return this.getJSON({ key: 'PROD', path: path });
  }
  getEndorsementElements(type: string, productCode: string, overrideEndorsementElements: boolean) {
    this.errors = [];
    let prodCode = productCode.toLowerCase();
    let path = '';
    if (overrideEndorsementElements === undefined || overrideEndorsementElements === false)
      path += type;
    else
      path += productCode + '/' + type;
    (path);
    return this.getJSON({ key: 'ENDT', path: path });
  }
  getRenewalElements(productCode: string) {
    this.errors = [];
    let path = productCode;
    (path);
    return this.getJSON({ key: 'REN', path: path });
  }
  public setNCPIndexedDB() {
    // this._ncpLocalDB = new AngularIndexedDB('NCPLocalDB', 1.0);
    // this._ncpLocalDB.createStore(1.0, (evt) => {
    //   let usersStore = evt.currentTarget.result.createObjectStore(
    //     'users', { keyPath: "id", autoIncrement: true });
    //   usersStore.createIndex("user_id", "user_id", { unique: false });
    //   setTimeout(() => {
    //     this.ncpIndexedDBSub.next();
    //   }, 5000);

    // });
  }
  getNCPIndexedDB() {
    // if (this._ncpLocalDB == undefined) this.setNCPIndexedDB();
    // else this.ncpIndexedDBSub.next();
    // return this._ncpLocalDB;
  }

  loadconfigJson() {
    let configResponse = this._http.get('assets/config/env.json')
      ;
    configResponse.subscribe((envData) => {
      this._env = envData;
      this._http.get('assets/config/' + envData.env + '.json')

        .subscribe((data) => {
          this._config = data;
          this.loggerSub.next('configLoaded');
        });
    });
  }
  addGoogleAnalyticsScript() {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    let businessType = (this.getCustom('b2cFlag') || this.getCustom('b2b2cFlag')) ? (this.getCustom('b2cFlag') ? 'b2c' : 'b2b2c') : 'b2b';
    let src = 'assets/js/' + environment.project + environment.country + businessType + 'googleanalytics.js';
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  navigateToHome() {
    if (this.getCustom('b2cFlag')) {
      this.navigateRouterLink(environment.b2cLandingUrl);
    } else if (this.getCustom('b2b2cFlag')) {
      this.navigateRouterLink('/b2b2c');
    } else {
      this.navigateRouterLink('ncp/home');
    }
  }

  //This method is used for Hashing the payload content.
  hashing(inputJson) {
    var crypt = new Crypt();
    if (this.configCustom['token']) {
      var hash = crypt.HASH.sha512(this.configCustom['token'] + inputJson).toString();
    }
    else {
      var hash = crypt.HASH.sha512('' + inputJson).toString();
    }
    this.configCustom['hash'] = hash;
  }

  getStringfy(inputJson) {
    if (inputJson !== '')
      return JSON.stringify(inputJson);
    else
      return inputJson;
  }

  ncpB2B2CInitialService(url, inputJson) {
    this.setLoadingSub('yes');
    let input = this.getStringfy(inputJson);
    this.getCookie('token') ? this.setCustom('token', this.getCookie('token')) : '';
    this.hashing(input);
    let postsResponse = this._http.post(this.baseUrl + url, input, { headers: this.getJsonHeaders() })
    return postsResponse;
  }

  processErrors(errObj: any) {
    this.setLoadingSub('no');
    if (errObj instanceof Object) {
      errObj['userId'] = this.getCustom('user_id');
      errObj['module'] = this._router.url;
      errObj['action'] = errObj['serviceName'] ? errObj['serviceName'] : 'fromUI';
      let errResp = this._http.post(this.baseUrl + 'utils/logError', errObj, { headers: this.getJsonHeaders() });
      errResp.subscribe((data) => {
        this.setLoadingSub('no');
      });
    }
  }
  changeThemeName(themeName: string) {
    let themeNameOnly = themeName.split('.')[0];
    if (!environment.production) {
      this.loadJsCssFile(themeNameOnly + '.bundle.css', 'css');
    } else {
      this.loadJsCssFile(themeName, 'css');
    }
    if (themeNameOnly !== 'defaultStyle' && themeNameOnly !== 'rtlTheme') {
      this.removeThemeName(this.currentThemeName);
      this.currentThemeName = themeName;
    } else if (themeNameOnly === 'rtlTheme') {
      if (this.isRTL) {
        this.removeThemeName(themeName);
      }
      this.isRTL = !this.isRTL;
    }
  }

  loadJsCssFile(filename, filetype) {
    let fileRef = null;
    if (filetype === 'js') { // if filename is a external JavaScript file
      fileRef = document.createElement('script');
      fileRef.setAttribute('type', 'text/javascript');
      fileRef.setAttribute('src', filename);
    } else if (filetype === 'css') { // if filename is an external CSS file
      fileRef = document.createElement('link');
      fileRef.setAttribute('rel', 'stylesheet');
      fileRef.setAttribute('type', 'text/css');
      fileRef.setAttribute('href', filename);
    }
    if (typeof fileRef !== 'undefined') {
      fileRef.setAttribute('id', filename.split('.')[0]);
      document.getElementsByTagName('head')[0].appendChild(fileRef);
    }
  }

  removeThemeName(fileName) {
    let allSuspects;
    if (fileName) {
      allSuspects = document.getElementById(fileName.split('.')[0]);
    }
    if (allSuspects) {
      allSuspects.parentNode.removeChild(allSuspects);
    }
  }
  handleAssetJSONFetchErrors(err) {
    if (err.status === 404) {
      this.errors.push({ 'errCode': '404', 'errDesc': 'PRODUCT SETUP NOT FOUND' });
      return this.errors;
    }
  }
  enableRefreshCheck() {
    if (environment['checkForRefresh'] || this.getCustom('editorMode')) {
      let currentEvent = window['attachEvent'] || window['addEventListener'];
      let chkevent = window['attachEvent'] ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compatable

      currentEvent(chkevent, this.checkForRefresh, true);
    }
  }

  checkForRefresh(e) {
    let confirmationMessage = ' '; // a space
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  }

  disableRefreshCheck() {

    if (environment['checkForRefresh'] || this.getCustom('editorMode')) {
      let currentEvent = window['detachEvent'] || window['removeEventListener'];
      let chkevent = window['detachEvent'] ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compatable

      currentEvent(chkevent, this.checkForRefresh, true);
    }
  }
  getToken() {
    let getExistingTokenResponse = this.ncpRestServiceWithoutLoadingSubCall('idmServices/getExistingToken', {});
    return getExistingTokenResponse;
  }

  /**
 * Method fetches assets and product elements from
 * server / client side based on the environment
 * Any change in logic of this method should be copied to server side NCPNonCoreActionProcessor.java @method getAssetJSON
 * @summary   utility method to get json files
 */
  getJSON(inputs: any): any {
    if (isDevMode()) {
      return this.getAssetJSON(inputs);
    } else {
      return this.ncpRestServiceWithoutLoadingSubCall('noncore/getAssetJSON', inputs).pipe(catchError((error: any) => this.handleAssetJSONFetchErrors(error)));
    }
  }

  getAssetJSON(inputs: any) {
    let { key, path } = inputs;
    let asset_path_key = ASSET_PATH[key];
    let JSONResponse = this.getAssetJSONFromLocal(asset_path_key + path);
    if (key === 'META') return JSONResponse;
    else {
      JSONResponse.subscribe(elements => {
        if (elements['doCheckForSnippets'] !== undefined) {
          this.snippetRootElement = elements;
          this.snippetCount = 0;
          this.mergeSnippets(elements['elementList'], 1);
        } else {
          this.assetLoadedSub.next(elements);
        }
      },
        error => {
          if (key === 'ENDT' && error.status === 404) {
            this.assetLoadedSub.next({ "error": [{ "errCode": "E_NCP_076", "errDesc": "E_NCP_076", "errType": null, "selected": false, "isFatal": true }] });
          }
        });
      return this.assetLoadedSub;
    }

  }
  mergeSnippets(rootNode: any, doStoreOrReplaceJSON: number): any {
    for (let i = 0; i < rootNode.length; i++) {
      if (rootNode[i]['controlType'] && rootNode[i]['controlType'] === 'Include') {
        let asset_path_key = ASSET_PATH['SNIPPET'] + rootNode[i]['fileName'];
        ++this.snippetCount;
        if (doStoreOrReplaceJSON === 1) {
          this.getAssetJSONFromLocal(asset_path_key).subscribe(snippet => {
            if (typeof rootNode[i]['fileName'] !== 'undefined') {
              this.screenSnippetsBuffer[rootNode[i]['fileName']] = snippet;
            }
            this.mergeSnippets(snippet, doStoreOrReplaceJSON);
            if (Object.keys(this.screenSnippetsBuffer).length === this.snippetCount) {
              this.snippetCount = 0;
              this.mergeSnippets(this.snippetRootElement['elementList'], 2);
            }
          });
        } else {
          let currentNode = JSON.parse(JSON.stringify(rootNode[i]));
          let k = 0;
          while (k < this.screenSnippetsBuffer[currentNode['fileName']].length) {
            rootNode[i + k] = this.screenSnippetsBuffer[currentNode['fileName']][k];
            k++;
          }
          if (Object.keys(this.screenSnippetsBuffer).length === this.snippetCount) {
            this.assetLoadedSub.next(this.snippetRootElement);
          }
        }
      }
      // tslint:disable-next-line:curly
      if (rootNode[i]['elementList'] && rootNode[i]['elementList'].length > 0) this.mergeSnippets(rootNode[i]['elementList'], doStoreOrReplaceJSON);
    }
  }

  getAssetJSONFromLocal(path: string) {
    return this.ncpJsonCall('assets/json/' + path + '.json');
  }

  getImage(src: string): Observable<Text> {
    return this.ncpJsonCall(src, { responseType: 'text' });
  }

  addTargetConfig(input, isupdateToTargetSystem: boolean = true) {
    let targetSystem = this.getCustom('targetSystem') ? this.getCustom('targetSystem') : 'FG';
    let userIDFromJson = this.getCustom('userIDFromJson') ? this.getCustom('userIDFromJson') : '';
    let documentModule = this.getCustom('documentModule') ? this.getCustom('documentModule') : '';
    if (input && Array.isArray(input)) {
      input[0]['targetSystem'] = targetSystem;
      input[0]['isUpdateToTargetSystem'] = isupdateToTargetSystem;
      input[0]['userIDFromJson'] = userIDFromJson;
      input[0]['documentModule'] = documentModule;
    } else if (input) {
      input['targetSystem'] = targetSystem;
      input['isUpdateToTargetSystem'] = isupdateToTargetSystem;
      input['userIDFromJson'] = userIDFromJson;
      input['documentModule'] = documentModule;
    }
    return input;
  }

}

export const REQUEST_SERVICES = [
  ConfigService
];