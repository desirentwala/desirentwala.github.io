import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NCPFormUtilsService } from '../../../../core/ncp-forms/ncp.form.utils';
import { MaxNumberValidator } from '../../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { customerService } from '../../../customer/services/customer.service';
import { UserFormService } from '../../../userManagement';
import { ElementConstants } from '../../constants/ncpElement.constants';
import { PolicyTransactionService } from '../../services/policytransaction.service';
import { QuoteTransactionService } from '../../services/quotetransaction.service';
import { RenewalTransactionService } from '../../services/renewalTransaction.service';
import { TransactionComponent } from '../../transaction.component';
import { TravelDefaultValue } from './travel.defaultValues';
import { TravelPolicyValidator } from './travelPolicy.validator';
import { TravelQuoteValidator } from './travelQuote.validator';
import { Subject, takeUntil } from '@adapters/packageAdapter';

/**
 * Component Class for Travel Insurance related methods.
 * @implements OnInit, AfterContentInit, OnDestroy
 */

@Component({
    template: `
    <button-field *ngIf="isShowBackButton" buttonType="custom" buttonName="NCPBtn.back" buttonClass="ncpbtn-default mr0 t-34" (click)="goBackToPMOV()"></button-field>
    <ncp-errorHandler [isError]="isError" [errors]="errors" [errorInfo]="this.formGroup.get('errorInfo')?.value"> </ncp-errorHandler>
    <ncp-form *ngIf="formData" [formData]="formData"></ncp-form>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelComponent extends TransactionComponent implements OnInit, AfterContentInit, OnDestroy {
    // + flags
    public isInsuredChildRequired: boolean = false;
    public doRatingFlagCheckRequired: boolean = false;
    public isPolicyTypeAnnual: boolean = false;
    public isCoverTypeIndividual: boolean = false;
    public isHolderTypeIndividual: boolean = true;
    public isPaymentModeCheque: boolean = false;
    public isRatingFlag: boolean = false;
    public isQuoteErrorFlag: boolean = true;
    public isInsuredErrorFlag: boolean = true;
    public isReferralFlag: boolean = false;
    public isCollapsedTr: boolean = false;
    public disableDelRisk: boolean = false;
    public disableDelNominee: boolean = false;
    public isNomineeErrorFlag: boolean = true;
    public isRiskLevelNominee: boolean = false;
    public travellingToTableFlag: boolean = true;
    public isNominee: boolean = false;
    public insuredChildMaxAge: any = 18;
    // + Others
    confirmTableHeader: any[] = [];
    confirmTableMapping: any[] = [];
    customizedErrorListNoOfTravellers = { error: [{ errCode: '01', errDesc: 'Minimum Number of Travellers should be 2 for Family or Group ' }] };
    numberofInsureds: any[] = [0];
    pdfSource;
    public region: string = '';
    public travellerTypeCodeIndividual = 'IND';
    public quotInfoResponseVal;
    public revisedQuotInfoResponseVal;
    multiProductPrem: string = '0.00';
    campaignDiscount: string = '0.00';
    schemeDiscount: string = '0.00';
    excessControl = new FormControl(false);
    standardExcessCode = '';
    standardExcessDesc = '';
    excessCode = '';
    excessDesc = '';
    public policyNumber: any;
    numberOfAdults = 0;
    tabErrorFlag: boolean = true;
    called = 0;
    private ngUnsubscribe = new Subject();
    constructor(
        public ncpFormService: NCPFormUtilsService,
        public customerService: customerService,
        public formBuilder: FormBuilder,
        public changeRef: ChangeDetectorRef,
        public activeRoute: ActivatedRoute,
        public userService: UserFormService,
        public quoteComponent: QuoteTransactionService,
        public policyComponent: PolicyTransactionService,
        public renewalComponent: RenewalTransactionService) {
        super(ncpFormService,
            customerService,
            formBuilder,
            changeRef,
            activeRoute,
            userService,
            quoteComponent,
            policyComponent,
            renewalComponent);
        this.transactionTypeInstance.transaction.lobCode = 'TRAVEL';
    }
    // + LifeCycle & NG2Wizard related common methods
    ngOnInit() {
        let lobObject: any = this.transactionTypeInstance.transaction.utilService.get(this.transactionTypeInstance.transaction.lobCode);
        if (lobObject) this.quoteFormDataInit();
        else {
            this.transactionTypeInstance.transaction.utilService.loadedSub.subscribe(() => {
                this.quoteFormDataInit();
            });
        }
        if (this.transactionTypeInstance.transaction.useLegacy === true) {
            this.formGroup = this.transactionTypeInstance.transaction.quoteinfo.getTRLQuotInfoModel();
        } else {
            this.transactionTypeInstance.transaction.getProductMappingData().subscribe(mappings => {
                this.formGroup = this.doPopulateFormGroup(mappings, new FormGroup({}));
                this.transactionTypeInstance.transaction.setProxyModels();
                this.doSubscribeAfterFormGroupInit();
            });
        }
        this.transactionTypeInstance.transaction.subcribeToFormChanges(this.formGroup);
        this.doInitCommonWizardSub();
        this.transactionTypeInstance.transaction.modalCloseSub = this.transactionTypeInstance.transaction.eventHandlerService.modalCloseSub.subscribe((data) => {
            if (data.id === this.eventConstants['referralHistoryModalClose']) {
                this.referralHistoryModal = false;
            }
        });
        this.doInitChangeSub();
        this.doInitClickSub();
        if (this.transactionTypeInstance.transaction.getIsB2B()) {
            let partyDetailsResponse = this.userService.doCheckpartyid({ 'user_party_id': this.transactionTypeInstance.transaction.configService.getCustom('user_party_id') });
            partyDetailsResponse.subscribe((data) => {
                if (data.paymentTypeCode && data.paymentTypeDesc) {
                    let paymentType = this.transactionTypeInstance.transaction.configService.get(data.paymentTypeCode).toLowerCase();
                    if (paymentType === 'cash') {
                        this.transactionTypeInstance.transaction.payByCredit = false;
                    }
                }
                this.changeRef.detectChanges();
            });
        }
    }
    ngAfterContentInit() {
        this.transactionTypeInstance.transaction.configService.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.transactionTypeInstance.transaction.translate.use(this.transactionTypeInstance.transaction.configService.currentLangName);
            }
        });
        if (this.transactionTypeInstance.transaction.useLegacy === true) {
            this.doSubscribeAfterFormGroupInit();
        }
    }
    ngOnDestroy() {
        window.scrollTo(150, 150);
        this.transactionTypeInstance.transaction.doDestroyCommonWizardSub();
        this.transactionTypeInstance.transaction.doPopCommonWizardSub();
        this.setDefaultValues();
        this.disableDelRisk = false;
        this.disableDelNominee = false;
        this.isNomineeErrorFlag = true;
        this.isRiskLevelNominee = false;
        this.isNominee = false;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.transactionTypeInstance.transaction.logger.info('Subscription destroyed');
    }
    setDefaultValues() {
        this.isPolicyTypeAnnual = false;
        this.isCoverTypeIndividual = true;
        this.isHolderTypeIndividual = true;
        this.isPaymentModeCheque = false;
        this.region = '';
        this.errors = [];
        this.formData = null;
        // this.transactionTypeInstance.transaction.clickSub = null;
        this.transactionTypeInstance.transaction.configService.setCustom('currency_code', this.orginalCurrCode);
        this.transactionTypeInstance.transaction.setDefaultValues();
    }
    public doInitChangeSub() {
        this.transactionTypeInstance.transaction.changeSub = this.transactionTypeInstance.transaction.eventHandlerService.changeSub.subscribe((data) => {
            if (data.id) {
                if (typeof data.id === 'string') {
                    data.id = data.id.toLowerCase();
                }
                if (data.id === this.eventConstants['contentCodeChangeId']) {
                    this.setKeysForSubjectMatter();
                }
                if (data.id === this.eventConstants['covertypeSelection']) {
                    this.covertypeSelection();
                }
                else if (data.id === this.eventConstants['policyHolderTypeSelected']) {
                    if (this.transactionTypeInstance.transaction.status !== 'Enquiry') this.formGroup = this.validator.setTravelQuotInsuredValidator(this.formGroup);
                    this.policyHolderTypeSelected(data.value);
                }
                else if (data.id === this.eventConstants['setRegion']) {
                    this.setRegion(data.value);
                }
                else if (data.id === this.eventConstants['setCoverDates']) {
                    this.setCoverDates();
                }
                else if (data.id === this.eventConstants['coverDateChanged']) {
                    if (!this.transactionTypeInstance.transaction.isEnquiryFlag)
                        this.coverDateChanged();
                }
                else if (data.id === this.eventConstants['setInsuredDetails']) {
                    this.insuredDetails();
                }
                else if (data.id === this.eventConstants['documentContent']) {
                    this.getMimeTypedata(data.value);
                }
                else if (data.id === this.eventConstants['itemUpload']) {
                    this.doItemUpload(data.value.value || data.value)
                }
                else if (data.id === this.eventConstants['doCustomerRefresh']) {
                    this.doCustomerRefresh(this.formGroup.controls['customerInfo'], data.id);
                }
                else if (data.id === this.eventConstants['doInsuredRefresh']) {
                    this.doInsuredRefresh(data);
                }
                else if (data.id === this.eventConstants['postalCodeRefresh']) {
                    this.getPostalCodeRefresh();
                }
                else if (data.id === this.eventConstants['coverageChanged']) {
                    if (data.value.value !== this.transactionTypeInstance.selectedCoverageCode[data.value.superParentIndex]) {
                        this.transactionTypeInstance.isPolicyRatingDone = false;
                        this.transactionTypeInstance.selectedCoverageIndex = data.value.index ? data.value.index : 0;
                        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
                        let riskIndex = 0;
                        if (data.value && data.value.superParentIndex !== undefined) riskIndex = data.value.superParentIndex;
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteCalculate, 'isDisabled', false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSelectedCover, 'selectedPlanIndex', this.transactionTypeInstance.selectedCoverageIndex);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableListArrayViewButton, 'isDisabled', true);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSelectedCover, 'plans', this.transactionTypeInstance.isPolicyRatingDone ? riskInfoArray.at(riskIndex).get('plans').value : this.transactionTypeInstance.transaction.configService.getCustom('policyLastMovementData')['plans']);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);

                    }
                }
                else if (data.id === this.eventConstants['addItemNumOfInsured']) {
                    this.addDelIndividualInfo();
                }
                else if (data.id === this.eventConstants['coverTypeChanged']) {
                    this.coverTypeChanged(data);
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
                } else if (data.id === this.eventConstants['numOfInsured']) {
                    this.validateNoOfTravellers();
                    this.changeInNumOfInsured(data);
                }
            }
        });
    }
    public doInitClickSub() {
        this.transactionTypeInstance.transaction.clickSub = this.transactionTypeInstance.transaction.eventHandlerService.clickSub.subscribe((data) => {
            if (data.id) {
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
                    this.coverDateChanged(data.value);
                }
                else if (data.id === this.eventConstants['revisedTravelQuote']) {
                    this.revised();
                }
                else if (data.id === this.eventConstants['referModal']) {
                    if (!this.formGroup.controls['referQuotInfo'].get('referTo').value) {
                        this.getUserDetails();
                    }
                    this.referModal = true;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
                }
                else if (data.id === this.eventConstants['referModaladd']) {
                    this.addUploadComponent();
                }
                else if (data.id === this.eventConstants['referModaldelete']) {
                    this.deleteuploadDocument(data.value);
                }

                else if (data.id === this.eventConstants['successedreferModalClose']) {
                    this.referModalkey = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralSuccessModalKey, 'modalKey', this.referModalkey);
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
                else if (data.id === this.eventConstants['showEmailPdf']) {
                    this.emailPdfDocumentView();
                }
                else if (data.id === this.eventConstants['showprodBrochurePdf']) {
                    this.productBrochureDocumentView();
                }
                else if (data.id === this.eventConstants['emailModal']) {
                    this.getEmailTemplate();
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailquoteMessage, 'htmlString', this.formGroup.controls['emailQuotInfo'].value.reason);
                }
                else if (data.id === this.eventConstants['referralHistoryModalClose']) {
                    this.referralHistoryModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModalKey, 'modalKey', this.referralHistoryModal);
                }
                else if (data.id === this.eventConstants['referralHistory']) {
                    this.referralHistoryModal = true;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModalKey, 'modalKey', this.referralHistoryModal);
                }
                else if (data.id === this.eventConstants['printDocuments']) {
                    this.printModal = true;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
                }
                else if (data.id === this.eventConstants['printDocumentsClose']) {
                    this.printModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
                }
                else if (data.id === this.eventConstants['documentQuoteView']) {
                    this.quoteDocumentView(data.value);
                }
                else if (data.id === this.eventConstants['documentConfirmView']) {
                    this.confirmDocumentView(data.value);
                }
                else if (data.id === this.eventConstants['policyHolderTypeSelected']) {
                    if (this.transactionTypeInstance.transaction.status !== 'Enquiry') this.formGroup = this.validator.setTravelQuotInsuredValidator(this.formGroup);
                    this.policyHolderTypeSelected(data.value);
                }
                else if (data.id === this.eventConstants['summary']) {
                    this.isCollapsedTr = !this.isCollapsedTr;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.campaignControl, 'hide', this.isCollapsedTr);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.schemeControl, 'hide', this.isCollapsedTr);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.multiProductControl, 'hide', this.isCollapsedTr);
                }
                else if (data.id === this.eventConstants['postOnCredit']) {
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
                    this.quoteValidate();
                    //this.doImmediateSettlement();
                }
                else if (data.id === this.eventConstants['paymentOptionModalPay']) {

                    let amount;
                    amount = this.formGroup.controls['summaryInfo'].get('premiumPrime').value;
                    let paymentInfoData = {
                        'amount': amount,
                        'currency': 'SGD'
                    }
                    this.doPayment(paymentInfoData);
                    //  this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentoptionModal, 'modalKey', false);
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentGatewayModal, 'modalKey', true);
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.PaymentGatewayInfo, 'paymentInfo', paymentInfoData);
                    //  this.quotPostOnCredit();
                }
                else if (data.id === this.eventConstants['paymentOptionModalcancel']) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentoptionModal, 'modalKey', false);
                }
                else if (data.id === this.eventConstants['referQuoteModalCancel']) {
                    this.referModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
                }
                else if (data.id === this.eventConstants['referQuoteModalRefer']) {
                    this.referQuote();
                }
                else if (data.id === this.eventConstants['saveModalClose']) {
                    this.saveQuoteModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                    this.navigateToHome();
                }
                else if (data.id === this.eventConstants['saveModalSave']) {
                    this.saveQuoteModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                    this.patchInsuredDetails();
                    this.save();
                }
                else if (data.id === this.eventConstants['savedModalClose']) {
                    this.saveQuoteModal = false;
                    if (this.isCustomerRefreshed) {
                        this.disableCustomerInfo(this.formGroup.controls['customerInfo'], data.id);
                    }
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                }
                else if (data.id === this.eventConstants['emailModalClose']) {
                    this.emailModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
                }
                else if (data.id === this.eventConstants['successedEmailModalClose']) {
                    this.emailSuccessModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailSuccessModalKey, 'modalKey', this.emailSuccessModal);
                    this.changeRef.markForCheck();
                    this.navigateToHome();
                }
                else if (data.id === this.eventConstants['productBrochureclickId']) {
                    this.productBrochureDocumentView();
                }
                else if (data.id === this.eventConstants['emailQuoteModalMailSend']) {
                    this.emailModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
                    let to_Address = this.formGroup.controls['emailQuotInfo'].get('toAddress').value;
                    this.formGroup.controls['customerInfo'].get('emailId').patchValue(to_Address);
                    this.formGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();

                    let policySaveResponse = this.service.quoteSaveOpenheldInfo(this.formGroup.value);
                    policySaveResponse.subscribe((quotSaveInfo) => {
                        if (quotSaveInfo.error !== null && quotSaveInfo.error !== undefined && quotSaveInfo.error.length >= 1) {
                            this.updateErrorObject(quotSaveInfo);
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                        } else {
                            let tempFormGroupDoc;
                            let sentFormGroupDoc;
                            tempFormGroupDoc = this.formGroup.controls['documentInfo'].value;
                            let documentFormGroup: any = this.formGroup;
                            sentFormGroupDoc = tempFormGroupDoc;
                            let i = 0;
                            if (tempFormGroupDoc.length > 0) {
                                for (let j = 0; j < tempFormGroupDoc.length; j++) {
                                    tempFormGroupDoc[i].isDocumentSelected = false;
                                    documentFormGroup.controls['documentInfo'].at(i).get('isDocumentSelected').patchValue(false);
                                    documentFormGroup.controls['documentInfo'].at(i).get('isDocumentSelected').updateValueAndValidity();
                                    if (tempFormGroupDoc[j].dispatchType === 'EMAIL' && !sentFormGroupDoc[j].isDocumentSelected) {
                                        documentFormGroup.controls['documentInfo'].at(j).get('isDocumentSelected').patchValue(true);
                                        documentFormGroup.controls['documentInfo'].at(j).get('isDocumentSelected').updateValueAndValidity();
                                        sentFormGroupDoc[j].isDocumentSelected = true;
                                        this.service.sendEmail(documentFormGroup.value);
                                    }
                                    i = j - i;
                                }
                            }

                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                            this.emailSuccessModal = true;
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkMailModalButton, 'isDisabled', !this.checkMailModal());
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailSuccessModalKey, 'modalKey', this.emailSuccessModal);
                        }
                    });
                }
                else if (data.id === this.eventConstants['onCreditModalClose']) {
                    this.onCreditModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                    this.navigateToHome();
                }
                else if (data.id === this.eventConstants['risk']) {
                    this.addDelRiskInfo(data.value);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'disableDelBtn', this.disableDelRisk);
                }

                else if (data.id === this.eventConstants['nominee']) {
                    this.addDelNominee(data.value);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nominee, 'disableDelBtn', this.disableDelNominee);
                }
                else if (data.id === this.eventConstants['removeInsuredDetail']) {
                    let riskIndex = data.value.superParentIndex !== undefined ? data.value.superParentIndex : 0;
                    let insuredIndex = data.value.parentIndex !== undefined ? data.value.parentIndex : data.value;
                    this.doRemoveInsuredList(riskIndex, insuredIndex);
                    this.transactionTypeInstance.isPolicyRatingDone = false;
                    let riskInfoArray: any = this.formGroup.controls['riskInfo'];
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                }
                else if (data.id === this.eventConstants['undoRemoveInsuredDetail']) {
                    let riskIndex = data.value.superParentIndex !== undefined ? data.value.superParentIndex : 0;
                    let insuredIndex = data.value.parentIndex !== undefined ? data.value.parentIndex : data.value;
                    this.doUndoRemoveInsuredList(riskIndex, insuredIndex);
                    this.transactionTypeInstance.isPolicyRatingDone = false;
                    let riskInfoArray: any = this.formGroup.controls['riskInfo'];
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);

                }

                else if (data.id === this.eventConstants['addInsuredDetail']) {
                    let index = data.value ? data.value : 0;
                    this.transactionTypeInstance.newInsuredCorrespondingRiskIndex = index;
                    let append: string;
                    this.doAddInsuredList(index);
                    this.transactionTypeInstance.isPolicyRatingDone = false;
                    let riskInfoArray: any = this.formGroup.controls['riskInfo'];
                    let riskIndex = 0;
                    if (data.value && data.value.superParentIndex !== undefined) riskIndex = data.value.superParentIndex;
                    append = index < 10 ? "0000" : "000";
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoItemNoCompare, 'compareWith', append + (index + 1));
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredListNewArrayCompare, 'compareWith', riskInfoArray.at(index).get('insuredList').getRawValue().length.toString());
                    this.addInsuredPersonModal = true;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addInsuredPersonModalKey, 'modalKey', this.addInsuredPersonModal);
                }
                else if (data.id === this.eventConstants['addNewInsuredModalClose']) {
                    let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
                    riskInfoFormArray.at(this.transactionTypeInstance.newInsuredCorrespondingRiskIndex).get('insuredList').removeAt(riskInfoFormArray.at(this.transactionTypeInstance.newInsuredCorrespondingRiskIndex).get('insuredList').getRawValue().length - 1);
                    riskInfoFormArray.at(this.transactionTypeInstance.newInsuredCorrespondingRiskIndex).get('numberofAdults').patchValue(riskInfoFormArray.at(this.transactionTypeInstance.newInsuredCorrespondingRiskIndex).get('numberofAdults').value - 1);
                    this.addInsuredPersonModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addInsuredPersonModalKey, 'modalKey', this.addInsuredPersonModal);
                }
                else if (data.id === this.eventConstants['addNewInsuredModalSave']) {
                    this.addInsuredPersonModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addInsuredPersonModalKey, 'modalKey', this.addInsuredPersonModal);
                }

                else if (data.id === this.eventConstants['viewPlans']) {
                    this.transactionTypeInstance.transaction.selectedRiskIndex = data.value;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansSectNoCompare, 'compareWith', this.transactionTypeInstance.transaction.selectedRiskIndex);
                    this.viewPlansModal = true;
                    this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                    this.changeRef.markForCheck();
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
                }
                else if (data.id === this.eventConstants['viewSummaryInsured']) {
                    this.transactionTypeInstance.transaction.selectedRiskIndex = data.value;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSummaryInsuredModalSectNoCompare, 'compareWith', this.transactionTypeInstance.transaction.selectedRiskIndex);
                    this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                    this.viewSummaryInsuredModal = true;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSummaryInsuredModal, 'modalKey', this.viewSummaryInsuredModal);
                }
                else if (data.id === this.eventConstants['closePlanModal']) {
                    this.viewPlansModal = false;
                    this.removeUnselectedPlan();
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansSectNoCompare, 'compareWith', '');
                    this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                }
                else if (data.id === this.eventConstants['closeSummaryInsuredModal']) {
                    this.viewSummaryInsuredModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSummaryInsuredModal, 'modalKey', this.viewSummaryInsuredModal);
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
                else if (data.id === this.eventConstants['doInsuredRefresh']) {
                    this.doInsuredRefresh(data, false, true);
                }
                else if (data.id === this.eventConstants['addTravellingTo']) {
                    this.doAddCountryTravelList();
                    this.updateElements();
                    this.changeRef.markForCheck();

                }
                else if (data.id === this.eventConstants['delTravellingTo']) {
                    this.doDelCountryTravelList(data);
                    this.updateElements();
                    this.changeRef.markForCheck();
                }
                else if (data.id === this.eventConstants['doCustomerRefresh']) {
                    this.formGroup.controls['customerInfo'].get('identityNo').markAsDirty();
                    this.formGroup.controls['customerInfo'].get('identityTypeCode').markAsDirty();
                    this.doCustomerRefresh(this.formGroup.controls['customerInfo'], data.id);
                }
                else if (data.id === this.eventConstants['doPolicyRatingBeforePosting']) {
                    this.doPolicyRatingBeforePosting();
                }
                else if (data.id === this.eventConstants['postalCodeRefresh']) {
                    this.getPostalCodeRefresh();
                }
                else if (data.id === this.eventConstants['agentCodeRefresh']) {
                    this.getAgentCodeRefresh();
                }
                else if (data.id === this.eventConstants['removeItemDetail']) {
                    this.doRemoveItemList(data.value);
                    this.addItemMastertoWork(data.value);
                    this.transactionTypeInstance.isPolicyRatingDone = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);

                }
                // if (data.id === 'undoRemoveItemDetail') {
                //     this.doUndoRemoveItemList(data.value);
                //     //this.deleteItemFromWork(data.value);
                //     this.transactionTypeInstance.isPolicyRatingDone = false;
                // }
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
                    this.addItemDetails();
                    this.addItemModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addItemModalKey, 'modalKey', this.addItemModal);
                } else if (data.id === this.eventConstants['closePostingFailedModal']) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyFailureModal, 'modalKey', false);
                    this.changeRef.markForCheck();
                    this.navigateToHome();
                } else if (data.id === this.eventConstants['addItemCoverage']) {
                    this.addDeleteItemCoverage(data, 'add');
                }
                else if (data.id === this.eventConstants['deleteItemCoverage']) {
                    this.addDeleteItemCoverage(data, 'del');
                } else if (data.id === this.eventConstants['callMultiItemDefaulting']) {
                    this.transactionTypeInstance.transaction.eventHandlerService.setEvent('onValidateTab', this.transactionTypeInstance.transaction.currentTab);
                    this.multiItemDefaulting(data);
                } else if (data.id === this.eventConstants['comparePlans']) {
                    this.comparePlans(data);
                }
                // if(data.id === 'deleteItemDetail'){
                //     this.deleteItemFromWork(data.value);
                //     this.transactionTypeInstance.isPolicyRatingDone = false;
                // }
                else if (data.id !== this.eventConstants['quoteOnCreditModalNewQuote']) {
                    this.changeRef.detectChanges();
                }
                else if (data.id !== this.eventConstants['onCreditModalNewQuote']) {
                    this.changeRef.detectChanges();
                }
            }
        });
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
        if (lobObject['isInsuredChildRequired']) {
            this.isInsuredChildRequired = lobObject['isInsuredChildRequired'];
        }
        if (lobObject['VALIDATION']['insuredChildMaxAge']) {
            this.insuredChildMaxAge = lobObject['VALIDATION']['insuredChildMaxAge'];
        }

        this.addBreadCrumbRoute();
        if (this.transactionTypeInstance.isPolicyFlag) this.transactionTypeInstance.overrideEndorsementElements = lobObject['overrideEndorsementElements'];
        let productJSON = this.transactionTypeInstance.getProductJSON(productCode, templateName);
        productJSON.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
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
                    if (this.transactionTypeInstance.hasStatusNew) {
                        if (this.transactionTypeInstance.transaction.useLegacy === true) {
                            this.formGroup = this.defaultValue.setTravelQuotDefaultValues(this.formGroup, this.transactionTypeInstance.transaction.productCode, defaultValues);
                        } else {
                            //  + calling doPopulateFormGroup(Object, FormGroup) only to update formGroup with default values received
                            //  from productSetup JSON primarily used to default the hidden elements ( fields not present in screen)
                            this.formGroup = this.doPopulateFormGroup(defaultValues, this.formGroup);
                        }
                        this.setCoverDates();
                        if (this.transactionTypeInstance.transaction.useLegacy === true) {
                            if (this.multiItemFlag) this.formGroup = this.validator.setTravelGroupQuoteValidator(this.formGroup);
                            else this.formGroup = this.validator.setTravelQuotValidator(this.formGroup);
                        }
                        this.numberOfAdults = this.riskInfoGroup.value['numberofAdults'];
                        if (this.transactionTypeInstance.transaction.status === 'Enquiry') {
                            this.policyHolderTypeSelected(this.formGroup.controls['customerInfo'].get('policyHolderType').value);
                            this.excessControl.disable();
                        }
                        this.doDisableAndEnableIfReferralApproved(false, true);
                        if (this.formGroup.controls['policyInfo'].get('referralStatus').value === 'B001') {
                            this.referralAppRatingResponse = this.transactionTypeInstance.transaction.getCustom(this.transactionTypeInstance.openHeldDataStorageString);
                        }
                    } else this.fetchOpenheldData();
                    this.policytyepSelected(this.formGroup.controls['policyInfo'].get('policyTerm').value);
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

    public updateElements() {
        if (this.formData) {
            // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.formName, 'formName', this.formGroup);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'importantNotice', this.transactionTypeInstance.transaction.importantNotice);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'warrantyAndDeclaration', this.transactionTypeInstance.transaction.personalDataProtectionActStatement);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'personalDataProtectionActStatement', this.transactionTypeInstance.transaction.warrantyAndDeclaration);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'firstHeading', this.transactionTypeInstance.transaction.firstDeclarationHeading);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'secondHeading', this.transactionTypeInstance.transaction.secondDeclarationHeading);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'thirdHeading', this.transactionTypeInstance.transaction.thirdDeclarationHeading);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.defaultingButtonCondition, 'condition', this.transactionTypeInstance.transaction.status === 'NewQuote');
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.defaultingCheckCondition, 'condition', this.formGroup.controls['policyInfo'].get('quoteNo').value);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentInfoCondition, 'condition', this.transactionTypeInstance.transaction.isEnquiryFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentReferenceNoControl, 'hide', this.transactionTypeInstance.transaction.isEnquiryFlag && !(this.formGroup.controls['paymentInfo'].value.paymentReferenceNo));
            if (this.transactionTypeInstance.transaction.status !== 'EndEnquiry') {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.PolicyAgentCondition, 'condition', this.userType === this.userTypeOperator);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'disableNext', !this.transactionTypeInstance.transaction.isValidForm);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'wizardConfig', this.multiItemFlag ? this.formGroup.controls['policyInfo'].get('quoteNo').value ? this.transactionTypeInstance.transaction.wizardConfig : this.transactionTypeInstance.transaction.hideNavigationButtonWizardConfig : this.transactionTypeInstance.transaction.wizardConfig);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
                if (this.multiItemFlag) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'disableDelBtn', this.disableDelRisk);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.occupationClassCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.comparePlansButton, 'isDisabled', this.transactionTypeInstance.transaction.status === 'Enquiry' ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.designationCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableListDesignationClassDesc, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableListOccupationClassDesc, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableHeaderDesignationClass, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableHeaderOccupationClass, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.summaryOccupationDesignationClass, 'label', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I' ? 'NCPLabel.occupationClass' : 'NCPLabel.designation');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.summaryTableListOccupationClassDesc, 'elementFormName', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O' ? 'occupationClassDesc' : 'designationDesc');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nomineeTabError, 'displayFlag', !this.isNomineeErrorFlag);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nominee, 'disableDelBtn', this.disableDelNominee);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.multiItemCondition, 'condition', this.multiItemFlag);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSummaryInsuredModal, 'modalKey', this.viewSummaryInsuredModal);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nominee, 'enableAddDelBtn', !this.transactionTypeInstance.transaction.isEnquiryFlag);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'enableAddDelBtn', !this.transactionTypeInstance.transaction.isEnquiryFlag);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.showHideItemUploadButton, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyHolderTypeCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
                } else {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.travelCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermShort);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.regionCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermAnnul);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.totalAdultsCondition, 'condition', this.covertypeSelected());
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTypeCorporateCondition, 'condition', (this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O'));
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredlengthCondition, 'condition', this.numberofInsureds.length > 1);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.countryList, 'valueList', this.riskInfoGroup ? this.riskInfoGroup.value['travellingTo'] : null);
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentDescList, 'valueList', this.docInfoList());
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coverTypeCondition, 'condition', this.covertypeSelected());
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.holderTypeCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.travellingTo, 'param3Info', this.region);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.revisedPricse, 'customControl', this.excessControl);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.revisedCondition, 'condition', this.excessControl ? this.excessControl.value : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTypeAnnualControl, 'hide', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermAnnul);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTypeSingleControl, 'hide', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermShort);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planSelectedLabel, 'label', this.selectedPlanDesc);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planSelectedPremium, 'label', this.selectedPlanPrem);
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.individualDetailsCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.corporateDetailsCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'I');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.regionLabel, 'label', this.region);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.enquiryFlagPlanTable, 'productCode', this.productCode);
                if (this.formGroup.controls['policyInfo'].get('siCurr').value) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.enquiryFlagPlanTable, 'siCurrencyCode', this.formGroup.controls['policyInfo'].get('siCurr').value);
                }
                if (this.formGroup.controls['policyInfo'].get('PremCurr').value) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.enquiryFlagPlanTable, 'premiumCurrencyCode', this.formGroup.controls['policyInfo'].get('PremCurr').value);
                    this.orginalCurrCode = this.transactionTypeInstance.transaction.configService.getCustom('currency_code');
                    this.transactionTypeInstance.transaction.configService.setCustom('currency_code', this.formGroup.controls['policyInfo'].get('PremCurr').value);
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.tripTabError, 'displayFlag', !this.tabErrorFlag && this.transactionTypeInstance.transaction.isNextFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyInfoCondition, 'condition', !this.isPolicyTypeAnnual);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coverDateCondition, 'condition', this.isPolicyTypeAnnual);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.corporateCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.campaignControl, 'hide', this.isCollapsedTr);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.schemeControl, 'hide', this.isCollapsedTr);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.multiProductControl, 'hide', this.isCollapsedTr);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.enquiryFlagPlanTable, 'isEnquiryFlag', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryDate, 'options', this.setNCPDatePickerToDateOptions());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerToDateAnnualOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.startDt, 'options', this.setNCPDatePickerEffectiveDateOptions());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.endDt, 'options', this.setNCPDatePickerEffectiveDateOptions());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTabError, 'displayFlag', !this.isQuoteErrorFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredTabError, 'displayFlag', !this.isInsuredErrorFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredDuplicateTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isDuplicateIDErrorFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModalKey, 'modalKey', this.referralHistoryModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModalKey, 'modalKey', this.referralHistoryModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailSuccessModalKey, 'modalKey', this.emailSuccessModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralSuccessModalKey, 'modalKey', this.referModalkey);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkSaveModalButton, 'isDisabled', !this.checkSaveModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkMailModalButton, 'isDisabled', !this.checkMailModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ZipCodeCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ZipCode, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.IdentityNoCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.IdentityNoButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredIdentityNoButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveCompanyNameCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.toAddress, 'dropdownItems', this.transactionTypeInstance.transaction.technicalUserArray);
                //     // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.relationWithAppCode', 'param1', riskInfoFormGroup.get('travellerTypeCode').value);
                //     // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.relationWithAppCode', 'param2', this.formGroup.controls['policyInfo'].value.policyTerm);
                //     // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.relationWithAppCode', 'param3', this.formGroup.controls['customerInfo'].value.policyHolderType);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralHistInfoList, 'valueList', this.referralHistInfo);
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, '001-01-02-03-05-01', 'isDisabled', this.isReferralFlag == false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailquoteMessage, 'htmlString', this.formGroup.controls['emailQuotInfo'].value.reason);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocsCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralHistoryCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCreditCondition, 'condition', !this.transactionTypeInstance.transaction.getIsB2B() ? false : this.transactionTypeInstance.transaction.payByCredit);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNowCondition, 'condition', !this.transactionTypeInstance.transaction.getIsB2B() ? true : this.transactionTypeInstance.transaction.payByCash);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.multiProductPrem, 'label', this.multiProductPrem);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.campaignDiscount, 'label', this.campaignDiscount);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.contactNumber, 'isEnquiryFlag', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.postalcode, 'acceptPattern', this.zipCodePattern);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.travellingToTableCondition, 'condition', this.travellingToTableFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addTravellingToButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.delTravellingToButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
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
                            this.selectedPlanPrem = this.transactionTypeInstance.transaction.amtFormat.transform(parseFloat(planObject.planPrem), ['', true, this.formGroup.controls['policyInfo'].get('PremCurr').value]);
                        }
                    });
                }

            });
        }
    }

    onValidateTab() {
        if (this.transactionTypeInstance.transaction.status === 'Enquiry' || this.transactionTypeInstance.isPolicyFlag) {
            this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = true;
            this.transactionTypeInstance.transaction.isValidForm = true;
        } else {
            this.isError = false;
            if (this.transactionTypeInstance.transaction.currentTab === '01') {
                if (this.formGroup.controls['policyInfo'].get('referralStatus').value === 'B001') {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = true;
                    this.transactionTypeInstance.transaction.isValidForm = true;
                } else {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['riskInfo'].valid && this.formGroup.controls['policyInfo'].valid && this.salesAgentFlag;
                    this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    this.tabErrorFlag = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                }
            } else if (this.transactionTypeInstance.transaction.currentTab === '02') {
                let referralAppRatingResponse;
                if (this.formGroup.controls['policyInfo'].get('referralStatus').value === 'B001') {
                    this.transactionTypeInstance.transaction.isEnquiryFlag = false;
                    referralAppRatingResponse = this.referralAppRatingResponse;
                }
                referralAppRatingResponse = this.formGroup.value;
                this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.validatePlanDetail(referralAppRatingResponse);
                this.isPlantableErrorFlag = this.validatePlanDetail(referralAppRatingResponse);
                this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
            } else if (this.transactionTypeInstance.transaction.currentTab === '03') {
                this.isInsuredErrorFlag = this.formGroup.controls['riskInfo'].valid && this.formGroup.controls['customerInfo'].valid;
                this.transactionTypeInstance.transaction.isDuplicateIDErrorFlag = this.validateIdentityNumberUniqueNess();
                this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.isInsuredErrorFlag && this.transactionTypeInstance.transaction.isDuplicateIDErrorFlag && this.validateNominee();
                this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                this.isNomineeErrorFlag = this.validateNominee();
            }
        }
        this.transactionTypeInstance.transaction.isNextFlag = !this.transactionTypeInstance.transaction.isValidForm;
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'disableNext', !this.transactionTypeInstance.transaction.isValidForm);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.tripTabError, 'displayFlag', !this.tabErrorFlag && this.transactionTypeInstance.transaction.isNextFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTabError, 'displayFlag', !this.isPlantableErrorFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredTabError, 'displayFlag', !this.isInsuredErrorFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredDuplicateTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isDuplicateIDErrorFlag);
        if (this.isNominee)
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nomineeTabError, 'displayFlag', !this.isNomineeErrorFlag);
        // this.changeRef.markForCheck();
    }
    public onPrevious(event: any): void {
        this.isError = false;
        switch (event.ui.tabId) {
            case '02': {
                this.transactionTypeInstance.transaction.currentTab = '01';
                break;
            }
            case '03': {
                this.transactionTypeInstance.transaction.currentTab = '02';
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    // this.formGroup = this.validator.clearValidator(this.formGroup);
                    let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
                    let insuredListLength = riskInfoFormArray.at(0).controls['insuredList'].length;
                    if (!this.multiItemFlag) {
                        let noOfAdults = riskInfoFormArray.at(0).get('numberofAdults').value;
                        let noOfChildren = riskInfoFormArray.at(0).get('numberofChildren').value;
                        if (!noOfAdults) noOfAdults = 1;
                        if (noOfAdults === 1 && noOfChildren >= 1 || noOfAdults > 1) {
                            for (let i = 0; i < insuredListLength; i++) {
                                let insuredListFormGroup = riskInfoFormArray.at(0).get('insuredList').at(i);
                                insuredListFormGroup = this.validator.clearSetInsuredValidators(insuredListFormGroup);
                            }
                            for (let i = 0; i < insuredListLength; i++) {
                                riskInfoFormArray.at(0).controls['insuredList'].removeAt(insuredListLength - 1);
                            }
                        }
                        if (noOfAdults === 1 && noOfChildren < 1) {
                            for (let i = 0; i < noOfAdults; i++) {
                                let insuredListFormGroup = riskInfoFormArray.at(0).get('insuredList').at(i);
                                insuredListFormGroup = this.validator.clearSetInsuredValidators(insuredListFormGroup);

                            }
                        }

                    } else {
                        for (let i = 0; i < riskInfoFormArray.length; i++) {
                            let riskFormGroup = riskInfoFormArray.at(i).get('insuredList');
                            for (let j = 0; j < riskFormGroup.length; j++) {
                                let insuredListFormGroup = riskFormGroup.at(j);
                                insuredListFormGroup = this.validator.clearInsuredWithNomineeValidators(insuredListFormGroup);
                            }
                        }
                    }

                    break;
                }
            }
            case '04': {
                this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').reset();
                this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').updateValueAndValidity();
                this.transactionTypeInstance.transaction.currentTab = '03';
                break;
            }
            default: {
                break;
            }
        }
        if (this.transactionTypeInstance.isPolicyFlag) this.doEndorsementReasonFormGroupUpdate();
        else {
            if (this.formGroup.controls['policyInfo'].get('referralStatus').value === 'B001') {
                this.formGroup.disable();
                this.transactionTypeInstance.transaction.isEnquiryFlag = true;
            }
        }
        // this.updateElements();
        // this.changeRef.markForCheck();
    }
    public onNext(event: any): void {
        let travellerType;
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        travellerType = riskInfoArray.at(0).value.travellerTypeCode;
        if (event.ui.tabId === '01') {
            if (this.multiItemFlag) {
                this.setItemNo();
            }
            if (this.formGroup.controls['policyInfo'].value.policyTerm === '01') {
                this.noOfDaysTravellingUpdate(this.formGroup);
            }
            this.appendEffectiveDateToInsuredList();
            let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
            if (policyNo) this.patchInsuredDetails();
            if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                this.doRating();
            }
            this.transactionTypeInstance.transaction.currentTab = '02';
        } else if (event.ui.tabId === '02') {
            if (this.multiItemFlag) this.addDelIndividualInfo();
            else {
                if (travellerType !== this.travellerTypeCodeIndividual) this.setInsuredList();
            }

            if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                if (this.transactionType === 'PO') {
                    this.setInsuredTabPolicyValidators();
                } else if (this.transactionType === 'QT') {
                    this.formGroup = this.validator.setTravelQuotInsuredValidator(this.formGroup, this.productCode);
                }
            } else {
                this.formGroup = this.doDisableInsuredList(this.formGroup);
            }


            this.transactionTypeInstance.transaction.currentTab = '03';
        } else if (event.ui.tabId === '03') {
            this.setKeysForNominee();
            this.patchInsuredDetails();
            this.doSetRegionCodeString();
            this.setCustomerFullName();
            this.transactionTypeInstance.transaction.currentTab = '04';
        }
        // this.updateElements();
        // this.changeRef.markForCheck();
    }
    public onTabChange(): void {

    }
    // - LifeCycle & NG2Wizard related common methods
    // + Common Methods for Quote / Policy
    policytyepSelected(value?) {
        if (this.multiItemFlag) this.formGroup = this.validator.setTravelGroupQuoteValidator(this.formGroup);
        else this.formGroup = this.validator.setTravelQuotValidator(this.formGroup);
        this.transactionTypeInstance.transaction.isValidForm = true;
        if (value === this.transactionTypeInstance.transaction.policyTermAnnul) {
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
        if (this.transactionTypeInstance.transaction.status === 'NewQuote' && !this.multiItemFlag) {
            this.region = '';
        }
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyInfoCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermShort);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coverDateCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermAnnul);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.regionLabel, 'label', this.region);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'disableNext', !this.transactionTypeInstance.transaction.isValidForm);
        if (!this.multiItemFlag) {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.travelCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermShort);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.regionCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermAnnul);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTypeAnnualControl, 'hide', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermAnnul);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTypeSingleControl, 'hide', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermShort);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.travellingTo, 'param3Info', this.region);
        }
    }
    covertypeSelection() {
        this.formGroup = this.validator.setTravelQuotValidator(this.formGroup);
        this.transactionTypeInstance.transaction.isValidForm = true;
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let travellerType = riskInfoArray.at(0).get('travellerTypeCode').value;
        if (travellerType === 'IND') {
            let riskInfoFormGroup = riskInfoArray.at(0);
            let tempRiskFormGroup = riskInfoFormGroup;
            let insuredLength = tempRiskFormGroup.controls['insuredList'].length;
            for (var i = insuredLength - 1; i > 0; i--) {
                tempRiskFormGroup.controls['insuredList'].removeAt(i);
            }
            tempRiskFormGroup.updateValueAndValidity();
        }
        else if (travellerType === 'GRP') {
            let riskInfoFormGroup = riskInfoArray.at(0);
            let tempRiskFormGroup = riskInfoFormGroup;
            tempRiskFormGroup.get('travellerTypeDesc').patchValue('Group');
            tempRiskFormGroup.get('travellerTypeDesc').updateValueAndValidity();
        }
        else if (travellerType === 'FAM') {
            let riskInfoFormGroup = riskInfoArray.at(0);
            let tempRiskFormGroup = riskInfoFormGroup;
            tempRiskFormGroup.get('travellerTypeDesc').patchValue('Family');
            tempRiskFormGroup.get('travellerTypeDesc').updateValueAndValidity();
        }
    }
    covertypeSelected() {
        this.transactionTypeInstance.transaction.isValidForm = true;
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let travellerType = riskInfoArray.at(0).get('travellerTypeCode').value;
        if (travellerType === 'FAM' || travellerType === 'GRP') {
            return true;
        } else {
            return false;
        }
    }

    policyHolderTypeSelected(value?) {
        this.isHolderTypeIndividual = value === 'I';
        if (this.isCustomerRefreshed) {
            this.resetCustomerInfo();
            this.formGroup.controls['customerInfo'].enable();
        }
        if (this.multiItemFlag) {
            let riskInfoArray: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
            riskInfoArray.controls.forEach(ele => {
                if (!this.isHolderTypeIndividual) {
                    ele.get('occupationClassCode').reset();
                    ele.get('occupationClassCode').updateValueAndValidity();
                    ele.get('occupationClassDesc').reset();
                    ele.get('occupationClassDesc').updateValueAndValidity();
                } else {
                    ele.get('designationCode').reset();
                    ele.get('designationCode').updateValueAndValidity();
                    ele.get('designationDesc').reset();
                    ele.get('designationDesc').updateValueAndValidity();
                }
            });
            this.unpatchInsuredDetails();
            this.resetCustomerInfo();
            this.resetCustomerCorporateInfo();
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.occupationClassCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.designationCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableListDesignationClassDesc, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableListOccupationClassDesc, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableHeaderDesignationClass, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableHeaderOccupationClass, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.summaryOccupationDesignationClass, 'label', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I' ? 'NCPLabel.occupationClass' : 'NCPLabel.designation');
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.summaryTableListOccupationClassDesc, 'elementFormName', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O' ? 'occupationClassDesc' : 'designationDesc');
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyHolderTypeCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
        }
        else {
            this.unpatchInsuredDetails();
            this.resetCustomerCorporateInfo();
            this.resetCustomerInfo();
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTypeCorporateCondition, 'condition', (this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O'));
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.holderTypeCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
        }
        // this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').patchValue(value);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveCompanyNameCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'I');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.individualDetailsCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.corporateDetailsCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'I');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.corporateCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
    }
    setCoverDates() {
        let noofDays = this.formGroup.controls['policyInfo'].get('durationInDays').value;
        let tripInceptionDt = this.formGroup.controls['policyInfo'].get('inceptionDt').value;
        if (tripInceptionDt != '') {
            let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(tripInceptionDt);
            let tripInceptionDate = dateDuration.startDate;
            if (noofDays < 1 || noofDays === '') {
                noofDays = 1;
            }
            noofDays = Math.round(noofDays);
            let noofDaysTime = (1000 * 60 * 60 * 24 * noofDays) - (1000 * 60 * 60 * 24);
            if (tripInceptionDt) {
                this.transactionTypeInstance.transaction.todayDate = new Date();
                this.transactionTypeInstance.transaction.todayDate.setHours(0, 0, 0, 0);
            }
            // let tripEndTime = noofDaysTime + this.todayDate.valueOf();
            let tripEndTime = noofDaysTime + tripInceptionDate.valueOf();
            let tripEndDate = new Date(tripEndTime);
            let resultedStringDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripEndDate);
            this.formGroup.controls['policyInfo'].get('expiryDt').patchValue(resultedStringDate);
            this.formGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();

            if (tripInceptionDt) {
                this.formGroup.controls['policyInfo'].get('effectiveDt').patchValue(tripInceptionDt);
            } else {
                this.formGroup.controls['policyInfo'].get('inceptionDt').patchValue(this.transactionTypeInstance.transaction.todayString);
                this.formGroup.controls['policyInfo'].get('effectiveDt').patchValue(this.transactionTypeInstance.transaction.todayString);
            }
            this.formGroup.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(noofDays);
            this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            this.setNCPDatePickerOptions();
        }
    }
    coverDateChanged(event?: any) {
        let coverFromDate = this.formGroup.controls['policyInfo'].value.inceptionDt;
        let coverToDate = this.formGroup.controls['policyInfo'].value.expiryDt;
        let tripStartDate;
        let tripEndDate;
        let noofDays;
        if (coverFromDate && coverToDate) {
            let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(coverFromDate, coverToDate);
            tripStartDate = dateDuration.startDate;
            tripEndDate = dateDuration.endDate;
            noofDays = dateDuration.noOfDays;
            this.transactionTypeInstance.transaction.todayString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(this.transactionTypeInstance.transaction.todayDate);
            let dateDurationOfToday = this.transactionTypeInstance.transaction.dateDuration.transform(this.transactionTypeInstance.transaction.todayString, coverFromDate);
            let noOfDaysOfToday = dateDurationOfToday.noOfDays;
            if (noOfDaysOfToday >= 180) {
                this.formGroup.controls['policyInfo'].get('inceptionDt').setErrors({ 'customError': true });
            } else {

            }
        }
        if (tripStartDate && tripStartDate.getDate() > 0 && tripStartDate.getMonth() > -1 && tripStartDate.getFullYear() > 0) {
            if (tripStartDate < this.transactionTypeInstance.transaction.todayDate) {
                let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(this.transactionTypeInstance.transaction.todayString, this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripEndDate));
                tripStartDate = this.transactionTypeInstance.transaction.todayDate;
                noofDays = dateDuration.noOfDays;
                let startString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripStartDate);

                this.formGroup.controls['policyInfo'].get('inceptionDt').patchValue(startString);
                this.formGroup.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
                this.formGroup.controls['policyInfo'].get('effectiveDt').patchValue(startString);
                this.formGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
                this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(noofDays);
                this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();

            }

            if (this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermShort) {
                if (tripEndDate < tripStartDate) {
                    // tripEndDate = new Date(tripStartDate.valueOf() + (1000 * 60 * 60 * 24));
                    tripEndDate = new Date(tripStartDate.valueOf());
                    let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripStartDate), this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripEndDate));
                    noofDays = dateDuration.noOfDays;
                }
                let tripEndString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripEndDate);
                this.formGroup.controls['policyInfo'].get('expiryDt').patchValue(tripEndString);
                this.formGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
                this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(noofDays);
                this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();

            } else if (this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermAnnul) {
                let coverTotimeAnnual = tripStartDate.valueOf() + 364 * 1000 * 60 * 60 * 24;
                let resultcoverToDate = new Date(coverTotimeAnnual);
                let resultedStringDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(resultcoverToDate);

                this.formGroup.controls['policyInfo'].get('expiryDt').patchValue(resultedStringDate);
                this.formGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
                this.noOfDaysTravellingUpdate(this.formGroup);
            }
            if (coverFromDate) {
                let startString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripStartDate);
                this.formGroup.controls['policyInfo'].get('inceptionDt').patchValue(startString);
                this.formGroup.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
                this.formGroup.controls['policyInfo'].get('effectiveDt').patchValue(coverFromDate);
                this.formGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
            }
        }
        else if (coverFromDate === "" || coverToDate === "") {
            if (this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermAnnul) {
                if (coverFromDate === "") {
                    tripStartDate = this.transactionTypeInstance.transaction.todayDate;
                    let startString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripStartDate);
                    coverFromDate = startString;
                    let coverTotimeAnnual = tripStartDate.valueOf() + 364 * 1000 * 60 * 60 * 24;
                    let resultcoverToDate = new Date(coverTotimeAnnual);
                    let resultedStringDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(resultcoverToDate);
                    this.formGroup.controls['policyInfo'].get('inceptionDt').patchValue(startString);
                    this.formGroup.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
                    this.formGroup.controls['policyInfo'].get('effectiveDt').patchValue(startString);
                    this.formGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
                    this.formGroup.controls['policyInfo'].get('expiryDt').patchValue(resultedStringDate);
                    this.formGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
                    this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(noofDays);
                    this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
                }
                if (coverToDate === "") {
                    let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(coverFromDate, coverToDate);
                    tripStartDate = dateDuration.startDate;
                    let coverTotimeAnnual = tripStartDate.valueOf() + 364 * 1000 * 60 * 60 * 24;
                    let resultcoverToDate = new Date(coverTotimeAnnual);
                    let resultedStringDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(resultcoverToDate);
                    this.formGroup.controls['policyInfo'].get('expiryDt').patchValue(resultedStringDate);
                    this.formGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
                }
                this.noOfDaysTravellingUpdate(this.formGroup);
            }
            else {
                noofDays = 0;
                this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(noofDays);
                this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            }
        }
        this.setNCPDatePickerOptions();
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.startDt, 'options', this.setNCPDatePickerEffectiveDateOptions());
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.endDt, 'options', this.setNCPDatePickerEffectiveDateOptions());

    }

    patchInsuredDetails() {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        for (let j = 0; j < riskInfoArray.length; j++) {
            let tempRiskFormGroup = riskInfoArray.at(j);
            let insuredFormArray: FormArray = <FormArray>tempRiskFormGroup.get('insuredList');
            if (!this.multiItemFlag) {
                for (let i = 0; i < this.transactionTypeInstance.transaction.insuredListData.length; i++) {
                    let fullName = this.transactionTypeInstance.transaction.insuredListData[i].appFName + ' ' + this.transactionTypeInstance.transaction.insuredListData[i].appLName;
                    insuredFormArray.at(i).get('appFullName').setValue(fullName);
                    insuredFormArray.at(i).get('appFullName').updateValueAndValidity();
                    insuredFormArray.at(i).get('appFName').setValue(this.transactionTypeInstance.transaction.insuredListData[i].appFName);
                    insuredFormArray.at(i).get('appFName').updateValueAndValidity();
                    insuredFormArray.at(i).get('appLName').setValue(this.transactionTypeInstance.transaction.insuredListData[i].appLName);
                    insuredFormArray.at(i).get('appLName').updateValueAndValidity();
                    insuredFormArray.at(i).get('identityNo').setValue(this.transactionTypeInstance.transaction.insuredListData[i].identityNo);
                    insuredFormArray.at(i).get('identityNo').updateValueAndValidity();
                    insuredFormArray.at(i).get('key').setValue(this.transactionTypeInstance.transaction.insuredListData[i].key);
                    insuredFormArray.at(i).get('key').updateValueAndValidity();
                }
            } else {
                for (let i = 0; i < insuredFormArray.length; i++) {
                    let fullName = insuredFormArray.at(i).get('appFName').value + ' ' + insuredFormArray.at(i).get('appLName').value;
                    insuredFormArray.at(i).get('appFullName').setValue(fullName);
                    insuredFormArray.at(i).get('appFullName').updateValueAndValidity();
                    insuredFormArray.at(i).get('key').setValue((i + 1).toString());
                    insuredFormArray.at(i).get('key').updateValueAndValidity();
                }
            }
        }
    }

    public noOfDaysTravellingUpdate(dataValInputForm) {
        this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(365);
        this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
    }

    public setInsuredList() {
        let tempRiskFormGroup;
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        let riskInfoFormGroup = riskInfoFormArray.at(0);
        tempRiskFormGroup = riskInfoFormGroup;
        let noOfAdults = tempRiskFormGroup.get('numberofAdults').value;
        let noOfChildren = tempRiskFormGroup.get('numberofChildren').value;
        let total;
        if (noOfAdults) {
            noOfAdults = parseInt(noOfAdults);
            noOfChildren = parseInt(noOfChildren);
            if (noOfChildren) {
                total = noOfAdults + noOfChildren;
            } else {
                total = noOfAdults;
            }
            tempRiskFormGroup.get('numberofTravellers').patchValue(total);
            tempRiskFormGroup.get('numberofTravellers').updateValueAndValidity();
            if (total < 21 && total > 1) {
                this.numberofInsureds = [];
                if (!this.isInsuredChildRequired) {
                    for (let i = 0; i < noOfAdults; i++) {
                        this.transactionTypeInstance.transaction.logger.log(this.formGroup);
                        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) tempRiskFormGroup.controls['insuredList'].push(this.validator.setInsuredValidators(this.formGroup, this.transactionTypeInstance.transaction.insured.getInsuredInfoModel()));
                        else tempRiskFormGroup.controls['insuredList'].push(this.transactionTypeInstance.transaction.insured.getInsuredInfoModel());
                        this.numberofInsureds.push(i);
                    }
                } else {
                    for (let i = 0; i < total; i++) {
                        this.transactionTypeInstance.transaction.logger.log(this.formGroup);
                        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) tempRiskFormGroup.controls['insuredList'].push(this.validator.setInsuredValidators(this.formGroup, this.transactionTypeInstance.transaction.insured.getInsuredInfoModel()));
                        else tempRiskFormGroup.controls['insuredList'].push(this.transactionTypeInstance.transaction.insured.getInsuredInfoModel());
                        this.numberofInsureds.push(i);
                    }
                    if (noOfChildren) {
                        for (let i = noOfAdults; i < total; i++) {
                            if (!this.transactionTypeInstance.transaction.isEnquiryFlag) tempRiskFormGroup.controls['insuredList'].at(i).get('age').setValidators(Validators.compose([Validators.required, MaxNumberValidator.maxNumber(parseInt(this.insuredChildMaxAge))]));
                            tempRiskFormGroup.controls['insuredList'].at(i).get('age').updateValueAndValidity();
                        }
                    }
                }
                this.patchNomineeShareValue();
                this.transactionTypeInstance.transaction.logger.log(this.numberofInsureds);
            }
            if (this.numberofInsureds.length > 0 &&
                tempRiskFormGroup.controls['insuredList'].length > this.numberofInsureds.length) {
                let insuredLength = this.numberofInsureds.length;
                let modelLength = tempRiskFormGroup.controls['insuredList'].length;
                for (let i = modelLength - 1; i > insuredLength - 1; i--) {
                    tempRiskFormGroup.controls['insuredList'].removeAt(i);
                }
            }
            if (!this.transactionTypeInstance.hasStatusNew) {
                let dataObj = this.transactionTypeInstance.transaction.configService.getCustom(this.transactionTypeInstance.openHeldDataStorageString);
                if (dataObj !== undefined) {
                    tempRiskFormGroup.get('insuredList').patchValue(dataObj.riskInfo[0].insuredList);
                }
            }
        }
    }
    doDisableInsuredList(inputFormGroup) {
        let tempFormGroup;
        let riskInfoArray: any = inputFormGroup.controls['riskInfo'];
        let riskInfoObject = riskInfoArray.at(0);
        tempFormGroup = riskInfoObject;
        let insuredListLength = tempFormGroup.controls['insuredList'].length;
        for (let i = 0; i < insuredListLength; i++) {
            tempFormGroup.controls['insuredList'].at(i).disable();
        }
        tempFormGroup.controls['insuredList'].disable();
        riskInfoArray.at(0).patchValue(tempFormGroup);
        riskInfoArray.at(0).updateValueAndValidity();
        riskInfoArray.at(0).disable();
        inputFormGroup.controls['riskInfo'] = riskInfoArray;
        inputFormGroup.controls['riskInfo'].updateValueAndValidity();
        inputFormGroup.controls['riskInfo'].disable();
        return inputFormGroup;
    }

    insuredDetails(data?) {
        let FName = this.formGroup.controls['customerInfo'].get('appFName').value;
        let LName = this.formGroup.controls['customerInfo'].get('appLName').value;
        let dob = this.formGroup.controls['customerInfo'].get('DOB').value;
        let identityNo = this.formGroup.controls['customerInfo'].get('identityNo').value;
        let Age = this.formGroup.controls['customerInfo'].get('age').value;
        let identityTypeCode = this.formGroup.controls['customerInfo'].get('identityTypeCode').value;
        let identityTypeDesc = this.formGroup.controls['customerInfo'].get('identityTypeDesc').value;
        let riskTempFormGroup: any = this.formGroup.controls['riskInfo'];
        let tempFormGroup: any = riskTempFormGroup.at(0).get('insuredList');
        if ((this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I') && this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value) {
            tempFormGroup.at(0).get('appFName').setValue(FName);
            tempFormGroup.at(0).get('appFName').updateValueAndValidity();
            tempFormGroup.at(0).get('appLName').setValue(LName);
            tempFormGroup.at(0).get('appLName').updateValueAndValidity();
            tempFormGroup.at(0).get('identityTypeDesc').setValue(identityTypeDesc);
            tempFormGroup.at(0).get('identityTypeDesc').updateValueAndValidity();
            tempFormGroup.at(0).get('identityTypeCode').setValue(identityTypeCode);
            tempFormGroup.at(0).get('identityTypeCode').updateValueAndValidity();
            tempFormGroup.at(0).get('identityNo').setValue(identityNo);
            tempFormGroup.at(0).get('identityNo').updateValueAndValidity();
            tempFormGroup.at(0).get('DOB').setValue(dob);
            tempFormGroup.at(0).get('DOB').updateValueAndValidity();
            tempFormGroup.at(0).get('age').setValue(Age);
            tempFormGroup.at(0).get('age').updateValueAndValidity();
            tempFormGroup.at(0).get('relationWithAppDesc').patchValue('Self');
            tempFormGroup.at(0).get('relationWithAppCode').patchValue('SLF');
            tempFormGroup.at(0).get('relationWithAppDesc').updateValueAndValidity();
            tempFormGroup.at(0).get('relationWithAppCode').updateValueAndValidity();

            // this.disabledInsuredData = tempFormGroup.at(0).value;
            this.changeRef.markForCheck();
            // tempFormGroup.at(0).disable();
            if (!this.transactionTypeInstance.isPolicyFlag) {
                tempFormGroup.at(0).get('appFName').disable();
                tempFormGroup.at(0).get('appLName').disable();
                tempFormGroup.at(0).get('identityTypeCode').disable();
                tempFormGroup.at(0).get('identityTypeDesc').disable();
                tempFormGroup.at(0).get('identityNo').disable();
                tempFormGroup.at(0).get('DOB').disable();
                tempFormGroup.at(0).get('age').disable();
                tempFormGroup.at(0).get('relationWithAppDesc').disable();
                tempFormGroup.at(0).get('relationWithAppCode').disable();
            }
            // tempFormGroup.at(0).get('nomineeList').enable();
        }
        else if (this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value === false && this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').dirty) {
            // if (!this.insuredDetailsFlag) {
            tempFormGroup.at(0).get('appFName').setValue('');
            tempFormGroup.at(0).get('appFName').updateValueAndValidity();
            tempFormGroup.at(0).get('appLName').setValue('');
            tempFormGroup.at(0).get('appLName').updateValueAndValidity();
            tempFormGroup.at(0).get('identityNo').setValue('');
            tempFormGroup.at(0).get('identityNo').updateValueAndValidity();
            tempFormGroup.at(0).get('DOB').setValue('');
            tempFormGroup.at(0).get('DOB').updateValueAndValidity();
            tempFormGroup.at(0).get('age').setValue('');
            tempFormGroup.at(0).get('age').updateValueAndValidity();
            tempFormGroup.at(0).get('identityTypeCode').setValue('');
            tempFormGroup.at(0).get('identityTypeCode').updateValueAndValidity();
            tempFormGroup.at(0).get('identityTypeDesc').setValue('');
            tempFormGroup.at(0).get('identityTypeDesc').updateValueAndValidity();
            tempFormGroup.at(0).get('relationWithAppDesc').setValue('');
            tempFormGroup.at(0).get('relationWithAppDesc').updateValueAndValidity();
            tempFormGroup.at(0).get('relationWithAppCode').setValue('');
            tempFormGroup.at(0).get('relationWithAppCode').updateValueAndValidity();
            this.disabledInsuredData = tempFormGroup.at(0).value;
            tempFormGroup.at(0).enable();
            //  tempFormGroup.at(0).get('appFName').enable();
            // tempFormGroup.at(0).get('appFName').enable();
            // tempFormGroup.at(0).get('hkidOrPassport').enable();
            // tempFormGroup.at(0).get('DOB').enable();
            // tempFormGroup.at(0).get('age').enable();
            // tempFormGroup.at(0).get('isPassport').enable();
            // tempFormGroup.at(0).get('relationWithAppDesc').enable();
            // }
        }
    }





    setRegion(value?) {
        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
            let tempRiskFormGroup;
            let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
            let riskInfoFormGroup = riskInfoFormArray.at(0);
            tempRiskFormGroup = riskInfoFormGroup;
            if (value) {
                if (value.length > 0) {
                    let regionCodeResponse = this.service.getRegionDetails(value);
                    regionCodeResponse.subscribe(
                        (regionCodeDesc) => {
                            this.region = '';
                            if (regionCodeDesc.error) {
                                this.transactionTypeInstance.transaction.logger.error('getRegionDetails() ===>' + regionCodeDesc.error);
                            } else {
                                tempRiskFormGroup.get('regionCode').patchValue(regionCodeDesc['code']);
                                tempRiskFormGroup.get('regionCode').updateValueAndValidity();
                                tempRiskFormGroup.get('regionDesc').patchValue(regionCodeDesc['desc']);
                                tempRiskFormGroup.get('regionDesc').updateValueAndValidity();
                                this.region = tempRiskFormGroup.get('regionDesc').value;
                                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.countryList, 'valueList', this.riskInfoGroup ? this.riskInfoGroup.value['travellingTo'] : null);
                                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.travellingTo, 'param3Info', this.region);
                                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.regionLabel, 'label', this.region);
                                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                            }
                        }

                    );

                } else {
                    this.region = '';
                    tempRiskFormGroup.get('regionCode').setValue('');
                    tempRiskFormGroup.get('regionCode').setValidators(Validators.compose([Validators.required]));
                    tempRiskFormGroup.get('regionCode').updateValueAndValidity();
                    tempRiskFormGroup.get('regionDesc').setValue('');
                    tempRiskFormGroup.get('regionDesc').updateValueAndValidity();
                }
            } else {
                this.region = '';
                tempRiskFormGroup.get('regionCode').setValue('');
                tempRiskFormGroup.get('regionCode').setValidators(Validators.compose([Validators.required]));
                tempRiskFormGroup.get('regionCode').updateValueAndValidity();
                tempRiskFormGroup.get('travellingTo').setValue('');
                tempRiskFormGroup.get('travellingTo').updateValueAndValidity();
                tempRiskFormGroup.get('regionDesc').setValue('');
                tempRiskFormGroup.get('regionDesc').updateValueAndValidity();
            }
            riskInfoFormArray.at(0).patchValue(tempRiskFormGroup);
            riskInfoFormArray.at(0).updateValueAndValidity();
            this.formGroup.controls['riskInfo'] = riskInfoFormArray;
            this.formGroup.controls['riskInfo'].updateValueAndValidity();
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.countryList, 'valueList', this.riskInfoGroup ? this.riskInfoGroup.value['travellingTo'] : null);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.travellingTo, 'param3Info', this.region);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.regionLabel, 'label', this.region);
        }
    }
    getUserDetails() {
        let getUserdetailsArray: any[] = [];
        getUserdetailsArray.push(this.userService.getuserformModel().value);
        getUserdetailsArray[0].user_id = this.transactionTypeInstance.transaction.configService.getCustom('user_id');
        let userdetails = this.userService.getUserDetails(getUserdetailsArray);
        userdetails.subscribe(
            (userdetails) => {
                if (!userdetails.user_technical) {
                    this.updateErrorObject(this.customizedErrorForTechnicalUser);
                    // this.formGroup.controls['referQuotInfo'].get('referTo').patchValue([]);
                } else {
                    this.transactionTypeInstance.transaction.technicalUserArray = userdetails.user_technical;
                    let referTo: string = '';
                    this.transactionTypeInstance.transaction.technicalUserArray.forEach(element => {
                        if (referTo === '') {
                            referTo = element.desc;
                        } else {
                            referTo = referTo.concat(',', element.desc);
                        }
                    });
                    this.formGroup.controls['referQuotInfo'].get('referTo').patchValue(referTo);
                    this.referModal = true;
                }
                let quoteNo = this.formGroup.controls['policyInfo'].get('quoteNo').value;
                this.formGroup.controls['referQuotInfo'].get('subject').patchValue('Quote Referral - ' + quoteNo);
                this.transactionTypeInstance.transaction.referTo = this.formGroup.controls['referQuotInfo'].get('referTo').value;
                this.transactionTypeInstance.transaction.subject = this.formGroup.controls['referQuotInfo'].get('subject').value;
                this.formGroup.controls['referQuotInfo'].get('referTo').disable();
                this.formGroup.controls['referQuotInfo'].get('subject').disable();
                this.formGroup = this.validator.setReferQuotemodalValidators(this.formGroup);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.toAddress, 'dropdownItems', this.transactionTypeInstance.transaction.technicalUserArray);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            }
        );
    }
    doDisableAndEnableIfReferralApproved(isEnable: boolean, isEnableEnquiry: boolean) {
        if (this.formGroup.controls['policyInfo'].get('referralStatus').value === 'B001') {
            if (isEnable) {
                this.formGroup.enable();
            } else {
                this.excessControl.disable();
                this.formGroup.disable();
                this.transactionTypeInstance.transaction.isEnquiryFlag = isEnableEnquiry;
            }
        }
    }
    public addDelRiskInfo(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let index = tempRiskInfoArray.length;
        if (data.type === 'add') {
            let riskInfoModel = this.transactionTypeInstance.transaction.riskInfo.getTRLRiskInfoInfoModel();
            if (this.transactionTypeInstance.endtReasonCode === this.transactionTypeInstance.transaction.configService.getCustom('NCPENDT')) {
                riskInfoModel.get('isItemAdded').patchValue(true);
                riskInfoModel.get('isItemDeleted').patchValue(false);
            }
            tempRiskInfoArray.push(this.validator.setQuoteRiskValidators(riskInfoModel, this.multiItemFlag));
            this.setItemNo();

            let addItemDetailsResponse = this.service.addItemDetails({ inputData: this.formGroup.getRawValue(), index: index });
            addItemDetailsResponse.subscribe((addItemDetailsData) => {
                if (addItemDetailsData) {
                    if (addItemDetailsData.error !== null && addItemDetailsData.error !== undefined && addItemDetailsData.error.length >= 1) {
                        this.updateErrorObject(addItemDetailsData);
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    } else {
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    }
                }
            });
        }
        if (data.type === 'del') {
            tempRiskInfoArray.removeAt(data.index);
            this.setItemNo();
            let deleteItemDetailsResponse = this.service.deleteItemDetails({ inputData: this.formGroup.getRawValue(), index: index });
            deleteItemDetailsResponse.subscribe((deleteItemDetailsData) => {
                if (deleteItemDetailsData) {
                    if (deleteItemDetailsData.error !== null && deleteItemDetailsData.error !== undefined && deleteItemDetailsData.error.length >= 1) {
                        this.updateErrorObject(deleteItemDetailsData);
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    } else {
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    }
                }

            });

        }
        if (tempRiskInfoArray.length > 1) {
            this.disableDelRisk = true;
        } else {
            this.disableDelRisk = false;
        }
    }
    public addDelIndividualInfo() {
        let tempFormGroup;
        let riskInfoArray: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        let tempInsuredArray: FormArray;
        let i = 0, numOfInsured: number = 0;
        for (let riskIndex = 0; riskIndex < riskInfoArray.length; riskIndex++) {
            tempFormGroup = riskInfoArray.at(riskIndex);
            numOfInsured = tempFormGroup.get('numOfInsured').value;
            tempInsuredArray = <FormArray>tempFormGroup.get('insuredList');
            if (numOfInsured < tempInsuredArray.length) {
                for (let j = numOfInsured; j < tempInsuredArray.length; j++) {
                    tempInsuredArray.removeAt(j);
                }
            } else if (numOfInsured > tempInsuredArray.length) {
                for (let j = tempInsuredArray.length; j < numOfInsured; j++) {
                    tempInsuredArray.push(this.transactionTypeInstance.transaction.insured.getInsuredInfoModel());
                }
            }
            tempInsuredArray.controls.forEach((i) => i = this.validator.setInsuredWithNomineeValidators(this.formGroup, i));
        }
        this.patchNomineeShareValue();
    }
    public setKeysForNominee() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        //let tempRiskInfoGroup = tempRiskInfoArray.at(0);
        tempRiskInfoArray.controls.forEach(riskElement => {
            let tempInsuredArray: FormArray = <FormArray>riskElement.get('insuredList');
            tempInsuredArray.controls.forEach(element => {
                let nomineeList: FormArray = <FormArray>element.get('nomineeList');
                nomineeList.controls.forEach((ele, index) => {
                    ele.get('appFullName').setValue(ele.get('appFName').value + ' ' + ele.get('appLName').value);
                    ele.get('key').setValue((index + 1).toString());
                });
            });
        });

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
    public addDelNominee(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempRiskInfoGroup = tempRiskInfoArray.at(data.superParentIndex);
        let tempInsuredArray: FormArray = <FormArray>tempRiskInfoGroup.get('insuredList');
        let tempInsuredGroup: FormGroup = <FormGroup>tempInsuredArray.at(data.parentIndex);
        if (data.type === 'add') {
            let tempNomineeList: FormArray = <FormArray>tempInsuredGroup.get('nomineeList');
            tempNomineeList.push(this.validator.setNomineeValidators(this.transactionTypeInstance.transaction.nomineeDetail.getNomineeInfo()));
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
        this.updateRiskDetails(false, dataInput);
        if (this.transactionTypeInstance.isPolicyFlag) {
            this.setInsuredList();
            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
        }
        this.formGroup.controls['riskInfo'].updateValueAndValidity();
        if (dataInput.documentInfo) {
            this.formGroup.controls['documentInfo'] = this.updateDocumentInfo(dataInput);
            this.formGroup.controls['documentInfo'].updateValueAndValidity();
        }
        if (dataInput.referralHistoryInfo) {
            this.formGroup.controls['referralHistoryInfo'] = this.updateReferralHistoryInfo(dataInput);
            this.formGroup.controls['referralHistoryInfo'].updateValueAndValidity();
        }
        return this.formGroup;
    }
    public updateRiskDetails(doItemUpload: boolean = false, dataValInput?) {
        if (!this.transactionTypeInstance.hasStatusNew || doItemUpload) {
            let dataObj = this.transactionTypeInstance.transaction.configService.getCustom(this.transactionTypeInstance.openHeldDataStorageString);
            let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
            dataObj.riskInfo.forEach((riskEle, ri) => {
                if (ri > tempRiskInfoArray.length - 1) tempRiskInfoArray.push(this.transactionTypeInstance.transaction.riskInfo.getTRLRiskInfoInfoModel());
                let tempRiskInfoGroup = tempRiskInfoArray.at(ri);
                let tempInsuredInfoArray = <FormArray>tempRiskInfoGroup.get('insuredList');
                // tempRiskInfoGroup.get('numOfInsured').patchValue(tempInsuredInfoArray.length);
                if (riskEle.insuredList) {
                    riskEle.insuredList.forEach((insuredEle, ii) => {
                        if (ii < tempRiskInfoGroup.get('numOfInsured').value) {
                            if (ii > (tempInsuredInfoArray.length - 1)) tempInsuredInfoArray.push(this.transactionTypeInstance.transaction.insured.getInsuredInfoModel());
                            let tempInsuredInfoGroup = tempInsuredInfoArray.at(ii);
                            let tempNomineeInfoGroup = <FormArray>tempInsuredInfoGroup.get('nomineeList');
                            if (insuredEle.nomineeList) {
                                insuredEle.nomineeList.forEach((nomEle, ni) => {
                                    if (ni > tempNomineeInfoGroup.length - 1) tempNomineeInfoGroup.push(this.transactionTypeInstance.transaction.nomineeDetail.getNomineeInfo());
                                });
                                tempNomineeInfoGroup.patchValue(insuredEle.nomineeList);
                            }
                        }
                    });
                    tempInsuredInfoArray.patchValue(riskEle.insuredList);
                }
            });
            tempRiskInfoArray.patchValue(dataObj.riskInfo);
            let tempFormGroup;
            let riskInfoArray: any = this.formGroup.controls['riskInfo'];
            for (let riskIndex = 0; riskIndex < dataValInput.riskInfo.length; riskIndex++) {
                tempFormGroup = riskInfoArray.at(riskIndex);
                if (dataValInput.riskInfo[riskIndex].countryTravelList && dataValInput.riskInfo[riskIndex].countryTravelList.length > 0) {
                    if (tempFormGroup.controls['countryTravelList'].length > 0) {
                        for (let j = 0; j < tempFormGroup.controls['countryTravelList'].length; j++) {
                            tempFormGroup.controls['countryTravelList'].removeAt(j);
                            j--;
                        }
                    }
                    dataValInput.riskInfo[riskIndex].countryTravelList.forEach((element, index) => {
                        tempFormGroup.controls['countryTravelList'].push(this.transactionTypeInstance.transaction.travelInfo.getTravelInfoModel());
                    });
                    tempFormGroup.controls['countryTravelList'].patchValue(dataValInput.riskInfo[riskIndex].countryTravelList);
                    tempFormGroup.controls['countryTravelList'].updateValueAndValidity();
                } else if (tempFormGroup.controls['countryTravelList'] && tempFormGroup.controls['countryTravelList'].length > 0) {
                    for (let j = 0; j < tempFormGroup.controls['countryTravelList'].length; j++) {
                        tempFormGroup.controls['countryTravelList'].removeAt(j);
                        j--;
                    }
                }
            }



        }
    }

    doItemUpload(file) {
        if (file['files']) {
            this.transactionTypeInstance.transaction.uploadedFileList.push(file['files'][0]);
            let files: File = <File>file['files'][0];
            this.transactionTypeInstance.transaction.fileSize = files.size;
            let uploadDocInfoFormGroup: FormGroup = <FormGroup>this.formGroup.controls['customerInfo'];
            let temp: FormArray = <FormArray>uploadDocInfoFormGroup.controls['attachments'];
            let attachGrp: FormGroup = <FormGroup>temp.controls[0];
            attachGrp.get('documentContent').setErrors(null);
            attachGrp.updateValueAndValidity();
            try {
                let componentObject: TravelComponent = this;
                let fr = new FileReader();
                fr.readAsBinaryString(files);
                fr.onload = function () {
                    attachGrp.get('mimeType').setValue(files.type.toString());
                    attachGrp.get('fileName').setValue(files.name.toString());
                    attachGrp.get('documentContent').setValue(btoa(fr.result.toString()));
                    attachGrp.updateValueAndValidity();
                    let userDetailResponse = componentObject.service.doPopulateInsuredListService(componentObject.formGroup.value);
                    userDetailResponse.subscribe(
                        (itemUploadResponse) => {
                            if (itemUploadResponse.error !== null && itemUploadResponse.error !== undefined && itemUploadResponse.error.length >= 1) {
                                attachGrp.reset();
                                attachGrp.updateValueAndValidity();
                                componentObject.updateErrorObject(itemUploadResponse);
                            } else {
                                componentObject.transactionTypeInstance.transaction.configService.setCustom(componentObject.transactionTypeInstance.openHeldDataStorageString, itemUploadResponse);
                                componentObject.updateRiskDetails(true);
                            }
                            componentObject.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                        }
                    );
                };
            } catch (e) {
                this.transactionTypeInstance.transaction.logger.log(e, 'Error in Upload');
            }
        }
    }
    // - Common Methods for Quote / Policy

    // + Methods specific to quotation

    public quoteSaveOpenheld() {
        let policyPostsResponse = this.service.quoteSaveOpenheldInfo(this.formGroup.value);
        policyPostsResponse.subscribe(
            (quotPostOnCreditInfo) => {
                if (quotPostOnCreditInfo.error !== null && quotPostOnCreditInfo.error !== undefined && quotPostOnCreditInfo.error.length >= 1) {
                    this.updateErrorObject(quotPostOnCreditInfo);
                } else {
                    this.saveModal = true;
                    this.saveModalInsured = true;
                    this.formGroup.patchValue(quotPostOnCreditInfo);
                    this.formGroup.updateValueAndValidity();
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveModal);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }
    public getDefaultValuesInstance() {
        return new TravelDefaultValue(this.transactionTypeInstance.transaction.configService);
    }
    public getQuoteValidator() {
        return new TravelQuoteValidator();
    }
    public saveQuote() {
        //enabling of 'insuredList[0]' which was disabled when 'isPolicyHolderInsured' was selected
        if (this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value) {
            let riskTempFormGroup: any = this.formGroup.controls['riskInfo'];
            let tempFormGroup: any = riskTempFormGroup.at(0).get('insuredList');
            tempFormGroup.at(0).enable();
            tempFormGroup.at(0).patchValue(this.disabledInsuredData);

        }
        this.quoteSaveOpenheld();
    }

    public postQuote() {
        this.quotPostOnCredit();
    }
    public setInsuredTabQuoteValidators() {
        this.formGroup = this.validator.setTravelQuotInsuredValidator(this.formGroup);
        // this.formGroup = this.doDisableInsuredList(this.formGroup);
        let dataObj = this.transactionTypeInstance.transaction.configService.getCustom('openHeld');
        if (dataObj !== undefined && dataObj.riskInfo[0].insuredList && dataObj.riskInfo[0].insuredList.length > 0) {
            let insuredLength = dataObj.riskInfo[0].insuredList.length;
            let tempRiskFormGroup;
            let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
            let riskInfoFormGroup = riskInfoFormArray.at(0);
            tempRiskFormGroup = riskInfoFormGroup;
            for (var i = 1; i < insuredLength; i++) {
                tempRiskFormGroup.controls['insuredList'].push(this.validator.setInsuredValidators(this.formGroup, this.transactionTypeInstance.transaction.insured.getInsuredInfoModel()));
            }
            tempRiskFormGroup.controls['insuredList'].patchValue(dataObj.riskInfo[0].insuredList);
        }
        if (this.formGroup.controls['policyInfo'].get('referralStatus').value === 'B001') {
            this.formGroup.enable();
            this.transactionTypeInstance.transaction.isEnquiryFlag = false;
            let tempRiskFormGroup;
            let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
            let riskInfoFormGroup = riskInfoFormArray.at(0);
            tempRiskFormGroup = riskInfoFormGroup;
            tempRiskFormGroup.get('numberofAdults').patchValue(this.numberOfAdults);
            tempRiskFormGroup.get('numberofAdults').updateValueAndValidity();
            this.formGroup = this.updateInfoValue(this.referralAppRatingResponse);
        }
        // this.updateElements();
        // this.changeRef.markForCheck();
    }

    public doPatchDisabledInsuredData() {
        let travellerType;
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        travellerType = riskInfoArray.at(0).value.travellerTypeCode;
        if (travellerType !== this.travellerTypeCodeIndividual) this.patchInsuredDetails();
    }
    // - Methods specific to quotation
    // + Methods specific to Policy  

    public updateInsuredList(dataValInput) {
        let tempFormGroup;
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        tempFormGroup = riskInfoArray.at(0);
        tempFormGroup.patchValue(dataValInput.riskInfo[0]);
        tempFormGroup.controls['insuredList'].patchValue(dataValInput.riskInfo[0].insuredList);
        tempFormGroup.controls['insuredList'].updateValueAndValidity();
        riskInfoArray.at(0).patchValue(tempFormGroup);
        riskInfoArray.at(0).updateValueAndValidity();
        this.formGroup.controls['riskInfo'] = riskInfoArray;
        this.formGroup.controls['riskInfo'].updateValueAndValidity();
        this.updateCustomerInfoData(dataValInput);
    }
    public updateCustomerInfoData(dataValInput) {
        let tempFormGroup;
        let customerInfoArray: any = this.formGroup.controls['customerInfo'];
        tempFormGroup = customerInfoArray;
        tempFormGroup.patchValue(dataValInput.customerInfo);
        this.formGroup.controls['customerInfo'] = customerInfoArray;
        this.formGroup.controls['customerInfo'].updateValueAndValidity();
    }
    public setInsuredTabPolicyValidators() {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        if (riskInfoArray.at(0).controls['travellerTypeCode'].value === this.travellerTypeCodeIndividual) {
            let changeCoverEndtType = this.transactionTypeInstance.transaction.utilService.getEndorsementTypeCode('CHANGE_INSURED_PERSONAL_DETAILS');
            let endtReasonCode = this.formGroup.controls['policyInfo'].get('endtReasonCode').value;
            if (changeCoverEndtType == endtReasonCode) {
                this.doEndtReasonCode();
                this.updateInsuredList(this.policyRatingData);
                this.transactionTypeInstance.noPaymentRequiredFlag = true;
            }
        } else {
            this.formGroup = this.doDisableInsuredList(this.formGroup);
        }
    }

    public getPolicyValidator() {
        return new TravelPolicyValidator();
    }

    // - Methods specific to Policy
    // + Modal Validator Methods
    public checkReferModal() {
        return (this.formGroup.get('referQuotInfo').get('category').valid &&
            this.formGroup.get('referQuotInfo').get('referralRemarks').valid);
    }
    public checkSaveModal() {
        if (this.transactionTypeInstance.isPolicyFlag) return true;
        if (this.formGroup.get('customerInfo').get('policyHolderType').value === 'I') {
            return (this.formGroup.get('customerInfo').get('appFName').valid &&
                this.formGroup.get('customerInfo').get('appLName').valid &&
                this.formGroup.get('customerInfo').get('mobilePh').valid &&
                this.formGroup.get('customerInfo').get('emailId').valid);
        }
        else {
            return (this.formGroup.get('customerInfo').get('companyName').valid &&
                this.formGroup.get('customerInfo').get('companyRegNumber').valid &&
                this.formGroup.get('customerInfo').get('mobilePh').valid &&
                this.formGroup.get('customerInfo').get('emailId').valid);
        }

    }
    public saveQuoteModalValidation() {
        this.formGroup = this.validator.setTravelQuotInsuredModalValidator(this.formGroup);
    }
    public getRiskInfoModel() {
        return this.transactionTypeInstance.transaction.riskInfo.getTRLRiskInfoInfoModel();
    }
    public addRiskInfo(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let riskInfoModel = this.transactionTypeInstance.transaction.riskInfo.getTRLRiskInfoInfoModel();
        riskInfoModel.get('isItemAdded').patchValue(true);
        riskInfoModel.get('isItemDeleted').patchValue(false);
        tempRiskInfoArray.push(riskInfoModel);
        //tempRiskInfoArray.push(this.validator.setQuoteRiskValidators(riskInfoModel));
        let temp = this.validator.setQuoteRiskValidators(tempRiskInfoArray.at(tempRiskInfoArray.length - 1), this.multiItemFlag);
        tempRiskInfoArray.removeAt(tempRiskInfoArray.length - 1);
        tempRiskInfoArray.insert(tempRiskInfoArray.length, temp);
        this.changeRef.markForCheck();
        for (let i = 0; i < tempRiskInfoArray.length; i++) {
            let tempRiskInfoGroup = tempRiskInfoArray.at(i);
            tempRiskInfoGroup.get('key').patchValue(String(i + 1));
        }
    }
    public setCustomerDetailFromInsured() {
        let appFName = this.riskInfoGroup.get('insuredList').at(0).get('appFName').value;
        let appLName = this.riskInfoGroup.get('insuredList').at(0).get('appLName').value;
        let appFullName = appFName + ' ' + appLName;

        let identityTypeCode = this.riskInfoGroup.get('insuredList').at(0).get('identityTypeCode').value;
        let identityTypeDesc = this.riskInfoGroup.get('insuredList').at(0).get('identityTypeDesc').value;
        let identityNo = this.riskInfoGroup.get('insuredList').at(0).get('identityNo').value;
        let DOB = this.riskInfoGroup.get('insuredList').at(0).get('DOB').value;
        let age = this.riskInfoGroup.get('insuredList').at(0).get('age').value;
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
        }
        this.patchInsuredDetails();
        if (this.multiItemFlag) {
            this.setKeysForNominee();
        }
    }

    public doSetRegionCodeString() {
        let array: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let riskInfoFormGroup;
        let regionArray: string[] = [];
        this.riskInfoGroup = array.at(0);
        for (let j = 0; j < array.length; j++) {
            riskInfoFormGroup = array.at(j);
            regionArray[j] = riskInfoFormGroup.get('regionDesc').value;
        }
        this.region = regionArray.join(' , ');
        if (!this.multiItemFlag) this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.travellingTo, 'param3Info', this.region);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.regionLabel, 'label', this.region);
    }

    public doAddCountryTravelList() {
        let riskInfo: any = this.formGroup.controls['riskInfo'];
        let planInfo: any = this.formGroup.controls['policyInfo'];
        let travellingToCode = riskInfo.at(0).get('travelToCode').value;
        let duplicateFlag: boolean = false;
        let travellingToDesc = riskInfo.at(0).get('travelToDesc').value;
        let startDate = planInfo.get('inceptionDt').value;
        let endDate = planInfo.get('expiryDt').value;




        let countryTravelListFormArray = riskInfo.at(0).get('countryTravelList');

        if (travellingToCode) {
            if (countryTravelListFormArray.length === 0) {
                countryTravelListFormArray.push(this.transactionTypeInstance.transaction.travelInfo.getTravelInfoModel());
            }
            else if ((countryTravelListFormArray.at(countryTravelListFormArray.length - 1).get('travellingToCode').value)) {
                let tempCountryTravelListArrayValue = countryTravelListFormArray.value;
                tempCountryTravelListArrayValue.forEach(element => {
                    if (element.travellingToCode === travellingToCode) {
                        duplicateFlag = true;
                        riskInfo.at(0).get('travelToCode').patchValue('');
                        riskInfo.at(0).get('travelToDesc').patchValue('');
                    }
                });

                if (!duplicateFlag) {
                    countryTravelListFormArray.push(this.transactionTypeInstance.transaction.travelInfo.getTravelInfoModel());
                }
            }
            if (!duplicateFlag) {
                let countryTravelListFormArrayLength = countryTravelListFormArray.length;
                countryTravelListFormArray.at(countryTravelListFormArrayLength - 1).get('key').patchValue(countryTravelListFormArray.length);
                countryTravelListFormArray.at(countryTravelListFormArrayLength - 1).get('startDate').patchValue(startDate);
                countryTravelListFormArray.at(countryTravelListFormArrayLength - 1).get('endDate').patchValue(endDate);
                countryTravelListFormArray.at(countryTravelListFormArrayLength - 1).get('travellingToCode').patchValue(travellingToCode);
                countryTravelListFormArray.at(countryTravelListFormArrayLength - 1).get('travellingToDesc').patchValue(travellingToDesc);
                countryTravelListFormArray.at(countryTravelListFormArrayLength - 1).get('seqNo').patchValue(countryTravelListFormArray.length);
                this.travellingToTableFlag = true;
                riskInfo.at(0).get('travelToCode').patchValue('');
                riskInfo.at(0).get('travelToDesc').patchValue('');
            }
        }
    }

    public doDelCountryTravelList(data) {
        let riskInfoIndex = data.value.parentIndex;
        let delIndex = data.value.index;
        let riskInfo: any = this.formGroup.controls['riskInfo'];
        let countryTravelListFormArray = riskInfo.at(riskInfoIndex).get('countryTravelList');
        countryTravelListFormArray.removeAt(delIndex);
        if (countryTravelListFormArray.length < 1) {
            this.travellingToTableFlag = false;
        }
    }
    changeInNumOfInsured(data) {
        let riskInfo: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        if (data.value) {
            let riskFormGroup = riskInfo.at(parseInt(data.value.index));
            riskFormGroup.get('numberofAdults').setValue(data.value.value);
            riskFormGroup.get('numberofAdults').updateValueAndValidity();
        }
    };
    public disableSaveModal() {
        return (this.formGroup.get('customerInfo').get('appFName').value &&
            this.formGroup.get('customerInfo').get('appLName').value &&
            this.formGroup.get('customerInfo').get('mobilePh').value &&
            this.formGroup.get('customerInfo').get('emailId').value)
    }
    public doSubscribeAfterFormGroupInit() {
        this.doInitRiskInfoGroup();
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
        let tempRiskFormGroup;
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        let riskInfoFormGroup = riskInfoFormArray.at(0);
        tempRiskFormGroup = riskInfoFormGroup;
        let numberofTravellers;
        let total;
        if (!this.multiItemFlag)
            this.transactionTypeInstance.transaction.subscribedMap['travellerTypeCode'] = tempRiskFormGroup.get('travellerTypeCode').valueChanges.subscribe(data => {
                this.validator.doSetUnsetTravellerValidation(tempRiskFormGroup, tempRiskFormGroup.get('travellerTypeCode').value === this.travellerTypeCodeIndividual);
                if (this.formData) this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.totalAdultsCondition, 'condition', this.covertypeSelected());
                this.changeRef.markForCheck();
            });
        this.transactionTypeInstance.transaction.subscribedMap['numberofAdults'] = tempRiskFormGroup.get('numberofAdults').valueChanges.subscribe(data => {
            if (tempRiskFormGroup.get('travellerTypeCode').value !== this.travellerTypeCodeIndividual) {
                this.isRatingFlag = true;
                tempRiskFormGroup.get('numberofChildren').setErrors(null);
                this.changeRef.markForCheck();
                if (data !== undefined && parseInt(data) < 2) {
                    tempRiskFormGroup.get('numberofAdults').setErrors({ 'minNumber': true });
                    this.changeRef.markForCheck();
                }

                if (!(parseInt(tempRiskFormGroup.get('numberofAdults').value)) || parseInt(tempRiskFormGroup.get('numberofAdults').value) <= 0) {
                    if (parseInt(tempRiskFormGroup.get('numberofChildren').value))
                        tempRiskFormGroup.get('numberofChildren').setErrors({ 'required': true });
                }
                this.changeRef.markForCheck();

                if (data && parseInt(data) >= 1) {
                    if (parseInt(tempRiskFormGroup.get('numberofChildren').value) > 0) {
                        total = parseInt(data) + parseInt(tempRiskFormGroup.get('numberofChildren').value);
                    } else {
                        total = parseInt(data);
                    }
                    if (total > 20) {
                        tempRiskFormGroup.get('numberofAdults').setErrors({ 'maxNumber': true });
                        this.changeRef.markForCheck();
                    } else {
                        if (parseInt(tempRiskFormGroup.get('numberofChildren').value) || parseInt(tempRiskFormGroup.get('numberofChildren').value) > 0) {
                            tempRiskFormGroup.get('numberofAdults').setErrors(null);
                        }
                    }

                    tempRiskFormGroup.get('numberofTravellers').patchValue(total);
                    tempRiskFormGroup.get('numberofTravellers').updateValueAndValidity();

                    numberofTravellers = this.formGroup.controls['riskInfo'].value[0].numberofTravellers;
                    if (numberofTravellers < 2) {
                        if (tempRiskFormGroup.get('travellerTypeCode').value !== this.travellerTypeCodeIndividual) {
                            tempRiskFormGroup.get('numberofChildren').setErrors({ 'minNumber': true });
                            // this.changeRef.markForCheck();
                        } else {
                            tempRiskFormGroup.get('numberofChildren').setErrors(null);
                        }

                        // if (!this.transactionTypeInstance.transaction.isEnquiryFlag)
                        //     this.transactionTypeInstance.transaction.isValidForm = this.formGroup.valid;
                        // this.changeRef.markForCheck();
                    }
                } else if (tempRiskFormGroup.get('numberofChildren').value && parseInt(tempRiskFormGroup.get('numberofChildren').value) > 0) {
                    tempRiskFormGroup.get('numberofTravellers').patchValue(parseInt(tempRiskFormGroup.get('numberofChildren').value));
                    tempRiskFormGroup.get('numberofTravellers').updateValueAndValidity();
                    numberofTravellers = this.formGroup.controls['riskInfo'].value[0].numberofTravellers;
                    if (numberofTravellers < 2) {
                        if (tempRiskFormGroup.get('travellerTypeCode').value !== this.travellerTypeCodeIndividual) {
                            tempRiskFormGroup.get('numberofChildren').setErrors({ 'minNumber': true });
                        }
                    }
                    if (!this.transactionTypeInstance.transaction.isEnquiryFlag)
                        this.transactionTypeInstance.transaction.isValidForm = this.formGroup.valid;
                    // this.changeRef.markForCheck();
                }
                // this.changeRef.markForCheck();
            }
            if (!this.transactionTypeInstance.transaction.isEnquiryFlag)
                this.transactionTypeInstance.transaction.isValidForm = this.formGroup.valid;
            this.changeRef.markForCheck();
        });
        this.transactionTypeInstance.transaction.subscribedMap['numberofChildren'] = tempRiskFormGroup.get('numberofChildren').valueChanges.subscribe(data => {

            if (tempRiskFormGroup.get('travellerTypeCode').value !== this.travellerTypeCodeIndividual) {
                this.isRatingFlag = true;
                tempRiskFormGroup.get('numberofChildren').setErrors(null);

                this.changeRef.markForCheck();
                if (data && parseInt(data) < 0) {
                    tempRiskFormGroup.get('numberofChildren').setErrors({ 'maxSize': true });
                    this.changeRef.markForCheck();
                }
                if (data) {
                    if (!(parseInt(tempRiskFormGroup.get('numberofAdults').value)) || parseInt(tempRiskFormGroup.get('numberofAdults').value) <= 0) {
                        tempRiskFormGroup.get('numberofChildren').setErrors({ 'required': true });
                    }
                    this.changeRef.markForCheck();
                }

                if (data && parseInt(data) > 0) {
                    if (parseInt(tempRiskFormGroup.get('numberofAdults').value) > 0) {
                        total = parseInt(data) + parseInt(tempRiskFormGroup.get('numberofAdults').value);
                    } else {
                        total = parseInt(data);
                    }
                    if (total > 20) {
                        tempRiskFormGroup.get('numberofChildren').setErrors({ 'maxNumber': true });
                        this.changeRef.markForCheck();
                    } else if (total < 2) {
                        if (tempRiskFormGroup.get('travellerTypeCode').value !== this.travellerTypeCodeIndividual) {
                            tempRiskFormGroup.get('numberofChildren').setErrors({ 'minNumber': true });
                            this.changeRef.markForCheck();
                        }
                    } else {
                        if (parseInt(tempRiskFormGroup.get('numberofAdults').value) || parseInt(tempRiskFormGroup.get('numberofAdults').value) > 0) {
                            tempRiskFormGroup.get('numberofAdults').setErrors(null);
                        }
                    }
                    tempRiskFormGroup.get('numberofTravellers').patchValue(total);
                    tempRiskFormGroup.get('numberofTravellers').updateValueAndValidity();
                    this.changeRef.markForCheck();
                } else if (tempRiskFormGroup.get('numberofAdults').value && parseInt(tempRiskFormGroup.get('numberofAdults').value) > 0) {
                    tempRiskFormGroup.get('numberofTravellers').patchValue(parseInt(tempRiskFormGroup.get('numberofAdults').value));
                    tempRiskFormGroup.get('numberofTravellers').updateValueAndValidity();
                    numberofTravellers = this.formGroup.controls['riskInfo'].value[0].numberofTravellers;
                    if (numberofTravellers < 2) {
                        if (tempRiskFormGroup.get('travellerTypeCode').value !== this.travellerTypeCodeIndividual) {
                            tempRiskFormGroup.get('numberofChildren').setErrors({ 'minNumber': true });
                            this.changeRef.markForCheck();
                        }
                    }

                    this.changeRef.markForCheck();
                }
            }
            if (!this.transactionTypeInstance.transaction.isEnquiryFlag)
                this.transactionTypeInstance.transaction.isValidForm = this.formGroup.valid;
            this.changeRef.markForCheck();
        });
        let tempFormGroup: FormArray = <FormArray>tempRiskFormGroup.get('insuredList');
        this.transactionTypeInstance.transaction.subscribedMap['insuredList'] = tempRiskFormGroup.controls['insuredList'].valueChanges.subscribe(data => {
            data = tempRiskFormGroup.controls['insuredList'].getRawValue();
            for (let i = 0; i < data.length; i++) {
                if (data[i].appFName && data[i].appLName) {
                    data[i].appFullName = data[i].appFName + ' ' + data[i].appLName;
                }
                data[i].key = String(i + 1);
            }
            this.transactionTypeInstance.transaction.insuredListData = data;
        });



        this.travellingToTableFlag = this.transactionTypeInstance.transaction.isEnquiryFlag;



        this.transactionTypeInstance.transaction.subscribedMap['isPolicyHolderInsured'] = this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').valueChanges.subscribe(data => {
            if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                this.insuredDetails(data);
            }
        });
        this.formGroup.controls['referQuotInfo'].get('attachments').valueChanges.subscribe(data => {
            this.getMimeTypedata(data);
        });

        this.transactionTypeInstance.transaction.subscribedMap['isAllDeclerationsEnabled'] = this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').valueChanges.subscribe(data => {
            this.doAgreeAllDeclerations(data);
        });
    }
    patchNomineeShareValue() {
        let riskTempFormGroup: any = this.formGroup.controls['riskInfo'];
        let tempFormGroup: any = riskTempFormGroup.at(0).get('insuredList');
        if (tempFormGroup && tempFormGroup.length > 0) {
            for (let i = 0; i < tempFormGroup.length; i++) {
                let nomineeList = <FormArray>tempFormGroup.at(i).get('nomineeList');
                nomineeList.at(0).get('nomineeShare').patchValue('100');
            }
        }
    }
    public validateNoOfTravellers() {
        let tempFormGroup;
        let riskInfoArray: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        let tempInsuredArray: FormArray;
        let i = 0, numOfInsured: number = 0;
        for (let riskIndex = 0; riskIndex < riskInfoArray.length; riskIndex++) {
            tempFormGroup = riskInfoArray.at(riskIndex);
            numOfInsured = tempFormGroup.get('numOfInsured').value
            if (numOfInsured < 2) {
                tempFormGroup.get('numOfInsured').setErrors({ 'minNumber': true });
                this.changeRef.markForCheck();
            }
            else {
                tempFormGroup.get('numOfInsured').setErrors(null);
                this.changeRef.markForCheck();
            }
        }
    }
}
