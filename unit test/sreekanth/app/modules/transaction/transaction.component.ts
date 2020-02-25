import { filter } from '@adapters/packageAdapter';
import { AfterContentInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NCPFormUtilsService } from '../../core/ncp-forms/ncp.form.utils';
import { PickListService } from '../common/services/picklist.service';
import { customerService } from '../customer/services/customer.service';
import { UserFormService } from '../userManagement';
import { ElementConstants } from './constants/ncpElement.constants';
import { PolicyTransactionService } from './services/policytransaction.service';
import { QuoteTransactionService } from './services/quotetransaction.service';
import { RenewalTransactionService } from './services/renewalTransaction.service';


/**
 * Common Component for All the LOB's Transaction related methods. Primarily deals with common FormGroup, FormArray related operations .
 * This class will be inherited by all the LOB Components.
 * @implements OnInit, AfterContentInit
 */
@Component({
    template: ``,
})
export class TransactionComponent implements OnInit, AfterContentInit, OnDestroy {
    // + @angular/forms Variables .  A FormGroup aggregates the values of each child FormControl into one object
    public formData: any;
    public formGroup: FormGroup = new FormGroup({});
    // + Custom helper Variables holding formData 
    public riskInfoGroup: any;
    public disabledInsuredData: any = {};
    public policyPostsResponseVal;
    public docInfoView;
    policyRatingData: any;
    public referralHistInfo;
    referralAppRatingResponse: any;
    public productCode: any;
    public riskInfoArray: any;
    // + modalKey booleans
    public disableDelRisk: boolean = false;
    public onCreditModal: boolean = false;
    public saveModal: boolean = false;
    public emailModal: boolean = false;
    public printModal: boolean = false;
    public saveQuoteModal: boolean = false;
    public referralHistoryModal: boolean = false;
    public emailSuccessModal: boolean = false;
    public declineQuoteModal: boolean = false;
    public referModalkey: boolean = false;
    public referModal: boolean = false;
    public referQuoteModal: boolean = false;
    public saveModalInsured: boolean = false;
    public viewPlansModal: boolean = false;
    public viewSummaryInsuredModal: boolean = false;
    public multiItemFlag: boolean = false;
    public isCustomerRefreshed: boolean = false;
    public addInsuredPersonModal: boolean = false;
    public addItemModal: boolean = false;
    // + flags
    public isError = false;
    public isPlantableErrorFlag: boolean = true;
    public doShowZeroPlanPrems = false;
    public isShowBackButton = false;
    public isFromProductScreen: boolean = false;
    public commissionCodes: any[] = [];
    public doRatingFlagCheckRequired: boolean = false;
    // + Visitor Classes for Validation and DefaultValues
    defaultValue: any;
    validator: any;
    // + Service Specific Variables
    public service: any;
    // + Constant Holders
    public eventConstants: any;
    // + Others
    public zipCodePattern: any = /^[0-9]*$/;
    public orginalCurrCode: any;
    errors = [];
    selectedPlanDesc: string;
    selectedPlanPrem: string;
    transactionTypeInstance: any;
    transactionType: any;
    hasCustomerCreation: boolean = false;
    customizedPlanListSelect = { error: [{ errCode: '02', errDesc: 'Please Select the Plan' }] };
    customizedErrorForTechnicalUser = { error: [{ errCode: '03', errDesc: 'Technical user does not exist for this user' }] };
    customizedErrorForIDNumberUniqueness = { error: [{ errCode: '03', errDesc: 'Duplicate Identity Number Found' }] };
    customizedErrorListInsuredCount = { error: [{ errCode: '01', errDesc: 'Add insured person limit is Exceeded' }] };
    public userType = this.userService._config.getCustom('user_type');
    public userTypeOperator = 'OP';
    public agreeAllFlag: boolean = true;
    public salesAgentFlag: boolean = true;
    public selectedRiskInfoIndex: number = 0;
    public selectedSubRiskInfoIndex: number = 0;
    public selectedPlanDetailsIndex: number = 0;
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
        public pickListService?: PickListService
    ) {
        this.doQueryParamMap();
        // this.ncpFormService.setTransactionContextObj(this);
        this.transactionTypeInstance.transaction.setModels(this.formBuilder);
        this.transactionTypeInstance.transaction.isEndorsmentFlag = this.transactionTypeInstance.isPolicyFlag;
        this.initVisitorClasses();
        this.service = this.getServiceInstance();
        this.eventConstantCustomGetter();
    }
    ngAfterContentInit(): void { }
    ngOnInit(): void { }
    ngOnDestroy(): void { }
    public getTransactionInstance() {
        if (this.transactionType === 'QT') return this.quoteComponent;
        if (this.transactionType === 'PO') return this.policyComponent;
        if (this.transactionType === 'REN') return this.renewalComponent;
    }
    public doQueryParamMap() {
        this.activeRoute.queryParams
            .pipe(filter(params => params.productCode))
            .subscribe(params => {
                let doRedirectManually = this.productCode !== undefined && this.transactionTypeInstance.transaction.activeRoutePath === this.activeRoute.snapshot.params.activity;
                this.productCode = params.productCode;
                this.transactionType = params.transactionType;
                this.isFromProductScreen = params.isFromProductScreen ? params.isFromProductScreen : false;
                this.transactionTypeInstance = this.getTransactionInstance();
                this.transactionTypeInstance.transaction.eventType = params.eventType;
                this.doStripQueryParams();
                if (doRedirectManually) {
                    this.ngOnDestroy();
                    this.formGroup.reset();
                    this.changeRef.markForCheck();
                    this.ngOnInit();
                    this.ngAfterContentInit();
                    this.changeRef.markForCheck();
                }
            });
    }
    public getServiceInstance() {
        return this.transactionTypeInstance.getServiceInstance();
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
                                let selectedPlanPrem = this.transactionTypeInstance.transaction.amtFormat.transform(parseFloat(element.planPrem), ['', true, this.formGroup.controls['policyInfo'].get('PremCurr').value]);
                                if (selectedPlanPrem) this.selectedPlanPrem = selectedPlanPrem;
                                this.formGroup.controls['policyInfo'].get('policySi').patchValue(element.planSi);
                                this.isPlantableErrorFlag = true;
                            }
                        });
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planSelectedLabel, 'label', this.selectedPlanDesc);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planSelectedPremium, 'label', this.selectedPlanPrem);
                    }
                } else {
                    this.updateSelectedPlanToItem();
                }
            }
        });
        // - Store the selectedPlanPrem and selectedPlanDesc

    }

    public doInitRiskInfoGroup() {
        this.formGroup.valueChanges.subscribe(() => {
            let array: FormArray = <FormArray>this.formGroup.get('riskInfo');
            this.riskInfoGroup = array.at(0);
            // if (this.formData) {
            // this.updateElements();
            // this.changeRef.detectChanges();
            // this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            // }
        });
    }

    setDefaultValues() {
        this.transactionTypeInstance.transaction.configService.setCustom('currency_code', this.orginalCurrCode);
        this.transactionTypeInstance.transaction.setDefaultValues();
        this.errors = [];
        this.formData = null;
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
                    let tempFormGroup: any = riskTempFormGroup.at(0).get('insuredList');
                    if (customerInfoDataVal.customerInfo) {
                        if (isInsured) {
                            this.formGroup.controls['customerInfo'].patchValue(customerInfoDataVal.customerInfo);
                            this.formGroup.controls['customerInfo'].updateValueAndValidity();
                        }
                        this.formGroup.controls['customerInfo'].get('appCode').patchValue(customerInfoDataVal.customerInfo.appCode);
                        tempFormGroup.at(0).patchValue(customerInfoDataVal.customerInfo);
                        tempFormGroup.at(0).get('key').setValue(customerInfoDataVal.customerInfo.appCode);
                        tempFormGroup.at(0).updateValueAndValidity();
                    }
                    if (isSave) {
                        this.quoteSaveOpenheld();
                    } else {
                        this.quotPostOnCredit();
                    }
                }
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
        let isCalledOnlyForEndorsement = this.transactionTypeInstance.isPolicyFlag && !this.transactionTypeInstance.isPolicyHeld;
        this.formGroup.controls['riskInfo'] = this.updatePlanDatas(dataInput, isCalledOnlyForEndorsement);
        if (!this.transactionTypeInstance.hasStatusNew) this.updateInsuredData();
        this.formGroup.controls['riskInfo'].updateValueAndValidity();
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
        this.changeRef.markForCheck();
        return this.formGroup;
    }
    updateErrorInfoValue(dataInputErrorInfo) {
        let tempErrorInfoFormArray: FormArray = <FormArray>this.formGroup.get('errorInfo');
        for (let i = 0; i < tempErrorInfoFormArray.length; i++) {
            tempErrorInfoFormArray.removeAt(i);
            i--;
        }
        if (dataInputErrorInfo.errorInfo && dataInputErrorInfo.errorInfo.length > 0) {
            for (let i = 0; i < dataInputErrorInfo.errorInfo.length; i++) {
                tempErrorInfoFormArray.push(this.transactionTypeInstance.transaction.errorInfo.getErrorInfo());
            }
            tempErrorInfoFormArray.patchValue(dataInputErrorInfo.errorInfo);
            this.isError = true;
        } else {
            this.isError = false;
        }
        return tempErrorInfoFormArray;
    }

    updateInstalmentItemInfoValue(dataInputInstalmentItemInfo) {
        if (this.formGroup.get('instalmentItemInfo')) {
            let tempInstalmentItemInfoFormArray: FormArray = <FormArray>this.formGroup.get('instalmentItemInfo');
            if (tempInstalmentItemInfoFormArray) {
                for (let i = 0; i < tempInstalmentItemInfoFormArray.length; i++) {
                    tempInstalmentItemInfoFormArray.removeAt(i);
                    i--;
                }
            }
            if (dataInputInstalmentItemInfo.instalmentItemInfo && dataInputInstalmentItemInfo.instalmentItemInfo.length > 0) {
                let instalmentItemInfo: any[] = dataInputInstalmentItemInfo.instalmentItemInfo;
                instalmentItemInfo.sort((a, b): number => {
                    if (parseInt(a.instalmentNo) < parseInt(b.instalmentNo))
                        return -1;
                    else if (parseInt(a.instalmentNo) > parseInt(b.instalmentNo))
                        return 1;
                    else
                        return 0;
                });
                for (let i = 0; i < dataInputInstalmentItemInfo.instalmentItemInfo.length; i++) {
                    tempInstalmentItemInfoFormArray.push(this.transactionTypeInstance.transaction.instalmentItemInfo.getInstalmentItemInfoModel());
                }
                tempInstalmentItemInfoFormArray.patchValue(instalmentItemInfo);
            }
            return tempInstalmentItemInfoFormArray;
        }
    }

    public updatePlanDatas(dataValInput, isCalledOnlyForEndorsement = false) {
        let tempFormGroup;
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let i = 0;
        let policySi: number = 0.00;
        for (let riskIndex = 0; riskIndex < dataValInput.riskInfo.length; riskIndex++) {        // + Added For MultiItem on 04-08-2017
            if (this.doShowZeroPlanPrems === false && !this.transactionTypeInstance.isPolicyFlag) {
                dataValInput.riskInfo[riskIndex].plans = dataValInput.riskInfo[riskIndex].plans.filter(element => {
                    if (element.planPrem == 0.00) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }
            if (riskInfoArray.value.length < dataValInput.riskInfo.length) {
                if (riskInfoArray.length > 0) {
                    for (let j = 0; j < riskInfoArray.value.length; j++) {
                        riskInfoArray.removeAt(j);
                    }
                    for (let j = 0; j < dataValInput.riskInfo.length; j++) {
                        riskInfoArray.push(this.getRiskInfoModel());
                    }
                }
            }
            tempFormGroup = riskInfoArray.at(riskIndex);

            // To patch SubjectMatterInfo
            if (dataValInput.riskInfo[riskIndex].subjectMatterInfo && dataValInput.riskInfo[riskIndex].subjectMatterInfo.length > 0) {
                if (tempFormGroup.controls['subjectMatterInfo'].length > 0) {
                    for (let j = 0; j < tempFormGroup.controls['subjectMatterInfo'].length; j++) {
                        tempFormGroup.controls['subjectMatterInfo'].removeAt(j);
                        j--;
                    }
                }
                dataValInput.riskInfo[riskIndex].subjectMatterInfo.forEach((element, index) => {
                    tempFormGroup.controls['subjectMatterInfo'].push(this.transactionTypeInstance.transaction.subjectMatterInfo.getSubjectMatterInfoModel());
                });
                tempFormGroup.controls['subjectMatterInfo'].patchValue(dataValInput.riskInfo[riskIndex].subjectMatterInfo);
                tempFormGroup.controls['subjectMatterInfo'].updateValueAndValidity();
            } else if (tempFormGroup.controls['subjectMatterInfo'] && tempFormGroup.controls['subjectMatterInfo'].length > 0) {
                for (let j = 0; j < tempFormGroup.controls['subjectMatterInfo'].length; j++) {
                    tempFormGroup.controls['subjectMatterInfo'].removeAt(j);
                    j--;
                }
            }
            // End

            // To patch ClaimHistoryInfo
            if (dataValInput.riskInfo[riskIndex].claimHistoryInfo && dataValInput.riskInfo[riskIndex].claimHistoryInfo.length > 0) {
                if (tempFormGroup.controls['claimHistoryInfo'].length > 0) {
                    for (let j = 0; j < tempFormGroup.controls['claimHistoryInfo'].length; j++) {
                        tempFormGroup.controls['claimHistoryInfo'].removeAt(j);
                        j--;
                    }
                }
                dataValInput.riskInfo[riskIndex].claimHistoryInfo.forEach((element, index) => {
                    tempFormGroup.controls['claimHistoryInfo'].push(this.transactionTypeInstance.transaction.claimHistoryInfo.getClaimHistoryInfoModel());
                });
                tempFormGroup.controls['claimHistoryInfo'].patchValue(dataValInput.riskInfo[riskIndex].claimHistoryInfo);
                tempFormGroup.controls['claimHistoryInfo'].updateValueAndValidity();
            } else if (tempFormGroup.controls['claimHistoryInfo'] && tempFormGroup.controls['claimHistoryInfo'].length > 0) {
                for (let j = 0; j < tempFormGroup.controls['claimHistoryInfo'].length; j++) {
                    tempFormGroup.controls['claimHistoryInfo'].removeAt(j);
                    j--;
                }
            }
            // End




            if (dataValInput.riskInfo[riskIndex].plans.length > tempFormGroup.controls['plans'].length) {
                if (tempFormGroup.controls['plans'].length > 0) {
                    for (let j = 0; j < tempFormGroup.controls['plans'].length; j++) {
                        tempFormGroup.controls['plans'].removeAt(j);
                    }
                }
                dataValInput.riskInfo[riskIndex].plans.forEach((element, index) => {
                    tempFormGroup.controls['plans'].push(this.transactionTypeInstance.transaction.plans.getPlanInfoModel());
                    if (isCalledOnlyForEndorsement === true)
                        if (element.isPlanSelected) {
                            this.transactionTypeInstance.selectedCoverageCode[riskIndex] = element.planTypeCode;
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

                        // To patch coverageLoadingInfo
                        for (let j = 0; j < tempFormGroup.controls['plans'].at(i).controls['planDetails'].length; j++) {
                            let planDetailsObject: any = tempFormGroup.controls['plans'].at(i).controls['planDetails'].at(j);
                            if (planDetailsObject && planDetailsObject.controls['coverageLoadingInfo'] && planDetailsObject.controls['coverageLoadingInfo'].length > 0) {
                                for (let k = 0; k < planDetailsObject.controls['coverageLoadingInfo'].length; k++) {
                                    planDetailsObject.controls['coverageLoadingInfo'].removeAt(k);
                                    k--;
                                }
                            }
                        }

                        for (let j = 0; j < element.planDetails.length; j++) {
                            let planDetailsObject: any = element.planDetails[j];
                            if (planDetailsObject && planDetailsObject.coverageLoadingInfo && planDetailsObject.coverageLoadingInfo.length > 0) {
                                planDetailsObject.coverageLoadingInfo.forEach(coverageLoadingObject => {
                                    tempFormGroup.controls['plans'].at(i).controls['planDetails'].at(j).controls['coverageLoadingInfo'].push(this.transactionTypeInstance.transaction.coverageLoadingInfo.getCoverageLoadingInfoModel());
                                });
                            }
                        }
                        // End

                    }
                    if (element.policyCovgInfo !== null && element.policyCovgInfo !== undefined) {
                        element.policyCovgInfo.forEach(detail => {
                            tempFormGroup.controls['plans'].at(i).controls['policyCovgInfo'].push(this.transactionTypeInstance.transaction.policyCoverageInfo.getPolicyCoverageInfoModel());
                        });
                    }
                });
            }
            else if (dataValInput.riskInfo[riskIndex].plans.length === 1) {
                dataValInput.riskInfo[riskIndex].plans[0].isPlanSelected = true;
                policySi += parseFloat(dataValInput.riskInfo[riskIndex].plans[0].planSi);
                if (tempFormGroup.controls['plans'].length > 0) {
                    for (let j = 0; j < tempFormGroup.controls['plans'].length; j++) {
                        tempFormGroup.controls['plans'].removeAt(j);
                    }
                }
                dataValInput.riskInfo[riskIndex].plans.forEach((element, index) => {
                    tempFormGroup.controls['plans'].push(this.transactionTypeInstance.transaction.plans.getPlanInfoModel());
                    if (isCalledOnlyForEndorsement === true)
                        if (element.isPlanSelected) {
                            this.transactionTypeInstance.selectedCoverageCode[riskIndex] = element.planTypeCode;
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

                        // To patch coverageLoadingInfo
                        for (let j = 0; j < tempFormGroup.controls['plans'].at(i).controls['planDetails'].length; j++) {
                            let planDetailsObject: any = tempFormGroup.controls['plans'].at(i).controls['planDetails'].at(j);
                            if (planDetailsObject && planDetailsObject.controls['coverageLoadingInfo'] && planDetailsObject.controls['coverageLoadingInfo'].length > 0) {
                                for (let k = 0; k < planDetailsObject.controls['coverageLoadingInfo'].length; k++) {
                                    planDetailsObject.controls['coverageLoadingInfo'].removeAt(k);
                                    k--;
                                }
                            }
                        }

                        for (let j = 0; j < element.planDetails.length; j++) {
                            let planDetailsObject: any = element.planDetails[j];
                            if (planDetailsObject && planDetailsObject.coverageLoadingInfo && planDetailsObject.coverageLoadingInfo.length > 0) {
                                planDetailsObject.coverageLoadingInfo.forEach(coverageLoadingObject => {
                                    tempFormGroup.controls['plans'].at(i).controls['planDetails'].at(j).controls['coverageLoadingInfo'].push(this.transactionTypeInstance.transaction.coverageLoadingInfo.getCoverageLoadingInfoModel());
                                });
                            }
                        }
                        // End
                    }
                    if (element.policyCovgInfo !== null && element.policyCovgInfo !== undefined) {
                        element.policyCovgInfo.forEach(detail => {
                            // tslint:disable-next-line:max-line-length
                            tempFormGroup.controls['plans'].at(i).controls['policyCovgInfo'].push(this.transactionTypeInstance.transaction.policyCoverageInfo.getPolicyCoverageInfoModel());
                        });
                    }
                });
            }
            let tempDataValInput = dataValInput.riskInfo[riskIndex]
            for (let key in tempFormGroup.controls) {
                if (tempDataValInput.hasOwnProperty(key)) {
                    tempFormGroup.get(key).patchValue(tempDataValInput[key]);
                    tempFormGroup.get(key).updateValueAndValidity();
                }
            }
            tempFormGroup.controls['plans'].patchValue(dataValInput.riskInfo[riskIndex].plans);
            tempFormGroup.controls['plans'].updateValueAndValidity();
            riskInfoArray.at(riskIndex).patchValue(tempFormGroup);
            riskInfoArray.at(riskIndex).updateValueAndValidity();
        }
        // this.formGroup.controls['policyInfo'].get('policySi').patchValue(policySi.toFixed(2));
        this.changeRef.markForCheck();
        return riskInfoArray;
    }
    public updateDocumentInfo(dataValInputDoc) {
        let tempFormGroupDoc;
        tempFormGroupDoc = this.formGroup.controls['documentInfo'];
        if (tempFormGroupDoc.length > 0) {
            for (let j = 0; j < tempFormGroupDoc.length; j++) {
                tempFormGroupDoc.removeAt(j);
            }
        }
        if (dataValInputDoc.documentInfo && dataValInputDoc.documentInfo.length > 0) {
            let tempLength = dataValInputDoc.documentInfo.length;
            for (let i = 0; i < tempLength; i++) {
                tempFormGroupDoc.push(this.transactionTypeInstance.transaction.documentInfo.getDocumentInfoModel());
            }
            tempFormGroupDoc.patchValue(dataValInputDoc.documentInfo);
            tempFormGroupDoc.updateValueAndValidity();
        }
        return tempFormGroupDoc;
    }
    public updateReferralHistoryInfo(dataValInputReferralHistory) {
        let tempFormGroupRHis;
        tempFormGroupRHis = this.formGroup.controls['referralHistoryInfo'];
        if (tempFormGroupRHis.length > 0) {
            let tempFormGroupRHisLength = tempFormGroupRHis.length;
            for (let j = 0; j <= tempFormGroupRHisLength; j++) {
                tempFormGroupRHis.removeAt(j);
            }
        }
        if (dataValInputReferralHistory.referralHistoryInfo) {
            let tempLength = dataValInputReferralHistory.referralHistoryInfo.length;
            for (let i = 0; i < tempLength; i++) {
                tempFormGroupRHis.push(this.transactionTypeInstance.transaction.referralHistoryInfo.getReferralHistoryInfoModel());
            }
            tempFormGroupRHis.patchValue(dataValInputReferralHistory.referralHistoryInfo);
        }
        this.referralHistInfo = tempFormGroupRHis.value;
        tempFormGroupRHis.updateValueAndValidity();
        this.updateElements();
        return tempFormGroupRHis;
    }
    public updateErrorObject(inputErrorObject) {
        this.isError = true;
        this.errors = [];
        for (let i = 0; i < inputErrorObject.error.length; i++) {
            if (inputErrorObject.error[i].errCode) {
                this.errors.push({ 'errCode': inputErrorObject.error[i].errCode, 'errDesc': inputErrorObject.error[i].errDesc });
                this.transactionTypeInstance.transaction.logger.log('Error===>' + inputErrorObject.error[i].errCode + ':' + inputErrorObject.error[i].errDesc);
            }
        }
        window.scrollTo(150, 150);
        this.updateElements();
        this.changeRef.markForCheck();
    }

    public quoteSaveOpenheld() {
        let policyPostsResponse = this.service.quoteSaveOpenheldInfo(this.formGroup.getRawValue());
        policyPostsResponse.subscribe(
            (quotPostOnCreditInfo) => {
                if (quotPostOnCreditInfo.error !== null && quotPostOnCreditInfo.error !== undefined && quotPostOnCreditInfo.error.length >= 1) {
                    this.updateErrorObject(quotPostOnCreditInfo);
                } else {
                    this.saveModal = true;
                    this.formGroup.patchValue(quotPostOnCreditInfo);
                    this.formGroup.updateValueAndValidity();
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveModal);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            },
            (error) => {
                this.transactionTypeInstance.transaction.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }
    public quoteSave() {
        let postValue = this.formGroup.getRawValue();
        postValue.policyInfo.paymentTime = this.transactionTypeInstance.transaction.utilService.getTimeNow();
        postValue.policyInfo.paymentDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(this.transactionTypeInstance.transaction.todayDate);
        let quoteSaveResponse = this.service.quoteSaveOpenheldInfo(postValue);
        quoteSaveResponse.subscribe(
            (quoteSaveResponseInfo) => {
                if (quoteSaveResponseInfo.error !== null && quoteSaveResponseInfo.error !== undefined && quoteSaveResponseInfo.error.length >= 1) {
                    this.updateErrorObject(quoteSaveResponseInfo);
                } else {
                    this.formGroup.patchValue(quoteSaveResponseInfo);
                    this.formGroup.updateValueAndValidity();
                }
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            },
            (error) => {
                this.transactionTypeInstance.transaction.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }
    coverDateValidation() {
        let coverFromDate = this.formGroup.controls['policyInfo'].value.inceptionDt;
        let date = new Date();
        let toDaycoverDate = date.toLocaleDateString("en-GB");
        if (coverFromDate) {
            let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(toDaycoverDate, coverFromDate);
            let coverStartDate = dateDuration.startDate;
            let coverEndDate = dateDuration.endDate;
            let noofCoverDays = dateDuration.noOfDays;
            if (noofCoverDays >= 120) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.errorQuote, 'modalKey', true);
                //this.navigateToHome();
            } else {

            }
        }
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
            if (this.formGroup.controls['policyInfo'].value.policyTerm === '07') {
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

            } else if (this.formGroup.controls['policyInfo'].value.policyTerm === '01') {

                let coverTotimeAnnual = tripStartDate.valueOf() + 364 * 1000 * 60 * 60 * 24;
                let resultcoverToDate = new Date(coverTotimeAnnual);
                let resultedStringDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(resultcoverToDate);
                let startString = this.transactionTypeInstance.transaction.dateFormatService.formatDate(tripStartDate);
                this.formGroup.controls['policyInfo'].get('inceptionDt').patchValue(startString);
                this.formGroup.controls['policyInfo'].get('inceptionDt').updateValueAndValidity();
                this.formGroup.controls['policyInfo'].get('expiryDt').patchValue(resultedStringDate);
                this.formGroup.controls['policyInfo'].get('expiryDt').updateValueAndValidity();
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
            }
            else {
                noofDays = 0;
                this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(noofDays);
                this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
            }
            this.setNCPDatePickerOptions();
        }
    }

    setCoverDates() {
        let noofDays = this.formGroup.controls['policyInfo'].get('durationInDays').value;
        let tripInceptionDt = this.formGroup.controls['policyInfo'].get('inceptionDt').value;
        if (tripInceptionDt != "") {
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
    setNCPDatePickerOptions() {

        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryDate, 'options', this.setNCPDatePickerToDateOptions());
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerToDateAnnualOptions);
    }
    public setNCPDatePickerEffectiveDateOptions() {
        let quoteFromDateObj = this.transactionTypeInstance.transaction.parseSelectedDate(this.formGroup.controls['policyInfo'].get('inceptionDt').value);
        let day: number = quoteFromDateObj.day - 1;
        let month: number = quoteFromDateObj.month;
        let year: number = quoteFromDateObj.year;
        if (day === 0) {
            day = 31;
            month -= 1;
            if (month === 0) {
                month = 12;
                year -= 1;
            }
        }
        this.transactionTypeInstance.transaction.NCPDatePickerEffectiveDtOptions.disabledUntil = { year: year, month: month, day: day, dayTxt: '' };
        quoteFromDateObj = this.transactionTypeInstance.transaction.parseSelectedDate(this.formGroup.controls['policyInfo'].get('expiryDt').value);
        day = quoteFromDateObj.day;
        month = quoteFromDateObj.month;
        year = quoteFromDateObj.year;
        if (day === 0) {
            day = 31;
            month -= 1;
            if (month === 0) {
                month = 12;
                year -= 1;
            }
        }
        this.transactionTypeInstance.transaction.NCPDatePickerEffectiveDtOptions.disableSince = { year: year, month: month, day: day, dayTxt: '' }
        return this.transactionTypeInstance.transaction.NCPDatePickerEffectiveDtOptions;
    }
    navigateToHome() {
        this.transactionTypeInstance.transaction.configService.navigateToHome();
    }
    protected quotPostOnCredit() {
        let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
        let policyEndtNo = this.formGroup.controls['policyInfo'].get('policyEndtNo').value;
        this.formGroup.controls['paymentInfo'].get('policyNo').patchValue(policyNo);
        this.formGroup.controls['paymentInfo'].get('policyEndtNo').patchValue(policyEndtNo);
        let postValue = this.formGroup.getRawValue();
        postValue.policyInfo.paymentTime = this.transactionTypeInstance.transaction.utilService.getTimeNow();
        postValue.policyInfo.paymentDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(this.transactionTypeInstance.transaction.todayDate);
        let policyPostsResponse = this.service.getPolicyPostingOnCreditInfo(postValue);
        policyPostsResponse.subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            (policyPostsResponse) => {
                // tslint:disable-next-line:max-line-length
                if ((policyPostsResponse.error !== null) && (policyPostsResponse.error !== undefined) && (policyPostsResponse.error.length >= 1)) {
                    this.updateErrorObject(policyPostsResponse);
                    this.onCreditModal = false;
                } else {
                    this.formGroup.controls['policyInfo'].patchValue(policyPostsResponse.policyInfo);
                    this.onCreditModal = true;
                    this.policyPostsResponseVal = policyPostsResponse;
                    if (policyPostsResponse.documentInfo) {
                        this.transactionTypeInstance.transaction.docInfo = policyPostsResponse.documentInfo;
                        this.docInfoView = policyPostsResponse.documentInfo;
                    }
                    this.formGroup.controls['policyInfo'].get('policyNo').disable();
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                }
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }
    public quoteDocumentView(documentIndex, isUpdateToTargetSystem?) {
        if (this.transactionTypeInstance.transaction.status !== 'Enquiry' && !this.transactionTypeInstance.isPolicyFlag) {
            let policySaveResponse = this.service.quoteSaveOpenheldInfo(this.formGroup.getRawValue(), isUpdateToTargetSystem);
            policySaveResponse.subscribe((quotSaveInfo) => {
                if (quotSaveInfo.error !== null && quotSaveInfo.error !== undefined && quotSaveInfo.error.length >= 1) {
                    this.updateErrorObject(quotSaveInfo);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    let policySaveResponseVal = quotSaveInfo;
                    this.docInfoView = policySaveResponseVal.documentInfo;
                    for (let i = 0; i < this.docInfoView.length; i++) {
                        this.docInfoView[i].isDocumentSelected = (this.docInfoView[i].documentId == documentIndex) ? true : false;
                        this.docInfoView[i].dispatchType = 'PREVIEW';

                    }

                    if (policySaveResponseVal) {
                        policySaveResponseVal.documentInfo = this.docInfoView;
                        this.service.getDocumentInfo(policySaveResponseVal);
                    }

                }
            });
        }
        else {
            let dataObj = this.transactionTypeInstance.transaction.configService.getCustom(this.transactionTypeInstance.openHeldDataStorageString);
            this.transactionTypeInstance.transaction.docInfo = dataObj.documentInfo;
            let tempDispatchType = null;
            for (let i = 0; i < this.transactionTypeInstance.transaction.docInfo.length; i++) {
                this.transactionTypeInstance.transaction.docInfo[i].isDocumentSelected = (this.transactionTypeInstance.transaction.docInfo[i].documentId == documentIndex) ? true : false;
                if (this.transactionTypeInstance.transaction.docInfo[i].isDocumentSelected) {
                    tempDispatchType = this.transactionTypeInstance.transaction.docInfo[i].dispatchType;
                    this.transactionTypeInstance.transaction.docInfo[i].dispatchType = 'PREVIEW';
                }
            }
            dataObj.documentInfo = this.transactionTypeInstance.transaction.docInfo;
            this.service.getDocumentInfo(dataObj);
            for (let i = 0; i < this.transactionTypeInstance.transaction.docInfo.length; i++) {
                this.transactionTypeInstance.transaction.docInfo[i].isDocumentSelected = (this.transactionTypeInstance.transaction.docInfo[i].documentId == documentIndex) ? true : false;
                if (this.transactionTypeInstance.transaction.docInfo[i].isDocumentSelected) {
                    this.transactionTypeInstance.transaction.docInfo[i].dispatchType = tempDispatchType;
                }
            }
        }

    }
    public confirmDocumentView(documentIndex) {
        let tempDispatchType;
        for (let i = 0; i < this.transactionTypeInstance.transaction.docInfo.length; i++) {
            this.transactionTypeInstance.transaction.docInfo[i].isDocumentSelected = (this.transactionTypeInstance.transaction.docInfo[i].documentId == documentIndex) ? true : false;
            if (this.transactionTypeInstance.transaction.docInfo[i].isDocumentSelected) {
                tempDispatchType = this.transactionTypeInstance.transaction.docInfo[i].dispatchType;
                this.transactionTypeInstance.transaction.docInfo[i].dispatchType = 'PREVIEW';
            }
        }
        if (this.policyPostsResponseVal) {
            this.policyPostsResponseVal.documentInfo = this.transactionTypeInstance.transaction.docInfo;
            this.service.getDocumentInfo(this.policyPostsResponseVal);
            this.updateElements();
        }
        for (let i = 0; i < this.transactionTypeInstance.transaction.docInfo.length; i++) {
            this.transactionTypeInstance.transaction.docInfo[i].isDocumentSelected = (this.transactionTypeInstance.transaction.docInfo[i].documentId == documentIndex) ? true : false;
            if (this.transactionTypeInstance.transaction.docInfo[i].isDocumentSelected) {
                this.transactionTypeInstance.transaction.docInfo[i].dispatchType = tempDispatchType;
            }
        }
    }
    public productBrochureDocumentView() {
        let tempFormGroupDoc;
        tempFormGroupDoc = this.formGroup.controls['documentInfo'].value;
        if (tempFormGroupDoc.length > 0) {
            for (let j = 0; j < tempFormGroupDoc.length; j++) {
                if (tempFormGroupDoc[j].dispatchType === 'PDF') {
                    tempFormGroupDoc[j].isDocumentSelected = true;
                }
            }
        }
        this.service.getDocumentInfo(this.formGroup.value);
    }
    public documentView() {
        if (this.transactionTypeInstance.transaction.status === 'Enquiry') {
            let dataObj = this.transactionTypeInstance.transaction.configService.getCustom('openHeld');
            dataObj.documentInfo[0].isDocumentSelected = true;
            this.service.getDocumentInfo(dataObj);
        } else {
            let dataObject = this.formGroup.value;
            this.service.getDocumentInfo(dataObject);
        }
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
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');

            });
    }
    public revised(isQuickQuote?: boolean) {
        let quotRevisedPriceOutput = this.service.getRevisedPriceInfo(this.formGroup.getRawValue());
        quotRevisedPriceOutput.subscribe(
            (rPInfoDataVal) => {
                if (rPInfoDataVal.error !== null && rPInfoDataVal.error !== undefined && rPInfoDataVal.error.length >= 1) {
                    this.updateErrorObject(rPInfoDataVal);
                } else {
                    this.formGroup.controls['customerInfo'].patchValue(rPInfoDataVal.customerInfo);
                    this.formGroup.controls['customerInfo'].updateValueAndValidity();
                    this.formGroup.controls['policyInfo'].patchValue(rPInfoDataVal.policyInfo);
                    this.formGroup.controls['policyInfo'].updateValueAndValidity();
                    this.formGroup.controls['errorInfo'] = this.updateErrorInfoValue(rPInfoDataVal);
                    this.formGroup.controls['errorInfo'].updateValueAndValidity();
                    this.formGroup.controls['instalmentItemInfo'] = this.updateInstalmentItemInfoValue(rPInfoDataVal);
                    this.formGroup.controls['instalmentItemInfo'].updateValueAndValidity();
                    if (rPInfoDataVal.summaryInfo) {
                        this.formGroup.controls['summaryInfo'].patchValue(rPInfoDataVal.summaryInfo);
                        this.formGroup.controls['summaryInfo'].updateValueAndValidity();
                    }
                    this.updatePlanDatas(rPInfoDataVal);
                    if (this.formGroup.controls['policyInfo'].get('referralStatus').value === 'B001') {
                        this.referralAppRatingResponse = rPInfoDataVal;
                    }
                    this.transactionTypeInstance.transaction.docInfo = rPInfoDataVal.documentInfo;
                    this.updateElements();
                }
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
            });
    }
    public saveQuote() {
        if (this.hasCustomerCreation === true) {
            let riskTempFormGroup: any = this.formGroup.controls['riskInfo'];
            let tempFormGroup: any = riskTempFormGroup.at(0).get('insuredList');
            this.createCustomer(true, true, false, tempFormGroup.at(0).value);
        } else {
            this.quoteSaveOpenheld();
        }

    }
    public postQuote() {
        this.formGroup.controls['policyInfo'].get('hasSinglePlan').patchValue(false);
        if (this.hasCustomerCreation === true) {
            let riskTempFormGroup: any = this.formGroup.controls['riskInfo'];
            let tempFormGroup: any = riskTempFormGroup.at(0).get('insuredList');
            this.createCustomer(true, false, false, tempFormGroup.at(0).value);
        } else {
            this.quotPostOnCredit();
        }
    }

    public emailPdfDocumentView() {
        let tempFormGroupDoc;
        tempFormGroupDoc = this.formGroup.controls['documentInfo'].value;
        if (tempFormGroupDoc.length > 0) {
            for (let j = 0; j < tempFormGroupDoc.length; j++) {
                if (tempFormGroupDoc[j].dispatchType === 'PDF') {
                    tempFormGroupDoc[j].isDocumentSelected = true;
                }
            }
        }
        this.service.getDocumentInfo(this.formGroup.value);
    }
    getMimeTypedata(file) {
        if (file['files']) {
            this.transactionTypeInstance.transaction.uploadedFileList.push(file['files'][0]);
            let files: File = <File>file['files'][0];
            this.transactionTypeInstance.transaction.fileSize = files.size;
            let uploadDocInfoFormGroup: FormGroup = <FormGroup>this.formGroup.controls['referQuotInfo'];
            let temp: FormArray = <FormArray>uploadDocInfoFormGroup.controls['attachments'];
            let attachGrp: FormGroup = <FormGroup>temp.controls[temp.controls.length - 1];
            attachGrp.get('documentContent').setErrors(null);
            attachGrp.updateValueAndValidity();
            if (parseInt(this.transactionTypeInstance.transaction.fileSize) < parseInt((this.transactionTypeInstance.transaction.configService.get('fileSize')))) {
                try {
                    let fr = new FileReader();
                    fr.readAsBinaryString(files);
                    fr.onload = function () {
                        attachGrp.get('mimeType').setValue(files.type.toString());
                        attachGrp.get('fileName').setValue(files.name.toString());
                        attachGrp.get('documentContent').setValue(btoa(fr.result.toString()));
                        attachGrp.updateValueAndValidity();
                    };
                } catch (e) {
                    this.transactionTypeInstance.transaction.logger.info(e, 'Error in Upload');
                }
            }
            if (parseInt(this.transactionTypeInstance.transaction.fileSize) > parseInt((this.transactionTypeInstance.transaction.configService.get('fileSize')))) {
                let referInfoArray: FormArray = <FormArray>this.formGroup.controls['referQuotInfo'].get('attachments');
                referInfoArray.at(0).get('documentContent').markAsDirty();
                referInfoArray.at(0).get('documentContent').setErrors({ 'maxSize': true });
                referInfoArray.updateValueAndValidity();
            }
            this.changeRef.markForCheck();
        }
    }

    referQuote() {
        this.referModal = false;
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
        //  if (parseInt(this.fileSize) < parseInt((this.transactionTypeInstance.transaction.configService.get('fileSize')))) {
        this.formGroup.controls['referQuotInfo'].get('referTo').enable();
        this.formGroup.controls['referQuotInfo'].get('referTo').patchValue(this.transactionTypeInstance.transaction.referTo);
        this.formGroup.controls['referQuotInfo'].get('subject').enable();
        this.formGroup.controls['referQuotInfo'].get('subject').patchValue(this.transactionTypeInstance.transaction.subject);
        this.formGroup.controls['policyInfo'].get('referenceType').patchValue('RTUW');
        // tslint:disable-next-line:max-line-length
        if (this.formGroup.controls['policyInfo'].get('policyNo').value && this.formGroup.controls['policyInfo'].get('policyEndtNo').value) {
            let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
            let policyEndtNo = this.formGroup.controls['policyInfo'].get('policyEndtNo').value;
            this.formGroup.controls['policyInfo'].get('referenceNo').patchValue(policyNo + policyEndtNo);
            this.formGroup.controls['referQuotInfo'].get('referralTransKey').patchValue(policyNo + '-' + policyEndtNo);
        }
        this.formGroup.controls['referQuotInfo'].get('technicalUserList').patchValue(this.transactionTypeInstance.transaction.technicalUserArray);
        let attachmentsFormArray: any = this.formGroup.controls['referQuotInfo'].get('attachments');
        let referInfoFormGroup = attachmentsFormArray.at(0);
        if (!referInfoFormGroup.get('fileName').value && !this.formGroup.get('referQuotInfo').value) {
            attachmentsFormArray.removeAt(0);

        }
        let referralResponse = this.service.getreferralService(this.formGroup.value);
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
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralSuccessModalKey, 'modalKey', this.referModalkey);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            });
        //  }

    }
    public validatePlanDetail(dataValInput) {
        let isValidPlan: boolean = false;
        let tempFormGroup;
        tempFormGroup = this.formGroup.controls['riskInfo'];
        if (tempFormGroup.length > 0) {
            let i = 0;
            dataValInput.riskInfo[0].plans.forEach(element => {
                if (tempFormGroup.at(0).controls['plans'].at(i).value.isPlanSelected) {
                    isValidPlan = true;
                    if (!this.multiItemFlag) {
                        this.formGroup.controls['summaryInfo'].patchValue(tempFormGroup.at(0).controls['plans'].at(i).value.summaryInfo);
                        this.formGroup.controls['summaryInfo'].updateValueAndValidity();
                    }
                }
                i++;
            });
        }
        return isValidPlan;
    }

    addUploadComponent() {
        let uploadDocInfoFormGroup;
        let uploadListFormArray;
        uploadDocInfoFormGroup = this.formGroup.controls['referQuotInfo'];
        let test = uploadDocInfoFormGroup.controls['attachments'];
        test.push(this.transactionTypeInstance.transaction.referInfo.getfileuploadModel());
        this.formGroup.controls['referQuotInfo'].patchValue(uploadDocInfoFormGroup);
        this.formGroup.controls['referQuotInfo'].updateValueAndValidity();
        this.changeRef.markForCheck();
    }

    deleteuploadDocument(index) {
        let uploadDocInfoFormGroup: any = this.formGroup.controls['referQuotInfo'];
        let tempClaimFormGroup;
        tempClaimFormGroup = uploadDocInfoFormGroup;
        tempClaimFormGroup.controls['attachments'].removeAt(index);
    }
    public getEmailTemplate() {
        let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
        let policyEndt = this.formGroup.controls['policyInfo'].get('policyEndtNo').value;
        let effectiveDate = this.formGroup.controls['policyInfo'].get('effectiveDt').value;
        let subject = 'Email Quote-' + this.formGroup.controls['policyInfo'].get('quoteNo').value;
        let uniqueField = policyNo + policyEndt;
        let documentId;
        let documentName;
        let tempFormGroupDoc;
        tempFormGroupDoc = this.formGroup.controls['documentInfo'].value;
        if (tempFormGroupDoc.length > 0) {
            for (let j = 0; j < tempFormGroupDoc.length; j++) {
                if (tempFormGroupDoc[j].dispatchType === 'EMAIL') {
                    documentId = tempFormGroupDoc[j].documentId;
                }
                if (tempFormGroupDoc[j].dispatchType === 'PDF') {
                    documentName = tempFormGroupDoc[j].documentDesc;
                }
            }
        }
        let inputjsonToGetEmailTemplate: any[] = [{ uniqueField: uniqueField, documentId: documentId, effdate: effectiveDate, boName: 'UW' }];
        let emailTemplateResponseOutput = this.service.getemailTemplateResponse(inputjsonToGetEmailTemplate);
        emailTemplateResponseOutput.subscribe(
            (emailTemplateResponse) => {
                if (emailTemplateResponse === null) {
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else if (emailTemplateResponse.indexOf('error') > 0 && JSON.parse(emailTemplateResponse).error !== null && JSON.parse(emailTemplateResponse).error !== undefined && JSON.parse(emailTemplateResponse).error.length >= 1) {
                    this.updateErrorObject(JSON.parse(emailTemplateResponse));
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.formGroup.controls['emailQuotInfo'].get('fromAddress').patchValue(this.transactionTypeInstance.transaction.configService.getCustom('user_email'));
                    this.formGroup.controls['emailQuotInfo'].get('fromAddress').updateValueAndValidity();
                    this.formGroup.controls['emailQuotInfo'].get('fromAddress').disable();
                    if (this.formGroup.controls['customerInfo'].get('emailId').value) {
                        this.formGroup.controls['emailQuotInfo'].get('toAddress').patchValue(this.formGroup.controls['customerInfo'].get('emailId').value);
                        this.formGroup.controls['emailQuotInfo'].get('toAddress').updateValueAndValidity();
                    }
                    this.formGroup.controls['emailQuotInfo'].get('subject').patchValue(subject);
                    this.formGroup.controls['emailQuotInfo'].get('subject').updateValueAndValidity();
                    this.formGroup.controls['emailQuotInfo'].get('reason').patchValue(emailTemplateResponse);
                    this.formGroup.controls['emailQuotInfo'].get('reason').updateValueAndValidity();
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailquoteMessage, 'htmlString', this.formGroup.controls['emailQuotInfo'].value.reason);
                    if (documentName !== undefined) {
                        this.formGroup.controls['emailQuotInfo'].get('templateName').patchValue(documentName);
                        this.formGroup.controls['emailQuotInfo'].get('templateName').updateValueAndValidity();
                    } else {
                        this.formGroup.controls['emailQuotInfo'].get('templateName').patchValue('');
                        this.formGroup.controls['emailQuotInfo'].get('templateName').updateValueAndValidity();
                    }
                    this.formGroup.controls['emailQuotInfo'].get('productBrochure').patchValue(documentName);
                    this.formGroup.controls['emailQuotInfo'].get('productBrochure').updateValueAndValidity();

                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    this.emailModal = true;
                    this.formGroup = this.validator.setEmailQuoteModalValidator(this.formGroup);
                    this.updateElements();
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
                    this.changeRef.markForCheck();
                }
            });
    }
    doImmediateSettlement() {
        if (this.transactionTypeInstance.transaction.configService.getCustom('b2b2cFlag')) {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.payByCondition, 'condition', false);
            //  this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paybyCondition, 'condition', true);
        } else {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.payByCondition, 'condition', true);
            // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.cardNumberCondition, 'condition', true);
        }
        this.formGroup.controls['paymentInfo'].get('paymentType').setValue(this.transactionTypeInstance.transaction.paymentTypeCard);
        this.formGroup.controls['paymentInfo'].get('paymentType').updateValueAndValidity();
        this.quoteConfirmAndPay();
        this.doPostAndSettlement(this.formGroup.getRawValue());
    }
    protected quoteConfirmAndPay() {
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentoptionModal, 'modalKey', true);
        // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.issuingBank', 'param1', this.formGroup.controls['policyInfo'].get('PremCurr').value);
        let amount = this.formGroup.controls['summaryInfo'].get('premiumPrime').value;
        let maxCreditAmount = this.transactionTypeInstance.transaction.configService.get('crediCardMaxAmt');
        if (parseInt(amount) > parseInt(maxCreditAmount)) {
            this.formGroup.controls['paymentInfo'].get('paymentType').setValue(this.transactionTypeInstance.transaction.paymentTypeCheque);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.chequeNumberCondition, 'condition', true);
            this.formGroup.controls['paymentInfo'].get('paymentType').disable();
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentOptionModalPay, 'buttonName', 'NCPBtn.confirm');
        } else {
            this.formGroup.controls['paymentInfo'].get('paymentType').valueChanges.subscribe((data) => {
                if (this.formData) {
                    if (data === this.transactionTypeInstance.transaction.paymentTypeCheque) {
                        // this.formGroup = this.validator.setPaymentValidationsForCheque(this.formGroup);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.chequeNumberCondition, 'condition', true);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentOptionModalPay, 'isDisabled', !this.formGroup.controls['paymentInfo'].valid);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentOptionModalPay, 'buttonName', 'NCPBtn.confirm');

                    } else {
                        // this.formGroup = this.validator.clearPaymentValidationsForCheque(this.formGroup);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.chequeNumberCondition, 'condition', false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentOptionModalPay, 'isDisabled', false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentOptionModalPay, 'buttonName', 'NCPBtn.pay');
                    }
                }
                this.changeRef.markForCheck();
            });
        }
        this.changeRef.markForCheck();

        this.formGroup.controls['paymentInfo'].statusChanges.subscribe((data) => {
            if (this.formGroup.controls['paymentInfo'].get('paymentType').value === this.transactionTypeInstance.transaction.paymentTypeCheque) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentOptionModalPay, 'isDisabled', !this.formGroup.controls['paymentInfo'].valid);
            }
            this.changeRef.markForCheck();
        });

    }
    doPostAndSettlement(payData, paymentData?) {

        this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
        if (paymentData && paymentData.status !== 'CANCEL') {
            let transferRefNoJson = {
                "transRefNo": paymentData.transRefNo
            };
            let postQuoteresponse = this.service.postQuote(transferRefNoJson);
            postQuoteresponse.subscribe((postQuoteResponseData) => {
                if (postQuoteResponseData) {
                    if (postQuoteResponseData.policyInfo.status == 'QT') {
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyFailureModal, 'modalKey', true);
                        this.updateElements();
                        this.changeRef.markForCheck();
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    } else {
                        this.formGroup.controls['policyInfo'].patchValue(postQuoteResponseData.policyInfo);
                        this.onCreditModal = true;
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                        this.updateElements();
                        this.changeRef.markForCheck();
                        this.formGroup.controls['policyInfo'].get('policyNo').disable();
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    }
                }
            });
        } else {
            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
        }
    }
    // + doInitializeIdArray and validateIdentityNumberUniqueNess to restrict duplicate IDentity Number Insertion
    doInitializeIdArray() {
        let riskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let insuredList: FormArray = riskInfoArray.at(0).get('insuredList').value;
        let travellerTypeCode: string = riskInfoArray.at(0).get('travellerTypeCode').value;
        this.transactionTypeInstance.transaction.identityNumbersArray = [];
        if (this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value && travellerTypeCode === 'IND') return;
        if (this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value && this.formGroup.controls['customerInfo'].get("identityNo").value !== '')
            this.transactionTypeInstance.transaction.identityNumbersArray.push(this.formGroup.controls['customerInfo'].get("identityNo").value + '~' + this.formGroup.controls['customerInfo'].get("identityTypeCode").value);
        for (let i = 0; i < insuredList.length; i++) {
            if (insuredList[i].identityNo !== '')
                this.transactionTypeInstance.transaction.identityNumbersArray.push(insuredList[i].identityNo + '~' + insuredList[i].identityTypeCode);
        }
    }
    public validateIdentityNumberUniqueNess(): boolean {
        this.doInitializeIdArray();
        let tempIdentityNumberStorage: Object = {};
        this.transactionTypeInstance.transaction.identityNumbersArray.forEach(element => {
            if (!tempIdentityNumberStorage.hasOwnProperty(element)) tempIdentityNumberStorage[element] = true;
        });
        return Object.keys(tempIdentityNumberStorage).length === this.transactionTypeInstance.transaction.identityNumbersArray.length;
    }
    public updateElements() { }


    // + Endorsement Related Methods are here 
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

    doEndorsementReasonFormGroupUpdate(caller: string = 'next') {
        try {
            switch (this.transactionTypeInstance.endtReasonCode) {
                case this.transactionTypeInstance.transaction.utilService.getEndorsementTypeCode('CANCEL'):
                    break;
                case this.transactionTypeInstance.transaction.utilService.getEndorsementTypeCode('ADD_DELETE_INSURED_PERSON'):
                    break;
                case this.transactionTypeInstance.transaction.utilService.getEndorsementTypeCode('CHANGE_INSURED_PERSONAL_DETAILS'):
                    if (caller == 'next') {
                        if (this.transactionTypeInstance.transaction.currentTab === '02') {
                            this.doEndtReasonCode();
                            this.updateInsuredList(this.policyRatingData);
                            this.transactionTypeInstance.noPaymentRequiredFlag = true;
                        }
                    } else {
                        if (this.transactionTypeInstance.transaction.currentTab === '04') {
                            this.doEndtReasonCode();
                        }
                    }
                    break;
                case this.transactionTypeInstance.transaction.utilService.getEndorsementTypeCode('CHANGE_IN_COVER'):
                    this.transactionTypeInstance.transaction.isEnablePlanTableFlag = true;
                    break;
                case this.transactionTypeInstance.transaction.utilService.getEndorsementTypeCode('CHANGE_PERIOD'):
                    break;
                default:
                    break;
            }
            this.changeRef.markForCheck();
        } catch (e) {
            this.transactionTypeInstance.transaction.logger.error(e + ' endtReasonCode is not set');
        }
    }

    doEndtReasonCode(doEnable: boolean = true) {
        this.transactionTypeInstance.endtReasonCode = this.formGroup.controls['policyInfo'].get('endtReasonCode').value;
        this.transactionTypeInstance.NCPEndtReasonCode = this.formGroup.controls['policyInfo'].get('ncpEndtReasonCode').value;
        this.formGroup = this.transactionTypeInstance.endorsementTypes.getEndorsementType(this.formGroup, this.transactionTypeInstance.NCPEndtReasonCode, doEnable);
    }

    public doPolicyRating() {
        let policyRatingResponse = this.service.getPolicyRatingInfo(this.formGroup.getRawValue());
        policyRatingResponse.subscribe(
            (policyRatingDataVal) => {
                // tslint:disable-next-line:max-line-length
                if ((policyRatingDataVal.error !== null) && (policyRatingDataVal.error !== undefined) && (policyRatingDataVal.error.length >= 1)) {
                    this.updateErrorObject(policyRatingDataVal);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.formGroup.controls['summaryInfo'].patchValue(policyRatingDataVal.summaryInfo);
                    this.formGroup.controls['summaryInfo'].updateValueAndValidity();
                    this.formGroup.controls['customerInfo'].patchValue(policyRatingDataVal.customerInfo);
                    this.formGroup.controls['customerInfo'].updateValueAndValidity();
                    this.formGroup.controls['policyInfo'].patchValue(policyRatingDataVal.policyInfo);
                    this.formGroup.controls['policyInfo'].updateValueAndValidity();
                    this.formGroup.controls['errorInfo'] = this.updateErrorInfoValue(policyRatingDataVal);
                    this.formGroup.controls['errorInfo'].updateValueAndValidity();
                    this.formGroup.controls['instalmentItemInfo'] = this.updateInstalmentItemInfoValue(policyRatingDataVal);
                    this.formGroup.controls['instalmentItemInfo'].updateValueAndValidity();
                    this.transactionTypeInstance.isPolicyRatingDone = true;
                    this.updatePlanDatas(policyRatingDataVal);
                    this.policyRatingData = policyRatingDataVal;
                    if (this.transactionTypeInstance.isPolicyFlag && this.transactionTypeInstance.endorsementTypes.isChangeInCover === false) {
                        this.doEndtReasonCode(false);
                    }
                    if (this.transactionTypeInstance.isPolicyFlag && this.transactionTypeInstance.endorsementTypes.isChangeInCover === true)
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableListArrayViewButton, 'isDisabled', false);

                    this.setPaymentRequiredFlags();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }

    public getEffectiveDateLabel() {
        let label = 'NCPLabel.effectiveDate';
        let changeCoverEndtType = this.transactionTypeInstance.transaction.utilService.getEndorsementTypeCode('CANCEL');
        if (this.transactionTypeInstance.transaction.status === 'EndEnquiry') {
            let endtReasonCode = this.formGroup.controls['policyInfo'].get('endtReasonCode').value;
            if (changeCoverEndtType === endtReasonCode) {
                label = 'NCPLabel.cancellationDate';
            }
        }
        return label;
    }

    public policySaveOpenheld() {
        let policySaveResponse = this.service.doPolicySave(this.formGroup.getRawValue());
        policySaveResponse.subscribe(
            (policySaveResponse) => {
                // tslint:disable-next-line:max-line-length
                if ((policySaveResponse.error !== null) && (policySaveResponse.error !== undefined) && (policySaveResponse.error.length >= 1)) {
                    this.updateErrorObject(policySaveResponse);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.saveModal = true;
                    this.changeRef.markForCheck();
                    this.updateElements();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }
    public policyPostOnCredit() {
        // this.doEndtReasonCode(false);
        let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
        let policyEndtNo = this.formGroup.controls['policyInfo'].get('policyEndtNo').value;
        this.formGroup.controls['paymentInfo'].get('policyNo').patchValue(policyNo);
        this.formGroup.controls['paymentInfo'].get('policyEndtNo').patchValue(policyEndtNo);
        let postValue = this.formGroup.getRawValue();
        postValue.policyInfo.paymentTime = this.transactionTypeInstance.transaction.utilService.getTimeNow();
        postValue.policyInfo.paymentDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(this.transactionTypeInstance.transaction.todayDate);
        let policyPostsResponse = this.service.doPolicyEndtPostingOnCreditInfo(postValue);
        policyPostsResponse.subscribe(
            (policyPostsResponse) => {
                if ((policyPostsResponse.error !== null) && (policyPostsResponse.error !== undefined) && (policyPostsResponse.error.length >= 1)) {
                    this.updateErrorObject(policyPostsResponse);
                    // this.formGroup.disable();
                } else {
                    this.onCreditModal = true;
                    this.formGroup.controls['policyInfo'].patchValue(policyPostsResponse.policyInfo);
                    this.policyPostsResponseVal = policyPostsResponse;
                    if (this.policyPostsResponseVal.documentInfo) this.transactionTypeInstance.transaction.docInfo = this.policyPostsResponseVal.documentInfo;
                    this.formGroup.controls['policyInfo'].get('policyNo').disable();
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                }
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
            });
    }
    public savePolicy() {
        this.policySaveOpenheld();
    }
    public paymentMatrix() {
        let partyDetailsResponse = this.userService.doCheckpartyid({ 'user_party_id': this.transactionTypeInstance.transaction.configService.getCustom('user_party_id') });
        partyDetailsResponse.subscribe((data) => {
            if (data.paymentTypeCode && data.paymentTypeDesc) {
                let paymentType = this.transactionTypeInstance.transaction.configService.get(data.paymentTypeCode).toLowerCase();
                if (paymentType === 'cash') {
                    this.transactionTypeInstance.transaction.payByCredit = false;
                }
            }
            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
        });
    }
    public doSetupSummaryScreenPayment() {
        this.setPaymentRequiredFlags();
        if (this.transactionTypeInstance.transaction.status === 'EndEnquiry') {
            if (this.transactionTypeInstance.endorsementTypes.isAddDeleteInsuredPerson) {
                this.doEndtReasonCode(false);
                let policyRatingResponse = this.service.getPolicyRatingInfo(this.formGroup.getRawValue());
                policyRatingResponse.subscribe(
                    (policyRatingDataVal) => {
                        // tslint:disable-next-line:max-line-length
                        if ((policyRatingDataVal.error !== null) && (policyRatingDataVal.error !== undefined) && (policyRatingDataVal.error.length >= 1)) {
                            this.updateErrorObject(policyRatingDataVal);
                            this.transactionTypeInstance.transaction.setLoadingSub('no');
                        } else {
                            this.formGroup.controls['summaryInfo'].patchValue(policyRatingDataVal.summaryInfo);
                            this.formGroup.controls['summaryInfo'].updateValueAndValidity();
                            this.formGroup.controls['customerInfo'].patchValue(policyRatingDataVal.customerInfo);
                            this.formGroup.controls['customerInfo'].updateValueAndValidity();
                            this.formGroup.controls['policyInfo'].patchValue(policyRatingDataVal.policyInfo);
                            this.formGroup.controls['policyInfo'].updateValueAndValidity();
                            this.formGroup.controls['errorInfo'] = this.updateErrorInfoValue(policyRatingDataVal);
                            this.formGroup.controls['errorInfo'].updateValueAndValidity();
                            this.formGroup.controls['instalmentItemInfo'] = this.updateInstalmentItemInfoValue(policyRatingDataVal);
                            this.formGroup.controls['instalmentItemInfo'].updateValueAndValidity();
                            this.updatePlanDatas(policyRatingDataVal);
                            this.policyRatingData = policyRatingDataVal;
                            if (parseInt(this.formGroup.controls['summaryInfo'].get('netPremiumPrime').value) < 0 && parseInt(this.formGroup.controls['summaryInfo'].get('premiumPrime').value) < 0) {
                                this.formGroup.controls['summaryInfo'].get('netPremiumPrime').patchValue(this.formGroup.controls['summaryInfo'].get('netPremiumPrime').value.slice(1));
                                this.formGroup.controls['summaryInfo'].get('premiumPrime').patchValue(this.formGroup.controls['summaryInfo'].get('premiumPrime').value.slice(1));
                                this.transactionTypeInstance.transaction.payByCash = false;
                                this.transactionTypeInstance.isRefundFlag = true;
                                this.transactionTypeInstance.noPaymentRequiredFlag = true;
                                this.updateElements();
                                this.changeRef.markForCheck();
                            } else if (parseInt(this.formGroup.controls['summaryInfo'].get('netPremiumPrime').value) > 0 && parseInt(this.formGroup.controls['summaryInfo'].get('premiumPrime').value) > 0) {
                                this.paymentMatrix();
                            } else if (parseInt(this.formGroup.controls['summaryInfo'].get('netPremiumPrime').value) === 0 && parseInt(this.formGroup.controls['summaryInfo'].get('premiumPrime').value) === 0) {
                                this.transactionTypeInstance.transaction.payByCash = false;
                                this.transactionTypeInstance.noPaymentRequiredFlag = true;
                                this.updateElements();
                                this.changeRef.markForCheck();
                            }
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');

                            this.doEndtReasonCode(false);
                        }
                    },
                    (error) => {
                        this.transactionTypeInstance.transaction.logger.error(error);
                        this.transactionTypeInstance.transaction.setLoadingSub('no');
                    });
            }
        } else {
            this.validatePlanDetail(this.formGroup.getRawValue());
            this.updateElements();
            this.changeRef.markForCheck();
        }
    }
    public isMultipleInsuredList() {
        let tempRiskFormGroup;
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        return riskInfoFormArray.at(0).get('numberofAdults').value > 1;
    }
    public doUndoRemoveInsuredList(riskIndex, insuredIndex) {
        let tempRiskFormGroup;
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        let InsuredListFormArray = riskInfoFormArray.at(riskIndex).get('insuredList');
        let numberofAdults = riskInfoFormArray.at(riskIndex).get('numberofAdults').value;
        riskInfoFormArray.at(riskIndex).get('numberofAdults').patchValue(++numberofAdults);
        InsuredListFormArray.at(insuredIndex).get('travellerStatusCode').patchValue('A');
    }
    public doRemoveInsuredList(riskIndex, insuredIndex) {
        let tempRiskFormGroup;
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        let InsuredListFormArray = riskInfoFormArray.at(riskIndex).get('insuredList');
        InsuredListFormArray.at(insuredIndex).get('travellerStatusCode').patchValue('D');
        let numberofAdults = riskInfoFormArray.at(riskIndex).get('numberofAdults').value;
        riskInfoFormArray.at(riskIndex).get('numberofAdults').patchValue(--numberofAdults);
        // this.updateElements();
        // this.changeRef.markForCheck();
    }
    public doAddInsuredList(index) {
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        let numberofAdults = riskInfoFormArray.at(index).get('numberofAdults').value;
        let numberofTravellers = riskInfoFormArray.at(index).get('numberofTravellers').value;
        if (numberofTravellers < 20) {
            riskInfoFormArray.at(index).get('numberofAdults').patchValue(++numberofAdults);
            let InsuredListFormArray = riskInfoFormArray.at(index).get('insuredList');
            InsuredListFormArray.push(this.transactionTypeInstance.transaction.insured.getInsuredInfoModel());
            let temp = this.validator.setInsuredValidators(this.formGroup, InsuredListFormArray.at(InsuredListFormArray.length - 1));
            InsuredListFormArray.removeAt(InsuredListFormArray.length - 1);
            InsuredListFormArray.insert(InsuredListFormArray.length, temp);
            this.changeRef.markForCheck();
            for (let i = 0; i < InsuredListFormArray.length; i++) {
                let insuredListFormGroup = InsuredListFormArray.at(i);
                insuredListFormGroup.get('key').patchValue(String(i + 1));
                insuredListFormGroup.get('effectiveDate').patchValue(this.transactionTypeInstance.transaction.utilService.getTodayDate());
            }
        }
        else {
            this.updateErrorObject(this.customizedErrorListInsuredCount);
        }
    }
    public appendEffectiveDateToInsuredList() {
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let tempRiskFormGroup = riskInfoArray.at(0);
        let insuredListLength = tempRiskFormGroup.controls['insuredList'].length;
        for (let i = 0; i < insuredListLength; i++) {
            tempRiskFormGroup.controls['insuredList'].at(i).get('effectiveDate').setValue(this.transactionTypeInstance.transaction.utilService.getTodayDate());
        }
    }
    public postPolicy() {
        this.policyPostOnCredit();
    }

    public createMultipleCustomers(formGroup: FormGroup, isSave) {
        let riskArray: FormArray = <FormArray>formGroup.get('riskInfo');
        let len = riskArray.controls.length;
        let count = 0;
        riskArray.controls.forEach((element, i) => {
            let customerInfo: FormGroup = this.transactionTypeInstance.transaction.customerInfo.getPACustomerInfoModel();
            customerInfo.patchValue(element.value);
            let addCustomerResponse;
            if (customerInfo.get('appCode').value) {
                addCustomerResponse = this.customerService.updateCustomerDetails({ customerInfo: customerInfo.value });
            } else {
                addCustomerResponse = this.customerService.addNewCustomer({ customerInfo: customerInfo.value });
            }
            addCustomerResponse.subscribe((customerInfoDataVal) => {
                count = count + 1;
                if (customerInfoDataVal && customerInfoDataVal.error !== null && customerInfoDataVal.error !== undefined && customerInfoDataVal.error.length >= 1) {
                    this.updateErrorObject(customerInfoDataVal);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    if (customerInfoDataVal.customerInfo) element.patchValue(customerInfoDataVal.customerInfo);
                    if (count === len) {
                        if (isSave) {
                            this.quoteSaveOpenheld();
                        } else {
                            this.quotPostOnCredit();
                        }
                    }
                }
            });
        });
    }
    doPayment(inputdata) {
        try {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentoptionModal, 'modalKey', false);
            // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentGatewayModal, 'modalKey', true);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.PaymentGatewayInfo, 'paymentInfo', inputdata);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.PaymentGatewayInfo, 'formValue', this.formGroup.getRawValue());
            this.changeRef.markForCheck();
            //   let paymentStatus = 'NO';
            //   paymentStatus = this.formGroup.controls['paymentInfo'].get('status').value;
            //  if (paymentStatus === 'YES') {
            //      this.doPostAndSettlement(this.formGroup.getRawValue());
            // } else {
            if (this.transactionTypeInstance.isPolicyFlag) {
                inputdata[inputdata.length] = { "isEndorsmentFlag": true };
            }
            this.transactionTypeInstance.transaction.paymentService.paymentPushedData.emit(inputdata);
            // }
        } catch (e) {
            this.transactionTypeInstance.transaction.logger.error('doPayment error');
        }
    }
    updateElementsForPolicy() {
        this.isShowBackButton = this.userService._config.getCustom('policyMoventBackButton');
        if (this.formData && this.transactionTypeInstance.isPolicyFlag) {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.todayLabel, 'elementLabel', this.getEffectiveDateLabel());
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.todayDatepicker, 'elementLabel', this.getEffectiveDateLabel());
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.todayDatepicker, 'options', this.setNCPDatePickerEffectiveDateOptions());
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.SummaryTable, 'isEndorsementFlag', !this.transactionTypeInstance.transaction.isEnquiryFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.SummaryTable, 'transactionType', this.transactionType);
            if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addDeleteItemquoteCalculate, 'isDisabled', false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'disableDelBtn', this.disableDelRisk);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoViewButton, 'isDisabled', false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'enableAddDelBtn', !this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.SummaryTable, 'elementFormName', this.formGroup);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.SummaryTable, 'LOB', this.transactionTypeInstance.transaction.lobCode);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.rowDivInnerPolicyNoSpanDataGroupDisp, 'label', '   ' + this.formGroup.controls['policyInfo'].get('policyNo').value + ' - ' + this.formGroup.controls['policyInfo'].get('policyEndtNo').value);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'buttonName', !this.transactionTypeInstance.noPaymentRequiredFlag ? 'Confirm On Credit' : 'Confirm');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'enableAddDelBtn', false);
                if (this.transactionTypeInstance.endorsementTypes.isChangeInsuredPersonDetails === false) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.totalPremiumLabel, 'elementLabel', !this.transactionTypeInstance.isRefundFlag ? 'NCPLabel.premiumPayble' : 'NCPLabel.premiumRefund');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.netPremiumPrimeCondition, 'condition', this.transactionTypeInstance.isPolicyRatingDone);
                }
                if (this.transactionTypeInstance.endorsementTypes.isChangeInCover === true) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planType, 'productCode', this.transactionTypeInstance.transaction.productCode.toUpperCase());
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planType, 'excluded', this.transactionTypeInstance.transaction.configService.getCustom('policyLastMovementData')['selectedCoverCode']);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSelectedCover, 'riskInfoArray', this.riskInfoArray);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSelectedCover, 'productCode', this.productCode);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'enableAddDelBtn', false);
                } else if (this.transactionTypeInstance.endorsementTypes.isChangePeriod === true) {
                    this.doEnableDateFields();
                }
                else if (this.transactionTypeInstance.endorsementTypes.isAddDeleteInsuredPerson === true) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.searchInsurerCondition, 'condition', this.riskInfoGroup.get('insuredList').value.length > 10);
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.removeInsuredDetailCondition, 'condition', this.doShowRemoveInsuredButton());
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addInsuredPersonModalKey, 'modalKey', this.addInsuredPersonModal);
                }
                else if (this.transactionTypeInstance.endorsementTypes.isDeleteItem === true) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'enableAddDelBtn', true);
                    if (this.riskInfoGroup.get('insuredList')) {
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.searchInsurerCondition, 'condition', this.riskInfoGroup.get('insuredList').value.length > 10);
                    }
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.removeInsuredDetailCondition, 'condition', true);
                } else if (this.transactionTypeInstance.endorsementTypes.isAddItem === true) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addItemModalKey, 'modalKey', this.addItemModal);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'enableAddDelBtn', true);
                    if (this.riskInfoGroup.get('insuredList')) {
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.searchInsurerCondition, 'condition', this.riskInfoGroup.get('insuredList').value.length > 10);
                    }
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.removeInsuredDetailCondition, 'condition', this.doShowRemoveItemButton());
                } else if (this.transactionTypeInstance.endorsementTypes.isOthers === true || this.transactionTypeInstance.endorsementTypes.isChangeInPremium === true) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'disableNext', !this.transactionTypeInstance.transaction.isValidForm);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'wizardConfig', this.transactionTypeInstance.transaction.wizardConfig);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCreditCondition, 'condition', !this.transactionTypeInstance.transaction.getIsB2B() ? false : this.transactionTypeInstance.transaction.payByCredit);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNowCondition, 'condition', !this.transactionTypeInstance.transaction.getIsB2B() ? true : this.transactionTypeInstance.transaction.payByCash);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalTitle', 'NCPLabel.policyPostedSuccessfully');
                    this.policyUpdateElements(false);
                    this.doEnableDateFields();
                }
            } else {
                this.policyUpdateElements(true);
            }
        }
    }
    policyUpdateElements(isDisable) {
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTab, 'tabTitle', 'NCPTab.policy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.todayCondition, 'condition', this.formGroup.controls['policyInfo'].get('endtReasonCode').value !== '00');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModal, 'buttonName', 'NCPBtn.referPolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModal, 'isDisabled', isDisable);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteButton, 'buttonName', 'NCPBtn.referPolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteButton, 'isDisabled', isDisable);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteModalButton, 'buttonName', 'NCPBtn.referPolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteModalButton, 'isDisabled', isDisable);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModal, 'buttonName', 'NCPBtn.savePolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteButton, 'buttonName', 'NCPBtn.savePolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailModal, 'isDisabled', isDisable);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailModal, 'buttonName', 'NCPBtn.emailPolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteButton, 'isDisabled', isDisable);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteButton, 'buttonName', 'NCPBtn.emailPolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModal, 'isDisabled', isDisable);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralButton, 'isDisabled', isDisable);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocsConditionButton, 'buttonName', 'NCPBtn.printpolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocsButton, 'buttonName', 'NCPBtn.printpolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocumentsButton, 'buttonName', 'NCPBtn.printpolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteButtonModalButton, 'buttonName', 'NCPBtn.emailPolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuoteModalButton, 'buttonName', 'NCPBtn.savePolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referQuoteBtn, 'buttonName', 'NCPBtn.referPolicy');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.netpremium, 'label', !this.transactionTypeInstance.isRefundFlag ? 'Net Premium' : 'Refund');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.premium, 'label', !this.transactionTypeInstance.isRefundFlag ? 'Premium' : 'Refund');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, 'quoteNoMotor', 'elementFormName', 'policyNo');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteNo, 'elementId', 'policyNo');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteNo, 'elementFormName', 'policyNo');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteNoLabel, 'elementLabel', 'NCPLabel.policyNo');
    }
    doEnableDateFields() {
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyInfoCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm !== this.transactionTypeInstance.transaction.policyTermAnnul);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coverDateCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermAnnul);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryDate, 'options', this.setNCPDatePickerToDateOptions());
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerToDateAnnualOptions);
    }
    setPaymentRequiredFlags() {
        this.transactionTypeInstance.transaction.payByCash = false;
        this.transactionTypeInstance.isRefundFlag = false;
        this.transactionTypeInstance.noPaymentRequiredFlag = false;
        if (parseInt(this.formGroup.controls['summaryInfo'].get('netPremiumPrime').value) < 0 && parseInt(this.formGroup.controls['summaryInfo'].get('premiumPrime').value) < 0) {
            // this.formGroup.controls['summaryInfo'].get('netPremiumPrime').patchValue(this.formGroup.controls['summaryInfo'].get('netPremiumPrime').value.slice(1));
            // this.formGroup.controls['summaryInfo'].get('premiumPrime').patchValue(this.formGroup.controls['summaryInfo'].get('premiumPrime').value.slice(1));
            this.transactionTypeInstance.transaction.payByCash = false;
            this.transactionTypeInstance.isRefundFlag = true;
            this.transactionTypeInstance.noPaymentRequiredFlag = true;
        } else if (parseInt(this.formGroup.controls['summaryInfo'].get('netPremiumPrime').value) > 0 && parseInt(this.formGroup.controls['summaryInfo'].get('premiumPrime').value) > 0) {
            this.paymentMatrix();
        } else if (parseInt(this.formGroup.controls['summaryInfo'].get('netPremiumPrime').value) === 0 && parseInt(this.formGroup.controls['summaryInfo'].get('premiumPrime').value) === 0) {
            this.transactionTypeInstance.transaction.payByCash = false;
            this.transactionTypeInstance.noPaymentRequiredFlag = true;
        }
        if (this.transactionTypeInstance.endorsementTypes.isChangeInsuredPersonDetails) this.transactionTypeInstance.noPaymentRequiredFlag = true;

        this.updateElements();
        this.changeRef.markForCheck();
    }
    doCommonEndtUpdates() {
        this.formGroup.controls['policyInfo'].get('endtReasonCode').disable();
        this.formGroup.controls['policyInfo'].get('endtReasonCodeDesc').disable();
        this.formGroup.controls['policyInfo'].get('isPersonalInfoStatementEnabled').setValue(null);
        this.formGroup.controls['policyInfo'].get('isWarantyAndDeclarationEnabled').setValue(null);
        this.formGroup.controls['policyInfo'].get('isImportantNoticeEnabled').setValue(null);
        this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').setValue(null);
        // if (this.transactionTypeInstance.isPolicyHeld) {
        // if (this.riskInfoGroup.get('plans').value.length == 1) {
        //     this.riskInfoGroup.get('plans').value[0].planTypeCode = this.transactionTypeInstance.transaction.configService.getCustom('policyLastMovementData')['selectedCoverCode'];
        //     this.riskInfoGroup.get('plans').value[0].planTypeDesc = this.transactionTypeInstance.transaction.configService.getCustom('policyLastMovementData')['selectedCoverDesc'];
        // } else if (this.riskInfoGroup.get('plans').value.length > 1) {
        //     this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteCalculate, 'isDisabled', false);
        // }
        // }
        this.transactionTypeInstance.isPolicyRatingDone = this.transactionTypeInstance.endorsementTypes.isChangeInsuredPersonDetails || (this.formGroup.controls['summaryInfo'].get('netPremiumPrime').value && this.formGroup.controls['summaryInfo'].get('netPremiumPrime').value != "0.00");
        if (this.transactionTypeInstance.isPolicyRatingDone) {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteCalculate, 'isDisabled', false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableListArrayViewButton, 'isDisabled', false);
        }
        this.riskInfoArray = this.formGroup.controls['riskInfo'].value.slice();
        this.setPaymentRequiredFlags();
        window.scrollBy(0, 200);
    }
    doCommonUpdateForRenewal() {
        this.formGroup.controls['policyInfo'].get('isPersonalInfoStatementEnabled').setValue(null);
        this.formGroup.controls['policyInfo'].get('isWarantyAndDeclarationEnabled').setValue(null);
        this.formGroup.controls['policyInfo'].get('isImportantNoticeEnabled').setValue(null);
        this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').setValue(null);
    }
    public setNewQuoteRoute() {
        this.transactionTypeInstance.transaction.status = 'NewQuote';
        let quoteRoutes = this.transactionTypeInstance.transaction.utilService.getLOBRoute(this.productCode);
        this.transactionTypeInstance.transaction.configService.navigateRouterLink(quoteRoutes);
    }
    public doStripQueryParams() {
        let quoteRoutes = this.transactionTypeInstance.transaction.utilService.getLOBRoute(this.productCode);
        if (quoteRoutes) {
            this.transactionTypeInstance.transaction.activeRoutePath = quoteRoutes.split('/').pop();
            this.transactionTypeInstance.transaction.configService.navigateRouterLink(quoteRoutes);
        }
        else {
            this.transactionTypeInstance.transaction.utilService.loadedSub.subscribe(() => {
                let quoteRoutes = this.transactionTypeInstance.transaction.utilService.getLOBRoute(this.productCode);
                this.transactionTypeInstance.transaction.activeRoutePath = quoteRoutes.split('/').pop();
                this.transactionTypeInstance.transaction.configService.navigateRouterLink(quoteRoutes);
            });
        }
    }
    public getPostalCodeRefresh() {
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
                    this.formGroup.controls['customerInfo'].get('zipCd').setErrors({ 'notFound': true });
                    // this.updateErrorObject(postalCodeResponseData);
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
                    this.formGroup.controls['customerInfo'].get('cityCode').patchValue(postalCodeResponseData.cityCode.trim());
                    this.formGroup.controls['customerInfo'].get('cityCode').updateValueAndValidity();
                    this.formGroup.controls['customerInfo'].get('cityDesc').patchValue(postalCodeResponseData.cityDesc.trim());
                    this.formGroup.controls['customerInfo'].get('cityDesc').updateValueAndValidity();
                    this.formGroup.controls['customerInfo'].get('state').patchValue(postalCodeResponseData.stateCode.trim());
                    this.formGroup.controls['customerInfo'].get('state').updateValueAndValidity();
                    this.formGroup.controls['customerInfo'].get('stateDesc').patchValue(postalCodeResponseData.state.trim());
                    this.formGroup.controls['customerInfo'].get('stateDesc').updateValueAndValidity();
                    this.formGroup.controls['customerInfo'].get('countryCode').patchValue(postalCodeResponseData.countryCode.trim());
                    this.formGroup.controls['customerInfo'].get('countryCode').updateValueAndValidity();
                    this.formGroup.controls['customerInfo'].get('countryDesc').patchValue(postalCodeResponseData.countryDesc.trim());
                    this.formGroup.controls['customerInfo'].get('countryDesc').updateValueAndValidity();
                    if (postalCodeResponseData.countryCode) {
                        this.formGroup.controls['customerInfo'].get('countryCode').disable();
                        this.formGroup.controls['customerInfo'].get('countryDesc').disable();
                        this.formGroup.controls['customerInfo'].get('countryCode').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('countryDesc').updateValueAndValidity();
                    }
                    if (postalCodeResponseData.cityCode) {
                        this.formGroup.controls['customerInfo'].get('cityCode').disable();
                        this.formGroup.controls['customerInfo'].get('cityCode').updateValueAndValidity();
                        this.formGroup.controls['customerInfo'].get('cityDesc').disable();
                        this.formGroup.controls['customerInfo'].get('cityDesc').updateValueAndValidity();
                    }
                    // this.formGroup.controls['customerInfo'].get('appUnitNumber').disable();
                    // this.formGroup.controls['customerInfo'].get('blockNumber').disable();
                    // this.formGroup.controls['customerInfo'].get('address1').disable();
                    // this.formGroup.controls['customerInfo'].get('address2').disable();
                    // this.formGroup.controls['customerInfo'].get('cityCode').disable();
                    // this.formGroup.controls['customerInfo'].get('cityDesc').disable();
                    // this.formGroup.controls['customerInfo'].get('state').disable();
                    // this.formGroup.controls['customerInfo'].get('countryCode').disable();
                    // this.formGroup.controls['customerInfo'].get('countryDesc').disable();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
                this.updateElements();
                this.changeRef.markForCheck();
            }
        );
    }
    public isValidateNomineeInRisk() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let validFlag = true;
        if (validFlag) {
            tempRiskInfoArray.controls.forEach(riskElement => {
                let nomineeList: FormArray = <FormArray>riskElement.get('nomineeList');
                let totalShare: number = 0;
                if (validFlag) {
                    nomineeList.controls.forEach(ele => {
                        if (ele.get('nomineeShare').value) {
                            totalShare = totalShare + parseInt(ele.get('nomineeShare').value);
                        }
                        if (ele.get('appFName').value || ele.get('appLName').value) {
                            ele.get('appFullName').setValue(ele.get('appFName').value.toString() + ' ' + ele.get('appLName').value.toString())
                        }
                    });
                    if (totalShare === 100) {
                        validFlag = true;
                    } else {
                        validFlag = false;
                    }
                }
            });
        }
        return validFlag;
    }
    public isValidateNominee() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let validFlag = true;
        if (validFlag) {
            tempRiskInfoArray.controls.forEach(riskElement => {
                let tempInsuredArray: FormArray = <FormArray>riskElement.get('insuredList');
                if (validFlag) {
                    tempInsuredArray.controls.forEach(element => {
                        let nomineeList: FormArray = <FormArray>element.get('nomineeList');
                        let totalShare: number = 0;
                        if (validFlag) {
                            nomineeList.controls.forEach(ele => {
                                if (ele.get('nomineeShare').value) {
                                    totalShare = totalShare + parseInt(ele.get('nomineeShare').value);
                                }
                                if (ele.get('appFName').value || ele.get('appLName').value) {
                                    ele.get('appFullName').setValue(ele.get('appFName').value.toString() + ' ' + ele.get('appLName').value.toString());
                                }
                            });
                            this.disabledInsuredData['nomineeList'] = tempInsuredArray.controls[0].get('nomineeList').value;
                            if (totalShare === 100) {
                                validFlag = true;
                            } else {
                                validFlag = false;
                            }
                        }
                    });
                }
            });
        }
        return validFlag;
    }
    public doInsuredRefresh(data, isRiskLevel: boolean = false, markAsDirtyFlag: boolean = false) {
        if (!this.multiItemFlag) {
            let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
            let tempRiskInfoGroup = tempRiskInfoArray.at(0);
            let tempInsuredArray: FormArray = <FormArray>tempRiskInfoGroup.get('insuredList');
            let indexValue = (parseInt(data.value.parentIndex) > -1) ? data.value.parentIndex : data.value.index;
            let tempInsuredGroup: FormGroup = <FormGroup>tempInsuredArray.at(indexValue);
            if (markAsDirtyFlag) {
                tempInsuredGroup.controls['identityNo'].markAsDirty();
                tempInsuredGroup.controls['identityTypeCode'].markAsDirty();
            }
            this.doCustomerRefresh(tempInsuredGroup, data.id);
        }
        else {
            let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
            let parentIndexValue = (parseInt(data.value.superParentIndex) > -1) ? data.value.superParentIndex : data.value.parentIndex;
            let tempRiskInfoGroup = tempRiskInfoArray.at(parentIndexValue);
            if (isRiskLevel === false) {
                let tempInsuredArray: FormArray = <FormArray>tempRiskInfoGroup.get('insuredList');
                let indexValue = (parseInt(data.value.parentIndex) > -1) ? data.value.parentIndex : data.value.index;
                let tempInsuredGroup: FormGroup = <FormGroup>tempInsuredArray.at(indexValue);
                if (markAsDirtyFlag) {
                    tempInsuredGroup.get('identityNo').markAsDirty();
                    tempInsuredGroup.get('identityTypeCode').markAsDirty();
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
    public doCustomerRefresh(formGroup, id?) {
        if (formGroup.get('identityNo').value && formGroup.get('identityTypeCode').value) {
            let customerInfoResponse = this.service.doCustomerRefresh({ identityNo: formGroup.get('identityNo').value });
            customerInfoResponse.subscribe((data) => {
                if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
                    this.resetCustomerInfoIdentity(formGroup, id);
                    this.changeRef.detectChanges();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.isCustomerRefreshed = true;
                    let identityTypeCode = formGroup.get('identityTypeCode').value;
                    let identityTypeDesc = formGroup.get('identityTypeDesc').value;
                    let identityNo = formGroup.get('identityNo').value;
                    formGroup.patchValue(data);
                    if (id == 'doCustomerRefresh') {
                        formGroup.get('prefixDesc').patchValue(data.prefix);
                        formGroup.get('prefix').patchValue(data.prefix);
                    }
                    if (!formGroup.get('appFName').value) {
                        formGroup.get('clientUpdateFlag').patchValue('N');
                    } else if (formGroup.get('clientUpdateFlag')) {
                        formGroup.get('clientUpdateFlag').patchValue('Y');
                    }
                    formGroup.get('identityTypeDesc').patchValue(identityTypeDesc);
                    formGroup.get('identityTypeDesc').updateValueAndValidity();
                    formGroup.get('identityTypeCode').patchValue(identityTypeCode);
                    formGroup.get('identityTypeCode').updateValueAndValidity();
                    formGroup.get('identityNo').patchValue(identityNo);
                    formGroup.updateValueAndValidity();
                    this.disableCustomerInfo(formGroup, id);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
                this.changeRef.markForCheck();
            });
        } else {
            if (!formGroup.get('identityNo').value) {
                formGroup.get('identityNo').setErrors({ 'required': true });
            }
            if (!formGroup.get('identityTypeCode').value) {
                formGroup.get('identityTypeCode').setErrors({ 'required': true });
            }
            this.changeRef.markForCheck();
        }
    }
    public disableCustomerInfo(formGroup, id?) {
        //this.formGroup.controls['customerInfo'].disable();
        if (formGroup.get('policyHolderType') !== null) {
            formGroup.get('policyHolderType').enable();
        }
        if (formGroup.get('isPolicyHolderInsured') !== null) {
            formGroup.get('isPolicyHolderInsured').enable();
        }
        // formGroup.get('identityNo').enable();
        //  formGroup.get('identityTypeCode').enable();
        //  formGroup.get('identityTypeDesc').enable();
        if (id == 'doCustomerRefresh' || id == 'saveModalClose' || id == 'savedModalClose') formGroup.get('zipCd').enable();
        formGroup.updateValueAndValidity();
    }
    public resetCustomerInfoIdentity(formGroup, id) {
        formGroup.get('appFName').setValue(null);
        formGroup.get('appFName').updateValueAndValidity();
        formGroup.get('appLName').setValue(null);
        formGroup.get('appLName').updateValueAndValidity();
        formGroup.get('DOB').setValue(null);
        formGroup.get('DOB').updateValueAndValidity();
        formGroup.get('age').setValue(null);
        formGroup.get('age').updateValueAndValidity();

        if (id == 'doCustomerRefresh') {
            formGroup.get('prefix').setValue(null);
            formGroup.get('prefix').updateValueAndValidity();
            formGroup.get('prefixDesc').setValue(null);
            formGroup.get('prefixDesc').updateValueAndValidity();
            formGroup.get('appMName').setValue(null);
            formGroup.get('appMName').updateValueAndValidity();
            formGroup.get('gender').setValue(null);
            formGroup.get('gender').updateValueAndValidity();
            formGroup.get('companyName').setValue(null);
            formGroup.get('companyName').updateValueAndValidity();
            formGroup.get('zipCd').setValue(null);
            formGroup.get('zipCd').updateValueAndValidity();
            formGroup.get('appUnitNumber').setValue(null);
            formGroup.get('appUnitNumber').updateValueAndValidity();
            formGroup.get('blockNumber').setValue(null);
            formGroup.get('blockNumber').updateValueAndValidity();
            formGroup.get('address1').setValue(null);
            formGroup.get('address1').updateValueAndValidity();
            formGroup.get('address2').setValue(null);
            formGroup.get('address2').updateValueAndValidity();
            formGroup.get('cityCode').setValue(null);
            formGroup.get('cityCode').updateValueAndValidity();
            formGroup.get('cityDesc').setValue(null);
            formGroup.get('cityDesc').updateValueAndValidity();
            formGroup.get('state').setValue(null);
            formGroup.get('state').updateValueAndValidity();
            formGroup.get('countryCode').setValue(null);
            formGroup.get('countryCode').updateValueAndValidity();
            formGroup.get('countryDesc').setValue(null);
            formGroup.get('countryDesc').updateValueAndValidity();
            formGroup.get('mobilePh').patchValue('');
            formGroup.get('mobilePh').updateValueAndValidity();
            formGroup.get('homePh').patchValue('');
            formGroup.get('homePh').updateValueAndValidity();
            formGroup.get('officePhone').patchValue('');
            formGroup.get('officePhone').updateValueAndValidity();
            formGroup.get('fax').patchValue('');
            formGroup.get('fax').updateValueAndValidity();
            formGroup.get('emailId').setValue(null);
            formGroup.get('emailId').updateValueAndValidity();
            formGroup.get('countyCode').patchValue('');
            formGroup.get('countyCode').updateValueAndValidity();
            formGroup.get('countyDesc').patchValue('');
            formGroup.get('countyDesc').updateValueAndValidity();
        }
    }

    public resetCustomerInfo() {
        this.formGroup.controls['customerInfo'].get('prefix').setValue(null);
        this.formGroup.controls['customerInfo'].get('prefix').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('prefixDesc').setValue(null);
        this.formGroup.controls['customerInfo'].get('prefixDesc').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('appFName').setValue(null);
        this.formGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('appMName').setValue(null);
        this.formGroup.controls['customerInfo'].get('appMName').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('appLName').setValue(null);
        this.formGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('gender').setValue(null);
        this.formGroup.controls['customerInfo'].get('gender').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('DOB').setValue(null);
        this.formGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('identityTypeCode').setValue(null);
        this.formGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('identityTypeDesc').setValue(null);
        this.formGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('identityNo').setValue(null);
        this.formGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('age').setValue(null);
        this.formGroup.controls['customerInfo'].get('age').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('companyName').setValue(null);
        this.formGroup.controls['customerInfo'].get('companyName').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('zipCd').setValue(null);
        this.formGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('appUnitNumber').setValue(null);
        this.formGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('blockNumber').setValue(null);
        this.formGroup.controls['customerInfo'].get('blockNumber').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('address1').setValue(null);
        this.formGroup.controls['customerInfo'].get('address1').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('address2').setValue(null);
        this.formGroup.controls['customerInfo'].get('address2').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('cityCode').setValue(null);
        this.formGroup.controls['customerInfo'].get('cityCode').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('cityDesc').setValue(null);
        this.formGroup.controls['customerInfo'].get('cityDesc').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('state').setValue(null);
        this.formGroup.controls['customerInfo'].get('state').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('countryCode').setValue(null);
        this.formGroup.controls['customerInfo'].get('countryCode').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('countryDesc').setValue(null);
        this.formGroup.controls['customerInfo'].get('countryDesc').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('mobilePh').setValue(null);
        this.formGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('homePh').setValue(null);
        this.formGroup.controls['customerInfo'].get('homePh').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('officePhone').setValue(null);
        this.formGroup.controls['customerInfo'].get('officePhone').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('fax').setValue(null);
        this.formGroup.controls['customerInfo'].get('fax').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('emailId').setValue(null);
        this.formGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
    }


    public resetCustomerCorporateInfo() {
        this.formGroup.controls['customerInfo'].get('companyRegNumber').setValue(null);
        this.formGroup.controls['customerInfo'].get('companyRegNumber').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('companyName').setValue(null);
        this.formGroup.controls['customerInfo'].get('companyName').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('occupationCode').setValue(null);
        this.formGroup.controls['customerInfo'].get('occupationCode').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('occupationDesc').setValue(null);
        this.formGroup.controls['customerInfo'].get('occupationDesc').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('zipCd').setValue(null);
        this.formGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('emailId').setValue(null);
        this.formGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('mobilePh').setValue(null);
        this.formGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('homePh').setValue(null);
        this.formGroup.controls['customerInfo'].get('homePh').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('officePhone').setValue(null);
        this.formGroup.controls['customerInfo'].get('officePhone').updateValueAndValidity();
        this.formGroup.controls['customerInfo'].get('fax').setValue(null);
        this.formGroup.controls['customerInfo'].get('fax').updateValueAndValidity();
    }

    public unpatchInsuredDetails() {
        let unpatchInsuredDetails: any = this.formGroup.controls['riskInfo'];
        for (let j = 0; j < unpatchInsuredDetails.length; j++) {
            let tempunpatchInsuredDetails = unpatchInsuredDetails.at(j);
            let insuredunpatchInsuredDetails: FormArray = <FormArray>tempunpatchInsuredDetails.get('insuredList');
            if (!this.multiItemFlag) {
                for (let i = 0; i < this.transactionTypeInstance.transaction.insuredListData.length; i++) {
                    let fullName = this.transactionTypeInstance.transaction.insuredListData[i].appFName + ' ' + this.transactionTypeInstance.transaction.insuredListData[i].appLName;
                    insuredunpatchInsuredDetails.at(i).get('appFullName').reset();
                    insuredunpatchInsuredDetails.at(i).get('appFullName').updateValueAndValidity();
                    insuredunpatchInsuredDetails.at(i).get('appFName').reset();
                    insuredunpatchInsuredDetails.at(i).get('appFName').updateValueAndValidity();
                    insuredunpatchInsuredDetails.at(i).get('appLName').reset();
                    insuredunpatchInsuredDetails.at(i).get('appLName').updateValueAndValidity();
                    insuredunpatchInsuredDetails.at(i).get('identityNo').reset();
                    insuredunpatchInsuredDetails.at(i).get('identityNo').updateValueAndValidity();
                    insuredunpatchInsuredDetails.at(i).get('DOB').setValue('');
                    insuredunpatchInsuredDetails.at(i).get('DOB').updateValueAndValidity();
                    insuredunpatchInsuredDetails.at(i).get('key').setValue(this.transactionTypeInstance.transaction.insuredListData[i].key);
                    insuredunpatchInsuredDetails.at(i).get('key').updateValueAndValidity();
                    insuredunpatchInsuredDetails.at(i).get('identityTypeCode').reset();
                    insuredunpatchInsuredDetails.at(i).get('identityTypeCode').updateValueAndValidity();
                    insuredunpatchInsuredDetails.at(i).get('identityTypeDesc').reset();
                    insuredunpatchInsuredDetails.at(i).get('identityTypeDesc').updateValueAndValidity();
                }
            } else {
                for (let i = 0; i < insuredunpatchInsuredDetails.length; i++) {
                    let fullName = insuredunpatchInsuredDetails.at(i).get('appFName').value + ' ' + insuredunpatchInsuredDetails.at(i).get('appLName').value;
                    insuredunpatchInsuredDetails.at(i).get('appFullName').reset();
                    insuredunpatchInsuredDetails.at(i).get('appFullName').updateValueAndValidity();
                    insuredunpatchInsuredDetails.at(i).get('key').setValue((i + 1).toString());
                    insuredunpatchInsuredDetails.at(i).get('key').updateValueAndValidity();
                }
            }
        }
    }

    public doShowRemoveInsuredButton(): boolean {
        let count = 0;
        this.riskInfoGroup.get('insuredList').value.forEach(ele => count += ele.travellerStatusCode !== 'D' ? 1 : 0);
        return (count > 0);
    }
    public doShowRemoveItemButton(): boolean {
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        let i = riskInfoFormArray.length;
        if (i > 1) {
            return true;
        } else {
            return false;
        }
    }
    doAgreeAllDeclerations(value) {
        if (value) {
            this.formGroup.controls['policyInfo'].get('isImportantNoticeEnabled').setValue(true);
            this.formGroup.controls['policyInfo'].get('isImportantNoticeEnabled').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('isWarantyAndDeclarationEnabled').setValue(true);
            this.formGroup.controls['policyInfo'].get('isWarantyAndDeclarationEnabled').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('isPersonalInfoStatementEnabled').setValue(true);
            this.formGroup.controls['policyInfo'].get('isPersonalInfoStatementEnabled').updateValueAndValidity();
            this.changeRef.markForCheck();
        } else {
            this.formGroup.controls['policyInfo'].get('isImportantNoticeEnabled').setValue(false);
            this.formGroup.controls['policyInfo'].get('isImportantNoticeEnabled').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('isWarantyAndDeclarationEnabled').setValue(false);
            this.formGroup.controls['policyInfo'].get('isWarantyAndDeclarationEnabled').updateValueAndValidity();
            this.formGroup.controls['policyInfo'].get('isPersonalInfoStatementEnabled').setValue(false);
            this.formGroup.controls['policyInfo'].get('isPersonalInfoStatementEnabled').updateValueAndValidity();
            this.changeRef.markForCheck();
        }
    }
    public setNCPDatePickerToDateOptions() {
        this.transactionTypeInstance.transaction.NCPDatePickerToDateOptions.disabledUntil = this.transactionTypeInstance.transaction.parseSelectedDate(this.formGroup.controls['policyInfo'].get('inceptionDt').value);
        this.transactionTypeInstance.transaction.NCPDatePickerToDateOptions.disabledUntil['day']--;
        return this.transactionTypeInstance.transaction.NCPDatePickerToDateOptions;
    }
    doPolicyRatingBeforePosting() {
        // + Assuming this as a non-financial Endorsement , patch First insured Details to customer info if isPolicyHolder is true
        this.setCustomerDetailFromInsured();
        // - Assuming this as a non-financial Endorsement , patch First insured Details to customer info if isPolicyHolder is true
        let policyRatingResponse = this.service.getPolicyRatingInfo(this.formGroup.getRawValue());
        policyRatingResponse.subscribe(
            (policyRatingDataVal) => {
                // tslint:disable-next-line:max-line-length
                if ((policyRatingDataVal.error !== null) && (policyRatingDataVal.error !== undefined) && (policyRatingDataVal.error.length >= 1)) {
                    this.updateErrorObject(policyRatingDataVal);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.formGroup.controls['summaryInfo'].patchValue(policyRatingDataVal.summaryInfo);
                    this.formGroup.controls['summaryInfo'].updateValueAndValidity();
                    this.formGroup.controls['customerInfo'].patchValue(policyRatingDataVal.customerInfo);
                    this.formGroup.controls['customerInfo'].updateValueAndValidity();
                    this.formGroup.controls['policyInfo'].patchValue(policyRatingDataVal.policyInfo);
                    this.formGroup.controls['policyInfo'].updateValueAndValidity();
                    this.formGroup.controls['errorInfo'] = this.updateErrorInfoValue(policyRatingDataVal);
                    this.formGroup.controls['errorInfo'].updateValueAndValidity();
                    this.formGroup.controls['instalmentItemInfo'] = this.updateInstalmentItemInfoValue(policyRatingDataVal);
                    this.formGroup.controls['instalmentItemInfo'].updateValueAndValidity();
                    this.updatePlanDatas(policyRatingDataVal);
                    this.postPolicy();
                }
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });

    }
    public getAgentCodeRefresh() {
        let partyIdResponse = this.userService.doCheckpartyid({ user_party_id: this.formGroup.controls['policyInfo'].get('agentCd').value });
        partyIdResponse.subscribe(
            (partyIddetails) => {
                if (partyIddetails.error !== null && partyIddetails.error !== undefined && partyIddetails.error.length >= 1) {
                    this.isError = true;
                    this.errors = [];
                    this.salesAgentFlag = false;
                    for (let i = 1; i < partyIddetails.error.length; i++) {
                        this.errors.push({ 'errCode': partyIddetails.error[i].errCode, 'errDesc': partyIddetails.error[i].errDesc });
                        this.changeRef.markForCheck();
                    }
                }
                if (partyIddetails.error) {
                    this.salesAgentFlag = false;
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    this.transactionTypeInstance.transaction.logger.log('Getpartyid() ===>', 'user does not exist' + partyIddetails.error);
                    this.userService.partyEE.emit('error');
                }
                else {
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    this.setAgentCodeForSalesLogin();

                }
            });
    }

    public setAgentCodeForSalesLogin() {
        let salesLoginResponse = this.userService.setAgentCodeForSalesLogin({ "agentCd": this.formGroup.controls['policyInfo'].get('agentCd').value });
        salesLoginResponse.subscribe(
            (response) => {
                if (response.error) {
                    this.salesAgentFlag = false;
                    this.transactionTypeInstance.transaction.logger.log('SetAgentCodeForSalesLogin() ===>', + response.error);
                    this.userService.partyEE.emit('error');
                }
                else {
                    this.salesAgentFlag = true;
                    this.isError = false;
                }
            });
    }
    public getPaymentInfoData() {
        let grosspremium = this.formGroup.controls['summaryInfo'].get('clientPremiumBase').value;
        let netpremium = this.formGroup.controls['summaryInfo'].get('netPremiumPrime').value;
        let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
        let policyEndtNo = this.formGroup.controls['policyInfo'].get('policyEndtNo').value;
        let cardHolderInfo = this.formGroup.controls['customerInfo'].value;
        return [
            { 'isGrossAndNet': true },
            { 'gross': grosspremium },
            { 'net': netpremium },
            { 'amount': netpremium },
            { 'currency': this.transactionTypeInstance.transaction.configService.getCustom('currency_code') },
            { 'policyNo': policyNo },
            { 'merchantID': null },
            { 'imageUrl': null },
            { 'savePaymentDetailsUrl': null },
            { "identifier1": this.transactionTypeInstance.transaction.configService.getCustom('user_id') },
            { "identifier2": this.formGroup.controls['policyInfo'].get('quoteNo').value },
            { "identifier3": this.formGroup.controls['policyInfo'].get('quoteVerNo').value },
            { "identifier4": null },
            { "identifier5": null },
            { 'policyEndtNo': policyEndtNo },
            { 'showPGSelectionModal': null },
            { 'cardHolderInfo': cardHolderInfo },
            { 'customField': null }
        ];
    }
    public updateInsuredData() { }
    public getRiskInfoModel() {
        return null;
    }

    public doUndoRemoveItemList(index: any) {
        let tempRiskFormGroup;
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        riskInfoFormArray.at(index).get('isItemDeleted').patchValue(false);
        this.updateElements();
        this.changeRef.markForCheck();
    }
    public doRemoveItemList(index: any) {
        let tempRiskFormGroup;
        let riskInfoFormArray: any = this.formGroup.controls['riskInfo'];
        for (let i = 0; i < riskInfoFormArray.length; i++) {
            if (i == index) {
                riskInfoFormArray.at(i).get('isItemDeleted').patchValue(true);
                riskInfoFormArray.at(i).get('itemStatus').patchValue("CN");
            }
            else {
                if (riskInfoFormArray.at(i).get('isItemDeleted').value !== true) {
                    riskInfoFormArray.at(i).get('isItemDeleted').patchValue(false);
                    riskInfoFormArray.at(i).get('itemStatus').patchValue("PN");
                }
            }
        }
    }

    public addItemMastertoWork(index: any) {
        let policyInfoDetails = this.service.addItemMastertoWork({ inputData: this.formGroup.getRawValue(), index: index });
        policyInfoDetails.subscribe(
            (policyInfoDetails) => {
                if ((policyInfoDetails.error !== null) && (policyInfoDetails.error !== undefined) && (policyInfoDetails.error.length >= 1)) {
                    this.updateErrorObject(policyInfoDetails);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.transactionTypeInstance.transaction.configService.setCustom(this.transactionTypeInstance.openHeldDataStorageString, policyInfoDetails);
                    this.formGroup = this.updateInfoValue(policyInfoDetails);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }
    // public deleteItemFromWork(index: any) {
    //     let policyInfoDetails = this.service.deleteItemFromWork({ inputData: this.formGroup.getRawValue(),index: index});
    //     policyInfoDetails.subscribe(
    //         (policyInfoDetails) => {
    //             if ((policyInfoDetails.error !== null) && (policyInfoDetails.error !== undefined) && (policyInfoDetails.error.length >= 1)) {
    //                 this.updateErrorObject(policyInfoDetails);
    //                 this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
    //             } else {
    //                 this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
    //             }
    //         },
    //         (error) => {
    //             this.transactionTypeInstance.transaction.logger.error(error);
    //             this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
    //         });
    // }
    public addItemDetails() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let index = tempRiskInfoArray.length;
        let policyInfoDetails = this.service.addItemDetails({ inputData: this.formGroup.getRawValue(), index: index });
        policyInfoDetails.subscribe(
            (policyInfoDetails) => {
                if ((policyInfoDetails.error !== null) && (policyInfoDetails.error !== undefined) && (policyInfoDetails.error.length >= 1)) {
                    this.updateErrorObject(policyInfoDetails);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }

    /**
    * For Sales user login agent code validation
    * @method setSalesLoginValidator
    * @return {void} void
    */
    public setSalesLoginValidator(): void {
        if (typeof this.validator.setRequiredValidatorForSalesAgent === "function") {
            if (this.userType === this.userTypeOperator) {
                this.validator.setRequiredValidatorForSalesAgent(this.formGroup);
            }
        }
    }
    quoteValidate() {
        if (this.transactionTypeInstance.transaction.configService._config.requireQuotePolicyValidate === 'no') {
            this.doPayment(this.getPaymentInfoData());
        } else {
            let validateResponse;
            let postValue = this.formGroup.getRawValue();
            postValue.policyInfo.paymentTime = this.transactionTypeInstance.transaction.utilService.getTimeNow();
            postValue.policyInfo.paymentDate = this.transactionTypeInstance.transaction.dateFormatService.formatDate(this.transactionTypeInstance.transaction.todayDate);
            if (this.transactionTypeInstance.isPolicyFlag) {
                validateResponse = this.service.policyValidate(postValue);
            } else {
                validateResponse = this.service.quoteValidate(postValue);
            }
            validateResponse.subscribe(
                (quoteValidateResponse) => {
                    if ((quoteValidateResponse.error !== null) && (quoteValidateResponse.error !== undefined) && (quoteValidateResponse.error.length >= 1)) {
                        this.updateErrorObject(quoteValidateResponse);
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    } else {
                        this.doPayment(this.getPaymentInfoData());
                    }
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                },
                (error) => {
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            );
        }
    }
    /**
   * Assuming this as a non-financial Endorsement , patch First insured Details to customer info if isPolicyHolder is true .
   * This Abstract Method will be overridden in each LOB components based on their required fields
   * @method setCustomerDetailFromInsured
   * @return {void} void
   */
    public setCustomerDetailFromInsured() { }
    goBackToPMOV() {

        this.transactionTypeInstance.transaction.configService.navigateRouterLink('/ncp/activity/policyMove');
    }

    public checkMailModal() {
        return (this.formGroup.get('emailQuotInfo').get('toAddress').valid &&
            this.formGroup.get('emailQuotInfo').get('subject').valid);
    }

    public goToNextStepById(id: string, elementId: string, doValidate = false) {
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, elementId, 'doValidate', doValidate);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, elementId, 'nextStepId', id);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, elementId, 'goToStepIdWithoutNavigateButton', Math.floor(Math.random() * 101));
        this.changeRef.detectChanges();
    }
    public addSubjectMatter(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempSubjectMatterInfoGroup = tempRiskInfoArray.at(data.value);
        let tempSubjectMatterInfo: FormArray = <FormArray>tempSubjectMatterInfoGroup.get('subjectMatterInfo');
        tempSubjectMatterInfo.push(this.transactionTypeInstance.transaction.subjectMatterInfo.getSubjectMatterInfoModel());
        this.setKeysForSubjectMatter();
        this.changeRef.markForCheck();
        this.updateElements();
    }

    public deleteSubjectMatter(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempSubjectMatterInfoGroup = tempRiskInfoArray.at(data.value.superParentIndex);
        let tempSubjectMatterInfo: FormArray = <FormArray>tempSubjectMatterInfoGroup.get('subjectMatterInfo');
        tempSubjectMatterInfo.removeAt(data.value.index);
        this.setKeysForSubjectMatter();
        this.changeRef.markForCheck();
        this.updateElements();
    }

    public setKeysForSubjectMatter() {
        let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
        let policyEndtNo = this.formGroup.controls['policyInfo'].get('policyEndtNo').value;
        let siCurrency = this.formGroup.controls['policyInfo'].get('siCurr').value;
        let premiumCurrency = this.formGroup.controls['policyInfo'].get('PremCurr').value;
        let siCurrencyRate = this.formGroup.controls['policyInfo'].get('siCurrRt').value;
        let premiumCurrencyRate = this.formGroup.controls['policyInfo'].get('PremCurrRt').value;
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        for (let j = 0; j < tempRiskInfoArray.length; j++) {
            let tempRiskInfoGroup = tempRiskInfoArray.at(j);
            let itemNo = tempRiskInfoGroup.get('itemNo').value;
            let sectNo = tempRiskInfoGroup.get('sectNo').value;
            if (itemNo && sectNo) {
                let tempSubjectMatterArray: FormArray = <FormArray>tempRiskInfoGroup.get('subjectMatterInfo');
                tempSubjectMatterArray.controls.forEach((ele, index) => {
                    let seqNo = index > 9 ? '0' + (index + 1) : '00' + (index + 1);
                    ele.get('policyNo').setValue(policyNo);
                    ele.get('policyEndtNo').setValue(policyEndtNo);
                    ele.get('itemNo').setValue(itemNo);
                    ele.get('sectNo').setValue(sectNo);
                    ele.get('seqNo').setValue(seqNo);
                    ele.get('premiumCurrencyRate').setValue(premiumCurrencyRate);
                    ele.get('siCurrencyRate').setValue(siCurrencyRate);
                    ele.get('premiumCurrency').setValue(premiumCurrency);
                    ele.get('siCurrency').setValue(siCurrency);
                    ele.get('key').setValue(itemNo + '' + sectNo + '' + ele.get('contentCode').value);
                });
            }
        }
    }

    public addClaimHistory(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempClaimHistoryInfoGroup = tempRiskInfoArray.at(data.value);
        let tempClaimHistoryInfo: FormArray = <FormArray>tempClaimHistoryInfoGroup.get('claimHistoryInfo');
        tempClaimHistoryInfo.push(this.transactionTypeInstance.transaction.claimHistoryInfo.getClaimHistoryInfoModel());
        this.setKeysForClaimHistory();
        this.changeRef.markForCheck();
        this.updateElements();
    }

    public deleteClaimHistory(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempClaimHistoryInfoGroup = tempRiskInfoArray.at(data.value.superParentIndex);
        let tempClaimHistoryInfo: FormArray = <FormArray>tempClaimHistoryInfoGroup.get('claimHistoryInfo');
        tempClaimHistoryInfo.removeAt(data.value.index);
        this.setKeysForClaimHistory();
        this.changeRef.markForCheck();
        this.updateElements();
    }

    public setKeysForClaimHistory() {
        let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
        let policyEndtNo = this.formGroup.controls['policyInfo'].get('policyEndtNo').value;
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        for (let j = 0; j < tempRiskInfoArray.length; j++) {
            let tempRiskInfoGroup = tempRiskInfoArray.at(j);
            let itemNo = tempRiskInfoGroup.get('itemNo').value;
            let sectNo = tempRiskInfoGroup.get('sectNo').value;
            if (itemNo && sectNo) {
                let tempClaimHistoryArray: FormArray = <FormArray>tempRiskInfoGroup.get('claimHistoryInfo');
                tempClaimHistoryArray.controls.forEach((ele, index) => {
                    let seqNo = index > 9 ? '0' + (index + 1) : '00' + (index + 1);
                    ele.get('policyNo').setValue(policyNo);
                    ele.get('policyEndtNo').setValue(policyEndtNo);
                    ele.get('itemNo').setValue(itemNo);
                    ele.get('sectNo').setValue(sectNo);
                    ele.get('seqNo').setValue(seqNo);
                    ele.get('key').setValue(seqNo);
                });
            }
        }
    }

    public addDeleteItemCoverage(data, type) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let riskInfoIndex;
        let buttonIndex = 0;
        if (type === 'add') {
            riskInfoIndex = data.value.parentIndex ? data.value.parentIndex : data.value.index;
        }
        else {
            buttonIndex = data.value.index;
            riskInfoIndex = data.value.superParentIndex;
        }
        let tempRiskInfoGroup = tempRiskInfoArray.at(riskInfoIndex);

        let coverCode = tempRiskInfoGroup.get('displayCoverageCode').value;
        let coverCodeDesc = tempRiskInfoGroup.get('displayCoverageDesc').value;
        let itemNo = tempRiskInfoGroup.get('itemNo').value;
        let sectNo = tempRiskInfoGroup.get('sectNo').value;
        let sectCl = tempRiskInfoGroup.get('sectCl').value;
        let selectedPlanIndex = 0;
        if (type === 'add') {
            tempRiskInfoGroup.get('plans').value.forEach((element, index) => {
                if (element.isPlanSelected) {
                    selectedPlanIndex = index;
                }
            });
        } else {
            selectedPlanIndex = data.value.parentIndex;
        }

        if (this.formGroup.get('newCoverageInfo')) {
            let tempCoverageInfoGroup: FormGroup = <FormGroup>this.formGroup.get('newCoverageInfo');
            tempCoverageInfoGroup.get('covgCd').patchValue(coverCode);
            tempCoverageInfoGroup.get('covgDesc').patchValue(coverCodeDesc);
            tempCoverageInfoGroup.get('itemNo').patchValue(itemNo);
            tempCoverageInfoGroup.get('sectNo').patchValue(sectNo);
            tempCoverageInfoGroup.get('sectCl').patchValue(sectCl);
            tempCoverageInfoGroup.get('selectedPlanIndex').patchValue(selectedPlanIndex);
            tempCoverageInfoGroup.get('riskInfoIndex').patchValue(riskInfoIndex);
            tempCoverageInfoGroup.get('selectedPlanDetailsIndex').patchValue(buttonIndex);
        } else {
            this.addTempCoverageInfoModel();
            let tempCoverageInfoGroup: FormGroup = <FormGroup>this.formGroup.get('newCoverageInfo');
            tempCoverageInfoGroup.get('covgCd').patchValue(coverCode);
            tempCoverageInfoGroup.get('covgDesc').patchValue(coverCodeDesc);
            tempCoverageInfoGroup.get('itemNo').patchValue(itemNo);
            tempCoverageInfoGroup.get('sectNo').patchValue(sectNo);
            tempCoverageInfoGroup.get('sectCl').patchValue(sectCl);
            tempCoverageInfoGroup.get('selectedPlanIndex').patchValue(selectedPlanIndex);
            tempCoverageInfoGroup.get('riskInfoIndex').patchValue(riskInfoIndex);
            tempCoverageInfoGroup.get('selectedPlanDetailsIndex').patchValue(buttonIndex);
        }
        this.addDelItemCoverageDetails(type);
    }
    addTempCoverageInfoModel() {
        this.formGroup.addControl('newCoverageInfo', new FormGroup({}));
        let tempCoverageInfoGroup: FormGroup = <FormGroup>this.formGroup.get('newCoverageInfo');
        tempCoverageInfoGroup.addControl('covgCd', new FormControl(''));
        tempCoverageInfoGroup.addControl('covgDesc', new FormControl(''));
        tempCoverageInfoGroup.addControl('itemNo', new FormControl(''));
        tempCoverageInfoGroup.addControl('sectNo', new FormControl(''));
        tempCoverageInfoGroup.addControl('sectCl', new FormControl(''));
        tempCoverageInfoGroup.addControl('selectedPlanIndex', new FormControl(''));
        tempCoverageInfoGroup.addControl('riskInfoIndex', new FormControl(''));
        tempCoverageInfoGroup.addControl('selectedPlanDetailsIndex', new FormControl(''));
    }
    public addDelItemCoverageDetails(type) {
        let policyInfoDetails = type === 'add' ? this.service.addItemCoverage(this.formGroup.getRawValue()) : this.service.deleteItemCoverage(this.formGroup.getRawValue());
        policyInfoDetails.subscribe(
            (policyInfoDetailsResp) => {
                if ((policyInfoDetailsResp.error !== null) && (policyInfoDetailsResp.error !== undefined) && (policyInfoDetailsResp.error.length >= 1)) {
                    this.updateErrorObject(policyInfoDetailsResp);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.formGroup = this.updateInfoValue(policyInfoDetailsResp);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }

    public setCustomerFullName() {
        let tempFormGroup: any;
        let appFullName;

        let customerInfoObject: any = this.formGroup.controls['customerInfo'];
        tempFormGroup = customerInfoObject;
        let appFName = tempFormGroup.controls['appFName'].value;
        let appLName = tempFormGroup.controls['appLName'].value;
        let appMName = tempFormGroup.controls['appMName'].value;
        if (appMName.value !== ' ') {
            appFullName = appFName + ' ' + appMName + ' ' + appLName;
        }
        else {
            appFullName = appFName + ' ' + appLName;
        }

        this.formGroup.controls['customerInfo'].get('appFullName').setValue(appFullName);
    }
    public eventConstantCustomGetter() {
        let eventConstants = this.transactionTypeInstance.transaction.factoryInstance.getEventConstants();
        let proxy = new Proxy(eventConstants, {
            get: ((target, name, receiver) => {
                let rv = target[name];
                if (typeof rv === 'string') {
                    rv = rv.toLowerCase();
                } else if (typeof rv === 'object') {
                    rv = rv.name.toLowerCase();
                }
                return rv;
            })
        });
        this.eventConstants = proxy;
    }
    public updateSelectedPlanToItem() {
        let riskArray: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        riskArray.controls.forEach((riskelement, riskIndex) => {
            let plansArray: FormArray = <FormArray>riskelement.get('plans');
            plansArray.controls.forEach((planElement, planIndex) => {
                if (planElement.get('isPlanSelected').value) {
                    riskelement.get('itemPlanSelectedCode').setValue(planElement.get('planTypeCode').value);
                    riskelement.get('itemPlanSelectedDesc').setValue(planElement.get('planTypeDesc').value);
                    riskelement.get('itemPlanSelectedCode').updateValueAndValidity();
                    riskelement.get('itemPlanSelectedDesc').updateValueAndValidity();
                }
            });
        });
    }
    public deleteItemDetails() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let index = tempRiskInfoArray.length;
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
    public setRiskItem(data) {
        let riskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        riskArray.controls.forEach((riskelement, i) => {
            if (riskelement.get('itemNo').value === data) {
                riskelement.get('itemSelected').setValue('Y');
            } else {
                riskelement.get('itemSelected').setValue('N');
            }
        });
    }
    public coverTypeChanged(data) {
        let riskInfo: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        if (data.value) {
            let riskFormGroup = riskInfo.at(parseInt(data.value.parentIndex));
            let plansArray: FormArray = <FormArray>riskFormGroup.get('plans');
            plansArray.controls.forEach((planElement, i) => {
                if (planElement.get('planTypeCode').value === data.value.value) {
                    planElement.get('planTypeCode').setValue(riskFormGroup.get('itemPlanSelectedCode').value);
                    planElement.get('planTypeCode').updateValueAndValidity();
                    planElement.get('planTypeDesc').setValue(riskFormGroup.get('itemPlanSelectedDesc').value);
                    planElement.get('planTypeDesc').updateValueAndValidity();
                    planElement.get('isPlanSelected').setValue(true);
                    planElement.get('isPlanSelected').updateValueAndValidity();

                } else if (plansArray.controls.length === 1) {
                    planElement.get('planTypeCode').setValue(riskFormGroup.get('itemPlanSelectedCode').value);
                    planElement.get('planTypeCode').updateValueAndValidity();
                    planElement.get('planTypeDesc').setValue(riskFormGroup.get('itemPlanSelectedDesc').value);
                    planElement.get('planTypeDesc').updateValueAndValidity();
                    planElement.get('isPlanSelected').setValue(true);
                    planElement.get('isPlanSelected').updateValueAndValidity();

                } else {
                    planElement.get('isPlanSelected').setValue(false);
                    planElement.get('isPlanSelected').updateValueAndValidity();
                }
            });
        }
    }
    public removeUnselectedPlan() {
        let selectedPlanObject: any;
        let riskArray: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        riskArray.controls.forEach((riskelement, riskIndex) => {
            let plansArray: FormArray = <FormArray>riskelement.get('plans');
            plansArray.controls.forEach((planElement, planIndex) => {
                if (planElement.get('isPlanSelected').value) {
                    selectedPlanObject = planElement.value;
                }
            });
            plansArray.controls.length = 0;
            plansArray.push(this.transactionTypeInstance.transaction.plans.getPlanInfoModel())
            plansArray.controls.forEach((planElement, planIndex) => {
                if (selectedPlanObject) {
                    planElement.patchValue(selectedPlanObject);
                }
            });
        });
    }
    public multiItemDefaulting(data) {
        let isValidFlag: boolean = false;
        this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['policyInfo'].valid;
        this.transactionTypeInstance.transaction.isValidForm = this.salesAgentFlag && this.formGroup.controls['policyInfo'].valid;
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.basicInfoTabHeadError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
        this.changeRef.markForCheck();
        this.formGroup.controls['policyInfo'].get('ratingFlag').setValue(false);
        this.formGroup.controls['policyInfo'].get('ratingFlag').updateValueAndValidity();
        if (this.formGroup.controls['policyInfo'].get('referralStatus').value === 'B001') {
            isValidFlag = true;
        } else {
            isValidFlag = this.formGroup.controls['policyInfo'].valid;
        }
        if (isValidFlag) {
            this.setItemNo();
            let quotDefaultOutput = this.service.getQuotInfo(this.formGroup.getRawValue());
            quotDefaultOutput.subscribe(
                (quotInfoDataVal) => {
                    if (quotInfoDataVal) {
                        if (quotInfoDataVal.error !== null && quotInfoDataVal.error !== undefined && quotInfoDataVal.error.length >= 1) {
                            this.updateErrorObject(quotInfoDataVal);
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                        } else {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.defaultingCheckCondition, 'condition', true);
                            this.formGroup.controls['policyInfo'].patchValue(quotInfoDataVal.policyInfo);
                            this.transactionTypeInstance.isQuoteRatingDone = true;
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'wizardConfig', this.transactionTypeInstance.transaction.wizardConfig);
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.defaultingButton, 'buttonClass', 'hide');
                            this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                            this.changeRef.markForCheck();
                        }
                    }
                });
        }
    }
    public comparePlans(data) {
        let isValidFlag: boolean = false;
        let selectedRiskInfo: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        let selectedRiskFormGroup = selectedRiskInfo.at(parseInt(data.value));
        if (this.formGroup.controls['policyInfo'].get('referralStatus').value === 'B001') {
            isValidFlag = true;
        } else {
            isValidFlag = selectedRiskFormGroup.valid && this.formGroup.controls['policyInfo'].valid && this.salesAgentFlag;
        }
        if (isValidFlag) {
            this.viewPlansModal = true;
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
            let selectedItemNo = selectedRiskFormGroup.get('itemNo').value;
            this.setRiskItem(selectedItemNo);
            let getPlansForComparisonOutput = this.service.getPlansForComparison(this.formGroup.value);
            getPlansForComparisonOutput.subscribe(
                (quotInfoDataVal) => {
                    if (quotInfoDataVal) {
                        if (quotInfoDataVal.error !== null && quotInfoDataVal.error !== undefined && quotInfoDataVal.error.length >= 1) {
                            this.updateErrorObject(quotInfoDataVal);
                            this.viewPlansModal = false;
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                        } else {
                            this.updatePlanDatas(quotInfoDataVal);
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansSectNoCompare, 'compareWith', selectedItemNo);
                            this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                        }
                    }
                });
        } else {
            this.transactionTypeInstance.transaction.eventHandlerService.setEvent('onValidateTab', this.transactionTypeInstance.transaction.currentTab);
        }
        this.changeRef.markForCheck();
    }
    public setItemNo() {
        let riskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        riskArray.controls.forEach((element, i) => {
            i = i + 1;
            if (i < 10) {
                element.get('itemNo').setValue('0000' + i.toString());
            } else {
                element.get('itemNo').setValue('000' + i.toString());
            }
            element.get('sectNo').setValue('01');
            element.get('sectCl').patchValue(this.productCode);
            element.get('key').setValue(element.get('itemNo').value + element.get('sectNo').value);
        });
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
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    if (dataVal.desc && dataVal.desc != 'null') {
                        inputDescControl.patchValue(dataVal.desc);
                        inputDescControl.updateValueAndValidity();
                        inputCodeControl.patchValue(code);
                        inputCodeControl.updateValueAndValidity();
                        this.changeRef.markForCheck();
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    } else {
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    }
                }
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
            }
        );

    }
    getToAddressForReferral() {
        this.transactionTypeInstance.transaction.technicalUserArray = this.transactionTypeInstance.transaction.configService.getCustom('user_technical');
        let referTo: string = '';
        this.transactionTypeInstance.transaction.technicalUserArray.forEach(element => {
            if (referTo === '') {
                referTo = element.code;
            } else {
                referTo = referTo.concat(',', element.code);
            }
        });
        this.formGroup.controls['referQuotInfo'].get('referTo').patchValue(referTo);
        this.formGroup.controls['referQuotInfo'].get('subject').setValue('Referral for Quote: ' + this.formGroup.controls['policyInfo'].get('quoteNo').value);
        this.formGroup.controls['referQuotInfo'].get('referTo').disable();
        this.formGroup.controls['referQuotInfo'].get('subject').disable();
        this.formGroup = this.validator.setReferQuoteModalValidator(this.formGroup);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.toAddress, 'dropdownItems', this.transactionTypeInstance.transaction.technicalUserArray);
    }
    public checkReferModal() {
        return (this.formGroup.get('referQuotInfo').get('referralRemarks').valid &&
            this.formGroup.get('referQuotInfo').get('ccAddress').valid)
    }

    doPopulateFormGroup(mappings: any, formGroup: any, formKey?: string): FormGroup {
        if (mappings instanceof Object) {
            Object.keys(mappings).forEach((key) => {
                let formValue = mappings[key];
                if (formValue instanceof Array) {
                    // tslint:disable-next-line:curly
                    if (!formGroup.contains(key)) {
                        this.transactionTypeInstance.transaction.modelContainers[key] = new FormGroup({});
                        formGroup.addControl(key, new FormArray([new FormGroup({})]));
                    }
                    formValue.forEach((map) => {
                        this.doPopulateFormGroup(map, formGroup.get(key).at(0), key);
                    });
                } else if (formValue instanceof Object) {
                    // tslint:disable-next-line:curly
                    if (!formGroup.contains(key)) {
                        this.transactionTypeInstance.transaction.modelContainers[key] = new FormGroup({});
                        formGroup.addControl(key, new FormGroup({}));
                    }
                    this.doPopulateFormGroup(formValue, formGroup.get(key), key);
                } else if (typeof formValue === 'string' || typeof formValue === 'boolean' || typeof formValue === 'number' || formValue === null) {
                    // tslint:disable-next-line:curly
                    if (!formGroup.contains(key)) {
                        formGroup.addControl(key, new FormControl(this.ncpFormService.parseJSONValue(formValue)));
                    } else {
                        if (formValue) {
                            formGroup.get(key).patchValue(this.ncpFormService.parseJSONValue(formValue));
                        }
                    }
                }
                // + populating the model containers
                if (this.transactionTypeInstance.transaction.modelContainers[formKey] instanceof FormGroup || this.transactionTypeInstance.transaction.modelContainers[formKey] instanceof FormArray) {
                    if (formValue instanceof Array) {
                        if (!this.transactionTypeInstance.transaction.modelContainers[formKey].contains(key)) {
                            this.transactionTypeInstance.transaction.modelContainers[formKey].addControl(key, new FormArray([new FormGroup({})]));
                        }
                        formValue.forEach((map) => {
                            this.doPopulateFormGroup(map, this.transactionTypeInstance.transaction.modelContainers[formKey].get(key).at(0), key);
                        });
                    } else if (formValue instanceof Object) {
                        if (!this.transactionTypeInstance.transaction.modelContainers[formKey].contains(key)) {
                            this.transactionTypeInstance.transaction.modelContainers[formKey].addControl(key, new FormGroup({}));
                        }
                        this.doPopulateFormGroup(formValue, this.transactionTypeInstance.transaction.modelContainers[formKey].get(key), key);
                    } else if (typeof formValue === 'string' || typeof formValue === 'boolean' || formValue === null) {
                        if (!this.transactionTypeInstance.transaction.modelContainers[formKey].contains(key)) {
                            this.transactionTypeInstance.transaction.modelContainers[formKey].addControl(key, new FormControl(this.ncpFormService.parseJSONValue(formValue)));
                        } else {
                            if (formValue) {
                                this.transactionTypeInstance.transaction.modelContainers[formKey].get(key).patchValue(this.ncpFormService.parseJSONValue(formValue));
                            }
                        }
                    }
                }
                // - populating the models containers
            });
        }
        return formGroup;
    }

    public doSumMappingValueOfFormArray(formArr: FormArray, map: string, ischecked: string) {
        let sum: number = 0;
        let s;
        if (Array.isArray(formArr.value)) {
            formArr.controls.forEach(element => {
                if (element.get(map).value) {
                    if (element.get(ischecked).value === true) {
                        s = element.get(map).value;
                        sum += parseInt(s, 10);
                    }
                }
            });
        }
        return sum;
    }

    public pushDataToModelArray(destInfoArr: FormArray, destInfoGroup: any, source: { label: string, data: string }, doPush: boolean = false) {
        let index: number | undefined = this.arraySearch(source['label'], destInfoArr.value, 'label');
        if (!index) {
            if (doPush) {
                destInfoArr.push(destInfoGroup);
                index = destInfoArr.controls.length - 1;
            } else {
                index = 0;
            }
        }
        destInfoArr.at(index).patchValue(source);
    }

    arraySearch(nameKey, arr, searchKey): number | undefined {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][searchKey] === nameKey) {
                return i;
            }
        }
    }

    // + Moved from Transaction Service
    protected onValidateTab() { }
    protected onNext(event: any) { }
    protected onPrevious(event: any) { }
    protected onNextStep(event: any) { }
    protected onPreviousStep(event: any) { }
    protected onTabChange() { }
    protected onDoCheckForNext(event: any) { }
    protected getDefaultValuesInstance() { }
    protected getQuoteValidator() { }
    protected getPolicyValidator() { }
    protected doPatchDisabledInsuredData() { }
    protected setUnsetRatingFlag() { }
    public docInfoList() {
        this.transactionTypeInstance.transaction.isDocumentPresent = false;
        if (!this.transactionTypeInstance.hasStatusNew && !this.transactionTypeInstance.transactiondocInfo) {
            let dataObj = this.transactionTypeInstance.transaction.configService.getCustom(this.transactionTypeInstance.openHeldDataStorageString);
            if (dataObj) {
                this.transactionTypeInstance.transaction.docInfo = dataObj.documentInfo;
            }
        }
        if (this.transactionTypeInstance.transaction.docInfo) {
            this.transactionTypeInstance.transaction.documents = [];
            for (let i = 0; i < this.transactionTypeInstance.transaction.docInfo.length; i++) {
                if (this.transactionTypeInstance.transaction.docInfo[i].dispatchType === 'PRINT' || this.transactionTypeInstance.transaction.docInfo[i].dispatchType === 'PDF' || this.transactionTypeInstance.transaction.docInfo[i].dispatchType === 'PREVIEW') {
                    if (this.transactionTypeInstance.transaction.isDocumentPresent === false) {
                        this.transactionTypeInstance.transaction.isDocumentPresent = true;
                    }
                    this.transactionTypeInstance.transaction.documents.push(this.transactionTypeInstance.transaction.docInfo[i]);
                }
            }
            return this.transactionTypeInstance.transaction.documents;
        } else {
            return null;
        }
    }

    public doInitCommonWizardSub() {
        this.transactionTypeInstance.transaction.validateTabSub = this.transactionTypeInstance.transaction.eventHandlerService.validateTabSub.subscribe((data) => {
            this.onValidateTab();
        });
        this.transactionTypeInstance.transaction.nextTabSub = this.transactionTypeInstance.transaction.eventHandlerService.nextTabSub.subscribe((data) => {
            if (data.id === 'btnNext') {
                this.onNext(data.value);
            }
        });
        this.transactionTypeInstance.transaction.prevTabSub = this.transactionTypeInstance.transaction.eventHandlerService.prevTabSub.subscribe((data) => {
            if (data.id === 'btnPrev') {
                this.onPrevious(data.value);
            }
        });
        this.transactionTypeInstance.transaction.nextStepSub = this.transactionTypeInstance.transaction.eventHandlerService.nextStepSub.subscribe((data) => {
            if (data.id === 'stepNext') {
                if (typeof this.onNextStep === 'function') {
                    this.onNextStep(data.value);
                }
            }
        });
        this.transactionTypeInstance.transaction.prevStepSub = this.transactionTypeInstance.transaction.eventHandlerService.prevStepSub.subscribe((data) => {
            if (data.id === 'stepPrev') {
                if (typeof this.onPreviousStep === 'function') {
                    this.onPreviousStep(data.value);
                }
            }
        });
        this.transactionTypeInstance.transaction.tabChangeSub = this.transactionTypeInstance.transaction.eventHandlerService.tabChangeSub.subscribe((data) => {
            if (data.id === 'tabChange') {
                this.onTabChange();
            }
        });
        this.transactionTypeInstance.transaction.checkForNextStepSub = this.transactionTypeInstance.transaction.eventHandlerService.checkForNextStepSub.subscribe((data) => {
            if (data.id === 'doCheckForNext') {
                this.onDoCheckForNext(data.value);
            }
        });

        this.transactionTypeInstance.transaction.paymentService.initPostEmitter.subscribe((data) => {
            this.formGroup.controls['paymentInfo'].patchValue(data);
            this.formGroup.controls['paymentInfo'].updateValueAndValidity();
            if (this.transactionTypeInstance.transaction.isEndorsmentFlag) {
                this.policyPostOnCredit();
            } else {
                this.doPostAndSettlement(this.formGroup.getRawValue(), data);
            }
        });
        this.transactionTypeInstance.transaction.paymentService.initRePostEmitter.subscribe((data) => {
            if (data) {
                if (this.transactionTypeInstance.transaction.isEndorsmentFlag) {
                    this.policyPostOnCredit();
                } else {
                    this.doPostAndSettlement(this.formGroup.getRawValue(), data);
                }
            }
        });
    }

    public addBreadCrumbRoute() {
        try {
            let activeRoutePath = this.activeRoute.snapshot.params.activity;
            let route = this.transactionTypeInstance.transaction.factoryInstance.getBreadCrumbRoute() + 'transaction/' + activeRoutePath;
            let quoteRoutes = this.transactionTypeInstance.transaction.utilService.get([this.transactionTypeInstance.transaction.lobCode])[this.productCode];
            let productTitle: string = this.transactionTypeInstance.transaction.utilService.getTranslated(quoteRoutes['DETAILS']['title']);
            let quoteRoutesPrv = this.transactionTypeInstance.breadCrumbPrevRoute;
            let statusBreadCrumbMap = {
                NQ: {
                    status: 'NewQuote',
                    descAppend: 'NCPBreadCrumb.newQuote'
                },
                VQ: {
                    status: 'Enquiry',
                    descAppend: 'NCPBreadCrumb.quoteEnquiry'
                },
                EQ: {
                    status: 'OpenHeld',
                    descAppend: 'NCPBreadCrumb.quoteOpenHeld'
                },
                PEND: {
                    status: 'EndEnquiry',
                    descAppend: 'NCPBreadCrumb.endorsement'
                },
                PENQ: {
                    status: 'Enquiry',
                    descAppend: 'NCPBreadCrumb.policyEnquiry'
                },
                PHLD: {
                    status: 'EndEnquiry',
                    descAppend: 'NCPBreadCrumb.policyOpenHeld'
                },
                REN_WOC: {
                    status: 'REN_WOC',
                    descAppend: 'NCPBreadCrumb.renewal'
                },
                REN_WC: {
                    status: 'renewalOpenheld',
                    descAppend: 'NCPBreadCrumb.renewal'
                }
            }
            this.transactionTypeInstance.transaction.setStatus(statusBreadCrumbMap[this.transactionTypeInstance.transaction.eventType]['status']);
            this.transactionTypeInstance.transaction.setIsEnquiryFlag();
            if (this.transactionTypeInstance.transaction.eventType === 'PHLD') {
                this.transactionTypeInstance.isPolicyHeld = true;
            }
            this.transactionTypeInstance.hasStatusNew = !(this.transactionTypeInstance.transaction.status === 'Enquiry' || this.transactionTypeInstance.transaction.status === 'OpenHeld' || this.transactionTypeInstance.transaction.status === 'EndEnquiry');
            if (this.transactionTypeInstance.transaction.getIsB2B()) {
                this.transactionTypeInstance.transaction.breadCrumbService.addRouteName(route, [quoteRoutesPrv, { 'name': productTitle + ' ' + this.transactionTypeInstance.transaction.utilService.getTranslated(statusBreadCrumbMap[this.transactionTypeInstance.transaction.eventType]['descAppend']) }]);
            }
        } catch (e) {

        }
    }

    public initVisitorClasses() {
        this.defaultValue = this.getDefaultValuesInstance();
        if (this.transactionType === 'QT') {
            this.validator = this.getQuoteValidator();
        }
        if (this.transactionType === 'PO' || this.transactionType === 'REN') {
            this.validator = this.getPolicyValidator();
        }
    }

    public fetchOpenheldData() {
        let dataObj = this.transactionTypeInstance.transaction.configService.getCustom(this.transactionTypeInstance.openHeldDataStorageString);
        if (dataObj !== undefined && this.transactionTypeInstance.transaction.status !== 'NewQuote') {
            this.formGroup = this.updateInfoValue(dataObj);
            this.transactionTypeInstance.isQuoteRatingDone = true;
            if (this.transactionTypeInstance.transaction.status === 'Enquiry') {
                this.formGroup.disable();
            } else if (this.transactionTypeInstance.transaction.status === 'EndEnquiry') {
                this.doEndtReasonCode(false);
                this.doCommonEndtUpdates();
            } else if (this.transactionTypeInstance.transaction.status === 'REN_WOC' || this.transactionTypeInstance.transaction.status === 'renewalOpenheld') {
                this.doCommonUpdateForRenewal();
            }
        }
    }

    public doRating() {
        let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
        if (this.transactionType === 'QT') {
            if (this.doRatingFlagCheckRequired) {
                this.setUnsetRatingFlag();
            }
            if (policyNo && this.formGroup.controls['policyInfo'].get('referralStatus').value !== 'B001' && this.transactionTypeInstance.transaction.isQuoteRatingDone) {
                this.revised();
            } else {
                this.getQuotInfoServices();
            }
        } else if (this.transactionType === 'PO') {
            this.doEndtReasonCode(false);
            this.doPolicyRating();
        } else if (this.transactionType === 'REN') {
            this.doPolicyRating();
        }
    }

    public save() {
        if (this.transactionType === 'QT') {
            this.saveQuote();
        }
        if (this.transactionType === 'PO' || this.transactionType === 'REN') {
            this.savePolicy();
        }
    }
    public post() {
        if (this.transactionType === 'QT') {
            this.postQuote();
        }
        if (this.transactionType === 'PO' || this.transactionType === 'REN') {
            this.postPolicy();
        }
    }

    public addCoinsurer(data) {
        let tempCoinsurerInfoArray: FormArray = <FormArray>this.formGroup.get('coinsurerInfo');
        let coinsurerFormGroup: FormGroup = <FormGroup>this.transactionTypeInstance.transaction.coinsurerInfo.getCoinsurerInfoModel();
        coinsurerFormGroup.get('coInsuranceGrossNet').setValue('G');
        tempCoinsurerInfoArray.push(coinsurerFormGroup);
        this.setKeysForCoinsurer();
        this.changeRef.markForCheck();
        this.updateElements();
    }

    public deleteCoinsurer(data) {
        let tempCoinsurerInfoArray: FormArray = <FormArray>this.formGroup.get('coinsurerInfo');
        tempCoinsurerInfoArray.removeAt(data.value);
        this.setKeysForCoinsurer();
        this.changeRef.markForCheck();
        this.updateElements();
    }

    public setKeysForCoinsurer() {
        let policyNo = this.formGroup.controls['policyInfo'].get('policyNo').value;
        let policyEndtNo = this.formGroup.controls['policyInfo'].get('policyEndtNo').value;
        let tempCoinsurerInfoArray: FormArray = <FormArray>this.formGroup.get('coinsurerInfo');
        if (tempCoinsurerInfoArray && tempCoinsurerInfoArray.length > 0) {
            tempCoinsurerInfoArray.controls.forEach((ele, index) => {
                let seqNo = index > 9 ? '0' + (index + 1) : '00' + (index + 1);
                ele.get('policyNo').setValue(policyNo);
                ele.get('policyEndtNo').setValue(policyEndtNo);
                ele.get('key').setValue(ele.get('appName').value);
            });
        }
    }

    public addDeleteMultiSectionItem(deleteItemFlag?: boolean, itemNo?) {
        let inputJSON = this.formGroup.getRawValue();
        inputJSON['deleteItemFlag'] = deleteItemFlag;
        inputJSON['itemNo'] = itemNo;
        let policyInfoDetails = this.service.addDeleteMultiSectionItem(inputJSON);
        policyInfoDetails.subscribe(
            (policyInfoDetails) => {
                if ((policyInfoDetails.error !== null) && (policyInfoDetails.error !== undefined) && (policyInfoDetails.error.length >= 1)) {
                    this.updateErrorObject(policyInfoDetails);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.updateFormGroup(policyInfoDetails);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }


    public addDeleteSubItem(data, deleteSubItemFlag?: boolean) {
        let inputJSON = this.formGroup.getRawValue();
        inputJSON['index'] = this.selectedRiskInfoIndex;
        inputJSON['deleteSubItemFlag'] = deleteSubItemFlag;
        inputJSON['subItemNo'] = data['subItemNo'];
        let policyInfoDetails = this.service.addDeleteSubItem(inputJSON);
        policyInfoDetails.subscribe(
            (policyInfoDetails) => {
                if ((policyInfoDetails.error !== null) && (policyInfoDetails.error !== undefined) && (policyInfoDetails.error.length >= 1)) {
                    this.updateErrorObject(policyInfoDetails);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                } else {
                    this.updateFormGroup(policyInfoDetails);
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                }
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }

    public updateFormGroup(response) {
        this.formGroup.controls['customerInfo'].patchValue(response.customerInfo);
        this.formGroup.controls['customerInfo'].updateValueAndValidity();
        this.formGroup.controls['policyInfo'].patchValue(response.policyInfo);
        this.formGroup.controls['policyInfo'].updateValueAndValidity();
        this.formGroup.controls['errorInfo'] = this.updateErrorInfoValue(response);
        this.formGroup.controls['errorInfo'].updateValueAndValidity();
        this.formGroup.controls['instalmentItemInfo'] = this.updateInstalmentItemInfoValue(response);
        this.formGroup.controls['instalmentItemInfo'].updateValueAndValidity();
        this.formGroup.controls['documentInfo'] = this.updateDocumentInfo(response);
        this.formGroup.controls['documentInfo'].updateValueAndValidity();
        this.updateSummaryInfo(this.formGroup, response);
        this.updateDeclarationInfo(this.formGroup, response);
        this.updateFormArray(this.formGroup, response, 'coinsurerInfo');
        this.updateFormArray(this.formGroup, response, 'nomineeInfo');
        this.updateFormArray(this.formGroup, response, 'policyCovgInfo');
        this.transactionTypeInstance.transaction.docInfo = response.documentInfo;
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
        let riskInfoArray: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        riskInfoArray.patchValue(this.updateRiskInfoDetails(riskInfoArray, response.riskInfo));
    }

    public updateSummaryInfo(formGroup: FormGroup, response) {
        if (response.summaryInfo) {
            let summaryInfo: FormGroup = <FormGroup>formGroup.get('summaryInfo');
            if (summaryInfo) {
                summaryInfo.patchValue(response.summaryInfo);
                summaryInfo.updateValueAndValidity();
            } else {
                formGroup.addControl('summaryInfo', this.transactionTypeInstance.transaction.summaryInfo.getSummaryInfoModel());
                formGroup.get('summaryInfo').patchValue(response.summaryInfo);
                formGroup.get('summaryInfo').updateValueAndValidity();
            }
        }
        return formGroup;
    }

    public updateRiskInfoDetails(formGroupRiskInfo: FormArray, responseRiskInfo) {
        for (let i = 0; i < formGroupRiskInfo.length; i++) {
            formGroupRiskInfo.removeAt(i);
            i--;
        }
        for (let i = 0; i < responseRiskInfo.length; i++) {
            formGroupRiskInfo.push(this.getRiskInfoModelFromClassScreenCode(responseRiskInfo[i]));
            formGroupRiskInfo.at(i).patchValue(this.updateFormArray(<FormGroup>formGroupRiskInfo.at(i), responseRiskInfo[i], 'subjectMatterInfo'));
            formGroupRiskInfo.at(i).patchValue(this.updateFormArray(<FormGroup>formGroupRiskInfo.at(i), responseRiskInfo[i], 'claimHistoryInfo'));
            formGroupRiskInfo.at(i).patchValue(this.updateFormArray(<FormGroup>formGroupRiskInfo.at(i), responseRiskInfo[i], 'nomineeInfo'));
            formGroupRiskInfo.at(i).patchValue(this.updateFormArray(<FormGroup>formGroupRiskInfo.at(i), responseRiskInfo[i], 'riskSurveyorDetailsInfo'));
            formGroupRiskInfo.at(i).patchValue(this.updateFormArray(<FormGroup>formGroupRiskInfo.at(i), responseRiskInfo[i], 'additionalRiskInfo'));
            formGroupRiskInfo.at(i).patchValue(this.updatePlans(<FormGroup>formGroupRiskInfo.at(i), responseRiskInfo[i]));
            let subRiskInfoArray: FormArray = <FormArray>formGroupRiskInfo.at(i).get('subRiskInfo');
            if (subRiskInfoArray === undefined || subRiskInfoArray === null) {
                (<FormGroup>formGroupRiskInfo.at(i)).addControl('subRiskInfo', new FormArray([]));
            }
            if (responseRiskInfo[i].subRiskInfo && responseRiskInfo[i].subRiskInfo.length > 0) {
                this.updateRiskInfoDetails(subRiskInfoArray, responseRiskInfo[i].subRiskInfo);
            }
        }
        formGroupRiskInfo.patchValue(responseRiskInfo);
        formGroupRiskInfo.updateValueAndValidity(responseRiskInfo);
        return formGroupRiskInfo.value;
    }

    public updatePlans(formGroupRiskInfoObject: FormGroup, responseRiskInfoObject) {
        let plansArray: FormArray = <FormArray>formGroupRiskInfoObject.get('plans');
        if (plansArray && plansArray.length > 0) {
            for (let i = 0; i < plansArray.length; i++) {
                plansArray.removeAt(i);
                i--;
            }
        }
        if (responseRiskInfoObject.plans && responseRiskInfoObject.plans.length > 0) {
            if (plansArray === undefined || plansArray === null) {
                formGroupRiskInfoObject.addControl('plans', new FormArray([]));
                plansArray = <FormArray>formGroupRiskInfoObject.get('plans');
            }
            responseRiskInfoObject.plans.forEach((element, index) => {
                plansArray.push(this.transactionTypeInstance.transaction.plans.getPlanInfoModel());
                plansArray.at(index).patchValue(this.updateSummaryInfo(<FormGroup>plansArray.at(index), responseRiskInfoObject.plans[index]));
                plansArray.at(index).patchValue(this.updateFormArray(<FormGroup>plansArray.at(index), responseRiskInfoObject.plans[index], 'policyCovgInfo'));
                plansArray.at(index).patchValue(this.updatePlanDetails(<FormGroup>plansArray.at(index), responseRiskInfoObject.plans[index]));

            });
            plansArray.patchValue(responseRiskInfoObject.plans);
            plansArray.updateValueAndValidity();
        }
        return formGroupRiskInfoObject;
    }

    public updateDeclarationInfo(formGroup: FormGroup, responseObject) {
        let declarationInfoArray: FormArray = <FormArray>formGroup.get('declarationInfo');
        if (declarationInfoArray && declarationInfoArray.length > 0) {
            for (let i = 0; i < declarationInfoArray.length; i++) {
                declarationInfoArray.removeAt(i);
                i--;
            }
        }
        if (responseObject.declarationInfo && responseObject.declarationInfo.length > 0) {
            if (declarationInfoArray === undefined || declarationInfoArray === null) {
                formGroup.addControl('declarationInfo', new FormArray([]));
                declarationInfoArray = <FormArray>formGroup.get('declarationInfo');
            }
            responseObject.declarationInfo.forEach((element, index) => {
                declarationInfoArray.push(this.transactionTypeInstance.transaction.declarationInfo.getDeclarationInfoModel());
                declarationInfoArray.at(index).patchValue(this.updateDeclarationItemSectionInfo(<FormGroup>declarationInfoArray.at(index), responseObject.declarationInfo[index]));

            });
            declarationInfoArray.patchValue(responseObject.declarationInfo);
            declarationInfoArray.updateValueAndValidity();
        }
        return formGroup;
    }

    public updateDeclarationItemSectionInfo(formGroup: FormGroup, responseObject) {
        let declarationItemSectionInfoArray: FormArray = <FormArray>formGroup.get('declarationItemSectionInfo');
        if (declarationItemSectionInfoArray && declarationItemSectionInfoArray.length > 0) {
            for (let i = 0; i < declarationItemSectionInfoArray.length; i++) {
                declarationItemSectionInfoArray.removeAt(i);
                i--;
            }
        }
        if (responseObject.declarationItemSectionInfo && responseObject.declarationItemSectionInfo.length > 0) {
            if (declarationItemSectionInfoArray === undefined || declarationItemSectionInfoArray === null) {
                formGroup.addControl('declarationItemSectionInfo', new FormArray([]));
                declarationItemSectionInfoArray = <FormArray>formGroup.get('declarationItemSectionInfo');
            }
            responseObject.declarationItemSectionInfo.forEach((element, index) => {
                declarationItemSectionInfoArray.push(this.transactionTypeInstance.transaction.declarationItemSectionInfo.getDeclarationItemSectionInfoModel());
                declarationItemSectionInfoArray.at(index).patchValue(this.updateFormArray(<FormGroup>declarationItemSectionInfoArray.at(index), responseObject.declarationItemSectionInfo[index], 'declarationCoverageInfo'));
            });
            declarationItemSectionInfoArray.patchValue(responseObject.declarationItemSectionInfo);
            declarationItemSectionInfoArray.updateValueAndValidity();
        }
        return formGroup;
    }

    public updatePlanDetails(formGroupPlansObject: FormGroup, responsePlansObject) {
        let planDetailsArray: FormArray = <FormArray>formGroupPlansObject.get('planDetails');
        if (planDetailsArray && planDetailsArray.length > 0) {
            for (let i = 0; i < planDetailsArray.length; i++) {
                planDetailsArray.removeAt(i);
                i--;
            }
        }
        if (responsePlansObject.planDetails && responsePlansObject.planDetails.length > 0) {
            if (planDetailsArray === undefined || planDetailsArray === null) {
                formGroupPlansObject.addControl('planDetails', new FormArray([]));
                planDetailsArray = <FormArray>formGroupPlansObject.get('planDetails');
            }
            responsePlansObject.planDetails.forEach((element, index) => {
                planDetailsArray.push(this.transactionTypeInstance.transaction.planDetail.getPlanDetailsInfoModel());
                planDetailsArray.at(index).patchValue(this.updateFormArray(<FormGroup>planDetailsArray.at(index), responsePlansObject.planDetails[index], 'coverageLoadingInfo'));
                planDetailsArray.at(index).patchValue(this.updateFormArray(<FormGroup>planDetailsArray.at(index), responsePlansObject.planDetails[index], 'coverageSubjectMatterInfo'));
            });
            planDetailsArray.patchValue(responsePlansObject.planDetails);
            planDetailsArray.updateValueAndValidity();
        }
        return formGroupPlansObject;
    }

    public updateFormArray(formGroupObject: FormGroup, responseObject, modelKey) {
        let formArray: FormArray = <FormArray>formGroupObject.get(modelKey);
        if (formArray && formArray.length > 0) {
            for (let i = 0; i < formArray.length; i++) {
                formArray.removeAt(i);
                i--;
            }
        }
        if (responseObject[modelKey] && responseObject[modelKey].length > 0) {
            if (formArray === undefined || formArray === null) {
                formGroupObject.addControl(modelKey, new FormArray([]));
                formArray = <FormArray>formGroupObject.get(modelKey);
            }
            responseObject[modelKey].forEach((element, index) => {
                formArray.push(this.getModelFromModelKey(modelKey));
            });
            formArray.patchValue(responseObject[modelKey]);
            formArray.updateValueAndValidity();
        }
        return formGroupObject;
    }

    public getModelFromModelKey(modelKey) {
        if (modelKey === 'coverageSubjectMatterInfo') {
            return this.transactionTypeInstance.transaction.subjectMatterInfo.getSubjectMatterInfoModel();
        } else if (modelKey === 'coinsurerInfo') {
            return this.transactionTypeInstance.transaction.coinsurerInfo.getCoinsurerInfoModel();
        } else if (modelKey === 'policyCovgInfo') {
            return this.transactionTypeInstance.transaction.policyCoverageInfo.getPolicyCoverageInfoModel();
        } else if (modelKey === 'subjectMatterInfo') {
            return this.transactionTypeInstance.transaction.subjectMatterInfo.getSubjectMatterInfoModel();
        } else if (modelKey === 'claimHistoryInfo') {
            return this.transactionTypeInstance.transaction.claimHistoryInfo.getClaimHistoryInfoModel();
        } else if (modelKey === 'coverageLoadingInfo') {
            return this.transactionTypeInstance.transaction.coverageLoadingInfo.getCoverageLoadingInfoModel();
        } else if (modelKey === 'declarationInfo') {
            return this.transactionTypeInstance.transaction.declarationInfo.getDeclarationInfoModel();
        } else if (modelKey === 'declarationItemSectionInfo') {
            return this.transactionTypeInstance.transaction.declarationItemSectionInfo.getDeclarationItemSectionInfoModel();
        } else if (modelKey === 'declarationCoverageInfo') {
            return this.transactionTypeInstance.transaction.declarationCoverageInfo.getDeclarationCoverageInfoModel();
        } else if (modelKey === 'nomineeList' || modelKey === 'nomineeInfo') {
            return this.transactionTypeInstance.transaction.nomineeDetail.getNomineeInfo();
        } else if (modelKey === 'riskSurveyorDetailsInfo') {
            return this.transactionTypeInstance.transaction.riskSurveyorDetailsInfo.getRiskSurveyorDetailsInfoModel();
        } else if (modelKey === 'additionalRiskInfo') {
            return this.transactionTypeInstance.transaction.additionalRiskInfo.getAdditionalRiskInfoModel();
        } else {
            return null;
        }
    }

    public setSeqNoAndKey(formArray: FormArray) {
        if (formArray && formArray.length > 0) {
            formArray.controls.forEach((ele, index) => {
                let seqNo = index > 9 ? '0' + (index + 1) : '00' + (index + 1);
                ele.get('seqNo').setValue(seqNo);
                ele.get('key').setValue(seqNo);
            });
        }
    }

    public addDeleteRiskSurveyorDetailsInfo(data, deleteRiskSurveyorDetails: boolean) {
        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
            let riskInfoObject: FormGroup = <FormGroup>(<FormArray>this.formGroup.controls['riskInfo']).at(this.selectedRiskInfoIndex);
            let riskSurveyorDetailsInfoArray: FormArray;
            if (riskInfoObject.get('riskSurveyorDetailsInfo') === undefined || riskInfoObject.get('riskSurveyorDetailsInfo') === null) {
                riskInfoObject.addControl('riskSurveyorDetailsInfo', new FormArray([]));
                riskSurveyorDetailsInfoArray = <FormArray>riskInfoObject.get('riskSurveyorDetailsInfo');
            } else {
                riskSurveyorDetailsInfoArray = <FormArray>riskInfoObject.get('riskSurveyorDetailsInfo');
            }
            if (deleteRiskSurveyorDetails) {
                riskSurveyorDetailsInfoArray.removeAt(data.value.index)
            } else {
                let riskSurveyorDetails: FormGroup = <FormGroup>this.transactionTypeInstance.transaction.riskSurveyorDetailsInfo.getRiskSurveyorDetailsInfoModel();
                riskSurveyorDetails.get('policyNo').setValue(this.formGroup.controls['policyInfo'].get('policyNo').value);
                riskSurveyorDetails.get('policyEndtNo').setValue(this.formGroup.controls['policyInfo'].get('policyEndtNo').value);
                riskSurveyorDetails.get('itemNo').setValue(riskInfoObject.get('itemNo').value);
                riskSurveyorDetails.get('sectNo').setValue(riskInfoObject.get('sectNo').value);
                riskSurveyorDetailsInfoArray.push(riskSurveyorDetails);
                this.setSeqNoAndKeyForRiskSurveyorDetailsInfo(riskSurveyorDetailsInfoArray);
            }
        }
    }

    public setSeqNoAndKeyForRiskSurveyorDetailsInfo(formArray: FormArray) {
        if (formArray && formArray.length > 0) {
            formArray.controls.forEach((ele, index) => {
                ele.get('key').setValue(ele.get('surveyorCode').value);
            });
        }
    }

    public addDeleteAdditionalRiskInfo(data, deleteAdditionalRisk: boolean) {
        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
            let riskInfoObject: FormGroup = <FormGroup>(<FormArray>this.formGroup.controls['riskInfo']).at(this.selectedRiskInfoIndex);
            let additionalRiskInfoArray: FormArray;
            if (riskInfoObject.get('additionalRiskInfo') === undefined || riskInfoObject.get('additionalRiskInfo') === null) {
                riskInfoObject.addControl('additionalRiskInfo', new FormArray([]));
                additionalRiskInfoArray = <FormArray>riskInfoObject.get('additionalRiskInfo');
            } else {
                additionalRiskInfoArray = <FormArray>riskInfoObject.get('additionalRiskInfo');
            }
            if (deleteAdditionalRisk) {
                additionalRiskInfoArray.removeAt(data.value.index)
            } else {
                let additionalRiskInfo: FormGroup = <FormGroup>this.transactionTypeInstance.transaction.additionalRiskInfo.getAdditionalRiskInfoModel();
                additionalRiskInfo.get('policyNo').setValue(this.formGroup.controls['policyInfo'].get('policyNo').value);
                additionalRiskInfo.get('policyEndtNo').setValue(this.formGroup.controls['policyInfo'].get('policyEndtNo').value);
                additionalRiskInfo.get('itemNo').setValue(riskInfoObject.get('itemNo').value);
                additionalRiskInfo.get('sectNo').setValue(riskInfoObject.get('sectNo').value);
                additionalRiskInfoArray.push(additionalRiskInfo);
                this.setKeyForAdditionalRiskInfo(additionalRiskInfoArray);
            }
        }
    }

    public setKeyForAdditionalRiskInfo(formArray: FormArray) {
        if (formArray && formArray.length > 0) {
            formArray.controls.forEach((ele, index) => {
                let seqNo = index > 9 ? '0' + (index + 1) : '00' + (index + 1);
                ele.get('additionalKey').setValue(seqNo);
                ele.get('key').setValue(ele.get('itemNo').value + ele.get('sectNo').value + seqNo);
            });
        }
    }

    getRiskInfoModelFromClassScreenCode(riskInfoObject) {
        if (riskInfoObject && riskInfoObject.classScreenCode) {
            let sectionClass = riskInfoObject.classScreenCode;
            switch (sectionClass) {
                case "1": return this.transactionTypeInstance.transaction.riskInfo.getMTRRiskInfoModel();
                case "2": return this.transactionTypeInstance.transaction.riskInfo.getMARRiskInfoModel();
                case "3": return this.transactionTypeInstance.transaction.riskInfo.getPARiskInfoModel();
                case "4": return this.transactionTypeInstance.transaction.riskInfo.getWCRiskInfoModel();
                case "5": return this.transactionTypeInstance.transaction.riskInfo.getFIRRiskInfoModel();
                case "7": return this.transactionTypeInstance.transaction.riskInfo.getTRLRiskInfoInfoModel();
                case "9": return this.transactionTypeInstance.transaction.riskInfo.getENGRiskInfoModel();
                case "11": return this.transactionTypeInstance.transaction.riskInfo.getAVIRiskInfoInfoModel();
                case "14": return this.transactionTypeInstance.transaction.riskInfo.getLIARiskInfoModel();
                default: return this.getRiskInfoModel();
            }
        } else {
            return this.getRiskInfoModel();
        }
    }
}
