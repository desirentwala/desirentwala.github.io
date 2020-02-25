import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../../core/services/config.service';
import { SharedService } from '../../../core/shared/shared.service';
import { AmountFormat } from '../../../core/ui-components/amount/pipes/amountFormat';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { DefaultPolicyModel } from '../../../modules/common/services/defaultModel.service';
import { BreadCrumbService } from '../../common/breadCrumb/index';
import { DocumentInfo } from '../../common/models/documentInfo.model';
import { PlanInfo } from '../../common/models/planInfo.model';
import { PlanDetailsInfo } from '../../common/models/plandetailInfo.model';
import { PolicyCoverageInfo } from '../../common/models/policyCoverageInfo.model';
import { QuotInfo } from '../../common/models/quotInfo.model';
import { PolicyService } from '../services/policy.service';
@Component({
    selector: 'policy-endorsements',
    templateUrl: 'policyEndorsements.html'
})
export class PolicyEndorsementsComponent implements OnInit, AfterContentInit {
    public travelPolicyFormGroup: FormGroup;
    policyService;
    _formBuilder: FormBuilder;
    _router;
    _quotEnquiryinfo;
    loadingSub;
    _utilsServices;
    _quoteinfo: QuotInfo;
    errors = [];
    isError = false;
    plans: PlanInfo;
    documentInfo: DocumentInfo;
    planDetail: PlanDetailsInfo;
    productCd;
    policyCoverageInfo: PolicyCoverageInfo;
    public endtFormData: any;
    public isPolicyTypeAnnual: boolean = false;
    public isHolderTypeIndividual: boolean = true;
    public isCollapsedTr: boolean = false;
    public identityNumberLabel: string = '';
    public identityNumber: string = '';
    public planPremium: any;
    public amtFormat: AmountFormat;
    isFormGroupValid: boolean = true;
    endtReasonCode: string = '';
    // primaryEndorsementType: string = ''
    // endorsementPrimaryType: any[] = [
    //     { code: '10', desc: 'Financial Endorsement' },
    //     { code: '23', desc: 'Non-Financial Endorsement' },
    //     { code: '08', desc: 'CANCEL' }
    // ]
    constructor(public _travelPolicyFB: FormBuilder,
        _policyService: PolicyService,
        breadCrumbService: BreadCrumbService,
        public _logger: Logger,
        router: Router,
        _loaderConfigService: ConfigService,
        utilsServices: UtilsService,
        shared?: SharedService) {

        this.policyService = _policyService;
        this._router = router;

        this.loadingSub = _loaderConfigService;
        this._utilsServices = utilsServices;
        breadCrumbService.addRouteName('/ncp/transaction/endorsement', [{ 'name': 'Policy Endorsement' }]);
        let quoteModelInstance = new DefaultPolicyModel(_travelPolicyFB);
        this._quoteinfo = quoteModelInstance.getQuotInfo();
        this.plans = quoteModelInstance.getPlanInfo();
        this.documentInfo = quoteModelInstance.getDocumentInfo();
        this.planDetail = quoteModelInstance.getPlanDetailsInfo();
        this.policyCoverageInfo = quoteModelInstance.getPolicyCoverageInfo();
        this.amtFormat = new AmountFormat(this.loadingSub);
    }
    ngOnInit() {
        window.scroll(250, 250);
        this.travelPolicyFormGroup = this._quoteinfo.getTRLQuotInfoModel();
        //  this.quotEnquiryFormGroup = this._quotEnquiryinfo.getquoteEnquiryInfoModel();
    }

