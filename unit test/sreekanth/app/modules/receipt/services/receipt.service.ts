import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { Injectable } from '@angular/core';

@Injectable()
export class ReceiptService {
  _config: ConfigService;

  constructor(public _logger: Logger, config: ConfigService) {
    this._config = config;

  }

  getPolicyList(inputJson) {
    let policyEnquiryResponse = this._config.ncpRestServiceCall('policy/getPolicyList', inputJson);
    return policyEnquiryResponse;
  }

  getDocumentInfo(inputJson) {
    this._config.ncpViewDocument('utils/viewReceiptDocument', inputJson);
  }
}
