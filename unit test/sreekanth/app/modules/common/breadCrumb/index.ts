export * from './services/breadcrumb.service';
export * from './breadCrumb.component';
import {BreadCrumbService } from './services/breadcrumb.service';

const BREADCRUMB_PROVIDERS = [BreadCrumbService];
export {
    BREADCRUMB_PROVIDERS
};