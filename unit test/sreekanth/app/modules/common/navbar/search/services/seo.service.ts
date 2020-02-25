import { ConfigService } from '../../../../../core/services/config.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SEOSearchService {

    constructor(public config: ConfigService) { }


    getQuoteSEOsearch(filterString) {
        return this.config.ncpRestServiceCall('quote/quoteSearchEngine', { 'filterString': filterString });
    }

    getPolicySEOsearch(filterString) {
        return this.config.ncpRestServiceCall('policy/policySearchEngine', { 'filterString': filterString });
    }
    getClaimsSEOsearch(filterString) {
        return this.config.ncpRestServiceCall('claim/claimSearchEngine', { 'filterString': filterString });
    }
    getRenewalSEOsearch(filterString) {
        return this.config.ncpRestServiceCall('policy/policySearchEngine', { 'filterString': filterString });
    }
    getAccountSEOsearch(inputJson) {
        return this.config.ncpRestServiceCall('customer/retrieveAccountDetails', inputJson);
    }

}