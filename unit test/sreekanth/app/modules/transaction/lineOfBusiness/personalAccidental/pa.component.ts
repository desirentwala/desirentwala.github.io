import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NCPFormUtilsService } from '../../../../core/ncp-forms/ncp.form.utils';
import { customerService } from '../../../customer/services/customer.service';
import { UserFormService } from '../../../userManagement';
import { ElementConstants } from '../../constants/ncpElement.constants';
import { PolicyTransactionService } from '../../services/policytransaction.service';
import { QuoteTransactionService } from '../../services/quotetransaction.service';
import { RenewalTransactionService } from '../../services/renewalTransaction.service';
import { TransactionComponent } from '../../transaction.component';
import { PADefaultValue } from './pa.defaultValues';
import { PersonalAccidentPolicyValidator } from './paPolicy.validator';
import { PersonalAccidentQuoteValidator } from './paQuote.validator';

/**
 * Component Class for personal accident Insurance related methods.
 * @implements OnInit, AfterContentInit
 */
@Component({
    template: `
    <button-field *ngIf="isShowBackButton" buttonType="custom" buttonName="NCPBtn.back" buttonClass="ncpbtn-default mr0 t-34" (click)="goBackToPMOV()"></button-field>
    <ncp-errorHandler [isError]="isError" [errors]="errors" [errorInfo]="this.formGroup.get('errorInfo')?.value"> </ncp-errorHandler>
    <ncp-form *ngIf="formData" [formData]="formData"></ncp-form>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalAccidentComponent extends TransactionComponent implements OnInit, AfterContentInit, OnDestroy {

    // + flags
    public productBrochureclickId;
    public isInsuredErrorFlag: boolean = true;
    public isNomineeErrorFlag: boolean = true;
    public disableDelNominee: boolean = false;
    public doRatingFlagCheckRequired: boolean = false;
    public isRiskLevelNominee: boolean = false;
    public isNominee: boolean = false;
    // + Endorsement Specific Variables
    public isEnablePlanTableFlag: boolean = false;
    public isPolicyTypeAnnual: boolean = false;
    // + Others
    public hasCustomerCreation: boolean = true;
    public hasSpouse: boolean = false;
    public numberofChildren: any;
    public isCollapsedTr: boolean = false;
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
    constructor(
        public ncpFormService: NCPFormUtilsService,
        public customerService: customerService,
        public formBuilder: FormBuilder,
        public changeRef: ChangeDetectorRef,
        public activeRoute: ActivatedRoute,
        public userService: UserFormService,
        public quoteComponent: QuoteTransactionService,
        public policyComponent: PolicyTransactionService,
        public renewalComponent: RenewalTransactionService
    ) {
        super(ncpFormService,
            customerService,
            formBuilder,
            changeRef,
            activeRoute,
            userService,
            quoteComponent,
            policyComponent,
            renewalComponent);
        this.transactionTypeInstance.transaction.lobCode = 'PA';
    }

    ngAfterContentInit(): void {
        this.transactionTypeInstance.transaction.configService.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.transactionTypeInstance.transaction.translate.use(this.transactionTypeInstance.transaction.configService.currentLangName);
            }
        });
        if (this.transactionTypeInstance.transaction.useLegacy === true) {
            this.doSubscribeAfterFormGroupInit();
        }
    }

    ngOnInit(): void {
        let lobObject: any = this.transactionTypeInstance.transaction.utilService.get(this.transactionTypeInstance.transaction.lobCode);
        if (lobObject) this.quoteFormDataInit();
        else {
            this.transactionTypeInstance.transaction.utilService.loadedSub.subscribe(() => {
                this.quoteFormDataInit();
            });
        }
        if (this.transactionTypeInstance.transaction.useLegacy === true) {
            this.formGroup = this.transactionTypeInstance.transaction.quoteinfo.getPAQuotInfoModel();
        } else {
            this.transactionTypeInstance.transaction.getProductMappingData().subscribe(mappings => {
                this.formGroup = this.doPopulateFormGroup(mappings, new FormGroup({}));
                this.transactionTypeInstance.transaction.setProxyModels();
                this.doSubscribeAfterFormGroupInit();
            });
        }
        this.transactionTypeInstance.transaction.subcribeToFormChanges(this.formGroup);
        this.doInitCommonWizardSub();
        this.doInitChangeSub();
        this.doInitClickSub();
    }
    ngOnDestroy() {
        window.scrollTo(150, 150);
        this.transactionTypeInstance.transaction.doDestroyCommonWizardSub();
        this.transactionTypeInstance.transaction.doPopCommonWizardSub();
        this.setDefaultValues();
        this.transactionTypeInstance.transaction.logger.info('Subscriptions destroyed from PA');
    }
    public updateElements() {
        if (this.formData) {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.formName, 'formName', this.formGroup);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'importantNotice', this.transactionTypeInstance.transaction.importantNotice);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'warrantyAndDeclaration', this.transactionTypeInstance.transaction.personalDataProtectionActStatement);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'personalDataProtectionActStatement', this.transactionTypeInstance.transaction.warrantyAndDeclaration);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'firstHeading', this.transactionTypeInstance.transaction.firstDeclarationHeading);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'secondHeading', this.transactionTypeInstance.transaction.secondDeclarationHeading);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'thirdHeading', this.transactionTypeInstance.transaction.thirdDeclarationHeading);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentInfoCondition, 'condition', !this.transactionTypeInstance.transaction.isPolicyFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentReferenceNoControl, 'hide', this.transactionTypeInstance.transaction.isEnquiryFlag && !(this.formGroup.controls['paymentInfo'].value.paymentReferenceNo));
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.defaultingButtonCondition, 'condition', this.transactionTypeInstance.transaction.status === 'NewQuote');
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.defaultingCheckCondition, 'condition', this.formGroup.controls['policyInfo'].get('quoteNo').value);
            if (this.transactionTypeInstance.transaction.status !== 'EndEnquiry') {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.PolicyAgentCondition, 'condition', this.userType === this.userTypeOperator);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'disableNext', !this.transactionTypeInstance.transaction.isValidForm);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'wizardConfig', this.multiItemFlag ? this.formGroup.controls['policyInfo'].get('quoteNo').value ? this.transactionTypeInstance.transaction.wizardConfig : this.transactionTypeInstance.transaction.hideNavigationButtonWizardConfig : this.transactionTypeInstance.transaction.wizardConfig);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.basicInfoTabHeadError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerToDateAnnualOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTabError, 'displayFlag', !this.isPlantableErrorFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredTabError, 'displayFlag', !this.isInsuredErrorFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nomineeTabError, 'displayFlag', !this.isNomineeErrorFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nominee, 'disableDelBtn', this.disableDelNominee);
                //this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                //this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralHistoryCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.enquiryFlagPlanTable, 'isEnquiryFlag', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ZipCodeCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ZipCode, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                if (!this.multiItemFlag) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planSelectedLabel, 'label', this.selectedPlanDesc);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planSelectedPremium, 'label', this.selectedPlanPrem);
                } else {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryDate, 'options', this.setNCPDatePickerToDateOptions());
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerToDateAnnualOptions);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.comparePlansButton, 'isDisabled', this.transactionTypeInstance.transaction.status === 'Enquiry' ? true : false);
                }
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentDescList, 'valueList', this.docInfoList());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referQuoteModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModalKey, 'modalKey', this.referralHistoryModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailSuccessModalKey, 'modalKey', this.emailSuccessModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralSuccessModalKey, 'modalKey', this.referModalkey);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkSaveModalButton, 'isDisabled', !this.checkSaveModal());
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkMailModalButton, 'isDisabled', !this.checkMailModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerToDateAnnualOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nominee, 'enableAddDelBtn', !this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.contactNumber, 'isEnquiryFlag', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.contactNumber, 'contactType', 'Phone');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.IdentityNoCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.IdentityNoButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredIdentityNoButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.postalcode, 'acceptPattern', this.zipCodePattern);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralSuccessModalKey, 'modalKey', this.referModalkey);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteModalcondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
            }
            if (this.transactionTypeInstance.transaction.status === 'EndEnquiry') {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nominee, 'disableDelBtn', this.disableDelNominee);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nominee, 'enableAddDelBtn', !this.transactionTypeInstance.transaction.isEnquiryFlag);
            }
            if (this.transactionType === 'REN' || this.transactionTypeInstance.isRenewalFlag) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyAndEndtNoElementID, 'label', '   ' + this.formGroup.controls['policyInfo'].get('policyNo').value + ' - ' + this.formGroup.controls['policyInfo'].get('policyEndtNo').value);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteNo, 'elementFormName', 'policyNo');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalTitle', 'NCPLabel.policySavedSuccessfully');
                this.setSelectedPlanAndPremium();
            }
            this.updateElementsForPolicy();
        }
    }

    referQuote() {
        this.formGroup = this.validator.setReferQuoteModalValidator(this.formGroup);
        this.referModal = false;
        this.formGroup.controls['referQuotInfo'].get('subject').enable();
        let referralResponse = this.service.quoteReferral(this.formGroup.getRawValue());
        referralResponse.subscribe(
            (referralResponse) => {
                if (referralResponse.error !== null && referralResponse.error !== undefined && referralResponse.error.length >= 1) {
                    this.updateErrorObject(referralResponse);
                    this.referModal = false;
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    this.transactionTypeInstance.transaction.logger.error('error() ===>', 'errorreferral service' + referralResponse.error);
                } else {
                    this.referModal = false;
                    this.referModalkey = true;
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralSuccessModalKey, 'modalKey', this.referModalkey);
            });
        //  }

    }
    setSelectedPlanAndPremium() {
        let riskInfo = this.formGroup.controls['riskInfo'].value;
        if (riskInfo && riskInfo.length > 0) {
            riskInfo.forEach(riskInfoObject => {
                let plans = riskInfoObject.plans;
                if (plans && plans.length > 0) {
                    plans.forEach(planObject => {
                        if (planObject.planTypeDesc) {
                            this.selectedPlanDesc = planObject.planTypeDesc;
                        }
                        if (planObject.planPrem) {
                            this.selectedPlanPrem = this.transactionTypeInstance.transaction.amtFormat.transform(parseFloat(planObject.planPrem), []);
                        }
                    });
                }

            });
        }
    }
    public onValidateTab(): void {
        if (this.transactionTypeInstance.transaction.isEnquiryFlag) {
            this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = true;
            this.transactionTypeInstance.transaction.isValidForm = true;
        } else {
            this.isError = false;
            switch (this.transactionTypeInstance.transaction.currentTab) {
                case '01': {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['riskInfo'].valid && this.salesAgentFlag && this.formGroup.controls['policyInfo'].valid;
                    this.transactionTypeInstance.transaction.isValidForm = this.formGroup.controls['riskInfo'].valid && this.salesAgentFlag && this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    break;
                }
                case '02': {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.validatePlanDetail(this.formGroup.value);
                    this.isPlantableErrorFlag = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    break;
                }
                case '03': {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['riskInfo'].valid && this.formGroup.controls['customerInfo'].valid;
                    this.isInsuredErrorFlag = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.isInsuredErrorFlag && this.validateNominee();
                    this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    this.isNomineeErrorFlag = this.validateNominee();
                    break;
                }
                default: {
                    break;
                }
            }
        }
        this.transactionTypeInstance.transaction.isNextFlag = !this.transactionTypeInstance.transaction.isValidForm;
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'disableNext', !this.transactionTypeInstance.transaction.isValidForm);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.basicInfoTabHeadError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTabError, 'displayFlag', !this.isPlantableErrorFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nomineeTabError, 'displayFlag', !this.isNomineeErrorFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredTabError, 'displayFlag', !this.isInsuredErrorFlag);
    }
    public onPrevious(event: any): void {
        this.isError = false;
        switch (event.ui.tabId) {
            case '02': {
                this.transactionTypeInstance.transaction.currentTab = '01';
                if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                    this.formGroup = this.validator.clearPAQuotValidatorsBasicDetails(this.formGroup);
                    if (this.transactionTypeInstance.isPolicyFlag)
                        this.doEndtReasonCode();
                }
                break;
            }
            case '03': {
                this.transactionTypeInstance.transaction.currentTab = '02';
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    this.formGroup = this.validator.clearPAQuotCustomerInfoValidator(this.formGroup);
                    let tempRiskFormGroup;
                    let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
                    let insuredListFormGroup = riskInfoFormArray.at(0);
                    insuredListFormGroup = this.validator.clearSetInsuredValidators(insuredListFormGroup);
                }
                break;
            }
            case '04': {
                this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').reset();
                this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').updateValueAndValidity();
                this.transactionTypeInstance.transaction.currentTab = '03';
                if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                    if (this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value) {
                        this.insuredDetails();
                    }
                }
                break;
            }
            default: {
                break;
            }
        }
        if (this.transactionTypeInstance.isPolicyFlag) this.doEndorsementReasonFormGroupUpdate();
    }
    public onNext(event: any): void {
        switch (event.ui.tabId) {
            case '01': {
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    this.doRating();
                }
                this.transactionTypeInstance.transaction.currentTab = '02';
                break;
            }
            case '02': {
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    this.formGroup = this.validator.setPAQuotCustomerInfoValidator(this.formGroup);
                    let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
                    if (!this.multiItemFlag) {
                        riskInfoFormArray.controls.forEach(insuredData => {
                            insuredData = this.validator.setPAQuotInsuredValidators(insuredData);
                        });
                    } else {
                        riskInfoFormArray.controls.forEach(data => data = this.validator.setPAIRiskValidator(data, false, this.multiItemFlag));
                    }
                }
                if (this.multiItemFlag) {
                    this.setCustomerDetails();
                }
                // this.setNominees();
                this.transactionTypeInstance.transaction.currentTab = '03';
                break;
            }
            case '03': {
                this.setCustomerFullName();
                this.setKeysForNominee();
                if (this.transactionType === 'QT') {
                    this.doPatchDisabledInsuredData();
                }
                if (this.transactionType === 'PO') {
                    this.doSetupSummaryScreenPayment();
                }
                this.transactionTypeInstance.transaction.currentTab = '04';
                break;
            }
            default: {
                break;
            }
        }
        this.changeRef.markForCheck();
    }
    public onTabChange(): void { }
    public doInitChangeSub() {
        this.transactionTypeInstance.transaction.changeSub = this.transactionTypeInstance.transaction.eventHandlerService.changeSub.subscribe((data) => {
            if(data.id){
            if (typeof data.id === 'string') {
                data.id = data.id.toLowerCase();
            }
            if (data.id === this.eventConstants['contentCodeChangeId']) {
                this.setKeysForSubjectMatter();
            }
            if (data.id === this.eventConstants['coverDateChanged']) {
                if (!this.transactionTypeInstance.transaction.isEnquiryFlag)
                    this.coverDateChanged();
            }
            else if (data.id === this.eventConstants['setCoverDates']) {
                this.setCoverDates();
            }
            else if (data.id === this.eventConstants['setInsuredDetails']) {
                this.insuredDetails();
            }
            else if (data.id === this.eventConstants['doCustomerRefresh']) {
                this.doCustomerRefresh(this.formGroup.controls['customerInfo'], data.id);
            }
            else if (data.id === this.eventConstants['doInsuredRefresh']) {
                this.doInsuredRefresh(data, this.isRiskLevelNominee);
            }
            else if (data.id === this.eventConstants['postalCodeRefresh']) {
                this.getPostalCodeRefresh();
            }
            else if (data.id === this.eventConstants['coverageChanged']) {
                if (data.value.value !== this.transactionTypeInstance.selectedCoverageCode[data.value.superParentIndex]) {
                    this.transactionTypeInstance.isPolicyRatingDone = false;
                    this.transactionTypeInstance.selectedCoverageIndex = data.value.index;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteCalculate, 'isDisabled', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSelectedCover, 'selectedPlanIndex', this.transactionTypeInstance.selectedCoverageIndex);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableListArrayViewButton, 'isDisabled', true);
                }
            }
            else if (data.id === this.eventConstants['coverTypeChanged']) {
                this.coverTypeChanged(data);
            }
            else if (data.id === this.eventConstants['addDelSpouseChildren']) {
                let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                let hasSpouse = this.riskInfoGroup.get('hasSpouse').value;
                let numberofChildren = this.riskInfoGroup.get('numberofChildren').value || 0;
                if (hasSpouse !== this.hasSpouse) {
                    this.hasSpouse = hasSpouse;
                    if (hasSpouse) {
                        tempRiskArray.push(this.validator.setPAIRiskValidator(this.transactionTypeInstance.transaction.riskInfo.getPARiskInfoModel(), false, this.multiItemFlag));
                        tempRiskArray.at(1).get('relationshipToInsuredCode').patchValue("SPO");
                        tempRiskArray.at(1).get('relationshipToInsuredDesc').patchValue("SPOUSE");
                        tempRiskArray.at(1).get('relationshipToInsuredCode').disable();
                        tempRiskArray.at(1).get('relationshipToInsuredDesc').disable();
                        for (let i = 1; i < tempRiskArray.length; i++) {
                            if (tempRiskArray.at(i).get('relationshipToInsuredCode').value === "" || tempRiskArray.at(i).get('relationshipToInsuredCode').value === "CHD") {
                                tempRiskArray.at(i).get('relationshipToInsuredCode').patchValue("CHD");
                                tempRiskArray.at(i).get('relationshipToInsuredDesc').patchValue("CHILD");
                                tempRiskArray.at(i).get('relationshipToInsuredCode').disable();
                                tempRiskArray.at(i).get('relationshipToInsuredDesc').disable();
                            }
                        }
                        this.addItemDetails();
                    } else {
                        let val = parseInt(this.numberofChildren);
                        if (!val) {
                            val = 0;
                        }
                        if (tempRiskArray.length > 1 && tempRiskArray.length > val) {
                            tempRiskArray.removeAt(1);
                        }
                        this.deleteItemDetails();
                    }
                    this.setItemNo();
                }
                else if (numberofChildren !== this.numberofChildren) {
                    this.numberofChildren = numberofChildren;
                    let num = parseInt(numberofChildren) + 1;
                    if (this.hasSpouse) {
                        num = num + 1;
                    }
                    if (tempRiskArray.length > num) {
                        let j = tempRiskArray.length - num;
                        for (let i = 0; i < tempRiskArray.length; i++) {
                            if (j !== 0 && tempRiskArray.at(i).get('relationshipToInsuredCode').value === "CHD") {
                                tempRiskArray.removeAt(i);
                                i--;
                                j--;
                            }
                        }
                        this.deleteItemDetails()
                    } else if (tempRiskArray.length < num) {
                        let j = num - tempRiskArray.length;
                        for (let i = 0; i < j; i++) {
                            tempRiskArray.push(this.validator.setPAIRiskValidator(this.transactionTypeInstance.transaction.riskInfo.getPARiskInfoModel(), false, this.multiItemFlag));
                        }
                        for (let i = 1; i < tempRiskArray.length; i++) {
                            if (tempRiskArray.at(i).get('relationshipToInsuredCode').value === "" || tempRiskArray.at(i).get('relationshipToInsuredCode').value === "CHD") {
                                tempRiskArray.at(i).get('relationshipToInsuredCode').patchValue("CHD");
                                tempRiskArray.at(i).get('relationshipToInsuredDesc').patchValue("CHILD");
                                tempRiskArray.at(i).get('relationshipToInsuredCode').disable();
                                tempRiskArray.at(i).get('relationshipToInsuredDesc').disable();
                            }
                        }
                        this.addItemDetails();
                    }
                    this.setItemNo();
                }
                this.patchNomineeshareValue();
            }
            else if (data.id === this.eventConstants['declarationsChanged']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);
            }
            else if (data.id === this.eventConstants['insuredModalChangesForValidation']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkSaveModalButton, 'isDisabled', !this.checkSaveModal());
            }
            else if (data.id === this.eventConstants['emailModalChangesForValidation']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkMailModalButton, 'isDisabled', !this.checkMailModal());
            } else if (data.id === this.eventConstants['saveQuoteErrorPayment']) {
                this.updateErrorObject(data['value']);
            }
            else if (data.id === this.eventConstants['ccAddressValidationId']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
            }
            else if (data.id === this.eventConstants['remarksValidationId']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
            }
        }
        });
    }
    public doInitClickSub() {
        this.transactionTypeInstance.transaction.clickSub = this.transactionTypeInstance.transaction.eventHandlerService.clickSub.subscribe((data) => {
            if(data.id){
            if (typeof data.id === 'string') {
                data.id = data.id.toLowerCase();
            }
            if (data.id === this.eventConstants['addSubjectMatter']) {
                this.addSubjectMatter(data);
            }
            if (data.id === this.eventConstants['deleteSubjectMatter']) {
                this.deleteSubjectMatter(data);
            }
            if (data.id === this.eventConstants['addClaimHistory']) {
                this.addClaimHistory(data);
            }
            if (data.id === this.eventConstants['deleteClaimHistory']) {
                this.deleteClaimHistory(data);
            }
            if (data.id === this.eventConstants['policytyepSelected']) {
                this.policytyepSelected(data.value);
                this.coverDateChanged();
            }
            else if (data.id === this.eventConstants['printDocuments']) {
                this.printModal = true;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
            }
            else if (data.id === this.eventConstants['saveModalClose']) {
                this.saveQuoteModal = false;
                if (this.isCustomerRefreshed) {
                    this.disableCustomerInfo(this.formGroup.controls['customerInfo'], data.id);
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
            }
            else if (data.id === this.eventConstants['saveModalSave']) {
                this.saveQuoteModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                this.save();
            }
            else if (data.id === this.eventConstants['savedModalClose']) {
                this.saveModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveModal);
                this.navigateToHome();
            }
            else if (data.id === this.eventConstants['saveModal']) {
                if (!this.disableSaveModal()) {
                    this.saveQuoteModal = true;
                    this.saveQuoteModalValidation();
                    if (this.isCustomerRefreshed) {
                        this.formGroup.controls['customerInfo'].enable();
                    }
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkSaveModalButton, 'isDisabled', !this.checkSaveModal());
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                }
                else {
                    this.saveQuoteModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                    this.save();
                }
            }
            else if (data.id === this.eventConstants['printModalClose']) {
                this.printModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
            }
            else if (data.id === this.eventConstants['documentQuoteView']) {
                this.quoteDocumentView(data.value);
            }
            else if (data.id === this.eventConstants['documentConfirmView']) {
                this.confirmDocumentView(data.value);
            }
            else if (data.id === this.eventConstants['summary']) {
                this.isCollapsedTr = !this.isCollapsedTr;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.campaignControl, 'hide', this.isCollapsedTr);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.schemeControl, 'hide', this.isCollapsedTr);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.multiProductControl, 'hide', this.isCollapsedTr);
            }
            else if (data.id === this.eventConstants['postOnCredit']) {
                this.post();
            }
            else if (data.id === this.eventConstants['quoteCalculate']) {
                if (this.transactionTypeInstance.endorsementType === 'ADD_ITEM') {
                    this.setItemNo();
                }
                this.transactionTypeInstance.isQuoteRatingDone = true;
                this.doRating();
            }
            else if (data.id === this.eventConstants['confirmAndPay']) {
                // this.doPayment(this.getPaymentInfoData());
                this.quoteValidate();
                //this.doImmediateSettlement();
            }
            else if (data.id === this.eventConstants['paymentOptionModalPay']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentoptionModal, 'modalKey', false);
                this.post();
            }
            else if (data.id === this.eventConstants['paymentOptionModalcancel']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentoptionModal, 'modalKey', false);
            }
            else if (data.id === this.eventConstants['onCreditModalClose']) {
                this.onCreditModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                this.navigateToHome();
            }
            else if (data.id === this.eventConstants['nominee']) {
                this.addDelNominee(data.value);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nominee, 'disableDelBtn', this.disableDelNominee);
            }
            else if (data.id === this.eventConstants['viewRelativeCoverages']) {
                let riskInfoArray: any = this.formGroup.controls['riskInfo'];
                let riskIndex = 0;
                if (data.value && data.value.superParentIndex !== undefined) riskIndex = data.value.superParentIndex;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSelectedCover, 'selectedRiskIndex', riskIndex);
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSelectedCover, 'plans', this.transactionTypeInstance.isPolicyRatingDone ? riskInfoArray.at(riskIndex).get('plans').value : this.transactionTypeInstance.transaction.configService.getCustom('policyLastMovementData')['plans']);
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSelectedCover, 'selectedPlanIndex', this.transactionTypeInstance.selectedCoverageIndex);
                this.viewPlansModal = true;
                this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                this.changeRef.markForCheck();
            }
            else if (data.id === this.eventConstants['onCreditModalNewQuote']) {
                this.setNewQuoteRoute();
                this.onCreditModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                this.changeRef.markForCheck();
                this.ngOnDestroy();
                this.formGroup.reset();
                this.changeRef.markForCheck();
                this.ngOnInit();
                this.changeRef.markForCheck();
                this.ngAfterContentInit();
                this.changeRef.markForCheck();
            }
            else if (data.id === this.eventConstants['quoteOnCreditModalNewQuote']) {
                this.setNewQuoteRoute();
                this.onCreditModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyFailureModal, 'modalKey', this.onCreditModal);
                this.changeRef.markForCheck();
                this.ngOnDestroy();
                this.formGroup.reset();
                this.changeRef.markForCheck();
                this.ngOnInit();
                this.ngAfterContentInit();
                this.changeRef.markForCheck();
            }
            else if (data.id === this.eventConstants['viewPlans']) {
                this.transactionTypeInstance.transaction.selectedRiskIndex = data.value;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansSectNoCompare, 'compareWith', this.transactionTypeInstance.transaction.selectedRiskIndex);
                this.viewPlansModal = true;
                this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                this.changeRef.markForCheck();
            }
            else if (data.id === this.eventConstants['closePlanModal']) {
                this.viewPlansModal = false;
                this.removeUnselectedPlan();
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansSectNoCompare, 'compareWith', '');
            }
            else if (data.id === this.eventConstants['doInsuredRefresh']) {
                this.doInsuredRefresh(data, this.isRiskLevelNominee, true);
            }
            else if (data.id === this.eventConstants['doCustomerRefresh']) {
                this.formGroup.controls['customerInfo'].get('identityNo').markAsDirty();
                this.formGroup.controls['customerInfo'].get('identityTypeCode').markAsDirty();
                this.doCustomerRefresh(this.formGroup.controls['customerInfo'], data.id);
            }
            else if (data.id === this.eventConstants['postalCodeRefresh']) {
                this.getPostalCodeRefresh();
            }
            else if (data.id === this.eventConstants['emailModal']) {
                this.getEmailTemplate();
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailquoteMessage, 'htmlString', this.formGroup.controls['emailQuotInfo'].value.reason);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkMailModalButton, 'isDisabled', !this.checkMailModal());
            }
            else if (data.id === this.eventConstants['doPolicyRatingBeforePosting']) {
                if (this.transactionTypeInstance.endorsementType === 'DELETE_ITEM') {
                    let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
                    for (let i = 0; i < riskInfoFormArray.length; i++) {
                        if (riskInfoFormArray.at(i).get('isItemDeleted').value !== true) {
                            riskInfoFormArray.removeAt(i);
                            i--;
                        }
                    }
                } else if (this.transactionTypeInstance.endorsementType === 'ADD_ITEM') {
                    let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
                    for (let i = 0; i < riskInfoFormArray.length; i++) {
                        if (riskInfoFormArray.at(i).get('isItemAdded').value !== true) {
                            riskInfoFormArray.removeAt(i);
                            i--;
                        }
                    }
                }
                this.doPolicyRatingBeforePosting();
            }
            else if (data.id === this.eventConstants['emailModalClose']) {
                this.emailModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
            }
            else if (data.id === this.eventConstants['successedEmailModalClose']) {
                this.emailSuccessModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailSuccessModalKey, 'modalKey', this.emailSuccessModal);
                this.navigateToHome();
            }
            else if (data.id === this.eventConstants['productBrochureclickId']) {
                this.productBrochureDocumentView();
            }
            else if (data.id === this.eventConstants['agentCodeRefresh']) {
                this.getAgentCodeRefresh();
            }
            else if (data.id === this.eventConstants['referModal']) {
                if (!this.formGroup.controls['referQuotInfo'].get('referTo').value) {
                    this.getToAddressForReferral();
                    this.referModal = true;
                } else {
                    this.referModal = true;
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
            }
            else if (data.id === this.eventConstants['referQuoteModalCancel']) {
                this.referModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
            }
            else if (data.id === this.eventConstants['successedreferModalClose']) {
                this.referModalkey = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralSuccessModalKey, 'modalKey', this.referModalkey);
                this.navigateToHome();
            }
            else if (data.id === this.eventConstants['referQuoteModalRefer']) {
                this.referQuote();
            }
            else if (data.id === this.eventConstants['removeItemDetail']) {
                this.doRemoveItemList(data.value);
                this.addItemMastertoWork(data.value);
                this.transactionTypeInstance.isPolicyRatingDone = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);
            }
            else if (data.id === this.eventConstants['risk']) {
                this.addDelRiskInfo(data.value);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'disableDelBtn', this.disableDelRisk);
            }
            else if (data.id === this.eventConstants['addItemDetail']) {
                this.addRiskInfo(data.value);
                let riskInfo = this.formGroup.controls['riskInfo'].value;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoNewArrayCompare, 'compareWith', riskInfo.length.toString());
                this.addItemModal = true;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addItemModalKey, 'modalKey', this.addItemModal);
            }
            else if (data.id === this.eventConstants['addItemDetailClose']) {
                let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
                riskInfoFormArray.removeAt(riskInfoFormArray.length - 1);
                this.addItemModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addItemModalKey, 'modalKey', this.addItemModal);
            }
            else if (data.id === this.eventConstants['addItemModalSave']) {
                this.setKeysForNominee();
                this.addItemDetails();
                this.addItemModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addItemModalKey, 'modalKey', this.addItemModal);
            } else if (data.id === this.eventConstants['closePostingFailedModal']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyFailureModal, 'modalKey', false);
                this.changeRef.markForCheck();
                this.navigateToHome();
            }
            else if (data.id === this.eventConstants['addItemCoverage']) {
                this.addDeleteItemCoverage(data, 'add');
            }
            else if (data.id === this.eventConstants['deleteItemCoverage']) {
                this.addDeleteItemCoverage(data, 'del');
            } else if (data.id === this.eventConstants['callMultiItemDefaulting']) {
                this.multiItemDefaulting(data);
            } else if (data.id === this.eventConstants['comparePlans']) {
                this.comparePlans(data);
            }
            // if(data.id === 'deleteItemDetail'){
            //     this.deleteItemFromWork(data.value);
            //     this.transactionTypeInstance.isPolicyRatingDone = false;
            // }
            else if (data.id !== this.eventConstants['onCreditModalNewQuote']) {
                this.changeRef.detectChanges();
            }
             else if (data.id !== this.eventConstants['quoteOnCreditModalNewQuote']) {
                this.changeRef.detectChanges();
            }
        }
        });
    }

    public doInsuredRefresh(data, isRiskLevel: boolean = false, markAsDirtyFlag: boolean = false) {
        if (!this.multiItemFlag) {
            let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
            let tempRiskInfoGroup = tempRiskInfoArray.at(0);
            let tempInsuredGroup: FormGroup = <FormGroup>tempRiskInfoGroup;
            if (markAsDirtyFlag) {
                tempInsuredGroup.controls['identityNo'].markAsDirty();
                tempInsuredGroup.controls['identityTypeCode'].markAsDirty();
            }
            this.doCustomerRefresh(tempInsuredGroup, data.id);
        }
        else {
            let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
            let parentIndexValue = data.value.superParentIndex !== undefined ? data.value.superParentIndex : data.value.parentIndex;
            let tempRiskInfoGroup = tempRiskInfoArray.at(parentIndexValue);
            if (isRiskLevel === false) {
                let tempInsuredArray: FormArray = <FormArray>tempRiskInfoGroup.get('insuredList');
                let indexValue = data.value.parentIndex > -1 ? data.value.parentIndex : data.value.index;
                let tempInsuredGroup: FormGroup = <FormGroup>tempInsuredArray.at(indexValue);
                if (markAsDirtyFlag) {
                    tempInsuredGroup.controls['identityNo'].markAsDirty();
                    tempInsuredGroup.controls['identityTypeCode'].markAsDirty();
                }
                this.doCustomerRefresh(tempInsuredGroup, data.id);
            } else {
                if (markAsDirtyFlag) {
                    tempRiskInfoGroup.get('identityNo').markAsDirty();
                    tempRiskInfoGroup.get('identityTypeCode').markAsDirty();
                }
                this.doCustomerRefresh(tempRiskInfoGroup, data.id);
            }
        }
    }

    insuredDetails(data?) {
        let FName = this.formGroup.controls['customerInfo'].get('appFName').value;
        let LName = this.formGroup.controls['customerInfo'].get('appLName').value;
        let identityTypeCode = this.formGroup.controls['customerInfo'].get('identityTypeCode').value;
        let identityTypeDesc = this.formGroup.controls['customerInfo'].get('identityTypeDesc').value;
        let identityNo = this.formGroup.controls['customerInfo'].get('identityNo').value;
        let dob = this.formGroup.controls['customerInfo'].get('DOB').value;
        let appUnitNumber = this.formGroup.controls['customerInfo'].get('appUnitNumber').value;
        let mobilePh = this.formGroup.controls['customerInfo'].get('mobilePh').value;
        let emailId = this.formGroup.controls['customerInfo'].get('emailId').value;
        let riskTempFormGroup: any = this.formGroup.controls['riskInfo'];
        let tempFormGroup: any = riskTempFormGroup;
        if (this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value) {
            tempFormGroup.at(0).get('appFName').setValue(FName);
            tempFormGroup.at(0).get('appFName').updateValueAndValidity();
            tempFormGroup.at(0).get('appLName').setValue(LName);
            tempFormGroup.at(0).get('appLName').updateValueAndValidity();
            tempFormGroup.at(0).get('identityTypeCode').setValue(identityTypeCode);
            tempFormGroup.at(0).get('identityTypeCode').updateValueAndValidity();
            tempFormGroup.at(0).get('identityTypeDesc').setValue(identityTypeDesc);
            tempFormGroup.at(0).get('identityTypeDesc').updateValueAndValidity();
            tempFormGroup.at(0).get('identityNo').setValue(identityNo);
            tempFormGroup.at(0).get('identityNo').updateValueAndValidity();
            tempFormGroup.at(0).get('DOB').setValue(dob);
            tempFormGroup.at(0).get('DOB').updateValueAndValidity();
            tempFormGroup.at(0).get('appUnitNumber').setValue(appUnitNumber);
            tempFormGroup.at(0).get('appUnitNumber').updateValueAndValidity();
            tempFormGroup.at(0).get('mobilePh').setValue(mobilePh);
            tempFormGroup.at(0).get('mobilePh').updateValueAndValidity();
            tempFormGroup.at(0).get('emailId').setValue(emailId);
            tempFormGroup.at(0).get('emailId').updateValueAndValidity();
            tempFormGroup.at(0).get('relationWithAppDesc').patchValue('Self');
            tempFormGroup.at(0).get('relationWithAppDesc').updateValueAndValidity();
            tempFormGroup.at(0).get('relationWithAppCode').patchValue('R01');
            tempFormGroup.at(0).get('relationWithAppCode').updateValueAndValidity();
            this.disabledInsuredData = tempFormGroup.at(0).value;
            this.changeRef.markForCheck();
            tempFormGroup.at(0).get('appFName').disable();
            tempFormGroup.at(0).get('appLName').disable();
            tempFormGroup.at(0).get('identityTypeCode').disable();
            tempFormGroup.at(0).get('identityTypeDesc').disable();
            tempFormGroup.at(0).get('identityNo').disable();
            tempFormGroup.at(0).get('DOB').disable();
            tempFormGroup.at(0).get('appUnitNumber').disable();
            tempFormGroup.at(0).get('mobilePh').disable();
            tempFormGroup.at(0).get('emailId').disable();
            tempFormGroup.at(0).get('relationWithAppDesc').disable();
            tempFormGroup.at(0).get('relationWithAppCode').disable();
        }
        else if (this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value === false) {
            tempFormGroup.at(0).get('appFName').setValue('');
            tempFormGroup.at(0).get('appFName').updateValueAndValidity();
            tempFormGroup.at(0).get('appLName').setValue('');
            tempFormGroup.at(0).get('appLName').updateValueAndValidity();
            tempFormGroup.at(0).get('identityTypeCode').setValue('');
            tempFormGroup.at(0).get('identityTypeCode').updateValueAndValidity();
            tempFormGroup.at(0).get('identityTypeDesc').setValue('');
            tempFormGroup.at(0).get('identityTypeDesc').updateValueAndValidity();
            tempFormGroup.at(0).get('identityNo').setValue('');
            tempFormGroup.at(0).get('identityNo').updateValueAndValidity();
            tempFormGroup.at(0).get('DOB').setValue('');
            tempFormGroup.at(0).get('DOB').updateValueAndValidity();
            tempFormGroup.at(0).get('appUnitNumber').setValue('');
            tempFormGroup.at(0).get('appUnitNumber').updateValueAndValidity();
            tempFormGroup.at(0).get('mobilePh').setValue('');
            tempFormGroup.at(0).get('mobilePh').updateValueAndValidity();
            tempFormGroup.at(0).get('emailId').setValue('');
            tempFormGroup.at(0).get('emailId').updateValueAndValidity();
            tempFormGroup.at(0).get('relationWithAppDesc').patchValue('');
            tempFormGroup.at(0).get('relationWithAppDesc').updateValueAndValidity();
            tempFormGroup.at(0).get('relationWithAppCode').patchValue('');
            tempFormGroup.at(0).get('relationWithAppCode').updateValueAndValidity();
            this.disabledInsuredData = tempFormGroup.at(0).value;
            tempFormGroup.at(0).enable();
        }
    }

    saveQuoteModalValidation() {
        this.formGroup = this.validator.setPAQuotInsuredModalValidator(this.formGroup);
    }
    public validatePlanDetail(dataValInput) {
        let isValidPlan: boolean = false;
        let tempFormGroup;
        tempFormGroup = this.formGroup.controls['riskInfo'];
        if (this.multiItemFlag === true) isValidPlan = true;
        else {
            if (tempFormGroup.length > 0) {
                let i = 0;
                dataValInput.riskInfo[0].plans.forEach(element => {
                    if (tempFormGroup.at(0).controls['plans'].at(i).value.isPlanSelected) {
                        isValidPlan = true;
                        this.formGroup.controls['summaryInfo'].patchValue(tempFormGroup.at(0).controls['plans'].at(i).value.summaryInfo);
                        this.formGroup.controls['summaryInfo'].updateValueAndValidity();
                    }
                    i++;
                });
            }
        }
        return isValidPlan;
    }
    public checkSaveModal() {
        return (this.formGroup.get('customerInfo').get('appFName').valid &&
            this.formGroup.get('customerInfo').get('appLName').valid &&
            this.formGroup.get('customerInfo').get('mobilePh').valid &&
            this.formGroup.get('customerInfo').get('identityNo').valid &&
            this.formGroup.get('customerInfo').get('identityTypeCode').valid &&
            this.formGroup.get('customerInfo').get('DOB').valid &&
            this.formGroup.get('customerInfo').get('mobilePh').valid &&
            this.formGroup.get('customerInfo').get('emailId').valid);
    }
    /**
     * Loads product json , sets QuoteFormData, calls defaultvalues class and does basic details validations one getProductSetup response comes
     * @return {void} 
     */
    public quoteFormDataInit(): void {
        this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
        let lobObject: any = this.transactionTypeInstance.transaction.getLOBDetailsByLOBCode()[this.productCode];
        let productCode = lobObject.productCd;
        let templateName = lobObject.templateName;
        this.productCode = productCode;
        if (lobObject.doShowZeroPlanPrems) this.doShowZeroPlanPrems = lobObject.doShowZeroPlanPrems;
        this.multiItemFlag = lobObject['multiItemFlag'];
        this.isNominee = lobObject['isNominee'];
        this.isRiskLevelNominee = lobObject['isRiskLevelNominee'];

        this.addBreadCrumbRoute();
        if (this.transactionTypeInstance.isPolicyFlag) this.transactionTypeInstance.overrideEndorsementElements = lobObject['overrideEndorsementElements'];
        let productJSON = this.transactionTypeInstance.getProductJSON(productCode, templateName);
        productJSON.subscribe((data) => {
            this.isError = false;
            if (data.error !== undefined && data.error.length > 0) this.transactionTypeInstance.handleFileNotFound();
            if (data.errCode === '404') {
                this.errors.push(data);
                this.isError = true;
                return;
            } else {
                this.formData = data;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.formName, 'formName', this.formGroup);
            }
            let defaultValues: Object = lobObject['DEFAULT_VALUES'];
            this.ncpFormService.loadedSub.subscribe((mainFormGroup: FormGroup) => {
                if (mainFormGroup) {
                    this.formGroup = mainFormGroup;
                    if (this.transactionTypeInstance.transaction.useLegacy === true) {
                        if (this.transactionTypeInstance.isPolicyFlag === false && !this.transactionTypeInstance.isRenewalFlag) {
                            this.formGroup = this.defaultValue.setPAQuoteDefaultValues(this.formGroup, this.transactionTypeInstance.transaction.productCode, defaultValues);
                        }
                    } else {
                        //  + calling doPopulateFormGroup(Object, FormGroup) only to update formGroup with default values received
                        //  from productSetup JSON primarily used to default the hidden elements ( fields not present in screen)
                        this.formGroup = this.doPopulateFormGroup(defaultValues, this.formGroup);
                    }
                    this.coverDateChanged();
                    if (this.transactionTypeInstance.transaction.useLegacy === true) {
                        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) this.formGroup = this.validator.setPAQuotValidatorBasicDetails(this.formGroup, productCode);
                    }
                    this.fetchOpenheldData();
                    if (this.multiItemFlag) this.policytyepSelected(this.formGroup.controls['policyInfo'].get('policyTerm').value);
                    this.setItemNo();
                    this.transactionTypeInstance.setDeclarations();
                    this.setSalesLoginValidator();
                    this.updateElements();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            });
            this.changeRef.markForCheck();
            if (productJSON.observers && productJSON.observers.length > 0) {
                productJSON.observers.pop();
            }
        });
    }

    public getDefaultValuesInstance() {
        return new PADefaultValue(this.transactionTypeInstance.transaction.configService);
    }
    public getQuoteValidator() {
        return new PersonalAccidentQuoteValidator();
    }
    public getPolicyValidator() {
        return new PersonalAccidentPolicyValidator();
    }

    // + Quote Specific Methods
    public saveQuote() {
        this.createAndSaveCustomer(true);
    }
    public postQuote() {
        this.createAndSaveCustomer(false);
    }
    public createAndSaveCustomer(isSave: boolean) {
        let riskTempFormGroup: any = this.formGroup.controls['riskInfo'];

        if (!this.multiItemFlag) {
            let tempFormGroup: any = riskTempFormGroup;
            let inputDataCustomer;
            if (this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value) {
                tempFormGroup.at(0).enable();
                inputDataCustomer = this.formGroup.get('customerInfo').value;
                //tempFormGroup.at(0).patchValue(this.disabledInsuredData);
            }
            else {
                inputDataCustomer = tempFormGroup.at(0).value;
                inputDataCustomer.policyHolderType = 'I';
            }
            if (inputDataCustomer.appCode !== null && inputDataCustomer.appCode !== undefined && inputDataCustomer.appCode !== '') {
                this.createCustomer(false, isSave, this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value, inputDataCustomer);
            } else {
                this.createCustomer(true, isSave, this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value, inputDataCustomer);
            }
        } else {
            this.createMultipleCustomers(this.formGroup, isSave);
        }
    }
    createCustomer(isCreate: boolean, isSave: boolean, isInsured: boolean = false, dataInput) {
        let addCustomerResponse: any;
        if (isCreate) {
            addCustomerResponse = this.customerService.addNewCustomer({ customerInfo: dataInput });
        } else {
            addCustomerResponse = this.customerService.updateCustomerDetails({ customerInfo: dataInput });
        }
        addCustomerResponse.subscribe(
            (customerInfoDataVal) => {
                if (customerInfoDataVal && customerInfoDataVal.error !== null && customerInfoDataVal.error !== undefined && customerInfoDataVal.error.length >= 1) {
                    this.updateErrorObject(customerInfoDataVal);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.isError = false;
                    let riskTempFormGroup: any = this.formGroup.controls['riskInfo'];
                    if (customerInfoDataVal.customerInfo) {
                        if (isInsured) {
                            this.formGroup.controls['customerInfo'].patchValue(customerInfoDataVal.customerInfo);
                            this.formGroup.controls['customerInfo'].updateValueAndValidity();
                        }
                        this.formGroup.controls['customerInfo'].get('appCode').patchValue(customerInfoDataVal.customerInfo.appCode);
                        riskTempFormGroup.at(0).patchValue(customerInfoDataVal.customerInfo);
                        riskTempFormGroup.at(0).updateValueAndValidity();
                    }
                    if (isSave) {
                        this.quoteSaveOpenheld();
                    } else {
                        this.quotPostOnCredit();
                    }
                }
            });
    }

    public doPatchDisabledInsuredData() {
        this.formGroup.controls['customerInfo'].get('policyHolderType').patchValue('I');
        // + patch relationshipToInsuredDesc and relationshipToInsuredCode to the disabledInsuredData
        if (this.transactionTypeInstance.transaction.status !== 'Enquiry' && this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value) {
            let riskTempFormGroup: any = this.formGroup.controls['riskInfo'];
            let tempFormGroup: any = riskTempFormGroup;
            this.disabledInsuredData.beneficiaryName = tempFormGroup.at(0).get('beneficiaryName').value;
            this.disabledInsuredData.relationshipToInsuredCode = tempFormGroup.at(0).get('relationshipToInsuredCode').value;
            this.disabledInsuredData.relationshipToInsuredDesc = tempFormGroup.at(0).get('relationshipToInsuredDesc').value;
        }
        // - patch relationshipToInsuredDesc and relationshipToInsuredCode to the disabledInsuredData
    }

    public addDelNominee(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempRiskInfoGroup = tempRiskInfoArray.at(data.parentIndex);
        let tempInsuredGroup;
        /*if (!this.multiItemFlag) {
            let tempInsuredArray: FormArray = <FormArray>tempRiskInfoGroup.get('insuredList');
            tempInsuredGroup = <FormGroup>tempInsuredArray.at(data.parentIndex);
        } else {*/
        tempInsuredGroup = tempRiskInfoGroup;
        //}
        if (data.type === 'add') {
            let tempNomineeList: FormArray = <FormArray>tempInsuredGroup.get('nomineeList');
            tempNomineeList.push(this.validator.setPAQuotNomineeValidators(this.transactionTypeInstance.transaction.nomineeDetail.getNomineeInfo()));
            if (tempNomineeList.length > 1) {
                this.disableDelNominee = true;
            } else {
                this.disableDelNominee = false;
            }
        }
        if (data.type === 'del') {
            let tempNomineeList: FormArray = <FormArray>tempInsuredGroup.get('nomineeList');
            tempNomineeList.removeAt(data.index);
            if (tempNomineeList.length > 1) {
                this.disableDelNominee = true;
            } else {
                this.disableDelNominee = false;
            }
        }
        this.setKeysForNominee();
    }

    public setKeysForNominee() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        for (let j = 0; j < tempRiskInfoArray.length; j++) {
            let tempRiskInfoGroup = tempRiskInfoArray.at(j);
            /*if (!this.multiItemFlag) {
                let tempInsuredArray: FormArray = <FormArray>tempRiskInfoGroup.get('insuredList');
                tempInsuredArray.controls.forEach(element => {
                    let nomineeList: FormArray = <FormArray>element.get('nomineeList');
                    nomineeList.controls.forEach((ele, index) => {
                        ele.get('appFullName').setValue(ele.get('appFName').value + ' ' + ele.get('appLName').value);
                        ele.get('key').setValue(index + 1);
                    });
                })
            } else {*/
            let tempInsuredArray: FormArray = <FormArray>tempRiskInfoGroup.get('nomineeList');
            tempInsuredArray.controls.forEach((ele, index) => {
                ele.get('appFullName').setValue(ele.get('appFName').value + ' ' + ele.get('appLName').value);
                ele.get('key').setValue(index + 1);
            });
            //}
        }
    }

    validateNominee(): boolean {
        if (this.isNominee) {
            if (this.isRiskLevelNominee) {
                return this.isValidateNomineeInRisk();
            } else {
                return this.isValidateNominee();
            }
        } else {
            return true;
        }
    }

    setNominees() {
        if (!this.transactionTypeInstance.hasStatusNew) {
            let dataObj = this.transactionTypeInstance.transaction.configService.getCustom(this.transactionTypeInstance.openHeldDataStorageString);
            let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
            let tempRiskInfoGroup = tempRiskInfoArray.at(0);
            /*if (!this.multiItemFlag) {
                let tempInsuredArray: FormArray = <FormArray>tempRiskInfoGroup.get('insuredList');
                if (dataObj !== undefined) {
                    if (tempInsuredArray.controls.length > 1) {
                        let len = tempInsuredArray.controls.length;
                        for (let i = 0; i < len; i++) {
                            tempInsuredArray.removeAt(tempInsuredArray.controls.length - 1);
                        }
                    }
                    dataObj.riskInfo[0].insuredList.forEach((element, i) => {
                        if (i > 0) {
                            tempInsuredArray.push(this.validator.setPAQuotInsuredValidators(this.transactionTypeInstance.transaction.insured.getPAInsuredInfoModel()))
                        }
                        if (element['nomineeList'] && element['nomineeList'].length > 1) {
                            let nomineeArray: FormArray = <FormArray>tempInsuredArray.at(i).get('nomineeList');
                            nomineeArray.removeAt(0);
                            element['nomineeList'].forEach(ele => {
                                nomineeArray.push(this.validator.setPAQuotNomineeValidators(this.transactionTypeInstance.transaction.nomineeDetail.getNomineeInfo()));
                                if (this.transactionTypeInstance.transaction.isEnquiryFlag) nomineeArray.disable();
                            });
                        }
                    });
                    tempInsuredArray.patchValue(dataObj.riskInfo[0].insuredList);
                }
            } else {*/
            dataObj.riskInfo.forEach((riskEle, ri) => {
                let tempInsuredArray: FormArray = <FormArray>tempRiskInfoArray.at(ri).get('nomineeList');
                riskEle.nomineeList.forEach((element, i) => {
                    if (i > 0) {
                        tempInsuredArray.push(this.validator.setPAQuotNomineeValidators(this.transactionTypeInstance.transaction.nomineeDetail.getNomineeInfo()));
                        if (this.transactionTypeInstance.transaction.isEnquiryFlag) tempInsuredArray.disable();
                    }
                });
                tempInsuredArray.patchValue(riskEle.nomineeList);
            });

            // }
        }
    }

    policytyepSelected(value?) {
        if (value === '01') {
            this.isPolicyTypeAnnual = true;
            this.formGroup.controls['policyInfo'].get('policyTermDesc').patchValue('Annual Trip');
            this.formGroup.controls['policyInfo'].get('policyTermDesc').updateValueAndValidity();
        } else {
            this.formGroup.controls['policyInfo'].get('policyTermDesc').patchValue('Single Trip');
            this.formGroup.controls['policyInfo'].get('policyTermDesc').updateValueAndValidity();
            this.isPolicyTypeAnnual = false;
            if (this.transactionTypeInstance.transaction.status !== 'EndEnquiry' && this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                this.formGroup.controls['policyInfo'].get('durationInDays').reset();
                this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(1);
                this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
                this.setCoverDates();
            }
        }
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyInfoCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermShort);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coverDateCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermAnnul);

    }

    public setUnsetRatingFlag() {
        let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
        let ratingFlag = policyNo ? true : false;
        this.formGroup.controls['policyInfo'].get('ratingFlag').setValue(ratingFlag);
    }

    public setCustomerDetails() {
        let riskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        this.formGroup.get('customerInfo').get('DOB').setValue(riskArray.at(0).get('DOB').value);
        this.formGroup.get('customerInfo').get('appFName').setValue(riskArray.at(0).get('appFName').value);
        this.formGroup.get('customerInfo').valueChanges.subscribe(data => {
            riskArray.at(0).get('appFName').setValue(data['appFName']);
            riskArray.at(0).get('appLName').setValue(data['appLName']);
            riskArray.at(0).get('DOB').setValue(data['DOB']);
            riskArray.at(0).get('identityNo').setValue(data['identityNo']);
            riskArray.at(0).get('identityNo').setValue(data['identityNo']);
            riskArray.at(0).get('identityTypeCode').setValue(data['identityTypeCode']);
            riskArray.at(0).get('identityTypeDesc').setValue(data['identityTypeDesc']);
            riskArray.at(0).get('mobilePh').setValue(data['mobilePh']);
            riskArray.at(0).get('emailId').setValue(data['emailId']);
        });
    }
    updateInfoValue(dataInput) {
        if (dataInput.summaryInfo !== null && dataInput.summaryInfo !== undefined) {
            this.formGroup.controls['summaryInfo'].patchValue(dataInput.summaryInfo);
            this.formGroup.controls['summaryInfo'].updateValueAndValidity();
        }
        if (!this.transactionTypeInstance.hasStatusNew) {
            if (dataInput.customerInfo !== null && dataInput.customerInfo !== undefined) {
                this.formGroup.controls['customerInfo'].patchValue(dataInput.customerInfo);
                this.formGroup.controls['customerInfo'].updateValueAndValidity();
            }
        }
        if (dataInput.policyInfo !== null && dataInput.policyInfo !== undefined) {
            this.formGroup.controls['policyInfo'].patchValue(dataInput.policyInfo);
            this.formGroup.controls['policyInfo'].updateValueAndValidity();
        }
        // let isCalledOnlyForEndorsement = this.transactionTypeInstance.isPolicyFlag && !this.transactionTypeInstance.isPolicyHeld;
        let isCalledOnlyForEndorsement = this.transactionTypeInstance.isPolicyFlag;
        this.formGroup.controls['riskInfo'] = this.updatePlanDatas(dataInput, isCalledOnlyForEndorsement);
        this.updateRiskDetails();
        //if (this.transactionTypeInstance.isPolicyFlag) this.setInsuredList();
        this.formGroup.controls['riskInfo'].updateValueAndValidity();
        if (dataInput.documentInfo) {
            this.formGroup.controls['documentInfo'] = this.updateDocumentInfo(dataInput);
            this.formGroup.controls['documentInfo'].updateValueAndValidity();
        }
        if (dataInput.referralHistoryInfo) {
            this.formGroup.controls['referralHistoryInfo'] = this.updateReferralHistoryInfo(dataInput);
            this.formGroup.controls['referralHistoryInfo'].updateValueAndValidity();
        }
        this.changeRef.markForCheck();
        return this.formGroup;
    }
    public updateRiskDetails(doItemUpload: boolean = false) {
        if (!this.transactionTypeInstance.hasStatusNew || doItemUpload) {
            let dataObj = this.transactionTypeInstance.transaction.configService.getCustom(this.transactionTypeInstance.openHeldDataStorageString);
            let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
            dataObj.riskInfo.forEach((riskEle, ri) => {
                if (ri > tempRiskInfoArray.length - 1) tempRiskInfoArray.push(this.transactionTypeInstance.transaction.riskInfo.getPARiskInfoModel());
                let tempRiskInfoGroup = tempRiskInfoArray.at(ri);

                if (!this.isRiskLevelNominee) {
                    let tempInsuredInfoArray = <FormArray>tempRiskInfoGroup;
                    //  tempRiskInfoGroup.get('numOfInsured').patchValue(tempInsuredInfoArray.length);
                    if (riskEle) {
                        riskEle.forEach((insuredEle, ii) => {
                            if (ii > tempInsuredInfoArray.length - 1) tempInsuredInfoArray.push(this.transactionTypeInstance.transaction.insured.getInsuredInfoModel());
                            let tempInsuredInfoGroup = tempInsuredInfoArray.at(ii);
                            let tempNomineeInfoGroup = <FormArray>tempInsuredInfoGroup.get('nomineeList');
                            if (insuredEle.nomineeList) {
                                insuredEle.nomineeList.forEach((nomEle, ni) => {
                                    if (ni > tempNomineeInfoGroup.length - 1) tempNomineeInfoGroup.push(this.transactionTypeInstance.transaction.nomineeDetail.getNomineeInfo());
                                });
                                tempNomineeInfoGroup.patchValue(insuredEle.nomineeList);
                            }
                        });
                        tempInsuredInfoArray.patchValue(riskEle);
                    }
                } else {
                    let tempNomineeInfoGroup = <FormArray>tempRiskInfoGroup.get('nomineeList');
                    if (riskEle.nomineeList) {
                        riskEle.nomineeList.forEach((nomEle, ni) => {
                            if (ni > tempNomineeInfoGroup.length - 1) tempNomineeInfoGroup.push(this.transactionTypeInstance.transaction.nomineeDetail.getNomineeInfo());
                        });
                        tempNomineeInfoGroup.patchValue(riskEle.nomineeList);
                    }
                }
            });
            tempRiskInfoArray.patchValue(dataObj.riskInfo);
        }
    }

    // updateMultiRisk(riskArray) {
    //     this.hasSpouse.setValue(riskArray[0]['hasSpouse']);
    //     this.numberofChildren.setValue(riskArray[0]['numberofChildren']);
    //     this.formGroup.get('riskInfo').patchValue(riskArray);
    // }
    public getRiskInfoModel() {
        return this.transactionTypeInstance.transaction.riskInfo.getPARiskInfoModel();
    }
    public addDelRiskInfo(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        if (data.type === 'add') {
            let riskInfoModel = this.transactionTypeInstance.transaction.riskInfo.getPARiskInfoModel();
            riskInfoModel.get('isItemAdded').patchValue(true);
            riskInfoModel.get('isItemDeleted').patchValue(false);
            tempRiskInfoArray.push(this.validator.setPAIRiskValidator(riskInfoModel, false, this.multiItemFlag));
            this.setItemNo();
            this.addItemDetails();
        }
        if (data.type === 'del') {
            tempRiskInfoArray.removeAt(data.index);
            this.setItemNo();
            this.deleteItemDetails()
        }
        if (tempRiskInfoArray.length > 1) {
            this.disableDelRisk = true;
        } else {
            this.disableDelRisk = false;
        }
    }
    public addRiskInfo(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let riskInfoModel = this.transactionTypeInstance.transaction.riskInfo.getPARiskInfoModel();
        riskInfoModel.get('isItemAdded').patchValue(true);
        riskInfoModel.get('isItemDeleted').patchValue(false);
        tempRiskInfoArray.push(riskInfoModel);
        //tempRiskInfoArray.push(this.validator.setQuoteRiskValidators(riskInfoModel));
        let temp = this.validator.setPAIRiskValidator(tempRiskInfoArray.at(tempRiskInfoArray.length - 1), false, this.multiItemFlag);
        tempRiskInfoArray.removeAt(tempRiskInfoArray.length - 1);
        tempRiskInfoArray.insert(tempRiskInfoArray.length, temp);
        this.changeRef.markForCheck();
        for (let i = 0; i < tempRiskInfoArray.length; i++) {
            let tempRiskInfoGroup = tempRiskInfoArray.at(i);
            tempRiskInfoGroup.get('key').patchValue(String(i + 1));
        }
    }

    public setCustomerDetailFromInsured() {
        let appFName = this.riskInfoGroup.get('appFName').value;
        let appLName = this.riskInfoGroup.get('appLName').value;
        let appFullName = appFName + ' ' + appLName;
        let identityTypeCode = this.riskInfoGroup.get('identityTypeCode').value;
        let identityTypeDesc = this.riskInfoGroup.get('identityTypeDesc').value;
        let identityNo = this.riskInfoGroup.get('identityNo').value;
        let DOB = this.riskInfoGroup.get('DOB').value;
        let age = this.riskInfoGroup.get('age').value;
        let appUnitNumber = this.riskInfoGroup.get('appUnitNumber').value;
        let mobilePh = this.riskInfoGroup.get('mobilePh').value;
        let homePh = this.riskInfoGroup.get('homePh').value;
        let emailId = this.riskInfoGroup.get('emailId').value;
        if ((this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I') && this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value) {
            this.formGroup.controls['customerInfo'].get('appFName').setValue(appFName);
            this.formGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('appLName').setValue(appLName);
            this.formGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('appFullName').setValue(appFullName);
            this.formGroup.controls['customerInfo'].get('appFullName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('identityTypeCode').setValue(identityTypeCode);
            this.formGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('identityTypeDesc').setValue(identityTypeDesc);
            this.formGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('identityNo').setValue(identityNo);
            this.formGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('DOB').setValue(DOB);
            this.formGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('age').setValue(age);
            this.formGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('appUnitNumber').setValue(appUnitNumber);
            this.formGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('mobilePh').setValue(mobilePh);
            this.formGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('homePh').setValue(homePh);
            this.formGroup.controls['customerInfo'].get('homePh').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('emailId').setValue(emailId);
            this.formGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        }
        this.patchInsuredDetails();
        this.setKeysForNominee();
    }

    patchInsuredDetails() {
        let riskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        for (let j = 0; j < riskInfoArray.length; j++) {
            let tempRiskFormGroup = riskInfoArray.at(j);
            let insuredFormArray: FormArray = <FormArray>tempRiskFormGroup;
            if (this.multiItemFlag) {
                let fullName = riskInfoArray.at(j).get('appFName').value + ' ' + riskInfoArray.at(j).get('appLName').value;
                riskInfoArray.at(j).get('appFullName').setValue(fullName);
                riskInfoArray.at(j).get('appFullName').updateValueAndValidity();
            } else {
                for (let i = 0; i < insuredFormArray.length; i++) {
                    let fullName = insuredFormArray.at(i).get('appFName').value + ' ' + insuredFormArray.at(i).get('appLName').value;
                    insuredFormArray.at(i).get('appFullName').setValue(fullName);
                    insuredFormArray.at(i).get('appFullName').updateValueAndValidity();
                    insuredFormArray.at(i).get('appFName').setValue(insuredFormArray.at(i).get('appFName').value);
                    insuredFormArray.at(i).get('appFName').updateValueAndValidity();
                    insuredFormArray.at(i).get('appLName').setValue(insuredFormArray.at(i).get('appLName').value);
                    insuredFormArray.at(i).get('appLName').updateValueAndValidity();
                    insuredFormArray.at(i).get('identityNo').setValue(insuredFormArray.at(i).get('identityNo').value);
                    insuredFormArray.at(i).get('identityNo').updateValueAndValidity();
                }
            }
        }

    }
    public disableSaveModal() {
        return (this.formGroup.get('customerInfo').get('appFName').value &&
            this.formGroup.get('customerInfo').get('appLName').value &&
            this.formGroup.get('customerInfo').get('mobilePh').value &&
            this.formGroup.get('customerInfo').get('identityNo').value &&
            this.formGroup.get('customerInfo').get('identityTypeCode').value &&
            this.formGroup.get('customerInfo').get('DOB').value &&
            this.formGroup.get('customerInfo').get('emailId').value)
    }

    public productBrochureDocumentView() {
        window.open("assets/pdf/productBrochurePdf.pdf");
    }

    patchNomineeshareValue() {
        let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        if (tempRiskArray && tempRiskArray.length > 0) {
            for (let i = 0; i < tempRiskArray.length; i++) {
                let nomineeList: FormArray = <FormArray>tempRiskArray.at(i).get('nomineeList');
                nomineeList.at(0).get('nomineeShare').patchValue('100');
            }
        }
    }

    public doSubscribeAfterFormGroupInit() {
        this.doInitRiskInfoGroup();
        this.setSelectedPlan();
        this.setKeysForNominee();
        this.transactionTypeInstance.transaction.subscribedMap['isAllDeclerationsEnabled'] = this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').valueChanges.subscribe(data => {
            this.doAgreeAllDeclerations(data);
        });
        this.setSelectedPlan();
        this.setKeysForNominee();
        this.formGroup.controls['customerInfo'].get('age').valueChanges.subscribe(data => {
            if (data || parseInt(data) === 0) {
                if (parseInt(data) < 18) {
                    this.formGroup.controls['customerInfo'].get('age').setErrors({ 'minNumber': true });
                    this.changeRef.markForCheck();
                } else {
                    if (parseInt(data) > 80) {
                        this.formGroup.controls['customerInfo'].get('age').setErrors({ 'maxNumber': true });
                        this.changeRef.markForCheck();
                    }
                    else {
                        this.formGroup.controls['customerInfo'].get('age').setErrors(null);
                        this.changeRef.markForCheck();
                    }
                }
            }
        });
        this.transactionTypeInstance.transaction.subscribedMap['isAllDeclerationsEnabled'] = this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').valueChanges.subscribe(data => {
            this.doAgreeAllDeclerations(data);
        });
    }
}
