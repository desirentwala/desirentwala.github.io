import { AbstractFactory } from "./abstractfactory";
import { DefaultPolicyModel } from "../../modules/common/services/defaultModel.service";
import { DefaultClaimModel } from "../../modules/claims/services/defaultClaimmodel";

/** 
 * Extend ProductFactory to initialize Country/Customer specific models.
*/
export class ProductFactory extends AbstractFactory {
    country_code = '';
    breadcrumbRoute = '/ncp/';
    constructor(component: any) {
        super(component);
    }

    getPolicyModelInstance(): DefaultPolicyModel {
        return new DefaultPolicyModel(this.component.formBuilder);
    }

    getClaimModelInstance(): DefaultClaimModel {
        return new DefaultClaimModel(this.component.formBuilder);
    }

    setCountryLayerEvents(){
        this.countryLayerEvents = {};
    }
}
