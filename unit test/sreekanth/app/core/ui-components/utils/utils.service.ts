import { EventEmitter, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from '@adapters/packageAdapter';
import { UserService } from '../../../auth/login';
import { ConfigService } from '../../services/config.service';
import { DateFormatService } from '../ncp-date-picker/services/ncp-date-picker.date.format.service';
// import { UserService } from '../auth/login/services/user/user.service';
declare var Crypt: any;

@Injectable()
export class UtilsService {
    config: ConfigService;
    userService: UserService
    i18NLang;
    errorLang;
    dateFormatService;
    public productKeyMap: Object = {};
    public endorsementTypesJson: Object;
    loadedSub = new Subject();
    nextAfterSubscriptionSub = new Subject();
    emitData = new EventEmitter<any>();
    businessTypeCodeMap = {
        "NB": "New Business",
        "RN": "Renewal",
        "NR": "New Business and Renewal"
    }
    initWalkthroughKey: number = 0;
    walkthroughInput: Object = {};
    public obj: any = Object;
    showHideWalkthroughOptions = [
        { 'label': 'On' },
        { 'label': 'Off' }
    ];
    showHideWalkthroughControl: FormControl = new FormControl(false);
    hasWalkthroughCustomSwitch: boolean = true;
    navigatorSub: Subject<any> = new Subject<any>();
    activeValidationIDChangeSub: Subject<any> = new Subject<any>();
    public activeValidationIDs: string[] = [];
    public get routeJson(): Object {
        return this.config.getCustom('routeJson');
    }
    constructor(config: ConfigService) {
        this.config = config;
        this.dateFormatService = new DateFormatService(this.config);
        this.doFetchProductData();

    }
    getEndorsementTypes() {
        if (this.endorsementTypesJson == undefined || this.endorsementTypesJson == null || Object.keys(this.endorsementTypesJson).length == 0) {
            let endtTypeResponse = this.config.ncpRestServiceWithoutLoadingSubCall('noncore/getConfigDetails', { 'input': 'ENDT' });
            endtTypeResponse.subscribe(
                (routeUrl) => {
                    if (routeUrl.error !== null
                        && routeUrl.error !== undefined
                        && routeUrl.error.length >= 1) {
                    } else {
                        this.endorsementTypesJson = routeUrl;
                        this.config.setCustom('ENDT', this.endorsementTypesJson);
                    }
                });
        }
    }
    getEndorsementTypeCode(key) {
        this.endorsementTypesJson = this.endorsementTypesJson ? this.endorsementTypesJson : this.config.getCustom('ENDT');
        return this.endorsementTypesJson[key]['FG'] ? this.endorsementTypesJson[key]['FG'] : null;
    }
    getEndorsementNCPTypeCode(NCPKey) {
        if (this.endorsementTypesJson || this.config.getCustom('ENDT')) {
            this.endorsementTypesJson = this.endorsementTypesJson ? this.endorsementTypesJson : this.config.getCustom('ENDT');
            return this.endorsementTypesJson[NCPKey]['NCP'] ? this.endorsementTypesJson[NCPKey]['NCP'] : null;
        }
        return null;
    }
    getEndorsementByCode(key, ncpKey): any {
        this.endorsementTypesJson = this.endorsementTypesJson ? this.endorsementTypesJson : this.config.getCustom('ENDT');
        if (key !== undefined && key !== null && ncpKey !== undefined && ncpKey !== null) {
            for (var k in this.endorsementTypesJson) {
                if (this.endorsementTypesJson[k]['FG'] === key && this.endorsementTypesJson[k]['NCP'] === ncpKey) return k;
            }
        } else {
            for (var k in this.endorsementTypesJson) {
                if (this.endorsementTypesJson[k]['FG'] === key) return k;
            }
        }
        return false;
    }
    getEndorsementFGCode(ncpCode): any {
        this.endorsementTypesJson = this.endorsementTypesJson ? this.endorsementTypesJson : this.config.getCustom('ENDT');
        for (var k in this.endorsementTypesJson) {
            if (this.endorsementTypesJson[k]['NCP'] == ncpCode) return this.endorsementTypesJson[k]['FG'];
        }
        return false;
    }
    get(key) {
        let allLOB: any = this.routeJson, productSetupKey: Object;
        if (allLOB !== undefined && allLOB !== null && Object.keys(allLOB).length > 0) {
            productSetupKey = this.routeJson[key] ? this.routeJson[key] : {};
        } else {
            this.doFetchProductData();
        }
        return productSetupKey;
    }
    getLOBRoute(productCode): string {
        let routeUrl: string = '';
        if (this.routeJson || Object.keys(this.routeJson).length > 0) {
            if (Object.keys(this.productKeyMap).length === 0) {
                this.setProductKeyMap();
            }
            routeUrl = this.get(this.productKeyMap[productCode][0])[this.productKeyMap[productCode][1]]['ROUTE'];
        } else {
            this.doFetchProductData();
        }
        return routeUrl;
    }
    getEndorsementRoute(): string {
        let routeUrl: string = 'ncp/transaction/endorsement';
        return routeUrl;
    }
    getClaimRoute(eventType: string, movementType: string = 'NT'): string {
        let routeUrl: string = '';
        switch (eventType) {
            case 'VC': {
                if (movementType === 'NT') {
                    routeUrl = 'ncp/claims/NTEnquiry';
                    break;
                }
                else {
                    routeUrl = 'ncp/claims/FNOLEnquiry';
                    break;
                }
            }
            case 'EC':
                if (movementType === 'NT') {
                    routeUrl = 'ncp/claims/NTOpenHeld';
                    break;
                }
                else {
                    routeUrl = 'ncp/claims/FNOLOpenHeld';
                    break;
                }
            case 'NC':
                if (movementType === 'NT') {
                    routeUrl = 'ncp/claims/NTNotifyClaim';
                    break;
                }
                else {
                    routeUrl = 'ncp/claims/FNOLNotifyClaim';
                    break;
                }
        }
        return routeUrl;
    }
    getTranslated(label) {
        if (label) {
            if (this.i18NLang === undefined || this.i18NLang === null || this.i18NLang instanceof Array) {
                this.i18NLang = this.config.getI18NLang();
            }
            if (this.i18NLang && label && !(this.i18NLang instanceof Array)) {
                return this.i18NLang[label] ? this.i18NLang[label] : label;
            }
        }
    }

    getErrorMessage(error) {
        if (!this.i18NLang) {
            this.i18NLang = this.config.getI18NLang();
        }
        if (this.i18NLang && error) {
            return this.i18NLang[error] ? this.i18NLang[error] : error;
        } else {
            return error;
        }
    }
    getTodayDate() {
        let today = new Date();
        let todayString = this.dateFormatService.formatDate(today);
        return todayString;
    }

    convertArrayListToDropdownList(dataList, code, desc) {
        let resultDropDownList = new Array();
        let arrayListLength = dataList.length;
        let arrayCode = code;
        let arrayDesc = desc;
        let index = 0;

        for (let temp = 0; temp < arrayListLength; temp++) {
            let arrayListForm = dataList.at(temp);
            if (arrayListForm.get(arrayCode).value !== '' && arrayListForm.get(arrayDesc).value !== '') {

                resultDropDownList[index] = { code: '', desc: '' };
                resultDropDownList[index].code = arrayListForm.get(arrayCode).value;
                resultDropDownList[index].desc = arrayListForm.get(arrayDesc).value;
                index = index + 1;
            }
        }
        return resultDropDownList;
    }
    convertArrayDataListToDropdownList(dataList, code, desc) {
        let resultDropDownList = new Array();
        let arrayListLength = dataList.length;
        let arrayCode = code;
        let arrayDesc = desc;
        let index = 0;
        for (let temp = 0; temp < arrayListLength; temp++) {
            let arrayListForm = dataList[temp];
            if (arrayListForm.arrayCode !== '' && arrayListForm.arrayDesc !== '') {
                resultDropDownList[index] = { code: '', desc: '' };
                resultDropDownList[index].code = arrayListForm[arrayCode];
                resultDropDownList[index].desc = arrayListForm[arrayDesc];
                index = index + 1;
            }
        }
        return resultDropDownList;
    }

    /**
     * productKeyMap property maps productCode, LobCode and LobProductCode . Ex "CPA" : [ PA, CPAPA ]
     * @return {void} 
     */
    public setProductKeyMap(): void {
        for (let lobkey in this.routeJson) {
            for (let product in this.routeJson[lobkey]) {
                this.productKeyMap[this.routeJson[lobkey][product]['productCd']] = [lobkey, product];
            }
        }
        this.loadedSub.next();
    }

    /**
     * @param Optional: productCd string
     * returns a replica of product.json i.e an array of product details. returns specific product details if productCd is provided
     * @return {void} 
     */
    public getProductDetails(productCd?: string): Object[] {
        let allLOB: any = this.routeJson, productDetails: Object[] = [];
        if (allLOB !== undefined && allLOB !== null && Object.keys(allLOB).length > 0) {
            if (productCd !== undefined) {
                productDetails.push(this.get(this.productKeyMap[productCd][0])[this.productKeyMap[productCd][1]]['DETAILS']);
            } else {
                for (let lobKey in allLOB)
                    for (let prodKey in allLOB[lobKey])
                        productDetails.push(allLOB[lobKey][prodKey]['DETAILS']);
            }
        } else {
            this.doFetchProductData();
        }
        return productDetails;
    }

    public getLOBNames(): Object[] {
        let allLOB: any = this.routeJson, productDetails: Object[] = [];
        if (allLOB !== undefined && allLOB !== null && Object.keys(allLOB).length > 0) {
            let businessType;
            for (let lobKey in allLOB)
                for (let prodKey in allLOB[lobKey]) {
                    if ((allLOB[lobKey][prodKey]['DETAILS'].lineOfBusiness !== businessType)) {
                        businessType = allLOB[lobKey][prodKey]['DETAILS'].lineOfBusiness;
                        productDetails.push(allLOB[lobKey][prodKey]['DETAILS']);
                    } else {
                        break;
                    }
                }
        }
        return productDetails;
    }

    /**
     * returns a replica of favPlans.json i.e an array of product favoutite plans. 
     * @return { Object[] } 
     */
    public getProductFavouriteClicks(): Object[] {
        let allLOB: any = this.routeJson, productDetails: Object[] = [], watchForFavouriteProductClicks: Object;
        if (allLOB !== undefined && allLOB !== null && Object.keys(allLOB).length > 0) {
            for (let lobKey in allLOB)
                for (let prodKey in allLOB[lobKey]) {
                    watchForFavouriteProductClicks = {
                        'name': allLOB[lobKey][prodKey]['DETAILS'].title,
                        'clicks': allLOB[lobKey][prodKey]['DETAILS'].clicks
                    };
                    productDetails.push(watchForFavouriteProductClicks);
                }
        } else {
            this.doFetchProductData();
        }
        return productDetails;
    }

    /**
     * returns a replica of favPlans.json i.e an array of product favoutite plans. Ex: Object = { "plans": {} }
     * @return { Object } 
     */
    public getFavPlan(): Object {
        let allLOB: any = this.routeJson, favPlans: Object = { 'plans': {} }, plansArray;
        if (allLOB !== undefined && allLOB !== null && Object.keys(allLOB).length > 0) {
            for (let lobKey in allLOB)
                for (let prodKey in allLOB[lobKey])
                    favPlans['plans'][allLOB[lobKey][prodKey]['productCd']] = allLOB[lobKey][prodKey]['PLANS'];
        } else {
            this.doFetchProductData();
        }
        return favPlans;
    }

    /**
     * @param Optional: productCd string
     * returns a replica of quoteRoute.json i.e an array of product routes. returns specific product routes if productCd is provided
     * @return {void} 
     */
    public getProductRoutes(productCd?: string): Object {
        let allLOB: any = this.routeJson, routes: Object = {};
        if (allLOB !== undefined && allLOB !== null && Object.keys(allLOB).length > 0) {
            if (productCd !== undefined) {
                routes = this.get(this.productKeyMap[productCd][0])[this.productKeyMap[productCd][1]]['ROUTES'];
            } else {
                for (let lobKey in allLOB)
                    for (let prodKey in allLOB[lobKey])
                        routes[allLOB[lobKey][prodKey]['productCd']] = allLOB[lobKey][prodKey]['ROUTES'];
            }
        } else {
            this.doFetchProductData();
        }
        return routes;
    }

    public setRouteJSON(routeJson: Object) {
        if (Object.keys(this.routeJson).length === 0) { this.config.setCustom('routeJson', routeJson); }
        return this.routeJson;
    }

    public doFetchProductData() {
        let product_list: any = this.config.getCustom('product_list');
        let doProductListCheckNeeded = !(this.config.getCustom('b2cFlag') || this.config.getCustom('b2b2cFlag') || this.config.getCustom('editorMode'));
        if ((this.routeJson == undefined || this.routeJson == null || Object.keys(this.routeJson).length == 0) && ((doProductListCheckNeeded && product_list !== undefined) || !doProductListCheckNeeded)) {
            if (!doProductListCheckNeeded || (product_list == null)) {
                product_list = '';
            } else if (product_list.length === 0) {
                product_list = '';
            }
            if (product_list.length === 0) {
                product_list = '';
            }
            let routeResponse = this.config.ncpRestServiceCall('utils/getProductSetupDetails', product_list);
            // let routeResponse = this.config.ncpJsonCall('assets/config/products.json');
            routeResponse.subscribe((route) => {
                // this.routeJson = route[0];
                this.config.setCustom('routeJson', route[0]);
                if (this.routeJson && Object.keys(this.productKeyMap).length === 0) this.setProductKeyMap();
            });
        }
    }

    public hashUserSensitiveInfo(userInputJSON) {
        userInputJSON.user_password = this.doHashValue(userInputJSON.user_password);
        userInputJSON.confirm_password = this.doHashValue(userInputJSON.confirm_password);
        userInputJSON.recoveryAnswer1 = this.doHashValue(userInputJSON.recoveryAnswer1);
        userInputJSON.recoveryAnswer2 = this.doHashValue(userInputJSON.recoveryAnswer2);
        userInputJSON.current_password = this.doHashValue(userInputJSON.current_password);
        return userInputJSON;
    }

    public doHashValue(inputValue) {
        var crypt = new Crypt();
        if (inputValue != undefined && inputValue != null) {
            return crypt.HASH.sha512(inputValue).toString();
        }
    }
    public checkUserPassword(userInputJSON) {
        let errorVOList: any[] = [];
        let userPassword: string = userInputJSON.user_password;
        let confirmPassword: string = userInputJSON.confirm_password;
        let currentPassword: string = userInputJSON.current_password;

        let isPasswordEmpty: boolean = ((userPassword == undefined || userPassword == null || userPassword == '') && (confirmPassword == undefined || confirmPassword == null || confirmPassword == '')) ? true : false;
        let bothPasswordMatch: boolean = userPassword.match(confirmPassword) ? true : false;
        let currentPasswordMatch: boolean = userPassword.match(currentPassword) ? true : false;
        let isPasswordMinLength: boolean = userPassword.length < 8 ? true : false;
        let isPasswordNonAlphaNumeric: boolean = userPassword.search(/.*[a-zA-Z]*.[0-9].*/) != 0 ? true : false;
        let hasPasswordNoSpecialChars: boolean = userPassword.search(/^.*[^a-zA-Z0-9 ].*$/) != 0 ? true : false;

        if (isPasswordEmpty || !bothPasswordMatch || isPasswordMinLength || isPasswordNonAlphaNumeric || hasPasswordNoSpecialChars || currentPasswordMatch) {
            let errorJSON = { errCode: '', errDesc: '' };
            if (isPasswordEmpty) {
                errorJSON.errCode = 'IDM_ERR_1';
            } else if (!bothPasswordMatch) {
                errorJSON.errCode = 'IDM_ERR_2';
            } else if (isPasswordMinLength) {
                errorJSON.errCode = 'IDM_ERR_3';
            } else if (isPasswordNonAlphaNumeric) {
                errorJSON.errCode = 'IDM_ERR_4';
            } else if (hasPasswordNoSpecialChars) {
                errorJSON.errCode = 'IDM_ERR_5';
            } else if (currentPasswordMatch) {
                errorJSON.errCode = 'IDM_ERR_6';
            }
            errorVOList.push(errorJSON);
        }
        return errorVOList;
    }
    getDateObjectFromString(ds: string): Date {
        let date: any = { day: 0, month: 0, year: 0 };
        if (ds) {
            let fmt = this.config.get('dateFormat');
            let dpos = fmt.indexOf('dd');
            if (dpos >= 0) {
                date.day = parseInt(ds.substring(dpos, dpos + 2));
            }
            let mpos = fmt.indexOf('MM');
            if (mpos >= 0) {
                date.month = parseInt(ds.substring(mpos, mpos + 2));
            }
            let ypos = fmt.indexOf('yyyy');
            if (ypos >= 0) {
                date.year = parseInt(ds.substring(ypos, ypos + 4));
            }
        }
        return new Date(date.year, date.month - 1, date.day);
    }
    fetchWalkthrough(path) {
        let response: any = this.config.getJSON({ key: 'WALKTHROUGH', path: path });
        response.subscribe(data => this.storeWalkthrough(data, response));
    }
    switchWalkthrough(wt_key) {
        this.initWalkthroughKey = Object.keys(this.walkthroughInput).indexOf(wt_key);
    }
    storeWalkthrough(wt_data, resp) {
        this.walkthroughInput = wt_data;
        resp.observers.pop();
    }
    destroyWalkthrough() {
        this.walkthroughInput = {};
        this.showHideWalkthroughControl.patchValue(false);
    }

    /**
     * This method will return the config data for CoverTable.
     * @return { Object } 
     */
    public getCoverTableConfigData(): Object {
        let allLOB: any = this.routeJson, coverTableConfig: Object = { 'coverTableConfig': {} };
        if (allLOB !== undefined && allLOB !== null && Object.keys(allLOB).length > 0) {
            for (let lobKey in allLOB)
                for (let prodKey in allLOB[lobKey])
                    coverTableConfig['coverTableConfig'][allLOB[lobKey][prodKey]['productCd']] = allLOB[lobKey][prodKey]['COVERTABLE'];
        } else {
            this.doFetchProductData();
        }
        return coverTableConfig;
    }

    public upsertValidation(key, action: string = 'default') {
        if (action === 'default') {
            this.destroyActiveValidationIDs();
        }
        if (action === 'default' || action === 'push') {
            if (this.activeValidationIDs.lastIndexOf(key) === -1) {
                this.activeValidationIDs = [...this.activeValidationIDs, ...key];
            }
        } else if (action === 'pop') {
            if (this.activeValidationIDs.lastIndexOf(key) !== -1) {
                this.activeValidationIDs.splice(this.activeValidationIDs.lastIndexOf(key), 1);
            }
        }
        this.activeValidationIDChangeSub.next();
    }

    destroyActiveValidationIDs() {
        this.activeValidationIDs = [];
    }

    /**
     * @param Optional: lob string
     * @param Optional: productCd string
     * if LOB & productCd is passed it returns setup data for that particular product , without productCd it returns and entire LOB's setup
     * details , along with that it spits the entire product setup data if called without any argument
     * @return {void} 
     */
    public getProductSetupDataByLOB(lob?: string, productCd?: string): Object {
        let allLOB: any = this.routeJson, setupData: Object = this.routeJson;
        if (allLOB !== undefined && allLOB !== null && Object.keys(allLOB).length > 0) {
            if (lob) {
                setupData = this.routeJson[lob] || {};
                if (productCd) {
                    if (setupData.hasOwnProperty(productCd)) {
                        setupData = setupData[productCd];
                    }
                }
            }
        } else {
            this.doFetchProductData();
        }
        return setupData;
    }
    public updateProductSetupDetails(lobDetails, isNew: boolean = false, isNewProd: boolean | string = false) {
        if (lobDetails instanceof Object) {
            let input = {
                details: lobDetails,
                isNewProd: isNewProd
            };
            let callToAPI = isNew === false ? 'utils/updateProductSetupDetails' : 'utils/setupProductDetails';
            return this.config.ncpRestServiceCall(callToAPI, input);
        }
        return null;
    }
    public updateMenuCache(lobDetails) {
        if (lobDetails instanceof Object) {
            let input = {
                details: lobDetails
            };
            return this.config.ncpRestServiceCall('idmServices/updateMenuCache', input);
        }
        return null;
    }
    public isNotNullOrEmpty(input) {
        if (input !== null && input !== undefined && input !== 'null' && input !== 'undefined' && input !== '' && input !== ' ') {
            return true;
        } else {
            return false;
        }
    }

    public getTimeNow() {
        let now = new Date();
        let hour = now.getHours();
        let mins = now.getMinutes();
        let sec = now.getSeconds();
        let hrs: string = hour.toString();
        let minsStr = mins.toString();
        let secStr = sec.toString();
        if (hrs.length === 1) {
            hrs = '0' + hrs;
        }
        if (minsStr.length === 1) {
            minsStr = '0' + minsStr;
        }
        if (secStr.length === 1) {
            secStr = '0' + secStr;
        }
        let time: string = hrs + '' + minsStr + '' + secStr;


        return time;
    }

    public doDataSync(inputJson) {
        let routeResponse = this.config.ncpRestServiceWithoutLoadingSubCall('utils/syncData', inputJson);
        return routeResponse;
    }

    public triggerNIPService(inputJSON) {
        let response = this.config.ncpRestServiceCall('utils/triggerNIPService', inputJSON);
        return response;
    }
	
	public doCheckForArray(data){
		if(data){
         return Array.isArray(data);
		}else {
            return false;
}
    }
}

export const UTILS_SERVICES = [
    UtilsService
];