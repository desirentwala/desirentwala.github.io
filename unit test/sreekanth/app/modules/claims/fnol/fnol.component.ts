import { FactoryProvider } from '../../../core/factory/factoryprovider';
import { ConfigService } from '../../../core/services/config.service';
import { EventService } from '../../../core/services/event.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { DateFormatService } from '../../../core/ui-components/ncp-date-picker/index';
import { DateDuration } from '../../../core/ui-components/ncp-date-picker/index';
import { INg2WizardConfig } from '../../../core/ui-components/ng2-wizard/ng2-wizard.config';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { BreadCrumbService } from '../../common/breadCrumb/index';
import { Attachments } from '../models/attachments.model';
import { ClaimFnolInfo } from '../models/claimFnol';
import { ClaimInfo } from '../models/claimInfo.model';
import { ClaimTempDetailsInfo } from '../models/claimTempDetailsInfo.model';
import { InsuredInfo } from '../models/insuredInfo.model';
import { SelectedInsuredInfo } from '../models/selectedInsuredInfo.model';
import { ClaimService } from '../services/claim.service';
import { ClaimantInfo } from './../models/claimantInfo.model';
import { ClaimCodeReserveInfo } from './../models/claimCodeReserveInfo.model';
import { DocumentInfo } from './../models/documentInfo.model';
import { FnolDefaultValue } from './fnol.defaultValues';
import { FnolValidator } from './fnol.validator';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    OnDestroy,
    OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms/src/model';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@adapters/packageAdapter';
