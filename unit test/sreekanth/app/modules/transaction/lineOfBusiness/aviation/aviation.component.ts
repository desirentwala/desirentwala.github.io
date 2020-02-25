import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NCPFormUtilsService } from '../../../../core/ncp-forms/ncp.form.utils';
import { DateFormatService } from '../../../../core/ui-components/ncp-date-picker/services/ncp-date-picker.date.format.service';
import { PickListService } from '../../../common/services/picklist.service';
import { customerService } from '../../../customer/services/customer.service';
import { UserFormService } from '../../../userManagement';
import { ElementConstants } from '../../constants/ncpElement.constants';
import { PolicyTransactionService } from '../../services/policytransaction.service';
import { QuoteTransactionService } from '../../services/quotetransaction.service';
import { RenewalTransactionService } from '../../services/renewalTransaction.service';
import { TransactionComponent } from '../../transaction.component';
import { AviationDefaultValue } from './aviation.defaultValues';
import { AviationPolicyValidator } from './aviationPolicy.validator';
import { AviationQuoteValidator } from './aviationQuote.validator';
import { CommonService } from '../../../../core/services/common.service';
import { ReferTxnInfoModel } from '../../../common/enquiry/models/referTxnInfo.model';
import { CommonConstants } from '../../../constants/module.constants';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { Subject, takeUntil } from '@adapters/packageAdapter';
/**
 * Component Class for Travel Insurance related methods.
 * @implements OnInit, AfterContentInit, OnDestroy
 */

