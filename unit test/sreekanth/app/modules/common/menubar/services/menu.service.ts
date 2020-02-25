import { B2B2CServices } from '../../../../b2b2c/services/b2b2c.service';
import { ConfigService } from '../../../../core/services/config.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MenuService {
  public _menuJson: Object;
  config;
  constructor(config: ConfigService, public b2b2cServices: B2B2CServices) {
    this.config = config;
  }

  getMasterMenuJson() {
      let menuResponse = this.config.ncpRestServiceCall('idmServices/getUserMenu', {});
      return menuResponse;

  }

  get(key: any) {
    return this._menuJson[key];
  }

  setMenuJson(data) {
    this._menuJson = data;
  }

}