import { ProductFactory } from '../../../core/factory/productfactory';
import { PickListService } from '../../common/services/picklist.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'fnolTemplate',
    templateUrl: './fnol.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FnolComponent implements OnInit, AfterContentInit, OnDestroy {

    ErrorConfirmMessage = { error: [{ errCode: '06', errDesc: 'NCPLabel.agreeTerms' }] };

    public claimFNOLFormGroup: FormGroup;
    public isNextFlag: boolean = true;
    public isPostClaimFNOLModal: boolean = false;
    public isSaveClaimFNOLModal: boolean = false;
    public isSaveClaimFNOLIncidentModal: boolean = false;
    isEnquiryFlag: boolean = false;
    isReatingFlag: boolean = false;
    b2cFlag: boolean = false;
    b2b2cFlag: boolean = false;
    b2bFlag: boolean = true;
    showClaimFields: boolean = false;
    isProductBuildFlag: boolean = false;
    isOtherClaimantSelectedFlag: boolean = false;
    public isValidFNOLForm: boolean = true;
    public todayString: string;
    errors = [];
    isError = false;
    claimService: ClaimService;
    formBuilder: FormBuilder;
    fnolDefaultValue;
    fnolValidator;
    router: Router;
    dateDelimiter: string;
    dateFormat: string;
    todayDate: Date;
    currentTime: string;
    dateFormatService;
    dateDuration;
    elementRef;
    save;
    isEmailSuccessFNOLModal;
    searchModal;
    controls;
    pickListService;
    confirmFlag: boolean = false;
    emptyAttachmentFlag: boolean = false;
    public isLifeLob: boolean = false;
    //numberofQuestions: any[] = [0];
    datePickerNormalOptions: any = {
        alignSelectorRight: true,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true
    };

    countryCodeList: any[] = [
        { code: '+65', desc: 'singapore' },
        { code: '+91', desc: 'India' },
        { code: '+62', desc: 'Indonesia' },
        { code: '+94', desc: 'Sri Lanka' },
        { code: '+60', desc: 'Malaysia' }
    ];

    contactperson: any[] = [
        { label: 'NCPLabel.policyHolder', value: '0010' },
        { label: 'NCPLabel.agent', value: '0005' },
        { label: 'NCPLabel.others', value: '0009' }
    ];

    claimantNameList: any[] = [];
    questionaireInfoInput: any[] = [];

    claimantRelationList: any[] = [];

    currency: any[] = [
        { code: 'SGD', desc: 'SGD' },
        { code: 'HKD', desc: 'HKD' },
        { code: 'USD', desc: 'USD' },
        { code: 'EUR', desc: 'EUR' },
        { code: 'GBR', desc: 'GBR' },
        { code: 'INR', desc: 'INR' }
    ]

    loaderConfig: ConfigService;
    isShowBasicDetailsFlag: boolean = false;
    claimInfo: ClaimInfo;
    claimFNOLInfo: ClaimFnolInfo;
    public isOtherNotifier: boolean = false;
    public isShowClaimantList: boolean = false;
    public isPolicyRefresh: boolean = false;
    public isShowClaimList: boolean = false;
    tempClaimList: ClaimTempDetailsInfo;
    claimantInfo: ClaimantInfo;
    documentInfo: DocumentInfo;
    insuredInfo: InsuredInfo;
    emailQuotInfo;
    questionnaires;
    selectedInsuredInfo: SelectedInsuredInfo;
    claimCodeReserveInfo: ClaimCodeReserveInfo;
    attachments: Attachments;
    eventHandler: EventService;
    changeSub: any;
    clickSub: any;
    tabChangeSub: any;
    nextTabSub: any;
    prevTabSub: any;
    changeBenefitClaimed: any;
    validateTabSub: any;
    claimantCount: any = 0;
    maxClaimantCount: any = 10;
    claimCount: any = 0;
    maxClaimCount: any = 10;
    polNotifierFirstName: any;
    polNotifierLastName: any;
    uploadedDocumentSrc: string = '';
    status: string = '';
    appFullName: string = '';
    public isClaimantRelationSelected: boolean = false;
    public isMaxClaimantError: boolean = false;
    public isMinClaimantError: boolean = false;
    public benefitClaimedSelected: string[] = [];
    public questionnairesRemovedEmitter = new EventEmitter<any>();
    public docCheckInfo: string[] = [];
    otherClaimSelected: boolean[] = [];
    public hkBuild: boolean = false;
    public currencyCode: any = '';
    constructor(
        public _claimFNOLFB: FormBuilder,
        _eventHandler: EventService,
        claimService: ClaimService,
        breadCrumbService: BreadCrumbService,
        fnolValidator: FnolValidator,
        public logger: Logger,
        router: Router,
        loaderConfigService: ConfigService,
        public activeRoute: ActivatedRoute,
        _dateFormatService: DateFormatService,
        public utilsService: UtilsService,
        _dateduration: DateDuration,
        public changeRef: ChangeDetectorRef,
        public _element: ElementRef,
        public translate: TranslateService,
        public _picklistservice :PickListService, 
    ) {
        this.eventHandler = _eventHandler;
        if (this.activeRoute.snapshot.params.activity === 'FNOLEnquiry' || this.activeRoute.snapshot.params.activity === 'NTEnquiry') {
            this.status = 'Enquiry';
            this.isEnquiryFlag = true;
            this.confirmFlag = false;
            this.emptyAttachmentFlag=false; 
            let routeName = this.activeRoute.snapshot.routeConfig.data['momentType'] === 'NT' ? '/ncp/claims/NTEnquiry' : '/ncp/claims/FNOLEnquiry';
            breadCrumbService.addRouteName(routeName, [{ 'name': 'Activity', redirectUrl: '/ncp/activity' }, { 'name': 'FNOL Enquiry' }]);
        }
        else if (this.activeRoute.snapshot.params.activity === 'FNOLOpenHeld' || this.activeRoute.snapshot.params.activity === 'NTOpenHeld') {
            this.status = 'OpenHeld';
            let routeName = this.activeRoute.snapshot.routeConfig.data['momentType'] === 'NT' ? '/ncp/claims/NTOpenHeld' : '/ncp/claims/FNOLOpenHeld';
            breadCrumbService.addRouteName(routeName, [{ 'name': 'Activity', redirectUrl: '/ncp/activity' }, { 'name': 'FNOL OpenHeld' }]);
        } else {
            let routeName = this.activeRoute.snapshot.routeConfig.data['momentType'] === 'NT' ? '/ncp/claims/NTNewClaim' : '/ncp/claims/FNOL';
            breadCrumbService.addRouteName(routeName, [{ 'name': 'Claim' }]);
        }

        this.loaderConfig = loaderConfigService;
        this.claimService = claimService;
        this.router = router;
        this.formBuilder = _claimFNOLFB;
        let claimModelInstance = FactoryProvider.getFactoryInstance(this.loaderConfig, this.logger, this.formBuilder).getClaimModelInstance();
        this.claimFNOLInfo = claimModelInstance.getClaimFnolInfo();
        this.claimInfo = claimModelInstance.getClaimInfo();
        this.tempClaimList = claimModelInstance.getClaimTempDetailsInfo();
        this.claimantInfo = claimModelInstance.getClaimantInfo();
        this.documentInfo = claimModelInstance.getDocumentInfo();
        this.insuredInfo = claimModelInstance.getInsuredInfo();
        this.questionnaires = claimModelInstance.getQuestionnairesInfo();
        this.selectedInsuredInfo = claimModelInstance.getSelectedInsuredInfo();
        this.attachments = claimModelInstance.getAttachments();
        this.emailQuotInfo = claimModelInstance.getEmailQuotInfo();
        this.claimCodeReserveInfo = claimModelInstance.getClaimCodeReserveInfo();
        this.fnolValidator = fnolValidator;
        let fnolDefaultValue = new FnolDefaultValue(this.loaderConfig);
        this.fnolDefaultValue = fnolDefaultValue;
        this.dateFormatService = _dateFormatService;
        this.dateDuration = _dateduration;
        this.pickListService = _picklistservice;

    }

    ngOnInit() {
        this.isLifeLob = this.loaderConfig.get('lifeLOBFlag');
        this.isProductBuildFlag = this.activeRoute.snapshot.routeConfig.data['momentType'] === 'NT';
        if (this.isProductBuildFlag) {
            this.contactperson = [
                { label: 'NCPLabel.policyHolder', value: '0010' },
                { label: 'NCPLabel.agent', value: '0005' }
            ];

        }
        if (this.loaderConfig.get('build') == 'hk') {
            this.hkBuild = true;
        }
        else { this.hkBuild = false }
        if (this.loaderConfig.getCustom('b2cFlag')) {
            this.b2bFlag = false;
            this.b2cFlag = true;
            this.b2b2cFlag = false;
        }
        this.currencyCode = this.loaderConfig.getCustom('currency_code');
        this.dateDelimiter = this.loaderConfig.get('dateDelimiter');
        this.dateFormat = this.loaderConfig.get('dateFormat');
        this.todayDate = new Date();
        this.currentTime = this.todayDate.toLocaleTimeString('en-GB').split(' ')[0];
        this.todayDate.setHours(0, 0, 0, 0);
        this.todayString = this.dateFormatService.formatDate(this.todayDate);
        this.claimFNOLFormGroup = this.claimFNOLInfo.getClaimFnolInfoModel();
        this.claimFNOLFormGroup = this.fnolDefaultValue.setClaimFNOLDefaultValues(this.claimFNOLFormGroup, this.isProductBuildFlag);
        this.setAUXCodeDescAfterSettingDefaultValues();
        this.validateTabSub = this.eventHandler.validateTabSub.subscribe((data) => {
            this.onValidateTab();
        });
        this.nextTabSub = this.eventHandler.nextTabSub.subscribe((data) => {
            if (data.id === 'claimFNOLNext') {
                this.onNext(data.value);
            }
        });
        this.prevTabSub = this.eventHandler.prevTabSub.subscribe((data) => {
            if (data.id === 'claimFNOLPrev') {
                this.onPrevious(data.value);
            }
        });
        this.tabChangeSub = this.eventHandler.tabChangeSub.subscribe((data) => {
            if (data.id === 'claimFNOLChange') {
                this.onTabChange();
            }
        });
        this.clickSub = this.eventHandler.clickSub.subscribe((data) => {
            if (data.id === 'saveClaim') {
                this.wizardConfig.isValidateTabNavigation = this.claimFNOLFormGroup.controls['claimInfo'].valid;
                this.isValidFNOLForm = this.claimFNOLFormGroup.controls['claimInfo'].valid;
                if (this.isValidFNOLForm) {
                    this.saveClaimFNOL(event);
                }
                else {
                    this.isNextFlag = true
                }
            }
        });
        this.clickSub = this.eventHandler.clickSub.subscribe((data) => {
            if (data.id === 'confirmClaim') {
                if (this.isLifeLob) {
                    this.saveClaimFNOL(event);
                } else {
                    this.postClaimFNOL();
                }
            }
        });
        let temp: any = this.claimFNOLFormGroup.controls['claimantInfo'];
        if (!this.isProductBuildFlag) {
            this.claimFNOLFormGroup.controls['claimantInfo'].valueChanges.subscribe(x => {
                for (let i = 0; i < x.length; i++) {
                    let claimantIndexForm = temp.at(i);
                    claimantIndexForm.controls['benefitClaimed'].valueChanges.subscribe(y => {
                        let claimNo = this.claimFNOLFormGroup.controls['claimInfo'].value.claimNo;
                        let claimantCd = this.claimFNOLFormGroup.controls['claimantInfo'].value.claimantCd;
                        if (y != '' && this.benefitClaimedSelected[i] != y && !this.isEnquiryFlag)
                            this.doClaimDocAndQuesList(y, claimNo, claimantCd, i);
                    });
                }

            });
        }
        this.changeSub = this.eventHandler.changeSub.subscribe((data) => {
            if (data.id === 'documentContent') {
                this.getMimeTypedata(data.value.value, data.value.index);
            }
            if (data.id === 'emailFileUpload') {
                this.getEmailMimeTypedata(data.value);
            }
            if (data.id == 'claimantRelationChanged' && data.value != undefined) {
                if (!this.isClaimantRelationSelected) this.isClaimantRelationSelected = true;
            }
            if (data.id === 'doCheckIsOtherClaimantSelected' && data.value != undefined) {
                if (data.value.desc == 'Other' && !this.isOtherClaimantSelectedFlag) this.isOtherClaimantSelectedFlag = true;
                else if (data.value.desc !== 'Other' && this.isOtherClaimantSelectedFlag) {
                    this.isOtherClaimantSelectedFlag = false;
                }
            }
        });
        this.clickSub = this.eventHandler.clickSub.subscribe((data) => {
            // if (data.id === 'uploadedDocumentAdd') {
            //     this.addUploadDocument();
            // }
            // if (data.id === 'uploadedDocumentDelete') {
            //     this.deleteuploadDocument(data.value);
            // }
            if (data.id === 'emailQuoteModalMailSend') {
                this.loaderConfig.setLoadingSub('yes');
                this.claimService.sendEmail(this.claimFNOLFormGroup.value);
                this.claimFNOLFormGroup.disable();
                this.loaderConfig.setLoadingSub('no');
            }
        });

        // this.loaderConfig.currentLangName = language;
        this.changeRef.markForCheck();
    }

    /**
     * This function is used to generate claimNumber. If the 'refreshPolicyDetailsFlag' is true, then 'refreshPolicyDetails' is called.
     * Triggered from 'Activity->Policies->Notify Claim', 'Claim->Submit Claim =>Policy No (Tab Out)' and 'Claim->Submit Claim =>Next Button Click (if policy no. is empty)'.
     * @param refreshPolicyDetailsFlag 
     */
     public generateClaimNumberAndRefreshPolicy(refreshPolicyDetailsFlag: boolean) {
        if (this.status != 'Enquiry' && this.status != 'OpenHeld') {

            let generateClaimNumberResponse = this.claimService.generateClaimNumber(this.claimFNOLFormGroup.getRawValue());
            generateClaimNumberResponse.subscribe(
                (generateClaimNumberDataValue) => {
                    if (generateClaimNumberDataValue.error !== null && generateClaimNumberDataValue.error !== undefined && generateClaimNumberDataValue.error.length >= 1) {
                        this.updateErrorObject(generateClaimNumberDataValue);
                    } else {
                        this.isError = false;
                        this.claimFNOLFormGroup = this.updateClaimInfoValue(generateClaimNumberDataValue);
                        if (refreshPolicyDetailsFlag) {
                            let policyOutput = this.claimService.refreshPolicyDetails(this.claimFNOLFormGroup.value);
                            policyOutput.subscribe(
                                (claimInfodataVal) => {
                                    if (claimInfodataVal.error !== null && claimInfodataVal.error !== undefined && claimInfodataVal.error.length >= 1) {
                                        this.updateErrorObject(claimInfodataVal);
                                    } else {
                                        this.isError = false;
                                        this.showClaimFields = true;
                                        this.claimFNOLFormGroup = this.updateClaimInfoValue(claimInfodataVal);
                                        this.updateFieldsByBusinessType(claimInfodataVal);
                                        this.checkProductCode();
                                        this.loaderConfig.setLoadingSub('no');
                                    }
                                });
                        } else {
                            if(this.isLifeLob){
                                this.setChangesForLifeLob()
                            }
                            this.loaderConfig.setLoadingSub('no');
                        }
                    }

                    this.changeRef.markForCheck();
                });
        }
    } 
    

    /**
     * This function is modified to get claimnumber series while ClaimDefaulting from FG for NT & FT as well.
     * This can be uncommented when refreshPolicyDetail is modified in FG 8780
     */
  /*  public generateClaimNumberAndRefreshPolicy(refreshPolicyDetailsFlag: boolean) {
        if (this.status != 'Enquiry' && this.status != 'OpenHeld') {
                let policyOutput = this.claimService.getClaimInfo(this.claimFNOLFormGroup.value);
                    policyOutput.subscribe(
                         (claimInfodataVal) => {
                             if (claimInfodataVal.error !== null && claimInfodataVal.error !== undefined && claimInfodataVal.error.length >= 1) {
                                this.updateErrorObject(claimInfodataVal);
                            } else {
                                this.isError = false;
                                this.showClaimFields = true;
                                this.claimFNOLFormGroup = this.updateClaimInfoValue(claimInfodataVal);
                                this.updateFieldsByBusinessType(claimInfodataVal);
                                    this.loaderConfig.setLoadingSub('no');
                            }
                         });             
        }
    } */

    public oneAtATime: boolean = true;
    public isCollapsed: boolean = false;
    public isCollapsedTr: boolean = false;

    public collapsed(event: any): void {

    }

    public expanded(event: any): void {

    }



    navigateRouterLink(routerUrl: any) {
        this.loaderConfig.navigateRouterLink(routerUrl);
    }
    navigateToHome() {
        if (this.loaderConfig.getCustom('b2cFlag')) {
            this.navigateRouterLink(environment.b2cLandingUrl);
        } else if (this.loaderConfig.getCustom('b2b2cFlag')) {
            this.navigateRouterLink('b2b2c');
        } else {
            this.navigateRouterLink('ncp/home');
        }
    }
    public wizardConfig: INg2WizardConfig = {
        'showNavigationButtons': true,
        'navigationButtonLocation': 'bottom',
        'preventUnvisitedTabNavigation': true,
        'showProgress': true
    };

    currentTab = '01';
    onValidateTab() {
        if (this.status == 'Enquiry') {
            this.isValidFNOLForm = true;
            this.wizardConfig.isValidateTabNavigation = true;
        } else {
            if (this.currentTab === '01') {
                this.logger.info(this.currentTab);
                // tslint:disable-next-line:max-line-length
                if (this.isProductBuildFlag) {
                    this.isShowClaimantList = true;
                }
                this.isMinClaimantError = !this.isShowClaimantList && this.isShowBasicDetailsFlag;
                this.wizardConfig.isValidateTabNavigation = this.claimFNOLFormGroup.controls['policyInfo'].valid && this.claimFNOLFormGroup.controls['claimInfo'].valid && !this.isMinClaimantError;
                this.isValidFNOLForm = this.claimFNOLFormGroup.controls['policyInfo'].valid && this.claimFNOLFormGroup.controls['claimInfo'].valid;
            } else if (this.currentTab === '02') {
                this.wizardConfig.isValidateTabNavigation = this.claimFNOLFormGroup.controls['claimInfo'].valid && this.claimFNOLFormGroup.controls['attachments'].valid;
                this.isValidFNOLForm = this.claimFNOLFormGroup.controls['claimInfo'].valid && this.claimFNOLFormGroup.controls['attachments'].valid;
            }
        }
        if (this.isValidFNOLForm) {
            this.isNextFlag = false;
        } else {
            this.isNextFlag = true;
        }

    }
    public onPrevious(event): void {
        if (event.ui.tabId === '02') {
            this.disableEnableAppFullName(false);
            this.claimFNOLFormGroup = this.fnolValidator.clearClaimFNOLInsuredDetailsValidator(this.claimFNOLFormGroup)
            if(this.isLifeLob){
                this.claimFNOLFormGroup = this.fnolValidator.clearAttachmentValidations(this.claimFNOLFormGroup);
            }
            this.currentTab = '01';
        }
        else if (event.ui.tabId === '03') {
            this.currentTab = '02';
        }
    }

    public onNext(event: any): void {
        if (event.ui.tabId === '01') {
            if (!this.isEnquiryFlag) {
                if (!this.claimFNOLFormGroup.controls['claimInfo'].get('claimNo').value) {
                    this.generateClaimNumberAndRefreshPolicy(false);
                }
                this.claimFNOLFormGroup = this.fnolValidator.setClaimFNOLInsuredDetailsValidator(this.claimFNOLFormGroup);
                let nonPartyclientDesc = this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').value + ' ' + this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').value;
                this.claimFNOLFormGroup.controls['claimInfo'].get('nonPartyclientDesc').patchValue(nonPartyclientDesc);
                let nonPartyClientMobile = this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientMobile').value;
                this.claimFNOLFormGroup.controls['claimInfo'].get('nonPartyClientMobile').patchValue(nonPartyClientMobile);
                let nonPartyClientEmail = this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientEmail').value;
                this.claimFNOLFormGroup.controls['claimInfo'].get('nonPartyClientEmail').patchValue(nonPartyClientEmail);
                this.disableEnableAppFullName(true);
                this.tempClaimDetailsListToDropDownConversion();
                if (!this.isProductBuildFlag) this.benefitClaimedListToDropDownConversion();
                this.isMaxClaimantError = false;
                if (this.isLifeLob) {
                    this.setAttachment();
                    this.claimFNOLFormGroup = this.fnolValidator.setAttachmentValidations(this.claimFNOLFormGroup);
                }
            }
            this.currentTab = '02';
        }
        else if (event.ui.tabId === '02') {
            if (this.status !== 'Enquiry') {
                this.todayDate = new Date();
                this.currentTime = this.todayDate.toLocaleTimeString('en-GB').split(' ')[0];
                this.patchAppFullName();
                let selectedInsuredInfo: any = this.claimFNOLFormGroup.controls['selectedInsuredInfo'];
                if (selectedInsuredInfo.length > 0 && selectedInsuredInfo.at(0).get('appFullName').value == '' && selectedInsuredInfo.at(0).get('relationship').value == '') selectedInsuredInfo.removeAt(0);
                this.claimFNOLFormGroup.controls['claimInfo'].get('noticeTime').patchValue(this.currentTime);
                this.claimFNOLFormGroup.controls['policyInfo'].get('referenceNo').patchValue(this.claimFNOLFormGroup.controls['claimInfo'].get('claimNo').value);
                this.checkAttachments();
                this.confirmClaimFNOL();
            }
            if(this.isLifeLob){
                this.lifeAssuredName();
            }
            this.currentTab = '03';
        }
    }

    public onTabChange(): void {

    }

    ngAfterContentInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });

        if (this.activeRoute.snapshot.params.activity === 'FNOLNotifyClaim' || this.activeRoute.snapshot.params.activity === 'NTNotifyClaim') {
            if (this.loaderConfig.getCustom('policyNo')) {
                this.claimFNOLFormGroup.controls['policyInfo'].get('policyNo').patchValue(this.loaderConfig.getCustom('policyNo'));
                if(this.loaderConfig.get('lifeLOBFlag')){
                    this.claimFNOLFormGroup.controls['claimInfo'].get('lifeAssuredCd').patchValue(this.loaderConfig.getCustom('lifeAssuredCd'));
                    this.claimFNOLFormGroup.controls['claimInfo'].get('lifeAssuredDesc').patchValue(this.loaderConfig.getCustom('lifeAssuredDesc'));
                    this.claimFNOLFormGroup.controls['policyInfo'].get('policyNo').disable();
                    this.searchModal = true;
            }
                else {
                    this.generateClaimNumberAndRefreshPolicy(true);
                }
            }
            else{
                if (this.loaderConfig.get('lifeLOBFlag') && !this.loaderConfig.getCustom('policyNo')) {
                    this.searchModal = true;
                }
            }
        }
        if (this.status === 'Enquiry') {
            let dataObj = this.loaderConfig.getCustom('openHeld');
            if (dataObj !== undefined) {
                this.updateClaimantInfoData(dataObj);
                this.updateSelectedInsuredInfoData(dataObj);
                this.updateattachmentsData(dataObj);
                // this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientMobile').patchValue('+65-');
                // this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientMobile').updateValueAndValidity();
                this.loaderConfig.setLoadingSub('yes');
                this.isShowBasicDetailsFlag = true;
                this.isShowClaimantList = true;
				if(!this.claimFNOLFormGroup.controls['claimInfo'].get('noticeBy').value){
                    this.claimFNOLFormGroup.controls['claimInfo'].get('noticeBy').patchValue('0005');
                    this.setAUXCodeDescAfterSettingDefaultValues();
                }
                this.selectNotifierType();
                this.claimFNOLFormGroup.disable();
                this.showClaimFields = true;
                this.loaderConfig.setLoadingSub('no');
            }
        } else {
            if (this.status === 'OpenHeld') {
                let dataObj = this.loaderConfig.getCustom('openHeld');
                this.updateClaimantInfoData(dataObj);
                this.updateSelectedInsuredInfoData(dataObj);
                this.updateattachmentsData(dataObj);
                this.updateClaimantNameList(dataObj.insuredInfo);
                // this.disableOutOfPolicyPeriodDates();
                // this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientMobile').patchValue('+65-');
                // this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientMobile').updateValueAndValidity();
                this.loaderConfig.setLoadingSub('yes');
                this.isShowBasicDetailsFlag = true;
                this.isShowClaimantList = true;
                this.selectNotifierType();
                this.changeRef.markForCheck();
                this.loaderConfig.setLoadingSub('no');
            }
            this.claimFNOLFormGroup = this.fnolValidator.setClaimFNOLBasicDetailsValidator(this.claimFNOLFormGroup, this.isProductBuildFlag);
            this.claimFNOLFormGroup.controls['claimInfo'].get('noticeBy').valueChanges.subscribe(data => {
                if(!this.claimFNOLFormGroup.controls['claimInfo'].get('noticeBy').value){
                    this.claimFNOLFormGroup.controls['claimInfo'].get('noticeBy').patchValue('0005');
                    this.setAUXCodeDescAfterSettingDefaultValues();
                }
                this.selectNotifierType();
            });
            this.claimFNOLFormGroup.controls['claimInfo'].get('lossDate').valueChanges.subscribe(data => {
                let polFromDate = this.claimFNOLFormGroup.controls['policyInfo'].get('inceptionDt').value;
                let polToDate = this.claimFNOLFormGroup.controls['policyInfo'].get('expiryDt').value;
                let lossDate = this.claimFNOLFormGroup.controls['claimInfo'].get('lossDate').value;
                let todayDate = this.utilsService.getTodayDate();
                let dateDuration = this.dateDuration.transform(polFromDate, polToDate);
                let transLossDate = this.dateDuration.transform(lossDate);
                // if (dateDuration && this.b2bFlag && (transLossDate.startDate < dateDuration.startDate || transLossDate.startDate > dateDuration.endDate)) {
                //     this.claimFNOLFormGroup.controls['claimInfo'].get('lossDate').patchValue(todayDate);
                //     this.claimFNOLFormGroup.controls['claimInfo'].get('lossDate').updateValueAndValidity();
                // }
            });
        }
        if(this.isEnquiryFlag){
            let attachments: FormArray = <FormArray>this.claimFNOLFormGroup.controls['attachments'];
                 if (attachments.controls.length == 1 && attachments.controls[0].get('documentContent').value === '') {
                     this.emptyAttachmentFlag= true;   
                 }else{
                     this.emptyAttachmentFlag= false;
                 }
         }

    }

    public updateClaimantInfoData(dataValInput) {
        let lengthOfDataObjofClaimant = dataValInput.claimantInfo.length;
        let claimInfoFormGroup;
        claimInfoFormGroup = this.claimFNOLFormGroup.controls['claimantInfo'];
        claimInfoFormGroup.removeAt(0);
        for (let i = 0; i < lengthOfDataObjofClaimant; i++) {
            claimInfoFormGroup.push(this.claimantInfo.getClaimantInfoModel());
            let lengthOfQuestion = dataValInput.claimantInfo[i].questionnaires.length;
            let questionnairesForm: any = claimInfoFormGroup.at(i).controls['questionnaires'];
            questionnairesForm.removeAt(0);
            for (let j = 0; j < lengthOfQuestion; j++) {
                questionnairesForm.push(this.questionnaires.getQuestionnairesInfoModel());
            }
        }
        this.claimFNOLFormGroup.patchValue(dataValInput);
        this.claimFNOLFormGroup.updateValueAndValidity();
        this.changeRef.markForCheck();
    }
    public updateSelectedInsuredInfoData(dataValInput) {
        let lengthOfDataObjofSelectedInsured = dataValInput.selectedInsuredInfo.length;
        let selectedInsuredInfoFormGroup;
        selectedInsuredInfoFormGroup = this.claimFNOLFormGroup.controls['selectedInsuredInfo'];
        selectedInsuredInfoFormGroup.removeAt(0);
        for (let i = 0; i < lengthOfDataObjofSelectedInsured; i++) {
            selectedInsuredInfoFormGroup.push(this.selectedInsuredInfo.getSelectedInsuredInfoModel());
        }
        this.claimFNOLFormGroup.patchValue(dataValInput);
        this.claimFNOLFormGroup.updateValueAndValidity();
        this.changeRef.markForCheck();
    }
    public updateattachmentsData(dataValInput) {
        let lengthOfDataObjofAttachments = dataValInput.attachments ? dataValInput.attachments.length : 0;
        let attachmentsFormGroup;
        attachmentsFormGroup = this.claimFNOLFormGroup.controls['attachments'];
        if (attachmentsFormGroup.length > 0) {
            for (let j = 0; j < attachmentsFormGroup.length; j++) {
                attachmentsFormGroup.removeAt(j);
            }
        }

        for (let i = 0; i < lengthOfDataObjofAttachments; i++) {
            attachmentsFormGroup.push(this.attachments.getAttachmentsModel());
        }
        this.claimFNOLFormGroup.patchValue(dataValInput);
        this.claimFNOLFormGroup.updateValueAndValidity();
        this.changeRef.markForCheck();
    }
    public policyRefresh() {
        if (this.claimFNOLFormGroup.controls['claimInfo'].get('claimNo').value) {
            let policyNo = this.claimFNOLFormGroup.controls['policyInfo'].get('policyNo').value;
            if (policyNo) {
                let policyOutput = this.claimService.refreshPolicyDetails(this.claimFNOLFormGroup.value);
                policyOutput.subscribe(
                    (claimInfodataVal) => {
                        if (claimInfodataVal.error !== null && claimInfodataVal.error !== undefined && claimInfodataVal.error.length >= 1) {
                            this.updateErrorObject(claimInfodataVal);
                            this.isShowBasicDetailsFlag = false;
                            this.loaderConfig.setLoadingSub('no');
                        } else {
                            this.isError = false;
                            this.claimFNOLFormGroup = this.updateClaimInfoValue(claimInfodataVal);
                            this.updateFieldsByBusinessType(claimInfodataVal);
                            // this.disableOutOfPolicyPeriodDates();
                            this.isShowBasicDetailsFlag = true;
                            this.checkProductCode();
                            this.loaderConfig.setLoadingSub('no');
                        }
                        this.changeRef.markForCheck();
                    });
            } else {
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').patchValue('');
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').patchValue('');
                this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').patchValue('');
                this.claimFNOLFormGroup.controls['policyInfo'].get('agentName').patchValue('');
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').updateValueAndValidity();
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').updateValueAndValidity();
                this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').updateValueAndValidity();
                this.claimFNOLFormGroup.controls['policyInfo'].get('agentName').updateValueAndValidity();
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').enable();
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').enable();
                this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').enable();
                this.isError = false;
                this.isShowBasicDetailsFlag = false;
            }
        } else {
            this.generateClaimNumberAndRefreshPolicy(true);
        }
    }

    selectNotifierType() {
        let noticeBy = this.claimFNOLFormGroup.controls['claimInfo'].get('noticeBy').value;
        if (noticeBy === "0010" || noticeBy === "PH") {
            this.claimFNOLFormGroup.controls['claimInfo'].get('nonExstParty').patchValue('');
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').updateValueAndValidity();
            let polFullName = this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').value;
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientCode').patchValue(this.claimFNOLFormGroup.controls['customerInfo'].get('appCode').value);
            let splitArray: any[] = polFullName.split(" ");
            let polFirstName = '';
            let polLastName = '';
            polFirstName = splitArray[0];
            if (splitArray.length == 3) {
                polLastName = splitArray[2];
            }
            else if (splitArray.length == 2) {
                polLastName = splitArray[1];
            }

            this.claimFNOLFormGroup.controls['customerInfo'].get('appFName').setValue(polFirstName);
            this.claimFNOLFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.claimFNOLFormGroup.controls['customerInfo'].get('appLName').setValue(polLastName);
            this.claimFNOLFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').setValue(polFirstName);
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').updateValueAndValidity();
            this.polNotifierFirstName = this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').value;
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').setValue(polLastName);
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').updateValueAndValidity();
            this.polNotifierLastName = this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').value;
            if (this.claimFNOLFormGroup.controls['policyInfo'].get('policyNo').value) {
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').disable();
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').disable();
            }
            this.isOtherNotifier = false;
            //this.changeRef.markForCheck();
        }
        else if (noticeBy === "0005") {
            let agentName = this.claimFNOLFormGroup.controls['policyInfo'].get('agentName').value;
            this.claimFNOLFormGroup.controls['claimInfo'].get('nonExstParty').patchValue('');
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').updateValueAndValidity();
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientCode').patchValue(this.claimFNOLFormGroup.controls['policyInfo'].get('agentCd').value);
            let agentFirstName;
            let agentLastName;
            let splitAgentArray: any[] = agentName.split(" ");

            if (splitAgentArray.length == 3) {
                agentFirstName = splitAgentArray[0];
                agentLastName = splitAgentArray[2];
            }
            else {
                agentFirstName = splitAgentArray[0];
                agentLastName = splitAgentArray[1];
            }

            if (agentFirstName) {
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').setValue(agentFirstName);
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').updateValueAndValidity();
                this.polNotifierFirstName = this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').value;
            }
            if (agentLastName) {
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').setValue(agentLastName);
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').updateValueAndValidity();
                this.polNotifierLastName = this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').value;
            }
            if (this.claimFNOLFormGroup.controls['policyInfo'].get('policyNo').value) {
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').disable();
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').disable();
            }
            this.isOtherNotifier = false;
            this.changeRef.markForCheck();
        }
        else if(noticeBy ==='INS'){
            this.lifeAssuredName();
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').setValue(this.claimFNOLFormGroup.controls['claimInfo'].get('lifeAssuredFName').value);
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').updateValueAndValidity();
            this.polNotifierFirstName = this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').value;
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').setValue(this.claimFNOLFormGroup.controls['claimInfo'].get('lifeAssuredLName').value);
            this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').updateValueAndValidity();
            this.polNotifierLastName = this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').value;
            if (this.claimFNOLFormGroup.controls['policyInfo'].get('policyNo').value) {
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').disable();
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').disable();
            }
        }
         else {
            this.isOtherNotifier = true;
            if (!this.isEnquiryFlag) {
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientCode').patchValue('');
                this.claimFNOLFormGroup.controls['claimInfo'].get('nonExstParty').patchValue('T');
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').setValue('');
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').updateValueAndValidity();
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').setValue('');
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').updateValueAndValidity();
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientFirstName').enable();
                this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientLastName').enable();
                this.changeRef.markForCheck();
            }

        }
        //this.changeRef.markForCheck();
    }

    updateClaimInfoValue(dataInput) {

        this.claimFNOLFormGroup.controls['customerInfo'].patchValue(dataInput.customerInfo);
        this.claimFNOLFormGroup.controls['customerInfo'].updateValueAndValidity();

        this.claimFNOLFormGroup.controls['policyInfo'].patchValue(dataInput.policyInfo);
        this.claimFNOLFormGroup.controls['policyInfo'].updateValueAndValidity();

        this.claimFNOLFormGroup.controls['claimInfo'].patchValue(dataInput.claimInfo);
        this.claimFNOLFormGroup.controls['claimInfo'].updateValueAndValidity();

        this.claimFNOLFormGroup.controls['documentInfo'] = this.updateDocumentInfo(dataInput);
        this.claimFNOLFormGroup.controls['documentInfo'].updateValueAndValidity();

        this.claimFNOLFormGroup.controls['insuredInfo'] = this.updateInsuredInfo(dataInput);
        this.claimFNOLFormGroup.controls['insuredInfo'].updateValueAndValidity();
        if (dataInput.attachments) {
            this.claimFNOLFormGroup.controls['attachments'].patchValue(dataInput.attachments);
            this.claimFNOLFormGroup.controls['attachments'].updateValueAndValidity();
        }
        this.claimFNOLFormGroup.controls['claimCodeReserveList'] = this.updateClaimCodeReserveList(dataInput);
        this.claimFNOLFormGroup.controls['claimCodeReserveList'].updateValueAndValidity();

        if (this.status !== 'Enquiry' && this.status !== 'OpenHeld') {
            this.claimFNOLFormGroup.controls['claimInfo'].get('noticeBy').patchValue('0005');
            this.claimFNOLFormGroup.controls['claimInfo'].get('noticeBy').updateValueAndValidity();
        }
        this.patchReferenceNumber();
        this.setNCPDatePickerToDateOptions();
        // Populate claimantNameList Array		
        this.changeRef.markForCheck();
        return this.claimFNOLFormGroup;
    }

    public patchReferenceNumber() {
        this.claimFNOLFormGroup.controls['policyInfo'].get('referenceNo').patchValue(this.claimFNOLFormGroup.controls['claimInfo'].get('claimNo').value);
        this.claimFNOLFormGroup.updateValueAndValidity();
    }
    public updateDocumentInfo(dataValInputDoc) {
        let tempFormGroupDoc;
        tempFormGroupDoc = this.claimFNOLFormGroup.controls['documentInfo'];
        if(dataValInputDoc.documentInfo.length > 0){
            if (tempFormGroupDoc.length > 0) {
                for (let j = 0; j < tempFormGroupDoc.length; j++) {
                    tempFormGroupDoc.removeAt(j);
                }
            }
            let tempLength = dataValInputDoc.documentInfo.length;
            for (let i = 0; i < tempLength; i++) {
                tempFormGroupDoc.push(this.documentInfo.getDocumentInfoModel());
            }
			if(tempLength > 0){
            dataValInputDoc.documentInfo[0].isDocumentSelected = 'true';
			}
            tempFormGroupDoc.patchValue(dataValInputDoc.documentInfo);
            tempFormGroupDoc.updateValueAndValidity();
        }
        return tempFormGroupDoc;
    }

    public updateInsuredInfo(dataValInputInsured) {
        let tempFormGroupDoc;
        tempFormGroupDoc = this.claimFNOLFormGroup.controls['insuredInfo'];
        if (tempFormGroupDoc.length > 0) {
            for (let j = 0; j < tempFormGroupDoc.length; j++) {
                tempFormGroupDoc.removeAt(j);
            }
        }
        if (dataValInputInsured.insuredInfo) {
            // let tempLength = dataValInputInsured.insuredInfo ? dataValInputInsured.insuredInfo.length : 0;
            for (let i = 0; i < dataValInputInsured.insuredInfo.length; i++) {
                tempFormGroupDoc.push(this.insuredInfo.getInsuredInfoModel());
            }
            tempFormGroupDoc.patchValue(dataValInputInsured.insuredInfo);
            tempFormGroupDoc.updateValueAndValidity();
        }
        return tempFormGroupDoc;
    }

    public updateClaimCodeReserveList(dataValInputInsured) {
        let tempFormGroupDoc;
        tempFormGroupDoc = this.claimFNOLFormGroup.controls['claimCodeReserveList'];
        if (dataValInputInsured.claimCodeReserveList) {
            if (tempFormGroupDoc.length > 0) {
                for (let j = 0; j < tempFormGroupDoc.length; j++) {
                    tempFormGroupDoc.removeAt(j);
                }
            }
            let tempLength = dataValInputInsured.claimCodeReserveList ? dataValInputInsured.claimCodeReserveList.length : 0;
            for (let i = 0; i < tempLength; i++) {
                tempFormGroupDoc.push(this.claimCodeReserveInfo.getClaimCodeReserveInfoModel());
            }
            tempFormGroupDoc.patchValue(dataValInputInsured.claimCodeReserveList);
            tempFormGroupDoc.updateValueAndValidity();
        }
        return tempFormGroupDoc;

    }

    addClaimant() {
        this.isShowClaimantList = true;
        this.isMinClaimantError = false;
        let claimInfoFormGroup;
        let tempClaimDetailsFormArray;
        let selectedClaimantCode, selectedClaimantDesc;
        if (this.b2bFlag) {
            selectedClaimantCode = this.claimFNOLFormGroup.controls['claimInfo'].get('claimantName').value.code;
            selectedClaimantDesc = !this.isOtherClaimantSelectedFlag ? this.claimFNOLFormGroup.controls['claimInfo'].get('claimantName').value.desc : this.claimFNOLFormGroup.controls['claimInfo'].get('otherClaimantName').value;
        } else if (this.b2cFlag) {
            selectedClaimantDesc = this.claimFNOLFormGroup.controls['claimInfo'].get('claimantName').value;
        }
        let selectedClaimantRelationCode = this.claimFNOLFormGroup.controls['claimInfo'].get('claimantRelationCode').value;
        let selectedClaimantRelationDesc = this.claimFNOLFormGroup.controls['claimInfo'].get('claimantRelationDesc').value;

        claimInfoFormGroup = this.claimFNOLFormGroup;
        let tempClaimDetailsLength = claimInfoFormGroup.controls['selectedInsuredInfo'].length;
        if (tempClaimDetailsLength <= this.maxClaimantCount) {
            let selectedInsuredInfo = claimInfoFormGroup.controls['selectedInsuredInfo'];
            selectedInsuredInfo.push(this.selectedInsuredInfo.getSelectedInsuredInfoModel());
            tempClaimDetailsFormArray = selectedInsuredInfo.at(tempClaimDetailsLength);
            for (let claim = 0; claim < tempClaimDetailsLength; claim++) {
                if (selectedClaimantRelationDesc && selectedClaimantDesc) {
                    // if (selectedInsuredInfo.at(claim).get('appFullName').value !== selectedClaimantDesc && selectedInsuredInfo.at(claim).get('relationship').value !== selectedClaimantRelationDesc) {
                    if (selectedInsuredInfo.at(claim).get('appFullName').value !== selectedClaimantDesc) {
                        tempClaimDetailsFormArray.get('appFullName').patchValue(selectedClaimantDesc);
                        tempClaimDetailsFormArray.get('appFullName').updateValueAndValidity();
                        tempClaimDetailsFormArray.get('relationship').patchValue(selectedClaimantRelationDesc);
                        tempClaimDetailsFormArray.get('relationship').updateValueAndValidity();
                    }
                    else {
                        selectedInsuredInfo.removeAt(tempClaimDetailsLength);
                    }
                }
            }
            if (this.isOtherClaimantSelectedFlag) {
                this.claimFNOLFormGroup.controls['claimInfo'].get('otherClaimantName').patchValue('');
                this.claimFNOLFormGroup.controls['claimInfo'].get('otherClaimantName').updateValueAndValidity();
            }
        }
        else {
            this.isMaxClaimantError = true;
        }
        this.claimFNOLFormGroup.patchValue(this.claimFNOLFormGroup.controls['selectedInsuredInfo']);
        this.claimFNOLFormGroup.updateValueAndValidity();
        this.changeRef.markForCheck();
    }

    deleteClaimant(index) {
        let selectedInsuredInfo: any = this.claimFNOLFormGroup.controls['selectedInsuredInfo'];
        selectedInsuredInfo.removeAt(index);
        if (index == 1) {
            this.isMinClaimantError = true;
            this.isShowClaimantList = false;
        }
    }

    addClaim() {
        // this.isShowClaimList = true;
        let claimInfoFormGroup;

        claimInfoFormGroup = this.claimFNOLFormGroup.controls['claimantInfo'];
        let claimantListLength = claimInfoFormGroup.length;
        if (claimantListLength <= this.maxClaimCount) {
            // if( !this.isShowClaimList ){
            //    //test.removeAt(0);
            //     this.isShowClaimList = true;
            // } 
            claimInfoFormGroup.push(this.claimantInfo.getClaimantInfoModel());
            //  this.numberofQuestions = [0];
            this.benefitClaimedSelected = [];
        }
        // this.claimFNOLFormGroup.controls['claimInfo'].patchValue(claimInfoFormGroup);
        //  this.claimFNOLFormGroup.controls['claimInfo'].updateValueAndValidity();
        this.changeRef.markForCheck();
    }

    claimantDropDownList = new Array();
    benefitClaimedDropDownList = new Array();


    tempClaimDetailsListToDropDownConversion() {
        let claimInfoFormGroup;
        let tempClaimDetailsFormArray;
        // claimInfoFormGroup = this.claimFNOLFormGroup.controls['claimInfo'];
        // tempClaimDetailsFormArray = claimInfoFormGroup.controls['tempClaimDetails'];
        claimInfoFormGroup = this.claimFNOLFormGroup;
        tempClaimDetailsFormArray = claimInfoFormGroup.controls['selectedInsuredInfo'];

        let code = 'appFullName';
        let desc = 'appFullName';
        this.claimantDropDownList = this.utilsService.convertArrayListToDropdownList(tempClaimDetailsFormArray, code, desc);
        this.changeRef.markForCheck();
    }

    benefitClaimedListToDropDownConversion() {
        let policyNoObject = {
            'productCd': this.claimFNOLFormGroup.controls['policyInfo'].get('productCd').value
        }
        let claimCodeResponse = this.claimService.getClaimCodes(policyNoObject);
        claimCodeResponse.subscribe(
            (claimCodeResponse) => {
                if (claimCodeResponse.error !== null && claimCodeResponse.error !== undefined && claimCodeResponse.error.length >= 1) {
                    this.updateErrorObject(claimCodeResponse);
                } else {
                    let claimCodeReserveFormArray;
                    claimCodeReserveFormArray = claimCodeResponse;
                    let code = 'claimCode';
                    let desc = 'claimCodeDesc';
                    this.benefitClaimedDropDownList = this.utilsService.convertArrayDataListToDropdownList(claimCodeReserveFormArray, code, desc);
                }
                this.loaderConfig.setLoadingSub('no');
                this.changeRef.markForCheck();
            },
            (error) => {
                this.logger.error(error);
            });
    }

    public saveClaimFNOL(event: any): void {
        this.checkAttachments();
        this.todayDate = new Date();
        this.currentTime = this.todayDate.toLocaleTimeString('en-GB').split(' ')[0];
        this.claimFNOLFormGroup.controls['claimInfo'].get('noticeTime').patchValue(this.currentTime);
        this.patchAppFullName();
        let claimSaveResponse = this.claimService.claimFNOLSaveInfo(this.claimFNOLFormGroup.getRawValue());
        claimSaveResponse.subscribe(
            (claimSavedInfo) => {
                if (claimSavedInfo.error !== null && claimSavedInfo.error !== undefined && claimSavedInfo.error.length >= 1) {
                    this.updateErrorObject(claimSavedInfo);
                    this.isSaveClaimFNOLModal = false;
                    this.isSaveClaimFNOLIncidentModal = false;
                } else {
                    if (claimSavedInfo.status) {
                        if (this.currentTab === '02') {
                            this.isSaveClaimFNOLIncidentModal = true;
                        }
                        else if(this.isLifeLob){
                            this.isPostClaimFNOLModal = true;
                            this.claimFNOLFormGroup.disable();
                        }
                        else {
                            this.isSaveClaimFNOLModal = true;
                        }
                    }
                }
                this.loaderConfig.setLoadingSub('no');
                this.changeRef.markForCheck();
            },
            (error) => {
                this.logger.error(error);
            });

    }
    public updateEmailClaimInfo() {
        // let policyNo = this.claimFNOLFormGroup.controls['policyInfo'].get('policyNo').value;
        // let policyEndt = this.claimFNOLFormGroup.controls['policyInfo'].get('policyEndtNo').value;
        // let effectiveDate = this.claimFNOLFormGroup.controls['policyInfo'].get('expiryDt').value;
        // let subject = 'Claim Confirmation-' + this.claimFNOLFormGroup.controls['claimInfo'].get('claimNo').value;
        // let uniqueField = policyNo + policyEndt;
        // let documentId;
        // let documentName;
        // let tempFormGroupDoc;
        // tempFormGroupDoc = this.claimFNOLFormGroup.controls['documentInfo'].value;
        // if (tempFormGroupDoc.length > 0) {
        //     for (let j = 0; j < tempFormGroupDoc.length; j++) {
        //         if (tempFormGroupDoc[j].dispatchType === 'EMAIL') {
        //             documentId = tempFormGroupDoc[j].documentId;
        //         }
        //         if (tempFormGroupDoc[j].dispatchType === 'PDF') {
        //             documentName = tempFormGroupDoc[j].documentDesc;
        //         }
        //     }
        // }
        // let inputjsonToGetEmailTemplate: any[] = [{ uniqueField: uniqueField, documentId: documentId, effdate: effectiveDate, boName: 'UW' }];
        // let emailTemplateResponseOutput = this.claimService.getemailTemplateResponse(inputjsonToGetEmailTemplate);
        // emailTemplateResponseOutput.subscribe(
        //     (emailTemplateResponse) => {
        //         if (emailTemplateResponse === null) {
        //             this.loaderConfig.setLoadingSub('no');
        //         } else if (emailTemplateResponse._body.indexOf('error') > 0 && JSON.parse(emailTemplateResponse._body).error !== null && JSON.parse(emailTemplateResponse._body).error !== undefined && JSON.parse(emailTemplateResponse._body).error.length >= 1) {
        //             this.updateErrorObject(JSON.parse(emailTemplateResponse._body));
        //             this.loaderConfig.setLoadingSub('no');
        //         } else {
        //             this.claimFNOLFormGroup.controls['emailQuotInfo'].get('fromAddress').patchValue('nttdata.com');
        //             this.claimFNOLFormGroup.controls['emailQuotInfo'].get('fromAddress').updateValueAndValidity();
        //             if (this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientEmail').value) {
        //                 this.claimFNOLFormGroup.controls['emailQuotInfo'].get('toAddress').patchValue(this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientEmail').value);
        //                 this.claimFNOLFormGroup.controls['emailQuotInfo'].get('toAddress').updateValueAndValidity();
        //             } else {
        //                 this.claimFNOLFormGroup.controls['emailQuotInfo'].get('toAddress').patchValue('');
        //                 this.claimFNOLFormGroup.controls['emailQuotInfo'].get('toAddress').updateValueAndValidity();
        //             }
        //             this.claimFNOLFormGroup.controls['emailQuotInfo'].get('subject').patchValue(subject);
        //             this.claimFNOLFormGroup.controls['emailQuotInfo'].get('subject').updateValueAndValidity();
        //             this.claimFNOLFormGroup.controls['emailQuotInfo'].get('reason').patchValue(emailTemplateResponse._body);
        //             this.claimFNOLFormGroup.controls['emailQuotInfo'].get('reason').updateValueAndValidity();
        //             if (documentName !== undefined) {
        //                 this.claimFNOLFormGroup.controls['emailQuotInfo'].get('templateName').patchValue(documentName);
        //                 this.claimFNOLFormGroup.controls['emailQuotInfo'].get('templateName').updateValueAndValidity();
        //             } else {
        //                 this.claimFNOLFormGroup.controls['emailQuotInfo'].get('templateName').patchValue('');
        //                 this.claimFNOLFormGroup.controls['emailQuotInfo'].get('templateName').updateValueAndValidity();
        //             }
        //             this.loaderConfig.setLoadingSub('no');
        //             this.isPostClaimFNOLModal = true;
        //             this.changeRef.markForCheck();
        //         }
        //     });
        let subject = 'Claim Confirmation-' + this.claimFNOLFormGroup.controls['claimInfo'].get('claimNo').value;
        this.claimFNOLFormGroup.controls['emailQuotInfo'].get('fromAddress').patchValue('nttdata.com');
        this.claimFNOLFormGroup.controls['emailQuotInfo'].get('fromAddress').updateValueAndValidity();
        if (this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientEmail').value) {
            this.claimFNOLFormGroup.controls['emailQuotInfo'].get('toAddress').patchValue(this.claimFNOLFormGroup.controls['claimInfo'].get('notifierClientEmail').value);
            this.claimFNOLFormGroup.controls['emailQuotInfo'].get('toAddress').updateValueAndValidity();
        } else {
            this.claimFNOLFormGroup.controls['emailQuotInfo'].get('toAddress').patchValue('');
            this.claimFNOLFormGroup.controls['emailQuotInfo'].get('toAddress').updateValueAndValidity();
        }
        this.claimFNOLFormGroup.controls['emailQuotInfo'].get('subject').patchValue(subject);
        this.claimFNOLFormGroup.controls['emailQuotInfo'].get('subject').updateValueAndValidity();
        this.claimFNOLFormGroup.controls['emailQuotInfo'].get('reason').patchValue('');
        this.claimFNOLFormGroup.controls['emailQuotInfo'].get('reason').updateValueAndValidity();
        this.claimFNOLFormGroup.controls['emailQuotInfo'].get('templateName').patchValue('');
        this.claimFNOLFormGroup.controls['emailQuotInfo'].get('templateName').updateValueAndValidity();
        // this.loaderConfig.setLoadingSub('no');
        this.isPostClaimFNOLModal = true;
        this.changeRef.markForCheck();

    }
    public postClaimFNOL() {
        if (!this.claimFNOLFormGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled || !this.claimFNOLFormGroup.controls['policyInfo'].value.isImportantNoticeEnabled) {
            this.updateErrorObject(this.ErrorConfirmMessage);
        } else {
            this.isError = false;
            this.patchAppFullName();
            let claimPostResponse = this.claimService.getClaimFNOLPosting(this.claimFNOLFormGroup.getRawValue());
            claimPostResponse.subscribe(
                (claimPostedInfo) => {
                    if ((claimPostedInfo.error !== null) && (claimPostedInfo.error !== undefined) && (claimPostedInfo.error.length >= 1)) {
                        this.updateErrorObject(claimPostedInfo);
                        this.isPostClaimFNOLModal = false;
                    } else {
                        // this.updateEmailClaimInfo();
                        this.isPostClaimFNOLModal = true;
                        this.claimFNOLFormGroup.disable();
                    }
                    this.loaderConfig.setLoadingSub('no');
                    this.changeRef.markForCheck();
                },
                (error) => {
                    this.logger.error(error);
                });
        }
    }
    public updateClaimantNameList(dataInput) {
        let tempInsuredInfo = {};
        let othersInfo = {
            'code': '11',
            'desc': 'Other'
        };
        for (let key in dataInput) {
            tempInsuredInfo = {};
            tempInsuredInfo['code'] = key;
            tempInsuredInfo['desc'] = dataInput[key]['appFullName'];
            this.claimantNameList.push(tempInsuredInfo);
        }
        this.claimantNameList.push(othersInfo);
    }

    doClaimDocAndQuesList(benefitClaimedCd: string, claimNo: string, claimantCd: string, seq: number) {
        let input = {
            'productCd': this.claimFNOLFormGroup.controls['policyInfo'].get('productCd').value,
            'claimCode': benefitClaimedCd
        };
        this.benefitClaimedSelected[seq] = benefitClaimedCd;
        if (benefitClaimedCd === 'OTH') {
            this.otherClaimSelected[seq] = true;
        } else {
            this.otherClaimSelected[seq] = false;
        }
        let questionnairesLength = 0;
        let claimClaimDocAndQuesListResponse = this.claimService.getClaimDocAndQuesList(input);
        claimClaimDocAndQuesListResponse.subscribe(
            (claimClaimDocAndQuesListResponse) => {
                if (claimClaimDocAndQuesListResponse === null) {
                    let questionnairesFormGroup;
                    let claimantInfoFormArray: any = this.claimFNOLFormGroup.controls['claimantInfo'];
                    let claimantInfoSeq: any = seq;
                    let questionnairesFormGroupTemp = claimantInfoFormArray.at(claimantInfoSeq);
                    questionnairesFormGroup = questionnairesFormGroupTemp;
                    let length = questionnairesFormGroup.controls['questionnaires'].value.length;
                    for (let i = length - 1; i >= 0; i--) {
                        questionnairesFormGroup.controls['questionnaires'].removeAt(i);
                        questionnairesFormGroup.controls['questionnaires'].updateValueAndValidity();
                    }
                    this.docCheckInfo.length = 0;
                    this.loaderConfig.setLoadingSub('no');
                } else if ((claimClaimDocAndQuesListResponse.error !== null) && (claimClaimDocAndQuesListResponse.error !== undefined) && (claimClaimDocAndQuesListResponse.error.length >= 1)) {
                    this.updateErrorObject(claimClaimDocAndQuesListResponse);
                    this.loaderConfig.setLoadingSub('no');
                } else {
                    let questionnairesFormGroup;
                    let claimantInfoFormArray: any = this.claimFNOLFormGroup.controls['claimantInfo'];
                    questionnairesLength = claimClaimDocAndQuesListResponse.questionaireInfo.length;
                    let claimantInfoSeq: any = seq;
                    let questionnairesFormGroupTemp = claimantInfoFormArray.at(claimantInfoSeq);
                    questionnairesFormGroup = questionnairesFormGroupTemp;
                    let length = questionnairesFormGroup.controls['questionnaires'].value.length;
                    for (let i = length - 1; i >= 0; i--) {
                        questionnairesFormGroup.controls['questionnaires'].removeAt(i);
                        questionnairesFormGroup.controls['questionnaires'].updateValueAndValidity();
                    }
                    this.docCheckInfo.length = 0;
                    questionnairesFormGroup.controls['seq'].patchValue(seq + 1);
                    questionnairesFormGroup.controls['seq'].updateValueAndValidity();
                    questionnairesFormGroup.controls['claimNo'].patchValue(claimNo);
                    questionnairesFormGroup.controls['claimNo'].updateValueAndValidity();
                    questionnairesFormGroup.controls['claimCode'].patchValue(benefitClaimedCd);
                    questionnairesFormGroup.controls['claimCode'].updateValueAndValidity();
                    //   this.numberofQuestions = [];
                    let claimantCd = questionnairesFormGroup.controls['claimantCd'].value;
                    for (let i = 0; i < questionnairesFormGroup.controls['questionnaires'].length; i++) {
                        questionnairesFormGroup.controls['questionnaires'].removeAt(i);
                        // this.questionnairesRemovedEmitter.emit();
                    }
                    // this.questionnairesRemovedEmitter.subscribe(() => {
                    for (let i = 0; i < questionnairesLength; i++) {
                        questionnairesFormGroup.controls['questionnaires'].push(this.questionnaires.getQuestionnairesInfoModel());
                        // this.numberofQuestions.push(i);
                    }

                    for (let i = 0; i < questionnairesLength; i++) {
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('question').patchValue(claimClaimDocAndQuesListResponse.questionaireInfo[i].question);
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('question').updateValueAndValidity();
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('questionType').patchValue(claimClaimDocAndQuesListResponse.questionaireInfo[i].dataType);
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('questionType').updateValueAndValidity();
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('claimNo').patchValue(claimNo);
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('claimNo').updateValueAndValidity();
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('benefitClaimed').patchValue(benefitClaimedCd);
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('benefitClaimed').updateValueAndValidity();
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('claimantCd').patchValue(claimantCd);
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('claimantCd').updateValueAndValidity();
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('questionSeqNo').patchValue(i + 1);
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('questionSeqNo').updateValueAndValidity();
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('questionAnswer').patchValue('');
                        questionnairesFormGroup.controls['questionnaires'].at(i).get('questionAnswer').updateValueAndValidity();
                        this.changeRef.markForCheck();
                    }
                    // }) ;
                    if (benefitClaimedCd !== 'OTH') {
                        if (claimClaimDocAndQuesListResponse.docCheckInfo.length > 0) {
                            this.docCheckInfo[claimantInfoSeq] = '';
                            for (let i = 0; i <= claimClaimDocAndQuesListResponse.docCheckInfo.length - 1; i++) {
                                this.docCheckInfo[claimantInfoSeq] += claimClaimDocAndQuesListResponse.docCheckInfo[i].documentName + ' , ';
                            }
                            this.docCheckInfo[claimantInfoSeq] = this.docCheckInfo[claimantInfoSeq].slice(0, -2);
                        }
                    }
                    //this.claimFNOLFormGroup.controls['claimantInfo']
                    // questionnairesFormGroupTemp.controls['questionnaires'] = questionnairesFormGroup;
                    //  questionnairesFormGroupTemp.controls['questionnaires'].updateValueAndValidity();
                    // this.claimFNOLFormGroup.controls['claimantInfo'] = questionnairesFormGroup;
                    //  this.claimFNOLFormGroup.controls['claimantInfo'].updateValueAndValidity();
                    //      this.changeRef.detectChanges();
                    // this.changeRef.markForCheck();
                    //  this.defaultClaimantCurrency(seq);
                    this.loaderConfig.setLoadingSub('no');
                }
                this.loaderConfig.setLoadingSub('no');
                this.changeRef.markForCheck();
            },
            (error) => {
                this.logger.error(error);
                this.loaderConfig.setLoadingSub('no');
            });
    }

    fileSize;
    uploadedFileList: any[] = [];
    getMimeTypedata(file, index) {
        if (file['files'] && file['files'].length > 0) {
            this.uploadedFileList.push(file['files'][0]);
            let files: File = <File>file['files'][0];
            this.fileSize = files.size;
            this.loaderConfig.setLoadingSub('yes');
            // let uploadDocInfoFormGroup: FormGroup = <FormGroup>this.claimFNOLFormGroup.controls['referQuotInfo'];
            // let temp: FormArray = <FormArray>uploadDocInfoFormGroup.controls['attachments'];
            let temp: FormArray = <FormArray>this.claimFNOLFormGroup.controls['attachments'];
            let attachGrp: FormGroup = <FormGroup>temp.controls[index - 1];
            attachGrp.get('documentContent').setErrors(null);
            attachGrp.updateValueAndValidity();
            if (parseInt(this.fileSize) < parseInt((this.loaderConfig.get('fileSize')))) {
                try {
                    let fr = new FileReader();
                    fr.readAsBinaryString(files);
                    fr.onload = function () {
                        attachGrp.get('mimeType').setValue(files.type.toString());
                        attachGrp.get('fileName').setValue(files.name.toString());
                        attachGrp.get('seq').setValue(index);
                        attachGrp.get('documentContent').setValue(btoa(fr.result.toString()));
                        attachGrp.updateValueAndValidity();
                    };
                } catch (e) {
                    this.logger.info(e, 'Error in Upload');
                }
            }
            if (parseInt(this.fileSize) > parseInt((this.loaderConfig.get('fileSize')))) {
                let referInfoArray: FormArray = <FormArray>this.claimFNOLFormGroup.controls['attachments'];
                referInfoArray.at(index).get('documentContent').markAsDirty();
                referInfoArray.at(index).get('documentContent').setErrors({ 'maxSize': true });
                referInfoArray.updateValueAndValidity();
            }
            this.changeRef.markForCheck();
            this.loaderConfig.setLoadingSub('no');
        }
    }
    getEmailMimeTypedata(file) {
        if (file['files']) {
            this.uploadedFileList.push(file['files'][0]);
            let files: File = <File>file['files'][0];
            this.fileSize = files.size;
            this.loaderConfig.setLoadingSub('yes');
            let temp: FormArray = <FormArray>this.claimFNOLFormGroup.controls['emailQuotInfo'];
            let attachGrp: FormGroup = <FormGroup>temp.controls[temp.controls.length - 1];
            attachGrp.get('fileUpload').setErrors(null);
            attachGrp.updateValueAndValidity();
            if (parseInt(this.fileSize) < parseInt((this.loaderConfig.get('fileSize')))) {
                try {
                    let fr = new FileReader();
                    fr.readAsBinaryString(files);
                    fr.onload = function () {
                        attachGrp.get('fileUpload').setValue(btoa(fr.result.toString()));
                        attachGrp.updateValueAndValidity();
                    };
                } catch (e) {
                    this.logger.info(e, 'Error in Upload');
                }
            }
            if (parseInt(this.fileSize) > parseInt((this.loaderConfig.get('fileSize')))) {
                let referInfoArray: FormArray = <FormArray>this.claimFNOLFormGroup.controls['emailQuotInfo'];
                referInfoArray.at(0).get('fileUpload').markAsDirty();
                referInfoArray.at(0).get('fileUpload').setErrors({ 'maxSize': true });
                referInfoArray.updateValueAndValidity();
            }
            this.changeRef.markForCheck();
            this.loaderConfig.setLoadingSub('no');
        }
    }
    addUploadDocument() {
        let uploadDocInfoFormGroup;
        uploadDocInfoFormGroup = this.claimFNOLFormGroup.controls['attachments'];
        let test = uploadDocInfoFormGroup;
        test.push(this.attachments.getAttachmentsModel());
        this.loaderConfig.setLoadingSub('yes');
        this.changeRef.markForCheck();
        this.loaderConfig.setLoadingSub('no');
    }

    deleteuploadDocument(index) {
        let uploadDocInfoFormGroup: any = this.claimFNOLFormGroup.controls['attachments'];
        let tempClaimFormGroup;
        tempClaimFormGroup = uploadDocInfoFormGroup;
        this.loaderConfig.setLoadingSub('yes');
        tempClaimFormGroup.removeAt(index);
        this.changeRef.markForCheck();
        this.loaderConfig.setLoadingSub('no');
    }
    viewDocument(index) {
        let uploadDocInfoFormGroup: any = this.claimFNOLFormGroup.controls['attachments'];
        let tempClaimFormGroup;
        tempClaimFormGroup = uploadDocInfoFormGroup.at(index).value;
        this.loaderConfig.setLoadingSub('yes');
        if (tempClaimFormGroup.documentContent) {
            let tempContent: any = atob(tempClaimFormGroup.documentContent);
            let length = tempContent.length;
            let arrayBuffer = new ArrayBuffer(length);
            let uintArray = new Uint8Array(arrayBuffer);
            for (let i = 0; i < length; i++) {
                uintArray[i] = tempContent.charCodeAt(i);
            }
            let blob = new Blob([uintArray], { type: tempClaimFormGroup.mimeType });
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob);
            } else {
                let objectUrl = URL.createObjectURL(blob);
                window.open(objectUrl);
            }
        }
        this.changeRef.markForCheck();
        this.loaderConfig.setLoadingSub('no');
    }

    updateFieldsByBusinessType(dataInput) {
        if (this.b2bFlag) {
            this.disableEnableAppFullName(false);
            this.updateClaimantNameList(dataInput.insuredInfo);
        } else if (this.b2cFlag) {
            this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').patchValue(null);
            this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').updateValueAndValidity();
        }
    }


    disableEnableAppFullName(isEnable) {
        if (this.b2bFlag) {
            if (isEnable) {
                if (this.appFullName !== '') {
                    this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').patchValue(this.appFullName);
                    this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').updateValueAndValidity();
                }
            } else {
                if (this.appFullName == '') this.appFullName = this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').value;
                if (this.claimFNOLFormGroup.controls['policyInfo'].get('policyNo').value) {
                    this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').disable();
                    this.claimFNOLFormGroup.controls['policyInfo'].get('policyNo').disable();
                }
            }
        }
    }

    public updateErrorObject(inputErrorObject) {
        this.isError = true;
        this.errors = [];
        for (let i = 0; i < inputErrorObject.error.length; i++) {
            if (inputErrorObject.error[i].errCode) {
                this.errors.push({ 'errCode': inputErrorObject.error[i].errCode, 'errDesc': inputErrorObject.error[i].errDesc });
                this.logger.log('Error===>' + inputErrorObject.error[i].errCode + ':' + inputErrorObject.error[i].errDesc);
            }
        }
        window.scrollTo(130, 130);
    }

    patchAppFullName() {
        if (this.appFullName) {
            this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').enable();
            this.claimFNOLFormGroup.controls['customerInfo'].get('appFullName').patchValue(this.appFullName);
        }
    }

    disableOutOfPolicyPeriodDates() {
        if (this.claimFNOLFormGroup.controls['policyInfo'].get('inceptionDt').value && this.claimFNOLFormGroup.controls['policyInfo'].get('expiryDt').value) {
            let polFromDateArray: number[] = this.claimFNOLFormGroup.controls['policyInfo'].get('inceptionDt').value.split('/');
            this.datePickerNormalOptions.disabledUntil = { year: polFromDateArray[2], month: polFromDateArray[1], day: polFromDateArray[0] - 1, dayTxt: '' }
            let polToDateArray: number[] = this.claimFNOLFormGroup.controls['policyInfo'].get('expiryDt').value.split('/');
            this.datePickerNormalOptions.disableSince = { year: polToDateArray[2], month: polToDateArray[1], day: polToDateArray[0] + 1, dayTxt: '' }
        }
    }

    public setNCPDatePickerToDateOptions() {
        let inceptionDate = this.claimFNOLFormGroup.controls['policyInfo'].get('inceptionDt').value;
        let noticeDate = this.claimFNOLFormGroup.controls['claimInfo'].get('noticeDate').value
        let expiryDate = this.claimFNOLFormGroup.controls['policyInfo'].get('expiryDt').value;
        let dateDuration = this.dateDuration.transform(inceptionDate, expiryDate);
        let inceptionDt,expiryDt,inceptionDay:number,inceptionYear:number,inceptionMonth:number,expiryDay:number,expiryMonth:number,expiryYear:number;
        if( dateDuration != null){
        inceptionDt = dateDuration.startDate;
        expiryDt = dateDuration.endDate;
        inceptionDay = inceptionDt.getDate();
        inceptionMonth= inceptionDt.getMonth()+1;
        inceptionYear= inceptionDt.getFullYear();
        if (inceptionDay === 0 || inceptionDay === 1 ) {
            let inceptionDayPrevDate = new Date(inceptionDt.getFullYear(), inceptionDt.getMonth(), 0);
            inceptionDay = inceptionDayPrevDate.getDate();
            inceptionMonth -= 1;    
            if (inceptionMonth === 0) {
                inceptionMonth = 12;
                inceptionYear -= 1;
            }
        }
        expiryDay = expiryDt.getDate();
        expiryMonth = expiryDt.getMonth()+1;
        expiryYear = expiryDt.getFullYear();
        
        }
        let noticeDt = this.dateDuration.transform(noticeDate);
        let noticedte = noticeDt.startDate;
        let noticeDay: number = noticedte.getDate();
        let noticeMonth: number = noticedte.getMonth()+1;
        let noticeYear: number = noticedte.getFullYear();
        let todayDate = new Date();
        let todayDay = todayDate.getDate();
        let todayMonth = todayDate.getMonth() +1;
        let todayYear = todayDate.getFullYear();
        
        this.datePickerNormalOptions.disabledUntil = { year: inceptionYear, month: inceptionMonth , day: inceptionDay, dayTxt: '' };
        let yearDiff = expiryYear - noticeYear;
        let monthDiff = expiryMonth - noticeMonth;
        let dayDiff = expiryDay - noticeDay;

        if (yearDiff > 0) {
            this.datePickerNormalOptions.disableSince = { year: noticeYear, month: noticeMonth, day: noticeDay + 1, dayTxt: '' };
        }
        else {
            if (monthDiff > 0) {
                this.datePickerNormalOptions.disableSince = { year: noticeYear, month: noticeMonth, day: noticeDay + 1, dayTxt: '' };
            }
            else {
                if (dayDiff > 0) {
                    this.datePickerNormalOptions.disableSince = { year: noticeYear, month: noticeMonth, day: noticeDay + 1, dayTxt: '' };
                }
                else {
                    this.datePickerNormalOptions.disableSince = { year: expiryYear, month: expiryMonth, day: expiryDay + 1, dayTxt: '' };
                }
            }
        }
        if(todayDate > expiryDt){
                this.datePickerNormalOptions.disable = {todayDate};
                this.claimFNOLFormGroup.controls['claimInfo'].get('lossDate').setValue(expiryDt);
                this.claimFNOLFormGroup.updateValueAndValidity();
        }



        return this.setNCPDatePickerToDateOptions;

    }

    //  defaultClaimantCurrency(seq){
    //      let claimInfoFormArray;
    //      claimInfoFormArray = this.claimFNOLFormGroup.controls['claimantInfo'];
    //         // claimInfoFormGroup = this.claimFNOLFormGroup.controls['claimantInfo'];
    //         let claimantListLength = claimInfoFormArray.value.length;
    //         for(let i=0;i<claimantListLength;i++){
    //            let claimantGroup = claimInfoFormArray.at(seq);
    //             if(this.loaderConfig.get('build') === 'sg'){
    //             claimantGroup.controls['claimantCurr'].patchValue('SGD');
    //             claimantGroup.controls['claimantCurr'].updateValueAndValidity();
    //             claimantGroup.controls['claimantCurrDesc'].patchValue('SGD');
    //             claimantGroup.controls['claimantCurrDesc'].updateValueAndValidity();
    //             }else if(this.loaderConfig.get('build') === 'hk'){
    //                             claimantGroup.controls['claimantCurrDesc'].patchValue('HKD');
    //             claimantGroup.controls['claimantCurrDesc'].updateValueAndValidity();
    //             claimantGroup.controls['claimantCurr'].patchValue('HKD');
    //             claimantGroup.controls['claimantCurr'].updateValueAndValidity();

    //             }  
    //         }
    //         this.claimFNOLFormGroup.controls['claimantInfo'].updateValueAndValidity();
    //          this.changeRef.markForCheck();
    //  }
    ngOnDestroy() {
        this.loaderConfig.setCustom('openHeld', '');
        this.tabChangeSub.unsubscribe();
        this.nextTabSub.unsubscribe();
        this.prevTabSub.unsubscribe();
        this.validateTabSub.unsubscribe();
        this.clickSub.unsubscribe();
        this.appFullName = '';
    }
    confirmClaimFNOL() {
        if (this.claimFNOLFormGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.claimFNOLFormGroup.controls['policyInfo'].value.isImportantNoticeEnabled) {
            this.confirmFlag = true;
        }
        else {
            this.confirmFlag = false;
        }
    }
    setAUXCodeDescAfterSettingDefaultValues() {

    }
    public getAUXCodeDesc(inputDescControl: FormControl, inputCodeControl: FormControl, auxType, auxSubType?, productCode?, code?, desc?, param1?, param2?, param3?, param4?, param5?) {
        let picklistInput = {
            auxType: auxType,
            auxSubType: auxSubType,
            productCode: productCode,
            param1: param1,
            param2: param2,
            param3: param3,
            param4: param4,
            param5: param5,
            code: code,
            desc: desc
        }
        let auxCodeDesc = this.pickListService.getPickListCodeDesc(picklistInput, true);
        auxCodeDesc.subscribe(
            (dataVal) => {
                if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
                    //TODO error Handling 
                    this.loaderConfig.setLoadingSub('no')
                } else {
                    if (dataVal.desc && dataVal.desc != 'null') {
                        inputDescControl.patchValue(dataVal.desc);
                        inputDescControl.updateValueAndValidity();
                        inputCodeControl.patchValue(code);
                        inputCodeControl.updateValueAndValidity();
                        this.changeRef.markForCheck();
                        this.loaderConfig.setLoadingSub('no');
                    }
                }
            },
            (error) => {
                this.logger.error(error);
            }
        );

    }

    checkProductCode() {
        // fileds add and delete based on product
    }

    public checkAttachments() {
        let temp: FormArray = <FormArray>this.claimFNOLFormGroup.controls['attachments'];
        for (var i = 1; i < temp.length; i++) {
            if (temp.controls[i].get('documentContent').value === '') temp.removeAt(i);
        }
    }

    public searchOnclaimType() {
        this.isLifeLob = true;
        this.generateClaimNumberAndRefreshPolicy(false);
        this.searchModal = false;
    }
    public lifeAssuredName() {
        let laFullName = this.claimFNOLFormGroup.controls['claimInfo'].get('lifeAssuredDesc').value;
        let splitArray: any[] = laFullName.split(" ");
        let laFirstName = '';
        let laLastName = '';
        laFirstName = splitArray[0];
        if (splitArray.length == 3) {
            laLastName = splitArray[2];
        }
        else if (splitArray.length == 2) {
            laLastName = splitArray[1];
        }
        this.claimFNOLFormGroup.controls['claimInfo'].get('lifeAssuredFName').patchValue(laFirstName);
        this.claimFNOLFormGroup.controls['claimInfo'].get('lifeAssuredLName').patchValue(laLastName);
    }
    setAttachment() {
        let attachments: FormArray = <FormArray>this.claimFNOLFormGroup.controls['attachments'];
        let documentInfo: FormArray = <FormArray>this.claimFNOLFormGroup.controls['documentInfo'];
        if (attachments.length !== documentInfo.length) {
            let i = documentInfo.length - attachments.length;
            i = i - 1;
            for (let j = 0; j <= i; j++) {
                attachments.push(this.attachments.getAttachmentsModel());
            }
        }
    }
        public setChangesForLifeLob(){
        this.claimFNOLFormGroup.controls['claimInfo'].get('lifeAssuredCd').disable();
        this.claimFNOLFormGroup.controls['claimInfo'].get('lifeAssuredDesc').disable();
        this.claimFNOLFormGroup.controls['policyInfo'].get('policyNo').disable();
        this.claimFNOLFormGroup.controls['claimInfo'].get('claimType').disable();
        this.claimFNOLFormGroup.controls['claimInfo'].get('claimTypeDesc').disable();
        this.claimFNOLFormGroup.controls['claimInfo'].get('noticeByDesc').patchValue('Policy Holder');
        this.claimFNOLFormGroup.controls['claimInfo'].get('noticeByDesc').updateValueAndValidity();
        this.claimFNOLFormGroup.controls['claimInfo'].get('noticeBy').patchValue('PH');
        this.claimFNOLFormGroup.controls['claimInfo'].get('noticeBy').updateValueAndValidity();
        }

    }

