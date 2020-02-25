import { LocalStorageService } from '@adapters/packageAdapter';
import { B2B2CServices } from './../../../b2b2c/services/b2b2c.service';
import { ProductDetailsService } from './../../product/services/product.service';
import { UserService } from './../../../auth/login/services/user/user.service';
import { B2CServices } from './../../../b2c/service/b2c.service';
import { PaymentService } from '../../../core/ui-components/payment/payment.service';
import { QuotService, PolicyService } from '../../transaction';

import { EventService } from '../../../core/services/event.service';
import { SharedModule } from '../../../core/shared/shared.module';
import { ConfigService } from '../../../core/services/config.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';

import { LoginFormModel } from '../../../auth/login/model/login-model';
import { Logger } from '../../../core/ui-components/logger/logger';

@Component({
    templateUrl: 'postPaymentHandler.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PostPaymentHandlerComponent implements OnInit {
    postPaymentJson: any;
    postPaymentFailureModalone: boolean = false;
    paymentStatus: String = '';
    paymentMod: boolean = false;
    paymentRefNo: string = '';
    isBatchPayment: string = '';
    batchPaymentInfo: any;
    batchPostedInfo: any;
    transRefNo: any = null;
    userId: any;
    userDetails: any;
    isThePolicyCreated: String = '';
    alreadyPolicyCreated: String = '';
    policyNo: String = '';
    loading: String = 'yes';
    constructor(public config: ConfigService, public eventService: EventService, public quotservice: QuotService, public policyservice: PolicyService, shared: SharedModule, public paymentService: PaymentService, public b2cService: B2CServices, public userService: UserService, public productDetailsService: ProductDetailsService, public b2b2cService: B2B2CServices, public changeRef: ChangeDetectorRef, public localStorageService: LocalStorageService, public userDetailsForm: LoginFormModel, public logger: Logger) {
        this.userDetails = userDetailsForm.getLoginFormModel();
    }
    
    ngOnInit() {
        let locationHash: string = window.location.hash;
        if (locationHash.indexOf('?') > -1) {
            let locationPathParamsArray = locationHash.substr(1, locationHash.length).split('?');
            let locationSearch = locationPathParamsArray[1];
            if (locationSearch.trim() != '') {
                let locationParamsArray: string[] = locationSearch.trim().split('&');
                if (locationParamsArray[0].trim().split('=')[0].toLowerCase() == 'transrefno') {
                    this.paymentRefNo =  locationParamsArray[0].trim().split('=')[1];
                    this.config.setCustom('transRefNo', this.paymentRefNo);
                    this.config.setCustom('initiatePosting', true);
                    this.paymentMod = true;
                    this.changeRef.markForCheck();
                    if(this.config.getCustom('token')){
                        this.getPaymentDetails({
                            'transRefNo': this.config.getCustom('transRefNo')
                        });
                    }else{
                        this.createToken();
                    }
                }
            }
            if(!this.paymentRefNo){
                this.config.navigateRouterLink('/Login');
            }
        }else{
            this.configLoaded();
        }
    }

    configLoaded(){
        this.config.loggerSub.subscribe(data => {
            if (data === 'configLoaded') {
                this.paymentRefNo = this.config.getCustom('transRefNo');
                if (this.paymentRefNo) {
                    this.createToken();
                }else{
                    this.config.navigateRouterLink('/Login');
                }
            }

        });
    }

    createToken(){
        let setTokenResponse = this.config.ncpRestServiceWithoutLoadingSubCall('idmServices/createToken', {});
        setTokenResponse.subscribe((setTokenResponseData) => {
                this.paymentMod = true;
                this.changeRef.markForCheck();
                let getPaymentDetailsRequest = {
                    'transRefNo': this.config.getCustom('transRefNo')
                };
                if(setTokenResponseData['token']){
                    this.config.setCustom('token', setTokenResponseData['token']);
                }
                this.getPaymentDetails(getPaymentDetailsRequest);
        });
    }

    getPaymentDetails(getPaymentDetailsRequest){
        let getPaymentDetailsResponse = this.config.ncpRestServiceWithoutLoadingSubCall('payment/getPaymentDetails', getPaymentDetailsRequest);
        getPaymentDetailsResponse.subscribe((getPaymentDetailsResponseData) => {
            if (getPaymentDetailsResponseData.error !== null
                && getPaymentDetailsResponseData.error !== undefined
                && getPaymentDetailsResponseData.error.length >= 1) {
                this.paymentStatus = 'ERR';
                this.config.setLoadingSub('no');
                this.changeRef.markForCheck();
                this.userId = getPaymentDetailsResponseData.identifier1 || this.config.getCustom('userid');
            } else if (getPaymentDetailsResponseData && getPaymentDetailsResponseData.status === 'YES') {
                this.paymentStatus = getPaymentDetailsResponseData.status;
                this.userId = getPaymentDetailsResponseData.identifier1;
                this.changeRef.markForCheck();
                let transferRefNoJson = {
                    'policyInfo': {
                        'quoteNo': getPaymentDetailsResponseData.identifier2,
                        'quoteVerNo': getPaymentDetailsResponseData.identifier3,
                        'status':'',
                        'productCd':''
                    },
                    'paymentInfo': {
                        'paymentReferenceNo': this.paymentRefNo,
                    }
                };
                this.config.setLoadingSub('no');
                this.batchPaymentInfo = this.paymentService.getBatchSettleMentInfoFromLocalstorage();
                if (this.batchPaymentInfo) {
                    let PostedPolicies = this.config.ncpRestServiceWithoutLoadingSubCall('policy/updatePostedPoliciesWithPaymentDetails', this.batchPaymentInfo)
                    PostedPolicies.subscribe(
                        (PostedPoliciesData) => {
                            if (PostedPoliciesData.error !== null && PostedPoliciesData.error !== undefined && PostedPoliciesData.error.length >= 1) {
                                this.config.setLoadingSub('no');
                            } else {
                                this.config.setLoadingSub('no');
                                this.batchPostedInfo = PostedPoliciesData;
                                this.changeRef.markForCheck();
                                this.config.reGenerateToken();
                            }
                        },
                        (error) => {
                            this.logger.error('error saveQuoteOpenheldInfo ', error);
                        }
                    );
                } 
                if (!this.batchPaymentInfo){
                    this.batchPaymentInfo = {};
                }
                this.getQuoteDetailAndCreatePolicy(transferRefNoJson);
            } else if(getPaymentDetailsResponseData.status && getPaymentDetailsResponseData.status !== 'YES'){
                this.config.setLoadingSub('no');
                this.paymentStatus = getPaymentDetailsResponseData.status;
                this.userId = getPaymentDetailsResponseData.identifier1;
                this.changeRef.markForCheck();
            }
        });
    }

    getQuoteDetailAndCreatePolicy(transferRefNoJson){
        let quoteDetailResponse = this.quotservice.getQuotOpenheldInfo(transferRefNoJson);
        quoteDetailResponse.subscribe((quoteDetailResponseData) => {
            if(quoteDetailResponseData){
                if(quoteDetailResponseData['policyInfo']['policyNo'] && quoteDetailResponseData['policyInfo']['status'] === 'PC'){
                    this.config.setLoadingSub('no');
                    this.loading = 'no';
                    this.alreadyPolicyCreated = 'YES';
                    this.changeRef.markForCheck();
                }else{
                    let jsonData={
                        'policyInfo': {
                            'productCd': quoteDetailResponseData['policyInfo']['productCd'],
                            'branchCd': quoteDetailResponseData['policyInfo']['branchCd'],
                            'isB2CNode': quoteDetailResponseData['policyInfo']['isB2C'] || '',
                            'sourceNode': quoteDetailResponseData['policyInfo']['source'],
                            'quoteNo': quoteDetailResponseData['policyInfo']['quoteNo'],
                            'quoteVerNo': quoteDetailResponseData['policyInfo']['quoteVerNo'],
                            'agentCd': quoteDetailResponseData['policyInfo']['agentCd']
                        },
                        'isUpdateToTargetSystem': this.config['_config']['isUpdateToTargetSystem']
                    };

                    let policyDetailResponse = this.policyservice.createPolicy(jsonData);
                    policyDetailResponse.subscribe(
                        (policyDetailResponseData) => {
                            if(policyDetailResponseData){
                                this.policyNo = policyDetailResponseData['policyInfo']['policyNo']; 
                                quoteDetailResponseData['policyInfo']['policyNo'] = policyDetailResponseData['policyInfo']['policyNo'];
                                quoteDetailResponseData['paymentInfo']['paymentReferenceNo'] = this.paymentRefNo;
                                if(policyDetailResponseData['policyInfo']['status'] === 'PT'){
                                    quoteDetailResponseData['policyInfo']['status'] = 'PC';
                                }
                                let quoteStatusUpdate = this.quotservice.saveQuoteOpenheldInfo(quoteDetailResponseData);
                                quoteStatusUpdate.subscribe(
                                    (quoteDetailUpdatedData) => {
                                        if(quoteDetailUpdatedData){
                                            this.config.setLoadingSub('no');
                                            this.loading = 'no';
                                            this.isThePolicyCreated = 'YES';
                                            this.changeRef.markForCheck();
                                        }
                                    },
                                    (error) => {
                                        this.logger.error('error updateQuoteStatus ', error);
                                    }
                                )
                            }

                            /*
                            let postPaymentResponse = this.quotservice.postQuotewithoutLoadingSub(transferRefNoJson);
                            postPaymentResponse.subscribe((postPaymentResponseInfo) => {
                                if (postPaymentResponseInfo) {
                                    if (postPaymentResponseInfo.error !== null && postPaymentResponseInfo.error !== undefined && postPaymentResponseInfo.error.length >= 1) {
                                        this.config.setLoadingSub('no');
                                        this.redirectToHomePage();
                                    } else {
                                        this.config.setLoadingSub('no');
                                        this.postPaymentJson = postPaymentResponseInfo;
                                        this.changeRef.markForCheck();
                                        // this.config.reGenerateToken();
                                        setTimeout(()=>{
                                            this.redirectToHomePage();
                                            // this.navigateToHome({reGenerateToken: 'called'});
                                        }, 1000);
                                    }
                                }

                            });
                            */
                        },
                        (error) => {
                            this.logger.error('error createThePolicy ', error);
                        }
                    );
                }
            }

        })
    }

    checkForPosting() {
        if (this.config.getCustom('transRefNo')) {
            let refNo = this.config.getCustom('transRefNo');

        }
    }

    redirectToHomePage(){
        this.config.setLoadingSub('no');
        this.loading = 'yes';
        this.postPaymentJson = {
            policyInfo: {
                source: 'B2B'
            }
        };
        this.changeRef.markForCheck();
        this.navigateToHome({paymentRedirectPage: this.config.getCustom('paymentRedirectPage')});
    }
   
    navigateToHome(arg) {
        this.config.setCustom('initiatePosting', false);
        this.userService.setLoggedIn();
        if (this.batchPaymentInfo || this.postPaymentJson.policyInfo.source === 'B2B') {
            this.config.setCustom('b2bFlag', true);
            this.config.setCustom('b2cFlag', false);
            this.config.setCustom('b2b2cFlag', false);
            if(arg.paymentRedirectPage === 'internal'){
                this.config._router.navigate(['/ncp/home']);
            }else{
                let token = this.config.getCustom('token');
                let regenerate = this.config.ncpRestServiceWithoutLoadingSubCall('idmServices/regenerateToken', [{ token }]);
                regenerate.subscribe(
                    (tokenData) => {
                        if (tokenData) {
                            if (tokenData.token){
                                token = tokenData.token;
                                this.config.setCustom('token', token);
                                this.getUserDetails();
                            }
                        }
                    },
                    (error) => {
                        this.logger.error('error regenerate token ', error);
                    }
                );
            }
        } else if (this.postPaymentJson.policyInfo.source === 'B2C') {
            this.config.setCustom('b2bFlag', false);
            this.config.setCustom('b2cFlag', true);
            this.config.setCustom('b2b2cFlag', false);
            this.productDetailsService.setproductCode(this.config.get('b2cProduct'));
            this.b2cService.getBranding();
            this.config.setCustom('user_id', 'b2c');
            this.config.reGenerateToken();
            this.config.navigateRouterLink(environment.b2cLandingUrl);
            this.config.afterSessionEE.emit('postingDone');
        } else {
            this.config.setCustom('b2bFlag', false);
            this.config.setCustom('b2cFlag', false);
            this.config.setCustom('b2b2cFlag', true);
            let getuserDetaislResponse = this.config.ncpRestServiceCall('idmServices/getUserDetails', {});
            getuserDetaislResponse.subscribe(
                (getuserDetaislResponseData) => {
                    if (getuserDetaislResponseData.error !== null && getuserDetaislResponseData.error !== undefined && getuserDetaislResponseData.error.length > 0) {
                    } else if (getuserDetaislResponseData.user_id === undefined && getuserDetaislResponseData.login !== undefined && getuserDetaislResponseData.login == 'loggedout') {
                    } else {

                        this.config.setCustom('user_id', getuserDetaislResponseData.user_id);

                        this.config.setCustom('partnerId', getuserDetaislResponseData.user_id);
                        this.config.setCustom('promocode', this.postPaymentJson.policyInfo.promoCode);
                        this.config.setCustom('user_party_id', getuserDetaislResponseData.user_party_id);

                        this.config.setCustom('user_lang', getuserDetaislResponseData.user_lang_code);
                        this.config.setCustom('b2b2c_product_list', getuserDetaislResponseData.product_list);
                        this.productDetailsService.setB2b2cProductCode(getuserDetaislResponseData.product_list);
                        this.config.reGenerateToken();
                        this.b2b2cService.getChunkingData(this.config.getCustom('partnerId'), this.postPaymentJson.policyInfo.promoCode, this.config.getCustom('user_party_id'));
                        this.config.addGoogleAnalyticsScript();
                        this.config.afterSessionEE.emit('postingDone');
                        this.config.navigateRouterLink(environment.b2b2cLandingUrl);
                    }
                },
                (error) => {
                    this.logger.error('error getUserDetails ', error);
                }
            );
        }

    }

    getUserDetails(){
        let credentials = this.userDetails.value;
        credentials.user_id = this.userId;
        let userCredentials = [ credentials ];
        let getuserDetaislResponse = this.config.ncpRestServiceCall('idmServices/getUserDetails', userCredentials);
        getuserDetaislResponse.subscribe(
            (getuserDetaislResponseData) => {
                if (getuserDetaislResponseData.error !== null && getuserDetaislResponseData.error !== undefined && getuserDetaislResponseData.error.length > 0) {
                } else if (getuserDetaislResponseData.user_id === undefined && getuserDetaislResponseData.login !== undefined && getuserDetaislResponseData.login == 'loggedout') {
                } else {
                    this.userService.doSuccessHandler(getuserDetaislResponseData, false);
                    this.userService.getBranding();
                    this.config.afterSessionEE.emit('postingDone');
                    this.config.reGenerateToken();
                }
            },
            (error) => {
                this.logger.error('error getUserDetails ', error);
            }
        );
    }
}