    ngAfterContentInit() {
        let dataObj = this.loadingSub.getCustom('END');
        if (dataObj !== null && dataObj !== undefined) {
            this.endtFormData = dataObj;
            if (this.endtFormData.customerInfo.identityNo) {
                this.identityNumberLabel = 'NCPLabel.identityNo';
                this.identityNumber = this.endtFormData.customerInfo.identityNo;
            }
            this.travelPolicyFormGroup = this.updateQuoteInfoValue(dataObj);
            if (this.endtFormData.customerInfo.policyHolderType === 'I') {
                this.isHolderTypeIndividual = true;
            } else {
                this.isHolderTypeIndividual = false;
            }
            if (this.endtFormData.policyInfo.policyTerm === '01') {
                // this.endtFormData.policyInfo.policyTermDesc = 'Annual Trip';
                this.isPolicyTypeAnnual = true;
            } else {
                // this.endtFormData.policyInfo.policyTermDesc = 'Single Trip';
                this.isPolicyTypeAnnual = false;
            }
        }
        this.travelPolicyFormGroup.controls['policyInfo'].get('endtReasonCode').setValue('');
        this.travelPolicyFormGroup.controls['policyInfo'].get('endtReasonCode').setValidators(Validators.compose([Validators.required]));
        this.travelPolicyFormGroup.controls['policyInfo'].get('endtReasonCode').updateValueAndValidity();
        // this.travelPolicyFormGroup.controls['policyInfo'].get('endtPrimaryReasonCode').setValue('');
        // this.travelPolicyFormGroup.controls['policyInfo'].get('endtPrimaryReasonCode').setValidators(Validators.compose([Validators.required]));
        // this.travelPolicyFormGroup.controls['policyInfo'].get('endtPrimaryReasonCode').updateValueAndValidity();
        // this.travelPolicyFormGroup.controls['policyInfo'].get('endtPrimaryReasonCode').valueChanges.subscribe(data => {
        //     this.primaryEndorsementType = this.travelPolicyFormGroup.controls['policyInfo'].get('endtPrimaryReasonCode').value;
        //     if (this.primaryEndorsementType !== null && this.primaryEndorsementType !== undefined) {
        //         this.isFormGroupValid = false;                
        //     }
        // });
        if (!isNaN(parseFloat(this.endtFormData.summaryInfo.premiumPrime)))
            this.planPremium = this.amtFormat.transform(parseFloat(this.endtFormData.summaryInfo.premiumPrime), []);
        this.travelPolicyFormGroup.controls['policyInfo'].get('endtReasonCodeDesc').valueChanges.subscribe(data => {
            if (data) {
                let endtReasonCodeDesc = this.travelPolicyFormGroup.controls['policyInfo'].get('endtReasonCodeDesc').value;
                let ncpEndtReasonCode = this.travelPolicyFormGroup.controls['policyInfo'].get('endtReasonCode').value;
                this.travelPolicyFormGroup.controls['policyInfo'].get('ncpEndtReasonCode').setValue(ncpEndtReasonCode);
                this.loadingSub.setCustom('NCPENDT', ncpEndtReasonCode);
                let endtReasonCode = this._utilsServices.getEndorsementFGCode(ncpEndtReasonCode);
                if (endtReasonCode !== null && endtReasonCode !== undefined && endtReasonCode !== "" && endtReasonCode !== this.endtReasonCode) {
                    this.isFormGroupValid = false;
                    this.endtReasonCode = endtReasonCode;
                    this.doEndorsement(endtReasonCode, endtReasonCodeDesc);
                }
            }
        });

    }
    updateQuoteInfoValue(dataInput) {
        this.travelPolicyFormGroup.patchValue(dataInput);
        this.travelPolicyFormGroup.updateValueAndValidity();
        //  this.travelPolicyFormGroup.controls['summaryInfo'].patchValue(dataInput.summaryInfo);
        //  this.travelPolicyFormGroup.controls['summaryInfo'].updateValueAndValidity();
        this.travelPolicyFormGroup.controls['customerInfo'].patchValue(dataInput.customerInfo);
        this.travelPolicyFormGroup.controls['customerInfo'].updateValueAndValidity();
        this.travelPolicyFormGroup.controls['policyInfo'].patchValue(dataInput.policyInfo);
        this.travelPolicyFormGroup.controls['policyInfo'].updateValueAndValidity();
        this.updatePlanDatas(dataInput);
        return this.travelPolicyFormGroup;
    }
    public updatePlanDatas(dataValInput) {
        let tempFormGroup;
        let riskInfoArray: any = this.travelPolicyFormGroup.controls['riskInfo'];
        let travellerType = riskInfoArray.at(0);
        tempFormGroup = travellerType;
        let i = 0;
        if (dataValInput.riskInfo[0].plans.length > tempFormGroup.controls['plans'].length) {
            if (tempFormGroup.controls['plans'].length > 0) {
                for (let j = 0; j < tempFormGroup.controls['plans'].length; j++) {
                    tempFormGroup.controls['plans'].removeAt(j);
                }
            }
            dataValInput.riskInfo[0].plans.forEach(element => {
                if (i >= 0) {
                    tempFormGroup.controls['plans'].push(this.plans.getPlanInfoModel());
                    if (element.planDetails !== null && element.planDetails !== undefined) {
                        element.planDetails.forEach(detail => {
                            tempFormGroup.controls['plans'].at(i).controls['planDetails'].push(this.planDetail.getPlanDetailsInfoModel());
                        });
                    }
                    if (element.policyCovgInfo !== null && element.policyCovgInfo !== undefined) {
                        element.policyCovgInfo.forEach(detail => {
                            tempFormGroup.controls['plans'].at(i).controls['policyCovgInfo'].push(this.policyCoverageInfo.getPolicyCoverageInfoModel());
                        });
                    }
                }
                i++;
            });
        }
        tempFormGroup.patchValue(dataValInput.riskInfo[0]);
        tempFormGroup.controls['plans'].patchValue(dataValInput.riskInfo[0].plans);
        tempFormGroup.controls['plans'].updateValueAndValidity();
        return tempFormGroup;
    }
    navigateRouterLink(routerUrl: any) {
        this.loadingSub.navigateRouterLink(routerUrl);
    }
    covertypeSelected() {
        return this.endtFormData.riskInfo[0].travellerTypeCode === 'FAM' || this.endtFormData.riskInfo[0].travellerTypeCode === 'GRP'
    }
    covertypeParamEndorsementType() {
        // return this.covertypeSelected() ? 'O' : 'I';
        return this.endtFormData.riskInfo[0].travellerTypeCode != undefined ? this.endtFormData.riskInfo[0].travellerTypeCode : '';
    }

