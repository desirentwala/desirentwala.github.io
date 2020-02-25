import { UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';

import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { Subject } from '@adapters/packageAdapter';

@Injectable()
export class BreadCrumbService {

    public breadcrumbNames: Map<string, Array<any>> = new Map<string, Array<any>>();
    public i18nLang: Object = {};

    constructor(public logg: Logger, public config: ConfigService, public utils: UtilsService) {
    }
    /**
     * Specify a BreadCrumb names for the corresponding route.
     *
     * @param route
     * @param name
     */
    addRouteName(route: string, names: any[], isManual: boolean = false): void {
        let i18nName;
        let homeIndex = -1;

        // add respective home root for diff business 
        if (this.config.getCustom('b2cFlag')) {
            names.unshift({ name: 'NCPLabel.Home', redirectUrl: '/b2c' });
        } else if (this.config.getCustom('b2b2cFlag')) {
            names.unshift({ name: 'NCPLabel.Home', redirectUrl: '/b2b2c' });
        } else {
            names.unshift({ name: 'NCPLabel.Home', redirectUrl: '/ncp/home' });
        }
        this.setBreadCrumbName(route, names);
        if (isManual === true) {
            this.config.routeNameAddSub.next('addManually');
        }
        // this.logg.log('added Route ' + route + ' with Name ' + name);
    }

    setBreadCrumbName(route, names) {
        let breadCrumbsNames = this.config.getCustom('breadcrumbNames');
        if (breadCrumbsNames) {
            breadCrumbsNames[route] = names;
        } else {
            breadCrumbsNames = {};
            breadCrumbsNames[route] = names;
        }
        this.config.setCustom('breadcrumbNames', breadCrumbsNames);
    }

    getBreadCrumbNames() {
        return this.config.getCustom('breadcrumbNames');
    }


    /**
     * Show the BreadCrumb names for a given route (url). If no match is found ,the url (with the leading '/') is shown.
     *
     * @param route
     * @returns {*}
     */
    getRouteName(route: any) {
        if (route && !(route instanceof UrlTree)) {
            let breadcrumbName = [];
            let i = 1;
            let i18nName;
            breadcrumbName = [];
            let breadCrumbNames: Object = this.getBreadCrumbNames();
            if (breadCrumbNames && breadCrumbNames[route]) {
                breadcrumbName = breadCrumbNames[route];
            }
            if (breadcrumbName.length === 0) {
                let routeComps = route.substring(1).split('/');
                routeComps.forEach(routes => {

                    let breadCrumb: any = { name: '', redirectUrl: '' };
                    if (this.config.getCustom('b2cFlag')) {
                        if (routes === 'b2c' || routes === 'home') {
                            breadCrumb.name = 'NCPLabel.Home';
                            breadCrumb.redirectUrl = '/b2c';
                            breadCrumb.iconClass = 'fa fa-home';
                            breadcrumbName[0] = breadCrumb;
                        }
                    } else if (this.config.getCustom('b2b2cFlag')) {
                        if (routes === 'b2b2c') {
                            breadCrumb.name = 'NCPLabel.Home';
                            breadCrumb.redirectUrl = '/b2b2c';
                            breadCrumb.iconClass = 'fa fa-home';
                            breadcrumbName[0] = breadCrumb;
                        } else if (routes) {
                            breadCrumb.name = routes.charAt(0).toUpperCase() + routes.slice(1);
                            breadCrumb.redirectUrl = route;
                            breadcrumbName[i] = breadCrumb;
                            i++;
                        }
                    } else {
                        if (routes === 'ncp' || routes === 'home') {
                            breadCrumb.name = 'NCPLabel.Home';
                            breadCrumb.redirectUrl = '/ncp/home';
                            breadCrumb.iconClass = 'fa fa-home';
                            breadcrumbName[0] = breadCrumb;
                        } else if (routes) {
                            breadCrumb.name = routes.charAt(0).toUpperCase() + routes.slice(1);
                            breadCrumb.redirectUrl = route;
                            breadcrumbName[i] = breadCrumb;
                            i++;
                        }
                    }
                });
                breadcrumbName.forEach(breadCrumb => {
                    let name: string = breadCrumb.name;
                    if (name === 'NCPLabel.Home' || name === 'Home') {
                        i18nName = this.utils.getTranslated(name);
                    } else if (name.startsWith('NCP')) {
                        i18nName = this.utils.getTranslated(name);
                    } else {
                        name = name.charAt(0).toLowerCase() + name.slice(1);
                        name = name.split('?')[0];
                        i18nName = this.utils.getTranslated('NCPBreadCrumb.' + name);
                    }
                    if (i18nName) {
                        breadCrumb.name = i18nName;
                    } else {
                        breadCrumb.name = name;
                    }
                });
            }
            return breadcrumbName;
        }
    }

    navigate(url) {
        if (url) {
            this.config.routeNameAddSub.next('navigate');
            this.config.navigateRouterLink(url);
        }
    }
}
