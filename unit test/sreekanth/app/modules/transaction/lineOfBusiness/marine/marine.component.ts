import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NCPFormUtilsService } from '../../../../core/ncp-forms/ncp.form.utils';
import { PaymentService } from '../../../../core/ui-components/payment/payment.service';
import { MaxNumberValidator } from '../../../../core/ui-components/validators/maxnumber/maxnumber.validator';
import { customerService } from '../../../customer/services/customer.service';
import { UserFormService } from '../../../userManagement';
import { ElementConstants } from '../../constants/ncpElement.constants';
import { PolicyTransactionService } from '../../services/policytransaction.service';
import { QuoteTransactionService } from '../../services/quotetransaction.service';
import { RenewalTransactionService } from '../../services/renewalTransaction.service';
import { TransactionComponent } from '../../transaction.component';
import { PickListService } from './../../../common/services/picklist.service';
import { MarineDefaultValue } from './marine.defaultValues';
import { MarineQuoteValidator } from './marineQuote.validator';


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
export class MarineComponent extends TransactionComponent implements OnInit, AfterContentInit {
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
        this.transactionTypeInstance.transaction.lobCode = 'MAR';
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
            this.formGroup = this.transactionTypeInstance.transaction.quoteinfo.getMARQuoteInfoModel();
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
        this.transactionTypeInstance.transaction.logger.info('Subscriptions destroyed from MAR');
    }
    public doInitChangeSub() {
        this.transactionTypeInstance.transaction.changeSub = this.transactionTypeInstance.transaction.eventHandlerService.changeSub.subscribe((data) => {
            if (data.id) {
                if (typeof data.id === 'string') {
                    data.id = data.id.toLowerCase();
                } if (data.id === this.eventConstants['policytypeSelected']) {
                    this.policytypeSelected(data.value);

                } else if (data.id === this.eventConstants['inceptionDtChangeId']) {
                    this.coverDateChanged('inception');

                } else if (data.id === this.eventConstants['expiryDtChangeId']) {
                    this.coverDateChanged();

                } else if (data.id === this.eventConstants['setCoverDates']) {
                    this.setCoverDates();

                } else if (data.id === this.eventConstants['doCustomerRefresh']) {
                    this.doCustomerRefresh(this.formGroup.controls['customerInfo'], data.id);

                } else if (data.id === this.eventConstants['postalCodeRefresh']) {
                    this.getPostalCodeRefresh();

                } else if (data.id === this.eventConstants['insuredModalChangesForValidation']) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkSaveModalButton, 'isDisabled', !this.checkSaveModal());

                } else if (data.id === this.eventConstants['isCoInsuranceChangeId']) {
                    this.formGroup.controls['policyInfo'].get('coInsuranceType').setValue('L');
                    this.formGroup.controls['policyInfo'].get('coInsuranceClaim100X').setValue('N');
                    this.formGroup.controls['policyInfo'].get('coInsurancePremium100X').setValue('N');
                    this.formGroup.controls['policyInfo'].get('coInsuranceGrossNet').setValue('G');
                    if (data.value === 'N') {
                        let tempCoinsurerInfoArray: FormArray = <FormArray>this.formGroup.get('coinsurerInfo');
                        for (let i = 0; i < tempCoinsurerInfoArray.length; i++) {
                            tempCoinsurerInfoArray.removeAt(i);
                            i--;
                        }
                    }
                } else if (data.id === this.eventConstants['voyageNumberChangeId']) {
                    let riskInfoObject: FormGroup = <FormGroup>(<FormArray>this.formGroup.get('riskInfo')).at(this.selectedRiskInfoIndex);
                    let voyageNumber = riskInfoObject.get('voyageNumber').value;
                    if (voyageNumber === 'E') {
                        riskInfoObject.get('majorImportingCountryCode').setValue('IRN');
                        this.getAUXCodeDesc(<FormControl>riskInfoObject.get('majorImportingCountryDesc'), <FormControl>riskInfoObject.get('majorImportingCountryCode'), 'MiscInfo', 'CTRY', this.productCode, riskInfoObject.get('majorImportingCountryCode').value);
                        riskInfoObject.get('majorImportingCountryDesc').disable();
                        riskInfoObject.get('majorImportingCountryCode').disable();
                        riskInfoObject.get('majorExportingCountryDesc').enable();
                        riskInfoObject.get('majorExportingCountryCode').enable();
                        riskInfoObject.get('majorExportingCountryCode').setValue('');
                        riskInfoObject.get('majorExportingCountryDesc').setValue('');
                    } else if (voyageNumber === 'I') {
                        riskInfoObject.get('majorExportingCountryCode').setValue('IRN');
                        this.getAUXCodeDesc(<FormControl>riskInfoObject.get('majorExportingCountryDesc'), <FormControl>riskInfoObject.get('majorExportingCountryCode'), 'MiscInfo', 'CTRY', this.productCode, riskInfoObject.get('majorExportingCountryCode').value);
                        riskInfoObject.get('majorExportingCountryDesc').disable();
                        riskInfoObject.get('majorExportingCountryCode').disable();
                        riskInfoObject.get('majorImportingCountryDesc').enable();
                        riskInfoObject.get('majorImportingCountryCode').enable();
                        riskInfoObject.get('majorImportingCountryDesc').setValue('');
                        riskInfoObject.get('majorImportingCountryCode').setValue('');
                    } else if (voyageNumber === 'N') {
                        riskInfoObject.get('majorExportingCountryCode').setValue('IRN');
                        riskInfoObject.get('majorImportingCountryCode').setValue('IRN');
                        this.getAUXCodeDesc(<FormControl>riskInfoObject.get('majorImportingCountryDesc'), <FormControl>riskInfoObject.get('majorImportingCountryCode'), 'MiscInfo', 'CTRY', this.productCode, riskInfoObject.get('majorImportingCountryCode').value);
                        this.getAUXCodeDesc(<FormControl>riskInfoObject.get('majorExportingCountryDesc'), <FormControl>riskInfoObject.get('majorExportingCountryCode'), 'MiscInfo', 'CTRY', this.productCode, riskInfoObject.get('majorExportingCountryCode').value);
                        riskInfoObject.get('majorExportingCountryCode').disable();
                        riskInfoObject.get('majorImportingCountryDesc').disable();
                        riskInfoObject.get('majorImportingCountryCode').disable();
                        riskInfoObject.get('majorImportingCountryDesc').disable();
                    } else {
                        riskInfoObject.get('majorImportingCountryDesc').enable();
                        riskInfoObject.get('majorExportingCountryCode').enable();
                        riskInfoObject.get('majorImportingCountryDesc').enable();
                        riskInfoObject.get('majorImportingCountryCode').enable();
                        riskInfoObject.get('majorImportingCountryDesc').setValue('');
                        riskInfoObject.get('majorExportingCountryCode').setValue('');
                        riskInfoObject.get('majorImportingCountryDesc').setValue('');
                        riskInfoObject.get('majorImportingCountryCode').setValue('');
                    }
                } else if (data.id === this.eventConstants['voyageTypeChangeId']) {
                    let riskInfoObject: FormGroup = <FormGroup>(<FormArray>this.formGroup.get('riskInfo')).at(this.selectedRiskInfoIndex);
                    let voyageType = riskInfoObject.get('voyageType').value;

                    if (voyageType === 'TT03') {
                        riskInfoObject.get('landValidityDays').setValue('60');

                    } else if (voyageType === 'TT04') {
                        riskInfoObject.get('airValidityDays').setValue('30');

                    } else if (voyageType === 'TT01') {
                        riskInfoObject.get('seaValidityDays').setValue('60');

                    } else if (voyageType === 'TT07') {
                        riskInfoObject.get('landValidityDays').setValue('');
                        riskInfoObject.get('airValidityDays').setValue('');
                        riskInfoObject.get('seaValidityDays').setValue('');
                    }

                }
                this.updateElements();
                this.changeRef.markForCheck();
            }
        });
    }

    public doInitClickSub() {
        this.transactionTypeInstance.transaction.clickSub = this.transactionTypeInstance.transaction.eventHandlerService.clickSub.subscribe((data) => {
            if (data.id) {
                if (typeof data.id === 'string') {
                    data.id = data.id.toLowerCase();
                }

                if (data.id === this.eventConstants['policyHolderTypeSelected']) {
                    if (this.transactionTypeInstance.transaction.status !== 'Enquiry') this.formGroup = this.validator.setMarineQuoteCustomerInfoValidator(this.formGroup);
                    this.policyHolderTypeSelected(data.value);

                } else if (data.id === this.eventConstants['saveModal']) {
                    if (!this.disableSaveModal()) {
                        this.saveQuoteModal = true;
                        if (this.isCustomerRefreshed) {
                            this.formGroup.controls['customerInfo'].enable();
                        }
                    } else {
                        this.saveQuoteModal = false;
                        this.save();
                    }

                } else if (data.id === this.eventConstants['printDocuments']) {
                    this.printModal = true;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);

                } else if (data.id === this.eventConstants['postOnCredit']) {
                    this.post();

                } else if (data.id === this.eventConstants['saveModalClose']) {
                    this.saveQuoteModal = false;
                    if (this.isCustomerRefreshed) {
                        this.disableCustomerInfo(this.formGroup.controls['customerInfo'], data.id);
                    }
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                    this.changeRef.markForCheck();

                } else if (data.id === this.eventConstants['saveModalSave']) {
                    this.saveQuoteModal = false;
                    this.save();

                } else if (data.id === 'showEmailPdf') {
                    this.emailPdfDocumentView();

                } else if (data.id === this.eventConstants['emailQuoteModalMailSend']) {
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

                } else if (data.id === this.eventConstants['onCreditModalClose']) {
                    this.onCreditModal = false;
                    this.navigateToHome();

                } else if (data.id === this.eventConstants['onCreditModalNewQuote']) {
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

                } else if (data.id === this.eventConstants['documentQuoteView']) {
                    this.quoteDocumentView(data.value);

                } else if (data.id === this.eventConstants['printModalClose']) {
                    this.printModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);

                } else if (data.id === this.eventConstants['successedEmailModalClose']) {
                    this.emailSuccessModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailSuccessModalKey, 'modalKey', this.emailSuccessModal);
                    this.changeRef.markForCheck();
                    this.navigateToHome();

                } else if (data.id === this.eventConstants['closePostingFailedModal']) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyFailureModal, 'modalKey', false);
                    this.changeRef.markForCheck();
                    this.navigateToHome();

                } else if (data.id === this.eventConstants['quoteOnCreditModalNewQuote']) {
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

                } else if (data.id === this.eventConstants['savedModalClose']) {
                    this.saveModal = false;
                    this.navigateToHome();

                } else if (data.id === this.eventConstants['addItemDetail']) {
                    let itemNo = this.formGroup.controls['policyInfo'].get('itemNo').value;
                    this.addDeleteMultiSectionItem(false, itemNo);

                } else if (data.id === this.eventConstants['editRiskInfoSection']) {
                    this.editRiskInfoSection(data);

                } else if (data.id === this.eventConstants['closeRiskInfoSection']) {
                    this.closeRiskInfoSection();

                } else if (data.id === this.eventConstants['addCoinsurerClickId']) {
                    this.addCoinsurer(data);

                } else if (data.id === this.eventConstants['deleteCoinsurerClickId']) {
                    this.deleteCoinsurer(data);

                } else if (data.id === this.eventConstants['addAdditionalRiskInfo']) {
                    this.addDeleteAdditionalRiskInfo(data, false);

                } else if (data.id === this.eventConstants['deleteAdditionalRiskInfo']) {
                    this.addDeleteAdditionalRiskInfo(data, true);

                } else if (data.id === this.eventConstants['addRiskInfoCoverage']) {
                    this.addDeleteRiskInfoCoverage(data, false);

                } else if (data.id === this.eventConstants['deleteRiskInfoCoverage']) {
                    this.addDeleteRiskInfoCoverage(data, true);

                } else if (data.id === this.eventConstants['editRiskInfoCoverage']) {

                    this.selectedRiskInfoIndex = data.value.superParentIndex;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskDetailsModal, 'modalKey', false);
                    this.editRiskInfoCoverage(data);

                } else if (data.id === this.eventConstants['closeRiskInfoCoverageModal']) {

                    data.value = this.selectedRiskInfoIndex;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoCoverageModalElementId, 'modalKey', false);
                    this.editRiskInfoSection(data);

                } else if (data.id === this.eventConstants['quoteCalculate']) {
                    this.rating();

                } else if (data.id === this.eventConstants['editRiskInfo']) {
                    this.editRiskInfo(data);

                } else if (data.id === this.eventConstants['closeRiskInfoModal']) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoModalElementId, 'modalKey', false);

                } else if (data.id === this.eventConstants['addPolicyCoverage'] && !this.transactionTypeInstance.transaction.isEnquiryFlag) {
                    this.addPolicyCoverage();

                } else if (data.id === this.eventConstants['deletePolicyCoverage'] && !this.transactionTypeInstance.transaction.isEnquiryFlag) {

                    let policyCovgInfo: FormArray = <FormArray>this.formGroup.controls['policyCovgInfo'];
                    policyCovgInfo.removeAt(data.value);

                } else if (data.id === this.eventConstants['addRiskSurveyorDetailsInfo']) {
                    this.addDeleteRiskSurveyorDetailsInfo(data, false);

                } else if (data.id === this.eventConstants['deleteRiskSurveyorDetailsInfo']) {
                    this.addDeleteRiskSurveyorDetailsInfo(data, true);


                } else if (data.id === this.eventConstants['addRiskInfoNomineeList'] && !this.transactionTypeInstance.transaction.isEnquiryFlag) {
                    this.addDeleteRiskInfoNomineeList(data, false);

                } else if (data.id === this.eventConstants['deleteRiskInfoNomineeList'] && !this.transactionTypeInstance.transaction.isEnquiryFlag) {
                    this.addDeleteRiskInfoNomineeList(data, true);

                } else if (data.id === this.eventConstants['deleteRiskInfo']) {
                    let itemNo = <FormGroup>(<FormArray>this.formGroup.controls['riskInfo']).at(data.value).get('itemNo').value;
                    this.addDeleteMultiSectionItem(true, itemNo);

                }
            }
        });
    }
    public updateElements() {
        if (this.formData) {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.formName, 'formName', this.formGroup);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'wizardConfig', this.transactionTypeInstance.transaction.wizardConfig);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkSaveModalButton, 'isDisabled', !this.checkSaveModal());
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveModal);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.isCoInsuranceTrueCondition, 'condition', this.formGroup.controls['policyInfo'].get('isCoInsurance').value === 'Y' ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyHolderIndividualConditionElementId, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I' ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyHolderCorporateConditionElementId, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O' ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag, true);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag, true);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.hideButtonElementId, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag, true);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.disableDeleteButtonElementId, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag, true);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ratingElementId, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteNoElementId, 'label', this.formGroup.controls['policyInfo'].get('status').value === 'PT' ? 'NCPLabel.policyNo' : 'NCPLabel.quoteNo');
            this.setItemNoList();
            this.changeRef.markForCheck();
        }
    }

    onValidateTab() {
        if (this.transactionTypeInstance.transaction.status === 'Enquiry' || this.transactionTypeInstance.isPolicyFlag) {
            this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = true;
            this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
        } else {
            if (this.transactionTypeInstance.transaction.currentTab === '01') {
                this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['policyInfo'].valid;
                this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
            } else if (this.transactionTypeInstance.transaction.currentTab === '02') {
                this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['customerInfo'].valid;
                this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;

            } else if (this.transactionTypeInstance.transaction.currentTab === '03') {
                this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = !this.isError;
                this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
            }
            else if (this.transactionTypeInstance.transaction.currentTab === '04') {
                this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = true;
                this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;

            }
        }
    }
    public onPrevious(event: any): void {
        this.isError = false;
        switch (event.ui.tabId) {
            case '02': {
                this.transactionTypeInstance.transaction.currentTab = '01';
                this.formGroup = this.validator.clearMarineQuoteCustomerInfoValidator(this.formGroup);
                break;
            }
            case '03': {
                this.transactionTypeInstance.transaction.currentTab = '02';

                break;
            }
            case '04': {
                this.transactionTypeInstance.transaction.currentTab = '03';
                break;
            }
            case '05': {
                this.transactionTypeInstance.transaction.currentTab = '04';
                break;
            }
            default: {
                break;
            }
        }
        this.updateElements();
        this.changeRef.markForCheck();
    }
    public onNext(event: any): void {
        switch (event.ui.tabId) {
            case '01': {
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry' && this.formGroup.controls['policyInfo'].get('policyNo').value == '') {
                    this.defaultQuote();
                }
                this.setKeysForCoinsurer();
                this.formGroup = this.validator.setMarineQuoteCustomerInfoValidator(this.formGroup);
                window.scroll(100, 100);
                this.transactionTypeInstance.transaction.currentTab = '02';
                break;
            }
            case '02': {
                this.transactionTypeInstance.transaction.currentTab = '03';
                window.scroll(100, 100);
                break;
            }
            case '03': {
                this.transactionTypeInstance.transaction.currentTab = '04';
                window.scroll(100, 100);
                break;
            }
            case '04': {
                this.transactionTypeInstance.transaction.currentTab = '05';
                window.scroll(100, 100);
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

    public addDeleteRiskInfoNomineeList(data, deleteNominee: boolean) {
        let riskInfoObject: FormGroup = <FormGroup>(<FormArray>this.formGroup.controls['riskInfo']).at(this.selectedRiskInfoIndex);
        let nomineeListArray: FormArray;
        if (riskInfoObject.get('nomineeInfo') === undefined || riskInfoObject.get('nomineeInfo') === null) {
            riskInfoObject.addControl('nomineeInfo', new FormArray([]));
            nomineeListArray = <FormArray>riskInfoObject.get('nomineeInfo');
        } else {
            nomineeListArray = <FormArray>riskInfoObject.get('nomineeInfo');
        }
        if (deleteNominee) {
            nomineeListArray.removeAt(data.value.index);
        } else {
            let nomineeListObject: FormGroup = <FormGroup>this.transactionTypeInstance.transaction.nomineeDetail.getNomineeInfo();
            nomineeListObject.get('policyNo').setValue(this.formGroup.controls['policyInfo'].get('policyNo').value);
            nomineeListObject.get('policyEndtNo').setValue(this.formGroup.controls['policyInfo'].get('policyEndtNo').value);
            nomineeListObject.get('itemNo').setValue(riskInfoObject.get('itemNo').value);
            nomineeListObject.get('sectNo').setValue(riskInfoObject.get('sectNo').value);
            nomineeListObject.get('role').setValue('-');
            nomineeListObject.get('nomineeShareFlag').setValue('A');
            nomineeListArray.push(nomineeListObject);
            this.setSeqNoAndKey(nomineeListArray);
            data.value.index = nomineeListArray.length - 1;
        }
    }

    coverDateChanged(type?) {
        let dateChangedFlag: boolean = false;
        let coverFromDate = this.formGroup.controls['policyInfo'].value.inceptionDt;
        let coverToDate = this.formGroup.controls['policyInfo'].value.expiryDt;
        if ((coverToDate === '' || coverToDate === null || coverToDate === undefined) && (coverFromDate !== '' && coverFromDate !== null && coverFromDate !== undefined)) {
            let setExpiryDuration = this.transactionTypeInstance.transaction.dateDuration.transform(coverFromDate);
            let tempStartDate = setExpiryDuration.startDate;
            coverToDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(new Date(tempStartDate.getFullYear(), 11, 31));
        }
        let startDate, noofDays, durationInDays: number;
        let isLeapYear: boolean = false;
        if (coverFromDate && coverToDate) {
            let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(coverFromDate, coverToDate);
            startDate = dateDuration.startDate;
            noofDays = dateDuration.noOfDays;
            let endDate = dateDuration.endDate;

            let startDateAsString;
            if (startDate <= this.transactionTypeInstance.transaction.todayDate) {
                startDateAsString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(this.transactionTypeInstance.transaction.todayDate);
            } else {
                startDateAsString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(startDate);
            }
            let expiryDateAsString;

            if (noofDays) {
                durationInDays = parseInt(noofDays);
            }
            if (type != null && type === 'inception') {
                let startday = startDate.getDate();
                let lastDay;
                let year: number = startDate.getFullYear() + 1;
                isLeapYear = (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
                lastDay = new Date(startDate.getFullYear() + 1, startDate.getMonth(), 0);
                expiryDateAsString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(lastDay);
                dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(startDateAsString, expiryDateAsString);
                noofDays = dateDuration.noOfDays;
                durationInDays = parseInt(noofDays);
            } else {
                let expiryDate = startDate;
                expiryDate.setDate(startDate.getDate() + durationInDays - 1);
                expiryDateAsString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(expiryDate);
            }

            let tempExpDate = new Date();
            tempExpDate.setMonth(dateDuration.startDate.getMonth() + 1);
            tempExpDate.setDate(dateDuration.startDate.getDate() - 1);
            let tempDays: number = Math.abs(tempExpDate.getTime() - dateDuration.startDate.getTime());
            tempDays = Math.ceil(tempDays / (1000 * 3600 * 24));

            if (startDateAsString != this.formGroup.controls['policyInfo'].get('inceptionDt').value) {
                this.formGroup.controls['policyInfo'].get('inceptionDt').patchValue(startDateAsString);
                this.formGroup.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
                dateChangedFlag = true;
            }
            this.formGroup.controls['policyInfo'].get('effectiveDt').patchValue(startDateAsString);
            this.formGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('proposalDate').patchValue(startDateAsString);
            this.formGroup.controls['policyInfo'].get('proposalDate').updateValueAndValidity();
            if (expiryDateAsString != this.formGroup.controls['policyInfo'].get('expiryDt').value) {
                this.formGroup.controls['policyInfo'].get('expiryDt').patchValue(expiryDateAsString);
                this.formGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
                dateChangedFlag = true;
            }
            if (durationInDays != this.formGroup.controls['policyInfo'].get('durationInDays').value) {
                this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(durationInDays);
                this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
                dateChangedFlag = true
            }
            if (dateChangedFlag) {
                this.setPolicyTerm(durationInDays, isLeapYear, tempDays === durationInDays);
            }
        }
    }

    setCoverDates(isMonthly?: boolean) {
        let noofDays = this.formGroup.controls['policyInfo'].get('durationInDays').value;
        let tripInceptionDt = this.formGroup.controls['policyInfo'].get('inceptionDt').value;
        if (tripInceptionDt) {
            let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(tripInceptionDt);
            let tripInceptionDate = dateDuration.startDate;
            if (noofDays < 1 || noofDays === '') {
                noofDays = 1;
            }
            let tempDays: number;
            if (isMonthly) {
                let tempExpDate = new Date();
                tempExpDate.setMonth(dateDuration.startDate.getMonth() + 1);
                tempExpDate.setDate(dateDuration.startDate.getDate() - 1);
                tempDays = Math.abs(tempExpDate.getTime() - dateDuration.startDate.getTime());
                tempDays = Math.ceil(tempDays / (1000 * 3600 * 24));
                noofDays = tempDays;
            } else {
                noofDays = Math.round(noofDays);
            }
            let noofDaysTime = (1000 * 60 * 60 * 24 * noofDays) - (1000 * 60 * 60 * 24);
            if (tripInceptionDt) {
                this.transactionTypeInstance.transaction.todayDate = new Date();
                this.transactionTypeInstance.transaction.todayDate.setHours(0, 0, 0, 0);
            }
            let tripEndTime = noofDaysTime + tripInceptionDate.valueOf();
            let tripEndDate = new Date(tripEndTime);

            let isLeapYear: boolean = (tripEndDate.getFullYear() % 100 === 0) ? (tripEndDate.getFullYear() % 400 === 0) : (tripEndDate.getFullYear() % 4 === 0);
            let resultedStringDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripEndDate);
            if (resultedStringDate != this.formGroup.controls['policyInfo'].get('expiryDt').value) {
                this.formGroup.controls['policyInfo'].get('expiryDt').patchValue(resultedStringDate);
                this.formGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
            }

            if (tripInceptionDt) {
                this.formGroup.controls['policyInfo'].get('effectiveDt').patchValue(tripInceptionDt);
                this.formGroup.controls['policyInfo'].get('proposalDate').patchValue(tripInceptionDt);
            } else if (this.formGroup.controls['policyInfo'].get('inceptionDt').value != this.transactionTypeInstance.transaction.todayString) {
                this.formGroup.controls['policyInfo'].get('inceptionDt').patchValue(this.transactionTypeInstance.transaction.todayString);
                this.formGroup.controls['policyInfo'].get('effectiveDt').patchValue(this.transactionTypeInstance.transaction.todayString);
                this.formGroup.controls['policyInfo'].get('proposalDate').patchValue(this.transactionTypeInstance.transaction.todayString);
            }
            this.formGroup.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('proposalDate').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(noofDays);
            this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            this.setPolicyTerm(parseInt(noofDays), isLeapYear, tempDays === parseInt(noofDays));
        }
    }


    policytypeSelected(value) {
        this.transactionTypeInstance.transaction.isValidForm = true;
        if (value === '01') {
            this.isPolicyTypeAnnual = true;
            this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(365);
            this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            this.setCoverDates();
        } else if (value === '03') {
            this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(1);
            this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            this.isPolicyTypeAnnual = false;
            this.setCoverDates();
        } else if (value === '06') {
            this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(366);
            this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            this.setCoverDates();
        } else if (value === '08') {
            this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(366);
            this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            this.setCoverDates(true);
        } else if (value === '09') {
            this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(1);
            this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            this.setCoverDates();
        }

    }

    setPolicyTerm(durationInDays, isLeapYear, isMonthly: boolean) {
        if (durationInDays >= 365) {
            if ((!isLeapYear && durationInDays == 365) || (isLeapYear && durationInDays == 366)) {
                this.formGroup.controls['policyInfo'].get('policyTerm').patchValue('01');
                this.formGroup.controls['policyInfo'].get('policyTerm').updateValueAndValidity();
            } else {
                this.formGroup.controls['policyInfo'].get('policyTerm').patchValue('06');
                this.formGroup.controls['policyInfo'].get('policyTerm').updateValueAndValidity();
            }
        } else if (isMonthly) {
            this.formGroup.controls['policyInfo'].get('policyTerm').patchValue('08');
            this.formGroup.controls['policyInfo'].get('policyTerm').updateValueAndValidity();
        } else if (durationInDays === 1) {
            this.formGroup.controls['policyInfo'].get('policyTerm').patchValue('09');
            this.formGroup.controls['policyInfo'].get('policyTerm').updateValueAndValidity();
        } else {
            this.formGroup.controls['policyInfo'].get('policyTerm').patchValue('03');
            this.formGroup.controls['policyInfo'].get('policyTerm').updateValueAndValidity();
        }
        this.getAUXCodeDesc(<FormControl>this.formGroup.controls['policyInfo'].get('policyTermDesc'), <FormControl>this.formGroup.controls['policyInfo'].get('policyTerm'), 'MiscInfo', 'TERM', this.productCode, this.formGroup.controls['policyInfo'].get('policyTerm').value);
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
                        this.formGroup = this.defaultValue.setMarineQuoteDefaultValues(this.formGroup, this.transactionTypeInstance.transaction.productCode, defaultValues);
                        //this.setAUXCodeDescAfterSettingDefaultValues();
                    }
                } else {
                    //  + calling doPopulateFormGroup(Object, FormGroup) only to update formGroup with default values received
                    //  from productSetup JSON primarily used to default the hidden elements ( fields not present in screen)
                    this.formGroup = this.doPopulateFormGroup(defaultValues, this.formGroup);
                }
                this.coverDateChanged();
                if (this.transactionTypeInstance.transaction.useLegacy === true) {
                    if (!this.transactionTypeInstance.transaction.isEnquiryFlag) this.formGroup = this.validator.setMarineQuoteValidatorBasicDetails(this.formGroup, this.productCode);
                }
                this.fetchOpenheldData();
                this.setAUXCodeDescAfterSettingDefaultValues();
                this.transactionTypeInstance.setDeclarations();
                this.setSalesLoginValidator();
                if (this.productCode === '200') {
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
        return new MarineDefaultValue(this.transactionTypeInstance.transaction.configService);
    }

    public getQuoteValidator() {
        return new MarineQuoteValidator();
    }

    public getRiskInfoModel() {
        return this.transactionTypeInstance.transaction.riskInfo.getMARRiskInfoModel();
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
    setCollectiveChanges() {

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

    public addPolicyCoverage() {
        let policyCovgInfoArray: FormArray = <FormArray>this.formGroup.controls['policyCovgInfo'];
        let isCoverageDuplicate: boolean = false;
        for (let i = 0; i < policyCovgInfoArray.length; i++) {
            if (policyCovgInfoArray.at(i).get('covgCd').value === this.formGroup.controls['policyInfo'].get('displayCoverageCode').value) {
                isCoverageDuplicate = true;
                break;
            }
        }
        if (isCoverageDuplicate) {
            this.formGroup.controls['policyInfo'].get('displayCoverageCode').setErrors({ 'pattern': true });
        } else {
            this.formGroup.controls['policyInfo'].get('displayCoverageCode').setErrors(null);
            let picklistInput = { auxType: "CoverageDetails", param1: this.formGroup.controls['policyInfo'].get('displayCoverageCode').value };
            let picklistResponse = this.pickListService.getPickList(picklistInput, null);
            picklistResponse.subscribe(
                (response) => {
                    if (response.error !== null && response.error !== undefined && response.error.length >= 1) {
                        this.isError = true;
                        this.formGroup.controls['policyInfo'].get('displayCoverageCode').setErrors({ 'mismatch': true });
                    } else {
                        this.isError = false;
                        this.formGroup.controls['policyInfo'].get('displayCoverageCode').setErrors(null);
                        this.formGroup.controls['policyInfo'].get('displayCoverageCode').setValue('');
                        this.formGroup.controls['policyInfo'].get('displayCoverageDesc').setValue('');
                        if (response[0]) {
                            let policyCovgObject: FormGroup = <FormGroup>this.transactionTypeInstance.transaction.policyCoverageInfo.getPolicyCoverageInfoModel();
                            policyCovgObject.get('covgDesc').setValue(response[0].coverageCodeDesc);
                            policyCovgObject.get('covgCd').setValue(response[0].coverageCode);
                            policyCovgObject.get('key').setValue(response[0].coverageCode);
                            policyCovgObject.get('covgCat').setValue(response[0].coverageCategory);
                            policyCovgObject.get('covgCatDesc').setValue(response[0].coverageCategoryDesc);
                            policyCovgObject.get('covgRecalculate').setValue(true);
                            policyCovgObject.get('ovFlag').setValue('N');
                            policyCovgObject.get('covgPrm').setValue('0');
                            policyCovgObject.get('covgSi').setValue('0');
                            policyCovgObject.get('covgRt').setValue('0.0');
                            policyCovgInfoArray.push(policyCovgObject);
                        }
                    }
                });
        }
    }


    public editRiskInfo(data) {
        let riskInfoObject: FormGroup = <FormGroup>(<FormArray>this.formGroup.controls['riskInfo']).at(data.index);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoModalElementId, 'modalTitle', riskInfoObject.get('sectClDesc').value);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoModalElementId, 'modalKey', true);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoModalIndexElementId, 'compareWith', data.value.index);
        this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
        this.updateElements();
        window.scroll(100, 100)
        this.changeRef.markForCheck();
    }

    public editRiskInfoSection(data) {
        this.selectedRiskInfoIndex = data.value;
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.isPlanSelectedCompareQuote2, 'compareWith', this.selectedRiskInfoIndex);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskDetailsModal, 'modalKey', true);
        this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
        this.updateElements();
        window.scroll(100, 100);
        this.changeRef.markForCheck();
    }

    public addDeleteRiskInfoCoverage(data, deleteCoverage: boolean) {
        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
            let riskInfoObject: FormGroup = <FormGroup>(<FormArray>this.formGroup.controls['riskInfo']).at(data.value.superParentIndex);
            let planDetailsArray: FormArray = <FormArray>(<FormArray>riskInfoObject.get('plans')).at(0).get('planDetails');
            if (deleteCoverage) {
                planDetailsArray.removeAt(data.value.index)
            } else {
                let isCoverageDuplicate: boolean = false;
                for (let i = 0; i < planDetailsArray.length; i++) {
                    if (planDetailsArray.at(i).get('covgCd').value === riskInfoObject.get('displayCoverageCode').value) {
                        isCoverageDuplicate = true;
                        break;
                    }
                }
                if (isCoverageDuplicate) {
                    riskInfoObject.get('displayCoverageCode').setErrors({ 'pattern': true });
                } else {
                    riskInfoObject.get('displayCoverageCode').setErrors(null);
                    let picklistInput = { auxType: "CoverageDetails", param1: riskInfoObject.get('displayCoverageCode').value };
                    let defDetails = this.pickListService.getPickList(picklistInput, null);
                    defDetails.subscribe(
                        (response) => {
                            if (response.error !== null && response.error !== undefined && response.error.length >= 1) {
                                this.isError = true;
                                riskInfoObject.get('displayCoverageCode').setErrors({ 'mismatch': true });
                            } else {
                                this.isError = false;
                                riskInfoObject.get('displayCoverageCode').setErrors(null);
                                riskInfoObject.get('displayCoverageCode').setValue('');
                                riskInfoObject.get('displayCoverageDesc').setValue('');
                                if (response[0]) {
                                    let planDetailsObject: FormGroup = <FormGroup>this.transactionTypeInstance.transaction.planDetail.getPlanDetailsInfoModel();
                                    planDetailsObject.get('covgDesc').setValue(response[0].coverageCodeDesc);
                                    planDetailsObject.get('covgCd').setValue(response[0].coverageCode);
                                    planDetailsObject.get('key').setValue(response[0].coverageCode);
                                    planDetailsObject.get('category').setValue(response[0].coverageCategory);
                                    planDetailsObject.get('coverageGrpCode').setValue(response[0].coverageGroupCode);
                                    planDetailsObject.get('policyNo').setValue(this.formGroup.controls['policyInfo'].get('policyNo').value);
                                    planDetailsObject.get('policyEndtNo').setValue(this.formGroup.controls['policyInfo'].get('policyEndtNo').value);
                                    planDetailsObject.get('PremCurr').setValue(this.formGroup.controls['policyInfo'].get('PremCurr').value);
                                    planDetailsObject.get('PremCurrRt').setValue(this.formGroup.controls['policyInfo'].get('PremCurrRt').value);
                                    planDetailsObject.get('siCurr').setValue(this.formGroup.controls['policyInfo'].get('siCurr').value);
                                    planDetailsObject.get('siCurrRate').setValue(this.formGroup.controls['policyInfo'].get('siCurrRt').value);
                                    planDetailsObject.get('itemNo').setValue(riskInfoObject.get('itemNo').value);
                                    planDetailsObject.get('sectNo').setValue(riskInfoObject.get('sectNo').value);
                                    planDetailsObject.get('subItemNo').setValue(riskInfoObject.get('subItemNo').value);
                                    planDetailsObject.get('subSectionNo').setValue(riskInfoObject.get('subSectionNo').value);
                                    planDetailsObject.get('recalcFlag').setValue(true);
                                    planDetailsObject.get('ovFlag').setValue('N');
                                    planDetailsObject.get('covgPrm').setValue('0');
                                    planDetailsObject.get('covgSi').setValue('0');
                                    planDetailsObject.get('rateText').setValue('0.0');
                                    planDetailsArray.push(planDetailsObject);
                                }
                            }
                        });
                }
            }
        }
    }

    public editRiskInfoCoverage(data) {
        this.selectedRiskInfoIndex = data.value.superParentIndex;
        this.selectedPlanDetailsIndex = data.value.index;
        let riskInfoObject: FormGroup = <FormGroup>(<FormArray>this.formGroup.controls['riskInfo']).at(data.value.superParentIndex);
        let planDetailsObject: FormGroup = <FormGroup>(<FormArray>(<FormArray>riskInfoObject.get('plans')).at(0).get('planDetails')).at(data.value.index);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoCoverageModalElementId, 'modalTitle', planDetailsObject.get('covgDesc').value);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoCoverageModalElementId, 'modalKey', true);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCoverageModalRiskInfoIndexElementId, 'compareWith', data.value.superParentIndex);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCoverageModalPlanDetailsIndexElementId, 'compareWith', data.value.index);
        this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
        this.updateElements();
        window.scroll(100, 100);
        this.changeRef.markForCheck();
    }

    public defaultQuote() {
        let quotOutput = this.service.getQuotInfo(this.formGroup.getRawValue());
        quotOutput.subscribe(
            (defaultResponse) => {
                if (defaultResponse.error !== null && defaultResponse.error !== undefined && defaultResponse.error.length > 0) {
                    this.updateErrorObject(defaultResponse);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.updateFormGroup(defaultResponse);
                    this.transactionTypeInstance.transaction.docInfo = defaultResponse.documentInfo;
                    let response = this.service.quoteSaveOpenheldInfo(this.formGroup.getRawValue());
                    response.subscribe(
                        (quotSaveResponse) => {
                            if (quotSaveResponse.error !== null && quotSaveResponse.error !== undefined && quotSaveResponse.error.length > 0) {
                                this.updateErrorObject(quotSaveResponse);
                            } else {
                                this.updateFormGroup(defaultResponse);
                            }
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                            this.updateElements();
                        });
                }
            });
    }

    public rating(isCoverCodeBasedRating?) {
        let inputJSON = this.formGroup.getRawValue();
        inputJSON.isCoverCodeBasedRating = false;
        let revisedPriceOutput = this.service.getRevisedPriceInfo(inputJSON);
        revisedPriceOutput.subscribe(
            (policyResponse) => {
                if (policyResponse.error !== null && policyResponse.error !== undefined && policyResponse.error.length >= 1) {
                    this.updateErrorObject(policyResponse);
                } else {
                    this.isError = false;
                    this.updateFormGroup(policyResponse);
                    this.transactionTypeInstance.transaction.docInfo = policyResponse.documentInfo;
                }
                window.scroll(100, 100);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }

    public doCustomerRefresh(formGroup, id?) {
        let refreshCustomerFlag: boolean = false;
        let inputJSON = { 'appRole': '', 'identityNo': null, 'companyRegNumber': null };
        if (formGroup.get('policyHolderType').value === 'I' && formGroup.get('identityNo').value) {
            inputJSON.appRole = 'ICR';
            inputJSON.identityNo = formGroup.get('identityNo').value;
            refreshCustomerFlag = true;
        } else if (formGroup.get('policyHolderType').value === 'O' && formGroup.get('companyRegNumber').value) {
            inputJSON.appRole = 'CCR';
            inputJSON.companyRegNumber = formGroup.get('companyRegNumber').value;
            refreshCustomerFlag = true;
        }
        if (refreshCustomerFlag) {
            let customerInfoResponse = this.service.doCustomerRefresh(inputJSON);
            customerInfoResponse.subscribe((data) => {
                if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
                    this.resetCustomerInfoIdentity(formGroup, id);
                    this.changeRef.detectChanges();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    let identityNo = formGroup.get('identityNo').value;
                    formGroup.patchValue(data);
                    if (!formGroup.get('appFName').value) {
                        formGroup.get('clientUpdateFlag').patchValue('N');
                    } else if (formGroup.get('clientUpdateFlag')) {
                        formGroup.get('clientUpdateFlag').patchValue('Y');
                    }
                    formGroup.get('identityNo').patchValue(identityNo);
                    formGroup.updateValueAndValidity();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
                this.isCustomerRefreshed = true;
                this.changeRef.markForCheck();
            });
        } else {
            if (!formGroup.get('identityNo').value) {
                formGroup.get('identityNo').setErrors({ 'required': true });
            }
            this.changeRef.markForCheck();
        }
    }


    public setItemNoList() {
        let resultDropDownList = new Array();
        let object = { 'value': 'New', 'display': 'New' };
        resultDropDownList.push(object);
        let riskInfoArray: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        for (let i = 0; i < riskInfoArray.length; i++) {
            object = { 'value': riskInfoArray.at(i).get('itemNo').value, 'display': riskInfoArray.at(i).get('itemNo').value }
            resultDropDownList.push(object);
        }
        resultDropDownList = this.removeDuplicatesFromArray(resultDropDownList);
        this.formGroup.controls['policyInfo'].get('itemNo').setValue('New');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.itemNoListElementId, 'dropdownItems', resultDropDownList);
    }

    removeDuplicatesFromArray(array) {
        for (let i = 0; i < array.length; i++) {
            if (i > 0 && array[i - 1].value === array[i].value) {
                array.splice(i, 1);
                i--;
            }
        }
        return array;
    }

    public getPostalCodeRefresh() {
        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
            let PostalCodeResponse = this.service.getpostalCodeRefreshValues({ customerInfo: this.formGroup.controls['customerInfo'].value });
            PostalCodeResponse.subscribe(
                (postalCodeResponseData) => {
                    if (postalCodeResponseData == null) {
                        this.formGroup.controls['customerInfo'].get('appUnitNumber').enable();
                        this.formGroup.controls['customerInfo'].get('blockNumber').enable();
                        this.formGroup.controls['customerInfo'].get('address1').enable();
                        this.formGroup.controls['customerInfo'].get('address2').enable();
                        this.formGroup.controls['customerInfo'].get('cityCode').enable();
                        this.formGroup.controls['customerInfo'].get('cityDesc').enable();
                        this.formGroup.controls['customerInfo'].get('state').enable();
                        this.formGroup.controls['customerInfo'].get('stateDesc').enable();
                        this.formGroup.controls['customerInfo'].get('countryCode').enable();
                        this.formGroup.controls['customerInfo'].get('countryDesc').enable();
                        this.formGroup.controls['customerInfo'].get('appUnitNumber').reset();
                        this.formGroup.controls['customerInfo'].get('blockNumber').reset();
                        this.formGroup.controls['customerInfo'].get('address1').reset();
                        this.formGroup.controls['customerInfo'].get('address2').reset();
                        this.formGroup.controls['customerInfo'].get('cityCode').reset();
                        this.formGroup.controls['customerInfo'].get('cityDesc').reset();
                        this.formGroup.controls['customerInfo'].get('state').reset();
                        this.formGroup.controls['customerInfo'].get('stateDesc').reset();
                        this.formGroup.controls['customerInfo'].get('countryCode').reset();
                        this.formGroup.controls['customerInfo'].get('countryDesc').reset();
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    } else if (postalCodeResponseData.error !== null && postalCodeResponseData.error !== undefined && postalCodeResponseData.error.length >= 1) {
                        //this.formGroup.controls['customerInfo'].get('zipCd').setErrors({ 'notFound': true });
                        this.formGroup.controls['customerInfo'].get('appUnitNumber').patchValue('');
                        this.formGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('blockNumber').patchValue('');
                        this.formGroup.controls['customerInfo'].get('blockNumber').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('address1').patchValue('');
                        this.formGroup.controls['customerInfo'].get('address1').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('address2').patchValue('');
                        this.formGroup.controls['customerInfo'].get('address2').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('cityCode').enable();
                        this.formGroup.controls['customerInfo'].get('cityDesc').enable();
                        this.formGroup.controls['customerInfo'].get('cityCode').patchValue('');
                        this.formGroup.controls['customerInfo'].get('cityCode').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('cityDesc').patchValue('');
                        this.formGroup.controls['customerInfo'].get('cityDesc').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('state').patchValue('');
                        this.formGroup.controls['customerInfo'].get('state').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('stateDesc').patchValue('');
                        this.formGroup.controls['customerInfo'].get('stateDesc').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('countryCode').enable();
                        this.formGroup.controls['customerInfo'].get('countryDesc').enable();
                        this.formGroup.controls['customerInfo'].get('countryCode').patchValue('');
                        this.formGroup.controls['customerInfo'].get('countryCode').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('countryDesc').patchValue('');
                        this.formGroup.controls['customerInfo'].get('countryDesc').updateValueAndValidity();
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    } else {
                        this.formGroup.controls['customerInfo'].get('appUnitNumber').patchValue(postalCodeResponseData.address1.trim());
                        this.formGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('blockNumber').patchValue(postalCodeResponseData.address2.trim());
                        this.formGroup.controls['customerInfo'].get('blockNumber').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('address1').patchValue(postalCodeResponseData.address3.trim());
                        this.formGroup.controls['customerInfo'].get('address1').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('address2').patchValue(postalCodeResponseData.address4.trim());
                        this.formGroup.controls['customerInfo'].get('address2').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('cityDesc').patchValue(postalCodeResponseData.cityDesc.trim());
                        this.formGroup.controls['customerInfo'].get('cityDesc').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('cityCode').patchValue(postalCodeResponseData.cityCode.trim());
                        this.formGroup.controls['customerInfo'].get('cityCode').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('stateDesc').patchValue(postalCodeResponseData.state.trim());
                        this.formGroup.controls['customerInfo'].get('stateDesc').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('state').patchValue(postalCodeResponseData.stateCode.trim());
                        this.formGroup.controls['customerInfo'].get('state').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('countryDesc').patchValue(postalCodeResponseData.countryDesc.trim());
                        this.formGroup.controls['customerInfo'].get('countryDesc').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('countryCode').patchValue(postalCodeResponseData.countryCode.trim());
                        this.formGroup.controls['customerInfo'].get('countryCode').updateValueAndValidity();
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    }
                    this.updateElements();
                    this.changeRef.markForCheck();
                }
            );
        }
    }

    closeRiskInfoSection() {
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskDetailsModal, 'modalKey', false);
        this.changeRef.markForCheck();
    }

}