    isShowTableFlag = false;
    doEndorsement(endtReasonCode, endtReasonCodeDesc) {
        this.loadingSub.setCustom('END', '');
        this.endtFormData.policyInfo.endtReasonCode = endtReasonCode;
        this.endtFormData.policyInfo.endtReasonCodeDesc = endtReasonCodeDesc;
        this.endtFormData.policyInfo.ncpEndtReasonCode = this.travelPolicyFormGroup.controls['policyInfo'].get('endtReasonCode').value;

        let endtDefaultingResponse = this.policyService.doEndorsementDefaultingInfo(this.endtFormData);
        endtDefaultingResponse.subscribe(
            (endorsementDefaultingInfo) => {
                if (endorsementDefaultingInfo.error !== null && endorsementDefaultingInfo.error !== undefined && endorsementDefaultingInfo.error.length >= 1) {
                    // this._logger.error('doEndorsement()===>' + endorsementDefaultingInfo.error);
                    this.isError = true;
                    this.errors = [];
                    for (let i = 0; i < endorsementDefaultingInfo.error.length; i++) {
                        if (endorsementDefaultingInfo.error[i].errCode) {
                            this.errors.push({ 'errCode': endorsementDefaultingInfo.error[i].errCode, 'errDesc': endorsementDefaultingInfo.error[i].errDesc });
                        }
                    }
                } else {
                    let queryParams = { productCode: this.endtFormData.policyInfo.productCd, eventType: 'PEND', transactionType: 'PO' };
                    this._logger.log('endorsementDefaultingInfo', endorsementDefaultingInfo);
                    this.loadingSub.setCustom('END', endorsementDefaultingInfo);
                    let routeUrl = this._utilsServices.getLOBRoute(this.endtFormData.policyInfo.productCd);
                    this.loadingSub.navigateRouterLink(routeUrl, queryParams);
                }
                this.loadingSub.setLoadingSub('no');
            },
            (error) => {
                this._logger.error(error);
            });
    }
}
