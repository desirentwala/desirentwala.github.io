/**
 * This barrel file provides the export for the lazy loaded Quot Component.
 */
export * from './fnol/fnol.validator';
export * from './claims.routes';
export * from './services/claim.service';
import { ClaimService } from './services/claim.service';
import { FnolValidator } from './fnol/fnol.validator';


const CLAIM_SERVICES = [ClaimService, FnolValidator];

export {
    CLAIM_SERVICES,
};