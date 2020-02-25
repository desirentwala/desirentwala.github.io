import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NCPFormUtilsService } from '../../../../../core/ncp-forms/ncp.form.utils';
import { customerService } from '../../../../customer/services/customer.service';
import { UserFormService } from '../../../../userManagement';
import { ElementConstants } from '../../../constants/ncpElement.constants';
import { PolicyTransactionService } from '../../../services/policytransaction.service';
import { QuoteTransactionService } from '../../../services/quotetransaction.service';
import { RenewalTransactionService } from '../../../services/renewalTransaction.service';
import { TransactionComponent } from '../../../transaction.component';
import { PickListService } from './../../../../common/services/picklist.service';
import { FHDefaultValue } from './fh.defaultValues';
import { FireHomePolicyValidator } from './fhPolicy.validator';
import { FireHomeQuoteValidator } from './fhQuote.validator';
import { MaxNumberValidator } from '../../../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { PaymentService } from '../../../../../core/ui-components/payment/payment.service';


/**
 * Component Class for Fire Home Insurance related methods.
 * @implements OnInit, AfterContentInit
 */

@Component({
    template: `
    <button-field *ngIf="isShowBackButton" buttonType="custom" buttonName="NCPBtn.back" buttonClass="ncpbtn-default mr0 t-34" (click)="goBackToPMOV()"></button-field>
    <ncp-errorHandler [isError]="isError" [errors]="errors" [errorInfo]="this.formGroup.get('errorInfo')?.value"> </ncp-errorHandler>
                <ncp-form *ngIf="formData" [formData]="formData"></ncp-form>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FireHomeComponent extends TransactionComponent implements OnInit, AfterContentInit {
    // + flags
    public isPolicyTypeAnnual: boolean = false;
    public isInsuredErrorFlag: boolean = true;
    public doRatingFlagCheckRequired: boolean = false;
    // + Endorsement Specific Variables
    public isEnablePlanTableFlag: boolean = false;
    // + Others
    public hasCustomerCreation: boolean = false;
    public doShowZeroPlanPrems: boolean = true;
    public premiumPrimeFlag: boolean = true;
    public disableAddButton: boolean = true;
    public numOfBuildings: any;
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
        public pickListService: PickListService,
        public paymentService: PaymentService
    ) {
        super(ncpFormService,
            customerService,
            formBuilder,
            changeRef,
            activeRoute,
            userService,
            quoteComponent,
            policyComponent,
            renewalComponent,
            pickListService);
        this.transactionTypeInstance.transaction.lobCode = 'FIRE';
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
            try {
                if (data === 'down')
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.finalPremiumRow, 'rowClass', 'mb20 text-center ml0 mr0 stickTabPremium');
                else if (data === 'up')
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.finalPremiumRow, 'rowClass', 'mb20 text-center ml0 mr0');
                this.changeRef.markForCheck();
            } catch (e) {
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
            this.formGroup = this.transactionTypeInstance.transaction.quoteinfo.getFIRQuoteInfoModel();
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
        this.transactionTypeInstance.transaction.logger.info('Subscriptions destroyed from FHO');
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
            if (data.id === this.eventConstants['setCoverDates']) {
                this.setCoverDates();
            }
            if (data.id === this.eventConstants['doCustomerRefresh']) {
                this.doCustomerRefresh(this.formGroup.controls['customerInfo'], data.id);
            }
            if (data.id === this.eventConstants['postalCodeRefresh']) {
                this.getPostalCodeRefresh();
            }
            if (data.id === this.eventConstants['coverageChanged']) {
                if (data.value.value !== this.transactionTypeInstance.selectedCoverageCode) {
                    this.transactionTypeInstance.isPolicyRatingDone = false;
                    this.transactionTypeInstance.selectedCoverageIndex = data.value.index;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteCalculate, 'isDisabled', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSelectedCover, 'selectedPlanIndex', this.transactionTypeInstance.selectedCoverageIndex);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableListArrayViewButton, 'isDisabled', true);
                }
            }
            if (data.id === this.eventConstants['numbfbuildings']) {
                let numOfBuildings = this.formGroup.controls['policyInfo'].get('numOfBuildings').value
                this.addRiskInfoDetails();
                if (numOfBuildings > 1) {
                    this.formGroup = this.validator.setFHQuoteValidatorBasicForMultiItem(this.formGroup);
                }
            }
            if (data.id === this.eventConstants['coverTypeChanged']) {
                this.riskInfoGroup.controls['plans'].controls.forEach((key, val) => {
                    if (this.riskInfoGroup.controls['plans'].controls.length == 1) {
                        key.value.planTypeCode = this.riskInfoGroup.get('displayPlanTypeCode').value;
                        key.value.planTypeDesc = this.riskInfoGroup.get('displayPlanTypeDesc').value;
                    }
                    key.value.isPlanSelected = (this.riskInfoGroup.controls['plans'].controls.length > 1 ? val === data.value.index : true);
                });
            }
            if (data.id === this.eventConstants['saveQuoteErrorPayment']) {
                this.updateErrorObject(data['value']);
            }
            if ((data.id === this.eventConstants['coverDateChanged'] || data.id === this.eventConstants['setCoverDates'])) {
                this.validateNumberOfdays();
            }
            if (data.id === this.eventConstants['enableAddButton']) {
                let riskInfoArray: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
                riskInfoArray.controls.forEach((key) => {
                    let coverCode = key.get('displayCoverageCode').value;
                    if (coverCode !== '') {
                        this.disableAddButton = false;
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addCoverageItemButton, 'isDisabled', this.disableAddButton);
                    } else {
                        this.disableAddButton = true;
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addCoverageItemButton, 'isDisabled', this.disableAddButton);
                    }
                });
            }
                if (data.id === this.eventConstants['subordinateUsersDropdownChangeId']) {
                    this.getAUXCodeDesc(<FormControl>this.formGroup.controls['policyInfo'].get('agentCd'), <FormControl>this.formGroup.controls['policyInfo'].get('userId'), 'UserPartyId', null, this.productCode, this.formGroup.controls['policyInfo'].get('userId').value, '', this.formGroup.controls['policyInfo'].get('userId').value);
                }
            this.updateElements();
            this.changeRef.markForCheck();
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
            if (data.id === this.eventConstants['policytypeSelected']) {
                this.policytypeSelected(data.value);
                this.validateNumberOfdays();
                this.coverDateChanged();
            }
            if (data.id === this.eventConstants['printDocuments']) {
                this.printModal = true;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
            }
            if (data.id === this.eventConstants['printModalClose']) {
                this.printModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
            }
            if (data.id === this.eventConstants['saveModalClose']) {
                this.saveQuoteModal = false;
                if (this.isCustomerRefreshed) {
                    this.disableCustomerInfo(this.formGroup.controls['customerInfo'], data.id);
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                this.changeRef.markForCheck();
            }
            if (data.id === this.eventConstants['saveModalSave']) {
                this.saveQuoteModal = false;
                this.save();
            }
            if (data.id === this.eventConstants['savedModalClose']) {
                this.saveModal = false;
                this.navigateToHome();
            }
            if (data.id === this.eventConstants['saveModal']) {
                if (!this.disableSaveModal()) {
                    this.saveQuoteModal = true;
                    if (this.isCustomerRefreshed) {
                        this.formGroup.controls['customerInfo'].enable();
                    }
                }
                else {
                    this.saveQuoteModal = false;
                    this.save();
                }
                // this.saveQuoteModalValidation();
            }
            if (data.id === this.eventConstants['printModalClose']) {
                this.printModal = false;
            }
            if (data.id === this.eventConstants['documentQuoteView']) {
                this.quoteDocumentView(data.value);
            }
            if (data.id === this.eventConstants['documentConfirmView']) {
                this.confirmDocumentView(data.value);
            }
            if (data.id === this.eventConstants['quoteCalculate']) {
                if (this.transactionTypeInstance.endorsementType === 'ADD_ITEM') {
                    this.setItemNo();
                }
                let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
                for (let i = 0; i < riskInfoFormArray.length; i++) {
                    let plansFormArray: any = riskInfoFormArray.at(i).controls['plans'];
                    for (let i = 0; i < plansFormArray.length; i++) {
                        let planDetailsFormArray: any = plansFormArray.at(i).controls['planDetails'];
                        for (let i = 0; i < planDetailsFormArray.length; i++) {
                            if (planDetailsFormArray.at(i).get('recalcFlag').value === true) {
                                planDetailsFormArray.at(i).get('recalcFlag').patchValue('Y');
                            }
                            if (planDetailsFormArray.at(i).get('recalcFlag').value === false) {
                                planDetailsFormArray.at(i).get('recalcFlag').patchValue('N');
                            }
                        }
                    }
                }
                this.transactionTypeInstance.isQuoteRatingDone = true;
                this.doRating();
            }
            if (data.id === this.eventConstants['postOnCredit']) {
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
            if (data.id === this.eventConstants['confirmAndPay']) {
			    this.paymentService.disablePaymentButton = true;
                //this.doImmediateSettlement();
                this.quoteValidate();
            }
            if (data.id === this.eventConstants['paymentOptionModalPay']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentoptionModal, 'modalKey', false);
                this.quotPostOnCredit();
            }
            if (data.id === this.eventConstants['paymentOptionModalcancel']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentoptionModal, 'modalKey', false);
            }
            if (data.id === this.eventConstants['onCreditModalClose']) {
                this.onCreditModal = false;
                this.navigateToHome();
            }
            if (data.id === this.eventConstants['viewRelativeCoverages']) {
                this.viewPlansModal = true;
                this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                this.changeRef.markForCheck();
            }
            if (data.id === this.eventConstants['onCreditModalNewQuote']) {
                this.setNewQuoteRoute();
                this.onCreditModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                this.updateElements();
                this.changeRef.markForCheck();
                this.ngOnDestroy();
                this.formGroup.reset();
                this.changeRef.markForCheck();
                this.ngOnInit();
                this.ngAfterContentInit();
                this.changeRef.markForCheck();
            }
            if (data.id === this.eventConstants['postalCodeRefresh']) {
                this.getPostalCodeRefresh();
            }
            if (data.id === this.eventConstants['doCustomerRefresh']) {
                this.formGroup.controls['customerInfo'].get('identityNo').markAsDirty();
                this.formGroup.controls['customerInfo'].get('identityTypeCode').markAsDirty();
                this.doCustomerRefresh(this.formGroup.controls['customerInfo'], data.id);
            }
            if (data.id === this.eventConstants['agentCodeRefresh']) {
                this.getAgentCodeRefresh();
            }
            if (data.id === this.eventConstants['doPolicyRatingBeforePosting']) {
                this.doPolicyRatingBeforePosting();
            }
            if (data.id === this.eventConstants['doPolicyPosting']) {
                this.postPolicy();
            }
            if (data.id === this.eventConstants['referModal']) {
                if (!this.formGroup.controls['referQuotInfo'].get('referTo').value) {
                    this.getToAddressForReferral();
                    this.referModal = true;
                } else {
                    this.referModal = true;
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
            }
            if (data.id === this.eventConstants['referQuoteModalCancel']) {
                this.referModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
            }
            if (data.id === this.eventConstants['successedreferModalClose']) {
                this.referModalkey = false;
                this.changeRef.markForCheck();
                this.navigateToHome();
            }
            if (data.id === this.eventConstants['referQuoteModalRefer']) {
                this.referQuote();
            }
            if (data.id === this.eventConstants['viewPlans']) {
                this.transactionTypeInstance.transaction.selectedRiskIndex = data.value;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansSectNoCompare, 'compareWith', this.transactionTypeInstance.transaction.selectedRiskIndex);
                this.viewPlansModal = true;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                this.changeRef.detectChanges();
                this.updateElements();
            }
            if (data.id === this.eventConstants['closePlanModal']) {
                this.viewPlansModal = false;
                this.updateElements();
            }
            if (data.id === this.eventConstants['addItemDetail']) {
                this.addRiskInfo(data.value);
                let riskInfo = this.formGroup.controls['riskInfo'].value;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoNewArrayCompare, 'compareWith', riskInfo.length.toString());
                this.addItemModal = true;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addItemModalKey, 'modalKey', this.addItemModal);
            }
            if (data.id === this.eventConstants['addItemDetailClose']) {
                let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
                riskInfoFormArray.removeAt(riskInfoFormArray.length - 1);
                this.addItemModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addItemModalKey, 'modalKey', this.addItemModal);
            }
            if (data.id === this.eventConstants['addItemModalSave']) {
                this.addItemDetails();
                this.addItemModal = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addItemModalKey, 'modalKey', this.addItemModal);
            }
            if (data.id === this.eventConstants['removeItemDetail']) {
                this.doRemoveItemList(data.value);
                this.addItemMastertoWork(data.value);
                this.transactionTypeInstance.isPolicyRatingDone = false;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);

            }
            if (data.id === this.eventConstants['policyHolderTypeSelected']) {
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') this.formGroup = this.validator.setFHQuoteCustomerInfoValidator(this.formGroup);
                this.policyHolderTypeSelected(data.value);
            }
            if (data.id === this.eventConstants['closePostingFailedModal']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyFailureModal, 'modalKey', false);
                this.changeRef.markForCheck();
                this.navigateToHome();
            }
            if (data.id === this.eventConstants['addItemCoverage']) {
                this.addDeleteItemCoverage(data, 'add');

            }
            if (data.id === this.eventConstants['deleteItemCoverage']) {
                let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
                for (let i = 0; i < riskInfoFormArray.length; i++) {
                    let plansFormArray: any = riskInfoFormArray.at(i).controls['plans'];
                    for (let i = 0; i < plansFormArray.length; i++) {
                        let planDetailsFormArray: any = plansFormArray.at(i).controls['planDetails'];
                        for (let i = 0; i < planDetailsFormArray.length; i++) {
                            if (planDetailsFormArray.length == 1) {
                                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.showDelBtn, 'isDisabled', true);
                            }
                            else {
                                this.addDeleteItemCoverage(data, 'del');

                            }
                        }
                    }
                }
            }
            if (data.id === this.eventConstants['ccAddressValidationId']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
            }
            if (data.id === this.eventConstants['remarksValidationId']) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
            }
            if (data.id === this.eventConstants['quoteOnCreditModalNewQuote']) {
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
            if (data.id === this.eventConstants['quoteOnCreditModalNewQuote']) {
                this.changeRef.detectChanges();
            }
        }
        });
    }
    public updateElements() {
        if (this.formData) {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.formName, 'formName', this.formGroup);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'importantNotice', this.transactionTypeInstance.transaction.importantNotice);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'warrantyAndDeclaration', this.transactionTypeInstance.transaction.personalDataProtectionActStatement);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'personalDataProtectionActStatement', this.transactionTypeInstance.transaction.warrantyAndDeclaration);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'firstHeading', this.transactionTypeInstance.transaction.firstDeclarationHeading);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'secondHeading', this.transactionTypeInstance.transaction.secondDeclarationHeading);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'thirdHeading', this.transactionTypeInstance.transaction.thirdDeclarationHeading);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentInfoCondition, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentReferenceNoControl, 'hide', this.transactionTypeInstance.transaction.isEnquiryFlag && !(this.formGroup.controls['paymentInfo'].value.paymentReferenceNo));
            if (this.transactionTypeInstance.transaction.status !== 'EndEnquiry') {
                if (this.userType === this.userTypeOperator) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.PolicyAgentCondition, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.AgentCodeCondition, 'isDisabled', false);
                } else {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.PolicyAgentCondition, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.AgentCodeCondition, 'isDisabled', false);
                }
                if (this.multiItemFlag) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'disableNext', !this.transactionTypeInstance.transaction.isValidForm);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'wizardConfig', this.transactionTypeInstance.transaction.wizardConfig);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.basicInfoTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyInfoCondition, 'condition', !this.isPolicyTypeAnnual);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coverDtAnCondition, 'condition', this.isPolicyTypeAnnual);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTabError, 'displayFlag', false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredTabError, 'displayFlag', !this.isInsuredErrorFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralHistoryCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailModalCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteModalCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ZipCodeCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ZipCode, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.covgSi, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteCalculate, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.selectedPlanDesc, 'label', this.selectedPlanDesc);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.selectedPlanPrem, 'label', this.selectedPlanPrem);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCreditCondition, 'condition', !this.transactionTypeInstance.transaction.getIsB2B() ? false : this.transactionTypeInstance.transaction.payByCredit);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNowCondition, 'condition', !this.transactionTypeInstance.transaction.getIsB2B() ? true : this.transactionTypeInstance.transaction.payByCash);
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentDescList, 'valueList', this.docInfoList());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkSaveModalButton, 'isDisabled', !this.checkSaveModal());
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referQuoteModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModalKey, 'modalKey', this.referralHistoryModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailSuccessModalKey, 'modalKey', this.emailSuccessModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralSuccessModalKey, 'modalKey', this.referModalkey);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
                // // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkSaveModalButton, 'isDisabled', !this.checkSaveModal());
                // // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkMailModalButton, 'isDisabled', !this.checkMailModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryCoverDate, 'options', this.setNCPDatePickerToDateOptions());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.incepDateAn, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryDateAn, 'options', this.transactionTypeInstance.transaction.NCPDatePickerToDateAnnualOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.SummaryTable, 'elementFormName', this.formGroup);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.contactNumber, 'isEnquiryFlag', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.contactNumber, 'contactType', 'Phone');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.IdentityNoCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.IdentityNoButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.postalcode, 'acceptPattern', this.zipCodePattern);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralSuccessModalKey, 'modalKey', this.referModalkey);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteModalcondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.corporateCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.SummaryTable, 'transactionType', this.transactionType);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addCoverageItemButton, 'isDisabled', this.disableAddButton);
            }
            if (this.transactionType === 'REN' || this.transactionTypeInstance.isRenewalFlag) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyAndEndtNoElementID, 'label', '   ' + this.formGroup.controls['policyInfo'].get('policyNo').value + ' - ' + this.formGroup.controls['policyInfo'].get('policyEndtNo').value);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteNumber, 'elementFormName', 'policyNo');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalTitle', 'NCPLabel.policySavedSuccessfully');
            }
            this.updateElementsForPolicy();
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
                    this.transactionTypeInstance.transaction.isValidForm = this.formGroup.controls['riskInfo'].valid && this.salesAgentFlag && this.formGroup.controls['policyInfo'].valid;
                    break;
                }
                case '02': {
                    this.premiumPrimeFlag = this.premiumCheck();
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.premiumPrimeTabError, 'displayFlag', !this.premiumPrimeFlag);
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.premiumPrimeFlag;
                    this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation && this.premiumPrimeFlag;
                    break;
                }
                case '03': {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['riskInfo'].valid && this.formGroup.controls['customerInfo'].valid;
                    this.isInsuredErrorFlag = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    break;
                }
                default: {
                    break;
                }
            }
            this.updateElements();
        }
        this.transactionTypeInstance.transaction.isNextFlag = !this.transactionTypeInstance.transaction.isValidForm;
    }
    public onPrevious(event: any): void {
        this.isError = false;
        switch (event.ui.tabId) {
            case '02': {
                this.transactionTypeInstance.transaction.currentTab = '01';
                if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                    this.formGroup = this.validator.clearFHQuotValidatorsBasicDetails(this.formGroup);
                    if (this.transactionTypeInstance.isPolicyFlag)
                        this.doEndtReasonCode();
                }
                break;
            }
            case '03': {
                this.transactionTypeInstance.transaction.currentTab = '02';
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    this.formGroup = this.validator.clearFHQuoteCustomerInfoValidator(this.formGroup);
                }
                break;
            }
            case '04': {
                this.transactionTypeInstance.transaction.currentTab = '03';
                this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').reset();
                this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').updateValueAndValidity();
                break;
            }
            default: {
                break;
            }
        }
        if (this.transactionTypeInstance.isPolicyFlag) this.doEndorsementReasonFormGroupUpdate();
        this.updateElements();
        this.changeRef.markForCheck();
    }
    public onNext(event: any): void {
        switch (event.ui.tabId) {
            case '01': {
                if (this.multiItemFlag) this.setItemNo();
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') this.doRating();
                this.transactionTypeInstance.transaction.currentTab = '02';
                // this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                break;
            }
            case '02': {
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    this.formGroup = this.validator.setFHQuoteCustomerInfoValidator(this.formGroup);
                }
                this.transactionTypeInstance.transaction.currentTab = '03';
                break;
            }
            case '03': {
                this.transactionTypeInstance.transaction.currentTab = '04';
                break;
            }
            default: {
                break;
            }
        }
        this.changeRef.markForCheck();
    }
    public onTabChange(): void {
    }
    saveQuoteModalValidation() {
        // this.formGroup = this.fireHomeQuoteValidator.setPAQuotInsuredModalValidator(this.formGroup);
    }
    policytypeSelected(value?) {
        this.transactionTypeInstance.transaction.isValidForm = true;
        if (value === '01') {
            this.isPolicyTypeAnnual = true;
            this.formGroup.controls['policyInfo'].get('policyTermDesc').patchValue('Annual');
            this.formGroup.controls['policyInfo'].get('policyTermDesc').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(365);
            this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            this.setCoverDates();
            this.coverDateChanged();
        } else {
            this.formGroup.controls['policyInfo'].get('policyTermDesc').patchValue('Short Term');
            this.formGroup.controls['policyInfo'].get('policyTermDesc').updateValueAndValidity();
            this.isPolicyTypeAnnual = false;
            if (this.transactionTypeInstance.transaction.status === 'NewQuote') {
                this.formGroup.controls['policyInfo'].get('durationInDays').reset();
                this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(1);
                this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
                this.setCoverDates();
            }
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
            if (noOfDaysOfToday >= 180) {
                this.formGroup.controls['policyInfo'].get('inceptionDt').setErrors({ 'maxSize': true });
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

            if (this.formGroup.controls['policyInfo'].value.policyTerm === '03') {
                if (tripEndDate < tripStartDate) {
                    tripEndDate = new Date(tripStartDate.valueOf());
                    let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripStartDate), this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripEndDate));
                    noofDays = dateDuration.noOfDays;
                }
                let tripEndString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripEndDate);
                this.formGroup.controls['policyInfo'].get('expiryDt').patchValue(tripEndString);
                this.formGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
                this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(noofDays);
                this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            } else if (this.formGroup.controls['policyInfo'].value.policyTerm === '01') {

                let coverTotimeAnnual = tripStartDate.valueOf() + 364 * 1000 * 60 * 60 * 24;
                let resultcoverToDate = new Date(coverTotimeAnnual);
                let resultedStringDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(resultcoverToDate);

                this.formGroup.controls['policyInfo'].get('expiryDt').patchValue(resultedStringDate);
                this.formGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
            }
        }
        else if (coverFromDate === '' || coverToDate === '') {
            if (this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermAnnul) {
                if (coverFromDate === '') {
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
                if (coverToDate === '') {
                    let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(coverFromDate, coverToDate);
                    tripStartDate = dateDuration.startDate;
                    let coverTotimeAnnual = tripStartDate.valueOf() + 364 * 1000 * 60 * 60 * 24;
                    let resultcoverToDate = new Date(coverTotimeAnnual);
                    let resultedStringDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(resultcoverToDate);
                    this.formGroup.controls['policyInfo'].get('expiryDt').patchValue(resultedStringDate);
                    this.formGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
                }
            }
            else {
                noofDays = 0;
                this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(noofDays);
                this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            }
        }

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

        }
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
        if (lobObject.doShowZeroPlanPrems) this.doShowZeroPlanPrems = lobObject.doShowZeroPlanPrems;
        this.multiItemFlag = lobObject['multiItemFlag'];
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
                this.formGroup = mainFormGroup;
                if (this.transactionTypeInstance.transaction.useLegacy === true) {
                    if (this.transactionTypeInstance.isPolicyFlag === false && !this.transactionTypeInstance.isRenewalFlag) {
                        let defaultValues: Object = lobObject['DEFAULT_VALUES'];
                        this.formGroup = this.defaultValue.setFHQuoteDefaultValues(this.formGroup, this.transactionTypeInstance.transaction.productCode, defaultValues);
                        //this.setAUXCodeDescAfterSettingDefaultValues();
                    }
                } else {
                    //  + calling doPopulateFormGroup(Object, FormGroup) only to update formGroup with default values received
                    //  from productSetup JSON primarily used to default the hidden elements ( fields not present in screen)
                    this.formGroup = this.doPopulateFormGroup(defaultValues, this.formGroup);
                }
                this.coverDateChanged();
                if (this.transactionTypeInstance.transaction.useLegacy === true) {
                    if (!this.transactionTypeInstance.transaction.isEnquiryFlag) this.formGroup = this.validator.setFHQuoteValidatorBasicDetails(this.formGroup, this.productCode);
                }
                this.fetchOpenheldData();
                this.setAUXCodeDescAfterSettingDefaultValues();
                this.transactionTypeInstance.setDeclarations();
                this.setSalesLoginValidator();
                if(this.productCode ==='200'){
                    this.setCollectiveChanges();
                }
                this.updateElements();
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            })
            this.changeRef.markForCheck();
            if (productJSON.observers && productJSON.observers.length > 0) {
                productJSON.observers.pop();
            }
        });
    }

    public getDefaultValuesInstance() {
        return new FHDefaultValue(this.transactionTypeInstance.transaction.configService);
    }
    public getQuoteValidator() {
        return new FireHomeQuoteValidator();
    }
    public getPolicyValidator() {
        return new FireHomePolicyValidator();
    }
    // + Quote Specific Methods   

    // public setUnsetRatingFlag() {
    //     this.formGroup.controls['policyInfo'].get('ratingFlag').setValue(this.transactionTypeInstance.isQuoteRatingDone);
    // }
    public getRiskInfoModel() {
        return this.transactionTypeInstance.transaction.riskInfo.getFIRRiskInfoModel();
    }
    public addRiskInfoDetails() {
        let array: FormArray = <FormArray>this.formGroup.get('policyInfo');
        let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        if (this.formData) {
            if (this.multiItemFlag) {
                let numOfBuildings = this.formGroup.controls['policyInfo'].get('numOfBuildings').value
                if (numOfBuildings > 20) {
                    this.formGroup.controls['policyInfo'].get('numOfBuildings').setErrors({ 'maxSize': true });
                } else {


                    if (numOfBuildings !== this.numOfBuildings) {
                        this.numOfBuildings = numOfBuildings;
                        let num = parseInt(numOfBuildings);
                        if (tempRiskArray.length > num) {
                            let j = tempRiskArray.length - num;
                            for (let i = 0; i < j; i++) {
                                tempRiskArray.removeAt(tempRiskArray.length - 1);
                            }
                        } else if (tempRiskArray.length < num) {
                            let j = num - tempRiskArray.length;
                            for (let i = 0; i < j; i++) {
                                tempRiskArray.push(this.validator.setFHRiskValidator(this.transactionTypeInstance.transaction.riskInfo.getFIRRiskInfoModel()));
                            }
                        }
                        this.setItemNo();
                    }

                    this.updateElements();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            }
        }

    }
    public addRiskInfo(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let riskInfoModel = this.transactionTypeInstance.transaction.riskInfo.getFIRRiskInfoModel();
        riskInfoModel.get('isItemAdded').patchValue(true);
        riskInfoModel.get('isItemDeleted').patchValue(false);
        tempRiskInfoArray.push(riskInfoModel);
        let temp = this.validator.setQuoteRiskValidators(tempRiskInfoArray.at(tempRiskInfoArray.length - 1));
        tempRiskInfoArray.removeAt(tempRiskInfoArray.length - 1);
        tempRiskInfoArray.insert(tempRiskInfoArray.length, temp);
        this.changeRef.markForCheck();
        for (let i = 0; i < tempRiskInfoArray.length; i++) {
            let tempRiskInfoGroup = tempRiskInfoArray.at(i);
            tempRiskInfoGroup.get('key').patchValue(String(i + 1));
        }
    }
    premiumCheck() {
        let amount = this.formGroup.controls['summaryInfo'].get('premiumPrime').value;
        let premiumPrime: boolean = true;
        if (amount === '0.00' || amount === null || amount === undefined) {
            premiumPrime = false;
        } else {
            premiumPrime = true;
        }
        //return premiumPrime;
        return true;

    }
    policyHolderTypeSelected(value?) {
        this.resetCustomerInfo();
        this.resetCustomerCorporateInfo();
        this.formGroup.controls['customerInfo'].enable();
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.corporateCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
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
    setCollectiveChanges(){

    }
    public validateNumberOfdays() {
        if (this.formGroup.controls['policyInfo'].get('policyTerm').value === '01') {
            this.formGroup.controls['policyInfo'].get('durationInDays').reset();
        }
        let noofDays = this.formGroup.controls['policyInfo'].get('durationInDays').value
        if (this.formGroup.controls['policyInfo'].get('policyTerm').value === '03') {
            this.formGroup.controls['policyInfo'].get('durationInDays').setValidators(Validators.compose([MaxNumberValidator.maxNumber(365)]));
        }
    }

    doSubscribeAfterFormGroupInit() {
        this.doInitRiskInfoGroup();
        this.setSelectedPlan();
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
