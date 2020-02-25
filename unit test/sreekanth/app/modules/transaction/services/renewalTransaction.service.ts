/**
 * It imports TransactionService class for common dependencies 
 * related to Policy for all the products
 * @summary   Common Policy Service Class
 * @link      ncpapp\src\app\modules\transaction\services\policyComponent.ts
 * @class     RenewalTransactionService
 */
import { Injectable } from '@angular/core';
import { TransactionService } from "./transaction.service";
import { EndorsementTypes } from '../endorsement/endorsementTypes';
import { RenewalService } from '../services/renewal.service';

@Injectable()
export class RenewalTransactionService {
    isPolicyFlag: boolean = false;
    isRenewalFlag: boolean = true;
    public endtReasonCode: string;
    endorsementTypes: EndorsementTypes;
    service: RenewalService;
    public noPaymentRequiredFlag: boolean = false;
    public isRefundFlag: boolean = false;
    public hasStatusNew = false;
    public openHeldDataStorageString: string = 'REN';
    public overrideEndorsementElements: boolean = false;
    public isPolicyRatingDone: boolean = true;
    public isPolicyHeld: boolean = false;
    public selectedCoverageIndex: any;
    public isQuoteRatingDone: boolean = false;
    public get breadCrumbPrevRoute() {
        return this.transaction.status === 'Enquiry' ? { 'name': 'NCPBreadCrumb.activity', redirectUrl: '/ncp/activity' } : { 'name': 'NCPBreadCrumb.quotation' };
    }
    constructor(public transaction: TransactionService,
        _endorsementTypes: EndorsementTypes,
        public renewalService: RenewalService
    ) {
        this.endorsementTypes = _endorsementTypes;
    }

    public getProductJSON(productCode, templateFileName) {
        this.transaction.productCode = productCode.toLowerCase();
        let templateName = templateFileName.toLowerCase();
        if (this.transaction.status === 'renewalOpenheld')
        return this.transaction.configService.getProductElements(templateName);
        if (this.transaction.status === 'REN_WOC')
        return this.transaction.configService.getRenewalElements(templateName)
    }

    private setServiceInstance() {
        this.service = this.renewalService;
    }
    public getServiceInstance(): RenewalService {
        return this.renewalService;
    }
    
    public setDeclarations() {
        let productDeclaration = this.transaction.getProductDetails()[0]['declarations'];
        if (productDeclaration
            && productDeclaration['QT']) {
            this.transaction.importantNotice = productDeclaration['QT'][0];
            this.transaction.personalDataProtectionActStatement = productDeclaration['QT'][1];
            this.transaction.warrantyAndDeclaration = productDeclaration['QT'][2];
        }
        if (productDeclaration && productDeclaration['headings']) this.transaction.setDeclarationHeaders(productDeclaration['headings']);
    }
}
