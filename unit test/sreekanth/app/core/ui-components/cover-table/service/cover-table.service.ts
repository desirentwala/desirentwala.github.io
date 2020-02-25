import { Injectable } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { UtilsService } from '../../utils/utils.service';

@Injectable()
export class CoverTableService {
  coverTableConfigData;
  config: ConfigService;
  utilsServices: UtilsService;

  constructor(config: ConfigService, utilsServices: UtilsService) {
    this.config = config;
    this.utilsServices = utilsServices;
    this.setCoverTableConfigData(this.getCoverTableConfig());
  }

  get(key) {
    return this.coverTableConfigData['coverTableConfig'][key] ? this.coverTableConfigData['coverTableConfig'][key] : null;
  }

  getCoverTableConfig() {
    return this.utilsServices.getCoverTableConfigData();
  }

  setCoverTableConfigData(coverTableConfigData) {
    this.coverTableConfigData = coverTableConfigData;
  }
}
