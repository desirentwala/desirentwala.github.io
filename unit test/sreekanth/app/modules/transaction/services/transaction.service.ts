import { TranslateService } from '@adapters/packageAdapter';
/**
 * An abstraction layer for all the transaction procedures i.e Policy, Quote & Claim
 * It imports all the common dependencies like Logger, router, INg2WizardConfig etc
 * commonly used in all the product specific transaction classes
 * This is added as a dependency in the QuoteTransactionService and PolicyTransactionService ,
 * which inturn exposes this to the outer world
 * @summary   An all transaction abstraction
 * @author  Arnab Lahiri
 * @link    src\app\modules\policyProcess\services\transaction.service.ts
 * @class   TransactionService
 */
import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FactoryProvider } from '../../../core/factory/factoryprovider';
import { ProductFactory } from '../../../core/factory/productfactory';
import { ConfigService } from '../../../core/services/config.service';
import { EventService } from '../../../core/services/event.service';
import { AmountFormat } from '../../../core/ui-components/amount/pipes/amountFormat';
import { Logger } from '../../../core/ui-components/logger/logger';
import { DateDuration } from '../../../core/ui-components/ncp-date-picker/pipes/date.duration';
import { DateFormatService } from '../../../core/ui-components/ncp-date-picker/services/ncp-date-picker.date.format.service';
import { INg2WizardConfig } from '../../../core/ui-components/ng2-wizard/ng2-wizard.config';
import { PaymentService } from '../../../core/ui-components/payment/payment.service';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { BreadCrumbService } from '../../common/breadCrumb/services/breadcrumb.service';



const CARD_TYPE = {
    2: "Master",
    3: 'VISA',
    5: 'Amex',
    22: 'Diners',
    23: 'JCB',
    25: 'China UnionPay card',
    41: 'ENets'
};

@Injectable()
export class TransactionService {
    // + Factories
    public factoryInstance: ProductFactory;
    // + Switches for Legacy Support
    get useLegacy(): boolean {
        return this.configService.useLegacy;
    }
    // + Booleans
    public status: string;
    public isEnquiryFlag: boolean = false;
    public isNextFlag: boolean = true;
    public isValidForm: boolean = true;
    payByCash: boolean = true;
    payByCredit: boolean = true;
    isEnablePlanTableFlag: boolean = false;
    public isDuplicateIDErrorFlag: boolean = true;
    public isPolicyRatingDone: boolean = true;
    public isDocumentPresent: boolean = false;
    public doStepSectionValidation: boolean = false;
    isEndorsmentFlag: boolean = false;
    // + Models
    public quoteinfo;
    public riskInfo;
    public customerInfo;
    public insuredList;     // + Replaced from insured
    public insured;
    public referQuotInfo;   // + Replaced from referInfo
    public referInfo;
    public plans;
    public policyInfo;
    public documentInfo;
    public referralHistoryInfo;
    public planDetails;     // + Replaced from planDetail
    public planDetail;
    public policyCovgInfo;         // + Replaced from policyCoverageInfo
    public policyCoverageInfo;
    public nomineeList;         // + Replaced from nomineeDetail
    public nomineeDetail;
    public subjectMatterInfo;
    public claimHistoryInfo;
    public noteInfo;
    public coverageLoadingInfo;
    public countryTravelList;       // + Replaced from travelInfo
    public travelInfo;
    public errorInfo;
    public instalmentItemInfo;
    public avipilot;
    public aviusage;
    public avaitaionOther;
    public ridersInfo;
    public quoteBenefitInfo;
    public featureBenefitList;
    public ruleInfo;
    public uasOperatingInfo;
    public tabInfo;
    public coinsurerInfo;
    public summaryInfo;
    public declarationInfo;
    public declarationItemSectionInfo;
    public declarationCoverageInfo;
    public riskSurveyorDetailsInfo;
    public additionalRiskInfo;
    // + Product API and other common variables 
    public currentTab = '01';
    public currentStep = '01';
    public lobCode: string;
    public lobObject: any;
    public productCode: string;
    public paymentTypeCard = 'S06';
    public paymentTypeCheque = 'S02';
    public policyTermShort = '07';
    public policyTermAnnul = '01';
    public documents = [];
    public docInfo;
    public docInfoView;
    public insuredListData: any;
    public modelContainers: any = {};
    public modelAliases: any = {
        insured: 'insuredList',
        referInfo: 'referQuotInfo',
        planDetail: 'planDetails',
        policyCoverageInfo: 'policyCovgInfo',
        nomineeDetail: 'nomineeList',
        travelInfo: 'countryTravelList'
    };

