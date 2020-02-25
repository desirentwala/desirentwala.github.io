import { SEOSearchService } from '../navbar/search/services/seo.service';
export * from './services/enquiry.services';
export * from './services/enquiry.servicesImpl';
import { EnquiryServices } from './services/enquiry.services';
import { EnquiryServicesImp } from './services/enquiry.servicesImpl';
import { OrderBy } from '../../../core/ui-components/table-filter/pipes/orderBy';

const ENQUIRY_SERVICES = [EnquiryServices, EnquiryServicesImp,OrderBy,SEOSearchService];

export {
    ENQUIRY_SERVICES
};