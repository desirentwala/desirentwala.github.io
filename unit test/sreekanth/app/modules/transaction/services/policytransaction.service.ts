/**
 * It imports TransactionService class for common dependencies 
 * related to Policy for all the products
 * @summary   Common Policy Service Class
 * @link      ncpapp\src\app\modules\transaction\services\policyComponent.ts
 * @class     PolicyTransactionService
 */
import { Injectable } from '@angular/core';
import { TransactionService } from "./transaction.service";
import { EndorsementTypes } from '../endorsement/endorsementTypes';
import { PolicyService } from '../services/policy.service';

@Injectable()
export class PolicyTransactionService {
    isPolicyFlag: boolean = true;
    public endtReasonCode: string;
    public endorsementType: string;
    endorsementTypes: EndorsementTypes;
    service: PolicyService;
    public noPaymentRequiredFlag: boolean = false;
    public isRefundFlag: boolean = false;
    public hasStatusNew = false;
    public openHeldDataStorageString: string = 'END';
    public overrideEndorsementElements: boolean = false;
    public isPolicyRatingDone: boolean = true;
    public isQuoteRatingDone: boolean = false;
    public selectedCoverageCode: string[] = [];
    public isPolicyHeld: boolean = false;
    public selectedCoverageIndex: any;
    public newInsuredCorrespondingRiskIndex: number = 0;
    public get breadCrumbPrevRoute() {
        return { 'name': 'NCPBreadCrumb.activity', redirectUrl: '/ncp/activity' };
    }
    constructor(public transaction: TransactionService,
        _endorsementTypes: EndorsementTypes,
        public policyService: PolicyService
    ) {
        this.endorsementTypes = _endorsementTypes;
    }
    public getProductJSON(productCode, templateFileName) {
        let templateName = templateFileName.toLowerCase();
        this.transaction.productCode = productCode.toLowerCase();
        if (this.transaction.status === 'Enquiry')
            return this.transaction.configService.getProductElements(templateName);
        else {
            let dataObj = this.transaction.configService.getCustom(this.openHeldDataStorageString);
            let ncpEndtCode = this.transaction.configService.getCustom('NCPENDT');
            ncpEndtCode = dataObj.policyInfo.ncpEndtReasonCode ? dataObj.policyInfo.ncpEndtReasonCode : this.transaction.configService.getCustom('NCPENDT');
            if(ncpEndtCode === '' || ncpEndtCode === undefined ){
                if(dataObj.policyInfo.endtReasonCode === '00'){
                    ncpEndtCode = dataObj.policyInfo.endtReasonCode; 
                }
            }
            if (ncpEndtCode === '09' || ncpEndtCode === '10' || ncpEndtCode === '00') {
                return this.transaction.configService.getProductElements(templateName);
            } else {
                this.endorsementType = this.transaction.utilService.getEndorsementByCode(dataObj.policyInfo.endtReasonCode, ncpEndtCode);
                return this.transaction.configService.getEndorsementElements(this.endorsementType.toLowerCase(), this.transaction.productCode, this.overrideEndorsementElements);
            }
        }
    }

    private setServiceInstance() {
        this.service = this.policyService;
    }
    public getServiceInstance(): PolicyService {
        return this.policyService;
    }

    public setDeclarations() {
        let productDeclaration = this.transaction.getProductDetails()[0]['declarations'];
        if (this.transaction.status !== 'EndEnquiry') {
            if (productDeclaration
                && productDeclaration['QT']) {
                this.transaction.importantNotice = productDeclaration['QT'][0];
                this.transaction.personalDataProtectionActStatement = productDeclaration['QT'][1];
                this.transaction.warrantyAndDeclaration = productDeclaration['QT'][2];
            }
        } else {
            if (productDeclaration
                && productDeclaration['ENDT']
                && productDeclaration['ENDT'][this.endorsementType]
                && !productDeclaration['ENDT'][this.endorsementType]['content']) {
                this.transaction.importantNotice = productDeclaration['ENDT'][this.endorsementType][0];
                this.transaction.personalDataProtectionActStatement = productDeclaration['ENDT'][this.endorsementType][1];
                this.transaction.warrantyAndDeclaration = productDeclaration['ENDT'][this.endorsementType][2];
            } else if (productDeclaration
                && productDeclaration['ENDT']
                && productDeclaration['ENDT'][this.endorsementType]
                && productDeclaration['ENDT'][this.endorsementType]['content']) {
                this.transaction.importantNotice = productDeclaration['ENDT'][this.endorsementType]['content'][0];
                this.transaction.personalDataProtectionActStatement = productDeclaration['ENDT'][this.endorsementType]['content'][1];
                this.transaction.warrantyAndDeclaration = productDeclaration['ENDT'][this.endorsementType]['content'][2];
            }
        }
        if (productDeclaration && productDeclaration['headings'] && productDeclaration['ENDT'][this.endorsementType] && !productDeclaration['ENDT'][this.endorsementType]['headings']) {
            this.transaction.setDeclarationHeaders(productDeclaration['headings']);
        } else if (productDeclaration['ENDT'][this.endorsementType] && productDeclaration['ENDT'][this.endorsementType]['headings']) {
            this.transaction.setDeclarationHeaders(productDeclaration['ENDT'][this.endorsementType]['headings']);
        }
    }
    handleFileNotFound() {
        if (this.transaction.status !== 'Enquiry') return this.transaction.configService.getEndorsementElements(this.endorsementType.toLowerCase(), this.transaction.productCode, false);
    }
}