@Component({
    template: `
    <button-field *ngIf="isShowBackButton" buttonType="custom" buttonName="NCPBtn.back" buttonClass="ncpbtn-default mr0 t-34" (click)="goBackToPMOV()"></button-field>
    <ncp-errorHandler [isError]="isError" [errors]="errors"> </ncp-errorHandler>
    <ncp-form *ngIf="formData;else contentPlaceHolderTpl" [formData]="formData"></ncp-form>
    <ng-template #contentPlaceHolderTpl>
        <div class="timeline-wrapper content-placeholder">
            <div class="timeline-item">
                <div class="center">
                    <div class="animated-background circle-top"></div>
                    <div class="animated-background circle-line"></div>
                    <div class="animated-background circle-top"></div>
                    <div class="animated-background circle-line"></div>
                    <div class="animated-background circle-top"></div>
                    <div class="animated-background circle-line"></div>
                    <div class="animated-background circle-top"></div>
                    <div class="animated-background circle-line"></div>
                    <div class="animated-background circle-top"></div>
                    <div class="animated-background circle-line"></div>
                    <div class="animated-background circle-top"></div>
                </div>
            </div>
        </div>
    </ng-template>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AviationComponent extends TransactionComponent implements OnInit, AfterContentInit, OnDestroy {
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
    public disablePiolDelRisk: boolean = false;
    public isNomineeErrorFlag: boolean = true;
    public isRiskLevelNominee: boolean = false;
    public isNominee: boolean = false;
    public disableadditionalEquiDelRisk: boolean = false;
    public tempMotorMake = '';
    public expandVehicleDetails = false;
    public isVehicleFound: boolean = false;
    public canadaflag: boolean = false;
    public usflag: boolean = false;
    public uwflag: boolean = false;
    // + Others
    confirmTableHeader: any[] = [];
    confirmTableMapping: any[] = [];
    customizedErrorListNoOfTravellers = { error: [{ errCode: '01', errDesc: 'Minimum Number of Travellers should be 2 for Family or Group ' }] };
    numberofInsureds: any[] = [0];
    pdfSource;
    public region: string = '';
    public quotInfoResponseVal;
    public jsonRatingFormGroup: FormGroup = new FormGroup({});
    public revisedQuotInfoResponseVal;
    multiProductPrem: string = '0.00';
    campaignDiscount: string = '0.00';
    schemeDiscount: string = '0.00';
    excessControl = new FormControl(false);
    standardExcessCode = '';
    standardExcessDesc = '';
    excessCode = '';
    excessDesc = '';
    public makeCode = '';
    public modelCode = '';
    public policyNumber: any;
    numberOfAdults = 0;
    tabErrorFlag: boolean = true;
    validflag: boolean = false;
    called = 0;
    public pickListService;
    public hasCustomerCreation: boolean = true
    public multicheckarray = [];
    public operationMultciheckarray = []
    public operationCanadaMultciheckarray = [];
    public coverFromDateValidation: boolean = true;
    licenseStateList: any = [];
    isLicenseStateCheck: boolean = false;
    isBorRequired: boolean = false;
    userRoleId: string = '';
    userDetailsResp;
    private ngUnsubscribe = new Subject();
    isNewCustomer = false;
    referralReasonsArray = [];
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
        public dateFormatService: DateFormatService,
        public commonService: CommonService,
        public utilsService: UtilsService,
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
        this.transactionTypeInstance.transaction.lobCode = 'AVIATION';
        this.pickListService = pickListService
    }
    // + LifeCycle & NG2Wizard related common methods
    ngOnInit() {
        let lobObject: any = this.transactionTypeInstance.transaction.utilService.get(this.transactionTypeInstance.transaction.lobCode);
        if (lobObject) {
            this.quoteFormDataInit();
        }
        this.formGroup = this.transactionTypeInstance.transaction.quoteinfo.getAVIQuotInfoModel();
        this.transactionTypeInstance.transaction.subcribeToFormChanges(this.formGroup);
        this.doInitCommonWizardSub(); 
        // this.transactionTypeInstance.transaction.modalCloseSub = this.transactionTypeInstance.transaction.eventHandlerService.modalCloseSub.subscribe((data) => {
        //     if (data.id === 'referralHistoryModalClose') {
        //         this.referralHistoryModal = false;
        //     }
        // });
        this.doInitChangeSub();
        this.doInitClickSub();
        this.doInitRiskInfoGroup();
        this.doInitModalCloseSub();
        // if (this.transactionTypeInstance.transaction.getIsB2B()) {
        //     let partyDetailsResponse = this.userService.doCheckpartyid({ 'user_party_id': this.transactionTypeInstance.transaction.configService.getCustom('user_party_id') });
        //     partyDetailsResponse.subscribe((data) => {
        //         if (data.paymentTypeCode && data.paymentTypeDesc) {
        //             let paymentType = this.transactionTypeInstance.transaction.configService.get(data.paymentTypeCode).toLowerCase();
        //             if (paymentType === 'cash') {
        //                 this.transactionTypeInstance.transaction.payByCredit = false;
        //             }
        //         }
        //         this.changeRef.detectChanges();
        //     });
        // }
        this.formGroup = this.validator.setAviationQuotValidator(this.formGroup, this.usflag);
    }
    ngAfterContentInit() {
        this.setSelectedPlan();
        this.setKeysForPilot();
        this.setKeysForAdditionalInsurer();
        //this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'navigateOnLoadTabIndex', this.formData.controls('tabInfo').at(0).currentIndex.value);

        // this.formGroup.controls['customerInfo'].get('age').valueChanges.subscribe(data => {
        //     if (data || parseInt(data) === 0) {
        //         if (parseInt(data) < 18) {
        //             this.formGroup.controls['customerInfo'].get('age').setErrors({ 'minNumber': true });
        //             this.changeRef.markForCheck();
        //         } else {
        //             if (parseInt(data) > 80) {
        //                 this.formGroup.controls['customerInfo'].get('age').setErrors({ 'maxNumber': true });
        //                 this.changeRef.markForCheck();
        //             }
        //             else {
        //                 this.formGroup.controls['customerInfo'].get('age').setErrors(null);
        //                 this.changeRef.markForCheck();
        //             }
        //         }
        //     }
        // });
        // this.formGroup.controls['referQuotInfo'].get('attachments').valueChanges.subscribe(data => {
        //     this.getMimeTypedata(data);
        // });
        // this.transactionTypeInstance.transaction.subscribedMap['isAllDeclerationsEnabled'] = this.formGroup.controls['policyInfo'].get('isAllDeclerationsEnabled').valueChanges.subscribe(data => {
        //     this.doAgreeAllDeclerations(data);
        // });
    }
    ngOnDestroy() {
        window.scrollTo(150, 150);
        this.transactionTypeInstance.transaction.doDestroyCommonWizardSub();
        this.transactionTypeInstance.transaction.doPopCommonWizardSub();
        this.setDefaultValues();
        this.disableDelRisk = false;
        this.isNomineeErrorFlag = true;
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
        this.transactionTypeInstance.transaction.setDefaultValues();
    }
    public doInitModalCloseSub() {
        this.transactionTypeInstance.transaction.modalCloseSub = this.transactionTypeInstance.transaction.eventHandlerService.modalCloseSub.subscribe((data) => {
            if (data.id) {
                if (data.id === 'borModalClose') {
                   let borModalClose = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestModal, 'modalKey', borModalClose);
                }
            }
        });
    }
    public doInitChangeSub() {
        this.transactionTypeInstance.transaction.changeSub = this.transactionTypeInstance.transaction.eventHandlerService.changeSub.subscribe((data) => {
            if (data.id) {
                if (data.id === 'policytyepSelected') {
                    this.policytyepSelected(data.value);
                    this.formGroup = this.validator.setAviationQuotValidator(this.formGroup, this.usflag);
                }
                else if (data.id === 'subsidiaryModal') {
                    if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.subsidiaryInfo, 'modalKey', data.value.innerValue == true ? true : false);
                    }
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'validateq1') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagCondition, 'condition', this.usflag ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagCondition, 'condition', this.usflag ? false : true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagCondition1, 'condition', this.usflag ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagCondition1, 'condition', this.usflag ? false : true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.countyFlagCondition, 'condition', this.canadaflag ? false : true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagCondition2, 'condition', this.usflag ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagCondition2, 'condition', this.usflag ? false : true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1Decline, 'modalKey', data.value == 'y' ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1Conditionus, 'condition', data.value == 'n' && this.usflag ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1Conditioncanada, 'condition', data.value == 'n' && this.canadaflag ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.countyFlagCondition, 'condition', this.canadaflag ? false : true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagConditionAdditionalInsurer, 'condition', this.usflag);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagConditionAdditionalInsurer, 'condition', this.canadaflag);
                    if (data.value === 'y') {
                        this.formGroup.controls['policyInfo'].get('coverageType').patchValue('');
                        this.formGroup.controls['policyInfo'].get('isScheduled').patchValue('');
                        this.formGroup.controls['policyInfo'].get('isBlanket').patchValue('');
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2Condition, 'condition', false);
                        this.formGroup.controls['policyInfo'].get('operateCommercialUs').patchValue('');
                    }
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1DeclineCondition, 'condition', data.value == 'y' ? true : false);
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'validateq2us') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2usDecline, 'modalKey', data.value == 'n' ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2Condition, 'condition', data.value == 'y' ? true : false);
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2usDeclineCondition, 'condition', data.value == 'n' ? true : false);
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'validateq2ca') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2caDecline, 'modalKey', data.value == 'NO' ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2Condition, 'condition', data.value == 'SFOC' || data.value == 'Exemption for UAS 1kg or less' || data.value == 'Exemption for UAS greater than 1kg up to and including 25kgs' ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2caDeclineCondition, 'condition', data.value == 'NO' ? true : false);
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'covertypeSelection') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.owned, 'condition', data.value == 'OWN' ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.risNonkowned, 'condition', data.value == 'NON' ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.overCrowds, 'condition', data.value == 'NON' ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.listScheduledCondition, 'condition', data.value == 'NON' ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nonOwnedPlanCondition, 'condition', data.value == 'NON' ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.multipleUasFlying, 'condition', data.value == 'NON' ? true : false);
                    if (data.value === 'NON') {
                        this.formGroup.controls['policyInfo'].get('isScheduled').setValidators(null);
                        this.formGroup.controls['policyInfo'].get('isBlanket').setValidators(null);
                        this.formGroup.controls['policyInfo'].get('isScheduled').patchValue(false);
                        this.formGroup.controls['policyInfo'].get('isBlanket').patchValue(false);
                        let tabInfoGroup: any = this.formGroup.controls['tabInfo'];
                        let tabHeaderInfo = tabInfoGroup.at(0).get('headerContentInfo').value;
                        for (let i = 0; i < tabHeaderInfo.length; i++) {
                            if (tabHeaderInfo[i].data !== "") {
                                this.pushTabHeaderDetails();
                            }
                        }
                    } else {
                        this.formGroup.controls['policyInfo'].get('isScheduled').setValidators(Validators.required);
                        this.formGroup.controls['policyInfo'].get('isBlanket').setValidators(Validators.required);
                    }
                    this.riskInfoGroup.get('coverType').patchValue(data.value);
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'scheduleSelection') {
                    let disabledBlanketOpt: any[] = [
                        {
                            "value": "S",
                            "label": "NCPBtn.scheduled"
                        },
                        {
                            "value": "B",
                            "label": "NCPBtn.blanket",
                            "disabled": data.value.innerValue
                        },
                        {
                            "value": "N",
                            "label": "NCPBtn.none"
                        }
                    ];
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addDrone, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledPlanCondition, 'condition', data.value.innerValue === true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledUnmanned, 'radioArray', disabledBlanketOpt);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledUploadCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.partitionScheduled, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.listScheduledCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduleCovgSiCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceScheduledCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.additionalAggScheduledCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.headingScheduledCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledOrBlanketCondition, 'condition', data.value.innerValue == true ? true : false);

                    if (data.value.innerValue) {
                        this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isBlanket').value ? 'BOT' : 'SCH');
                        this.formGroup.controls['policyInfo'].get('isBlanket').setValidators(null);
                    } else {
                        this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isBlanket').value ? 'BLK' : '');
                        this.formGroup.controls['policyInfo'].get('isBlanket').setValidators(Validators.required);
                    }
                    // let plandetailsArray: FormArray = <FormArray>tempPlandetailsFormGroup.get('planDetails');

                    // let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                    // let tempFormGroup = tempRiskInfoArray.at(0);
                    // let coveragesArray: FormArray = <FormArray>tempFormGroup.get('plans');
                    // coveragesArray.push(this.transactionTypeInstance.transaction.plans.getAVIPlanInfoModel());
                    // coveragesArray.at(0).get('planTypeCode').patchValue('SCH');
                    let tabInfoGroup: any = this.formGroup.controls['tabInfo'];
                    let tabHeaderInfo = tabInfoGroup.at(0).get('headerContentInfo').value;
                    for (let i = 0; i < tabHeaderInfo.length; i++) {
                        if (tabHeaderInfo[i].data !== "") {
                            this.pushTabHeaderDetails();
                        }
                    }
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'blanketSelection') {
                    let disabledBlanketOpt: any[] = [
                        {
                            "value": "S",
                            "label": "NCPBtn.scheduled"
                        },
                        {
                            "value": "B",
                            "label": "NCPBtn.blanket",
                            "disabled": !data.value.innerValue
                        },
                        {
                            "value": "N",
                            "label": "NCPBtn.none"
                        }
                    ];
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.overCrowds, 'condition', data.value.innerValue == true ? true : false);
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned1, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketPlanCondition, 'condition', data.value.innerValue === true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.fileUploadCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledUnmanned, 'radioArray', disabledBlanketOpt);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketUploadCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketUASCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketCovgSiCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceBlanketCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.additionalAggBlanketCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.headingBlanketCondition, 'condition', data.value.innerValue == true ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledOrBlanketCondition, 'condition', data.value.innerValue == true ? true : false);


                    if (data.value.innerValue) {
                        this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isScheduled').value ? 'BOT' : 'BLK');
                        this.formGroup.controls['policyInfo'].get('isScheduled').setValidators(null);
                    } else {
                        this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isScheduled').value ? 'SCH' : '');
                        this.formGroup.controls['policyInfo'].get('isScheduled').setValidators(Validators.required);
                    }

                    // let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                    // let tempFormGroup = tempRiskInfoArray.at(0);
                    // let coveragesArray: FormArray = <FormArray>tempFormGroup.get('plans');
                    // coveragesArray.push(this.transactionTypeInstance.transaction.plans.getAVIPlanInfoModel());
                    // coveragesArray.at(1).get('planTypeCode').patchValue('BLK');
                    let tabInfoGroup: any = this.formGroup.controls['tabInfo'];
                    let tabHeaderInfo = tabInfoGroup.at(0).get('headerContentInfo').value;
                    for (let i = 0; i < tabHeaderInfo.length; i++) {
                        if (tabHeaderInfo[i].data !== "") {
                            this.pushTabHeaderDetails();
                }
                    }
                }
                else if (data.id === 'uasSelected') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.uasCondition, 'condition', data.value == 'y' ? true : false);
                    if (data.value === 'n') {
                        let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                        let tempRiskInfo = tempRiskArray.at(0);
                        let pilotInfo: FormArray = <FormArray>tempRiskInfo.get('pilotInfo');
                        let pilotGroup = pilotInfo.at(0);
                        let recurrentInfoArray: FormArray = <FormArray>pilotGroup.get('recurrentInfo');
                        let i;
                        for (i = recurrentInfoArray.length - 1; i > 0; i--) {
                            recurrentInfoArray.removeAt(i);
                        }
                        let recurrentInfo: any = recurrentInfoArray.at(0)
                        for (let key in recurrentInfo.controls) {
                            recurrentInfo.get(key).patchValue("");
                        }
                    }
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'aircraftIncidents') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.airCraftsCondition, 'condition', data.value == 'y' ? true : false);
                    let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                    let tempPlanFormGroup = tempRiskArray.at(0);
                    let coveragesArray: FormArray = <FormArray>tempPlanFormGroup.get('pilotInfo');
                    if (data.value === 'y') {
                        coveragesArray.at(0).get('aircraftIncidentex').setValidators(Validators.compose([Validators.required]));
                    } else {
                        coveragesArray.at(0).get('aircraftIncidentex').setValidators(null);
                        coveragesArray.at(0).get('aircraftIncidentex').patchValue('');
                    }
                    coveragesArray.at(0).get('aircraftIncidentex').updateValueAndValidity();
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'scheduledUnmanned') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledCondition, 'condition', data.value == 'S' ? true : false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketCondition, 'condition', data.value == 'B' ? true : false);
                    this.changeRef.detectChanges();
                }

                else if (data.id === 'federalAviation') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.federalAviationCondition, 'condition', data.value == 'y' ? true : false);
                    let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                    let tempPlanFormGroup = tempRiskArray.at(0);
                    let coveragesArray: FormArray = <FormArray>tempPlanFormGroup.get('pilotInfo');
                    if (data.value === 'y') {
                        coveragesArray.at(0).get('federalAviationex').setValidators(Validators.compose([Validators.required]));
                    } else {
                        coveragesArray.at(0).get('federalAviationex').setValidators(null);
                        coveragesArray.at(0).get('federalAviationex').patchValue('');
                    }
                    coveragesArray.at(0).get('federalAviationex').updateValueAndValidity();
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'autoMobileDriver') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.autoMobileDriverCondition, 'condition', data.value == 'y' ? true : false);
                    let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                    let tempPlanFormGroup = tempRiskArray.at(0);
                    let coveragesArray: FormArray = <FormArray>tempPlanFormGroup.get('pilotInfo');
                    if (data.value === 'y') {
                        coveragesArray.at(0).get('automobiledriverex').setValidators(Validators.compose([Validators.required]));
                    } else {
                        coveragesArray.at(0).get('automobiledriverex').setValidators(null);
                        coveragesArray.at(0).get('automobiledriverex').patchValue('');
                    }
                    coveragesArray.at(0).get('automobiledriverex').updateValueAndValidity();
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'influenceofAlcohal') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.influenceofAlcohalCondition, 'condition', data.value == 'y' ? true : false);
                    let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                    let tempPlanFormGroup = tempRiskArray.at(0);
                    let coveragesArray: FormArray = <FormArray>tempPlanFormGroup.get('pilotInfo');
                    if (data.value === 'y') {
                        coveragesArray.at(0).get('influenceofAlcohalex').setValidators(Validators.compose([Validators.required]));
                    } else {
                        coveragesArray.at(0).get('influenceofAlcohalex').setValidators(null);
                        coveragesArray.at(0).get('influenceofAlcohalex').patchValue('');
                    }
                    coveragesArray.at(0).get('influenceofAlcohalex').updateValueAndValidity();
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'claimOrLossSelection') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuranceClaimsCondition, 'condition', data.value === 'y' ? true : false);
                    let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                    if (data.value === 'y') {
                        tempRiskArray.at(0).get('insuranceClaimDesc').setValidators(Validators.compose([Validators.required]));
                    } else {
                        tempRiskArray.at(0).get('insuranceClaimDesc').setValidators(null);
                        tempRiskArray.at(0).get('insuranceClaimDesc').patchValue('');
                    }
                    tempRiskArray.at(0).get('insuranceClaimDesc').updateValueAndValidity();
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'cancelledOrDecSelection') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.cancelledDeclinedCondition, 'condition', data.value == 'y' ? true : false);
                    let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                    if (data.value === 'y') {
                        tempRiskArray.at(0).get('insurerCancelDesc').setValidators(Validators.compose([Validators.required]));
                    } else {
                        tempRiskArray.at(0).get('insurerCancelDesc').setValidators(null);
                        tempRiskArray.at(0).get('insurerCancelDesc').patchValue('');
                    }
                    tempRiskArray.at(0).get('insurerCancelDesc').updateValueAndValidity();
                    this.changeRef.detectChanges();
                }
                else if (data.id === 'PolicyTypeLiaSelected') {
                    this.PolicyTypeLiaSelected(data.value);
                }
                else if (data.id === 'uploadDrone') {
                    this.uploadDrone(data.value.value);
                    this.changeRef.detectChanges();
                }
                 else if (data.id === 'warOccrrenceChangeId') {
                    if(this.riskInfoGroup.get('doWarOccurrenceLiabilityBLK').value === 'n'){
                        this.riskInfoGroup.get('aggregateLiabilityBLK').patchValue('y');
                        this.riskInfoGroup.get('aggregateLiabilityBLK').updateValueAndValidity();
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceNotConditionBLK, 'condition', true);                                                                  
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceNotConditionBLKSCH, 'condition', true);                                          
                    }else if(this.riskInfoGroup.get('doWarOccurrenceLiabilityBLK').value === 'y'){
                        this.riskInfoGroup.get('aggregateLiabilityBLK').patchValue('n');
                        this.riskInfoGroup.get('aggregateLiabilityBLK').updateValueAndValidity();      
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceNotConditionBLK, 'condition', false);                                          
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceNotConditionBLKSCH, 'condition', false);                                          
                    }
                }
                else if (data.id === 'blanketPhyDamageChangeId') {
                     let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                    let tempFormGroup = tempRiskInfoArray.at(0);
                    let coveragesArray: FormArray = <FormArray>tempFormGroup.get('plans');
                    let tempPlandetailsFormGroup = coveragesArray.at(0);
                    let plandetailsArray: FormArray = <FormArray>tempPlandetailsFormGroup.get('planDetails').value;
                    for(let i = 0; i < plandetailsArray.length; i++){
                    if(plandetailsArray[i].covgCd === 'PHY' && plandetailsArray[i].covgSi === '0'){
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deductibleCondition, 'condition', false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deductibleConditionBLKSCH, 'condition', false);
                    }else if (plandetailsArray[i].covgCd === 'PHY' && plandetailsArray[i].covgSi !== '0.00'){
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deductibleCondition, 'condition', true);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deductibleConditionBLKSCH, 'condition', true);
                    }   
                  }
                }
                else if (data.id === 'jsonRating') {
                    this.getUserViaJsonRating(data.value.parentIndex);
                }
                else if (data.id === 'setCoverDates') {
                    this.setCoverDates();
                }
                else if (data.id === 'policyPlanSelected') {
                    this.policyPlanSelected(data.value);
                }
                else if (data.id === 'flyingTerritorySelection') {
                    this.flyingTerritorySelection(data.value);
                }
                else if (data.id === 'flyingTerritoryWorldSelection') {
                    this.flyingTerritoryWorldSelection(data.value);
                }
                else if (data.id === 'isPilotCertifiedChanged') {
                    this.isPilotCertifiedChanged();
                }
                else if (data.id === 'coverDateChanged') {
                    this.validflag = false;
                    if (!this.transactionTypeInstance.transaction.isEnquiryFlag)
                        this.coverDateValidation();
                    //this.coverDateChanged();
                    this.setCoverDates();
                }
                else if (data.id === 'documentContent') {
                    this.getMimeTypedata(data.value);
                }

                else if (data.id === 'doCustomerRefresh') {
                    if (data.value && data.value.toString().length > 2) {
                        this.doCustomerRefresh(this.formGroup.controls['customerInfo']);
                        this.changeRef.detectChanges();
                    } else {
                        this.isCustomerRefreshed = false;
                        this.resetCustomerInfoIdentity(this.formGroup.controls['customerInfo'], data.id);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalAccountButton, 'isDisabled', true);
                    }
                }
                else if (data.id === 'doInsuredRefresh') {
                    this.doInsuredRefresh(data);
                }
                else if (data.id === 'postalCodeRefresh') {
                    this.getPostalCodeRefresh();
                }
                // else if (data.id === 'applicantChanged') {
                //     this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.applicantIsCondition1, 'Condition',this.checkApplicantValue() );
                //     this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.applicantIsCondition2, 'Condition', !this.checkApplicantValue());
                // }
                else if (data.id === 'coverageChanged') {
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
                else if (data.id === 'coverTypeChanged') {
                    let riskInfo = this.formGroup.controls['riskInfo'].value;
                    if (riskInfo && riskInfo.length > 0) {
                        riskInfo.forEach(riskInfoObject => {
                            let plans = riskInfoObject.plans;
                            if (plans && plans.length > 0) {
                                plans.forEach(planObject => {
                                    if (planObject.planTypeCode === data.value) {
                                        //this.selectedPlanDesc = planObject.planTypeDesc;
                                        planObject.isPlanSelected = true;
                                    }
                                });
                            }

                        });
                    }
                }
                else if (data.id === 'declarationsChanged') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                }

                else if (data.id === 'stateCodeChanged') {
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.cityDesc, 'param1', data.value);
                    //this.formGroup.controls['customerInfo'].get('cityCode').patchValue('');
                   //this.formGroup.controls['customerInfo'].get('cityDesc').patchValue('');
                }
                else if (data.id === 'documentContentfilePilotUpload') {
                    this.getPilotMimeTypedata(data.value.value);
                }
                else if (data.id === 'documentContentUpload') {
                    this.getMimeTypedata(data.value);
                } else if (data.id === 'uploadBorDocument') {
                    if (data.value.value) {
                        this.uploadBorDocument(data.value.value);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.requestUnderwriterApprovalBtn, 'isDisabled', false);
                        this.changeRef.markForCheck();
                    }
                }
                else if (data.id === 'occuranceSelectedAircraftPage') {
                    this.viewSumCoverage();
                    let planInfoArr = this.riskInfoGroup.get('plans').at(0);
                    let makeModalArr = planInfoArr.get('makeModelInfo');
                    let warOccSelected = true;
                    makeModalArr.controls.forEach(element => {
                        if (element.get('occurrenceWarLimitsCode').value) {
                            warOccSelected = false;
                        }
                    });
                    this.riskInfoGroup.get('aggregateLiabilitySCH').patchValue(warOccSelected ? 'y' : 'n');
                    this.riskInfoGroup.get('doWarOccurrenceLiabilitySCH').patchValue(warOccSelected ? 'n' : 'y');
                    this.riskInfoGroup.get('aggregateLiabilityBLK').patchValue(warOccSelected ? 'y' : 'n');
                    this.riskInfoGroup.get('doWarOccurrenceLiabilityBLK').patchValue(warOccSelected ? 'n' : 'y');
                    this.riskInfoGroup.get('aggregateLiability').patchValue(warOccSelected ? 'y' : 'n');
                    this.riskInfoGroup.get('doWarOccurrenceLiability').patchValue(warOccSelected ? 'n' : 'y');
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceNotCondition, 'condition', warOccSelected, true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceNotCondition2, 'condition', warOccSelected, true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.updateAircraftInfoModal, 'modalKey', false);
                } else if (data.id === 'servicingAgentChanged') {
                    this.servicingAgentChanged(data.value);
                }
                else if (data.id === 'otherbusinessTypeChangeId') {
                    if (data.value.innerValue) {
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.businessApplicantOthersCondition, 'condition', true);
                    } else {
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.businessApplicantOthersCondition, 'condition', false);
                    }

                } else if (data.id === 'summaryRadioChanged') {
                    this.summaryRadioChanged(data.value);
                } else if (data.id === 'makeModalIdentitficationNoChangeId') {
                    let isValid = this.validateIdentificationNo('makeModelInfo', data.value);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.makeModalIdentificationDuplicateError, 'displayFlag', !isValid);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.makeModalIdentificationDuplicateModalError, 'displayFlag', !isValid);
                    this.changeRef.markForCheck();
                } else if (data.id === 'camPayloadIdentitficationNoChangeId') {
                    let isValid = this.validateIdentificationNo('camPayloadInfo', data.value);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.camPayloadIdentificationDuplicateError, 'displayFlag', !isValid);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.camPayloadIdentificationDuplicateModalError, 'displayFlag', !isValid);
                    this.changeRef.markForCheck();
                } else if (data.id === 'sparePartIdentitficationNoChangeId') {
                    let isValid = this.validateIdentificationNo('sparePartInfo', data.value);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.sparePartIdentificationDuplicateError, 'displayFlag', !isValid);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.sparePartIdentificationDuplicateModalError, 'displayFlag', !isValid);
                    this.changeRef.markForCheck();
                } else if (data.id === 'groundEquipmentIdentitficationNoChangeId') {
                    let isValid = this.validateIdentificationNo('groundEquipmentInfo', data.value);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.groundEquipmentIdentificationDuplicateError, 'displayFlag', !isValid);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.groundEquipmentIdentificationDuplicateModalError, 'displayFlag', !isValid);
                    this.changeRef.markForCheck();
                }
                else if (data.id === 'brokerCodeChanged') {
                    this.brokerCodeChanged(data.value);
                }
                else if (data.id === 'occuranceLiabilityChanged') {
                    this.occuranceLiabilityChanged();
                }
                else if (data.id === 'warCondition') {
                    this.warCondition(data.value.index);
            }
            else if(data.id === 'commissionChanged'){
                this.commissionChanged();
            }
            }
        });
    }

    public doInitClickSub() {
        this.transactionTypeInstance.transaction.clickSub = this.transactionTypeInstance.transaction.eventHandlerService.clickSub.subscribe((data) => {
            if (data.id) {
                if (data.id === 'policytyepSelected') {
                    this.policytyepSelected(data.value);
                    this.formGroup = this.validator.setAviationQuotValidator(this.formGroup, this.usflag);
                }
                else if (data.id === 'confirmAndPay') {
                    this.quoteValidate();
                    //this.doImmediateSettlement();

                }
                else if (data.id === 'selectAllMakeModel') {

                    this.selectAllMakeModel(data.value);
                }
                else if (data.id === 'selectAllCamPayload') {

                    this.selectAllCamPayload(data.value);
                }
                else if (data.id === 'selectAllSparePart') {

                    this.selectAllSparePart(data.value);
                }
                else if (data.id === 'selectAllGroundEquipment') {

                    this.selectAllGroundEquipment(data.value);
                }
                else if (data.id === 'PolicyTypeLiaSelected') {
                    this.PolicyTypeLiaSelected(data.value);
                }
                else if (data.id === 'revisedAviaitonQuote') {
                    this.revised();
                }
                else if (data.id === 'addDrone') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', (this.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN' && this.formGroup.controls['policyInfo'].get('isScheduled').value === true) ? true : false);
                }
                else if (data.id === 'getQuickQuote') {
                    this.getQuickQuote();
                }
                else if (data.id === 'referModal') {
                    if (this.formGroup.controls['referQuotInfo'].get('referTo').value !== '') {
                        this.getUserDetails();
                    } else {
                        this.referModal = true;
                    }
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
                }
                else if (data.id === 'referModaladd') {
                    this.addUploadComponent();
                }
                else if (data.id === 'referModaldelete') {
                    this.deleteuploadDocument(data.value.index);
                }
                else if (data.id === 'viewDocument') {
                    this.viewDocument(data.value.index);
                }
                else if (data.id === 'viewDocumentFilePilotUpload') {
                    this.viewDocumentFilePilotUpload();
                }
                else if (data.id === 'downloadDocumentFilePilotUpload') {
                    this.downloadDocumentFilePilotUpload();
                }
                else if (data.id === 'successedreferModalClose') {
                    this.referModalkey = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralSuccessModalKey, 'modalKey', this.referModalkey);
                    this.navigateToHome();
                }
                else if (data.id === 'saveModal') {

                    if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                        this.saveQuott(true);
                    }

                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no')

                }
                else if (data.id === 'printDocs') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.formGroup.controls['documentInfo'].value);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoListRefer, 'valueList', this.formGroup.controls['documentInfo'].value);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocsModalKey, 'modalKey', true);
                }
                else if (data.id === 'printDocsCloseClose') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printDocsModalKey, 'modalKey', false);
                }
                else if (data.id === 'referralReasonModalKeyClose') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralReasonModalKey, 'modalKey', false);
                    this.utilsService.nextAfterSubscriptionSub.next();
                } else if (data.id === 'declineReasonModalKeyClose') {
                    this.navigateToHome()
                }
                else if (data.id === 'sendForReferral') {
                    let referInfo = new ReferTxnInfoModel(this.formBuilder);
                    let referFormGroup = referInfo.getReferTxnInfoModel()
                    referFormGroup.controls['txnId'].patchValue(this.formGroup.controls['policyInfo'].get('quoteNo').value)
                    referFormGroup.controls['txnType'].patchValue(CommonConstants.QUOTE_TXN_TYPE)
                    referFormGroup.controls['txnVerNO'].patchValue(this.formGroup.controls['policyInfo'].get('quoteVerNo').value)
                    referFormGroup.controls['productCd'].patchValue(this.formGroup.controls['policyInfo'].get('productCd').value)
                    referFormGroup.controls['reqBy'].patchValue(this.transactionTypeInstance.transaction.configService.getCustom('user_id'))
                    referFormGroup.controls['ownerId'].patchValue(this.transactionTypeInstance.transaction.configService.getCustom('user_id'))
                    referFormGroup.controls['referralStatus'].patchValue('PEN')
                    referFormGroup.controls['approver'].patchValue(this.formGroup.controls['customerInfo'].get('servicingAgentPortalId').value)
                    referFormGroup.controls['reasonForReferral'].patchValue(this.referralReasonsArray);
                    this.formGroup.controls['policyInfo'].get('referralRemarks').patchValue(this.referralReasonsArray);
                    referFormGroup.controls['customerId'].patchValue(this.formGroup.controls['customerInfo'].get('appCode').value)
                    if (this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I') {
                        referFormGroup.controls['appFullName'].patchValue(this.formGroup.controls['customerInfo'].get('appFullName').value)
                    } else if (this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O') {
                        referFormGroup.controls['appFullName'].patchValue(this.formGroup.controls['customerInfo'].get('companyName').value)
                    }
                    referFormGroup.controls['clientType'].patchValue(this.formGroup.controls['customerInfo'].get('policyHolderType').value)
                    referFormGroup.controls['submissionDate'].patchValue(this.transactionTypeInstance.transaction.todayString)

                    let referResponse = this.service.referTxn(referFormGroup.value);
                    referResponse.subscribe((referResponseData) => {
                        if (referResponseData['error'] && referResponseData.error.length > 1) {
                            this.updateErrorObject(referResponseData)
                        }
                        this.formGroup.controls['policyInfo'].get('status').patchValue('RF');
                    if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                        this.saveQuott(false);
                    }
                    this.navigateToHome()
                        
                    })
                    
                }
                else if (data.id === 'showEmailPdf') {
                    this.emailPdfDocumentView();
                }
                else if (data.id === 'showprodBrochurePdf') {
                    this.productBrochureDocumentView();
                }
                else if (data.id === 'emailModal') {
                    this.getEmailTemplate();
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailquoteMessage, 'htmlString', this.formGroup.controls['emailQuotInfo'].value.reason);
                }
                else if (data.id === 'referralHistoryModalClose') {
                    this.referralHistoryModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModalKey, 'modalKey', this.referralHistoryModal);
                }
                else if (data.id === 'referralHistory') {
                    this.referralHistoryModal = true;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModalKey, 'modalKey', this.referralHistoryModal);
                }
                else if (data.id === 'printDocuments') {
                    this.printModal = true;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
                }
                else if (data.id === 'printDocumentsClose') {
                    this.printModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
                }
                else if (data.id === 'documentQuoteView') {
                    this.quoteDocumentView(data.value);
                }
                else if (data.id === 'quoteCalculate') {
                    this.doRating();
                }
                else if (data.id === 'documentConfirmView') {
                    this.confirmDocumentView(data.value);
                }
                else if (data.id === 'addSubjectMatter') {
                    this.addSubjectMatter();
                    let riskInfo: any = this.formGroup.controls['riskInfo'];
                    if (riskInfo.at(0).get('lienHolderMakeModalSelectAll').value) {
                        var obj = {
                            innerValue: true
                        };
                        this.applyLienHolderDetailsToAllRows('makeModelInfo', obj);
                    }
                }
                else if (data.id === 'delSubjectMatter') {
                    this.delSubjectMatter(data.value);
                }
                else if (data.id === 'addSubjectMatterPayload') {
                    this.addSubjectMatterPayload();
                    let riskInfo: any = this.formGroup.controls['riskInfo'];
                    if (riskInfo.at(0).get('lienHolderCamPayloadSelectAll').value) {
                        var obj = {
                            innerValue: true
                        };
                        this.applyLienHolderDetailsToAllRows('camPayload', obj);
                    }
                }
                else if (data.id === 'delSubjectMatterPayload') {
                    this.delSubjectMatterPayload(data.value);
                }
                else if (data.id === 'addSubjectMatterSpares') {
                    this.addSubjectMatterSpares();
                    let riskInfo: any = this.formGroup.controls['riskInfo'];
                    if (riskInfo.at(0).get('lienHolderSparepartsSelectAll').value) {
                        var obj = {
                            innerValue: true
                        };
                        this.applyLienHolderDetailsToAllRows('spareParts', obj);
                    }
                }
                else if (data.id === 'delSubjectMatterSpares') {
                    this.delSubjectMatterSpares(data.value);
                }
                else if (data.id === 'addSubjectMatterGround') {
                    this.addSubjectMatterGround();
                    let riskInfo: any = this.formGroup.controls['riskInfo'];
                    if (riskInfo.at(0).get('lienHolderGroundsSelectAll').value) {
                        var obj = {
                            innerValue: true
                        };
                        this.applyLienHolderDetailsToAllRows('grounds', obj);
                    }
                }
                else if (data.id === 'addUASTraining') {
                    this.addUASTraining();
                }
                else if (data.id === 'addRecurrentFacility') {
                    this.addRecurrentFacility();
                }
                else if (data.id === 'addOperatingRow') {
                    this.addOperatingExperienceRow();
                }
                else if (data.id === 'deleteOperation') {
                    this.deleteOperatingExperienceRow(data.value);
                }
                else if (data.id === 'addPilots') {
                    this.addPilots();
                }
                else if (data.id === 'uploadFile') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.uploadFileCondition, 'condition', true);
                }
                else if (data.id === 'manuallyAddPilots') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.manuallyAddCondition, 'condition', true);
                }
                else if (data.id === 'deletePilots') {
                    this.deletePilots(data.value)
                }
                else if (data.id === 'deleteRecurrentFacility') {
                    this.deleteRecurrentFacility(data.value);
                }
                else if (data.id === 'delUASTraining') {
                    this.delUASTraining(data.value);
                }
                else if (data.id === 'delSubjectMatterGround') {
                    this.delSubjectMatterGround(data.value);
                }
                else if (data.id === 'addPlan') {
                    this.addSchedulePlan();
                }
                else if (data.id === 'addPlanBC') {
                    this.addBlanketPlan();
                }
                else if (data.id === 'addNonOwnedPlan') {
                    this.addNonOwnedPlan();
                }
                else if (data.id === 'deletePlan') {
                    this.deletePlan(data.value);
                }
                else if (data.id === 'downloadDroneFile') {
                    window.open("assets/excel/Schedule_Upload_Temp.xlsx");
                }
                else if (data.id === 'selectPlan') {
                    this.selectedPlan(data.value);
                }
                else if (data.id === 'physicalDamageClickIdMakeModel') {
                    this.uncheckSelectAllMakeModelInfo(data.value);
                }
                else if (data.id === 'physicalDamageClickIdSparePart') {
                    this.uncheckSelectAllSparePartInfo(data.value);
                }
                else if (data.id === 'physicalDamageClickIdGroundEquipment') {
                    this.uncheckSelectAllGroundEquipmentInfo(data.value);
                }
                else if (data.id === 'physicalDamageClickIdCamPayload') {
                    this.uncheckSelectAllCamPayloadInfo(data.value);
                }
                else if (data.id === 'summary') {
                    this.isCollapsedTr = !this.isCollapsedTr;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.campaignControl, 'hide', this.isCollapsedTr);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.schemeControl, 'hide', this.isCollapsedTr);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.multiProductControl, 'hide', this.isCollapsedTr);
                }
                else if (data.id === 'postOnCredit') {
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
                else if (data.id === 'quoteCalculate') {
                    if (this.transactionTypeInstance.endorsementType === 'ADD_ITEM') {
                        this.setItemNo();
                    }
                    this.doRating();
                }
                /*
                else if (data.id === 'paymentOptionModalPay') {

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
                else if (data.id === 'paymentOptionModalcancel') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.paymentoptionModal, 'modalKey', false);
                }
                */
                else if (data.id === 'referQuoteModalCancel') {
                    this.referModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
                }
                else if (data.id === 'referQuoteModalRefer') {
                    this.referQuote();
                }
                else if (data.id === 'saveModalClose') {
                    this.saveQuoteModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveQuoteModal);
                    this.navigateToHome();
                }
                else if (data.id === 'saveDeclineQ1ModalClose') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1Decline, 'modalKey', false);
                    this.navigateToHome();
                }
                else if (data.id === 'saveDeclineQ2USModalClose') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2usDecline, 'modalKey', false);
                    this.navigateToHome();
                }
                else if (data.id === 'saveDeclineQ2CAModalClose') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2caDecline, 'modalKey', false);
                    this.navigateToHome();
                }
                else if (data.id === 'closeDeclineQ1Modal') {
                    this.formGroup.controls['policyInfo'].get('coverageType').patchValue('');
                    this.formGroup.controls['policyInfo'].get('isScheduled').patchValue('');
                    this.formGroup.controls['policyInfo'].get('isBlanket').patchValue('');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1Decline, 'modalKey', false);
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2usDeclineCondition, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2Condition, 'condition', false);
                    this.formGroup.controls['policyInfo'].get('operateCommercialUs').patchValue('');
                    // this.hobbyRec('n');
                }
                else if (data.id === 'closeDeclineQ2USModal') {
                    this.formGroup.controls['policyInfo'].get('coverageType').patchValue('');
                    this.formGroup.controls['policyInfo'].get('isScheduled').patchValue('');
                    this.formGroup.controls['policyInfo'].get('isBlanket').patchValue('');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2usDecline, 'modalKey', false);
                    // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2usDeclineCondition, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2Condition, 'condition', false);
                    // this.hobbyRec('n');
                }
                else if (data.id === 'closeDeclineQ2CAModal') {
                    this.formGroup.controls['policyInfo'].get('coverageType').patchValue('');
                    this.formGroup.controls['policyInfo'].get('isScheduled').patchValue('');
                    this.formGroup.controls['policyInfo'].get('isBlanket').patchValue('');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2usDecline, 'modalKey', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2caDecline, 'modalKey', false);
                }
                else if (data.id === 'accountSearchClose') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.accountListModalKey, 'modalKey', false);
                }
                else if (data.id === 'selectAccount') {
                    let tempCustomerInfoArray = this.formGroup.get('customerInfo');
                    let accountInfoArray: FormArray = <FormArray>tempCustomerInfoArray.get('accountInfo');
                    this.formGroup.controls['customerInfo'].patchValue(accountInfoArray.at(data.value).value);
                    this.formGroup.controls['customerInfo'].get('customerName').patchValue(accountInfoArray.at(data.value).get('appFullName').value);
                    this.formGroup.controls['customerInfo'].get('postalcode').patchValue(accountInfoArray.at(data.value).get('zipCd').value);
                    this.formGroup.controls['customerInfo'].get('borRequired').patchValue(accountInfoArray.at(data.value).get('borRequired').value);
                    if (this.uwflag && this.formGroup.controls['customerInfo'].get('currentBroker').value) this.formGroup.controls['customerInfo'].get('currentBroker').patchValue(this.formGroup.controls['customerInfo'].get('currentBroker').value);
                    else this.formGroup.controls['customerInfo'].get('currentBroker').patchValue(accountInfoArray.at(data.value).get('currentBroker').value);
                    this.formGroup.controls['customerInfo'].get('introducingAgentCd').patchValue(accountInfoArray.at(data.value).get('introducingAgentCd').value);
                    this.formGroup.controls['customerInfo'].get('introducingAgentPortalId').patchValue(accountInfoArray.at(data.value).get('introducingAgentPortalId').value);
                    if (this.userRoleId === CommonConstants.BROKER_AGENT_ROLE_ID) {
                        this.validateAccount();
                    }
                    this.formGroup.controls['customerInfo'].patchValue(accountInfoArray.at(data.value).value);
                    if (accountInfoArray.at(data.value).get('servicingAgent').value) {
                        this.formGroup.controls['customerInfo'].get('servicingAgent').patchValue(accountInfoArray.at(data.value).get('servicingAgent').value);
                    } else {
                        this.formGroup.controls['customerInfo'].get('servicingAgent').patchValue('');
                    }
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.accountListModalKey, 'modalKey', false);
                    this.isCustomerRefreshed = true;
                }
                else if (data.id === 'doCustomerRefresh') {
                    if (this.isCustomerRefreshed && this.userRoleId === CommonConstants.BROKER_AGENT_ROLE_ID) {
                        this.validateAccount();
                    } else {
                        if (data.value && data.value.toString().length > 2) {
                            this.doCustomerRefresh(this.formGroup.controls['customerInfo']);
                            this.changeRef.detectChanges();
                        }
                    }
                }
                else if (data.id === 'downloadDocument') {
                    this.downloadDocument(data.value.index);
                }
                else if (data.id === 'saveQuoteModalClose') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.errorQuote, 'modalKey', false);
                    // this.navigateToHome();
                }
                else if (data.id === 'saveModalSave') {
                    this.saveQuoteModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                    this.save();
                }
                else if (data.id === 'savedModalClose') {
                    this.saveQuoteModal = false;
                    if (this.isCustomerRefreshed) {
                        this.disableCustomerInfo(this.formGroup.controls['customerInfo'], data.id);
                    }
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                }
                else if (data.id === 'emailModalClose') {
                    this.emailModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
                }
                else if (data.id === 'successedEmailModalClose') {
                    this.emailSuccessModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailSuccessModalKey, 'modalKey', this.emailSuccessModal);
                    this.changeRef.markForCheck();
                    this.navigateToHome();
                }
                else if (data.id === 'productBrochureclickId') {
                    this.productBrochureDocumentView();
                }
                else if (data.id === 'emailQuoteModalMailSend') {
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
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailSuccessModalKey, 'modalKey', this.emailSuccessModal);
                        }
                    });
                }
                else if (data.id === 'onCreditModalClose') {
                    this.onCreditModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                    this.navigateToHome();
                }
                else if (data.id === 'risk') {
                    this.addDelAdditionalInsuredInfo(data.value);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapsePolicyInfo, 'disableDelBtn', this.disableDelRisk);
                }
                else if (data.id === 'addInsuredDetail') {
                    data.value.type = 'add';
                    this.addDelAdditionalInsuredInfo(data.value);
                }
                else if (data.id === 'delInsured') {
                    data.value.type = 'del';
                    this.addDelAdditionalInsuredInfo(data.value);
                }
                else if (data.id === 'removeInsuredDetail') {
                    let riskIndex = data.value.superParentIndex !== undefined ? data.value.superParentIndex : 0;
                    let insuredIndex = data.value.parentIndex !== undefined ? data.value.parentIndex : data.value;
                    this.doRemoveInsuredList(riskIndex, insuredIndex);
                    this.transactionTypeInstance.isPolicyRatingDone = false;
                    let riskInfoArray: any = this.formGroup.controls['riskInfo'];
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                }
                else if (data.id === 'undoRemoveInsuredDetail') {
                    let riskIndex = data.value.superParentIndex !== undefined ? data.value.superParentIndex : 0;
                    let insuredIndex = data.value.parentIndex !== undefined ? data.value.parentIndex : data.value;
                    this.doUndoRemoveInsuredList(riskIndex, insuredIndex);
                    this.transactionTypeInstance.isPolicyRatingDone = false;
                    let riskInfoArray: any = this.formGroup.controls['riskInfo'];
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmOnCredit, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || !this.transactionTypeInstance.isPolicyRatingDone);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.confirmPayNow, 'isDisabled', !(this.formGroup.controls['policyInfo'].value.isPersonalInfoStatementEnabled && this.formGroup.controls['policyInfo'].value.isWarantyAndDeclarationEnabled && this.formGroup.controls['policyInfo'].value.isImportantNoticeEnabled) || this.transactionTypeInstance.transaction.isEnquiryFlag || this.transactionTypeInstance.noPaymentRequiredFlag || !this.transactionTypeInstance.isPolicyRatingDone);

                }
                else if (data.id === 'viewPlans') {
                    this.transactionTypeInstance.transaction.selectedRiskIndex = data.value;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansSectNoCompare, 'compareWith', this.transactionTypeInstance.transaction.selectedRiskIndex);
                    this.viewPlansModal = true;
                    this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                    this.changeRef.markForCheck();
                }

                else if (data.id === 'closePlanModal') {
                    this.viewPlansModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                }
                else if (data.id === 'quoteOnCreditModalNewQuote') {
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
                else if (data.id === 'doInsuredRefresh') {
                    this.doInsuredRefresh(data);
                }
                else if (data.id === 'doPolicyRatingBeforePosting') {
                    this.doPolicyRatingBeforePosting();
                }
                else if (data.id === 'agentCodeRefresh') {
                    this.getAgentCodeRefresh();
                }
                else if (data.id === 'openAircraftTablesModal') {
                    let planIndex = 0;
                    if (data.value && data.value.parentIndex !== undefined) {
                        planIndex = data.value.parentIndex;
                    }
                    this.transactionTypeInstance.transaction.selectedPlanIndex = planIndex;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.updateAircraftInfoPlanCompare, 'compareWith', this.transactionTypeInstance.transaction.selectedPlanIndex);
                    this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.updateAircraftInfoModal, 'modalKey', true);
                    let riskInfo: any = this.formGroup.controls['riskInfo'];
                    let planInfoArr = this.riskInfoGroup.get('plans').at(0);
                    let makeModalArr = planInfoArr.get('makeModelInfo');
                    let camPayloadArr = planInfoArr.get('camPayloadInfo');
                    let groundEquipmentArr = planInfoArr.get('groundEquipmentInfo');
                    let sparePartArr = planInfoArr.get('sparePartInfo');
                    for (let i = 0; i < makeModalArr.length; i++) {
                        makeModalArr.at(i).get('physicalDamage').disable();
                        makeModalArr.at(i).get('liabilityLimitsCode').disable();
                        makeModalArr.at(i).get('liabilityLimitsDesc').disable();
                        makeModalArr.at(i).get('warCode').disable();
                        makeModalArr.at(i).get('warDesc').disable();
                        makeModalArr.at(i).get('occurrenceWarLimitsCode').disable();
                        makeModalArr.at(i).get('occurrenceWarLimitsDesc').disable();
                    }
                    for (let i = 0; i < camPayloadArr.length; i++) {
                        if (camPayloadArr.at(i).get('cameraOtherPayloads').value === "" && camPayloadArr.at(i).get('identificationNumber').value === "" && (camPayloadArr.at(i).get('physicalDamageLimit').value === null || camPayloadArr.at(i).get('physicalDamageLimit').value === "")) {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.camPayLoadSummaryCondition, 'condition', false);
                        }
                        else {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.camPayLoadSummaryCondition, 'condition', true);
                        }
                        camPayloadArr.at(i).get('physicalDamage').disable();
                    }
                    for (let i = 0; i < sparePartArr.length; i++) {
                        if (sparePartArr.at(i).get('sparePart').value === "" && sparePartArr.at(i).get('identificationNumber').value === "" && (sparePartArr.at(i).get('physicalDamageLimit').value === null || sparePartArr.at(i).get('physicalDamageLimit').value === "")) {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.sparePartSummaryCondition, 'condition', false);
                        }
                        else {

                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.sparePartSummaryCondition, 'condition', true);
                        }
                        sparePartArr.at(i).get('physicalDamage').disable();
                    }

                    for (let i = 0; i < groundEquipmentArr.length; i++) {
                        if (groundEquipmentArr.at(i).get('groundEquipment').value === "" && groundEquipmentArr.at(i).get('identificationNumber').value === "" && (groundEquipmentArr.at(i).get('physicalDamageLimit').value === null || groundEquipmentArr.at(i).get('physicalDamageLimit').value === "")) {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.groundEquipmentSummaryCondition, 'condition', false);
                        }
                        else {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.groundEquipmentSummaryCondition, 'condition', true);
                        }
                        groundEquipmentArr.at(i).get('physicalDamage').disable();
                    }

                    this.changeRef.detectChanges();
                } else if (data.id === 'updateAircraftModalSave') {
                    if (this.formGroup.controls['riskInfo'].valid) {
                        this.viewSumCoverage();
                        let planInfoArr = this.riskInfoGroup.get('plans').at(this.transactionTypeInstance.transaction.selectedPlanIndex);
                        //this.transactionTypeInstance.transaction.selectedPlanIndex = 0;
                        let makeModalArr = planInfoArr.get('makeModelInfo');
                        let warOccSelected = true;
                        makeModalArr.controls.forEach(element => {
                            if (element.get('occurrenceWarLimitsCode').value) {
                                warOccSelected = false;
                            }
                        });
                        this.riskInfoGroup.get('aggregateLiabilitySCH').patchValue(warOccSelected ? 'y' : 'n');
                        this.riskInfoGroup.get('doWarOccurrenceLiabilitySCH').patchValue(warOccSelected ? 'n' : 'y');
                        this.riskInfoGroup.get('aggregateLiabilityBLK').patchValue(warOccSelected ? 'y' : 'n');
                        this.riskInfoGroup.get('doWarOccurrenceLiabilityBLK').patchValue(warOccSelected ? 'n' : 'y');
                        this.riskInfoGroup.get('aggregateLiability').patchValue(warOccSelected ? 'y' : 'n');
                        this.riskInfoGroup.get('doWarOccurrenceLiability').patchValue(warOccSelected ? 'n' : 'y');
                        // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceNotCondition, 'condition', warOccSelected, true);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceNotCondition2, 'condition', warOccSelected, true);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.updateAircraftInfoModal, 'modalKey', false);
                        //this.getUserViaJsonRating(this.transactionTypeInstance.transaction.selectedPlanIndex);
                    }
                } 
                else if (data.id === 'updateAircraftModalClose') {
                   this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.updateAircraftInfoModal, 'modalKey', false);
                }else if (data.id == 'savedQuoteModalClose') {
                    this.saveModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveModal);
                    this.navigateToHome();
                } else if (data.id == 'lienholderDetailsModalClose') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModal, 'modalKey', false);
                    this.changeRef.markForCheck();
                } else if (data.id == 'lienholderDetailsModalCloseForCamPayload') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalForCamPayload, 'modalKey', false);
                    this.changeRef.markForCheck();
                } else if (data.id == 'lienholderDetailsModalCloseForSpares') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalForSpares, 'modalKey', false);
                    this.changeRef.markForCheck();
                } else if (data.id == 'lienholderDetailsModalCloseForGrounds') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalForGrounds, 'modalKey', false);
                    this.changeRef.markForCheck();
                } else if (data.id == 'isLineHolderForMakeModal') {
                    let riskInfo: any = this.formGroup.controls['riskInfo'];
                    if (data.value.innerValue) {
                        if (data.value.index == 0) {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllCondition, 'condition', true);
                        } else {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllCondition, 'condition', false);
                            if (riskInfo.at(0).get('lienHolderMakeModalSelectAll').value) {
                                this.applyLienHolderDetailsToAllRows('makeModelInfo', data.value);
                            }
                        }
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsMakeModalInfoCondition, 'condition', true);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalCompare, 'compareWith', data.value.index);
                        this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModal, 'modalKey', true);
                        this.changeRef.markForCheck();
                    } else {
                        riskInfo.at(0).get('lienHolderMakeModalSelectAll').patchValue(false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalCompare, 'compareWith', -1);
                        this.changeRef.markForCheck();
                    }
                } else if (data.id == 'isLineHolderForCamPayload') {
                    let riskInfo: any = this.formGroup.controls['riskInfo'];
                    if (data.value.innerValue) {
                        if (data.value.index == 0) {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllConditionForCamPayload, 'condition', true);
                        } else {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllConditionForCamPayload, 'condition', false);
                            if (riskInfo.at(0).get('lienHolderCamPayloadSelectAll').value) {
                                this.applyLienHolderDetailsToAllRows('camPayload', data.value);
                            }
                        }
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalCompareForCamPayload, 'compareWith', data.value.index);
                        this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalForCamPayload, 'modalKey', true);
                        this.changeRef.markForCheck();
                    } else {
                        riskInfo.at(0).get('lienHolderCamPayloadSelectAll').patchValue(false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalCompareForCamPayload, 'compareWith', -1);
                        this.changeRef.markForCheck();
                    }
                } else if (data.id == 'isLineHolderForSpares') {
                    let riskInfo: any = this.formGroup.controls['riskInfo'];
                    if (data.value.innerValue) {
                        if (data.value.index == 0) {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllConditionForSpares, 'condition', true);
                        } else {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllConditionForSpares, 'condition', false);
                            if (riskInfo.at(0).get('lienHolderSparepartsSelectAll').value) {
                                this.applyLienHolderDetailsToAllRows('spareParts', data.value);
                            }
                        }
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalCompareForSpares, 'compareWith', data.value.index);
                        this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalForSpares, 'modalKey', true);
                        this.changeRef.markForCheck();
                    } else {
                        riskInfo.at(0).get('lienHolderSparepartsSelectAll').patchValue(false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalCompareForSpares, 'compareWith', -1);
                        this.changeRef.markForCheck();
                    }
                } else if (data.id == 'isLineHolderForGrounds') {
                    let riskInfo: any = this.formGroup.controls['riskInfo'];
                    if (data.value.innerValue) {
                        if (data.value.index == 0) {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllConditionForGrounds, 'condition', true);
                        } else {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllConditionForGrounds, 'condition', false);
                            if (riskInfo.at(0).get('lienHolderGroundsSelectAll').value) {
                                this.applyLienHolderDetailsToAllRows('grounds', data.value);
                            }
                        }
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalCompareForGrounds, 'compareWith', data.value.index);
                        this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalForGrounds, 'modalKey', true);
                        this.changeRef.markForCheck();
                    } else {
                        riskInfo.at(0).get('lienHolderGroundsSelectAll').patchValue(false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalCompareForGrounds, 'compareWith', -1);
                        this.changeRef.markForCheck();
                    }
                } else if (data.id == 'lienHolderMakeModalSelectAllChangeForMakeModal') {
                    if (data.value) {
                        this.applyLienHolderDetailsToAllRows('makeModelInfo', data.value);
                        this.changeRef.markForCheck();
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllCondition, 'condition', false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModal, 'modalKey', false);
                    }
                } else if (data.id == 'lienHolderMakeModalSelectAllChangeForCamPayload') {
                    if (data.value) {
                        this.applyLienHolderDetailsToAllRows('camPayload', data.value);
                        this.changeRef.markForCheck();
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllConditionForCamPayload, 'condition', false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalForCamPayload, 'modalKey', false);
                    }
                } else if (data.id == 'lienHolderMakeModalSelectAllChangeForSpares') {
                    if (data.value) {
                        this.applyLienHolderDetailsToAllRows('spareParts', data.value);
                        this.changeRef.markForCheck();
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllConditionForSpares, 'condition', false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalForSpares, 'modalKey', false);
                    }
                } else if (data.id == 'lienHolderMakeModalSelectAllChangeForGrounds') {
                    if (data.value) {
                        this.applyLienHolderDetailsToAllRows('grounds', data.value);
                        this.changeRef.markForCheck();
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderApplyToAllConditionForGrounds, 'condition', false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.lienholderDetailsModalForGrounds, 'modalKey', false);
                    }
                } else if (data.id == 'closeBorRequestModal') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestModal, 'modalKey', false);
                } else if (data.id == 'createReminderTaskToGetBORLetter') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestModal, 'modalKey', false);
                    this.createTask('BOR');
                } else if (data.id == 'requestChangeBrokerOfRecord') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestModal, 'modalKey', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestUploadDocModal, 'modalKey', true);
                }
                else if (data.id == 'requestUnderwriterApproval') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestUploadDocModal, 'modalKey', false);
                    this.requestUnderwriterApprovalforBor();
                } else if (data.id == 'licenseStateModalOKButtonClickID') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.licenseStateModalId, 'modalKey', false);
                    this.doLicenseStateTaskRequest();
                    this.navigateToHome();
                } else if (data.id == 'licenseStateModalCancel') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.licenseStateModalId, 'modalKey', false);
                }
                else if (data.id === 'subsidiaryOK') {
                    this.referralHistoryModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.subsidiaryInfo, 'modalKey', false);
                }
                else if (data.id === 'subsidiaryCancel') {
                    this.referralHistoryModal = false;
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.subsidiaryInfo, 'modalKey', false);
                }
                else if (data.id == 'borSucessModalClose') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestSucessModal, 'modalKey', false);
                    this.navigateToHome();
                } else if (data.id == 'borTaskSucessModalClose') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borTaskSucessModal, 'modalKey', false);
                    this.navigateToHome();
                } else if (data.id == 'slcTaskSucessModalClose') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.slcTaskSucessModal, 'modalKey', false);
                    this.navigateToHome();
                }
                else if (data.id == 'closeModal') {
                    this.navigateToHome();
                }
                else if (data.id == 'updateAircraftCloseModal') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.updateAircraftInfoModal, 'modalKey', false);
                }
                else if (data.id == 'sendQuoteToClient') {
                    this.formGroup.controls['policyInfo'].get('status').patchValue('PC');
                    if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                        this.saveQuott(true);
                    }

                }
                else if (data.id !== 'quoteOnCreditModalNewQuote') {
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
        let lobObject: any = this.transactionTypeInstance.transaction.getLOBDetailsByLOBCode()[this.productCode];
        let productCode = lobObject.productCd;
        this.productCode = productCode;
        let templateName = lobObject.templateName;
        this.userRoleId = this.transactionTypeInstance.transaction.configService.getCustom('roleId');
        if (lobObject.doShowZeroPlanPrems) this.doShowZeroPlanPrems = lobObject.doShowZeroPlanPrems;
        this.multiItemFlag = lobObject['multiItemFlag'];

        this.addBreadCrumbRoute();
        if (this.transactionTypeInstance.isPolicyFlag) this.transactionTypeInstance.overrideEndorsementElements = lobObject['overrideEndorsementElements'];
        let productJSON = this.transactionTypeInstance.getProductJSON(productCode, templateName);
        productJSON.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
            this.formData = data;
            if (this.transactionTypeInstance.hasStatusNew) {
                let defaultValues: Object = lobObject['DEFAULT_VALUES'];
                this.formGroup = this.defaultValue.setAviationQuotDefaultValues(this.formGroup, this.transactionTypeInstance.transaction.productCode, defaultValues);
                // this.setCoverDates();

                if (this.transactionTypeInstance.transaction.status === 'Enquiry') {
                    this.excessControl.disable();
                }
                this.doDisableAndEnableIfReferralApproved(false, true);
                if (this.formGroup.controls['policyInfo'].get('referralStatus').value === 'B001') {
                    this.referralAppRatingResponse = this.transactionTypeInstance.transaction.getCustom(this.transactionTypeInstance.openHeldDataStorageString);
                }
            } else {
                this.fetchOpenheldData();
                this.hobbyRecChanges(this.formGroup.controls['policyInfo'].get('hobbyRec').value);


            }
            this.transactionTypeInstance.setDeclarations();
            this.setSalesLoginValidator();
            this.getUserDetails();
            //this.getAgencyDetails();
            this.changeRef.markForCheck();
            if (productJSON.observers && productJSON.observers.length > 0) {
                productJSON.observers.pop();
            }
            this.updateElements();
        });
    }
    occuranceLiabilityChanged() {
        if (this.riskInfoGroup.get('doWarOccurrenceLiability').value === 'n') {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceNotCondition, 'condition', true);
            this.riskInfoGroup.get('aggregateLiability').patchValue('y');
         }
         else{
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceNotCondition, 'condition', false);
            this.riskInfoGroup.get('aggregateLiability').patchValue('');
       
         }
     }
    warCondition(index) {
        try {
            let planInfoArr = this.riskInfoGroup.get('plans').at(0);
            let makeModalArr = planInfoArr.get('makeModelInfo').at(index);
            makeModalArr.get('occurrenceWarLimitsCode').patchValue('1');
            makeModalArr.get('occurrenceWarLimitsDesc').patchValue('0');

            if (makeModalArr.get('warCode').value === 'A') {
                let liabilityLimitsCode = makeModalArr.get('liabilityLimitsCode').value;
                makeModalArr.get('occurrenceWarLimitsCode').patchValue(liabilityLimitsCode);
                makeModalArr.get('occurrenceWarLimitsDesc').patchValue(makeModalArr.get('liabilityLimitsDesc').value);
                makeModalArr.get('occurrenceWarLimitsCode').disable();
                makeModalArr.get('occurrenceWarLimitsDesc').disable();
                makeModalArr.get('occurrenceWarLimitsCode').updateValueAndValidity();
                makeModalArr.get('occurrenceWarLimitsDesc').updateValueAndValidity();
            }
            else if (makeModalArr.get('warCode').value === 'O') {
                makeModalArr.get('occurrenceWarLimitsCode').enable();
                makeModalArr.get('occurrenceWarLimitsDesc').enable();
            }
            else if (makeModalArr.get('warCode').value === 'N') {
                makeModalArr.get('occurrenceWarLimitsCode').patchValue('');
                makeModalArr.get('occurrenceWarLimitsDesc').patchValue('');
                makeModalArr.get('occurrenceWarLimitsCode').disable();
                makeModalArr.get('occurrenceWarLimitsDesc').disable();
                makeModalArr.get('occurrenceWarLimitsCode').updateValueAndValidity();
                makeModalArr.get('occurrenceWarLimitsDesc').updateValueAndValidity();
            }

        } catch (e) {
            this.transactionTypeInstance.transaction.logger.log(e, 'Error in Upload');
        }
    }
    commissionChanged(){
        let planInfoArr = this.riskInfoGroup.get('plans');
        let length = planInfoArr.length;
        for(let i=0;i<length;i++){
            planInfoArr = this.riskInfoGroup.get('plans').at(i);  
            let summaryInfo: FormArray = <FormArray>planInfoArr.get('summaryInfo');
            let brokerCommission = this.formGroup.controls['policyInfo'].get('brokerCommission').value;
            let bro_comm= brokerCommission.to;
            let netPremium=parseInt(summaryInfo.get('netPremium').value);
            let commission= (netPremium * bro_comm)/100;
            let grossPre= netPremium + commission;
            summaryInfo.get('commissionPrime').patchValue(commission);
            summaryInfo.get('grossPremium').patchValue(grossPre);
            summaryInfo.updateValueAndValidity();
        }
        this.changeRef.markForCheck();
        }


    hobbyRecChanges(value?) {
        let pilotRecord: FormArray = <FormArray>this.riskInfoGroup.get('pilotInfo');
        let pilotInfo = pilotRecord.at(0);
        let plans: FormArray = <FormArray>this.riskInfoGroup.get('plans');
        let planDetailsArray = plans.at(0);
        let addPilotInfo: FormArray = <FormArray>pilotInfo.get('addPilotInfo');
        let makeModelInfo: FormArray = <FormArray>planDetailsArray.get('makeModelInfo');
        let camPayloadInfo: FormArray = <FormArray>planDetailsArray.get('camPayloadInfo');
        let sparePartInfo: FormArray = <FormArray>planDetailsArray.get('sparePartInfo');
        let groundEquipmentInfo: FormArray = <FormArray>planDetailsArray.get('groundEquipmentInfo');
        let usflag: boolean = this.transactionTypeInstance.transaction.configService.getCustom('country_code') || this.transactionTypeInstance.transaction.configService.getCustom('user_branch') == "US";
        let canadaflag: boolean = this.transactionTypeInstance.transaction.configService.getCustom('country_code') || this.transactionTypeInstance.transaction.configService.getCustom('user_branch') == "CAN";
        if (value === 'n') {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagCondition, 'condition', usflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagCondition, 'condition', canadaflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagCondition1, 'condition', usflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagCondition1, 'condition', canadaflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagCondition2, 'condition', usflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagCondition2, 'condition', canadaflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1Decline, 'modalKey', false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1Conditionus, 'condition', usflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1Conditioncanada, 'condition', canadaflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.countyFlagCondition, 'condition', usflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagConditionAdditionalInsurer, 'condition', usflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagConditionAdditionalInsurer, 'condition', canadaflag);
            if (this.formGroup.controls['policyInfo'].get('operateCommercialUs').value === 'y') {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2usDecline, 'modalKey', false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2Condition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.manuallyAddCondition, 'condition', (addPilotInfo.length > 0) ? true : false);
                if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.owned, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.risNonkowned, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.overCrowds, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.listScheduledCondition, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nonOwnedPlanCondition, 'condition', false);
                    if (this.formGroup.controls['policyInfo'].get('isScheduled').value) {
                        let value = this.formGroup.controls['policyInfo'].get('isScheduled').value;
                        let disabledBlanketOpt: any[] = [
                            {
                                "value": "S",
                                "label": "NCPBtn.scheduled"
                            },
                            {
                                "value": "B",
                                "label": "NCPBtn.blanket",
                                "disabled": value
                            },
                            {
                                "value": "N",
                                "label": "NCPBtn.none"
                            }
                        ];
                        // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', data.value.innerValue == true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addDrone, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledPlanCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledUnmanned, 'radioArray', disabledBlanketOpt);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledUploadCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.partitionScheduled, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.listScheduledCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduleCovgSiCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceScheduledCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.additionalAggScheduledCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.headingScheduledCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledOrBlanketCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', ((makeModelInfo && makeModelInfo.length > 0) || (camPayloadInfo && camPayloadInfo.length > 0) || (sparePartInfo && sparePartInfo.length > 0) || (groundEquipmentInfo && groundEquipmentInfo.length > 0)) ? true : false);
                        if (value) {
                            this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isBlanket').value ? 'BOT' : 'SCH');
                        } else {
                            this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isBlanket').value ? 'BLK' : '');
                        }
                    } if (this.formGroup.controls['policyInfo'].get('isBlanket').value) {
                        let value = this.formGroup.controls['policyInfo'].get('isBlanket').value;
                        let disabledBlanketOpt: any[] = [
                            {
                                "value": "S",
                                "label": "NCPBtn.scheduled"
                            },
                            {
                                "value": "B",
                                "label": "NCPBtn.blanket",
                                "disabled": !value
                            },
                            {
                                "value": "N",
                                "label": "NCPBtn.none"
                            }
                        ];
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.overCrowds, 'condition', value === true ? true : false);
                        // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', data.value.innerValue == true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', ((makeModelInfo && makeModelInfo.length > 0) || (camPayloadInfo && camPayloadInfo.length > 0) || (sparePartInfo && sparePartInfo.length > 0) || (groundEquipmentInfo && groundEquipmentInfo.length > 0)) ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned1, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketPlanCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.fileUploadCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledUnmanned, 'radioArray', disabledBlanketOpt);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketUploadCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketUASCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketCovgSiCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceBlanketCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.additionalAggBlanketCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.headingBlanketCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledOrBlanketCondition, 'condition', value === true ? true : false);


                        if (value) {
                            this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isScheduled').value ? 'BOT' : 'BLK');
                        } else {
                            this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isScheduled').value ? 'SCH' : '');
                        }

                    }
                    this.riskInfoGroup.get('coverType').patchValue(this.formGroup.controls['policyInfo'].get('coverageType').value);
                } else if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'NON') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.owned, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.risNonkowned, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.overCrowds, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.listScheduledCondition, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nonOwnedPlanCondition, 'condition', true);
                    this.formGroup.controls['policyInfo'].get('isScheduled').patchValue(false);
                    this.formGroup.controls['policyInfo'].get('isBlanket').patchValue(false);
                    this.riskInfoGroup.get('coverType').patchValue(this.formGroup.controls['policyInfo'].get('coverageType').value);
                }
            } else if (this.formGroup.controls['policyInfo'].get('operateCommercialUs').value === 'n') {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2usDecline, 'modalKey', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2Condition, 'condition', false);
            }
            if (this.formGroup.controls['policyInfo'].get('operateCommercialCan').value) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2caDecline, 'modalKey', this.formGroup.controls['policyInfo'].get('operateCommercialCan').value === 'NO' ? true : false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2Condition, 'condition', this.formGroup.controls['policyInfo'].get('operateCommercialCan').value === 'SFOC' || this.formGroup.controls['policyInfo'].get('operateCommercialCan').value === 'Exemption for UAS 1kg or less' || this.formGroup.controls['policyInfo'].get('operateCommercialCan').value === 'Exemption for UAS greater than 1kg up to and including 25kgs' ? true : false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2caDeclineCondition, 'condition', this.formGroup.controls['policyInfo'].get('operateCommercialCan').value === 'NO' ? true : false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.manuallyAddCondition, 'condition', (addPilotInfo.length > 0) ? true : false);
                if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.owned, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.risNonkowned, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.overCrowds, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.listScheduledCondition, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nonOwnedPlanCondition, 'condition', false);
                    if (this.formGroup.controls['policyInfo'].get('isScheduled').value) {
                        let value = this.formGroup.controls['policyInfo'].get('isScheduled').value;
                        let disabledBlanketOpt: any[] = [
                            {
                                "value": "S",
                                "label": "NCPBtn.scheduled"
                            },
                            {
                                "value": "B",
                                "label": "NCPBtn.blanket",
                                "disabled": value
                            },
                            {
                                "value": "N",
                                "label": "NCPBtn.none"
                            }
                        ];
                        // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', data.value.innerValue == true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addDrone, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledPlanCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledUnmanned, 'radioArray', disabledBlanketOpt);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledUploadCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.partitionScheduled, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.listScheduledCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduleCovgSiCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceScheduledCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.additionalAggScheduledCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.headingScheduledCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledOrBlanketCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', ((makeModelInfo && makeModelInfo.length > 0) || (camPayloadInfo && camPayloadInfo.length > 0) || (sparePartInfo && sparePartInfo.length > 0) || (groundEquipmentInfo && groundEquipmentInfo.length > 0)) ? true : false);
                        if (value) {
                            this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isBlanket').value ? 'BOT' : 'SCH');
                        } else {
                            this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isBlanket').value ? 'BLK' : '');
                        }
                    } if (this.formGroup.controls['policyInfo'].get('isBlanket').value) {
                        let value = this.formGroup.controls['policyInfo'].get('isBlanket').value;
                        let disabledBlanketOpt: any[] = [
                            {
                                "value": "S",
                                "label": "NCPBtn.scheduled"
                            },
                            {
                                "value": "B",
                                "label": "NCPBtn.blanket",
                                "disabled": !value
                            },
                            {
                                "value": "N",
                                "label": "NCPBtn.none"
                            }
                        ];
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.overCrowds, 'condition', value === true ? true : false);
                        // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', data.value.innerValue == true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', ((makeModelInfo && makeModelInfo.length > 0) || (camPayloadInfo && camPayloadInfo.length > 0) || (sparePartInfo && sparePartInfo.length > 0) || (groundEquipmentInfo && groundEquipmentInfo.length > 0)) ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned1, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketPlanCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.fileUploadCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledUnmanned, 'radioArray', disabledBlanketOpt);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketUploadCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketUASCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketCovgSiCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.warOccuranceBlanketCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.additionalAggBlanketCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.headingBlanketCondition, 'condition', value === true ? true : false);
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledOrBlanketCondition, 'condition', value === true ? true : false);
                        if (value) {
                            this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isScheduled').value ? 'BOT' : 'BLK');
                        } else {
                            this.riskInfoGroup.get('subCoverType').patchValue(this.formGroup.get('policyInfo').get('isScheduled').value ? 'SCH' : '');
                        }

                    }
                    this.riskInfoGroup.get('coverType').patchValue(this.formGroup.controls['policyInfo'].get('coverageType').value);
                } else if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'NON') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.owned, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.risNonkowned, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.overCrowds, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.listScheduledCondition, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nonOwnedPlanCondition, 'condition', true);
                    this.formGroup.controls['policyInfo'].get('isScheduled').patchValue(false);
                    this.formGroup.controls['policyInfo'].get('isBlanket').patchValue(false);
                    this.riskInfoGroup.get('coverType').patchValue(this.formGroup.controls['policyInfo'].get('coverageType').value);
                }
            }
            this.pilotRecordChanges();
            this.aircraftInfoChanges();
        }
        else if (value === 'y') {
            this.formGroup.controls['policyInfo'].get('coverageType').patchValue('');
            this.formGroup.controls['policyInfo'].get('isScheduled').patchValue('');
            this.formGroup.controls['policyInfo'].get('isBlanket').patchValue('');
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2Condition, 'condition', false);
            this.formGroup.controls['policyInfo'].get('operateCommercialUs').patchValue('');
        }
    }
    aircraftInfoChanges() {
        let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        if (tempRiskArray.at(0).get('isInsuranceClaimed').value === 'y') {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuranceClaimsCondition, 'condition', true);
            tempRiskArray.at(0).get('insuranceClaimDesc').setValidators(Validators.compose([Validators.required]));
        }
        else {
            tempRiskArray.at(0).get('insuranceClaimDesc').setValidators(null);
            tempRiskArray.at(0).get('insuranceClaimDesc').patchValue('');
        }
        tempRiskArray.at(0).get('insuranceClaimDesc').updateValueAndValidity();
        if (tempRiskArray.at(0).get('isInsurerCancelled').value === 'y') {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.cancelledDeclinedCondition, 'condition', true);
            tempRiskArray.at(0).get('insurerCancelDesc').setValidators(Validators.compose([Validators.required]));
        } else {
            tempRiskArray.at(0).get('insurerCancelDesc').setValidators(null);
            tempRiskArray.at(0).get('insurerCancelDesc').patchValue('');
        }
        tempRiskArray.at(0).get('insurerCancelDesc').updateValueAndValidity();
    }
    pilotRecordChanges() {
        let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempPlanFormGroup = tempRiskArray.at(0);
        let pilotRecord: FormArray = <FormArray>tempPlanFormGroup.get('pilotInfo');
        if (pilotRecord.at(0).get('inpersonUAS').value === 'y') {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.uasCondition, 'condition', true);
        }
        if (pilotRecord.at(0).get('aircraftIncident').value === 'y') {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.airCraftsCondition, 'condition', true);
            pilotRecord.at(0).get('aircraftIncidentex').setValidators(Validators.compose([Validators.required]));
        } else {
            pilotRecord.at(0).get('aircraftIncidentex').setValidators(null);
            pilotRecord.at(0).get('aircraftIncidentex').patchValue('');
        }
        pilotRecord.at(0).get('aircraftIncidentex').updateValueAndValidity();
        if (pilotRecord.at(0).get('federalAviation').value === 'y') {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.federalAviationCondition, 'condition', true);
            pilotRecord.at(0).get('federalAviationex').setValidators(Validators.compose([Validators.required]));
        } else {
            pilotRecord.at(0).get('federalAviationex').setValidators(null);
            pilotRecord.at(0).get('federalAviationex').patchValue('');
        }
        pilotRecord.at(0).get('federalAviationex').updateValueAndValidity();
        if (pilotRecord.at(0).get('automobiledriver').value === 'y') {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.autoMobileDriverCondition, 'condition', true);
            pilotRecord.at(0).get('automobiledriverex').setValidators(Validators.compose([Validators.required]));
        } else {
            pilotRecord.at(0).get('automobiledriverex').setValidators(null);
            pilotRecord.at(0).get('automobiledriverex').patchValue('');
        }
        pilotRecord.at(0).get('automobiledriverex').updateValueAndValidity();
        if (pilotRecord.at(0).get('influenceofAlcohal').value === 'y') {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.influenceofAlcohalCondition, 'condition', true);
            pilotRecord.at(0).get('influenceofAlcohalex').setValidators(Validators.compose([Validators.required]));
        } else {
            pilotRecord.at(0).get('influenceofAlcohalex').setValidators(null);
            pilotRecord.at(0).get('influenceofAlcohalex').patchValue('');
        }
        pilotRecord.at(0).get('influenceofAlcohalex').updateValueAndValidity();
    }
    flyingTerritoryWorldSelection(value?) {
        if (this.formGroup.controls['policyInfo'].get('PolicyPurposeRow').value === 'C') {
            this.formGroup.controls['policyInfo'].get('flyingTerritoryWorld').setValue('world');
        }
        this.updateElements();
    }
    policytyepSelected(value?) {
        // this.formGroup.controls['policyInfo'].get('policyPurpose').setValue(value);
        if (this.formGroup.controls['policyInfo'].get('policyPurpose').value === 'C') {
            this.formGroup.controls['policyInfo'].get('policyPlan').setValue('a');
        }
        if (this.formGroup.controls['policyInfo'].get('policyPurpose').value === 'R') {
            this.formGroup.controls['policyInfo'].get('policyPlan').setValue('h');
        }
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyInfoCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermShort);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coverDateCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyPlan === 'a');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTermHrCondition, 'condition', this.formGroup.controls['policyInfo'].get('policyPlan').value === 'h');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.flyingTerritoryCondition, 'condition', this.formGroup.controls['policyInfo'].get('policyPlan').value === 'h');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.flyingTerritoryWorldCondition, 'condition', this.formGroup.controls['policyInfo'].get('policyPlan').value === 'a');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.recreationalCondition, 'condition', this.formGroup.controls['policyInfo'].get('policyPurpose').value === 'R');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.commercialCondition, 'condition', this.formGroup.controls['policyInfo'].get('policyPurpose').value === 'C');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTypeAnnualCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyPlan === 'a');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.certificationNumberCondition, 'condition', true);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.certificationTypeCondition, 'condition', true);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.additionalEquipmentCondition, 'condition', true);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.regionLabel, 'label', this.region);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'disableNext', !this.transactionTypeInstance.transaction.isValidForm);
        if (this.formGroup.controls['policyInfo'].get('policyPurpose').value === 'C') {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyPurpose, 'tooltipTitle', 'NCPTooltip.purposecommercial');
        } else if (this.formGroup.controls['policyInfo'].get('policyPurpose').value === 'R') {
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyPurpose, 'tooltipTitle', 'NCPTooltip.purpose');
        }
    }
    policyPlanSelected(value?) {
        if (this.formGroup.controls['policyInfo'].get('policyPlan').value === 'a') {
            this.formGroup.controls['policyInfo'].get('policyPurpose').setValue('C');
        }
        this.updateElements();
    }
    flyingTerritorySelection(value?) {
        if (this.formGroup.controls['policyInfo'].get('flyingTerritory').value === '1by2mile') {
        }
    }
    PolicyTypeLiaSelected(value?) {
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.liabilityBiPdCondition, 'condition', this.formGroup.controls['policyInfo'].value.PolicyType === 'LB');
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.enquiryFlagPlanTable, 'liabilityValue', value);
    }
    public updateElements() {
        if (this.formData) {
            if (!this.transactionTypeInstance.transaction.isEnquiryFlag && this.transactionTypeInstance.transaction.status !== 'OpenHeld') {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'nextTabButton', this.transactionTypeInstance.transaction.currentTab === '01' ? 'NCPBtn.beginSubmission' : 'NCPBtn.next');
            }
            else if (this.transactionTypeInstance.transaction.isEnquiryFlag) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'nextTabButton', 'NCPBtn.next');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.uploadFileElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.manuallyAddPilotsElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addDroneElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.uploadElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.uploadDroneElementId, 'disabledFlag', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.delSubjectMatterElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.fileUpload, 'disabledFlag', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewDocument, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addDocument, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteRecurrentFacilityElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteOperationElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deletePilotsElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.closeModalQuoteCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapsePolicyInfo, 'enableAddDelBtn', false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapsePolicyInfo, 'disableDelBtn', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.download, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.uploadDroneCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.disabledCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.fileUploadUAS, 'disabledFlag', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.downloadDoc, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deleteDocument, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.listScheduledUASElementId, 'isDisabled', true);
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.listScheduledUASElementId1, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addRecurrentFacilityElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addOperatingRowElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addPilotsElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addSubjectMatterElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addSubjectMatterPayloadElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addSubjectMatterSparesElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addSubjectMatterGroundElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addSubjectMatterElementId1, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addSubjectMatterPayloadElementId1, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addSubjectMatterSparesElementId1, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addSubjectMatterGroundElementId1, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.selectPlanElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.selectPlanElementId1, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.selectPlanElementId2, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deletePlanElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deletePlanElementId1, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deletePlanElementId2, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', this.formGroup.controls['policyInfo'].get('coverageType').value !== 'NON'? true : false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.delSubjectMatterPayloadElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.delSubjectMatterSparesElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.delSubjectMatterGroundElementId, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.delInsured, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addInsuredDetail, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.delCanInsured, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addPlan, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addPlanBC, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.addPlanNON, 'isDisabled', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalSummarySCH, 'isDisabled', true);
                let riskInfo: any = this.formGroup.controls['riskInfo'];
                let pilotRiskInfo = riskInfo.at(0).get('pilotInfo');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.businessApplicantOthersCondition, 'condition', pilotRiskInfo.at(0).get('other').value === true ? true : false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'nextTabButton', 'NCPBtn.next');
            }
            if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.uploadDroneCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.enabledCondition, 'condition', true);
            }
            if (this.transactionTypeInstance.transaction.status === 'OpenHeld') {
                let riskInfo: any = this.formGroup.controls['riskInfo'];
                let pilotRiskInfo = riskInfo.at(0).get('pilotInfo');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'nextTabButton', 'NCPBtn.next');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.businessApplicantOthersCondition, 'condition', pilotRiskInfo.at(0).get('other').value === true ? true : false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', true);
            }
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.formName, 'formName', this.formGroup);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'importantNotice', this.transactionTypeInstance.transaction.importantNotice);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'warrantyAndDeclaration', this.transactionTypeInstance.transaction.personalDataProtectionActStatement);
            // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'personalDataProtectionActStatement', this.transactionTypeInstance.transaction.warrantyAndDeclaration);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'firstHeading', this.transactionTypeInstance.transaction.firstDeclarationHeading);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'secondHeading', this.transactionTypeInstance.transaction.secondDeclarationHeading);
            // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.NCPDeclarationComponent, 'thirdHeading', this.transactionTypeInstance.transaction.thirdDeclarationHeading);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.certificationNumberCondition, 'condition', this.isPilotCertifiedChanged());
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.certificationTypeCondition, 'condition', this.isPilotCertifiedChanged());
            // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.servicingAgentCd, 'param1', this.transactionTypeInstance.transaction.configService.getCustom('user_id'));
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.servicingAgentCd, 'param2', CommonConstants.UNDER_WRITER_ROLE_ID);

            let riskInfo: any = this.formGroup.controls['riskInfo'];
            let pilotRiskInfo = riskInfo.at(0).get('pilotInfo');
            this.multicheckarray = [
                { value: 'ST', label: 'NCPBtn.student', elementControl: pilotRiskInfo.at(0).get('student') },
                { value: 'CR', label: 'NCPBtn.recreational', elementControl: pilotRiskInfo.at(0).get('recreational') },
                { value: 'PR', label: 'NCPBtn.private', elementControl: pilotRiskInfo.at(0).get('private') },
                { value: 'CP', label: 'NCPBtn.commercialpilot', elementControl: pilotRiskInfo.at(0).get('commercialpilot') },
                { value: 'AT', label: 'NCPBtn.airlineTrans', elementControl: pilotRiskInfo.at(0).get('airlineTrans') },
                { value: 'FI', label: 'NCPBtn.flightInstr', elementControl: pilotRiskInfo.at(0).get('flightInstr') }];
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.additionalpilotLabel, 'checkboxArray', this.multicheckarray);
            this.multicheckarray = [
                { value: 'ST', label: 'NCPLabel.agricultureImg', elementControl: pilotRiskInfo.at(0).get('agricultureImg') },
                { value: 'CR', label: 'NCPLabel.agricultureSpraying', elementControl: pilotRiskInfo.at(0).get('agricultureSpraying') },
                { value: 'CR', label: 'NCPLabel.dtTransfer', elementControl: pilotRiskInfo.at(0).get('dtTransfer') },
                { value: 'CR', label: 'NCPLabel.newsGather', elementControl: pilotRiskInfo.at(0).get('newsGather') },
                { value: 'CR', label: 'NCPLabel.fishSpotting', elementControl: pilotRiskInfo.at(0).get('fishSpotting') },
                { value: 'CR', label: 'NCPLabel.inspection', elementControl: pilotRiskInfo.at(0).get('inspection') },
                { value: 'CR', label: 'NCPLabel.lawEnforce', elementControl: pilotRiskInfo.at(0).get('lawEnforce') },
                { value: 'CR', label: 'NCPLabel.powerLine', elementControl: pilotRiskInfo.at(0).get('powerLine') },
                { value: 'CR', label: 'NCPLabel.movieMaking', elementControl: pilotRiskInfo.at(0).get('movieMaking') },
                { value: 'CR', label: 'NCPLabel.surveyLance', elementControl: pilotRiskInfo.at(0).get('surveyLance') },
                { value: 'CR', label: 'NCPLabel.weddingPhoto', elementControl: pilotRiskInfo.at(0).get('weddingPhoto') },
                { value: 'CR', label: 'NCPLabel.insuranceInspection', elementControl: pilotRiskInfo.at(0).get('insuranceInspection') },
                { value: 'PR', label: 'NCPLabel.other', elementControl: pilotRiskInfo.at(0).get('other'), changeId: 'otherbusinessTypeChangeId' }];
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.businessApplicantLabel, 'checkboxArray', this.multicheckarray);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.underwriterCondition, 'condition', this.userRoleId === CommonConstants.BROKER_AGENT_ROLE_ID);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.servicingAgentCd, 'param1', this.transactionTypeInstance.transaction.configService.getCustom('user_branch'));
            if (this.transactionTypeInstance.transaction.status !== 'EndEnquiry') {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteCalculate, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.PolicyAgentCondition, 'condition', this.userType === this.userTypeOperator);
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'disableNext', !this.transactionTypeInstance.transaction.isValidForm);

                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'wizardConfig', this.transactionTypeInstance.transaction.wizardConfig);
                if (this.multiItemFlag) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'disableDelBtn', this.disableDelRisk);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredPerson, 'disableDelBtn', this.disablePiolDelRisk);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.additionalEquipmentsCollapse, 'disableDelBtn', this.disableadditionalEquiDelRisk);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.occupationClassCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.designationCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableListDesignationClassDesc, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableListOccupationClassDesc, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableHeaderDesignationClass, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskInfoTableHeaderOccupationClass, 'hide', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.summaryOccupationDesignationClass, 'label', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I' ? 'NCPLabel.occupationClass' : 'NCPLabel.designation');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.summaryTableListOccupationClassDesc, 'elementFormName', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O' ? 'occupationClassDesc' : 'designationDesc');
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nomineeTabError, 'displayFlag', !this.isNomineeErrorFlag);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.multiItemCondition, 'condition', this.multiItemFlag);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewSummaryInsuredModal, 'modalKey', this.viewSummaryInsuredModal);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskCollapse, 'enableAddDelBtn', !this.transactionTypeInstance.transaction.isEnquiryFlag);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.showHideItemUploadButton, 'condition', !this.transactionTypeInstance.transaction.isEnquiryFlag);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyHolderTypeCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I');
                } else {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.travelCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermShort);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.regionCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyTerm === this.transactionTypeInstance.transaction.policyTermAnnul);

                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTypeCorporateCondition, 'condition', (this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O'));
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredlengthCondition, 'condition', this.numberofInsureds.length > 1);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.countryList, 'valueList', this.riskInfoGroup ? this.riskInfoGroup.value['travellingTo'] : null);

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
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.tripTabError, 'displayFlag', !this.tabErrorFlag && this.transactionTypeInstance.transaction.isNextFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyInfoCondition, 'condition', !this.isPolicyTypeAnnual);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTermHrCondition, 'condition', this.formGroup.controls['policyInfo'].get('policyPlan').value === 'h');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coverDateCondition, 'condition', this.formGroup.controls['policyInfo'].get('policyPlan').value === 'a');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.flyingTerritoryCondition, 'condition', this.formGroup.controls['policyInfo'].get('policyPlan').value === 'h');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.flyingTerritoryWorldCondition, 'condition', this.formGroup.controls['policyInfo'].get('policyPlan').value === 'a');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.recreationalCondition, 'condition', this.formGroup.controls['policyInfo'].get('policyPurpose').value === 'R');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.commercialCondition, 'condition', this.formGroup.controls['policyInfo'].get('policyPurpose').value === 'C');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value !== 'O');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.corporateCondition, 'condition', this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'O');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyTypeAnnualCondition, 'condition', this.formGroup.controls['policyInfo'].value.policyPlan === 'a');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.liabilityBiPdCondition, 'condition', this.formGroup.controls['policyInfo'].value.PolicyType === 'LB');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.certificationNumberCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.liabilityBiPdCondition, 'condition', this.formGroup.controls['policyInfo'].value.PolicyType === 'LB');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.certificationTypeCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.additionalEquipmentCondition, 'condition', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.campaignControl, 'hide', this.isCollapsedTr);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.schemeControl, 'hide', this.isCollapsedTr);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.multiProductControl, 'hide', this.isCollapsedTr);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalKey, 'modalKey', this.saveQuoteModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', this.saveModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalAccountButton, 'isDisabled', (this.transactionTypeInstance.transaction.isEnquiryFlag && !this.isCustomerRefreshed) || !this.formGroup.controls['policyInfo'].get('quoteNo').value);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.creditModalKey, 'modalKey', this.onCreditModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.printModalKey, 'modalKey', this.printModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.documentInfoList, 'valueList', this.docInfoList());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.enquiryFlagPlanTable, 'isEnquiryFlag', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.viewPlansModal, 'modalKey', this.viewPlansModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryDate, 'options', this.setNCPDatePickerToDateOptions());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.inceptionCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerNormalOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.expiryCoverDate, 'options', this.transactionTypeInstance.transaction.NCPDatePickerToDateAnnualOptions);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteTabError, 'displayFlag', !this.isQuoteErrorFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredTabError, 'displayFlag', !this.isInsuredErrorFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredDuplicateTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isDuplicateIDErrorFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.savePilotModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveAircraft, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveCoverageModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalKey, 'modalKey', this.referModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalKey, 'modalKey', this.emailModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModalKey, 'modalKey', this.referralHistoryModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralModalKey, 'modalKey', this.referralHistoryModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailSuccessModalKey, 'modalKey', this.emailSuccessModal);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralSuccessModalKey, 'modalKey', this.referModalkey);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkReferModalButton, 'isDisabled', !this.checkReferModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkSaveModalButton, 'isDisabled', false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.checkMailModalButton, 'isDisabled', !this.checkMailModal());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ZipCodeCondition, 'condition', this.formGroup.controls['customerInfo'].value.zipCd);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ZipCode, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ZipCode1, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.IdentityNoCondition, 'condition', this.formGroup.controls['customerInfo'].value.identityNo && this.formGroup.controls['customerInfo'].value.identityTypeDesc);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.IdentityNoButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.insuredIdentityNoButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalCondition, 'condition', this.isHolderTypeIndividual);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveCompanyNameCondition, 'condition', !this.isHolderTypeIndividual);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.toAddress, 'dropdownItems', this.transactionTypeInstance.transaction.technicalUserArray);
                //     // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.relationWithAppCode', 'param1', riskInfoFormGroup.get('travellerTypeCode').value);
                //     // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.relationWithAppCode', 'param2', this.formGroup.controls['policyInfo'].value.policyTerm);
                //     // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.relationWithAppCode', 'param3', this.formGroup.controls['customerInfo'].value.policyHolderType);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralHistInfoList, 'valueList', this.referralHistInfo);
                // this.formData = this.ncpFormService.setJsonByElementId(this.formData, '001-01-02-03-05-01', 'isDisabled', this.isReferralFlag == false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailquoteMessage, 'htmlString', this.formGroup.controls['emailQuotInfo'].value.reason);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referModalCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalQuoteCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalAccountCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalAircraftCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalPilotCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalCoverageCondition, 'condition', this.transactionTypeInstance.transaction.getIsB2B());
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
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.contactNumber, 'contactType', 'Phone');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.postalcode, 'acceptPattern', this.zipCodePattern);
            }
            if (this.transactionTypeInstance.transaction.status === 'EndEnquiry') {
            }
            if (this.transactionType === 'REN' || this.transactionTypeInstance.isRenewalFlag) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.policyAndEndtNoElementID, 'label', '   ' + this.formGroup.controls['policyInfo'].get('policyNo').value + ' - ' + this.formGroup.controls['policyInfo'].get('policyEndtNo').value);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.quoteNo, 'elementFormName', 'policyNo');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalTitle', 'NCPLabel.policySavedSuccessfully');
                this.setSelectedPlanAndPremium();
            }
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.acoountTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.pilotDuplicateTabError, 'displayFlag', !this.transactionTypeInstance.transaction.isValidForm && this.transactionTypeInstance.transaction.isNextFlag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagCondition2, 'condition', this.usflag ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1Conditionus, 'condition', this.formGroup.controls['policyInfo'].get('hobbyRec').value === 'n' && this.usflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq2Condition, 'condition', this.validateQ2Condition());
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.owned, 'condition', this.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN' ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.risNonkowned, 'condition', this.formGroup.controls['policyInfo'].get('coverageType').value === 'NON' ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.overCrowds, 'condition', this.formGroup.controls['policyInfo'].get('coverageType').value === 'NON' ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.pilotAirmanCondition, 'condition', this.usflag ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.doesTheOperatorCondition, 'condition', this.canadaflag ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.faaRegistrationCondition, 'condition', this.usflag ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coaUSCondition, 'condition', this.formGroup.controls['policyInfo'].get('coverageType').value !== 'NON' && this.usflag ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coaCANCondition, 'condition', this.formGroup.controls['policyInfo'].get('coverageType').value !== 'NON' && this.canadaflag ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coaNonOwnedCovgUSCondition, 'condition', this.formGroup.controls['policyInfo'].get('coverageType').value === 'NON' && this.usflag ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coaNonOwnedCovgCANCondition, 'condition', this.formGroup.controls['policyInfo'].get('coverageType').value === 'NON' && this.canadaflag ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledCondition, 'condition', this.formGroup.controls['policyInfo'].get('isScheduled').value === true ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.blanketCondition, 'condition', this.formGroup.controls['policyInfo'].get('isBlanket').value === true ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.transportUASCondition, 'condition', this.canadaflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.aircraftPilotPermitCondition, 'condition', this.canadaflag);
            this.updateElementsForPolicy();
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.faaRegistrationConditionUS, 'condition', this.usflag ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.maxWeightConditionUS, 'condition', this.usflag ? true : false);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.faaRegistrationConditionCAN, 'condition', this.canadaflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.federalAviationLabel, 'elementLabel', this.usflag ? "NCPLabel.federalAviation" : "NCPLabel.federalAviationCan");
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.approvedPilots, 'param1', this.transactionTypeInstance.transaction.configService.getCustom('user_branch'));
            // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.riskowned, 'condition', (this.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN') ? true : false);
            
            
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
                            this.selectedPlanPrem = this.transactionTypeInstance.transaction.amtFormat.transform(parseFloat(planObject.planPrem), []);
                        }
                    });
                }

            });
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
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['policyInfo'].valid && this.coverFromDateValidation && (this.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN' ? (this.formGroup.controls['policyInfo'].get('isScheduled').value || this.formGroup.controls['policyInfo'].get('isBlanket').value) : true);
                    this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    window.scrollTo(0, 0);
                    break;
                }
                case '02': {
                    // this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = true;
                    // this.transactionTypeInstance.transaction.isValidForm = true;
                    if (this.userRoleId == CommonConstants.BROKER_AGENT_ROLE_ID) {
                        this.validateAccount();
                    } else {
                        this.isBorRequired = false;
                    }
                    if (this.usflag && !this.isBorRequired && !this.uwflag) {
                        this.doLicenseStateCheck();
                    }
                    if (!this.usflag || this.uwflag) {
                        this.isLicenseStateCheck = true;
                    }

                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['customerInfo'].valid && this.isLicenseStateCheck && !this.isBorRequired;
                    this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    window.scrollTo(0, 0);
                    break;
                }
                case '03': {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['riskInfo'].valid;
                    this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    window.scrollTo(0, 0);
                    break;
                }
                case '04': {
                    // this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['customerInfo'].valid && this.formGroup.controls['riskInfo'].valid && this.formGroup.controls['policyInfo'].valid;
                    // this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = true;
                    // this.isInsuredErrorFlag = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = this.formGroup.controls['riskInfo'].valid;
                    this.transactionTypeInstance.transaction.isValidForm = this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation;
                    window.scrollTo(0, 0);
                    break;
                }
                case '05': {
                    this.transactionTypeInstance.transaction.wizardConfig.isValidateTabNavigation = true;
                   // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.coveragesTab, 'doValidateSubBeforeNavigation', true);
                    this.changeRef.markForCheck();
                    try {
                        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                            let roleId = this.transactionTypeInstance.transaction.configService.getCustom('roleId');
                            if (roleId) {
                                let ruleResponse = this.commonService.jsonRating(['DroneReferralAITest'], this.formGroup.getRawValue());
                                this.formGroup.controls['policyInfo'].get('roleId').patchValue(roleId);
                                ruleResponse.subscribe((data) => {
                                    if (data) {
                                        if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
                                            this.updateErrorObject(data);
                                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                                        } else {
                                            let referralStatus = data.riskInfo[0].referralStatus;
                                            let referralReason = data.riskInfo[0].referralReason;
                                            if (referralStatus === 'QuoteReferral') { //
                                                let referralModalReasonsArray = []
                                                let referralReasonsArray = [];
                                                referralReason.split(/\s*,\s*/).forEach((myString) => {
                                                    if (myString.indexOf('RF') > -1) {
                                                        if (myString === 'Q012RF' && !this.usflag) {
                                                            myString = 'Q012RF_CAN'
                                                        }
                                                        let displayObj = { 'displayString': 'NCPReferralDes.' + myString };
                                                        referralModalReasonsArray.push(displayObj);
                                                        referralReasonsArray.push(this.utilsService.getTranslated(displayObj));
                                                    }
                                                });
                                                this.formGroup.controls['policyInfo'].get('status').patchValue('RF');
                                                this.formGroup.controls['policyInfo'].get('statusDesc').patchValue('Referred');
                                                if (referralReasonsArray.length > 0) {
                                                    this.referralReasonsArray = referralReasonsArray;
                                                }
                                                if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                                                    this.saveQuott(false);
                                                }
                                                this.transactionTypeInstance.transaction.isNextFlag = false;
                                                this.transactionTypeInstance.transaction.isValidForm = false;
                                                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referralReasonModalKey, 'modalKey', true);
                                                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.referalReasonsList, 'valueList', referralReasonsArray);
                                                this.changeRef.markForCheck();
                                            } else if (referralStatus === 'QuoteDecline') {
                                                this.formGroup.controls['policyInfo'].get('status').patchValue('DC');
                                                this.formGroup.controls['policyInfo'].get('statusDesc').patchValue('Declined');
                                                let declineModalReasonsArray = [];
                                                let declineReasonsArray = [];
                                                referralReason.split(/\s*,\s*/).forEach((myString) => {
                                                    if (myString.indexOf('DC') > -1) {
                                                        let displayObj = { 'displayString': 'NCPDeclineDes.' + myString };
                                                        let translatedObj = this.utilsService.getTranslated(displayObj);
                                                        declineModalReasonsArray.push(displayObj);
                                                        declineReasonsArray.push(translatedObj);
                                                    }
                                                });
                                                if (declineReasonsArray.length > 0) {
                                                    this.formGroup.controls['policyInfo'].get('declRemarks').patchValue(declineReasonsArray);
                                                }
                                                if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                                                    this.saveQuott(false);
                                                }
                                                this.transactionTypeInstance.transaction.isNextFlag = false;
                                                this.transactionTypeInstance.transaction.isValidForm = false;
                                                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.declineReasonModalKey, 'modalKey', true);
                                                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.declineReasonsList, 'valueList', declineReasonsArray);
                                                this.transactionTypeInstance.transaction.configService.setLoadingSub('no')
                                                this.changeRef.markForCheck();
                                                window.scrollTo(0, 0);
                                            } else if (referralStatus === 'QuoteAutoApprove') {
                                                this.quoteAutoApprove();
                                            }
                                            if (ruleResponse.observers && ruleResponse.observers.length > 0) {
                                                ruleResponse.observers.pop();
                                            }

                                        }
                                    }
                                });

                            } else {
                                this.quoteAutoApprove();
                            }
                        }
                    } catch (e) {
                        this.transactionTypeInstance.transaction.logger.log(e, 'Error in Rule Set');
                    }

                    window.scrollTo(0, 0);
                    break;
                }
                default: {
                    break;
                }
            }
            this.updateElements();
        }
        //this.transactionTypeInstance.transaction.isNextFlag = !this.transactionTypeInstance.transaction.isValidForm;
    }

    public quoteAutoApprove() {
        if (this.riskInfoGroup.get('subCoverType').value === 'BOT') {
            let coveragesArray: FormArray = <FormArray>this.riskInfoGroup.get('plans');
            if (coveragesArray.at(1).get('planTypeCode').value === 'BLK') {
                let SI;
                let plan0Coverage: any = coveragesArray.at(0).get('planDetails')
                let plan1Coverage: any = coveragesArray.at(1).get('planDetails')
                for (let i = 0; i < plan0Coverage.length; i++) {
                    if (plan0Coverage.at(i).get('covgCd').value === 'TRIA') {
                        for (let j = 0; j < plan1Coverage.length; j++) {
                            if (plan1Coverage.at(j).get('covgCd').value === 'TRIA') {
                                // plan1Coverage.at(j).get('covgSi').patchValue(plan0Coverage.at(i).get('covgSi').value);
                                plan1Coverage.at(j).get('covgSi').patchValue(plan0Coverage.at(i).get('covgSiDesc').value);
                            }
                        }
                    }
                }
                this.getUserViaJsonRating(1);
            }
        } else {
            this.getUserViaJsonRating(0);
        }
        this.formGroup.controls['policyInfo'].get('status').patchValue('QT')
        this.formGroup.controls['policyInfo'].get('statusDesc').patchValue('Success')
        this.transactionTypeInstance.transaction.isNextFlag = true;
        this.transactionTypeInstance.transaction.isValidForm = true;
        this.transactionTypeInstance.transaction.isNextFlag = true;
        this.transactionTypeInstance.transaction.isValidForm = true;
        this.utilsService.nextAfterSubscriptionSub.next('')
        this.changeRef.markForCheck();
    }

    public onPrevious(event: any): void {
        this.isError = false;
        switch (event.ui.tabId) {
            case '02': {
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    this.formGroup = this.validator.clearAVIQuotValidatorsBasicDetails(this.formGroup);
                    this.transactionTypeInstance.transaction.currentTab = '01';
                    this.transactionTypeInstance.transaction.isValidForm = true;
                }
                window.scrollTo(0, 0);
                break;
            }

            case '03': {
                this.transactionTypeInstance.transaction.currentTab = '02';
                window.scrollTo(0, 0);
                break;
            }
            case '04': {
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    this.formGroup = this.validator.clearAVIRiskValidatorsBasicDetails(this.formGroup);
                    this.transactionTypeInstance.transaction.currentTab = '03';
                    this.transactionTypeInstance.transaction.isValidForm = true;
                }
                window.scrollTo(0, 0);
                break;
            }
            case '05': {
                this.transactionTypeInstance.transaction.currentTab = '04';
                window.scrollTo(0, 0);
                break;
            }
            case '06': {
                this.transactionTypeInstance.transaction.currentTab = '05';
                window.scrollTo(0, 0);
                break;
            }
            case '07': {
                this.transactionTypeInstance.transaction.currentTab = '06';
                window.scrollTo(0, 0);
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
        this.updateElements();
        this.changeRef.markForCheck();
    }
    public onNext(event: any): void {
        let source: { label: string, data: string };
        switch (event.ui.tabId) {
            case '01': {
                // if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                //     if (this.transactionTypeInstance.transaction.status !== 'EndtEnquiry') {
                //         this.transactionTypeInstance.doRating();
                //     } else {
                //         let planTempFormGroup = this.riskInfoGroup;
                //         let len = planTempFormGroup.controls['plans'].length;
                //         if (this.riskInfoGroup.get('displayPlanTypeCode').value === 'VP1' || this.riskInfoGroup.get('displayPlanTypeCode').value === 'VM1') {
                //             if (len > 0) {
                //                 while (len > 1) {
                //                     len--;
                //                     if (planTempFormGroup.controls['plans'].at(len).get('planTypeCode').value && planTempFormGroup.controls['plans'].at(len).get('planTypeCode').value !== 'VP1') {
                //                         planTempFormGroup.controls['plans'].removeAt(len);
                //                     }
                //                 }
                //             }
                //             this.quoteCalculate(true, true);
                //         } else {
                //             this.quoteCalculate(true, false);
                //         }
                //     }
                // }
                if (this.transactionTypeInstance.hasStatusNew) {
                    if (this.riskInfoGroup.get('plans').length <= 1) {
                        this.riskInfoGroup.get('plans').removeAt(0);
                        let i = 0;
                        this.riskInfoGroup.get('plans').push(this.transactionTypeInstance.transaction.plans.getAVIPlanInfoModel());
                        if (this.riskInfoGroup.get('subCoverType').value === 'BOT') {
                            i = 1;
                            this.riskInfoGroup.get('plans').push(this.transactionTypeInstance.transaction.plans.getAVIPlanInfoModel());
                            this.riskInfoGroup.get('plans').at(0).get('planTypeCode').patchValue('SCH');
                            this.riskInfoGroup.get('plans').at(0).get('planTypeDesc').patchValue('Plan1');
                            this.riskInfoGroup.get('plans').at(i).get('planTypeCode').patchValue('BLK');
                            this.riskInfoGroup.get('plans').at(i).get('planTypeDesc').patchValue('Plan1');
                        }
                        else {
                            if (this.riskInfoGroup.get('subCoverType').value !== 'BLK' && this.riskInfoGroup.get('subCoverType').value !== 'NON') {
                                this.riskInfoGroup.get('plans').at(0).get('planTypeCode').patchValue('SCH');
                                this.riskInfoGroup.get('plans').at(0).get('planTypeDesc').patchValue('Plan1');
                            }
                            if (this.riskInfoGroup.get('subCoverType').value !== 'SCH' && this.riskInfoGroup.get('subCoverType').value !== 'NON') {
                                this.riskInfoGroup.get('plans').at(i).get('planTypeCode').patchValue('BLK');
                                this.riskInfoGroup.get('plans').at(i).get('planTypeDesc').patchValue('Plan1');
                            }
                            if (this.riskInfoGroup.get('subCoverType').value !== 'BLK' && this.riskInfoGroup.get('subCoverType').value !== 'SCH') {
                                this.riskInfoGroup.get('plans').at(i).get('planTypeCode').patchValue('NON');
                                this.riskInfoGroup.get('plans').at(i).get('planTypeDesc').patchValue('Plan1');
                            }
                        }
                        this.changeRef.detectChanges();
                        let planData: any = this.riskInfoGroup.get('plans');
                        planData.controls.forEach(data => {
                            this.doPopulatePlanDetailsWithDefaultValues(data);
                        })
                    }
                }
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    this.formGroup = this.validator.setQuoteCustomerInfoValidator(this.formGroup, this.userRoleId);
                }
                if (!this.transactionTypeInstance.transaction.isEnquiryFlag && this.transactionTypeInstance.transaction.status !== 'OpenHeld') {
                    this.createQuote();
                }
                if (this.transactionTypeInstance.transaction.isEnquiryFlag) {
                    this.pushTabHeaderDetails();
                }
                this.getAgencyDetails();
                this.transactionTypeInstance.transaction.currentTab = '02';

                let tabInfoArray = <FormArray>this.formGroup.controls['tabInfo']

                for (let j = 0; j < tabInfoArray.length; j++) {
                    tabInfoArray.at(j).get('currentIndex').patchValue(Number(event.ui.tabId))
                }

                this.updateElements();
                this.getdocumentInfo();
                window.scrollTo(0, 0);
                break;
            }
            case '02': {
                if (this.isNewCustomer) {
                    if (this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'I') {
                        this.formGroup.controls['customerInfo'].get('appFullName').patchValue(this.formGroup.controls['customerInfo'].get('customerName').value);
                    } else if (this.formGroup.controls['customerInfo'].get('policyHolderType').value === 'C') {
                        this.formGroup.controls['customerInfo'].get('companyName').patchValue(this.formGroup.controls['customerInfo'].get('customerName').value)
                    }
                    this.createAndSaveCustomer(true);
                }

                this.operationMultciheckarray = [
                    { value: '1', label: 'NCPLabel.sectionOne', elementControl: this.riskInfoGroup.get('sectionOne') },
                    { value: '2', label: 'NCPLabel.sectionTwo', elementControl: this.riskInfoGroup.get('sectionTwo') },
                    { value: '3', label: 'NCPLabel.sectionThree', elementControl: this.riskInfoGroup.get('sectionThree') },
                    { value: '4', label: 'NCPLabel.sectionFour', elementControl: this.riskInfoGroup.get('sectionFour') },
                    { value: '5', label: 'NCPLabel.sectionFive', elementControl: this.riskInfoGroup.get('sectionFive') },
                    { value: '6', label: 'NCPLabel.sectionSix', elementControl: this.riskInfoGroup.get('sectionSix') },
                    { value: '7', label: 'NCPLabel.sectionSeven', elementControl: this.riskInfoGroup.get('sectionSeven') },
                    { value: '8', label: 'NCPLabel.sectionEight', elementControl: this.riskInfoGroup.get('sectionEight') },
                    { value: '9', label: 'NCPLabel.sectionNine', elementControl: this.riskInfoGroup.get('sectionNine') },
                    { value: '10', label: 'NCPLabel.sectionTen', elementControl: this.riskInfoGroup.get('sectionTen') },
                    { value: '11', label: 'NCPLabel.sectionEleven', elementControl: this.riskInfoGroup.get('sectionEleven') },
                    { value: '12', label: 'NCPLabel.sectionTwelve', elementControl: this.riskInfoGroup.get('sectionTwelve') }];
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planToFlyUS, 'checkboxArray', this.operationMultciheckarray);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planToFlyUSNonOwned, 'checkboxArray', this.operationMultciheckarray);

                this.operationCanadaMultciheckarray = [
                    { value: '1', label: 'NCPLabel.movingVehicleOrAircraft', elementControl: this.riskInfoGroup.get('movingVehicleOrAircraft') },
                    { value: '2', label: 'NCPLabel.nightTimeOperations', elementControl: this.riskInfoGroup.get('nightTimeOperations') },
                    { value: '3', label: 'NCPLabel.beyondVisualSight', elementControl: this.riskInfoGroup.get('beyondVisualSight') },
                    { value: '4', label: 'NCPLabel.visualObserver', elementControl: this.riskInfoGroup.get('visualObserver') },
                    { value: '5', label: 'NCPLabel.pilotOperating', elementControl: this.riskInfoGroup.get('pilotOperating') },
                    { value: '6', label: 'NCPLabel.operationsOverPeople', elementControl: this.riskInfoGroup.get('operationsOverPeople') },
                    { value: '7', label: 'NCPLabel.operationsInAirspace', elementControl: this.riskInfoGroup.get('operationsInAirspace') },
                    { value: '8', label: 'NCPLabel.operationsAtGroundSpeed', elementControl: this.riskInfoGroup.get('operationsAtGroundSpeed') },
                    { value: '9', label: 'NCPLabel.operatingAtAltitude', elementControl: this.riskInfoGroup.get('operatingAtAltitude') },
                    { value: '10', label: 'NCPLabel.operatingWithLessThanTwo', elementControl: this.riskInfoGroup.get('operatingWithLessThanTwo') }];
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planToFlyCanadaId, 'checkboxArray', this.operationCanadaMultciheckarray);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.planToFlyCanadaIdNonOwned, 'checkboxArray', this.operationCanadaMultciheckarray);
                if (this.usflag) {
                    let riskInfoArray: any = this.formGroup.controls['riskInfo'];
                    let overCrowds = riskInfoArray.at(0).get('overCrowds');
                    if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'NON') {
                        overCrowds.patchValue('');
                    }
                }
                if (this.transactionTypeInstance.transaction.isEnquiryFlag) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.fileUploadUAS, 'disabledFlag', true);
                }
                let tempCustomerInfoArray = this.formGroup.get('customerInfo');
                            let accountInfoArray: FormArray = <FormArray>tempCustomerInfoArray.get('accountInfo');
                            let currentAccountInfoArrayLength = accountInfoArray.length;
                            for (let i = 0;i<currentAccountInfoArrayLength;i++) {
                                accountInfoArray.removeAt(i);
                            }
                            
                                accountInfoArray.push(this.transactionTypeInstance.transaction.customerInfo.getCustomerInfoModel());
                           
                            
                this.transactionTypeInstance.transaction.currentTab = '03';
                let tabInfoArray = <FormArray>this.formGroup.controls['tabInfo']

                for (let j = 0; j < tabInfoArray.length; j++) {
                    tabInfoArray.at(j).get('currentIndex').patchValue(Number(this.transactionTypeInstance.transaction.currentTab) - 1)
                }
                window.scrollTo(0, 0);
                break;
            }
            case '03': {
                // if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                //     this.setKeysForPilot();
                //     this.setKeysForPreviousInsurer();
                //     this.transactionTypeInstance.transaction.currentTab = '04';
                // }
                if (this.transactionTypeInstance.transaction.status !== 'Enquiry') {
                    this.formGroup = this.validator.setQuoteRiskValidatorBasicDetails(this.formGroup);
                }
                if (this.usflag) {
                    let riskInfoArray: any = this.formGroup.controls['riskInfo'];
                    for (let i = 0; i < riskInfoArray.length; i++) {
                        let pilotName: FormArray = <FormArray>riskInfoArray.at(i).get('pilotInfo');
                        for (let j = 0; j < pilotName.length; j++) {
                            pilotName.at(j).get('pilotName').setValidators(null);
                            pilotName.at(j).get('pilotName').updateValueAndValidity();
                        }
                    }
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.pilotNameLabel, 'mandatoryFlag', false);
                }
                let riskInfo: any = this.formGroup.controls['riskInfo'];
                let planInfoArr = this.riskInfoGroup.get('plans').at(0);
                let makeModalArr = planInfoArr.get('makeModelInfo');
                for(let i=0;i<makeModalArr.length;i++){
                    let uasValue = makeModalArr.at(i).get('makeDesc').value + ' '+ makeModalArr.at(i).get('modelDesc').value + ' ' + makeModalArr.at(i).get('year').value;
                makeModalArr.at(i).get('uas').patchValue(uasValue);  
                   
                }
                
                let camPayloadArr = planInfoArr.get('camPayloadInfo');
                let groundEquipmentArr = planInfoArr.get('groundEquipmentInfo');
                let sparePartArr = planInfoArr.get('sparePartInfo');
                for(let i=0;i<camPayloadArr.length;i++){
                    if(camPayloadArr.at(i).get('cameraOtherPayloads').value ==="" && camPayloadArr.at(i).get('identificationNumber').value ==="" && (camPayloadArr.at(i).get('physicalDamageLimit').value === null || camPayloadArr.at(i).get('physicalDamageLimit').value === "" ) ){
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.camPayLoadCondition, 'condition',  false);
                    }
                    else{
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.camPayLoadCondition, 'condition',  true);
                    }
                }
                for(let i=0;i<sparePartArr.length;i++){
                    if(sparePartArr.at(i).get('sparePart').value ==="" && sparePartArr.at(i).get('identificationNumber').value ==="" && (sparePartArr.at(i).get('physicalDamageLimit').value === null || sparePartArr.at(i).get('physicalDamageLimit').value === "" )  ){
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.sparePartCondition, 'condition',  false);
                    }
                    else{
                        
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.sparePartCondition, 'condition',  true);
                    }
                }
               
                for(let i=0;i<groundEquipmentArr.length;i++){
                    if(groundEquipmentArr.at(i).get('groundEquipment').value ==="" && groundEquipmentArr.at(i).get('identificationNumber').value ==="" && (groundEquipmentArr.at(i).get('physicalDamageLimit').value === null || groundEquipmentArr.at(i).get('physicalDamageLimit').value === "" ) ){
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.groundEquipmentCondition, 'condition',  false);
                    }
                    else{                        
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.groundEquipmentCondition, 'condition',  true);
                    }
                }
                
                let pilotRiskInfo = riskInfo.at(0).get('pilotInfo');
                pilotRiskInfo.at(0).get('appFullName').patchValue('');
                if (this.riskInfoGroup.get('subCoverType').value === 'BOT') {
                    this.riskInfoGroup.get('plans').at(1).get('numberUASCode').patchValue(this.riskInfoGroup.get('plans').at(0).get('numberUASCode').value);
                }
                this.transactionTypeInstance.transaction.currentTab = '04';

                let tabInfoArray = <FormArray>this.formGroup.controls['tabInfo']
                for (let j = 0; j < tabInfoArray.length; j++) {
                    tabInfoArray.at(j).get('currentIndex').patchValue(Number(event.ui.tabId))
                }
                window.scrollTo(0, 0);
                break;
            }
            case '04': {
                this.viewSumCoverage();
                if (this.formGroup.controls['policyInfo'].get('isScheduled').value && this.formGroup.controls['policyInfo'].get('isBlanket').value) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledOrBlanketCondition, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledAndBlanketCondition, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.listScheduledCondition, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nonOwnedCondition, 'condition', false);
                    this.changeRef.markForCheck();
                } else {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledOrBlanketCondition, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledAndBlanketCondition, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nonOwnedCondition, 'condition', false);
                    this.changeRef.markForCheck();
                }
                if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'NON') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.nonOwnedCondition, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledOrBlanketCondition, 'condition', false);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.scheduledAndBlanketCondition, 'condition', false);

                }
               let tabInfoArray = <FormArray>this.formGroup.controls['tabInfo']
                for (let j = 0; j < tabInfoArray.length; j++) {
                    tabInfoArray.at(j).get('currentIndex').patchValue(Number(event.ui.tabId))
                }
                this.transactionTypeInstance.transaction.currentTab = '05';
                window.scrollTo(0, 0);
                break;
            }
            case '05': {
                this.viewSumCoverage();
                let tabInfoArray = <FormArray>this.formGroup.controls['tabInfo']
                for (let j = 0; j < tabInfoArray.length; j++) {
                    tabInfoArray.at(j).get('currentIndex').patchValue(Number(event.ui.tabId))
                }
                let tempRiskArray: any = this.formGroup.get('riskInfo');
                let tempPlanFormGroup = tempRiskArray.at(0);
                let coveragesArray = tempPlanFormGroup.get('plans');
                for (let i = 0; i < coveragesArray.length; i++) {
                    if (coveragesArray.at(i).get('planTypeCode').value === 'SCH') {
                        let summaryGroup = coveragesArray.at(i).get('summaryInfo');
                        summaryGroup.get('alternateDescription').disable();
                        break;
                    }
                }
                for (let i = 0; i < coveragesArray.length; i++) {
                    if (coveragesArray.at(i).get('planTypeCode').value === 'BLK') {
                        let summaryGroup = coveragesArray.at(i).get('summaryInfo');
                        summaryGroup.get('alternateDescription').disable();
                        break;
                    }
                }
                break;
            }
            default: {
                break;
            }
        }
        if (event.ui.tabId !== '01' && !this.transactionTypeInstance.transaction.isEnquiryFlag) {
            this.saveQuott(false);
        }
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModal, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.formGroup.controls['policyInfo'].get('quoteNo').value);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.formGroup.controls['policyInfo'].get('quoteNo').value);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.emailQuoteModalButton, 'isDisabled', this.transactionTypeInstance.transaction.isEnquiryFlag || !this.formGroup.controls['policyInfo'].get('quoteNo').value);
    }
    public onTabChange(): void {

    }

    pushTabHeaderDetails() {
        let source: any = {};
        source.label = 'Submission #:';
        source.data = this.formGroup.controls['policyInfo'].get('quoteNo').value;
        let tabInfoGroup: any = this.formGroup.controls['tabInfo'];
        this.pushDataToModelArray(tabInfoGroup.at(0).get('headerContentInfo'), this.transactionTypeInstance.transaction.tabInfo.getHeaderContentInfo(), source, true);
        source = {};
        source.label = 'Coverage Type: ';
        let subCovgType: string = source.data = this.riskInfoGroup.get('subCoverType').value;
        if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN') {
            switch (subCovgType) {
                case 'SCH': {
                    source.data = 'SCHEDULED'
                    break;
                }
                case 'BLK': {
                    source.data = 'BLANKET'
                    break;
                }
                case 'BOT': {
                    source.data = 'SCHEDULED | BLANKET'
                    break;
                }
            }
        } else {
            source.data = 'NON OWNED'
        }
        this.pushDataToModelArray(tabInfoGroup.at(0).get('headerContentInfo'), this.transactionTypeInstance.transaction.tabInfo.getHeaderContentInfo(), source, true);
        source = {};
        source.label = 'Coverage Date:';
        source.data = this.formGroup.controls['policyInfo'].get('inceptionDt').value + ' - ' + this.formGroup.controls['policyInfo'].get('expiryDt').value;
        this.pushDataToModelArray(tabInfoGroup.at(0).get('headerContentInfo'), this.transactionTypeInstance.transaction.tabInfo.getHeaderContentInfo(), source, true);

        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.ng2Wizard, 'headerInputs', tabInfoGroup.at(0).get('headerContentInfo').value);
        // - Tab header Inputs
        this.changeRef.markForCheck();
        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
    }

    isPilotCertifiedChanged() {
        let tempFormGroup;
        let riskInfoArray: any = this.formGroup.controls['riskInfo'];
        let travellerType = riskInfoArray.at(0);
        tempFormGroup = travellerType;
        let aviationPilotVOListArray: any = tempFormGroup.controls['pilotInfo'];
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.certificationNumberCondition, 'condition', aviationPilotVOListArray.at(0).get('isPilotCertified').value);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.certificationTypeCondition, 'condition', aviationPilotVOListArray.at(0).get('isPilotCertified').value);
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
            let noofDaysTime = (1000 * 60 * 60 * 24 * 366) - (1000 * 60 * 60 * 24);
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
        // if (this.transactionTypeInstance.transaction.isEnquiryFlag === false) {
        this.formGroup.controls['policyInfo'].get('expiryDt').disable();
        // }
    }
    coverDateChanged(event?: any) {
        super.coverDateChanged();
    }
    public noOfDaysTravellingUpdate(dataValInputForm) {
        this.formGroup.controls['policyInfo'].get('durationInDays').patchValue(365);
        this.formGroup.controls['policyInfo'].get('durationInDays').updateValueAndValidity();
    }

    getUserDetails() {
        let userdetailsdata = {
            country_code: this.transactionTypeInstance.transaction.configService.getCustom('country_code') || this.transactionTypeInstance.transaction.configService.getCustom('user_branch'),
            roleId: this.transactionTypeInstance.transaction.configService.getCustom('roleId')
        };
        if (userdetailsdata.country_code == "US") {
            this.usflag = true;
        } else {
            this.canadaflag = true;
        }
        if (userdetailsdata.roleId == "EMP") {
            this.uwflag = true;
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.brokerListCondition, 'condition', this.uwflag);
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.broker, 'param1', this.transactionTypeInstance.transaction.configService.getCustom('user_branch'));
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.broker, 'param2', CommonConstants.BROKER_AGENT_ROLE_ID);

        }
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
    public addDelAdditionalInsuredInfo(data) {
        let additionalInsuredListInfoArray: FormArray = <FormArray>this.formGroup.controls['customerInfo'].get('additionalInsurerList');
        if (data.type === 'add') {
            let additionalInsurerInfoModel = this.transactionTypeInstance.transaction.avaitaionOther.getAdditionalInsurerInfomodel();
            additionalInsuredListInfoArray.push(this.validator.setAdditionalInsuredListValidator(additionalInsurerInfoModel));
        }
        if (data.type === 'del') {
            if (additionalInsuredListInfoArray.length > 1) {
                additionalInsuredListInfoArray.removeAt(data.index);
            }
        }
        if (additionalInsuredListInfoArray.length > 1) {
            this.disableDelRisk = true;
        } else {
            this.disableDelRisk = false;
        }
        this.setKeysForAdditionalInsurer();
    }
    public addDelAviRiskInfo(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        let tempFormGroup = tempRiskInfoArray.at(data.parentIndex);
        let tempInsuredArray = <FormArray>tempFormGroup.get('pilotInfo');
        if (data.type === 'add') {
            let riskInfoModel = this.transactionTypeInstance.transaction.avipilot.getPilotInfo();
            // if (this.transactionTypeInstance.endtReasonCode === this.transactionTypeInstance.transaction.configService.getCustom('NCPENDT')) {
            //     riskInfoModel.get('isItemAdded').patchValue(true);
            //     riskInfoModel.get('isItemDeleted').patchValue(false);
            // }
            tempInsuredArray.push(this.validator.setPilotInsuredValidator(riskInfoModel));
        }
        if (data.type === 'del') {
            tempInsuredArray.removeAt(data.index);
        }
        if (tempInsuredArray.length > 1) {
            this.disablePiolDelRisk = true;
        } else {
            this.disablePiolDelRisk = false;
        }
        this.setKeysForPilot();
    }
    public setKeysForAdditionalInsurer() {
        let tempRiskInfoArray: FormGroup = <FormGroup>this.formGroup.get('customerInfo');
        let additionalInsurerList: FormArray = <FormArray>tempRiskInfoArray.controls['additionalInsurerList'];
        // let previousInsurerList: FormArray = <FormArray>riskElement.get('previousInsurerList');
        additionalInsurerList.controls.forEach((ele, index) => {
            let appFName = ele.get('firstName').value;
            let appLName = ele.get('lastName').value;
            let appFullName = appFName + ' ' + appLName;
            ele.get('appFullName').setValue(appFullName);
            ele.get('key').setValue((index + 1).toString());
        });
    }
    public setKeysForPilot() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        tempRiskInfoArray.controls.forEach(riskElement => {
            let aviationPilotVOList: FormArray = <FormArray>riskElement.get('pilotInfo');
            aviationPilotVOList.controls.forEach((ele, index) => {
                let appFName = ele.get('pilotFName').value;
                let appLName = ele.get('pilotLName').value;
                let appFullName = appFName + ' ' + appLName;
                ele.get('appFullName').setValue(appFullName);
                ele.get('key').setValue((index + 1).toString());
            });
        });
    }
    setItemNo() {
        let riskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        riskArray.controls.forEach((element, i) => {
            i = i + 1;
            if (i < 10) {
                element.get('itemNo').setValue('0000' + i.toString());
            } else {
                element.get('itemNo').setValue('000' + i.toString());
            }
            element.get('sectNo').setValue('01');
            element.get('key').setValue(element.get('itemNo').value + element.get('sectNo').value);
            element.get('sectCl').patchValue(this.productCode);
            element.get('travellerTypeCode').patchValue(riskArray.at(0).get('travellerTypeCode').value);
            element.get('travellerTypeDesc').patchValue('Individual');
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
                let customerInfo: FormArray = <FormArray>this.formGroup.controls['customerInfo'];
                let additionalInsurerListGroup: FormArray = <FormArray>customerInfo.get('additionalInsurerList');
                for (let i = 1; i < dataInput.customerInfo.additionalInsurerList.length; i++) {
                    additionalInsurerListGroup.push(this.transactionTypeInstance.transaction.avaitaionOther.getAdditionalInsurerInfomodel())
                    additionalInsurerListGroup.at(i).patchValue(dataInput.customerInfo.additionalInsurerList[i]);
                }
                this.formGroup.controls['customerInfo'].updateValueAndValidity();
            }
        }
        if (dataInput.policyInfo !== null && dataInput.policyInfo !== undefined) {
            this.formGroup.controls['policyInfo'].patchValue(dataInput.policyInfo);
            this.formGroup.controls['policyInfo'].updateValueAndValidity();
        }
        // let isCalledOnlyForEndorsement = this.transactionTypeInstance.isPolicyFlag && !this.transactionTypeInstance.isPolicyHeld;
        let isCalledOnlyForEndorsement = this.transactionTypeInstance.isPolicyFlag;
        // this.formGroup.controls['riskInfo'] = this.updatePlanDatas(dataInput, isCalledOnlyForEndorsement);
        this.updateRiskInfo(dataInput)
        this.updatePilotInfo(dataInput);
        this.updateTabInfo(dataInput)
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
    updateRiskInfo(dataInput) {
        let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        for (let j = 0; j < tempRiskArray.value.length; j++) {
            tempRiskArray.removeAt(j);
        }
        for (let i = 0; i < dataInput.riskInfo.length; i++) {
            tempRiskArray.push(this.transactionTypeInstance.transaction.riskInfo.getAVIRiskInfoInfoModel());
            let tempPlanFormGroup = tempRiskArray.at(i);
            let plans: FormArray = <FormArray>tempPlanFormGroup.get('plans');
            for (let j = 0; j < plans.length; j++) {
                plans.removeAt(j);
            }
            for (let k = 0; k < dataInput.riskInfo[i].plans.length; k++) {
                plans.push(this.transactionTypeInstance.transaction.plans.getAVIPlanInfoModel());
                let planDetailsArray = plans.at(k);
                let makeModelInfo: FormArray = <FormArray>planDetailsArray.get('makeModelInfo');
                let camPayloadInfo: FormArray = <FormArray>planDetailsArray.get('camPayloadInfo');
                let sparePartInfo: FormArray = <FormArray>planDetailsArray.get('sparePartInfo');
                let groundEquipmentInfo: FormArray = <FormArray>planDetailsArray.get('groundEquipmentInfo');
                let planDetails: FormArray = <FormArray>planDetailsArray.get('planDetails');
                for (let j = 0; j < planDetails.length; j++) {
                    planDetails.removeAt(j);
                }
                for (let j = 0; j < dataInput.riskInfo[i].plans[k].planDetails.length; j++) {
                    planDetails.push(this.transactionTypeInstance.transaction.planDetail.getAVIPlanDetailsInfoModel());
                }
                planDetails.patchValue(dataInput.riskInfo[i].plans[k].planDetails);
                for (let j = 0; j < makeModelInfo.length; j++) {
                    makeModelInfo.removeAt(j);
                }
                for (let j = 0; j < dataInput.riskInfo[i].plans[k].makeModelInfo.length; j++) {
                    makeModelInfo.push(this.transactionTypeInstance.transaction.plans.getmakeModelInfoModel());
                }
                makeModelInfo.patchValue(dataInput.riskInfo[i].plans[k].makeModelInfo);
                for (let j = 0; j < camPayloadInfo.length; j++) {
                    camPayloadInfo.removeAt(j);
                }
                for (let j = 0; j < dataInput.riskInfo[i].plans[k].camPayloadInfo.length; j++) {
                    camPayloadInfo.push(this.transactionTypeInstance.transaction.plans.getcamPayloadInfoModel());
                }
                camPayloadInfo.patchValue(dataInput.riskInfo[i].plans[k].camPayloadInfo);
                for (let j = 0; j < sparePartInfo.length; j++) {
                    sparePartInfo.removeAt(j);
                }
                for (let j = 0; j < dataInput.riskInfo[i].plans[k].sparePartInfo.length; j++) {
                    sparePartInfo.push(this.transactionTypeInstance.transaction.plans.getsparePartInfoModel());
                }
                sparePartInfo.patchValue(dataInput.riskInfo[i].plans[k].sparePartInfo);
                for (let j = 0; j < groundEquipmentInfo.length; j++) {
                    groundEquipmentInfo.removeAt(j);
                }
                for (let j = 0; j < dataInput.riskInfo[i].plans[k].groundEquipmentInfo.length; j++) {
                    groundEquipmentInfo.push(this.transactionTypeInstance.transaction.plans.getgroundEquipmentInfoModel());
                }
                groundEquipmentInfo.patchValue(dataInput.riskInfo[i].plans[k].groundEquipmentInfo);
            }
            plans.patchValue(dataInput.riskInfo[i].plans);
            plans.updateValueAndValidity();
            tempPlanFormGroup.patchValue(plans);
            tempPlanFormGroup.updateValueAndValidity();
        }
        tempRiskArray.patchValue(dataInput.riskInfo);
        tempRiskArray.updateValueAndValidity();
    }

    updateTabInfo(dataInput) {
        /*   let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
  
          updateTabInfo */
    }

    updatePilotInfo(dataInput) {
        let tempRiskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        for (let i = 0; i < dataInput.riskInfo.length; i++) {
            let tempPlanFormGroup = tempRiskArray.at(i);
            let pilotInfo: FormArray = <FormArray>tempPlanFormGroup.get('pilotInfo');
            for (let j = 0; j < pilotInfo.length; j++) {
                pilotInfo.removeAt(j);
            }
            for (let k = 0; k < dataInput.riskInfo[i].pilotInfo.length; k++) {
                pilotInfo.push(this.transactionTypeInstance.transaction.avipilot.getPilotInfo());
                let tempPilotInfo = pilotInfo.at(k);
                let recurrentInfo: FormArray = <FormArray>tempPilotInfo.get('recurrentInfo');
                let operatingInfo: FormArray = <FormArray>tempPilotInfo.get('operatingInfo');
                let addPilotInfo: FormArray = <FormArray>tempPilotInfo.get('addPilotInfo');
                for (let j = 0; j < recurrentInfo.length; j++) {
                    recurrentInfo.removeAt(j);
                }
                for (let j = 0; j < dataInput.riskInfo[i].pilotInfo[k].recurrentInfo.length; j++) {
                    recurrentInfo.push(this.transactionTypeInstance.transaction.avipilot.getInitialRecurrent());
                }
                recurrentInfo.at(i).patchValue(dataInput.riskInfo[i].pilotInfo[k].recurrentInfo);
                for (let j = 0; j < operatingInfo.length; j++) {
                    operatingInfo.removeAt(j);
                }
                for (let j = 0; j < dataInput.riskInfo[i].pilotInfo[k].operatingInfo.length; j++) {
                    operatingInfo.push(this.transactionTypeInstance.transaction.avipilot.addOperatingExperience());
                }
                operatingInfo.at(i).patchValue(dataInput.riskInfo[i].pilotInfo[k].operatingInfo);
                for (let j = 0; j < addPilotInfo.length; j++) {
                    addPilotInfo.removeAt(j);
                }
                for (let j = 0; j < dataInput.riskInfo[i].pilotInfo[k].addPilotInfo.length; j++) {
                    addPilotInfo.push(this.transactionTypeInstance.transaction.avipilot.getPilotInfoModal());
                }
                addPilotInfo.at(i).patchValue(dataInput.riskInfo[i].pilotInfo[k].addPilotInfo);
            }
            pilotInfo.patchValue(dataInput.riskInfo[i].pilotInfo);
            pilotInfo.updateValueAndValidity();
            tempPlanFormGroup.patchValue(pilotInfo);
            tempPlanFormGroup.updateValueAndValidity();
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
                if (policyPostsResponse.observers && policyPostsResponse.observers.length > 0) {
                    policyPostsResponse.observers.pop();
                }
            },
            (error) => {
                this.transactionTypeInstance.transaction.logger.error(error);
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            });
    }
    public getDefaultValuesInstance() {
        return new AviationDefaultValue(this.transactionTypeInstance.transaction.configService);
    }
    public getQuoteValidator() {
        return new AviationQuoteValidator();
    }
    public saveQuote() {
        this.createAndSaveCustomer(true);
    }
    public postQuote() {
        this.createAndSaveCustomer(false);
    }
    public createAndSaveCustomer(isSave: boolean) {
        let inputDataCustomer;
        inputDataCustomer = this.formGroup.get('customerInfo').value;
        delete inputDataCustomer['accountInfo'];
        if (inputDataCustomer.appCode !== null && inputDataCustomer.appCode !== undefined && inputDataCustomer.appCode !== '') {
            this.createCustomer(false, isSave, this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value, inputDataCustomer);
        } else {
            this.createCustomer(true, isSave, this.formGroup.controls['customerInfo'].get('isPolicyHolderInsured').value, inputDataCustomer);
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
                    // let riskTempFormGroup: any = this.formGroup.controls['riskInfo'];
                    if (customerInfoDataVal.customerInfo) {
                        if (isInsured) {
                            this.formGroup.controls['customerInfo'].patchValue(customerInfoDataVal.customerInfo);
                            this.formGroup.controls['customerInfo'].updateValueAndValidity();
                        }
                        this.formGroup.controls['customerInfo'].get('appCode').patchValue(customerInfoDataVal.customerInfo.appCode);
                        // riskTempFormGroup.at(0).patchValue(customerInfoDataVal.customerInfo);
                        // riskTempFormGroup.at(0).updateValueAndValidity();
                    }
                    if (isSave) {
                        this.saveQuott();
                    } else {
                        this.quotPostOnCredit();
                    }
                }
            });
    }


    // - Methods specific to quotation
    // + Methods specific to Policy  

    public updateCustomerInfoData(dataValInput) {
        let tempFormGroup;
        let customerInfoArray: any = this.formGroup.controls['customerInfo'];
        tempFormGroup = customerInfoArray;
        tempFormGroup.patchValue(dataValInput.customerInfo);
        this.formGroup.controls['customerInfo'] = customerInfoArray;
        this.formGroup.controls['customerInfo'].updateValueAndValidity();
    }

    public getPolicyValidator() {
        return new AviationPolicyValidator();
    }

    // - Methods specific to Policy
    // + Modal Validator Methods
    public checkReferModal() {
        return (this.formGroup.get('referQuotInfo').get('category').valid &&
            this.formGroup.get('referQuotInfo').get('referralRemarks').valid);
    }
    public getQuickQuote() {
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
                this.formGroup.get('customerInfo').get('emailId').valid);
        }
        else {
            return (this.formGroup.get('customerInfo').get('companyName').valid &&
                this.formGroup.get('customerInfo').get('companyRegNumber').valid &&
                this.formGroup.get('customerInfo').get('emailId').valid);
        }

    }
    public checkMailModal() {
        return (this.formGroup.get('emailQuotInfo').get('toAddress').valid &&
            this.formGroup.get('emailQuotInfo').get('subject').valid &&
            this.formGroup.get('emailQuotInfo').get('fromAddress').valid);
    }
    public getRiskInfoModel() {
        return this.transactionTypeInstance.transaction.riskInfo.getAVIRiskInfoInfoModel();
    }
    public addRiskInfo(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let riskInfoModel = this.transactionTypeInstance.transaction.riskInfo.getAVIRiskInfoInfoModel();
        riskInfoModel.get('isItemAdded').patchValue(true);
        riskInfoModel.get('isItemDeleted').patchValue(false);
        tempRiskInfoArray.push(riskInfoModel);
        //tempRiskInfoArray.push(this.validator.setQuoteRiskValidators(riskInfoModel));
        let temp = tempRiskInfoArray.at(tempRiskInfoArray.length - 1)
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
        let appFullName = this.riskInfoGroup.get('insuredList').at(0).get('appFullName').value;
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
    uncheckSelectAllMakeModelInfo(data) {
        let selectAllFlag = true;
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterInfo: FormArray = <FormArray>tempFormGroup.get('makeModelInfo');
        for (let i = 0; i < subjectMatterInfo.length; i++) {

            let subjectMatterValue = subjectMatterInfo.at(i);
            if (subjectMatterValue.get('physicalDamage').value === false) {
                tempFormGroup.get('selectAllMakeModelInfo').patchValue(false);
                subjectMatterValue.get('pdPremium').patchValue('');
                selectAllFlag = false;
            }
        }
        if (selectAllFlag === true) {
            tempFormGroup.get('selectAllMakeModelInfo').patchValue(true);
        }
    }
    uncheckSelectAllSparePartInfo(data) {
        let selectAllFlag = true;
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterInfo: FormArray = <FormArray>tempFormGroup.get('sparePartInfo');
        for (let i = 0; i < subjectMatterInfo.length; i++) {

            let subjectMatterValue = subjectMatterInfo.at(i);
            if (subjectMatterValue.get('physicalDamage').value === false) {
                tempFormGroup.get('selectAllSparePartInfo').patchValue(false);
                subjectMatterValue.get('pdPremium').patchValue('');
                selectAllFlag = false;
            }
        }
        if (selectAllFlag === true) {
            tempFormGroup.get('selectAllSparePartInfo').patchValue(true);
        }

    }
    uncheckSelectAllGroundEquipmentInfo(data) {
        let selectAllFlag = true;
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterInfo: FormArray = <FormArray>tempFormGroup.get('groundEquipmentInfo');
        for (let i = 0; i < subjectMatterInfo.length; i++) {

            let subjectMatterValue = subjectMatterInfo.at(i);
            if (subjectMatterValue.get('physicalDamage').value === false) {
                tempFormGroup.get('selectAllGroundEquipmentInfo').patchValue(false);
                subjectMatterValue.get('pdPremium').patchValue('');
                selectAllFlag = false;
            }

        }
        if (selectAllFlag === true) {
            tempFormGroup.get('selectAllGroundEquipmentInfo').patchValue(true);
        }
    }
    uncheckSelectAllCamPayloadInfo(data) {
        let selectAllFlag = true;
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterInfo: FormArray = <FormArray>tempFormGroup.get('camPayloadInfo');
        for (let i = 0; i < subjectMatterInfo.length; i++) {

            let subjectMatterValue = subjectMatterInfo.at(i);
            if (subjectMatterValue.get('physicalDamage').value === false) {
                tempFormGroup.get('selectAllCamPayloadInfo').patchValue(false);
                subjectMatterValue.get('pdPremium').patchValue('');
                selectAllFlag = false;
            }
        }
        if (selectAllFlag === true) {
            tempFormGroup.get('selectAllCamPayloadInfo').patchValue(true);
        }
    }
    addSubjectMatter() {
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterInfo: FormArray = <FormArray>tempFormGroup.get('makeModelInfo');

        subjectMatterInfo.push(this.transactionTypeInstance.transaction.plans.getmakeModelInfoModel());
        if (tempFormGroup.get('selectAllMakeModelInfo').value === true) {
            subjectMatterInfo.at(subjectMatterInfo.length - 1).get('physicalDamage').patchValue(true);
        }
        else {
            subjectMatterInfo.at(subjectMatterInfo.length - 1).get('physicalDamage').patchValue(false);
        }

    }
    addSubjectMatterPayload() {
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterInfo: FormArray = <FormArray>tempFormGroup.get('camPayloadInfo');
        subjectMatterInfo.push(this.transactionTypeInstance.transaction.plans.getcamPayloadInfoModel());
        if (tempFormGroup.get('selectAllCamPayloadInfo').value === true) {
            subjectMatterInfo.at(subjectMatterInfo.length - 1).get('physicalDamage').patchValue(true);
        }
        else {
            subjectMatterInfo.at(subjectMatterInfo.length - 1).get('physicalDamage').patchValue(false);
        }


    }
    addSubjectMatterSpares() {
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterInfo: FormArray = <FormArray>tempFormGroup.get('sparePartInfo');
        subjectMatterInfo.push(this.transactionTypeInstance.transaction.plans.getsparePartInfoModel());
        if (tempFormGroup.get('selectAllSparePartInfo').value === true) {
            subjectMatterInfo.at(subjectMatterInfo.length - 1).get('physicalDamage').patchValue(true);
        }
        else {
            subjectMatterInfo.at(subjectMatterInfo.length - 1).get('physicalDamage').patchValue(false);
        }

    }
    addUASTraining() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let pilotInfo: FormArray = <FormArray>tempFormGroup.get('pilotInfo');
        let pilotGroup = pilotInfo.at(0);
        let uasOperatingInfo: FormArray = <FormArray>pilotGroup.get('uasOperatingInfo');
        uasOperatingInfo.push(this.transactionTypeInstance.transaction.uasOperatingInfo.getUasOperatingInfoModel());
    }
    addRecurrentFacility() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let pilotInfo: FormArray = <FormArray>tempFormGroup.get('pilotInfo');
        let pilotGroup = pilotInfo.at(0);
        let recurrentInfo: FormArray = <FormArray>pilotGroup.get('recurrentInfo');
        recurrentInfo.push(this.transactionTypeInstance.transaction.avipilot.getInitialRecurrent());

    }
    addOperatingExperienceRow() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let OperatingInfo: FormArray = <FormArray>tempFormGroup.get('pilotInfo');
        let uasGroup = OperatingInfo.at(0);
        let operatingInfo: FormArray = <FormArray>uasGroup.get('operatingInfo');
        operatingInfo.push(this.transactionTypeInstance.transaction.avipilot.addOperatingExperience());

    }

    addSubjectMatterGround() {
        let tempFormGroup: any = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterInfo: FormArray = <FormArray>tempFormGroup.get('groundEquipmentInfo');
        //let length = aviationRiskVOList.length;
        subjectMatterInfo.push(this.transactionTypeInstance.transaction.plans.getgroundEquipmentInfoModel());
        if (tempFormGroup.get('selectAllGroundEquipmentInfo').value === true) {
            subjectMatterInfo.at(subjectMatterInfo.length - 1).get('physicalDamage').patchValue(true);
            //coveragesArray.add(data.index);
        }
        else {
            subjectMatterInfo.at(subjectMatterInfo.length - 1).get('physicalDamage').patchValue(false);
        }

    }
    updatePilotFullName() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let aviationPilotArray = <FormArray>tempFormGroup.get('pilotInfo');
        for (let i = 0; i < aviationPilotArray.length; i++) {
            let pilotFName = aviationPilotArray.at(i).get('pilotFName').value;
            let pilotLName = aviationPilotArray.at(i).get('pilotLName').value;
            let appFullName = pilotFName + ' ' + pilotLName;
            aviationPilotArray.at(i).get('appFullName').setValue(appFullName);
            aviationPilotArray.at(i).get('appFullName').updateValueAndValidity();
        }
    }

    fileSize;
    uploadedFileList: any[] = [];
    uploadDrone(file) {
        const acceptMiMETypes:any[]=['xls','xlsx'];
        if (file['files']) {
            this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
            this.transactionTypeInstance.transaction.uploadedFileList.push(file['files'][0]);
            let files: File = <File>file['files'][0];
            this.transactionTypeInstance.transaction.fileSize = files.size;
            let uploadInfoFormArray: any = this.formGroup.controls['riskInfo'];
            let riskInfoFormGroup = uploadInfoFormArray.at(0);
            let attachGrp = riskInfoFormGroup.get('attachments').at(0);
            attachGrp.get('content').setErrors(null);
            attachGrp.updateValueAndValidity();
            let transactionModal = this.transactionTypeInstance.transaction.plans;
            let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
            try {
                let componentObject: AviationComponent = this;
                let utilsService = this.utilsService;
                let fr = new FileReader();
                if( acceptMiMETypes.includes(files['name'].split('.').pop()) ){
                    fr.readAsBinaryString(files);
                    fr.onload = function () {
                        attachGrp.get('fileType').setValue('xlsx');
                        attachGrp.get('uploadType').setValue('ExcelUploadMapping');
                        attachGrp.get('fileName').setValue(files.name.toString());
                        attachGrp.get('content').setValue(btoa(fr.result.toString()));
                        attachGrp.updateValueAndValidity();
                        let attachGrpValue = attachGrp.value;
                        attachGrpValue['serviceName'] = CommonConstants.DRONE_UPLOAD_SERVICE_NAME;
                        let userDetailResponse = utilsService.triggerNIPService(attachGrp.value);
                        userDetailResponse.subscribe(
                            (userDetailResponse) => {
                                if (userDetailResponse.error !== null && userDetailResponse.error !== undefined && userDetailResponse.error.length >= 1) {
                                    attachGrp.reset();
                                    componentObject.openUploadModal("Error", userDetailResponse);
                                    componentObject.formData = componentObject.ncpFormService.setJsonByElementId(componentObject.formData, ElementConstants.uploadFailure, 'condition', true);
                                    componentObject.formData = componentObject.ncpFormService.setJsonByElementId(componentObject.formData, ElementConstants.uploadSuccess, 'condition', false);
                                } else {
                                    let makeModalFormArray = tempFormGroup.get('makeModelInfo');
                                    let camPayloadFormArray = tempFormGroup.get('camPayloadInfo');
                                    let groundEquipmentFormArray = tempFormGroup.get('groundEquipmentInfo');
                                    let sparePartFormArray = tempFormGroup.get('sparePartInfo');
                                    for (let i = 1; i < userDetailResponse.makeModelList.length; i++) {
                                        let makeModalForm;
                                        makeModalFormArray.push(transactionModal.getmakeModelInfoModel());
                                    }
                                    for (let i = 1; i < userDetailResponse.camerasAndOtherPayloadDetails.length; i++) {
                                        let camPayloadForm;
                                        camPayloadFormArray.push(transactionModal.getcamPayloadInfoModel());
                                    }
                                    for (let i = 1; i < userDetailResponse.groundEquipment.length; i++) {
                                        let groundEquipmentForm;
                                        groundEquipmentFormArray.push(transactionModal.getgroundEquipmentInfoModel())
                                    }
                                    for (let i = 1; i < userDetailResponse.sparePart.length; i++) {
                                        let sparePartForm;
                                        sparePartFormArray.push(transactionModal.getsparePartInfoModel())
                                    }
                                    makeModalFormArray.patchValue(userDetailResponse.makeModelList);
                                    camPayloadFormArray.patchValue(userDetailResponse.camerasAndOtherPayloadDetails);
                                    groundEquipmentFormArray.patchValue(userDetailResponse.groundEquipment);
                                    sparePartFormArray.patchValue(userDetailResponse.sparePart);
                                    componentObject.openUploadModal("Success", userDetailResponse);
                                    componentObject.formData = componentObject.ncpFormService.setJsonByElementId(componentObject.formData, ElementConstants.riskowned, 'condition', (componentObject.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN' && componentObject.formGroup.controls['policyInfo'].get('isScheduled').value === true) ? true : false);
                                    componentObject.formData = componentObject.ncpFormService.setJsonByElementId(componentObject.formData, ElementConstants.uploadSuccess, 'condition', true);
                                    componentObject.formData = componentObject.ncpFormService.setJsonByElementId(componentObject.formData, ElementConstants.uploadFailure, 'condition', false);
                                    componentObject.formData = componentObject.ncpFormService.setJsonByElementId(componentObject.formData, ElementConstants.fileFormatFailure, 'condition', false);
    
                                }
                                if (userDetailResponse.observers && userDetailResponse.observers.length > 0) {
                                    userDetailResponse.observers.pop();
                                }
                            },
                        );
                    };
                }else{
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                        componentObject.formData = componentObject.ncpFormService.setJsonByElementId(componentObject.formData, ElementConstants.fileFormatFailure, 'condition', true);  
                        componentObject.formData = componentObject.ncpFormService.setJsonByElementId(componentObject.formData, ElementConstants.uploadDroneElementId, 'placeHolder', 'Upload completed UAS template');  
                                   
                }
            } catch (e) {
                this.transactionTypeInstance.transaction.logger.log(e, 'Error in Upload');
            }
        }
    }



    openUploadModal(result, uploadResult) {
        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
        if (result == "Error") {
            // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.droneuploadFail, 'condition',   true );
            this.isError = true;
            this.errors = [];
            for (let i = 0; i < uploadResult.error.length; i++) {
                if (uploadResult.error[i].details) {
                    this.errors.push({ 'errCode': uploadResult.error[i].details, 'errDesc': uploadResult.error[i].errorDesc });
                }
            }
        } else {
            this.isError = false;
            //alert("Succesfully uploaded");
            //this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.droneuploadSuccess, 'condition',   true );
        }

        // this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.uploadDronMessage, 'modalKey', true ); 
    }


    getUserViaJsonRating(index) {

        let tempFormGroup = this.transactionTypeInstance.transaction.quoteinfo.getAVIQuotInfoModel();
        tempFormGroup.patchValue(this.formGroup.value);
        let riskArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let planFormGroup = riskArray.at(0);
        let plansArray: FormArray = <FormArray>planFormGroup.get('plans');
        let tempRiskArray: FormArray = <FormArray>tempFormGroup.get('riskInfo');
        let tempPlanFormGroup = tempRiskArray.at(0);
        let coveragesArray: FormArray = <FormArray>tempPlanFormGroup.get('plans');
        let tempPlandetailsFormGroup = plansArray.at(index);
        let plansLength = coveragesArray.length;
        for (let i = plansLength; i >= 0; i--) {
            coveragesArray.removeAt(i);
        }
        coveragesArray = <FormArray>tempPlanFormGroup.get('plans');
        coveragesArray.push(this.transactionTypeInstance.transaction.plans.getAVIPlanInfoModel());
        let tempCovPlandetailsFormGroup: FormArray = <FormArray>tempPlandetailsFormGroup.get('makeModelInfo');
        let makeModalInfoFormGroup: FormArray = <FormArray>coveragesArray.at(0).get('makeModelInfo');
        let length = tempCovPlandetailsFormGroup.length;
        for (let i = 1; i < length; i++) {
            makeModalInfoFormGroup.push(this.transactionTypeInstance.transaction.plans.getmakeModelInfoModel());
        }
        let tempCovPlandetailsFormGroup2: FormArray = <FormArray>tempPlandetailsFormGroup.get('camPayloadInfo');
        let camPayloadInfoFormGroup: FormArray = <FormArray>coveragesArray.at(0).get('camPayloadInfo');
        length = tempCovPlandetailsFormGroup2.length;
        for (let i = 1; i < length; i++) {
            camPayloadInfoFormGroup.push(this.transactionTypeInstance.transaction.plans.getcamPayloadInfoModel());
        }
        let tempCovPlandetailsFormGroup3: FormArray = <FormArray>tempPlandetailsFormGroup.get('sparePartInfo');
        let sparePartInfoFormGroup: FormArray = <FormArray>coveragesArray.at(0).get('sparePartInfo');
        length = tempCovPlandetailsFormGroup3.length;
        for (let i = 1; i < length; i++) {
            sparePartInfoFormGroup.push(this.transactionTypeInstance.transaction.plans.getsparePartInfoModel());
        }
        let tempCovPlandetailsFormGroup4: FormArray = <FormArray>tempPlandetailsFormGroup.get('groundEquipmentInfo');
        let groundEquipmentInfoFormGroup: FormArray = <FormArray>coveragesArray.at(0).get('groundEquipmentInfo');
        length = tempCovPlandetailsFormGroup4.length;
        for (let i = 1; i < length; i++) {
            groundEquipmentInfoFormGroup.push(this.transactionTypeInstance.transaction.plans.getgroundEquipmentInfoModel());
        }
        this.doPopulatePlanDetailsWithDefaultValues(coveragesArray.at(0));
        coveragesArray.at(0).patchValue(tempPlandetailsFormGroup.value);

        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
            let ruleSetList = [];
            let object = this.formGroup.getRawValue();

            if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN' && this.formGroup.controls['policyInfo'].get('isScheduled').value && this.formGroup.controls['policyInfo'].get('isBlanket').value) {
                ruleSetList = ['ScheduledWorkingPerfect', 'BlanketWorkingPerfect']
            }
            else if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN' && this.formGroup.controls['policyInfo'].get('isScheduled').value) {
                ruleSetList = ['ScheduledWorkingPerfect']
            } else if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN' && this.formGroup.controls['policyInfo'].get('isBlanket').value) {
                ruleSetList = ['BlanketWorkingPerfect']
            } else if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'OWN' && this.formGroup.controls['policyInfo'].get('isScheduled').value && this.formGroup.controls['policyInfo'].get('isBlanket').value) {
                ruleSetList = ['ScheduledWorkingPerfect', 'BlanketWorkingPerfect']
            } else if (this.formGroup.controls['policyInfo'].get('coverageType').value === 'NON') {
                ruleSetList = ['NonOwnedWorkingPerfect']
            }
            let updatedUserViaRuleResponse = this.commonService.jsonRating(ruleSetList, object, this.productCode)
            updatedUserViaRuleResponse.subscribe(
                (quotInfoDataVal) => {
                    try {
                        if (quotInfoDataVal.error !== null
                            && quotInfoDataVal.error !== undefined
                            && quotInfoDataVal.error.length >= 1) {
                            this.updateErrorObject(quotInfoDataVal);
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');

                        } else {

                            // this.formGroup.patchValue(quotInfoDataVal);
                            let responseTempRiskArray = quotInfoDataVal.riskInfo;
                            let responseTempPlanFormGroup = responseTempRiskArray[0];
                            let responsePlansArray = responseTempPlanFormGroup.plans;
                            plansArray.at(index).patchValue(responsePlansArray[index]);
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');

                            //this.formGroup = this.updateInfoValue(quotInfoDataVal);
                            //tempPlandetailsFormGroup.get('summaryInfo').get('grossPremium').patchValue('0.00');
                            //plandetailsArray.at(0).get('covgPrm').patchValue('0.00');
                            //plandetailsArray.at(1).get('covgPrm').patchValue('0.00');
                            //plandetailsArray.at(2).get('covgPrm').patchValue('0.00');
                            //plandetailsArray.at(3).get('covgPrm').patchValue('0.00');
                        }
                    if (updatedUserViaRuleResponse.observers && updatedUserViaRuleResponse.observers.length > 0) {
                        updatedUserViaRuleResponse.observers.pop();
                    }
                 } catch (e) {
                        this.transactionTypeInstance.transaction.logger.log(e, 'Error in Upload');
                    }
                });
        }
    }

     public doCustomerRefresh(formGroup, id?) { 
        formGroup.get('mobilePh').patchValue('+1-');
        if (formGroup.get('customerName').value) {
            let customerSearchInput;
            if(this.userRoleId === CommonConstants.BROKER_AGENT_ROLE_ID) {
                customerSearchInput = { customerName: formGroup.get('customerName').value, agencyCode: this.transactionTypeInstance.transaction.configService.getCustom('user_agency_code'), isAgencySearch: true };
            } else if(this.userRoleId === CommonConstants.UNDER_WRITER_ROLE_ID){
                customerSearchInput = { customerName: formGroup.get('customerName').value, isHierarchySearch: true };
            }
            let customerInfoResponse = this.service.doCustomerRefresh(customerSearchInput);
            customerInfoResponse.subscribe((data) => {
                if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borPendingError, 'displayFlag', false);
                    this.resetCustomerInfoIdentity(formGroup, id);
                    this.changeRef.detectChanges();
                    this.isCustomerRefreshed = false;
                } else {
                    try {
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.acoountNotFoundError, 'displayFlag', data.length <= 0);
                        this.isCustomerRefreshed = false;
                        this.isNewCustomer = data.length === 0;
                        if (data.length === 1) {
                            this.isCustomerRefreshed = true;
                            let customerDetails = JSON.parse(data[0].details);
                            let customerName
                            if (customerDetails.customerInfo.policyHolderType === 'O') {
                                customerName = customerDetails.customerInfo.companyName;
                            } else if (customerDetails.customerInfo.policyHolderType === 'I') {
                                customerName = customerDetails.customerInfo.appFullName;
                            } else {
                                customerName = formGroup.get('customerName').value;
                            }

                            let currentNode = JSON.parse(data[0].details);
                            formGroup.get('customerName').patchValue(customerName);
                            formGroup.get('agencyCode').patchValue(data[0].agencyCode);
                            formGroup.get('postalcode').patchValue(data[0].zipCd);
                            formGroup.get('borRequired').patchValue(data[0].borRequired);
                            if (this.uwflag && this.formGroup.controls['customerInfo'].get('currentBroker').value) formGroup.get('currentBroker').patchValue(this.formGroup.controls['customerInfo'].get('currentBroker').value);
                            else formGroup.get('currentBroker').patchValue(data[0].operatorID);
                            formGroup.get('introducingAgentCd').patchValue(data[0].agentID);
                            formGroup.get('introducingAgentPortalId').patchValue(data[0].operatorID);
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borPendingError, 'displayFlag', false);
                            if (currentNode.customerInfo) {
                                if (currentNode.customerInfo.policyHolderType === 'O') {
                                    formGroup.get('customerName').patchValue(currentNode.customerInfo.companyName);
                                    currentNode.customerInfo.customerName = formGroup.get('customerName').value;
                                }
                                else if (currentNode.customerInfo.policyHolderType === 'I') {
                                    formGroup.get('customerName').patchValue(currentNode.customerInfo.appFullName);
                                    currentNode.customerInfo.customerName = formGroup.get('customerName').value;
                                }
                                if (currentNode.customerInfo.servicingAgent && typeof currentNode.customerInfo.servicingAgent == 'string') {
                                    currentNode.customerInfo.servicingAgent = JSON.parse(currentNode.customerInfo.servicingAgent);
                                }
                                if (currentNode.customerInfo.isBorRequested && currentNode.customerInfo.borStatus == CommonConstants.STATUS_PENDING) {
                                    currentNode.customerInfo['isBorPending'] = true;
                                    this.resetCustomerInfoIdentity(formGroup, id);
                                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borPendingError, 'displayFlag', true);
                                    this.changeRef.markForCheck();
                                } else {
                                    if (this.userRoleId === CommonConstants.BROKER_AGENT_ROLE_ID) {
                                        this.validateAccount();
                                    }
                                    currentNode.customerInfo['isBorPending'] = false;
                                    formGroup.patchValue(currentNode.customerInfo);
                                    formGroup = this.disableCustomerDetails(formGroup);
                                    formGroup.updateValueAndValidity();
                                    // this.disableCustomerInfo(formGroup, id);

                                }
                            }
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                            this.changeRef.markForCheck();
                        }
                        else if (data.length > 1) {
                            let tempCustomerInfoArray = this.formGroup.get('customerInfo');
                            let accountInfoArray: FormArray = <FormArray>tempCustomerInfoArray.get('accountInfo');
                            let currentAccountInfoArrayLength = accountInfoArray.length;
                            for (let i = currentAccountInfoArrayLength; i >= 0; i--) {
                                accountInfoArray.removeAt(i);
                            }
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.accountListModalKey, 'modalKey', true);
                            for (let i = 0; i < data.length; i++) {
                                let customerDetails = JSON.parse(data[i].details);
                                accountInfoArray.push(this.transactionTypeInstance.transaction.customerInfo.getCustomerInfoModel());
                                if (customerDetails.customerInfo.servicingAgent && typeof customerDetails.customerInfo.servicingAgent == 'string') {
                                    customerDetails.customerInfo.servicingAgent = JSON.parse(customerDetails.customerInfo.servicingAgent);
                                }
                                accountInfoArray.at(i).patchValue(customerDetails.customerInfo);
                                if (customerDetails.customerInfo.policyHolderType === 'O') {
                                    accountInfoArray.at(i).get('customerName').patchValue(customerDetails.customerInfo.companyName);
                                    accountInfoArray.at(i).get('appFullName').patchValue(customerDetails.customerInfo.companyName);
                                    accountInfoArray.at(i).get('applicantIs').patchValue("Corporate");
                                }
                                else if (customerDetails.customerInfo.policyHolderType === 'I') {
                                    accountInfoArray.at(i).get('customerName').patchValue(customerDetails.customerInfo.appFullName);
                                    accountInfoArray.at(i).get('applicantIs').patchValue("Individual");
                                }
                                accountInfoArray.at(i).get('borRequired').patchValue(data[i].borRequired);
                                accountInfoArray.at(i).get('currentBroker').patchValue(data[i].operatorID);
                                accountInfoArray.at(i).get('introducingAgentCd').patchValue(data[i].agentID);
                                accountInfoArray.at(i).get('introducingAgentPortalId').patchValue(data[i].operatorID);
                                if (customerDetails.customerInfo.isBorRequested && customerDetails.customerInfo.borStatus == CommonConstants.STATUS_PENDING) {
                                    customerDetails.customerInfo['isBorPending'] = true;
                                } else {
                                    customerDetails.customerInfo['isBorPending'] = false;
                                }
                                accountInfoArray.at(i).get('isBorPending').patchValue(customerDetails.customerInfo['isBorPending']);
                                formGroup = this.disableCustomerDetails(formGroup);
                                formGroup.updateValueAndValidity();
                            }
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                            this.changeRef.markForCheck();
                        } else {
                            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borPendingError, 'displayFlag', false);
                            this.formGroup = this.ableCustomerDetails(this.formGroup);
                            this.formGroup = this.resetCustomerDetails(this.formGroup);
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                            this.formGroup.updateValueAndValidity();
                            this.changeRef.markForCheck();
                        }
                    } catch (e) {
                        this.transactionTypeInstance.transaction.logger.info(e, 'Error in Customer Refresh');
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                        this.isCustomerRefreshed = false;
                        this.changeRef.markForCheck();
                    }
                }
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalAccountButton, 'isDisabled', !this.formGroup.controls['policyInfo'].get('quoteNo').value || !this.isCustomerRefreshed);
                if (customerInfoResponse.observers && customerInfoResponse.observers.length > 0) {
                    customerInfoResponse.observers.pop();
                }
            });
        } else {
            if (!formGroup.get('customerName').value) {
                formGroup.get('customerName').setErrors({ 'required': true });
                this.isCustomerRefreshed = false;
            }
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveModalAccountButton, 'isDisabled', true);
            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
            this.changeRef.markForCheck();
        }

    }
    // checkApplicantValue(){
    //     let occCd= this.formGroup.controls['customerInfo'].get('occupationCode').value;
    //     if(occCd ==='a'){
    //         return true ; 
    //     }
    //     else if(occCd ==='b'){
    //         return false;
    //     } 
    // }

    public selectAllMakeModel(data) {

        let tempPlanFormGroup = this.riskInfoGroup.get('plans').at(0);
        let coveragesArray: FormArray = <FormArray>tempPlanFormGroup.get('makeModelInfo');
        for (let i = 0; i < coveragesArray.length; i++) {
            let tempPlandetailsFormGroup = coveragesArray.at(i);
            if (data.innerValue === true) {
                tempPlandetailsFormGroup.get('physicalDamage').patchValue(true);
                //coveragesArray.add(data.index);
            }
            else {
                tempPlandetailsFormGroup.get('physicalDamage').patchValue(false);
            }
        }
    }

    public selectAllCamPayload(data) {

        let tempPlanFormGroup = this.riskInfoGroup.get('plans').at(0);
        let coveragesArray: FormArray = <FormArray>tempPlanFormGroup.get('camPayloadInfo');
        for (let i = 0; i < coveragesArray.length; i++) {
            let tempPlandetailsFormGroup = coveragesArray.at(i);
            if (data.innerValue === true) {
                tempPlandetailsFormGroup.get('physicalDamage').patchValue(true);
                //coveragesArray.add(data.index);
            }
            else {
                tempPlandetailsFormGroup.get('physicalDamage').patchValue(false);
            }
        }
    }
    public selectAllSparePart(data) {

        let tempPlanFormGroup = this.riskInfoGroup.get('plans').at(0);
        let coveragesArray: FormArray = <FormArray>tempPlanFormGroup.get('sparePartInfo');
        for (let i = 0; i < coveragesArray.length; i++) {
            let tempPlandetailsFormGroup = coveragesArray.at(i);
            if (data.innerValue === true) {
                tempPlandetailsFormGroup.get('physicalDamage').patchValue(true);
                //coveragesArray.add(data.index);
            }
            else {
                tempPlandetailsFormGroup.get('physicalDamage').patchValue(false);
            }
        }
    }
    public selectAllGroundEquipment(data) {

        let tempPlanFormGroup = this.riskInfoGroup.get('plans').at(0);
        let coveragesArray: FormArray = <FormArray>tempPlanFormGroup.get('groundEquipmentInfo');
        for (let i = 0; i < coveragesArray.length; i++) {
            let tempPlandetailsFormGroup = coveragesArray.at(i);
            if (data.innerValue === true) {
                tempPlandetailsFormGroup.get('physicalDamage').patchValue(true);
                //coveragesArray.add(data.index);
            }
            else {
                tempPlandetailsFormGroup.get('physicalDamage').patchValue(false);
            }
        }
    }



    public delSubjectMatter(data) {
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterInfo: FormArray = <FormArray>tempFormGroup.get('makeModelInfo');
        if (subjectMatterInfo.length > 1) {
            subjectMatterInfo.removeAt(data.index);
        }
    }


    deleteRecurrentFacility(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let pilotInfo: FormArray = <FormArray>tempFormGroup.get('pilotInfo');
        let pilotGroup = pilotInfo.at(0);
        let deleterecurrentInfo: FormArray = <FormArray>pilotGroup.get('recurrentInfo');
        // let index = deleterecurrentInfo.length;
        if (deleterecurrentInfo.length > 1) {
            deleterecurrentInfo.removeAt(data.index);
        }

    }
    deleteOperatingExperienceRow(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let pilotInfo: FormArray = <FormArray>tempFormGroup.get('pilotInfo');
        let pilotGroup = pilotInfo.at(0);
        let deleterecurrentInfo: FormArray = <FormArray>pilotGroup.get('operatingInfo');
        // let index = deleterecurrentInfo.length;
        if (deleterecurrentInfo.length > 1) {
            deleterecurrentInfo.removeAt(data.index);
        }

    }

    public delSubjectMatterPayload(data) {
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterArray: FormArray = <FormArray>tempFormGroup.get('camPayloadInfo');
        if (subjectMatterArray.length > 1) {
            subjectMatterArray.removeAt(data.index);
        }
    }
    public delSubjectMatterSpares(data) {
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterArray: FormArray = <FormArray>tempFormGroup.get('sparePartInfo');
        if (subjectMatterArray.length > 1) {
            subjectMatterArray.removeAt(data.index);
        }
    }
    public delUASTraining(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let pilotInfo: FormArray = <FormArray>tempFormGroup.get('pilotInfo');
        let pilotGroup = pilotInfo.at(0);
        let uasOperatingInfo: FormArray = <FormArray>pilotGroup.get('uasOperatingInfo');
        let index = pilotInfo.length;
        if (uasOperatingInfo.length > 1) {
            uasOperatingInfo.removeAt(data.index);
        }
    }
    public delSubjectMatterGround(data) {
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        let subjectMatterArray: FormArray = <FormArray>tempFormGroup.get('groundEquipmentInfo');
        if (subjectMatterArray.length > 1) {
            subjectMatterArray.removeAt(data.index);
        }
    }
    public disableCustomerDetails(formGroup) {
        formGroup.get('servicingAgent').disable();
        formGroup.get('address1').disable();
        formGroup.get('zipCd').disable();
        formGroup.get('cityCode').disable();
        formGroup.get('state').disable();
        formGroup.get('mobilePh').disable();
        formGroup.get('countyCode').disable();
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.contactNumber, 'isEnquiryFlag', true);
        formGroup.get('emailId').disable();
        if (this.canadaflag) {
            formGroup.get('postalcode').disable();
        }
        return formGroup;
    }
    public ableCustomerDetails(formGroup) {
        formGroup.controls['customerInfo'].get('servicingAgent').enable();
        formGroup.controls['customerInfo'].get('address1').enable();
        formGroup.controls['customerInfo'].get('zipCd').enable();
        formGroup.controls['customerInfo'].get('cityCode').enable();
        formGroup.controls['customerInfo'].get('state').enable();
        formGroup.controls['customerInfo'].get('mobilePh').enable();
        formGroup.controls['customerInfo'].get('countyCode').enable();
        formGroup.controls['customerInfo'].get('countyDesc').enable();
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.contactNumber, 'isEnquiryFlag', false);
        formGroup.controls['customerInfo'].get('emailId').enable();
        formGroup.controls['policyInfo'].get('expiryDt').enable();
        if (this.canadaflag) {
            formGroup.controls['customerInfo'].get('postalcode').enable();
        }
        return formGroup;
    }
    public resetCustomerDetails(formGroup) {
        formGroup.controls['customerInfo'].get('servicingAgent').patchValue(null);
        formGroup.controls['customerInfo'].get('servicingAgent').enable();
        formGroup.controls['customerInfo'].get('address1').patchValue('');
        formGroup.controls['customerInfo'].get('address1').enable();
        formGroup.controls['customerInfo'].get('zipCd').patchValue("");
        formGroup.controls['customerInfo'].get('zipCd').enable();
        formGroup.controls['customerInfo'].get('cityCode').patchValue('');
        formGroup.controls['customerInfo'].get('cityCode').enable();
        formGroup.controls['customerInfo'].get('state').patchValue('');
        formGroup.controls['customerInfo'].get('state').enable();
        formGroup.controls['customerInfo'].get('mobilePh').patchValue('+1-');
        formGroup.controls['customerInfo'].get('mobilePh').enable();
        formGroup.controls['customerInfo'].get('countyCode').patchValue('');
        formGroup.controls['customerInfo'].get('countyCode').enable();
        formGroup.controls['customerInfo'].get('countyDesc').patchValue('');
        formGroup.controls['customerInfo'].get('countyDesc').enable();
        formGroup.controls['customerInfo'].get('postalcode').patchValue('');
        formGroup.controls['customerInfo'].get('postalcode').enable();
        formGroup.controls['customerInfo'].get('provinceTeritory').patchValue('');
        formGroup.controls['customerInfo'].get('provinceTeritory').enable();
        formGroup.controls['customerInfo'].get('emailId').patchValue('');
        formGroup.controls['customerInfo'].get('emailId').enable();
        formGroup.updateValueAndValidity();
        return formGroup;
    }
    public addSchedulePlan() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let coveragesArray: FormArray = <FormArray>tempFormGroup.get('plans');
        let planlength = coveragesArray.length;
        let SClength = 0;
        for (let i = 0; i < coveragesArray.length; i++) {
            if (coveragesArray.at(i).get('planTypeCode').value === 'SCH') {
                SClength++;
            }
        }
        if (SClength < 5) {
            coveragesArray.push(this.transactionTypeInstance.transaction.plans.getAVIPlanInfoModel());
            this.doPopulatePlanDetailsWithDefaultValues(coveragesArray.at(planlength));
            coveragesArray.at(planlength).patchValue(coveragesArray.at(0).value);
            coveragesArray.at(planlength).get('planTypeCode').patchValue('SCH');
            let count = 1;
            for (let i = 1; i < coveragesArray.length; i++) {
                if (coveragesArray.at(i).get('planTypeCode').value === 'SCH') {
                    coveragesArray.at(i).get('planTypeDesc').patchValue('Plan' + (count + 1));
                    count++;
                }
            }
        }

    }
    public addBlanketPlan() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let coveragesArray: FormArray = <FormArray>tempFormGroup.get('plans');
        let planlength = coveragesArray.length;
        let BClength = 0;
        for (let i = 0; i < coveragesArray.length; i++) {
            if (coveragesArray.at(i).get('planTypeCode').value === 'BLK') {
                BClength++;
            }
        }
        if (BClength < 5) {
            coveragesArray.push(this.transactionTypeInstance.transaction.plans.getAVIPlanInfoModel());
            this.doPopulatePlanDetailsWithDefaultValues(coveragesArray.at(planlength));
            coveragesArray.at(planlength).patchValue(coveragesArray.at(0).value);
            coveragesArray.at(planlength).get('planTypeCode').patchValue('BLK');
            let count = 1;
            for (let i = 2; i < coveragesArray.length; i++) {
                if (coveragesArray.at(i).get('planTypeCode').value === 'BLK') {
                    coveragesArray.at(i).get('planTypeDesc').patchValue('Plan' + (count + 1));
                    count++;
                }
            }
        }
    }
    public addNonOwnedPlan() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let coveragesArray: FormArray = <FormArray>tempFormGroup.get('plans');
        let planlength = coveragesArray.length;
        let BClength = 0;
        for (let i = 0; i < coveragesArray.length; i++) {
            if (coveragesArray.at(i).get('planTypeCode').value === 'NON') {
                BClength++;
            }
        }
        if (BClength < 5) {
            coveragesArray.push(this.transactionTypeInstance.transaction.plans.getPlanInfoModel());
            this.doPopulatePlanDetailsWithDefaultValues(coveragesArray.at(planlength));
            coveragesArray.at(planlength).patchValue(coveragesArray.at(0).value);
            coveragesArray.at(planlength).get('planTypeCode').patchValue('NON');
            let count = 1;
            for (let i = 1; i < coveragesArray.length; i++) {
                if (coveragesArray.at(i).get('planTypeCode').value === 'NON') {
                    coveragesArray.at(i).get('planTypeDesc').patchValue('Plan' + (count + 1));
                    count++;
                }
            }
        }
    }
    public deletePlan(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let coveragesArray: FormArray = <FormArray>tempFormGroup.get('plans');
        let index = tempRiskInfoArray.length;
        if (data.index !== 0) {
            coveragesArray.removeAt(data.index);
        }
        let count = 1;
        for (let i = 1; i < coveragesArray.length; i++) {
            if (coveragesArray.at(i).get('planTypeCode').value === 'SCH') {
                coveragesArray.at(i).get('planTypeDesc').patchValue('Plan' + (count + 1));
                count++;
            }
        }
        let count2 = 1;
        for (let i = 2; i < coveragesArray.length; i++) {
            if (coveragesArray.at(i).get('planTypeCode').value === 'BLK') {
                coveragesArray.at(i).get('planTypeDesc').patchValue('Plan' + (count2 + 1));
                count2++;
            }
        }
        let count3 = 1;
        for (let i = 1; i < coveragesArray.length; i++) {
            if (coveragesArray.at(i).get('planTypeCode').value === 'NON') {
                coveragesArray.at(i).get('planTypeDesc').patchValue('Plan' + (count3 + 1));
                count3++;
            }
        }

    }
    public selectedPlan(data) {
        let tempFormGroup;
        let riskInfoArray: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        let tempPlansArray: FormArray;
        let i = 0, numOfInsured: number = 0;
        for (let riskIndex = 0; riskIndex < riskInfoArray.length; riskIndex++) {
            tempFormGroup = riskInfoArray.at(riskIndex);
            tempPlansArray = <FormArray>tempFormGroup.get('plans');
            tempPlansArray.controls.forEach((plansFormgroup, i) => {
                if (i === data.index) {
                    if (plansFormgroup.get('isPlanSelected').value === false) {
                        for (let i = 0; i < tempPlansArray.length; i++) {
                            tempPlansArray.at(i).get('isPlanSelected').patchValue(false);
                        }
                        plansFormgroup.get('isPlanSelected').setValue(true);
                        this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                        this.changeRef.markForCheck();

                    } else {
                        plansFormgroup.get('isPlanSelected').setValue(false)
                        this.transactionTypeInstance.transaction.configService.loggerSub.next('formDataChanged');
                        this.changeRef.markForCheck();
                    }
                }

            });
        }
    }

    public createQuote() {
        let source: any = {};
        let leadCreateResponse = this.service.getQuotInfo(this.formGroup.value);
        leadCreateResponse.subscribe(
            (data) => {
                if (data.error !== null
                    && data.error !== undefined
                    && data.error.length >= 1) {
                }
                else {
                    this.formGroup.patchValue(data);
                    this.pushTabHeaderDetails();
                    // - Tab header Inputs
                    this.changeRef.markForCheck();
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    if (leadCreateResponse.observers && leadCreateResponse.observers.length > 0) {
                        leadCreateResponse.observers.pop();
                    }
                }
            });
    }

    public saveQuott(modalOpenFlag: boolean = false) {
        // this.formGroup = this.ableCustomerDetails(this.formGroup);
        let leadCreateResponse = this.service.saveQuoteOpenheldInfo(this.formGroup.getRawValue());
        leadCreateResponse.subscribe(
            (data) => {
                if (data.error !== null
                    && data.error !== undefined
                    && data.error.length >= 1) {
                }
                else {
                    // this.formGroup.controls['customerInfo'].patchValue(this.disableCustomerDetails(this.formGroup.controls['customerInfo']));
                    this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    this.changeRef.markForCheck();
                    if (modalOpenFlag) {
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.saveQuottModalKey, 'modalKey', true);
                    }
                }
                if (leadCreateResponse.observers && leadCreateResponse.observers.length > 0) {
                    leadCreateResponse.observers.pop();
                }
            });
    }

    public coverDateValidation() {
        let coverFromDate = this.formGroup.controls['policyInfo'].value.inceptionDt;
        let date = new Date();
        let toDaycoverDate = this.dateFormatService.formatDate(date);
        if (coverFromDate) {
            let dateDuration = this.transactionTypeInstance.transaction.dateDuration.transform(toDaycoverDate, coverFromDate);
            let coverStartDate = dateDuration.startDate;
            let coverEndDate = dateDuration.endDate;
            let noofCoverDays = dateDuration.noOfDays;
            if (noofCoverDays > 121) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.exceedErrQuote, 'condition', true);
                this.coverFromDateValidation = false;
                //this.navigateToHome();
            } else {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.exceedErrQuote, 'condition', false);
                this.coverFromDateValidation = true;
            }
        }
    }

    public hobbyRec(data) {
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagCondition, 'condition', this.usflag ? true : false);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagCondition, 'condition', this.usflag ? false : true);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.countyFlagCondition, 'condition', this.canadaflag ? false : true);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagCondition1, 'condition', this.usflag ? true : false);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagCondition1, 'condition', this.usflag ? false : true);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagCondition2, 'condition', this.usflag ? true : false);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagCondition2, 'condition', this.usflag ? false : true);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.declineQuote, 'modalKey', data === 'y' ? true : false);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1Conditionus, 'condition', data === 'n' && this.usflag ? true : false);
        //this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1Conditioncanada, 'condition', data === 'n' && this.canadaflag ? true : false);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.validationq1DeclineCondition, 'condition', data === 'y' ? true : false);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.usFlagConditionAdditionalInsurer, 'condition', this.usflag ? true : false);
        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.canadaFlagConditionAdditionalInsurer, 'condition', this.usflag ? false : true);
        this.changeRef.detectChanges();
    }

    getMimeTypedata(data) {
        if (data) {
            let file = data.value;
            let index = data.index;
            if (file && file['files']) {
                this.transactionTypeInstance.transaction.uploadedFileList.push(file['files'][0]);
                let files: File = <File>file['files'][0];
                this.transactionTypeInstance.transaction.fileSize = files.size;
                //let uploadDocInfoFormGroup: FormGroup = <FormGroup>this.formGroup.controls['referQuotInfo'];
                let uploadListFormArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
                let uploadDocInfoFormGroup = uploadListFormArray.at(0);
                let temp: FormArray = <FormArray>uploadDocInfoFormGroup.get('fileUploadInfo');
                let attachGrp = temp.at(index);
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
    }
    addUploadComponent() {
        let uploadListFormArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let uploadDocInfoFormGroup = uploadListFormArray.at(0);
        let fileUploadInfo: FormArray = <FormArray>uploadDocInfoFormGroup.get('fileUploadInfo');
        fileUploadInfo.push(this.transactionTypeInstance.transaction.riskInfo.getfileUploadInfoModel());
        this.changeRef.markForCheck();
    }

    deleteuploadDocument(index) {
        let uploadDocInfoFormGroup: any = this.formGroup.controls['riskInfo'];
        let tempFormGroup = uploadDocInfoFormGroup.at(0);
        let tempClaimFormGroup = tempFormGroup.get('fileUploadInfo');
        if (tempClaimFormGroup.length > 1) {
            tempClaimFormGroup.removeAt(index);
        }
    }
    viewDocument(index) {
        let uploadDocInfoFormGroup: any = this.formGroup.controls['riskInfo'];
        let tempFormGroup = uploadDocInfoFormGroup.at(0);
        let tempClaimFormGroup = tempFormGroup.get('fileUploadInfo');
        tempClaimFormGroup = tempClaimFormGroup.at(index).value;
        this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
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
        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
    }
    downloadDocument(index) {
        let uploadDocInfoFormGroup: any = this.formGroup.controls['riskInfo'];
        let tempFormGroup = uploadDocInfoFormGroup.at(0);
        let tempClaimFormGroup = tempFormGroup.get('fileUploadInfo');
        tempClaimFormGroup = tempClaimFormGroup.at(index).value;
        this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
        if (tempClaimFormGroup.documentContent) {
            this.saveData(tempClaimFormGroup.documentContent, tempClaimFormGroup.fileName);
            // let tempContent: any = atob(tempClaimFormGroup.documentContent);
            //     let length = tempContent.length;
            //     let arrayBuffer = new ArrayBuffer(length);
            //     let uintArray = new Uint8Array(arrayBuffer);
            //     for (let i = 0; i < length; i++) {
            //         uintArray[i] = tempContent.charCodeAt(i);
            //     }
            //     let blob = new Blob([uintArray], { type: tempClaimFormGroup.mimeType });
            //     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            //         window.navigator.msSaveOrOpenBlob(blob);
            //     } else {
            //         let objectUrl = URL.createObjectURL(blob);
            //         window.open(objectUrl);
            //     }
        }
        this.changeRef.markForCheck();
        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
    }

    doPopulatePlanDetailsWithDefaultValues(plan) {
        let plandetailsData: any = plan.get('planDetails');
        plandetailsData.removeAt(0);
        plandetailsData.push(this.transactionTypeInstance.transaction.planDetail.getAVIPlanDetailsInfoModel());
        let liaPlanDetails = plandetailsData.at(0);
        liaPlanDetails.get('covgCd').patchValue('LIA');
        liaPlanDetails.get('covgDesc').patchValue('liability');
        plandetailsData.push(this.transactionTypeInstance.transaction.planDetail.getAVIPlanDetailsInfoModel());
        liaPlanDetails = plandetailsData.at(1);
        liaPlanDetails.get('covgCd').patchValue('PHY');
        liaPlanDetails.get('covgDesc').patchValue('Physical');
        plandetailsData.push(this.transactionTypeInstance.transaction.planDetail.getAVIPlanDetailsInfoModel());
        liaPlanDetails = plandetailsData.at(2);
        liaPlanDetails.get('covgCd').patchValue('WAR');
        liaPlanDetails.get('covgDesc').patchValue('War Occurrence Liability');
        plandetailsData.push(this.transactionTypeInstance.transaction.planDetail.getAVIPlanDetailsInfoModel());
        liaPlanDetails = plandetailsData.at(3);
        liaPlanDetails.get('covgCd').patchValue('TRIA');
        liaPlanDetails.get('covgDesc').patchValue('triaLiability');
    }
    saveData = (function () {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        return function (data, fileName) {
            var json = data,
                blob = new Blob([json], { type: "octet/stream" }),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    public getPostalCodeRefresh() {
        let postalCode = this.formGroup.controls['customerInfo'].get('zipCd').value;
        if (postalCode) {
            this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
            let inputPickList = {
                auxType: "ZipCode",
                code: postalCode
            }
            let PostalCodeResponse = this.pickListService.getPickList(inputPickList);
            PostalCodeResponse.subscribe(
                (postalCodeResponseData) => {
                    try {
                        if (postalCodeResponseData == null) {
                            this.formGroup.controls['customerInfo'].get('cityCode').enable();
                            this.formGroup.controls['customerInfo'].get('cityDesc').enable();
                            this.formGroup.controls['customerInfo'].get('state').enable();
                            this.formGroup.controls['customerInfo'].get('stateDesc').enable();
                            this.formGroup.controls['customerInfo'].get('cityCode').reset();
                            this.formGroup.controls['customerInfo'].get('cityDesc').reset();
                            this.formGroup.controls['customerInfo'].get('state').reset();
                            this.formGroup.controls['customerInfo'].get('stateDesc').reset();
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                        } else if (postalCodeResponseData.error !== null && postalCodeResponseData.error !== undefined && postalCodeResponseData.error.length >= 1) {
                            this.formGroup.controls['customerInfo'].get('zipCd').setErrors({ 'notFound': true });
                            // this.updateErrorObject(postalCodeResponseData);
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
                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                        } else {
                            this.formGroup.controls['customerInfo'].get('countryCode').patchValue(postalCodeResponseData[0].countryCode.trim());
                            this.formGroup.controls['customerInfo'].get('countryCode').updateValueAndValidity();

                            this.formGroup.controls['customerInfo'].get('state').patchValue(postalCodeResponseData[0].state.trim());
                            this.formGroup.controls['customerInfo'].get('state').updateValueAndValidity();

                            this.formGroup.controls['customerInfo'].get('state').patchValue(postalCodeResponseData[0].state.trim());
                            this.formGroup.controls['customerInfo'].get('state').updateValueAndValidity();
                            this.formGroup.controls['customerInfo'].get('stateDesc').patchValue(postalCodeResponseData[0].stateDesc.trim());
                            this.formGroup.controls['customerInfo'].get('stateDesc').updateValueAndValidity();
                            this.formGroup.controls['customerInfo'].get('countyCode').patchValue(postalCodeResponseData[0].countyCode.trim());
                            this.formGroup.controls['customerInfo'].get('countyCode').updateValueAndValidity();

                            this.formGroup.controls['customerInfo'].get('cityCode').patchValue(postalCodeResponseData[0].cityDesc.trim());
                            this.formGroup.controls['customerInfo'].get('cityCode').updateValueAndValidity();

                            this.formGroup.controls['customerInfo'].get('municipalityCode').patchValue(postalCodeResponseData[0].municipalityCode.trim());

                            this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                        }
                        this.updateElements();
                        this.changeRef.markForCheck();
                    } catch (e) {
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                        this.transactionTypeInstance.transaction.logger.error(e, 'Error in getPostalCodeRefresh');
                    }
                }
            );
        }
    }

    addPilots() {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let OperatingInfo: FormArray = <FormArray>tempFormGroup.get('pilotInfo');
        let uasGroup = OperatingInfo.at(0);
        let pilotInfo: FormArray = <FormArray>uasGroup.get('addPilotInfo');
        pilotInfo.push(this.transactionTypeInstance.transaction.avipilot.getPilotInfoModal());
    }

    deletePilots(data) {
        let tempRiskInfoArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
        let tempFormGroup = tempRiskInfoArray.at(0);
        let pilotriskInfo: FormArray = <FormArray>tempFormGroup.get('pilotInfo');
        let pilotGroup = pilotriskInfo.at(0);
        let deletepilotInfo: FormArray = <FormArray>pilotGroup.get('addPilotInfo');
        if (deletepilotInfo.length > 1) {
            deletepilotInfo.removeAt(data.index);
        }
    }

    getPilotMimeTypedata(file) {
        if (file['files']) {
            this.transactionTypeInstance.transaction.uploadedFileList.push(file['files'][0]);
            let files: File = <File>file['files'][0];
            this.transactionTypeInstance.transaction.fileSize = files.size;
            let uploadListFormArray: FormArray = <FormArray>this.formGroup.get('riskInfo');
            let uploadDocInfoFormGroup = uploadListFormArray.at(0);
            let temp: FormArray = <FormArray>uploadDocInfoFormGroup.get('pilotInfo');
            let attachGrp = temp.at(0);
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
                temp.at(0).get('documentContent').markAsDirty();
                temp.at(0).get('documentContent').setErrors({ 'maxSize': true });
                temp.updateValueAndValidity();
            }
            this.changeRef.markForCheck();
        }
    }

    viewDocumentFilePilotUpload() {
        let uploadDocInfoFormGroup: any = this.formGroup.controls['riskInfo'];
        let tempFormGroup = uploadDocInfoFormGroup.at(0);
        let tempClaimFormGroup = tempFormGroup.get('pilotInfo');
        tempClaimFormGroup = tempClaimFormGroup.at(0).value;
        this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
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
        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
    }
    downloadDocumentFilePilotUpload() {
        let uploadDocInfoFormGroup: any = this.formGroup.controls['riskInfo'];
        let tempFormGroup = uploadDocInfoFormGroup.at(0);
        let tempPilotFormGroup = tempFormGroup.get('pilotInfo');
        tempPilotFormGroup = tempPilotFormGroup.at(0).value;
        this.transactionTypeInstance.transaction.configService.setLoadingSub('yes');
        if (tempPilotFormGroup.documentContent) {
            this.saveData(tempPilotFormGroup.documentContent, tempPilotFormGroup.fileName);
        }
        this.changeRef.markForCheck();
        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
    }

    public viewSumCoverage() {
        let planInfoGroup = this.riskInfoGroup.get('plans').at(this.transactionTypeInstance.transaction.selectedPlanIndex);
        let makeModalFormArr = planInfoGroup.get('makeModelInfo');
        let camPayloadFormArr = planInfoGroup.get('camPayloadInfo');
        let groundEquipmentFormArr = planInfoGroup.get('groundEquipmentInfo');
        let sparePartFormArr = planInfoGroup.get('sparePartInfo');
        let initialPlanDetails = planInfoGroup.get('planDetails');
        let sumPhyLimit: number = 0;
        let sumLiaLimit: number = 0;
        let sumWarimit: number = 0;
        initialPlanDetails.controls.forEach((planDetailEleGroup: any) => {
            if (planDetailEleGroup.get('covgCd').value === 'PHY') {
                sumPhyLimit = this.doSumMappingValueOfFormArray(makeModalFormArr, 'physicalDamageLimit', 'physicalDamage') + this.doSumMappingValueOfFormArray(camPayloadFormArr, 'physicalDamageLimit', 'physicalDamage') + this.doSumMappingValueOfFormArray(groundEquipmentFormArr, 'physicalDamageLimit', 'physicalDamage') + this.doSumMappingValueOfFormArray(sparePartFormArr, 'physicalDamageLimit', 'physicalDamage');
                planDetailEleGroup.get('covgSi').patchValue(sumPhyLimit.toString());
            }
            if (planDetailEleGroup.get('covgCd').value === 'LIA') {
                sumLiaLimit = this.doSumMappingDropdownValuesOfFormArray(makeModalFormArr, 'liabilityLimitsDesc', 'liabilityLimitsCode', 'physicalDamage')
                planDetailEleGroup.get('covgSi').patchValue(sumLiaLimit.toString());
            }
            if (planDetailEleGroup.get('covgCd').value === 'WAR') {
                sumWarimit = this.doSumMappingDropdownValuesOfFormArray(makeModalFormArr, 'occurrenceWarLimitsDesc', 'liabilityLimitsCode', 'physicalDamage')
                planDetailEleGroup.get('covgSi').patchValue(sumWarimit.toString());
                if (sumWarimit === 0) {
                    planDetailEleGroup.get('covgSi').patchValue(sumLiaLimit.toString());
                }
            }
                
            if(sumPhyLimit > 0 || sumLiaLimit > 0 || sumWarimit > 0){
                 this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deductibleCondition, 'condition', true);
            }else{
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.deductibleCondition, 'condition', false);
            }
        });
    }

    public doSumMappingDropdownValuesOfFormArray(formArr: FormArray, map: string, code: string, ischecked: string) {
        let sum: number = 0;
        let v;
        if (Array.isArray(formArr.value)) {
            formArr.controls.forEach(element => {
                if (element.get(map).value) {
                    if (element.get(ischecked).value === true) {
                        v = (element.get(map).value);
                        //   v = v.replace(/,/g, "");
                        element.get(code).patchValue(v);
                        sum += parseInt(v);
                    }
                }
            });
        }
        return sum;
    }
    applyLienHolderDetailsToAllRows(typeOfLienHolder, dataValue) {
        // let selectedValueIndex = dataValue.index;
        let isApplyToAllRows = dataValue.innerValue;
        let lienHolderArray: FormArray;
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        if (typeOfLienHolder === 'makeModelInfo') {
            lienHolderArray = <FormArray>tempFormGroup.get('makeModelInfo');
        } else if (typeOfLienHolder === 'camPayload') {
            lienHolderArray = <FormArray>tempFormGroup.get('camPayloadInfo');
        } else if (typeOfLienHolder === 'spareParts') {
            lienHolderArray = <FormArray>tempFormGroup.get('sparePartInfo');
        } else if (typeOfLienHolder === 'grounds') {
            lienHolderArray = <FormArray>tempFormGroup.get('groundEquipmentInfo');
        }
        let nameOfLienholder, addressOfLienholder;
        let selectedLienHolderForm = lienHolderArray.controls[0];
        nameOfLienholder = selectedLienHolderForm.get('nameOfLienholder').value;
        addressOfLienholder = selectedLienHolderForm.get('addressOfLienholder').value;

        lienHolderArray.controls.forEach((lienHolderFormGrp, lienHolderIndex) => {
            if (lienHolderIndex != 0) {
                if (nameOfLienholder && isApplyToAllRows) {
                    lienHolderFormGrp.get('lineholder').patchValue(true);
                    lienHolderFormGrp.get('lineholder').updateValueAndValidity();
                    lienHolderFormGrp.get('nameOfLienholder').patchValue(nameOfLienholder);
                    lienHolderFormGrp.get('nameOfLienholder').updateValueAndValidity();
                } else {
                    lienHolderFormGrp.get('nameOfLienholder').patchValue('');
                    lienHolderFormGrp.get('nameOfLienholder').updateValueAndValidity();
                }
                if (addressOfLienholder && isApplyToAllRows) {
                    lienHolderFormGrp.get('addressOfLienholder').patchValue(addressOfLienholder);
                    lienHolderFormGrp.get('addressOfLienholder').updateValueAndValidity();
                } else {
                    lienHolderFormGrp.get('addressOfLienholder').patchValue('');
                    lienHolderFormGrp.get('addressOfLienholder').updateValueAndValidity();
                }
            }
        });
    }

    validateQ2Condition() {
        let isValidQ2: boolean = false;
        if (this.canadaflag) {
            isValidQ2 = this.formGroup.controls['policyInfo'].get('operateCommercialCan').value === 'SFOC' || this.formGroup.controls['policyInfo'].get('operateCommercialCan').value === 'Exemption for UAS 1kg or less' || this.formGroup.controls['policyInfo'].get('operateCommercialCan').value === 'Exemption for UAS greater than 1kg up to and including 25kgs';
        } else if (this.usflag) {
            isValidQ2 = this.formGroup.controls['policyInfo'].get('hobbyRec').value === 'n' && this.formGroup.controls['policyInfo'].get('operateCommercialUs').value === 'y';
        }
        return isValidQ2;
    }

    doLicenseStateCheck() {
        this.isLicenseStateCheck = false;
        let stateCode = this.formGroup.controls['customerInfo'].get('state').value;
        for (let i = 0; i < this.licenseStateList.length; i++) {
            if (this.licenseStateList[i].code === stateCode) {
                this.isLicenseStateCheck = true;
                break;
            }
        }
        if (stateCode) {
            if (!this.isLicenseStateCheck) {
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.licenseStateModalId, 'modalKey', true);
                this.changeRef.markForCheck();
            }
        }
    }
    doLicenseStateTaskRequest() {
        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
            this.saveQuott(false);
            this.createTask('LSC');
            // this.navigateToHome();
        }
    }

    validateAccount() {
        let customerValue = this.formGroup.controls['customerInfo'].value;
        if (customerValue && this.transactionTypeInstance.transaction.configService.getCustom('user_agency_code') !== customerValue.agencyCode) {
            this.isBorRequired = true;
            this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestModal, 'modalKey', true);
            if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
                this.saveQuott(false);
            }
            this.changeRef.markForCheck();
        } else {
            this.isBorRequired = false;
        }
    }
    createTask(inputType) {
        let taskInfo: any = {};
        let today = new Date();
        let fiveBusinessDays = new Date(today.getTime());
        fiveBusinessDays.setDate(fiveBusinessDays.getDate());
        let endDate = new Date();
        endDate.setDate(today.getDate() + 30);
        let responsiblePerson = { 'code': this.transactionTypeInstance.transaction.configService.getCustom('user_id'), 'desc': this.transactionTypeInstance.transaction.configService.getCustom('user_id') };
        taskInfo['responsiblePerson'] = [responsiblePerson];
        if (inputType === 'BOR') {
            taskInfo['taskDesc'] = 'Waiting to get signed BOR letter from client';
            taskInfo['requestType'] = 'BOR';
        } else if (inputType === 'LSC') {
            let stateName = this.formGroup.controls['customerInfo'].get('stateDesc').value;
            taskInfo['taskDesc'] = 'Waiting to get License approval for ' + stateName;
            taskInfo['requestType'] = 'LSC';
        }
        taskInfo['taskStatus'] = 'Upcoming';
        taskInfo['taskType'] = 'TASK';
        taskInfo['taskID'] = '';
        taskInfo['startDate'] = this.transactionTypeInstance.transaction.dateFormatService.formatDate(today);
        taskInfo['endDate'] = this.transactionTypeInstance.transaction.dateFormatService.formatDate(endDate);
        taskInfo['color'] = { 'primary': '#1e90ff', 'secondary': '#D1E8FF' };
        if (inputType === 'BOR') {
            taskInfo['title'] = 'Broker of Record';
        } else if (inputType === 'LSC') {
            taskInfo['title'] = 'License state';
        }
        taskInfo['quoteNo'] = this.formGroup.controls['policyInfo'].get('quoteNo').value;
        taskInfo['quoteVerNo'] = this.formGroup.controls['policyInfo'].get('quoteVerNo').value;
        taskInfo['clientFullName'] = this.formGroup.controls['customerInfo'].get('customerName').value;
        taskInfo['customerID'] = this.formGroup.controls['customerInfo'].get('appCode').value;
        this.formGroup.controls['customerInfo'].reset();
        let quoteFollowUpResponseObject = this.service.createTask(taskInfo);
        quoteFollowUpResponseObject.subscribe((quoteFollowUpResponse) => {
            if (quoteFollowUpResponse.error !== null && quoteFollowUpResponse.error !== undefined && quoteFollowUpResponse.error.length >= 1) {
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                if (quoteFollowUpResponse.error.length == 1 && quoteFollowUpResponse.error[0].errCode == 'E_NCP_074') {
                    if (inputType === 'BOR') {
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borTaskSucessModal, 'modalKey', true);
                    } else if (inputType === 'LSC') {
                        this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.slcTaskSucessModal, 'modalKey', true);
                    }
                } else {
                    this.updateErrorObject(quoteFollowUpResponse);
                    this.changeRef.markForCheck();
                }
            } else {
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                if (inputType === 'BOR') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borTaskSucessModal, 'modalKey', true);
                } else if (inputType === 'LSC') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.slcTaskSucessModal, 'modalKey', true);
                }
                this.changeRef.markForCheck();
            }
        });
    }


    uploadBorDocument(file) {
        if (file['files'] && file['files'].length > 0) {
            let files: File = <File>file['files'][0];
            let attachmentInfo: FormArray = <FormArray>this.formGroup.controls['customerInfo'].get('borAttachments');
            let attachmentFormGroup = attachmentInfo.at(0);
            // if (parseInt(this.fileSize) < parseInt((this.loaderConfig.get('fileSize')))) {
            try {
                let fr = new FileReader();
                fr.readAsBinaryString(files);
                fr.onload = function () {
                    attachmentFormGroup.get('mimeType').setValue(files.type.toString());
                    attachmentFormGroup.get('fileName').setValue(files.name.toString());
                    attachmentFormGroup.get('documentContent').setValue(btoa(fr.result.toString()));
                    attachmentFormGroup.updateValueAndValidity();

                };

            } catch (e) {
                this.transactionTypeInstance.transaction.logger.log(e, 'Error in Upload');
            }
        }
        // }
    }

    requestUnderwriterApprovalforBor() {

        if (!this.formGroup.controls['customerInfo'].get('borRequestedDate').value) {
            this.formGroup.controls['customerInfo'].get('borRequestedDate').patchValue(this.transactionTypeInstance.transaction.todayString);
        }
        this.formGroup.controls['customerInfo'].get('quoteNo').patchValue(this.formGroup.controls['policyInfo'].get('quoteNo').value);
        this.formGroup.controls['customerInfo'].get('quoteVerNo').patchValue(this.formGroup.controls['policyInfo'].get('quoteVerNo').value);
        let borEndDate = new Date();
        borEndDate.setDate(borEndDate.getDate() + 30);
        this.formGroup.controls['customerInfo'].get('borEndDate').patchValue(this.transactionTypeInstance.transaction.dateFormatService.formatDate(borEndDate));
        this.formGroup.controls['customerInfo'].get('borStatusDesc').patchValue('Pending');
        this.formGroup.controls['customerInfo'].get('borStatus').patchValue('PEN');
        this.formGroup.controls['customerInfo'].get('isBorRequested').patchValue(true);
        this.formGroup.controls['customerInfo'].get('borRequired').patchValue(false);
        this.formGroup.controls['customerInfo'].get('borRequestedBy').patchValue(this.transactionTypeInstance.transaction.configService.getCustom('user_id'));
        this.formGroup.controls['customerInfo'].get('borRequestedAgentCd').patchValue(this.transactionTypeInstance.transaction.configService.getCustom('user_party_id'));


        let formRawValue = this.formGroup.getRawValue();
        let customerInfoValue = formRawValue['customerInfo'];
        customerInfoValue['forBorRequest'] = true;
        customerInfoValue['accountInfo'] = '';
        let requestUWApprovalForBorResponse = this.service.updateCustomerDetails({ 'customerInfo': customerInfoValue });
        requestUWApprovalForBorResponse.subscribe((requestUWApprovalForBorData) => {
            if (requestUWApprovalForBorData.error !== null && requestUWApprovalForBorData.error !== undefined && requestUWApprovalForBorData.error.length >= 1) {
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestUploadDocModal, 'modalKey', false);
                if (requestUWApprovalForBorData.error.length == 1 && requestUWApprovalForBorData.error[0].errCode == 'E_NCP_074') {
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestSucessModal, 'modalKey', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestEmailSendingFailedCondition, 'condition', true);
                    this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestEmailSuccessCondition, 'condition', false);
                } else {
                    this.updateErrorObject(requestUWApprovalForBorData);
                }
                this.changeRef.markForCheck();
            } else {
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestSucessModal, 'modalKey', true);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestEmailSendingFailedCondition, 'condition', false);
                this.formData = this.ncpFormService.setJsonByElementId(this.formData, ElementConstants.borRequestEmailSuccessCondition, 'condition', true);
                this.changeRef.markForCheck();
            }
        });
    }

    servicingAgentChanged(data) {
        this.formGroup.controls['customerInfo'].get('servicingAgentCd').patchValue(data.multiLevelMapping);
        this.formGroup.controls['customerInfo'].get('servicingAgentName').patchValue(data.desc);
        this.formGroup.controls['customerInfo'].get('servicingAgentPortalId').patchValue(data.code);
    }

    getAgencyDetails() {
        let agencyCode = this.transactionTypeInstance.transaction.configService.getCustom('user_agency_code');
        if (agencyCode !== null && agencyCode != undefined && agencyCode !== ' ' && agencyCode != '') {
            let setCustomerId = { "clientID": agencyCode };
            let agencyInfoResponse = this.service.customerEnquiry(setCustomerId);
            agencyInfoResponse.subscribe((data) => {
                if (data.error !== null && data.error !== undefined && data.error.length >= 1) {
                    // this.licenseStateList
                    // this.changeRef.detectChanges();
                } else {
                    data[0].details = JSON.parse(data[0].details)
                    if (data[0].details.customerInfo.state_code) {
                        this.licenseStateList = data[0].details.customerInfo.state_code;
                    }
                }
                this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                if (agencyInfoResponse.observers && agencyInfoResponse.observers.length > 0) {
                    agencyInfoResponse.observers.pop();
                }
                this.changeRef.markForCheck();
            });
        } else {

        }
    }
    summaryRadioChanged(data) {
        let planIndex = data.parentIndex;
        let riskIndex = data.superParentIndex;
        let planDetailsIndex = data.index;
        let tempFormGroup: FormArray = <FormArray>this.formGroup.controls['riskInfo'];
        if (tempFormGroup.length > 0) {
            tempFormGroup.controls.forEach(riskInfoForm => {
                let planInfo: FormArray = <FormArray>riskInfoForm.get('plans');
                planInfo.controls.forEach((plansFormgroup, planControlIndex) => {
                    if (planIndex == planControlIndex) {
                        let plansDetails: FormArray = <FormArray>plansFormgroup['controls']['planDetails'];
                        plansDetails.controls.forEach((plansDetailsFormgroup, index) => {
                            if (planDetailsIndex == index) {
                                plansDetailsFormgroup.get('covgSiDesc').patchValue(0);
                                plansDetailsFormgroup.get('covgSi').patchValue(0);
                                if (data.value === false) {
                                    this.getUserViaJsonRating(0);
                                }
                            }
                        });
                    }
                });
            });
        }

    }

    getdocumentInfo() {
        if (!this.transactionTypeInstance.transaction.isEnquiryFlag) {
            let ruleSet = [];
            ruleSet = ['DocDefault']
            let object;

            if (this.riskInfoGroup.get('coverType').value === 'OWN') {
                object = { 'countryCode': 'US', 'coverType': this.riskInfoGroup.get('coverType').value, 'subCoverType': this.riskInfoGroup.get('subCoverType').value }

            }
            else if (this.riskInfoGroup.get('coverType').value === 'NON') {
                object = { 'countryCode': 'US', 'coverType': this.riskInfoGroup.get('coverType').value, 'subCoverType': this.riskInfoGroup.get('coverType').value }
            }
            let updatedUserViaRuleResponse = this.commonService.jsonRating(ruleSet, object, this.productCode);
            updatedUserViaRuleResponse.subscribe(
                (quotInfoDataVal) => {
                    if (quotInfoDataVal.error !== null
                        && quotInfoDataVal.error !== undefined
                        && quotInfoDataVal.error.length >= 1) {
                        this.updateErrorObject(quotInfoDataVal);
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');

                    } else {
                        let documentInfo: any = this.formGroup.controls['documentInfo'];
                        documentInfo.at(0).get('documentId').patchValue(quotInfoDataVal.documentId);
                        documentInfo.at(0).get('documentDesc').patchValue(quotInfoDataVal.documentDesc);
                        this.transactionTypeInstance.transaction.configService.setLoadingSub('no');
                    }
                });
        }
    }

    validateIdentificationNo(type, dataValue): boolean {

        let changedInfoArray: FormArray;
        let tempFormGroup = this.riskInfoGroup.get('plans').at(0);
        if (type === 'makeModelInfo') {
            changedInfoArray = <FormArray>tempFormGroup.get('makeModelInfo');
        } else if (type === 'camPayloadInfo') {
            changedInfoArray = <FormArray>tempFormGroup.get('camPayloadInfo');
        } else if (type === 'sparePartInfo') {
            changedInfoArray = <FormArray>tempFormGroup.get('sparePartInfo');
        } else if (type === 'groundEquipmentInfo') {
            changedInfoArray = <FormArray>tempFormGroup.get('groundEquipmentInfo');
        }
        let validFlag: boolean = true;
        changedInfoArray.controls.forEach((changedInfoFormGrp, changedInfoIndex) => {
            changedInfoArray.controls.forEach((_changedInfoFormGrp, _changedInfoIndex) => {
                _changedInfoFormGrp.get('identificationNumber').setErrors(null);
                if (_changedInfoIndex != changedInfoIndex && changedInfoFormGrp.get('identificationNumber').value == _changedInfoFormGrp.get('identificationNumber').value) {
                    _changedInfoFormGrp.get('identificationNumber').setErrors({ 'mismatch': true });
                    validFlag = false;
                }
            });
        });
        return validFlag;
    }
    brokerCodeChanged(data) {
        if (data) {
            this.formGroup.controls['policyInfo'].get('agentCd').patchValue(data.multiLevelMapping);
            this.formGroup.controls['policyInfo'].get('agentName').patchValue(data.desc);
            this.formGroup.controls['customerInfo'].get('currentBroker').patchValue(data.desc)
        }
    }
}