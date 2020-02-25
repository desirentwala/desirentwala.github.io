import { RenewalService } from './services/renewal.service';
import { RenewalTransactionService } from './services/renewalTransaction.service';
import { customerService } from '../customer/services/customer.service';
import { TransactionService } from './services/transaction.service';
import { QuoteTransactionService } from './services/quotetransaction.service';
import { PolicyTransactionService } from './services/policytransaction.service';
import { QuotService } from './services/quote.service';
import { PolicyService } from './services/policy.service';
import { EndorsementTypes } from './endorsement/endorsementTypes';
/**
 * This barrel file provides the export for the lazy loaded Quote Component.
 */
export * from './transaction.routes';
export * from './services/quote.service';
export * from './services/policy.service';

const QUOT_SERVICES = [QuotService, PolicyService, customerService, TransactionService, QuoteTransactionService, PolicyTransactionService, EndorsementTypes, RenewalTransactionService, RenewalService];

export {
    QUOT_SERVICES,
};