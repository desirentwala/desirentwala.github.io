import { FormGroup } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { Injectable, EventEmitter } from '@angular/core';
import { LocalStorageService } from '@adapters/packageAdapter';


@Injectable()
export class PaymentService {
    config: ConfigService;
    public disablePaymentButton : boolean= false ;
    public paymentPushedData = new EventEmitter<any>();
    public initPostEmitter = new EventEmitter<any>();
    public initRePostEmitter = new EventEmitter<any>();
    public initRefundEmitter = new EventEmitter<any>();
    public initPaymentEmitter = new EventEmitter<any>();
    batchSettlementInfoFormGroup: FormGroup;
    constructor(config: ConfigService, public localStorageService: LocalStorageService) {
        this.config = config;
    }

    getPaymentGatewayList() {
        let paymentGatewayListResponse = this.config.ncpRestServiceCall('payment/getPaymentGatewayList', '');
        return paymentGatewayListResponse;
    }
    getPaymentGatewayURL(input) {
        let paymentGatewayURLResponse = this.config.ncpRestServiceCall('payment/getPaymentURL', input);
        return paymentGatewayURLResponse;
    }
    getPaymentDetails(input) {
        let paymentGatewayResponse = this.config.ncpRestServiceWithoutLoadingSubCall('payment/getPaymentDetails', input);
        return paymentGatewayResponse;
    }
    getPaymentRefund(input) {
        let paymentRefundResponse = this.config.ncpRestServiceCall('payment/getPaymentRefund', input);
        return paymentRefundResponse;
    }
    getBatchPaymentPolicyList(inputJson) {
        let batchPaymentPolicyListResponse = this.config.ncpRestServiceCall('policy/getPoliciesForBatchPayment', inputJson);
        return batchPaymentPolicyListResponse;
    }

    doUpdatePostedPoliciesWithPaymentDetails(inputJson) {
        let updatePolicyResponse = this.config.ncpRestServiceCall('policy/updatePostedPoliciesWithPaymentDetails', inputJson);
        return updatePolicyResponse;
    }
    savePaymentDetails(inputJson) {
        let savePaymentDetails = this.config.ncpRestServiceCall('payment/savePaymentDetails?transRefNo='+inputJson['transRefNo'], inputJson);
        return savePaymentDetails;
    }

    updatedBatchSettlementInfo(paymentReferenceNo, batchSettlementInfoFormGroup) {
        this.batchSettlementInfoFormGroup = batchSettlementInfoFormGroup;
        this.batchSettlementInfoFormGroup.controls['transRefNo'].setValue(paymentReferenceNo);
        this.batchSettlementInfoFormGroup.controls['paymentInfo'].get('paymentType').setValue('CARD');
        this.batchSettlementInfoFormGroup.controls['paymentInfo'].get('paymentReferenceNo').setValue(paymentReferenceNo);
        this.batchSettlementInfoFormGroup.controls['paymentInfo'].get('payOn').setValue('BATCH');
        this.localStorageService.set('isBatchPayment', 'YES');
        this.localStorageService.set('batchSettlementInfoFormGroup', '');
        this.localStorageService.set('batchSettlementInfoFormGroup', this.batchSettlementInfoFormGroup.value);
        return this.batchSettlementInfoFormGroup;
    }
    getBatchSettleMentInfoFromLocalstorage() {
        if (this.localStorageService.get('isBatchPayment') === 'YES') {
            return this.localStorageService.get('batchSettlementInfoFormGroup');
        } else {
            return '';
        }

    }
}

export const PAYMENT_SERVICES = [
    PaymentService
];