import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NCPFormUtilsService } from '../../../../core/ncp-forms/ncp.form.utils';
import { PickListService } from '../../../common';
import { customerService } from '../../../customer/services/customer.service';
import { UserFormService } from '../../../userManagement';
import { TransactionConstants } from '../../constants/ncpTransaction.constants';
import { PolicyTransactionService } from '../../services/policytransaction.service';
import { QuoteTransactionService } from '../../services/quotetransaction.service';
import { RenewalTransactionService } from '../../services/renewalTransaction.service';
import { TransactionComponent } from '../../transaction.component';
import { ElementConstants } from './../../constants/ncpElement.constants';
import { LifeDefaultValue } from './life.defaultValues';
import { LifePolicyValidator } from './life.policyValidator';
import { LifeQuoteValidator } from './life.quoteValidators';


/**
 * Component Class for Life Insurance related methods.
 * @implements OnInit, AfterContentInit
 */
@Component({
    template: `
    <button-field *ngIf="isShowBackButton" buttonType="custom" buttonName="NCPBtn.back" buttonClass="ncpbtn-default mr0 t-34" (click)="goBackToPMOV()"></button-field>
    <ncp-errorHandler [isError]="isError" [errors]="errors" [errorInfo]="this.formGroup.get('errorInfo').value"> </ncp-errorHandler>
    <ncp-form *ngIf="formData" [formData]="formData"></ncp-form>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LifeComponent extends TransactionComponent implements OnInit, AfterContentInit, OnDestroy {
    public collapseFlag: boolean = true;
    public basicDetailsErrorFlag: boolean = true;
    public quoteErrorFlag: boolean = true;
    public clientDetailsErrorFlag: boolean = true;
    public proposalErrorFlag: boolean = true;
    public isBeneficiaryShareValid: boolean = true;
    public isBeneficiaryLevelValid: boolean = true;
    public ratingFlag: boolean = false;
    public attachmentModelFlag: boolean = false;
    public isMaturityBeneficiary: boolean = false;
    public accidentalRiderSA = 0;
    public isAccidentRiderAdded: boolean = false;
    public riderApplicableFlag: boolean = false;
    public isMaturityAddedFlag: boolean = false;
    public isMaturityBeneficiaryValid: boolean = true;
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

        pickListService: PickListService) {
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
        this.transactionTypeInstance.transaction.lobCode = 'LIFE';
    }
    ngOnInit() {
        let lobObject: any = this.transactionTypeInstance.transaction.utilService.get(this.transactionTypeInstance.transaction.lobCode);
        if (lobObject) this.quoteFormDataInit();
        else {
            this.transactionTypeInstance.transaction.utilService.loadedSub.subscribe(() => {
                this.quoteFormDataInit();
            });
        }
        this.formGroup = this.transactionTypeInstance.transaction.quoteinfo.getLIFQuotInfoModel();
        this.transactionTypeInstance.transaction.subcribeToFormChanges(this.formGroup);
        this.doInitCommonWizardSub();
        this.doInitChangeSub();
        this.doInitClickSub();
    }
    ngAfterContentInit() {
    }
    public getDefaultValuesInstance() {
        return new LifeDefaultValue(this.transactionTypeInstance.transaction.configService);
    }
    public getQuoteValidator() {
        return new LifeQuoteValidator();
    }
    public getPolicyValidator() {
        return new LifePolicyValidator();
    }
    public quoteFormDataInit(): void {
        this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
        let lobObject: any = this.transactionTypeInstance.transaction.getLOBDetailsByLOBCode()[this.productCode];
        let productCode = lobObject.productCd;
        let templateName = lobObject.templateName;
        this.productCode = productCode;
        this.addBreadCrumbRoute();
        if (this.transactionTypeInstance.isPolicyFlag) {
            this.transactionTypeInstance.overrideEndorsementElements = lobObject['overrideEndorsementElements'];
        }
        let productJSON = this.transactionTypeInstance.getProductJSON(productCode, templateName);
        productJSON.subscribe((data) => {
            this.isError = false;
            if (data.error !== undefined && data.error.length > 0) {
                this.transactionTypeInstance.handleFileNotFound();
            }
            if (data.errCode === '404') {
                this.errors.push(data);
                this.isError = true;
                return;
            } else {
                this.formData = data;
            }
            if (this.transactionTypeInstance.hasStatusNew) {
                let defaultValues: Object = lobObject['DEFAULT_VALUES'];
                this.formGroup = this.defaultValue.setLifeQuoteDefaultValues(this.formGroup, this.transactionTypeInstance.transaction.productCode, defaultValues);
                this.formGroup = this.validator.setBasicDetailsValidator(this.formGroup);
            } else {
                this.fetchOpenheldData();
            }
            this.setAUXCodeDescAfterSettingDefaultValues();
            this.updateElements();
            if (productJSON.observers && productJSON.observers.length > 0) {
                productJSON.observers.pop();

            }
            this.transactionTypeInstance.transaction.configService.setCustom('targetSystem', 'FL');
            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            this.changeRef.markForCheck();
        });
    }
    updateElements() {
        if (this.formData) {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.formName, 'formName', this.formGroup);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'wizardConfig', this.transactionTypeInstance.transaction.wizardConfig);
        }

    }
    isRiderAvailable() {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let riskFormGroup: any = riskInfoArray.at('0')
        let ridersInfo = riskFormGroup.get('ridersInfo');
        let isRidersFlag: boolean = false;
        ridersInfo.controls.forEach((ridersFormGroup, ridersInfoIndex) => {
            if (ridersFormGroup.controls['riderCode'].value) {
                isRidersFlag = true;
            }
        });
        return isRidersFlag;
    }
    onValidateTab() {
        this.transactionTypeInstance.transaction.isNextFlag = true;
        if (this.transactionTypeInstance.transaction.status === 'Enquiry' || this.transactionTypeInstance.isPolicyFlag) {
            this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = true;
            this.transactionTypeInstance.transaction.isValidForm = true;
        } else {
            this.isError = false;
            if (this.transactionTypeInstance.transaction.currentTab === '01') {
                this.basicDetailsErrorFlag = this.validateDetailsTab();
                this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.basicDetailsErrorFlag;
                this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
            } else if (this.transactionTypeInstance.transaction.currentTab === '02') {
                this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.ratingFlag && this.validateQuoteTab();
                this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ratingError, 'displayFlag', !this.ratingFlag);
            } else if (this.transactionTypeInstance.transaction.currentTab === '03') {
                this.proposalErrorFlag = this.validateProposalTab();
                this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.proposalErrorFlag;
                this.transactionTypeInstance.transaction.isValidForm = this.proposalErrorFlag;
            }
            else if (this.transactionTypeInstance.transaction.currentTab === '04') {
                this.clientDetailsErrorFlag = this.validateClientDetailsTab();
                this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.clientDetailsErrorFlag;
                this.transactionTypeInstance.transaction.isValidForm = this.clientDetailsErrorFlag;
            }
        }
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.tripTabError, 'displayFlag', !this.basicDetailsErrorFlag && this.transactionTypeInstance.transaction.isNextFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTabError, 'displayFlag', !this.quoteErrorFlag && this.transactionTypeInstance.transaction.isNextFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredTabError, 'displayFlag', !this.clientDetailsErrorFlag && this.transactionTypeInstance.transaction.isNextFlag);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.proposalTabError, 'displayFlag', !this.proposalErrorFlag && this.transactionTypeInstance.transaction.isNextFlag);
        this.changeRef.markForCheck();

    }
    public onPrevious(event: any): void {
        this.isError = false;
        switch (event.ui.tabId) {
            case '02': {
                this.formGroup = this.validator.setBasicDetailsValidator(this.formGroup);
                this.transactionTypeInstance.transaction.currentTab = '01';
                break;
            }
            case '03': {
                this.formGroup = this.validator.setQuotValidator(this.formGroup);
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
    }
    public onNext(event: any): void {
        this.transactionTypeInstance.transaction.isNextFlag = false;
        if (event.ui.tabId === '01') {
            if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                if (!this.formGroup.controls['policyInfo'].get('quoteNo').value)
                    this.doRating();
            }
            this.formGroup.controls['policyInfo'].get('productCd').disable();
            this.transactionTypeInstance.transaction.currentTab = '02';
        } else if (event.ui.tabId === '02') {
            this.setAttachMentInfo();
            this.transactionTypeInstance.transaction.currentTab = '03';
        } else if (event.ui.tabId === '03') {
            this.formGroup = this.validator.setCustomerInfoValidation(this.formGroup);
            this.formGroup = this.validator.setLifeAssuredInfoValidation(this.formGroup);
            this.transactionTypeInstance.transaction.currentTab = '04';
        } else if (event.ui.tabId === '04') {

            this.transactionTypeInstance.transaction.currentTab = '05';
        }
    }
    public onTabChange(): void {
    }
    public doInitClickSub() {
        this.transactionTypeInstance.transaction.clickSub = this.transactionTypeInstance.transaction.eventHandlerService.clickSub.subscribe((data) => {
            if (data.id) {
                if (typeof data.id === 'string') {
                    data.id = data.id.toLowerCase();
                }
                if (data.id === this.eventConstants['saveModal']) {
                    // called for "Email Quote"
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', true);

                } else if (data.id === this.eventConstants['saveModalSave']) {
                    // called for "Saved Modal's save and Save Quote"   
                    this.updateQuote();

                }
                else if (data.id === this.eventConstants['saveModalClose']) {
                    // called for "Saved Modal's close"                
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', false);
                    this.changeRef.markForCheck();
                    // this.navigateToHome();
                } else if (data.id === this.eventConstants['postOnCredit']) {
                    this.setKeysForBeneficiary();
                    // called for "posting new proposal" 
                    this.post();
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', true);
                    this.changeRef.markForCheck();
                } else if (data.id === this.eventConstants['quoteOnCreditModalNewQuote']) {
                    // called for "New Quote in Proposal success modal"
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', false);
                    this.setNewQuoteRoute();
                    this.changeRef.markForCheck();
                    this.ngOnDestroy();
                    this.formGroup.reset();
                    this.changeRef.markForCheck();
                    this.ngOnInit();
                    this.ngAfterContentInit();
                    this.changeRef.markForCheck();
                } else if (data.id === this.eventConstants['onCreditModalClose']) {
                    // called for "close in proposal success modal"                
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', false);
                    this.navigateToHome();
                } else if (data.id === this.eventConstants['savedModalClose']) {
                    // called for "Saved Modal's close"                
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', false);
                    this.changeRef.markForCheck();
                }
                else if (data.id === this.eventConstants['calculatePremium']) {
                    this.calculatePremium();
                }
                else if (data.id === this.eventConstants['addBeneficiary']) {
                    this.addBenficiary(data)

                }
                else if (data.id === this.eventConstants['deleteBeneficiary']) {
                    this.deleteBeneficiary(data)

                }
                else if (data.id === this.eventConstants['addMaturityBeneficiary']) {
                    this.addMaturityBenficiary(data)

                }
                else if (data.id === this.eventConstants['deleteMaturityBeneficiary']) {
                    this.deleteMaturityBeneficiary(data)

                }
                else if (data.id === this.eventConstants['doCustomerRefresh']) {
                    this.formGroup.controls['customerInfo'].get('identityNo').markAsDirty();
                    this.formGroup.controls['customerInfo'].get('identityTypeCode').markAsDirty();
                    this.doCustomerRefresh(this.formGroup.controls['customerInfo'], data.id);
                }
                else if (data.id === this.eventConstants['doInsuredRefresh']) {
                    this.doInsuredRefresh(data, false, true);
                }
                else if (data.id === this.eventConstants['printDocuments']) {
                    this.quoteErrorFlag = this.validateQuoteTab();
                    if (this.validateQuoteTab() && this.ratingFlag) {
                        this.printModal = true;
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
                        this.changeRef.markForCheck();
                    } else {
                        this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = false;
                        this.transactionTypeInstance.transaction.isValidForm = false;
                        this.transactionTypeInstance.transaction.eventHandlerService.setEvent('onValidateTab', this.transactionTypeInstance.transaction.currentTab);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTabError, 'displayFlag', !this.quoteErrorFlag);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ratingError, 'displayFlag', this.quoteErrorFlag ? !this.ratingFlag : false);
                        this.changeRef.markForCheck();
                    }
                }
                else if (data.id === this.eventConstants['documentQuoteView']) {
                    this.transactionTypeInstance.transaction.configService.setCustom('documentModule', TransactionConstants.DOC_MODULE.UW);
                    this.quoteDocumentView(data.value, false);
                }
                else if (data.id === this.eventConstants['printDocumentsClose']) {
                    this.printModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
                }
            }
        });
    }
    public doInitChangeSub() {
        this.transactionTypeInstance.transaction.changeSub = this.transactionTypeInstance.transaction.eventHandlerService.changeSub.subscribe((data) => {
            if (data.id) {
                if (data.id === 'laOccupationChanged') {
                    this.setOccupation(data);
                }
                if (data.id === 'isPolicyHolderAssured') {
                    this.setAssuredAsPolicyHolder(data)
                }
                else if (data.id === 'addRiders') {
                    this.addRiders(data.value);
                }
                else if (data.id === 'documentContent') {
                    this.addDocuments(data.value.value, data.value.index);
                }
                else if (data.id === 'ridersLevelChange') {
                    this.riderLevelChange(data);
                }
                else if (data.id === 'sumAssuredChange') {
                    this.sumAssuredChange();
                }
                if (this.transactionTypeInstance.transaction.currentTab == '01') {
                    this.basicDetailsErrorFlag = this.validateDetailsTab();
                } else if (this.transactionTypeInstance.transaction.currentTab == '02') {
                    this.quoteErrorFlag = this.validateQuoteTab();
                }
                else if (this.transactionTypeInstance.transaction.currentTab == '03') {
                    this.proposalErrorFlag = this.validateProposalTab();
                }
                else if (this.transactionTypeInstance.transaction.currentTab == '04') {
                    this.clientDetailsErrorFlag = this.validateClientDetailsTab();
                }
                this.changeRef.markForCheck();
            }
        });
    }
    addRiders(ridersData) {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let riskFormGroup: any = riskInfoArray.at('0')
        let ridersInfo = riskFormGroup.get('ridersInfo');
        let ridersInfoLength = ridersInfo.length;
        let addedRider, deletedRiderCode;
        if (ridersData.length >= ridersInfoLength) {
            ridersData.forEach((riderData, ridersDataIndex) => {
                ridersInfo.controls.forEach((ridersFormGroup, ridersInfoIndex) => {
                    if (riderData.code !== ridersFormGroup.controls['riderCode'].value) {
                        addedRider = riderData;
                    }
                });
            });
            if (this.isValidRider(addedRider.code)) {
                if (ridersData.length != 1)
                    ridersInfo.push(this.transactionTypeInstance.transaction.ridersInfo.getRiderInfoModel());
                let ridersInfoFormGrop = ridersInfo.controls[ridersData.length - 1];
                ridersInfoFormGrop.controls['riderDesc'].patchValue(addedRider.desc);
                ridersInfoFormGrop.controls['riderCode'].patchValue(addedRider.code);
                ridersInfoFormGrop.controls['key'].patchValue(addedRider.code);
                // ridersInfoFormGrop.controls['riderLevel'].patchValue();
                ridersInfoFormGrop = this.setRidersSumAssured(ridersInfoFormGrop, addedRider.code, addedRider.multiLevelMapping ? addedRider.multiLevelMapping : '', );
                ridersInfoFormGrop.controls['riderTerm'].patchValue(this.formGroup.controls['policyInfo'].get('policyTerm').value);
                ridersInfoFormGrop.controls['partyRole'].patchValue('LA1');
                ridersInfoFormGrop.controls['premiumTerm'].patchValue(this.formGroup.controls['policyInfo'].get('policyTerm').value);
                ridersInfoFormGrop.controls['quoteNo'].patchValue(this.formGroup.controls['policyInfo'].get('quoteNo').value);
                ridersInfoFormGrop.controls['quoteVerNo'].patchValue(this.formGroup.controls['policyInfo'].get('quoteVerNo').value);
                ridersInfoFormGrop = this.disableRiderFields(ridersInfoFormGrop);
                ridersInfoFormGrop.controls['riderSA'].disable();
                riskFormGroup.get('ridersKey').setValue('0001');
                riskFormGroup.get('key').setValue('0001');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ridersTableCondition, 'condition', true);
                this.changeRef.markForCheck();
            }
        }
        else if (ridersData.length < ridersInfoLength) {
            if (ridersData.length > 0) {
                ridersInfo.controls.forEach((rider, index) => {
                    let ridersDatacode = ridersData[index] ? ridersData[index].code : '';
                    if (rider.controls['riderCode'].value !== ridersDatacode) {
                        deletedRiderCode = rider.controls['riderCode'].value;
                        ridersInfo.removeAt(index);
                    }
                    this.changeRef.markForCheck();
                });
            } else {
                ridersInfo.removeAt('0');
                this.isAccidentRiderAdded = false;
                ridersInfo.push(this.transactionTypeInstance.transaction.ridersInfo.getRiderInfoModel());
                riskFormGroup.get('key').setValue('');
                riskFormGroup.get('ridersKey').setValue('');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ridersTableCondition, 'condition', false);
                this.changeRef.markForCheck();
            }
        }
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ridersInfo, 'hide', !this.isRiderAvailable());
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ridersInfoProposalScreen, 'hide', !this.isRiderAvailable());
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ridersInfoConfirmScreen, 'hide', !this.isRiderAvailable());
        this.changeRef.markForCheck();
    }


    revised(isQuuckQuote: boolean = false) {
        this.setSumAssuredForQuoteBenfitInfo();
        this.setSumAssuredForFeatureBenefitList();
        let quotRevisedPriceOutput = this.service.getRevisedPriceInfo(this.formGroup.getRawValue());
        quotRevisedPriceOutput.subscribe(
            (rPInfoDataVal) => {
                if (rPInfoDataVal.error !== null && rPInfoDataVal.error !== undefined && rPInfoDataVal.error.length >= 1) {
                    this.updateErrorObject(rPInfoDataVal);
                } else if (rPInfoDataVal) {
                    this.isError = false;
                    this.ratingFlag = true;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ratingError, 'displayFlag', !this.ratingFlag);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quotationSummatyAccordian, 'isOpen', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quotationSummatyAccordian, 'isDisabled', false);
                    //this.collapseFlag = false;
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    this.formGroup.controls['policyInfo'].patchValue(rPInfoDataVal.policyInfo);
                    this.formGroup.controls['policyInfo'].updateValueAndValidity();
                    this.updateQuoteBenefitInfo(rPInfoDataVal);
                    this.updateFeaturesBenfitInfo(rPInfoDataVal);
                    this.updateRidersInfo(rPInfoDataVal);
                    if (rPInfoDataVal.summaryInfo !== null && rPInfoDataVal.summaryInfo !== undefined) {
                        this.formGroup.controls['summaryInfo'].patchValue(rPInfoDataVal.summaryInfo);
                        this.formGroup.controls['summaryInfo'].updateValueAndValidity();
                    }
                    this.changeRef.markForCheck();
                }

            }
        )
    }

    setOccupation(data) {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let tempFormGroup = riskInfoArray.at(data.value.superParentIndex);
        let insuredListFormArray = tempFormGroup.get('insuredList');
        let insuredListFormGroup = insuredListFormArray.at(data.value.parentIndex);
        if (data.value.value) {
            insuredListFormGroup.get('occupationCode').patchValue(data.value.value.code);
            insuredListFormGroup.get('occupationLevel').patchValue(data.value.value.multiLevelMapping);
            insuredListFormGroup.get('occupationDesc').patchValue(data.value.value.desc);

            this.formGroup.controls['customerInfo'].get('occupationCode').patchValue(data.value.value.code);
            this.formGroup.controls['customerInfo'].get('occupationLevel').patchValue(data.value.value.multiLevelMapping);
            this.formGroup.controls['customerInfo'].get('occupationDesc').patchValue(data.value.value.desc);
        }

    }
    setAssuredAsPolicyHolder(data) {
        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
            let riskInfoArray: any = this.formGroup.controls['riskInfo'];
            let tempFormGroup = riskInfoArray.at(0);
            let insuredListFormArray = tempFormGroup.get('insuredList');
            let insuredListFormGroup = insuredListFormArray.at(0);
            if (data.value && data.value.innerValue) {
                let formGroupValue = this.formGroup.getRawValue();
                insuredListFormGroup.patchValue(formGroupValue.customerInfo);
                insuredListFormGroup.get('attachments').reset();
                insuredListFormGroup.disable();
            } else if (data.value && !data.value.innerValue) {
                if (this.formGroup.controls['policyInfo'].get('isPolicyHolderAssured').dirty) {
                    insuredListFormGroup.enable();
                    if (this.defaultValue.getLifeAssuredDefaultValues()) {
                        insuredListFormGroup.patchValue(this.defaultValue.getLifeAssuredDefaultValues())
                    }
                }
            }
        }

    }

    updatePlanDatas() {
        return this.formGroup.controls['riskInfo'];
    }

    updateRiskDetails() {

    }

    setInsuredList() {

    }

    updateInfoValue(dataInput) {
        if (dataInput.summaryInfo !== null && dataInput.summaryInfo !== undefined) {
            this.formGroup.controls['summaryInfo'].patchValue(dataInput.summaryInfo);
            this.formGroup.controls['summaryInfo'].updateValueAndValidity();
        }
        if (!this.transactionTypeInstance.hasStatusNew) {
            if (dataInput.customerInfo !== null && dataInput.customerInfo !== undefined) {
                this.formGroup.controls['customerInfo'].patchValue(dataInput.customerInfo);
                this.updateAttachmentInfo(dataInput.customerInfo.attachments);
                this.formGroup.controls['customerInfo'].updateValueAndValidity();
            }
        }
        if (dataInput.policyInfo !== null && dataInput.policyInfo !== undefined) {
            this.formGroup.controls['policyInfo'].patchValue(dataInput.policyInfo);
            this.formGroup.controls['policyInfo'].updateValueAndValidity();
        }
        if (dataInput.documentInfo) {
            this.formGroup.controls['documentInfo'] = this.updateDocumentInfo(dataInput);
            this.formGroup.controls['documentInfo'].updateValueAndValidity();
        }
        if (dataInput.referralHistoryInfo) {
            this.formGroup.controls['referralHistoryInfo'] = this.updateReferralHistoryInfo(dataInput);
            this.formGroup.controls['referralHistoryInfo'].updateValueAndValidity();
        }
        if (dataInput.errorInfo) {
            this.formGroup.controls['errorInfo'] = this.updateErrorInfoValue(dataInput);
            this.formGroup.controls['errorInfo'].updateValueAndValidity();
        }
        if (dataInput.instalmentItemInfo) {
            this.formGroup.controls['instalmentItemInfo'] = this.updateInstalmentItemInfoValue(dataInput);
            this.formGroup.controls['instalmentItemInfo'].updateValueAndValidity();
        }
        if (dataInput.quotBenifitList) {
            this.insertQuoteBenefitList(dataInput.quotBenifitList);
        }
        if (dataInput.featureBenefitList) {
            this.insertfeatureBenefitList(dataInput.featureBenefitList);
        }
        if (!this.transactionTypeInstance.hasStatusNew) {
            let riskInfoArray: any = this.formGroup.controls['riskInfo'];
            let lifeAssuredInfo = riskInfoArray.at(0).get('insuredList').at(0);
            if (dataInput.lifeAssuredInfo !== null && dataInput.lifeAssuredInfo !== undefined) {
                lifeAssuredInfo.patchValue(dataInput.lifeAssuredInfo);
                lifeAssuredInfo.updateValueAndValidity();
            }
        }
        if (dataInput.beneficiaryInfo !== null && dataInput.beneficiaryInfo !== undefined) {
            this.updatebeneficiaryinfo(dataInput);
        }
        if (!this.transactionTypeInstance.hasStatusNew) {
            this.updateQuoteBenefitInfo(dataInput);
            this.updateFeaturesBenfitInfo(dataInput);
        }
        if (dataInput.riskInfo) {
            this.updateRidersInfo(dataInput);
        }
        this.changeRef.markForCheck();
        return this.formGroup;
    }
    insertfeatureBenefitList(featureBenefitList) {
        let featureBenefitListArray: FormArray = <FormArray>this.formGroup.controls['featureBenefitList'];
        if (featureBenefitListArray && featureBenefitListArray.length > 0) {
            for (var i = 0; i < featureBenefitListArray.length; i++) {
                featureBenefitListArray.removeAt(i);
                i--;
            }
        }
        if (featureBenefitList && featureBenefitList.length > 0) {
            for (var i = 0; i < featureBenefitList.length; i++) {
                featureBenefitListArray.push(this.transactionTypeInstance.transaction.featureBenefitList.getFeatureBenefitInfoModel());
            }
            featureBenefitListArray.patchValue(featureBenefitList);
        }
    }
    updateDisplayControl(formArray, hideValues, compareKey) {

    }
    setSumAssuredForFeatureBenefitList() {
        let policyTerm = this.formGroup.controls['policyInfo'].get('policyTerm').value;
        let premiumTerm = this.formGroup.controls['policyInfo'].get('premiumTerm').value;
        let sumAssured = this.formGroup.controls['policyInfo'].get('sumAssured').value;
        let appFullName = this.formGroup.controls['customerInfo'].get('appFullName').value;
        let featureBenfitBenfitFormArray: any = this.formGroup.controls['featureBenefitList'];
        featureBenfitBenfitFormArray.controls.forEach(element => {
            if (element.controls['key'].value) {
                element.controls['premiumTerm'].patchValue(premiumTerm);
                element.controls['benefitTerm'].patchValue(policyTerm);
                element.controls['sumAssuredFAPrimeAmount'].patchValue(sumAssured);
                element.controls['partyDesc'].patchValue(appFullName);
            }
        });
    }
    setSumAssuredForQuoteBenfitInfo() {
        let policyTerm = this.formGroup.controls['policyInfo'].get('policyTerm').value;
        let premiumTerm = this.formGroup.controls['policyInfo'].get('premiumTerm').value;
        let appFullName = this.formGroup.controls['customerInfo'].get('appFullName').value;
        let sumAssured = this.formGroup.controls['policyInfo'].get('sumAssured').value;

        let quoteBenfitFormArray: any = this.formGroup.controls['quotBenifitList'];
        quoteBenfitFormArray.controls.forEach(element => {
            if (element.controls['key'].value) {
                element.controls['premiumTerm'].patchValue(premiumTerm);
                element.controls['benefitTerm'].patchValue(policyTerm);
                element.controls['sumAssuredFAPrimeAmount'].patchValue(sumAssured);
                element.controls['partyDesc'].patchValue(appFullName);
            }
        });
    }
    updateQuoteBenefitInfo(data) {
        let quoteBenfitFormArray: FormArray = <FormArray>this.formGroup.controls['quotBenifitList'];
        if (quoteBenfitFormArray && quoteBenfitFormArray.length > 0) {
            for (var i = 0; i < quoteBenfitFormArray.length; i++) {
                quoteBenfitFormArray.removeAt(i);
                i--;
            }
        }
        if (data['quotBenifitList'] && data.quotBenifitList.length > 0) {
            for (var i = 0; i < data.quotBenifitList.length; i++) {
                quoteBenfitFormArray.push(this.transactionTypeInstance.transaction.quoteBenefitInfo.getQuoteBenefitInfoModel());
                quoteBenfitFormArray.at(i).get('quoteNo').patchValue(this.formGroup.controls['policyInfo'].get('quoteNo').value);
                quoteBenfitFormArray.at(i).get('quoteVerNo').patchValue(this.formGroup.controls['policyInfo'].get('quoteVerNo').value);
            }
            quoteBenfitFormArray.patchValue(data.quotBenifitList);
        }
    }
    updateFeaturesBenfitInfo(data) {
        let featureBenefitListArray: FormArray = <FormArray>this.formGroup.controls['featureBenefitList'];
        if (featureBenefitListArray && featureBenefitListArray.length > 0) {
            for (var i = 0; i < featureBenefitListArray.length; i++) {
                featureBenefitListArray.removeAt(i);
                i--;
            }
        }
        if (data['featureBenefitList'] && data.featureBenefitList.length > 0) {
            for (var i = 0; i < data.featureBenefitList.length; i++) {
                featureBenefitListArray.push(this.transactionTypeInstance.transaction.featureBenefitList.getFeatureBenefitInfoModel());
                featureBenefitListArray.at(i).get('quoteNo').patchValue(this.formGroup.controls['policyInfo'].get('quoteNo').value);
                featureBenefitListArray.at(i).get('quotVersion').patchValue(this.formGroup.controls['policyInfo'].get('quoteVerNo').value);
            }
            featureBenefitListArray.patchValue(data.featureBenefitList);
        }
        this.updateDisplayControl(featureBenefitListArray, this.commissionCodes, 'benefitCode');
    }

    setAttachMentInfo() {
        if (!this.attachmentModelFlag && this.transactionTypeInstance.hasStatusNew) {
            let attachmentInfo: FormArray = <FormArray>this.formGroup.controls['customerInfo'].get('attachments');
            attachmentInfo.push(this.transactionTypeInstance.transaction.customerInfo.getfileuploadModel());
            attachmentInfo = this.validator.setAttachmentValidation(attachmentInfo);
            this.attachmentModelFlag = true;
        } else if (this.transactionTypeInstance.transaction.isEnquiryFlag) {
            let attachmentInfo: FormArray = <FormArray>this.formGroup.controls['customerInfo'].get('attachments');
            attachmentInfo.controls.forEach((attachments) => {
                attachments.get('fileName').disable();
                attachments.get('fileName').updateValueAndValidity();
            });
        } else {
            let attachmentInfo: FormArray = <FormArray>this.formGroup.controls['customerInfo'].get('attachments');
            if (attachmentInfo.length != 2) {
                attachmentInfo.push(this.transactionTypeInstance.transaction.customerInfo.getfileuploadModel());
                attachmentInfo = this.validator.setAttachmentValidation(attachmentInfo);
                this.attachmentModelFlag = true;
            }
        }
    }

    addDocuments(file, index) {
        if (file['files'] && file['files'].length > 0) {
            // this.uploadedFileList.push(file['files'][0]);
            let files: File = <File>file['files'][0];
            // this.fileSize = files.size;
            // this.loaderConfig.setLoadingSub('yes');
            // let uploadDocInfoFormGroup: FormGroup = <FormGroup>this.claimFNOLFormGroup.controls['referQuotInfo'];
            // let temp: FormArray = <FormArray>uploadDocInfoFormGroup.controls['attachments'];
            let attachmentInfo: FormArray = <FormArray>this.formGroup.controls['customerInfo'].get('attachments');
            // let attachGrp: FormGroup = <FormGroup>temp.controls[temp.controls.length - 1];
            // attachGrp.get('documentContent').setErrors(null);
            // attachGrp.updateValueAndValidity();
            let attachmentFormGroup = attachmentInfo.controls[index];
            // if (parseInt(this.fileSize) < parseInt((this.loaderConfig.get('fileSize')))) {
            try {
                let fr = new FileReader();
                fr.readAsBinaryString(files);
                fr.onload = function () {
                    attachmentFormGroup.get('mimeType').setValue(files.type.toString());
                    attachmentFormGroup.get('fileName').setValue(files.name.toString());
                    attachmentFormGroup.get('noteID').setValue(index);
                    attachmentFormGroup.get('documentContent').setValue(btoa(fr.result.toString()));
                    attachmentFormGroup.updateValueAndValidity();
                };
            } catch (e) {
                this.transactionTypeInstance.transaction.logger.log(e, 'Error in Upload');
            }
        }
        // }
    }
    protected quotPostOnCredit() {
        this.formGroup = this.defaultValue.setSource(this.formGroup);
        let convertQuotToProposalResponse = this.service.convertQuotToProposal(this.formGroup.getRawValue());
        convertQuotToProposalResponse.subscribe((convertProposalData) => {
            if ((convertProposalData.error !== null) && (convertProposalData.error !== undefined) && (convertProposalData.error.length >= 1)) {
                this.updateErrorObject(convertProposalData);
                this.onCreditModal = false;
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            } else {
                this.isError = false;
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                this.onCreditModal = true;
                this.formGroup.controls['policyInfo'].get('quoteNo').patchValue(convertProposalData.policyInfo.proposalNo);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                this.changeRef.markForCheck();
            }
        });
    }
    public getQuotInfoServices(isQuickQuote?: boolean) {
        let quotOutput = this.service.getQuotInfo(this.formGroup.getRawValue());
        quotOutput.subscribe(
            (quotInfoDataVal) => {
                if (quotInfoDataVal.error !== null && quotInfoDataVal.error !== undefined && quotInfoDataVal.error.length >= 1) {
                    this.updateErrorObject(quotInfoDataVal);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.formGroup = this.updateInfoValue(quotInfoDataVal);
                    let quotInfoResponseVal = quotInfoDataVal;
                    this.transactionTypeInstance.transaction.docInfo = quotInfoResponseVal.documentInfo;
                    this.docInfoView = quotInfoResponseVal.documentInfo;
                    this.transactionTypeInstance.transaction.configService.setCustom('policyNo', quotInfoDataVal['policyInfo']['policyNo']);
                    this.transactionTypeInstance.isQuoteRatingDone = true;
                    this.updateElements();
                    // this.resetQuotValues();
                    this.formGroup = this.validator.setQuotValidator(this.formGroup);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
                    this.revised();
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.transactionTypeInstance.transaction.docInfoList());

            });
    }
    validateDetailsTab() {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let lifeAssuredInfo = riskInfoArray.at(0).get('insuredList').at(0);
        let validFlag: boolean = false;
        if (this.formGroup.controls['policyInfo'].get('isPolicyHolderAssured').value) {
            if (this.formGroup.controls['customerInfo'].get('appFName').value &&
                this.formGroup.controls['customerInfo'].get('appLName').value &&
                this.formGroup.controls['policyInfo'].get('productCd').value &&
                this.formGroup.controls['customerInfo'].get('emailId').valid &&
                this.formGroup.controls['customerInfo'].get('mobilePh').valid) {
                validFlag = true;
            } else {
                validFlag = false;
            }

        } else {
            if (this.formGroup.controls['customerInfo'].get('appFName').value &&
                lifeAssuredInfo.get('appFName').valid &&
                lifeAssuredInfo.get('appLName').valid &&
                lifeAssuredInfo.get('DOB').valid &&
                this.formGroup.controls['policyInfo'].get('productCd').value &&
                this.formGroup.controls['customerInfo'].get('emailId').valid &&
                this.formGroup.controls['customerInfo'].get('mobilePh').valid) {
                validFlag = true;
            } else {
                validFlag = false;
            }
        }
        return validFlag;
    }
    validateQuoteTab() {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let lifeAssuredInfo = riskInfoArray.at(0).get('insuredList').at(0);
        if (
            this.formGroup.controls['policyInfo'].get('sumAssured').value > 0 &&
            this.formGroup.controls['policyInfo'].get('policyTerm').value > 0 &&
            this.formGroup.controls['policyInfo'].get('premiumTerm').value > 0 &&
            lifeAssuredInfo.get('occupation').value &&
            this.formGroup.controls['policyInfo'].get('paymentTypeCode').valid && this.formGroup.controls['policyInfo'].get('paymentTypeDesc').value) {
            return true;
        } else if (this.formGroup.controls['policyInfo'].get('sumAssured').value < 1) {
            this.formGroup.controls['policyInfo'].get('sumAssured').setErrors({ 'required': true });
            this.changeRef.markForCheck();
            return false;
        } else if (this.formGroup.controls['policyInfo'].get('policyTerm').value < 1) {
            this.formGroup.controls['policyInfo'].get('policyTerm').setErrors({ 'required': true });
            this.changeRef.markForCheck();
            return false;
        } else if (this.formGroup.controls['policyInfo'].get('premiumTerm').value < 1) {
            this.formGroup.controls['policyInfo'].get('premiumTerm').setErrors({ 'required': true });
            this.changeRef.markForCheck();
            return false;
        } else if (!lifeAssuredInfo.get('occupation').value) {
            lifeAssuredInfo.get('occupation').setErrors({ 'required': true });
            this.changeRef.markForCheck();
            return false;
        } else if (!this.formGroup.controls['policyInfo'].get('paymentTypeCode').valid || this.formGroup.controls['policyInfo'].get('paymentTypeDesc').value) {
            this.changeRef.markForCheck();
            return false;
        }
    }
    validateProposalTab() {
        let attachmentInfo: FormArray = <FormArray>this.formGroup.controls['customerInfo'].get('attachments');
        let attachmentValidFlag: boolean = true;
        attachmentInfo.controls.forEach((attachmentForm) => {
            attachmentValidFlag = attachmentValidFlag && attachmentForm.valid;
        });
        return attachmentValidFlag;
    }

    validateClientDetailsTab() {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let lifeAssuredInfo = riskInfoArray.at(0).get('insuredList').at(0);
        if (this.formGroup.controls['policyInfo'].get('isPolicyHolderAssured').value) {
            return (this.formGroup.controls['customerInfo'].valid
                && this.formGroup.controls['beneficiaryInfo'].valid);
        } else {
            let riskInfoArray: any = this.formGroup.controls['riskInfo'];
            let insuredInfoValidFlag: boolean = true;
            riskInfoArray.controls.forEach((riskInfoFormGroup) => {
                let insuredListFormArray = riskInfoFormGroup.get('insuredList');
                insuredListFormArray.controls.forEach(insuredListFormGroup => {
                    insuredInfoValidFlag = insuredInfoValidFlag && insuredListFormGroup.valid;
                });
            });
            return (this.formGroup.controls['customerInfo'].valid
                && this.formGroup.controls['beneficiaryInfo'].valid
                && insuredInfoValidFlag);
        }
    }
    addBenficiary(data) {
        let benficiaryInfoForm: FormArray = <FormArray>this.formGroup.controls['beneficiaryInfo'];
        benficiaryInfoForm.push(this.validator.setbeneficiaryInfoValidation(this.defaultValue.setBeneficiaryDefaultValues(this.transactionTypeInstance.transaction.customerInfo.getLIFCustomerInfoModel())))
        this.setDeleteButtonVisibilityForBeneficiary(benficiaryInfoForm);
        this.changeRef.markForCheck();
    }
    setDeleteButtonVisibilityForBeneficiary(benficiaryInfoForm) {
        if (this.isMaturityBeneficiary) {
            let maturityRoleCount = 0, beneficiaryRoleCount = 0;
            benficiaryInfoForm.controls.forEach(beneficiaryFormGroup => {
                let roleType = beneficiaryFormGroup.get('roleType').value;
                if (roleType === 'BF') {
                    beneficiaryRoleCount = beneficiaryRoleCount + 1
                } else if (roleType === 'BFM') {
                    maturityRoleCount = maturityRoleCount + 1
                }
            });
            if (maturityRoleCount > 1) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteMaturityBeneficiaryCondition, 'condition', true);
            } else if (maturityRoleCount = 1) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteMaturityBeneficiaryCondition, 'condition', false);
            }
            if (beneficiaryRoleCount > 1) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteBeneficiaryCondition, 'condition', true);
            } else if (beneficiaryRoleCount = 1) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteBeneficiaryCondition, 'condition', false);
            }

        } else {
            if (benficiaryInfoForm.length > 1) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteBeneficiaryCondition, 'condition', true);
            } else {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteBeneficiaryCondition, 'condition', true); this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteBeneficiaryCondition, 'condition', false);
            }
        }
        this.changeRef.markForCheck();
    }
    deleteBeneficiary(data) {
        let benficiaryInfoForm: FormArray = <FormArray>this.formGroup.controls['beneficiaryInfo'];
        benficiaryInfoForm = this.validator.clearBeneficiaryValidator(benficiaryInfoForm);
        benficiaryInfoForm.removeAt(data.value.index);
        this.setDeleteButtonVisibilityForBeneficiary(benficiaryInfoForm);
        this.changeRef.markForCheck();
    }
    addMaturityBenficiary(data) {
        let benficiaryInfoForm: FormArray = <FormArray>this.formGroup.controls['beneficiaryInfo'];
        benficiaryInfoForm.push(this.validator.setbeneficiaryInfoValidation(this.defaultValue.setMaturityBeneficiaryDefaultValues(this.transactionTypeInstance.transaction.customerInfo.getLIFCustomerInfoModel())))
        this.setDeleteButtonVisibilityForBeneficiary(benficiaryInfoForm);
        this.changeRef.markForCheck();
    }
    deleteMaturityBeneficiary(data) {
        let benficiaryInfoForm: FormArray = <FormArray>this.formGroup.controls['beneficiaryInfo'];
        benficiaryInfoForm = this.validator.clearBeneficiaryValidator(benficiaryInfoForm);
        benficiaryInfoForm.removeAt(data.value.index);
        this.setDeleteButtonVisibilityForBeneficiary(benficiaryInfoForm);
        this.changeRef.markForCheck();
    }
    resetQuotValues() {
        this.formGroup.controls['policyInfo'].get('sumAssured').setValue('');
        this.formGroup.controls['policyInfo'].get('paymentTypeCode').setValue('');
        this.formGroup.controls['policyInfo'].get('policyTerm').setValue('');
        this.formGroup.controls['policyInfo'].get('premiumTerm').setValue('');
    }
    insertQuoteBenefitList(quotBenifitList) {
        let quoteBenfitFormArray: FormArray = <FormArray>this.formGroup.controls['quotBenifitList'];
        if (quoteBenfitFormArray && quoteBenfitFormArray.length > 0) {
            for (var i = 0; i < quoteBenfitFormArray.length; i++) {
                quoteBenfitFormArray.removeAt(i);
                i--;
            }
        }
        if (quotBenifitList && quotBenifitList.length > 0) {
            for (var i = 0; i < quotBenifitList.length; i++) {
                quoteBenfitFormArray.push(this.transactionTypeInstance.transaction.quoteBenefitInfo.getQuoteBenefitInfoModel());
            }
            quoteBenfitFormArray.patchValue(quotBenifitList);
        }
    }
    public doCustomerRefresh(formGroup, id?) {
        if (formGroup.get('identityNo').value) {
            let customerInfoResponse = this.service.doCustomerRefresh(this.formGroup.getRawValue());
            customerInfoResponse.subscribe((data) => {
                if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
                    this.resetCustomerInfoIdentity(formGroup, id);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.isCustomerRefreshed = true;
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
                this.changeRef.markForCheck();
            });
        } else {
            if (!formGroup.get('identityNo').value) {
                formGroup.get('identityNo').setErrors({ 'required': true });
            }
            this.changeRef.markForCheck();
        }
    }
    viewAttachment(index) {
        let attachmentsInfoFormGroup: any = this.formGroup.controls['customerInfo'].get('attachments');
        let attachmentsInfoValue;
        attachmentsInfoValue = attachmentsInfoFormGroup.at(index).getRawValue();
        this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
        if (attachmentsInfoValue.documentContent) {
            let tempContent: any = atob(attachmentsInfoValue.documentContent);
            let length = tempContent.length;
            let arrayBuffer = new ArrayBuffer(length);
            let uintArray = new Uint8Array(arrayBuffer);
            for (let i = 0; i < length; i++) {
                uintArray[i] = tempContent.charCodeAt(i);
            }
            let blob = new Blob([uintArray], { type: attachmentsInfoValue.mimeType });
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob);
            } else {
                let objectUrl = URL.createObjectURL(blob);
                window.open(objectUrl);
            }
        }
        this.changeRef.markForCheck();
        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
    }
    updateAttachmentInfo(_attachmentData) {
        let attachmentData: any[] = _attachmentData;
        if (attachmentData && attachmentData.length > 0) {
            let attachmentInfo: FormArray = <FormArray>this.formGroup.controls['customerInfo'].get('attachments');
            for (let i = 0; i < attachmentData.length; i++) {
                if (i > attachmentInfo.length - 1) {
                    attachmentInfo.push(this.transactionTypeInstance.transaction.customerInfo.getfileuploadModel());
                    attachmentInfo = this.validator.setAttachmentValidation(attachmentInfo);
                }
                attachmentInfo.at(i).patchValue(attachmentData[i]);
                attachmentInfo.at(i).updateValueAndValidity();
            }
        }
    }
    updateQuote() {
        this.quoteErrorFlag = this.validateQuoteTab();
        if (this.validateQuoteTab() && this.ratingFlag) {
            let updateQuoteResponse = this.service.quoteSaveOpenheldInfo(this.formGroup.getRawValue());
            updateQuoteResponse.subscribe((updateQuoteaResponseData) => {
                if (updateQuoteaResponseData.error !== null && updateQuoteaResponseData.error !== undefined && updateQuoteaResponseData.error.length >= 1) {
                    this.updateErrorObject(updateQuoteaResponseData);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', true);
                    this.changeRef.markForCheck();
                }
            });
        } else {
            this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = false;
            this.transactionTypeInstance.transaction.isValidForm = false;
            this.transactionTypeInstance.transaction.eventHandlerService.setEvent('onValidateTab', this.transactionTypeInstance.transaction.currentTab);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTabError, 'displayFlag', !this.quoteErrorFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ratingError, 'displayFlag', this.quoteErrorFlag ? !this.ratingFlag : false);
            this.changeRef.markForCheck();
        }
    }
    updatebeneficiaryinfo(data) {
        let beneficiaryInfoData = data.beneficiaryInfo;
        if (beneficiaryInfoData && beneficiaryInfoData.length > 0) {
            let benefiaryInfo: FormArray = <FormArray>this.formGroup.controls['beneficiaryInfo'];
            for (let i = 0; i < beneficiaryInfoData.length; i++) {
                if (i > benefiaryInfo.length - 1) {
                    benefiaryInfo.push(this.validator.setbeneficiaryInfoValidation(this.transactionTypeInstance.transaction.customerInfo.getLIFCustomerInfoModel()))
                }
                benefiaryInfo.at(i).patchValue(beneficiaryInfoData[i]);
                benefiaryInfo.at(i).updateValueAndValidity();
                if (beneficiaryInfoData[i].roleType == 'BFM') {
                    this.isMaturityBeneficiary = true;
                }
            }
        }
    }

    updateRidersInfo(data) {
        if (data.riskInfo) {
            this.formGroup.controls['riskInfo'].patchValue(data.riskInfo);
            this.formGroup.controls['riskInfo'].updateValueAndValidity();
            let riskInfoArray: any = this.formGroup.controls['riskInfo'];
            let riskFormGroup: any = riskInfoArray.at('0')
            let ridersInfo = riskFormGroup.get('ridersInfo');
            let ridersInfoData = data.riskInfo['0'] ? data.riskInfo['0']['ridersInfo'] : '';
            if (ridersInfoData && ridersInfoData.length > ridersInfo.length && ridersInfoData.length > 1) {
                ridersInfoData.forEach((riderData, ridersIndex) => {
                    if (ridersIndex > 0) {
                        ridersInfo.push(this.transactionTypeInstance.transaction.ridersInfo.getRiderInfoModel());
                        ridersInfo.at(ridersIndex).patchValue(riderData);
                    }
                });
            }
        }
        this.updateQuoteToRiders();
        if (this.isRiderAvailable()) {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ridersInfo, 'hide', false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ridersInfoProposalScreen, 'hide', false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ridersInfoConfirmScreen, 'hide', false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ridersTableCondition, 'condition', true);
        }
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let riskFormGroup: any = riskInfoArray.at('0')
        let ridersInfo = riskFormGroup.get('ridersInfo');
        if (!this.isRiderAvailable()) {
            riskFormGroup.get('ridersList').reset();
            riskFormGroup.get('ridersList').updateValueAndValidity();
        }
        this.changeRef.markForCheck();
    }
    updateQuoteToRiders() {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let riskFormGroup: any = riskInfoArray.at('0')
        let ridersInfo = riskFormGroup.get('ridersInfo');
        ridersInfo.controls.forEach((ridersGroup) => {
            ridersGroup.get('quoteNo').patchValue(this.formGroup.controls['policyInfo'].get('quoteNo').value);
            ridersGroup.get('quoteVerNo').patchValue(this.formGroup.controls['policyInfo'].get('quoteVerNo').value);
            ridersGroup.updateValueAndValidity();
        });
    }
    disableRiderFields(ridersInfoFormGrop) {
        ridersInfoFormGrop.controls['riderTerm'].disable();
        ridersInfoFormGrop.controls['riderDesc'].disable();
        // ridersInfoFormGrop.controls['riderSA'].disable();
        return ridersInfoFormGrop;
    }

    calculatePremium() {
        this.quoteErrorFlag = this.validateQuoteTab();
        if (this.validateQuoteTab()) {
            this.formGroup.controls['policyInfo'].get('hasSinglePlan').patchValue(true);
        } else {
            this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = false;
            this.transactionTypeInstance.transaction.isValidForm = false;
            this.transactionTypeInstance.transaction.eventHandlerService.setEvent('onValidateTab', this.transactionTypeInstance.transaction.currentTab);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTabError, 'displayFlag', !this.quoteErrorFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ratingError, 'displayFlag', false);
        }
        this.changeRef.markForCheck();
    }

    ngOnDestroy() {
        window.scrollTo(150, 150);
        this.transactionTypeInstance.transaction.doDestroyCommonWizardSub();
        this.transactionTypeInstance.transaction.doPopCommonWizardSub();
        this.setDefaultValues();
        this.basicDetailsErrorFlag = true;
        this.quoteErrorFlag = true;
        this.clientDetailsErrorFlag = true;
        this.proposalErrorFlag = true;
        this.attachmentModelFlag = false;
        this.isAccidentRiderAdded = false;
        this.transactionTypeInstance.transaction.logger.info('Subscription destroyed');
    }
    public setKeysForBeneficiary() {
        let tempBeneficiaryInfoArray: FormArray = <FormArray>this.formGroup.get('beneficiaryInfo');
        tempBeneficiaryInfoArray.controls.forEach((element) => {
            let key = element.get('appCode').value + element.get('roleType').value;
            element.get('key').patchValue(key);
            element.get('quoteVerNo').patchValue(this.formGroup.controls['policyInfo'].get('quoteVerNo').value);
            element.get('quoteNo').patchValue(this.formGroup.controls['policyInfo'].get('quoteNo').value);
        });
    }

    public setRidersSumAssured(ridersInfoFormGroup, riderCode, multiplyFactor) {
        let calclulatedRiderSA = 0, riderLevel = multiplyFactor;
        calclulatedRiderSA = multiplyFactor * this.getRidersMultiplyValue(riderCode);
        ridersInfoFormGroup.controls['riderLevel'].patchValue(riderLevel);
        ridersInfoFormGroup.controls['riderLevel'].disable();
        ridersInfoFormGroup.controls['riderSA'].patchValue(calclulatedRiderSA);
        ridersInfoFormGroup.controls['riderSA'].updateValueAndValidity();

        return ridersInfoFormGroup;
    }
    public getRidersMultiplyValue(riderCode): any {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let riskFormGroup: any = riskInfoArray.at('0')
        let ridersInfo = riskFormGroup.get('ridersInfo');
        let multiplyValue = 0;
        return multiplyValue;
    }
    public updateSumAssuredToRiders() {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let riskFormGroup: any = riskInfoArray.at('0')
        let ridersInfo = riskFormGroup.get('ridersInfo');
        ridersInfo.controls.forEach((ridersFormGroup) => {
            let riderData = ridersFormGroup.getRawValue();
            let riderCode = riderData['riderCode'];
            let riderLevel = riderData['riderLevel'];
            let multiplyFactor = riderLevel;
            ridersFormGroup = this.setRidersSumAssured(ridersFormGroup, riderCode, multiplyFactor);
        });
    }
    public isValidRider(riderCode) {
        let isValidRider: boolean = true;
        return isValidRider;
    }
    public isRiderApplicable() {
        let lobObject: any = this.transactionTypeInstance.transaction.getLOBDetailsByLOBCode()[this.productCode];
        this.riderApplicableFlag = lobObject['isRiderApplicable'] ? lobObject['isRiderApplicable'] : false;
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riderListCondition, 'condition', this.riderApplicableFlag);
        this.changeRef.markForCheck();
    }
    public riderLevelChange(riderLevelData) {
        if (riderLevelData.value) {
            let riskInfoArray: any = this.formGroup.controls['riskInfo'];
            let riskFormGroup: any = riskInfoArray.at('0')
            let ridersInfo = riskFormGroup.get('ridersInfo');
            let riderFormGroup = ridersInfo.at(riderLevelData.value.index);
            let riderCode = riderFormGroup.get('riderCode').value;
            let riderLevelValue = riderLevelData.value.value;
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riderLevelError, 'displayFlag', false);
            riderFormGroup = this.setRidersSumAssured(riderFormGroup, riderCode, riderLevelValue);
        }
    }
    accidentalRiderRemoved(ridersInfo) {
        return ridersInfo;
    }
    updateAfterAccidentalRiderRemove(ridersListValue) {
        let unRemovedValue: any = [];
        return unRemovedValue;
    }
    sumAssuredChange() {

    }
    isSumAssuredValid(sumAssured): boolean {
        return true;
    }
    setAUXCodeDescAfterSettingDefaultValues() {

    }
}