    // + Subscriptions
    changeSub: any;
    planProcessedSub;
    tabChangeSub: any;
    nextTabSub: any;
    prevTabSub: any;
    nextStepSub: any;
    prevStepSub: any;
    validateTabSub: any;
    clickSub: any;
    modalCloseSub: any;
    checkForNextStepSub: any;
    // + Misc
    events: any[] = [];
    subscribedMap = {};
    todayString: string;
    dateDelimiter: string;
    dateFormat: string;
    dateDelimiterIndex: number[];
    todayDate: Date;
    amtFormat: AmountFormat;
    fileSize;
    uploadedFileList: any[] = [];
    technicalUserArray: any = [];
    referTo: string = '';
    subject;
    public identityNumbersArray: string[] = [];
    selectedRiskIndex: string;
    selectedPlanIndex: number = 0;
    importantNotice: string = 'NCPTextarea.importantNotice';
    personalDataProtectionActStatement: string = "NCPTextarea.warranty&Declaration";
    warrantyAndDeclaration: string = "NCPTextarea.personalDataProtectionActStatement";
    firstDeclarationHeading: string = 'NCPAccordionHeading.importantNotice';
    secondDeclarationHeading: string = 'NCPAccordionHeading.warranty&Declaration';
    thirdDeclarationHeading: string = 'NCPAccordionHeading.personalDataProtectionAct';
    eventType: any;
    activeRoutePath: string;
    public avaitaionAdditional;
    public wizardConfig: INg2WizardConfig = {
        'showNavigationButtons': true,
        'navigationButtonLocation': 'bottom',
        'preventUnvisitedTabNavigation': true,
        'showProgress': true
    };
    public hideNavigationButtonWizardConfig: INg2WizardConfig = {
        'showNavigationButtons': false,
        'navigationButtonLocation': 'bottom',
        'preventUnvisitedTabNavigation': true,
        'showProgress': true
    };
    NCPDatePickerNormalOptions = {
        alignSelectorRight: true,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true,
        disabledUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 1, dayTxt: '' }
    };
    NCPDatePickerToDateOptions = {
        alignSelectorRight: true,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true,
        disabledUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 1, dayTxt: '' }
    };
    NCPDatePickerToDateAnnualOptions = {
        alignSelectorRight: true,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true,
        disabledUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 1, dayTxt: '' },
        disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1, dayTxt: '' }
    };
    NCPDatePickerEffectiveDtOptions = {
        alignSelectorRight: true,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true,
        disabledUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 1, dayTxt: '' },
        disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1, dayTxt: '' }
    };

    constructor(
        public translate: TranslateService,
        public eventHandlerService: EventService,
        public breadCrumbService: BreadCrumbService,
        public configService: ConfigService,
        public dateFormatService: DateFormatService,
        public utilService: UtilsService,
        public logger: Logger,
        public router: Router,
        public activeRoute: ActivatedRoute,
        public dateDuration: DateDuration,
        public paymentService: PaymentService) {
        this.dateDelimiter = this.configService.get('dateDelimiter');
        this.dateFormat = this.configService.get('dateFormat');
        this.todayDate = new Date();
        this.todayDate.setHours(0, 0, 0, 0);
        this.todayString = this.dateFormatService.formatDate(this.todayDate);
        this.amtFormat = new AmountFormat(this.configService);
    }
    /**
    * Exposes its lobObject variable which contains current LOB Object ( i.e FireHomeComponent, PersonalMotorComponent etc.) . Called From product Constructor
    * @method setLOBObject
    * @param {Object} str - some string
    * @return {Object} product Components instance
    */
    public setLOBObject(lobObject: Object) {
        this.lobObject = lobObject;
    }

    /**
   * Exposes its policyModelInstance variable from factory instance
   * @method getCountryModelInstance
   * @return {AbstractFactory} product Components instance
   */
    private getPolicyModelInstance(formBuilder: FormBuilder) {
        let policyModelInstance: any;
        if (formBuilder) {
            this.factoryInstance = FactoryProvider.getFactoryInstance(this.configService, this.logger, formBuilder);   // + Country Creation Factory
            policyModelInstance = this.factoryInstance.getPolicyModelInstance();
        }
        return policyModelInstance;
    }

    /**
    * Exposes its model related variables ( i.e quoteinfo, insured etc.) . Called From product Constructor
    * @method setModels
    * @return {Object} product Components instance
    */
    public setModels(formBuilder: FormBuilder) {
        let policyModelInstance = this.getPolicyModelInstance(formBuilder);
        if (policyModelInstance && this.useLegacy) {
            this.quoteinfo = policyModelInstance.getQuotInfo();
            this.riskInfo = policyModelInstance.getRiskInfo();
            this.insured = policyModelInstance.getInsuredInfo();
            this.referInfo = policyModelInstance.getReferQuotInfo();
            this.plans = policyModelInstance.getPlanInfo();
            this.documentInfo = policyModelInstance.getDocumentInfo();
            this.referralHistoryInfo = policyModelInstance.getReferralHistoryInfo();
            this.planDetail = policyModelInstance.getPlanDetailsInfo();
            this.policyCoverageInfo = policyModelInstance.getPolicyCoverageInfo();
            this.nomineeDetail = policyModelInstance.getNomineeModel();
            this.customerInfo = policyModelInstance.getCustomerInfo();
            this.subjectMatterInfo = policyModelInstance.getSubjectMatterInfo();
            this.claimHistoryInfo = policyModelInstance.getClaimHistoryInfo();
            this.noteInfo = policyModelInstance.getNoteInfoModel();
            this.coverageLoadingInfo = policyModelInstance.getCoverageLoadingInfo();
            this.travelInfo = policyModelInstance.getTravelInfoModel();
            this.errorInfo = policyModelInstance.getErrorInfo();
            this.instalmentItemInfo = policyModelInstance.getInstalmentItemInfoModel();
            this.avipilot = policyModelInstance.getPilotInfo();
            this.avaitaionOther = policyModelInstance.getAdditionalInsurerInfomodel();
            this.ridersInfo = policyModelInstance.getRidersInfo();
            this.quoteBenefitInfo = policyModelInstance.getQuoteBenefitInfo();
            this.featureBenefitList = policyModelInstance.getFeatureBenefitInfo();
            //this.ruleInfo = policyModelInstance.getRuleInfo();
            this.uasOperatingInfo = policyModelInstance.getUasOperatingInfoModel();
            this.tabInfo = policyModelInstance.getTabInfo();
            this.coinsurerInfo = policyModelInstance.getCoinsurerInfo();
            this.summaryInfo = policyModelInstance.getSummaryInfo();
            this.declarationInfo = policyModelInstance.getDeclarationInfo();
            this.declarationItemSectionInfo = policyModelInstance.getDeclarationItemSectionInfo();
            this.declarationCoverageInfo = policyModelInstance.getDeclarationCoverageInfo();
            this.riskSurveyorDetailsInfo = policyModelInstance.getRiskSurveyorDetailsInfo();
            this.additionalRiskInfo = policyModelInstance.getAdditionalRiskInfo();
        }
    }
    /**
    * check for BusinessType . 
    * @method getIsB2B
    * @return {boolean} true if B2B. else false
    */
    public getIsB2B(): boolean {
        return !(this.configService.getCustom('b2cFlag') || this.configService.getCustom('b2b2cFlag'));
    }

    subcribeToFormChanges(formGroup: FormGroup) {
        const formStatusChanges$ = formGroup.statusChanges;
        const formValueChanges$ = formGroup.valueChanges;
        formStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
        formValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
    }

    public setIsEnquiryFlag() {
        this.isEnquiryFlag = this.status === 'Enquiry';
    }

    public setStatus(status: string) {
        this.status = status;
    }

    navigateToHome() {
        this.configService.navigateToHome();
    }

    getLOBDetailsByLOBCode() {
        return this.utilService.get(this.lobCode);
    }

    getProductDetails() {
        return this.utilService.getProductDetails(this.productCode.toUpperCase());
    }

    setDefaultValues() {
        this.isValidForm = true;
        this.isNextFlag = true;
        this.status = 'NewQuote';
        this.clickSub = null;
        this.docInfo = '';
        if (this.currentTab) {
            this.currentTab = '01';
        }
        this.utilService.destroyActiveValidationIDs();
    }

    public doDestroyCommonWizardSub() {
        // this.validateTabSub.unsubscribe();
        this.changeSub.unsubscribe();
        this.tabChangeSub.unsubscribe();
        this.nextTabSub.unsubscribe();
        this.prevTabSub.unsubscribe();
        // this.clickSub.unsubscribe();
        if (this.planProcessedSub) {
            this.planProcessedSub.unsubscribe();
        }

    }
    public doPopCommonWizardSub() {
        this.configService.loggerSub.observers.pop();
        this.eventHandlerService.clickSub.observers.pop();
        this.eventHandlerService.validateTabSub.observers.pop();
        this.eventHandlerService.prevTabSub.observers.pop();
        this.eventHandlerService.nextTabSub.observers.pop();
        this.eventHandlerService.tabChangeSub.observers.pop();
        this.eventHandlerService.changeSub.observers.pop();
        this.paymentService.initPostEmitter.observers.pop();
    }
    parseSelectedDate(ds: string) {
        let date: any = { day: 0, month: 0, year: 0, dayTxt: '' };
        if (ds) {
            let fmt = this.dateFormat;
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
        return date;
    }
    setDeclarationHeaders(productDeclarationHeaders) {
        this.firstDeclarationHeading = productDeclarationHeaders[0];
        this.secondDeclarationHeading = productDeclarationHeaders[1];
        this.thirdDeclarationHeading = productDeclarationHeaders[2];
    }

    /**
    * Method populates model variables like insured, policyInfo etc .
    * Proxy introduced only for legacy support.
    * First for-loop is a fall-back mechanism to deal with variables not same as mapping key's (  policyCovgInfo => 'policyCoverageInfo')
    * @method setProxyModels
    * @return void
    */
    setProxyModels(): void {
        let modelCallHandler = {
            get: (target, property, receiver) => target[property] = () => this.copyFormControl(target)
        };
        for (const k in this.modelAliases) {
            if (this.modelAliases.hasOwnProperty(k)) {
                this.modelContainers[k] = this.modelContainers[this.modelAliases[k]];
            }
        }
        for (const key in this.modelContainers) {
            if (this.modelContainers[key] instanceof Object) {
                this[key] = new Proxy(this.modelContainers[key], modelCallHandler);
            }
        }
    }

    /**
    * Method returns a replica of the formGroup it receives as an argument
    * Basically used for creating new formGroups having the same structure as it's argument
    * @method copyFormControl
    * @param {AbstractControl} control
    * @return FormControl | FormGroup | FormArray
    */
    copyFormControl(control: AbstractControl) {
        if (control instanceof FormControl) {
            return new FormControl(control.value);
        } else if (control instanceof FormGroup) {
            const copy = new FormGroup({});
            Object.keys(control.getRawValue()).forEach(key => {
                copy.addControl(key, this.copyFormControl(control.controls[key]));
            });
            return copy;
        } else if (control instanceof FormArray) {
            const copy = new FormArray([]);
            control.controls.forEach(control => {
                copy.push(this.copyFormControl(control));
            })
            return copy;
        }
    }

    public getProductMappingData() {
        let input = {
            'lobCode': this.lobCode
        };
        return this.configService.ncpRestServiceCall('utils/getTransactionMapping', input);

    }
}
