import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NCPFormUtilsService } from '../../../../../core/ncp-forms/ncp.form.utils';
import { PickListService } from '../../../../common/services/picklist.service';
import { customerService } from '../../../../customer/services/customer.service';
import { UserFormService } from '../../../../userManagement';
import { ElementConstants } from '../../../constants/ncpElement.constants';
import { PolicyTransactionService } from '../../../services/policytransaction.service';
import { QuoteTransactionService } from '../../../services/quotetransaction.service';
import { RenewalTransactionService } from '../../../services/renewalTransaction.service';
import { TransactionComponent } from '../../../transaction.component';
import { PMDefaultValue } from './pm.defaultValues';
import { PersonalMotorQuoteValidator } from './pmQuote.validator';
import { PaymentService } from '../../../../../core/ui-components/payment/payment.service';


/**
 * Component Class for personal Motor Insurance related methods.
 * @implements OnInit, AfterContentInit
 */
@Component({
    template: `
    <button-field *ngIf="isShowBackButton" buttonType="custom" buttonName="NCPBtn.back" buttonClass="ncpbtn-default mr0 t-34" (click)="goBackToPMOV()"></button-field>
    <ncp-errorHandler [isError]="isError" [errors]="errors" [errorInfo]="this.formGroup.get('errorInfo')?.value"> </ncp-errorHandler>
    <ncp-form *ngIf="formData" [formData]="formData"></ncp-form>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalMotorComponent extends TransactionComponent implements OnInit, AfterContentInit {
    isCollapsedTr: boolean;
    // + modalKey booleans
    public quickQuoteModal: boolean = false;
    // + flags
    public isPolicyTypeAnnual: boolean = true;
    public doRatingFlagCheckRequired: boolean = false;
    public isEnablePlanTableFlag: boolean = false;
    public isVehicleFound: boolean = false;
    public expandVehicleDetails = false;
    public hasVehicleModified = false;
    public hasDriverClaimed = false;
    public hasCustomerCreation: boolean = true;
    // + Others
    transactionTypeInstance: any;
    public vehicleMakeCode = '';
    public vehicleModelCode = '';
    public pickListService;
    public tempMotorMake = '';
    constructor(
        public ncpFormService: NCPFormUtilsService,
        public customerService: customerService,
        public formBuilder: FormBuilder,
        public changeRef: ChangeDetectorRef,
        public activeRoute: ActivatedRoute,
        public userService: UserFormService,
        public quoteComponent: QuoteTransactionService,
        public policyComponent: PolicyTransactionService,
        public renewalComponent: RenewalTransactionService,
        pickListService: PickListService,
        public paymentService: PaymentService) {
        super(ncpFormService,
            customerService,
            formBuilder,
            changeRef,
            activeRoute,
            userService,
            quoteComponent,
            policyComponent,
            renewalComponent);
        this.transactionTypeInstance.transaction.lobCode = 'MOTOR';
        this.pickListService = pickListService;
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
		this.paymentService.disablePaymentButton = false;
        this.transactionTypeInstance.transaction.eventHandlerService.pageScrolled.subscribe(data => {
            try{
            if (data === 'down')
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.finalPremiumRow, 'rowClass', 'mb20 text-center ml0 mr0 stickTabPremium');
            else if (data === 'up')
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.finalPremiumRow, 'rowClass', 'mb20 text-center ml0 mr0');
            this.changeRef.markForCheck();
            }catch(e){
                this.transactionTypeInstance.transaction.logger.info('pageScrolled exception');
            }
        });
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
            this.formGroup = this.transactionTypeInstance.transaction.quoteinfo.getMTRQuotInfoModel();
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
                this.coverDateChanged();
            }
            else if (data.id === this.eventConstants['setCoverDates']) {
                this.setCoverDates();
            }
            else if (data.id === this.eventConstants['setMotorMake']) {
                if (data.value) {
                    this.vehicleMakeCode = data.value;
                    if (this.isVehicleFound || (this.riskInfoGroup.get('vehicleModelCode').value && this.riskInfoGroup.get('vehicleManufacturingYear').value)) this.manufacturingYearChanged(data);
                    if (this.tempMotorMake !== data.value) {
                        this.riskInfoGroup.get('vehicleModelCode').patchValue('');
                        this.riskInfoGroup.get('vehicleModelDesc').patchValue('');
                    }
                    this.tempMotorMake = data.value;
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.vehicleModelCode, 'param1', this.vehicleMakeCode);
                }
            }
            else if (data.id === this.eventConstants['setMotorModel']) {
                if (data.value) {
                    this.vehicleModelCode = data.value;
                    if (this.isVehicleFound || (this.riskInfoGroup.get('vehicleMakeCode').value && this.riskInfoGroup.get('vehicleManufacturingYear').value)) this.manufacturingYearChanged(data);
                }
            }
            else if (data.id === this.eventConstants['manufacturingYearChanged']) {
                if (!this.isVehicleFound) this.manufacturingYearChanged(data);
            }
            else if (data.id === this.eventConstants['setCustomerDetails']) {
                if (this.transactionTypeInstance.hasStatusNew) this.setCustomerDetails();
            }
            else if (data.id === this.eventConstants['doCustomerRefresh']) {
                this.doCustomerRefresh(this.formGroup.controls['customerInfo'], data.id);
            }
            else if (data.id === this.eventConstants['postalCodeRefresh']) {
                this.getPostalCodeRefresh();
            }
            else if (data.id === this.eventConstants['toggleVehicleModificationDescription']) {
                this.hasVehicleModified = !this.hasVehicleModified;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.vehicleModCondition, 'condition', this.hasVehicleModified);
            }
            else if (data.id === this.eventConstants['toggleClaimsList']) {
                this.hasDriverClaimed = !this.hasDriverClaimed;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addClaimCondition, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag && this.hasDriverClaimed && this.riskInfoGroup.get('driverClaimsHistory').length < 3);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.driverClaimCondition, 'condition', this.hasDriverClaimed);
            }
            else if (data.id === this.eventConstants['coverTypeChanged']) {
                this.riskInfoGroup.controls['plans'].controls.forEach((key, val) => {
                    if (this.riskInfoGroup.controls['plans'].controls.length == 1) {
                        key.value.planTypeCode = this.riskInfoGroup.get('displayPlanTypeCode').value;
                        key.value.planTypeDesc = this.riskInfoGroup.get('displayPlanTypeDesc').value;
                    }
                    key.value.isPlanSelected = (this.riskInfoGroup.controls['plans'].controls.length > 1 ? val === data.value.index : true);
                });
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
            else if (data.id === this.eventConstants['declarationsChanged']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);
            }
            else if (data.id === this.eventConstants['insuredModalChangesForValidation']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalButton, 'isDisabled', !this.checkSaveModal());
            }
            else if (data.id === this.eventConstants['emailModalChangesForValidation']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkMailModalButton, 'isDisabled', !this.checkMailModal());
            }
            else if (data.id === this.eventConstants['isVehicleHypothecatedChanged']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.hypothecatedCompanyNameCondition, 'condition', this.riskInfoGroup.get('isVehicleHypothecated').value);
            } else if (data.id === this.eventConstants['saveQuoteErrorPayment']) {
                this.updateErrorObject(data['value']);
            }
            else if (data.id === this.eventConstants['ccAddressValidationId']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
            }
            else if (data.id === this.eventConstants['remarksValidationId']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
            }
            else if (data.id === this.eventConstants['subordinateUsersDropdownChangeId']) {
                this.getAUXCodeDesc(<FormControl>this.formGroup.controls['policyInfo'].get('agentCd'), <FormControl>this.formGroup.controls['policyInfo'].get('userId'), 'UserPartyId', null, this.productCode, this.formGroup.controls['policyInfo'].get('userId').value, '', this.formGroup.controls['policyInfo'].get('userId').value);
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
            if (data.id === this.eventConstants['removeInsuredDetail']) {
                this.doRemoveInsuredList(data.value);
            }
            else if (data.id === this.eventConstants['addInsuredDetail']) {
                this.doAddInsuredList();
            }
            else if (data.id === this.eventConstants['deleteClaim']) {
                this.doDeleteClaim(data.value);
            }
            else if (data.id === this.eventConstants['addClaim']) {
                this.doAddClaim();
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
                this.save();
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
            }
            else if (data.id === this.eventConstants['savedQuoteModalClose']) {
                this.saveModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveModal);
                this.navigateToHome();
            }
            else if (data.id === this.eventConstants['saveQuoteModal']) {
                if (!this.disableSaveModal()) {
                    this.saveQuoteModal = true;
                    this.saveQuoteModalValidation();
                    if (this.isCustomerRefreshed) {
                        this.formGroup.controls['customerInfo'].enable();
                    }
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalButton, 'isDisabled', !this.checkSaveModal());
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);

                } else {
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
            else if (data.id === this.eventConstants['getQuickQuote']) {
                this.getQuickQuote();
            }
            else if (data.id === this.eventConstants['successedQuickQuoteModalClose']) {
                this.quickQuoteModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quickQuoteSuccessModalKey, 'modalKey', this.quickQuoteModal);
            }
            else if (data.id === this.eventConstants['policyHolderTypeSelected']) {
                this.policyHolderTypeSelected(data.value);
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
            else if (data.id === this.eventConstants['confirmAndPay']) {
				this.paymentService.disablePaymentButton = true;
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
            else if (data.id === this.eventConstants['quoteCalculate']) {
                this.transactionTypeInstance.isQuoteRatingDone = true;
                this.doRating();
            }
            else if (data.id === this.eventConstants['referQuoteModalRefer']) {
                this.referQuote();
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
                this.ngAfterContentInit();
                this.changeRef.markForCheck();
            }
            else if (data.id === this.eventConstants['doCustomerRefresh']) {
                this.formGroup.controls['customerInfo'].get('identityNo').markAsDirty();
                this.formGroup.controls['customerInfo'].get('identityTypeCode').markAsDirty();
                this.doCustomerRefresh(this.formGroup.controls['customerInfo'], data.id);
            }
            else if (data.id === this.eventConstants['postalCodeRefresh']) {
                this.getPostalCodeRefresh();
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
            else if (data.id === this.eventConstants['closePlanModal']) {
                this.viewPlansModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
            }
            else if (data.id === this.eventConstants['doPolicyRatingBeforePosting']) {
                this.doPolicyRatingBeforePosting();
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
            else if (data.id === this.eventConstants['emailModal']) {
                this.getEmailTemplate();
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailquoteMessage, 'htmlString', this.formGroup.controls['emailQuotInfo'].value.reason);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkMailModalButton, 'isDisabled', !this.checkMailModal());
            }
            else if (data.id === this.eventConstants['emailModalClose']) {
                this.emailModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
            }
            else if (data.id === this.eventConstants['emailQuoteModalMailSend']) {
                this.emailModal = false;
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
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
                        // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailSuccessModalKey, 'modalKey', this.emailSuccessModal);
                    }
                });
            }
            else if (data.id === this.eventConstants['agentCodeRefresh']) {
                this.getAgentCodeRefresh();
            }
            else if (data.id === this.eventConstants['quoteOnCreditModalNewQuote']) {
                this.changeRef.detectChanges();
            }
            else if (data.id === this.eventConstants['onCreditModalNewQuote']) {
                this.changeRef.detectChanges();
            }
            else if (data.id === this.eventConstants['closePostingFailedModal']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyFailureModal, 'modalKey', false);
                this.changeRef.markForCheck();
                this.navigateToHome();
            }
            if (data.id === this.eventConstants['addItemCoverage']) {
                this.addDeleteItemCoverage(data, 'add');

            }
            if (data.id === this.eventConstants['deleteItemCoverage']) {
                this.addDeleteItemCoverage(data, 'del');

            }
        }
        });
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
            if (this.transactionTypeInstance.transaction.status !== 'EndEnquiry') {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.PolicyAgentCondition, 'condition', this.userType === this.userTypeOperator);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'nextTabButton', this.transactionTypeInstance.transaction.currentTab !== '01' || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionType === 'REN_WC' ? 'NCPBtn.next' : 'NCPBtn.compare');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'wizardConfig', this.transactionTypeInstance.transaction.wizardConfig);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.basicInfoTabHeadError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quickQuoteTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.detailedQuoteTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coverageTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.proposalTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.getQuickQuoteButton, 'isDisabled', !this.formGroup.controls['riskInfo'].valid);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteModalCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.covgSi, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addInsuredDetailCondition, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.removeInsuredDetailCondition, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag && this.riskInfoGroup.get('insuredList').length > 1);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.showKeyBenefits, 'isEnquiryFlag', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ZipCodeCondition, 'condition', true && !this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ZipCode, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.formGroup.controls['policyInfo'].get('quoteNo').value);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.formGroup.controls['policyInfo'].get('quoteNo').value);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteButtonModalButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.formGroup.controls['policyInfo'].get('quoteNo').value);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteModalButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteBtn, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag); this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteModalButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocsConditionButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.transaction.isDocumentPresent);
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocsButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.transaction.isDocumentPresent);
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocumentsButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.transaction.isDocumentPresent);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteCalculate, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCreditCondition, 'condition', !this.transactionTypeInstance.transaction.getIsB2B() ? false : this.transactionTypeInstance.transaction.payByCredit);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNowCondition, 'condition', !this.transactionTypeInstance.transaction.getIsB2B() ? true : this.transactionTypeInstance.transaction.payByCash);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quickQuoteSuccessModalKey, 'modalKey', this.quickQuoteModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
                // // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentDescList, 'isDisabled', !this.checkReferModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
                // // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalButton, 'isDisabled', !this.checkMailModal());
                //this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionDate, 'options', this.setNCPDatePickerFromDateOptions());
                //this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryDate, 'options', this.setNCPDatePickerToDateOptions());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionDt, 'options', this.setNCPDatePickerFromDateOptions());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryDt, 'options', this.setNCPDatePickerToDateOptions());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.SummaryTable, 'elementFormName', this.formGroup);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.contactNumber, 'isEnquiryFlag', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.contactNumber, 'contactType', 'Phone');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.IdentityNoCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.IdentityNoButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.postalcode, 'acceptPattern', this.zipCodePattern);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteModalcondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalList, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailquoteMessage, 'htmlString', this.formGroup.controls['emailQuotInfo'].value.reason);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.corporateCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyHolderCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKeyConditionIndividual, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKeyConditionCorporate, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.SummaryTable, 'transactionType', this.transactionType);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.mainDriverDetails, 'enableAddDelBtn', !this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredSummaryCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTypeCorporateCondition, 'condition', (this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O'));
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.corporateDetailsCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'I');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.individualDetailsCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
            }
            if (this.transactionType === 'REN' || this.transactionTypeInstance.isRenewalFlag) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.getQuickQuoteButton, 'buttonClass', 'hidden');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyAndEndtNoElementID, 'label', '   ' + this.formGroup.controls['policyInfo'].get('policyNo').value + ' - ' + this.formGroup.controls['policyInfo'].get('policyEndtNo').value);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteNumber, 'elementFormName', 'policyNo');
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
                    this.updateElements();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    this.transactionTypeInstance.transaction.logger.error('error() ===>', 'errorreferral service' + referralResponse.error);
                } else {
                    this.referModal = false;
                    this.referModalkey = true;
                    this.updateElements();
                    this.changeRef.detectChanges();
                    this.changeRef.markForCheck();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
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
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.selectedPlanDesc, 'label', this.selectedPlanDesc);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.selectedPlanPrem, 'label', this.selectedPlanPrem);
        }
    }

    onValidateTab() {
        if (this.transactionTypeInstance.transaction.isEnquiryFlag) {
            this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = true;
            this.transactionTypeInstance.transaction.isValidForm = true;
        } else {
            this.isError = false;
            switch (this.transactionTypeInstance.transaction.currentTab) {
                case '01': {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['riskInfo'].valid && this.salesAgentFlag && this.formGroup.controls['policyInfo'].valid;
                    this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    break;
                }
                case '02': {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.validatePlanDetail(this.formGroup.value);
                    this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    break;
                }
                case '03': {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['riskInfo'].valid && this.formGroup.controls['policyInfo'].valid && this.salesAgentFlag;
                    this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    break;
                }
                case '04': {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['riskInfo'].valid && this.formGroup.controls['customerInfo'].valid;
                    this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    break;
                }
                default: {
                    break;
                }
            }
        }
        this.transactionTypeInstance.transaction.isNextFlag = !this.transactionTypeInstance.transaction.isValidForm;
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'disableNext', !this.transactionTypeInstance.transaction.isValidForm);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quickQuoteTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.detailedQuoteTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coverageTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.proposalTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);


    }
    public onPrevious(event: any): void {
        this.isError = false;
        switch (event.ui.tabId) {
            case '02': {
                this.transactionTypeInstance.transaction.currentTab = '01';
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry')
                    this.formGroup = this.validator.clearPMQuoteInsuredInfoValidator(this.formGroup);
                break;
            }
            case '03': {
                this.transactionTypeInstance.transaction.currentTab = '02';
                // if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                // this.formGroup = this.validator.clearPMQuotValidatorsBasicDetails(this.formGroup);
                // }
                break;
            }
            case '04': {
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry')
                    this.formGroup = this.validator.clearPMQuoteValidatorProposal(this.formGroup);
                this.transactionTypeInstance.transaction.currentTab = '03';
                this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').reset();
                this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').updateValueAndValidity();
                break;
            }
            default: {
                break;
            }
        }
    }
    public onNext(event: any): void {
        switch (event.ui.tabId) {
            case '01': {
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    if (this.transactionTypeInstance.transaction.status !== 'EndtEnquiry') {
                        this.doRating();
                    } else {
                        this.disableEnableFormData(false);
                        let planTempFormGroup = this.riskInfoGroup;
                        let len = planTempFormGroup.controls['plans'].length;
                        if (this.riskInfoGroup.get('displayPlanTypeCode').value === 'VP1' || this.riskInfoGroup.get('displayPlanTypeCode').value === 'VM1') {
                            if (len > 0) {
                                while (len > 1) {
                                    len--;
                                    // if (planTempFormGroup.controls['plans'].at(len).get('planTypeCode').value && planTempFormGroup.controls['plans'].at(len).get('planTypeCode').value !== 'VP1') {
                                    planTempFormGroup.controls['plans'].removeAt(len);
                                    // }
                                }
                            }
                            this.quoteCalculate(true, true);
                        } else {
                            this.quoteCalculate(true, false);
                        }
                    }
                }
                this.transactionTypeInstance.transaction.currentTab = '02';
                break;
            }
            case '02': {
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    this.formGroup = this.validator.setPMQuoteInsuredInfoValidator(this.formGroup);
                }
                this.transactionTypeInstance.transaction.currentTab = '03';
                break;
            }
            case '03': {
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    this.formGroup = this.validator.setPMQuoteValidatorProposal(this.formGroup);
                    let riskTempFormGroup: any = this.formGroup.controls['riskInfo'];
                    let tempFormGroup: any = riskTempFormGroup.at(0).get('insuredList');
                    let identityTypeCode = tempFormGroup.at(0).get('hasDrivingLicense').value ? 'DL' : 'PP';
                    tempFormGroup.at(0).get('identityTypeCode').setValue(identityTypeCode);
                    this.transactionTypeInstance.transaction.currentTab = '04';
                }
                this.transactionTypeInstance.transaction.currentTab = '04';
                break;
            }
            case '04': {
                this.setCustomerFullName();
                this.transactionTypeInstance.transaction.currentTab = '05';
                break;
            }
            default: {
                break;
            }
        }
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'nextTabButton', this.transactionTypeInstance.transaction.currentTab !== '01' || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionType === 'REN_WC' ? 'NCPBtn.next' : 'NCPBtn.compare');
        // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocsConditionButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.transaction.isDocumentPresent);
        // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocsButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.transaction.isDocumentPresent);
        // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocumentsButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.transaction.isDocumentPresent);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.formGroup.controls['policyInfo'].get('quoteNo').value);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.formGroup.controls['policyInfo'].get('quoteNo').value);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.formGroup.controls['policyInfo'].get('quoteNo').value);
    }
    public onTabChange(): void { }
    public revised(isQuickQuote: boolean) {
        let quotRevisedPriceOutput = this.service.getRevisedPriceInfo(this.formGroup.value);
        quotRevisedPriceOutput.subscribe(
            (rPInfoDataVal) => {
                if (rPInfoDataVal.error !== null && rPInfoDataVal.error !== undefined && rPInfoDataVal.error.length >= 1) {
                    this.updateErrorObject(rPInfoDataVal);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.formGroup.controls['customerInfo'].patchValue(rPInfoDataVal.customerInfo);
                    this.formGroup.controls['customerInfo'].updateValueAndValidity();
                    this.formGroup.controls['policyInfo'].patchValue(rPInfoDataVal.policyInfo);
                    this.formGroup.controls['policyInfo'].updateValueAndValidity();
                    this.updatePlanDatas(rPInfoDataVal);
                    this.formGroup.controls['errorInfo'] = this.updateErrorInfoValue(rPInfoDataVal);
                    this.formGroup.controls['errorInfo'].updateValueAndValidity();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
                if (isQuickQuote) {
                    this.quickQuoteModal = true;
                    this.disableEnableFormData(true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quickQuoteSuccessModalKey, 'modalKey', this.quickQuoteModal);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            });
    }
    public getQuotInfoServices(isQuickQuote: boolean) {
        let quotOutput = this.service.getQuotInfo(this.formGroup.value);
        quotOutput.subscribe(
            (quotInfoDataVal) => {
                if (quotInfoDataVal.error !== null && quotInfoDataVal.error !== undefined && quotInfoDataVal.error.length >= 1) {
                    this.updateErrorObject(quotInfoDataVal);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.formGroup = this.updateInfoValue(quotInfoDataVal);
                    let quotInfoResponseVal = quotInfoDataVal;
                    if (quotInfoResponseVal.documentInfo) {
                        this.transactionTypeInstance.transaction.docInfo = quotInfoResponseVal.documentInfo;
                        this.docInfoView = quotInfoResponseVal.documentInfo;
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
                    }
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
                if (isQuickQuote) {
                    this.quickQuoteModal = true;
                    this.disableEnableFormData(true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quickQuoteSuccessModalKey, 'modalKey', this.quickQuoteModal);
                }
            });
    }
    saveQuoteModalValidation() {
        this.formGroup = this.validator.setPMQuotSaveQuoteModalValidator(this.formGroup);
    }
    public updatePlanDatas(dataValInput, isCalledOnlyForEndorsement = false) {
        let tempFormGroup;
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let travellerType = riskInfoArray.at(0);
        tempFormGroup = travellerType;
        let i = 0;
        if (dataValInput.riskInfo[0].plans.length > tempFormGroup.controls['plans'].length) {
            if (tempFormGroup.controls['plans'].length > 0) {
                for (let j = 0; j < tempFormGroup.controls['plans'].length; j++) {
                    tempFormGroup.controls['plans'].removeAt(j);
                }
            }
            dataValInput.riskInfo[0].plans.forEach((element, index) => {
                tempFormGroup.controls['plans'].push(this.transactionTypeInstance.transaction.plans.getPlanInfoModel());
                if (isCalledOnlyForEndorsement === true)
                    if (element.isPlanSelected) {
                        this.transactionTypeInstance.selectedCoverageCode[0] = element.planTypeCode;
                        this.transactionTypeInstance.selectedCoverageIndex = index;
                    }
                i = tempFormGroup.controls['plans'].length - 1;
                if (element.planDetails !== null && element.planDetails !== undefined) {
                    let planObject: FormArray = <FormArray>tempFormGroup.controls['plans'].at(i);
                    for (let j = 0; j < planObject.controls['planDetails'].length; j++) {
                        planObject.controls['planDetails'].removeAt(j);
                    }
                    element.planDetails.forEach(detail => {
                        tempFormGroup.controls['plans'].at(i).controls['planDetails'].push(this.transactionTypeInstance.transaction.planDetail.getPlanDetailsInfoModel());
                    });
                }
                if (element.policyCovgInfo !== null && element.policyCovgInfo !== undefined) {
                    element.policyCovgInfo.forEach(detail => {
                        // tslint:disable-next-line:max-line-length
                        tempFormGroup.controls['plans'].at(i).controls['policyCovgInfo'].push(this.transactionTypeInstance.transaction.policyCoverageInfo.getPolicyCoverageInfoModel());
                    });
                }
            });


        }
        else if (dataValInput.riskInfo[0].plans.length === 1) {
            if (tempFormGroup.controls['plans'].length > 0) {
                for (let j = 0; j < tempFormGroup.controls['plans'].length; j++) {
                    tempFormGroup.controls['plans'].removeAt(j);
                }
            }
            dataValInput.riskInfo[0].plans.forEach((element, index) => {
                tempFormGroup.controls['plans'].push(this.transactionTypeInstance.transaction.plans.getPlanInfoModel());
                if (isCalledOnlyForEndorsement === true)
                    if (element.isPlanSelected) {
                        this.transactionTypeInstance.selectedCoverageCode[0] = element.planTypeCode;
                        this.transactionTypeInstance.selectedCoverageIndex = index;
                    }
                i = tempFormGroup.controls['plans'].length - 1;
                if (element.planDetails !== null && element.planDetails !== undefined) {
                    let planObject: FormArray = <FormArray>tempFormGroup.controls['plans'].at(i);
                    for (let j = 0; j < planObject.controls['planDetails'].length; j++) {
                        planObject.controls['planDetails'].removeAt(j);
                    }
                    element.planDetails.forEach(detail => {
                        tempFormGroup.controls['plans'].at(i).controls['planDetails'].push(this.transactionTypeInstance.transaction.planDetail.getPlanDetailsInfoModel());
                    });
                }
                if (element.policyCovgInfo !== null && element.policyCovgInfo !== undefined) {
                    element.policyCovgInfo.forEach(detail => {
                        // tslint:disable-next-line:max-line-length
                        tempFormGroup.controls['plans'].at(i).controls['policyCovgInfo'].push(this.transactionTypeInstance.transaction.policyCoverageInfo.getPolicyCoverageInfoModel());
                    });
                }
            });
        }
        if (dataValInput.riskInfo[0].driverClaimsHistory !== undefined && dataValInput.riskInfo[0].driverClaimsHistory.length > tempFormGroup.controls['driverClaimsHistory'].length) {
            if (tempFormGroup.controls['driverClaimsHistory'].length > 0) {
                for (let j = 0; j < tempFormGroup.controls['driverClaimsHistory'].length; j++) {
                    tempFormGroup.controls['driverClaimsHistory'].removeAt(j);
                }
            }
            dataValInput.riskInfo[0].driverClaimsHistory.forEach(element => {
                tempFormGroup.controls['driverClaimsHistory'].push(this.formBuilder.group({
                    claimAmount: [''],
                    claimCount: [''],
                    claimCurrency: [''],
                    claimCurrencyDesc: [''],
                }));
            });
        }
        tempFormGroup.patchValue(dataValInput.riskInfo[0]);
        tempFormGroup.controls['plans'].patchValue(dataValInput.riskInfo[0].plans);
        tempFormGroup.controls['plans'].updateValueAndValidity();
        riskInfoArray.at(0).patchValue(tempFormGroup);
        riskInfoArray.at(0).updateValueAndValidity();
        this.transactionTypeInstance.transaction.eventHandlerService.dataShare.next({ value: dataValInput.riskInfo[0].plans, id: 'coverTable' });
        this.changeRef.markForCheck();
        return riskInfoArray;
    }

    public quoteCalculate(ratingFlag: boolean = true, hasSinglePlan: boolean = true, isQuickQuote: boolean = false) {
        this.formGroup.controls['policyInfo'].get('ratingFlag').setValue(ratingFlag);
        this.formGroup.controls['policyInfo'].get('hasSinglePlan').setValue(hasSinglePlan);
        let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
        if (policyNo) {
            this.revised(isQuickQuote);
        } else {
            this.getQuotInfoServices(isQuickQuote);
        }
    }
    updatePolicyTerm(value?) {
        if (value >= 365) {
            this.isPolicyTypeAnnual = true;
            this.formGroup.controls['policyInfo'].get('policyTerm').patchValue('01');
            this.formGroup.controls['policyInfo'].get('policyTerm').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('policyTermDesc').patchValue('Annual');
            this.formGroup.controls['policyInfo'].get('policyTermDesc').updateValueAndValidity();
        } else {
            this.isPolicyTypeAnnual = false;
            this.formGroup.controls['policyInfo'].get('policyTerm').patchValue('03');
            this.formGroup.controls['policyInfo'].get('policyTerm').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('policyTermDesc').patchValue('Short Term');
            this.formGroup.controls['policyInfo'].get('policyTermDesc').updateValueAndValidity();
        }
    }
    manufacturingYearChanged(data) {
        if (data.value && this.vehicleModelCode && this.vehicleMakeCode) {
            let outputData = [];
            let inputPickList = {
                auxType: "ModelDetails",
                param1: this.vehicleMakeCode,
                param2: this.vehicleModelCode
            }
            let dropdownValus = this.pickListService.getPickList(inputPickList);
            dropdownValus.subscribe(
                (dataVal) => {
                    if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
                        //TODO error Handling 
                    } else {
                        let dataListData = [];
                        let dataList;
                        for (let i = 0; i < dataVal.length; i++) {
                            dataList = { bodyType: '', capCc: '', seatCap: '' };
                            dataList.bodyType = dataVal[i].bodyType;
                            dataList.capCc = dataVal[i].capCc;
                            dataList.seatCap = dataVal[i].seatCap;
                            dataListData[i] = dataList;
                        }
                        if (dataListData.length > 0) {
                            let riskInfoArray: any = this.formGroup.controls['riskInfo'];
                            riskInfoArray.at(0).get('vehicleBodyType').patchValue(dataListData[0].bodyType);
                            riskInfoArray.at(0).get('vehicleCubicCapacity').patchValue(dataListData[0].capCc);
                            riskInfoArray.at(0).get('vehicleSeatingCapacity').patchValue(dataListData[0].seatCap);
                            this.expandVehicleDetails = true;
                            this.isVehicleFound = true;
                            this.disableEnableFormData(true);
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.vehicleBodyTypeCollapse, 'expand', this.expandVehicleDetails || this.transactionTypeInstance.transaction.isEnquiryFlag);
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.vehicleBodyType, 'disabledFlag', this.isVehicleFound);
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.cubicCapacity, 'disabledFlag', this.isVehicleFound);
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.seatCapacity, 'disabledFlag', this.isVehicleFound);
                        }
                    }
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                },
                (error) => {
                    this.transactionTypeInstance.transaction.logger.error(error);
                }
            );
        }
    }
    setCoverDates() {
        let noofDays = this.formGroup.controls['policyInfo'].get('durationInDays').value;
        let tripInceptionDt = this.formGroup.controls['policyInfo'].get('inceptionDt').value;
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
        this.updatePolicyTerm(noofDays);
    }
    coverDateChanged() {
        let coverFromDate = this.formGroup.controls['policyInfo'].value.inceptionDt;
        let coverToDate = this.formGroup.controls['policyInfo'].value.expiryDt;
        let tripStartDate;
        let tripEndDate;
        let noofDays;
        this.formGroup.controls['policyInfo'].get('effectiveDt').patchValue(coverFromDate);
        this.formGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
        if (coverFromDate && coverToDate) {
            let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(coverFromDate, coverToDate);
            tripStartDate = dateDuration.startDate;
            tripEndDate = dateDuration.endDate;
            noofDays = dateDuration.noOfDays;
            this.transactionTypeInstance.transaction.todayString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(this.transactionTypeInstance.transaction.todayDate);
            let dateDurationOfToday = this.transactionTypeInstance.transaction.dateDuration.transform(this.transactionTypeInstance.transaction.todayString, coverFromDate);
            let noOfDaysOfToday = dateDurationOfToday.noOfDays;
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
            // if (this.formGroup.controls['policyInfo'].value.policyTerm === '07') {
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
            this.updatePolicyTerm(noofDays);
        }
        else if (coverFromDate === "" || coverToDate === "") {
            noofDays = 0;
            this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(noofDays);
            this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
        }
    }
    public getQuickQuote() {
        this.disableEnableFormData(false);
        this.onValidateTab();
        if (this.transactionTypeInstance.transaction.isValidForm) {
            let hasSinglePlan: boolean = this.formGroup.controls['policyInfo'].get('policyNo').value ? false : true;
            this.quoteCalculate(true, hasSinglePlan, true);
        }
    }
    public checkSaveModal() {
        if (this.transactionTypeInstance.isPolicyFlag) return true;
        if (this.formGroup.get('customerInfo').get('policyHolderType').value === 'I') {
            return (this.formGroup.get('customerInfo').get('appFName').valid &&
                this.formGroup.get('customerInfo').get('appLName').valid &&
                this.formGroup.get('customerInfo').get('identityNo').valid &&
                this.formGroup.get('customerInfo').get('identityTypeCode').valid &&
                this.formGroup.get('customerInfo').get('DOB').valid &&
                this.formGroup.get('customerInfo').get('mobilePh').valid &&
                this.formGroup.get('customerInfo').get('emailId').valid);
        } else {
            return (this.formGroup.get('customerInfo').get('companyName').valid &&
                this.formGroup.get('customerInfo').get('companyRegNumber').valid &&
                this.formGroup.get('customerInfo').get('mobilePh').valid &&
                this.formGroup.get('customerInfo').get('emailId').valid);
        }
    }
    public setNCPDatePickerFromDateOptions() {
        let quoteFromDateObj = this.transactionTypeInstance.transaction.parseSelectedDate(this.formGroup.controls['policyInfo'].get('inceptionDt').value);
        let day: number = quoteFromDateObj.day - 1;
        let month: number = quoteFromDateObj.month;
        let year: number = quoteFromDateObj.year;
        if (day === 0) {
            day = 31;
            month -= 1;
        }
        if (month === 1) {
            month = 12;
            year -= 1;
        }
        this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions.disabledUntil = { year: year, month: month, day: day, dayTxt: '' };
        return this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions;
    }
    public setNCPDatePickerToDateOptions() {
        let quoteFromDateObj = this.transactionTypeInstance.transaction.parseSelectedDate(this.formGroup.controls['policyInfo'].get('inceptionDt').value);
        let day: number = quoteFromDateObj.day - 1;
        let month: number = quoteFromDateObj.month;
        let year: number = quoteFromDateObj.year;
        if (day === 0) {
            day = 31;
            month -= 1;
        }
        if (month === 1) {
            month = 12;
            year -= 1;
        }
        this.transactionTypeInstance.transaction.NCPDatePickerToDateOptions.disabledUntil = { year: year, month: month, day: day, dayTxt: '' };
        return this.transactionTypeInstance.transaction.NCPDatePickerToDateOptions;
    }
    public doRemoveInsuredList(index: any) {
        let tempRiskFormGroup;
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        let InsuredListFormArray = riskInfoFormArray.at(0).get('insuredList');
        InsuredListFormArray.removeAt(index);
        InsuredListFormArray.updateValueAndValidity();
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.removeInsuredDetailCondition, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag && this.riskInfoGroup.get('insuredList').length > 1);
    }
    public doAddInsuredList() {
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        let InsuredListFormArray = riskInfoFormArray.at(0).get('insuredList');
        InsuredListFormArray.push(this.validator.setInsuredValidators(this.formGroup, this.transactionTypeInstance.transaction.insured.getMotorInsuredInfoModel()));
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.removeInsuredDetailCondition, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag && this.riskInfoGroup.get('insuredList').length > 1);
    }
    public doDeleteClaim(index: any) {
        let tempRiskFormGroup;
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        let InsuredListFormArray = riskInfoFormArray.at(0).get('driverClaimsHistory');
        InsuredListFormArray.removeAt(index);
        InsuredListFormArray.updateValueAndValidity();
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addClaimCondition, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag && this.hasDriverClaimed && this.riskInfoGroup.get('driverClaimsHistory').length < 3);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteClaimCondition, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag && this.riskInfoGroup.get('driverClaimsHistory').length > 1);
    }
    public doAddClaim() {
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        let InsuredListFormArray = riskInfoFormArray.at(0).get('driverClaimsHistory');
        InsuredListFormArray.push(this.formBuilder.group({
            claimAmount: [''],
            claimCount: [''],
            claimCurrency: [''],
            claimCurrencyDesc: [''],
        }));
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addClaimCondition, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag && this.hasDriverClaimed && this.riskInfoGroup.get('driverClaimsHistory').length < 3);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteClaimCondition, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag && this.riskInfoGroup.get('driverClaimsHistory').length > 1);
    }
    public disableEnableFormData(isDisable: boolean = true) {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        switch (this.transactionTypeInstance.transaction.currentTab) {
            case '01': {
                if (isDisable) {
                    let vehicleBodyType = riskInfoArray.at(0).get('vehicleBodyType').value;
                    riskInfoArray.at(0).get('vehicleBodyType').patchValue(vehicleBodyType);
                    riskInfoArray.at(0).get('vehicleBodyType').disable();
                    let vehicleCubicCapacity = riskInfoArray.at(0).get('vehicleCubicCapacity').value;
                    riskInfoArray.at(0).get('vehicleCubicCapacity').patchValue(vehicleCubicCapacity);
                    riskInfoArray.at(0).get('vehicleCubicCapacity').disable();
                    let vehicleSeatingCapacity = riskInfoArray.at(0).get('vehicleSeatingCapacity').value;
                    riskInfoArray.at(0).get('vehicleSeatingCapacity').patchValue(vehicleSeatingCapacity);
                    riskInfoArray.at(0).get('vehicleSeatingCapacity').disable();
                } else {
                    let vehicleBodyType = riskInfoArray.at(0).get('vehicleBodyType').value;
                    riskInfoArray.at(0).get('vehicleBodyType').enable();
                    riskInfoArray.at(0).get('vehicleBodyType').patchValue(vehicleBodyType);
                    let vehicleCubicCapacity = riskInfoArray.at(0).get('vehicleCubicCapacity').value;
                    riskInfoArray.at(0).get('vehicleCubicCapacity').enable();
                    riskInfoArray.at(0).get('vehicleCubicCapacity').patchValue(vehicleCubicCapacity);
                    let vehicleSeatingCapacity = riskInfoArray.at(0).get('vehicleSeatingCapacity').value;
                    riskInfoArray.at(0).get('vehicleSeatingCapacity').enable();
                    riskInfoArray.at(0).get('vehicleSeatingCapacity').patchValue(vehicleSeatingCapacity);
                }
                break;
            }
        }
    }
    public setCustomerDetails() {
        let appFName = this.riskInfoGroup.get('insuredList').at(0).get('appFName').value;
        let appLName = this.riskInfoGroup.get('insuredList').at(0).get('appLName').value;
        let appFullName = appFName + ' ' + appLName;
        let gender = this.riskInfoGroup.get('insuredList').at(0).get('genderCode').value;
        let maritalStatus = this.riskInfoGroup.get('insuredList').at(0).get('maritalStatusCode').value;
        let DOB = this.riskInfoGroup.get('insuredList').at(0).get('DOB').value;
        let age = this.riskInfoGroup.get('insuredList').at(0).get('age').value;
        let hasDrivingLicense = this.riskInfoGroup.get('insuredList').at(0).get('hasDrivingLicense').value;
        if ((this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I') && this.riskInfoGroup.get('isPolicyHolderInsured').value) {
            this.formGroup.controls['customerInfo'].get('appFName').setValue(appFName);
            this.formGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('appLName').setValue(appLName);
            this.formGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('appFullName').setValue(appFullName);
            this.formGroup.controls['customerInfo'].get('appFullName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('gender').setValue(gender);
            this.formGroup.controls['customerInfo'].get('gender').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('maritalStatus').setValue(maritalStatus);
            this.formGroup.controls['customerInfo'].get('maritalStatus').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('DOB').setValue(DOB);
            this.formGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('age').setValue(age);
            this.formGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            if (hasDrivingLicense) {
                this.formGroup.controls['customerInfo'].get('identityTypeCode').setValue('DL');
                this.formGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
                this.formGroup.controls['customerInfo'].get('identityTypeDesc').setValue('DRIVER LICENSE');
                this.formGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
                this.formGroup.controls['customerInfo'].get('identityNo').setValue(this.riskInfoGroup.get('insuredList').at(0).get('identityNo').value);
                this.formGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
            } else {
                this.formGroup.controls['customerInfo'].get('identityTypeCode').setValue('PP');
                this.formGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
                this.formGroup.controls['customerInfo'].get('identityTypeDesc').setValue('PASSPORT');
                this.formGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
                this.formGroup.controls['customerInfo'].get('identityNo').setValue(this.riskInfoGroup.get('insuredList').at(0).get('identityNo').value);
                this.formGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
            }
        } else {
            this.formGroup.controls['customerInfo'].get('appFName').setValue('');
            this.formGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('appLName').setValue('');
            this.formGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('appFullName').setValue('');
            this.formGroup.controls['customerInfo'].get('appFullName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('gender').setValue('');
            this.formGroup.controls['customerInfo'].get('gender').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('maritalStatus').setValue('');
            this.formGroup.controls['customerInfo'].get('maritalStatus').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('DOB').setValue('');
            this.formGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('age').setValue('');
            this.formGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('identityTypeCode').setValue('');
            this.formGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('identityTypeDesc').setValue('');
            this.formGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('identityNo').setValue('');
            this.formGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        }
    }
    /**
     * Loads product json , sets QuoteFormData, calls defaultValues class and does basic details validations one getProductSetup response comes
     * @return {void} 
     */
    public quoteFormDataInit(): void {
        this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
        this.addBreadCrumbRoute();
        let lobObject: any = this.transactionTypeInstance.transaction.getLOBDetailsByLOBCode()[this.productCode];
        this.productCode = lobObject.productCd;
        let templateName = lobObject.templateName;
        if (lobObject.doShowZeroPlanPrems) this.doShowZeroPlanPrems = lobObject.doShowZeroPlanPrems;
        this.addBreadCrumbRoute();
        if (this.transactionTypeInstance.isPolicyFlag) this.transactionTypeInstance.overrideEndorsementElements = lobObject['overrideEndorsementElements'];
        let productJSON = this.transactionTypeInstance.getProductJSON(this.productCode, templateName);
        productJSON.subscribe(data => {
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
                this.formGroup = mainFormGroup;
                if (this.transactionTypeInstance.transaction.useLegacy === true) {
                    if (this.transactionTypeInstance.isPolicyFlag === false && !this.transactionTypeInstance.isRenewalFlag) {
                        let defaultValues: Object = lobObject['DEFAULT_VALUES'];
                        this.formGroup = this.defaultValue.setPMQuoteDefaultValues(this.formGroup, this.transactionTypeInstance.transaction.productCode, defaultValues);
                        //this.setAUXCodeDescAfterSettingDefaultValues();
                    }
                } else {
                    //  + calling doPopulateFormGroup(Object, FormGroup) only to update formGroup with default values received
                    //  from productSetup JSON primarily used to default the hidden elements ( fields not present in screen)
                    this.formGroup = this.doPopulateFormGroup(defaultValues, this.formGroup);
                }
                this.coverDateChanged();
                if (this.transactionTypeInstance.transaction.useLegacy === true) {
                    if (!this.transactionTypeInstance.transaction.isEnquiryFlag) this.formGroup = this.validator.setPMQuoteValidatorBasicDetails(this.formGroup);
                }
                if (!this.transactionTypeInstance.hasStatusNew) {
                    this.fetchOpenheldData();
                    this.hasDriverClaimed = this.riskInfoGroup.controls['hasDriverClaimed'].value;
                    this.hasVehicleModified = this.riskInfoGroup.controls['hasVehicleModified'].value;
                    this.disableEnableFormData(true);
                }
                this.setAUXCodeDescAfterSettingDefaultValues();
                this.transactionTypeInstance.setDeclarations();
                this.setSalesLoginValidator();
                let ncpEndtCode = this.formGroup.controls['policyInfo'].get('ncpEndtReasonCode').value;
                 if(this.transactionTypeInstance.transaction.status === 'EndEnquiry' && ncpEndtCode==='00'){
                    if(this.riskInfoGroup.controls['vehicleDetailsSearchBy'] && this.riskInfoGroup.controls['vehicleDetailsSearchBy'].value==='L'){
                        this.refreshVehicleDetailsByRegNo();
                    }
                }
                this.setCollectiveChanges();
                this.updateElements();
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
            this.changeRef.markForCheck();
            if (productJSON.observers && productJSON.observers.length > 0) {
                productJSON.observers.pop();
            }
        });
    }
    ngOnDestroy() {
        window.scrollTo(150, 150);
        this.transactionTypeInstance.transaction.doDestroyCommonWizardSub();
        this.transactionTypeInstance.transaction.doPopCommonWizardSub();
        this.setDefaultValues();
        this.hasDriverClaimed = false;
        this.hasVehicleModified = false;
        this.isPolicyTypeAnnual = true;
        this.isVehicleFound = false;
        this.expandVehicleDetails = false;
        this.hasCustomerCreation = true;
        this.transactionTypeInstance.transaction.logger.info('Subscriptions destroyed from PMO');
    }
    public setSelectedPlan() {
        // + Store the selectedPlanPrem and selectedPlanDesc    
        this.transactionTypeInstance.transaction.planProcessedSub = this.transactionTypeInstance.transaction.configService.loggerSub.subscribe((data) => {
            if (data === 'planProcessed') {
                if (!this.multiItemFlag) {
                    let plans = this.riskInfoGroup.get('plans').value;
                    if (plans) {
                        plans.forEach(element => {
                            if (element.planTypeDesc && element.isPlanSelected) {
                                this.selectedPlanPrem = element.planPrem;
                                this.selectedPlanDesc = element.planTypeDesc;
                                let selectedPlanDesc = element.planTypeDesc;
                                let selectedPlanPrem = this.transactionTypeInstance.transaction.amtFormat.transform(parseFloat(element.planPrem), []);
                                if (selectedPlanPrem) this.selectedPlanPrem = selectedPlanPrem;
                                this.riskInfoGroup.get('displayPlanTypeCode').patchValue(element.planTypeCode);
                                this.riskInfoGroup.get('displayPlanTypeDesc').patchValue(element.planTypeDesc);
                            }
                        });
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.selectedPlanDesc, 'label', this.selectedPlanDesc);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.selectedPlanPrem, 'label', this.selectedPlanPrem);
                    }
                }
            }
        });
        // - Store the selectedPlanPrem and selectedPlanDesc

    }
    public getDefaultValuesInstance() {
        return new PMDefaultValue(this.transactionTypeInstance.transaction.configService);
    }
    public getQuoteValidator() {
        return new PersonalMotorQuoteValidator();
    }
    public getPolicyValidator() {
        return new PersonalMotorQuoteValidator();
    }
    public getRiskInfoModel() {
        return this.transactionTypeInstance.transaction.riskInfo.getMTRRiskInfoModel();
    }

    public setCustomerDetailFromInsured() {
        let appFName = this.riskInfoGroup.get('insuredList').at(0).get('appFName').value;
        let appLName = this.riskInfoGroup.get('insuredList').at(0).get('appLName').value;
        let appFullName = appFName + ' ' + appLName;
        let gender = this.riskInfoGroup.get('insuredList').at(0).get('genderCode').value;
        let maritalStatus = this.riskInfoGroup.get('insuredList').at(0).get('maritalStatusCode').value;
        let DOB = this.riskInfoGroup.get('insuredList').at(0).get('DOB').value;
        let age = this.riskInfoGroup.get('insuredList').at(0).get('age').value;
        let hasDrivingLicense = this.riskInfoGroup.get('insuredList').at(0).get('hasDrivingLicense').value;
        if ((this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I') && this.riskInfoGroup.get('isPolicyHolderInsured').value) {
            this.formGroup.controls['customerInfo'].get('appFName').setValue(appFName);
            this.formGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('appLName').setValue(appLName);
            this.formGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('appFullName').setValue(appFullName);
            this.formGroup.controls['customerInfo'].get('appFullName').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('gender').setValue(gender);
            this.formGroup.controls['customerInfo'].get('gender').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('maritalStatus').setValue(maritalStatus);
            this.formGroup.controls['customerInfo'].get('maritalStatus').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('DOB').setValue(DOB);
            this.formGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
            this.formGroup.controls['customerInfo'].get('age').setValue(age);
            this.formGroup.controls['customerInfo'].get('age').updateValueAndValidity();
            if (hasDrivingLicense) {
                this.formGroup.controls['customerInfo'].get('identityTypeCode').setValue('DL');
                this.formGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
                this.formGroup.controls['customerInfo'].get('identityTypeDesc').setValue('DRIVER LICENSE');
                this.formGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
                this.formGroup.controls['customerInfo'].get('identityNo').setValue(this.riskInfoGroup.get('insuredList').at(0).get('identityNo').value);
                this.formGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
            } else {
                this.formGroup.controls['customerInfo'].get('identityTypeCode').setValue('PP');
                this.formGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
                this.formGroup.controls['customerInfo'].get('identityTypeDesc').setValue('PASSPORT');
                this.formGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
                this.formGroup.controls['customerInfo'].get('identityNo').setValue(this.riskInfoGroup.get('insuredList').at(0).get('identityNo').value);
                this.formGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
            }
        }
    }
    policyHolderTypeSelected(value) {
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.corporateCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyHolderCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKeyConditionIndividual, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKeyConditionCorporate, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.individualDetailsCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.corporateDetailsCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'I');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredSummaryCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTypeCorporateCondition, 'condition', (this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O'));
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

    setAUXCodeDescAfterSettingDefaultValues() {

    }
    refreshVehicleDetailsByRegNo(){

    }

    doSubscribeAfterFormGroupInit() {
        this.doInitRiskInfoGroup();
        this.setSelectedPlan();
        this.transactionTypeInstance.transaction.subscribedMap['isAllDeclerationsEnabled'] = this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').valueChanges.subscribe(data => {
            this.doAgreeAllDeclerations(data);
        });
    }
    setCollectiveChanges() {

    }
}