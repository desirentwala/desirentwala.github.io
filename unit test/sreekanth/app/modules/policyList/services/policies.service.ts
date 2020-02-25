import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { Injectable } from '@angular/core';

@Injectable()
export class PoliciesService {
  _config: ConfigService;

  constructor(public _logger: Logger, config: ConfigService) {
    this._config = config;

  }

  getPolicyList(inputJson) {
    let policyEnquiryResponse = this._config.ncpRestServiceCall('policy/getOpenHeldPolices', inputJson);
    return policyEnquiryResponse;
  }

  getPolicyDetails(inputJson) {
    let policyEnquiryResponse = this._config.ncpRestServiceCall('policy/initiateCollective', inputJson);
    return policyEnquiryResponse;
  }
}
