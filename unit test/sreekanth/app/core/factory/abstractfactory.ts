import { DefaultClaimModel } from '../../modules/claims/services/defaultClaimmodel';
import { DefaultPolicyModel } from '../../modules/common/services/defaultModel.service';
import { IModel } from '../services/iModel.service';
import { EventConstants } from '../../modules/transaction/constants/ncpEvent.constants';

/**
 * This is an abstraction of all the factory. 
 * @summary AbstractFactory
 * @requires FormBuilder
 * @class AbstractFactory
 */

export abstract class AbstractFactory {
    protected component;
    protected country_code;
    protected breadcrumbRoute;
    protected eventConstants: any = EventConstants;
    public countryLayerEvents;

    constructor(component ) {
        this.component = component;
    }
    public abstract getPolicyModelInstance(): IModel;
    public abstract getClaimModelInstance(): IModel;
    public abstract setCountryLayerEvents(): void;

    getCountryCode(){
        return this.country_code;
    }

    getBreadCrumbRoute(){
        return this.breadcrumbRoute;
    }

    getEventConstants() {
        this.setCountryLayerEvents();
        Object.assign(this.countryLayerEvents, this.eventConstants);
        return this.countryLayerEvents;
    }
}