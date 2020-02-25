/**
 * It imports TransactionService class' for common dependencies 
 * related to Quotation for all the products
 * @summary   Common Quotation Class
 * @link      ncpapp\src\app\modules\transaction\services\quoteComponent.ts
 * @class     QuoteTransactionService
 */
import { Injectable } from '@angular/core';
import { TransactionService } from "./transaction.service";
import { QuotService } from '../services/quote.service';

@Injectable()
export class QuoteTransactionService {
    isPolicyFlag: boolean = false;
    public service: QuotService;
    public hasStatusNew = true;
    public openHeldDataStorageString: string = 'openHeld';
    public isPolicyRatingDone: boolean = true;
    public selectedCoverageIndex: any;
    public isQuoteRatingDone: boolean = false;
    public get breadCrumbPrevRoute() {
        return this.transaction.status === 'Enquiry' ? { 'name': 'NCPBreadCrumb.activity', redirectUrl: '/ncp/activity' } : { 'name': 'NCPBreadCrumb.quotation' };
    }
    constructor(public transaction: TransactionService,
        public quoteService: QuotService) {
    }

    public getProductJSON(productCode, templateFileName) {
        this.transaction.productCode = productCode;
        let templateName = templateFileName.toLowerCase();
        return this.transaction.configService.getProductElements(templateName);
    }

    public getServiceInstance(): QuotService {
        return this.quoteService;
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
    handleFileNotFound() { }
}
