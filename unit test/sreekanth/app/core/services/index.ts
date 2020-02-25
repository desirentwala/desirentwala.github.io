import { FavoriteService } from '../../modules/common/services/favorite.service';
import { DashBoardService } from '../../modules/common/services/dashboard.service';
import { ReportService } from '../../modules/common/reports/services/report.service';
import { NewsService } from '../../modules/news-announcement/services/news.service';
import { UserFormService } from './../../modules/userManagement/services/userform.service';
import { ProductDetailsService } from './../../modules/product/services/product.service';
import { AuthGuard } from '../../auth/gaurd/index';
import { REQUEST_SERVICES } from './config.service';
import { PICKLIST_SERVICES, SCREEN_MANIPULATOR_SERVICES } from '../../modules/common/index';
import { LOGGER_SERVICES } from '../ui-components/logger/logger';
import { UTILS_SERVICES } from '../ui-components/utils/utils.service';
import { EventService } from './event.service';
import { B2B2CServices } from '../../b2b2c/services/b2b2c.service';
import { B2CServices } from '../../b2c/service/b2c.service';
import { PaymentService } from '../ui-components/payment/payment.service';
import { QUOT_SERVICES } from '../../modules/transaction/index';
import { CLAIM_SERVICES } from '../../modules/claims';
import { COMMON_SERVICES } from './common.service';

export const APP_SERVICES = [
	COMMON_SERVICES,
    REQUEST_SERVICES,
    AuthGuard,
    PICKLIST_SERVICES,
    UTILS_SERVICES,
    LOGGER_SERVICES,
    EventService,
    B2CServices,
    B2B2CServices,
    ProductDetailsService,
    UserFormService,
    ReportService,
    NewsService,
    DashBoardService,
    FavoriteService,
    QUOT_SERVICES,
    CLAIM_SERVICES,
    PaymentService,
    SCREEN_MANIPULATOR_SERVICES
];
