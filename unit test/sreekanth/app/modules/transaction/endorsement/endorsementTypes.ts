import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Injectable()
export class EndorsementTypes {
    logger: Logger;
    utilsServices: UtilsService;
    public endorsementTypesJson: Object;
    public policyEndorsementFormGroup: FormGroup;
    public isAddDeleteInsuredPerson: boolean = false;
    public isCancel: boolean = false;
    public isChangeInCover: boolean = false;
    public isChangeInsuredPersonDetails: boolean = false;
    public isChangePeriod: boolean = false;
    public isDeleteItem: boolean = false;
    public isAddItem: boolean = false;
    public isReinstate: boolean = false;
    public isChangeInPremium: boolean = false;
    public isOthers: boolean = false;
    public productCode: string = '';
    constructor(public _logger: Logger, _utilsServices: UtilsService) {
        this.logger = _logger;
        this.utilsServices = _utilsServices;
    }

    public getEndorsementType(policyFormGroup, endtInputType, doEnable: boolean = true, productCode?: string) {
        this.policyEndorsementFormGroup = null;
        this.isAddDeleteInsuredPerson = false;
        this.isCancel = false;
        this.isChangeInCover = false;
        this.isChangeInsuredPersonDetails = false;
        this.isChangePeriod = false;
        this.isDeleteItem = false;
        this.isAddItem = false;
        this.isReinstate = false;
        this.isChangeInPremium = false;
        this.isOthers = false;
        if (productCode) this.productCode = productCode;
        switch (endtInputType) {
            case this.utilsServices.getEndorsementNCPTypeCode('CANCEL'):
                this.logger.log('Cancel');
                this.isCancel = true;
                this.policyEndorsementFormGroup = this.doCancelEndorsement(policyFormGroup, doEnable);
                break;
            case this.utilsServices.getEndorsementNCPTypeCode('ADD_DELETE_INSURED_PERSON'):
                this.logger.log('Add/Delete Insured');
                this.isAddDeleteInsuredPerson = true;
                this.policyEndorsementFormGroup = this.doAddDeleteInsuredEndorsement(policyFormGroup, doEnable);
                break;
            case this.utilsServices.getEndorsementNCPTypeCode('CHANGE_INSURED_PERSONAL_DETAILS'):
                this.logger.log('Change Insured Personal Details');
                this.isChangeInsuredPersonDetails = true;
                this.policyEndorsementFormGroup = this.doChangeInsuredPersonalDetailsEndt(policyFormGroup, doEnable);
                break;
            // case this.utilsServices.getEndorsementNCPTypeCode('ADD_DELETE_PLAN'):
            //     this.logger.log('Add/ Delete Plan');
            //     this.policyEndorsementFormGroup = this.doCancelEndorsement(policyFormGroup, doEnable);
            //     break;

            case this.utilsServices.getEndorsementNCPTypeCode('CHANGE_IN_COVER'):
                this.logger.log('Change in Cover');
                this.isChangeInCover = true;
                this.policyEndorsementFormGroup = this.doChangeCoverEndorsement(policyFormGroup, doEnable);
                break;

            case this.utilsServices.getEndorsementNCPTypeCode('CHANGE_PERIOD'):
                this.logger.log('Change Period');
                this.isChangePeriod = true;
                this.policyEndorsementFormGroup = this.doChangePeriodEndorsement(policyFormGroup, doEnable);
                break;

            case this.utilsServices.getEndorsementNCPTypeCode('DELETE_ITEM'):
                this.isDeleteItem = true;
                this.logger.log('DELETE_ITEM');
                this.policyEndorsementFormGroup = this.doDeleteItemEndorsement(policyFormGroup, doEnable);
                break;

            case this.utilsServices.getEndorsementNCPTypeCode('ADD_ITEM'):
                this.logger.log('ADD_ITEM');
                this.isAddItem = true;
                this.policyEndorsementFormGroup = policyFormGroup;
                break;
            case this.utilsServices.getEndorsementNCPTypeCode('REINSTATE'):
                this.logger.log('REINSTATE');
                this.isReinstate = true;
                this.policyEndorsementFormGroup = policyFormGroup;
                break;
            case this.utilsServices.getEndorsementNCPTypeCode('CHANGE_IN_PREMIUM'):
                this.logger.log('CHANGE_IN_PREMIUM');
                this.isChangeInPremium = true;
                this.policyEndorsementFormGroup = policyFormGroup;
                break;
            case this.utilsServices.getEndorsementNCPTypeCode('OTHERS'):
                this.logger.log('OTHERS');
                this.isOthers = true;
                this.policyEndorsementFormGroup = policyFormGroup;
                break;
            case this.utilsServices.getEndorsementNCPTypeCode('CHANGE_IN_INSURED_ADDRESS'):
                this.logger.log('CHANGE_IN_INSURED_ADDRESS');
                this.policyEndorsementFormGroup = policyFormGroup;
                break;
            case this.utilsServices.getEndorsementNCPTypeCode('ADD_DELETE_COVERAGE'):
                this.logger.log('ADD_DELETE_COVERAGE');
                this.policyEndorsementFormGroup = policyFormGroup;
                break;
            case this.utilsServices.getEndorsementNCPTypeCode('CHANGE_IN_SUM_INSURED'):
                this.logger.log('CHANGE_IN_SUM_INSURED');
                this.policyEndorsementFormGroup = policyFormGroup;
                break;      
            default:
                this.logger.log('Sorry, Default...');
                this.policyEndorsementFormGroup = policyFormGroup;
                break;
        }
        return this.policyEndorsementFormGroup;
    }
    doCancelEndorsement(inputFormGroup: FormGroup, doEnable: boolean) {
        // let coverFromDate = inputFormGroup.controls['policyInfo'].get('inceptionDt').value;
        // inputFormGroup.controls['policyInfo'].get('effectiveDt').patchValue(coverFromDate);
        // inputFormGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
        // if (doEnable) inputFormGroup.controls['policyInfo'].get('effectiveDt').enable();
        // else inputFormGroup.controls['policyInfo'].get('effectiveDt').disable();
        // if (!doEnable)
        //     this.doDisablePlanList(inputFormGroup);
        return inputFormGroup;
    }
    doDeleteItemEndorsement(inputFormGroup: FormGroup, doEnable: boolean) {
        
        return inputFormGroup;
    }
    doChangePeriodEndorsement(inputFormGroup: FormGroup, doEnable: boolean) {
        // let coverFromDate = inputFormGroup.controls['policyInfo'].get('inceptionDt').value;
        // inputFormGroup.controls['policyInfo'].get('effectiveDt').patchValue(coverFromDate);
        // inputFormGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
        // if (doEnable) {
        //     inputFormGroup.controls['policyInfo'].get('inceptionDt').enable();
        //     inputFormGroup.controls['policyInfo'].get('expiryDt').enable();
        //     inputFormGroup.controls['policyInfo'].get('durationInDays').enable();
        //     inputFormGroup.controls['policyInfo'].get('effectiveDt').enable();
        // } else {
        //     inputFormGroup.controls['policyInfo'].get('inceptionDt').disable();
        //     inputFormGroup.controls['policyInfo'].get('expiryDt').disable();
        //     inputFormGroup.controls['policyInfo'].get('durationInDays').disable();
        //     inputFormGroup.controls['policyInfo'].get('effectiveDt').disable();
        //     this.doDisableInsuredList(inputFormGroup);
        //     this.doDisablePlanList(inputFormGroup);
        // }

        return inputFormGroup;
    }
    doAddDeleteInsuredEndorsement(inputFormGroup: FormGroup, doEnable: boolean) {
        if (doEnable) inputFormGroup.controls['policyInfo'].get('effectiveDt').enable();
        //else inputFormGroup.controls['policyInfo'].get('effectiveDt').disable();
        let tempFormGroup;
        let riskInfoArray: any = inputFormGroup.controls['riskInfo'];
        let riskInfoObject = riskInfoArray.at(0);
        tempFormGroup = riskInfoObject;
        if (doEnable) {
            // tempFormGroup.get('numberofAdults').enable();
            // tempFormGroup.get('numberofChildren').enable();
        } else {
            // tempFormGroup.get('numberofAdults').disable();
            // tempFormGroup.get('numberofChildren').disable();
            this.doDisableInsuredList(inputFormGroup);
            // this.doDisablePlanList(inputFormGroup);
        }
        // riskInfoArray.at(0).patchValue(tempFormGroup);
        // riskInfoArray.at(0).updateValueAndValidity();
        // inputFormGroup.controls['riskInfo'] = riskInfoArray;
        // inputFormGroup.controls['riskInfo'].updateValueAndValidity();
        return inputFormGroup;
    }
    doChangeInsuredPersonalDetailsEndt(inputFormGroup: FormGroup, doEnable: boolean) {
        // let coverFromDate = inputFormGroup.controls['policyInfo'].get('inceptionDt').value;
        // inputFormGroup.controls['policyInfo'].get('effectiveDt').patchValue(coverFromDate);
        // inputFormGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
        // if (doEnable) inputFormGroup.controls['policyInfo'].get('effectiveDt').enable();
        // else inputFormGroup.controls['policyInfo'].get('effectiveDt').disable();
        // let policyHolderType = inputFormGroup.controls['customerInfo'].get('policyHolderType').value;
        // let tempFormGroup;
        // let riskInfoArray: any = inputFormGroup.controls['riskInfo'];
        // let riskInfoObject = riskInfoArray.at(0);
        // tempFormGroup = riskInfoObject;
        // if (doEnable) this.doEnableInsuredList(tempFormGroup);
        // // else this.doDisableInsuredList(inputFormGroup);
        // riskInfoArray.at(0).patchValue(tempFormGroup);
        // riskInfoArray.at(0).updateValueAndValidity();
        // inputFormGroup.controls['riskInfo'] = riskInfoArray;
        // inputFormGroup.controls['riskInfo'].updateValueAndValidity();

        // if (policyHolderType === 'I') {
        //     let isPolicyHolderInsuredFlag = inputFormGroup.controls['customerInfo'].get('isPolicyHolderInsured').value;
        //     if (isPolicyHolderInsuredFlag !== false) {
        //         if (doEnable) inputFormGroup.get('customerInfo').enable();
        //         // else inputFormGroup.get('customerInfo').disable();
        //     }
        // } else {

        // }
        return inputFormGroup;
    }
    doChangeCoverEndorsement(inputFormGroup: FormGroup, doEnable: boolean) {
        // let coverFromDate = inputFormGroup.controls['policyInfo'].get('inceptionDt').value;
        // inputFormGroup.controls['policyInfo'].get('effectiveDt').patchValue(coverFromDate);
        // inputFormGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
        // if (doEnable) inputFormGroup.controls['policyInfo'].get('effectiveDt').enable();
        // else inputFormGroup.controls['policyInfo'].get('effectiveDt').disable();
        // let tempFormGroup;
        // let riskInfoArray: any = inputFormGroup.controls['riskInfo'];
        // let riskInfoObject = riskInfoArray.at(0);
        // tempFormGroup = riskInfoObject;
        // if (doEnable) {
        //     tempFormGroup.get('travellingTo').enable();
        //     tempFormGroup.get('regionCode').enable();
        //     // if (tempFormGroup.controls['plans'].at(0).get('planTypeCode') && tempFormGroup.controls['plans'].at(0).get('planTypeDesc')) {
        //     //     tempFormGroup.controls['plans'].at(0).get('planTypeCode').enable();
        //     // }
        //     inputFormGroup.controls['policyInfo'].get('effectiveDt').enable();
        // } else {
        //     tempFormGroup.get('travellingTo').disable();
        //     tempFormGroup.get('regionCode').disable();
        //     // if (tempFormGroup.controls['plans'].at(0).get('planTypeCode') && tempFormGroup.controls['plans'].at(0).get('planTypeDesc')) {
        //     //     tempFormGroup.controls['plans'].at(0).get('planTypeCode').disable();
        //     // }
        //     this.doDisableInsuredList(inputFormGroup);
        //     this.doDisablePlanList(inputFormGroup);

        //     inputFormGroup.controls['policyInfo'].get('effectiveDt').disable();
        // }
        // riskInfoArray.at(0).patchValue(tempFormGroup);
        // riskInfoArray.at(0).updateValueAndValidity();
        // inputFormGroup.controls['riskInfo'] = riskInfoArray;
        // inputFormGroup.controls['riskInfo'].updateValueAndValidity();
        return inputFormGroup;
    }
    doAddDeletePlanEndorsement(inputFormGroup: FormGroup, doEnable: boolean) {
        // let coverFromDate = inputFormGroup.controls['policyInfo'].get('inceptionDt').value;
        // inputFormGroup.controls['policyInfo'].get('effectiveDt').patchValue(coverFromDate);
        // inputFormGroup.controls['policyInfo'].get('effectiveDt').updateValueAndValidity();
        return inputFormGroup
    }
    doEnableInsuredList(inputFormGroup) {
        let insuredListLength = inputFormGroup.controls['insuredList'].length;
        for (let i = 0; i < insuredListLength; i++) {
            inputFormGroup.controls['insuredList'].at(i).enable();
        }
        return inputFormGroup;
    }
    doDisableInsuredList(inputFormGroup) {
        let tempFormGroup;
        let riskInfoArray: any = inputFormGroup.controls['riskInfo'];
        for (let j = 0; j < riskInfoArray.length; j++) {
            let riskInfoObject = riskInfoArray.at(j);
            tempFormGroup = riskInfoObject;
            // let insuredListLength = tempFormGroup.controls['insuredList'].length;
            // for (let i = 0; i < insuredListLength; i++) {
            //     tempFormGroup.controls['insuredList'].at(i).disable();
            // }
            // tempFormGroup.controls['insuredList'].disable();
            // riskInfoArray.at(0).patchValue(tempFormGroup);
            // riskInfoArray.at(0).updateValueAndValidity();
            // riskInfoArray.at(0).disable();
            // inputFormGroup.controls['riskInfo'] = riskInfoArray;
            // inputFormGroup.controls['riskInfo'].updateValueAndValidity();
            // inputFormGroup.controls['riskInfo'].disable();
            // if (inputFormGroup.valid) {
            let insuredListLength = tempFormGroup.controls['insuredList'].length;
            for (let i = 0; i < insuredListLength; i++) {
                tempFormGroup.controls['insuredList'].at(i).disable();
            }
            tempFormGroup.controls['insuredList'].disable();
        }
        // }
    }
    doDisablePlanList(inputFormGroup) {
        let tempFormGroup: any;
        let riskInfoArray: any = inputFormGroup.controls['riskInfo'];
        let riskInfoObject: any = riskInfoArray.at(0);
        tempFormGroup = riskInfoObject;
        let plansListLength = tempFormGroup.controls['plans'].length;
        for (let i = 0; i < plansListLength; i++) {
            tempFormGroup.controls['plans'].at(i).disable();
        }
        tempFormGroup.controls['plans'].disable();
        riskInfoArray.at(0).patchValue(tempFormGroup);
        riskInfoArray.at(0).updateValueAndValidity();
        riskInfoArray.at(0).disable();
        inputFormGroup.controls['riskInfo'] = riskInfoArray;
        inputFormGroup.controls['riskInfo'].updateValueAndValidity();
        inputFormGroup.controls['riskInfo'].disable();
        return inputFormGroup;
    }
}

