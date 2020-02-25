import { Injectable } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { UtilsService } from '../../utils/utils.service';

@Injectable()
export class PlanService {
  planJson;
  config: ConfigService;
  utilsServices: UtilsService;

  constructor(config: ConfigService, utilsServices: UtilsService) {
    this.config = config;
    this.utilsServices = utilsServices;
    this.setPlan(this.getPlanJson());
  }

  get(key) {
    return this.planJson['plans'][key] ? this.planJson['plans'][key] : null;
  }

  getPlanJson() {
    // return this.config.ncpJsonCall('assets/config/favPlan.json');
    return this.utilsServices.getFavPlan();
  }

  setPlan(plan){
    this.planJson = plan;
  }
}
