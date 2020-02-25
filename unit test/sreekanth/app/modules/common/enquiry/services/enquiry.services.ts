import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { Injectable } from '@angular/core';

@Injectable()
export class EnquiryServices {
  _config: ConfigService;

  constructor(public _logger: Logger, config: ConfigService) {
    this._config = config;

  }

  getQuotEnquiryInfo(inputJson) {
    let quotEnquiryResponse = this._config.ncpRestServiceCall('quote/quoteEnquiry', inputJson);
    return quotEnquiryResponse;
  }
  getPolicyEnquiryInfo(inputJson) {
    let policyEnquiryResponse = this._config.ncpRestServiceCall('policy/policyEnquiry', inputJson);
    return policyEnquiryResponse;
  }
  getPolicyMovementInfo(inputJson) {
    let policyMovementResponse = this._config.ncpRestServiceCall('policy/getPolicyMovements', inputJson);
    return policyMovementResponse;
  }
  getClaimEnquiryInfo(inputJson) {
    let claimEnquiryResponse = this._config.ncpRestServiceCall('claim/claimEnquiry', inputJson);
    return claimEnquiryResponse;
  }
  getPolicyOpenheldInfo(inputJson) {
    let policyEnquiryResponse = this._config.ncpRestServiceCall('policy/policyOpenheld', inputJson);
    return policyEnquiryResponse;
  }
  getClaimOpenheldInfo(inputJson) {
    let policyEnquiryResponse = this._config.ncpRestServiceCall('claim/claimOpeld', inputJson);
    return policyEnquiryResponse;
  }
  getRevisedPriceInfo(inputJson) {
    let revisedPricePostsResponse = this._config.ncpRestServiceCall('quote/quoteCalculate', inputJson);
    return revisedPricePostsResponse;
  }

  getDocumentInfo(inputJson) {
    this._config.ncpViewDocument('utils/viewDocument', inputJson);
  }
  getPolicyPostingOnCreditInfo(inputJson) {
    let policyPostsResponse = this._config.ncpRestServiceCall('quote/quoteConfirm', inputJson);
    return policyPostsResponse;
  }
  getQuotOpenheldInfo(inputJson) {
    let quotEnquiryResponse = this._config.ncpRestServiceCall('quote/quoteOpenheld', inputJson);
    return quotEnquiryResponse;
  }
  getclaimOpenheldInfo(inputJson) {
    let claimEnquiryResponse = this._config.ncpRestServiceCall('claim/claimOpenheld', inputJson);
    return claimEnquiryResponse;
  }
  quoteSaveOpenheldInfo(inputJson) {
    let quotEnquiryResponse = this._config.ncpRestServiceCall('quote/quoteSave', inputJson);
    return quotEnquiryResponse;
  }
  doQuoteCopyInfo(inputJson) {
    let quotEnquiryResponse = this._config.ncpRestServiceCall('quote/quoteCopy', inputJson);
    return quotEnquiryResponse;
  }
  doQuotAbandonInfo(inputJson) {
    let quotEnquiryResponse = this._config.ncpRestServiceCall('quote/quoteAbandon', inputJson);
    return quotEnquiryResponse;
  }
  getRegionDetails(inputJson) {
    let regionResponse = this._config.ncpRestServiceCall('quote/getRegionDetails', inputJson)
    return regionResponse;
  }
  doPolicyAbandon(inputJson) {
    let policyAbondonResponse = this._config.ncpRestServiceCall('policy/policyAbandon', inputJson);
    return policyAbondonResponse;
  }

  getTimeLineDetails(inputJson) {
    let quoteTimelineResponse = this._config.ncpRestServiceWithoutLoadingSubCall('event/getEventDetails', inputJson);
    return quoteTimelineResponse;
  }

  getSubordinateUserIDList(inputJSON) {
    let subordinateUsersResponse = this._config.ncpRestServiceCall('idmServices/getSubordinateUserIDList', inputJSON);
    return subordinateUsersResponse;
  }

  doClaimAbandon(inputJson) {
    let ClaimAbondonResponse = this._config.ncpRestServiceCall('claim/claimAbandon', inputJson);
    return ClaimAbondonResponse;
  }
  emailDocuments(inputJson) {
    let emailDocumentsResponse = this._config.ncpRestServiceCall('utils/emailDocuments', inputJson);
    return emailDocumentsResponse;
  }
  getRenewalPoliciesData(inputJSON) {
    return this._config.ncpRestServiceCall('renewal/getRenewalPolices', inputJSON);
  }
  doEndorsementDefaultingInfo(inputJson) {
    // Services Name change
    // Old services name: 'policy/endorsementDefaulting'
    // New services name: 'policy/policyEndtDefaulting'
    let endorsementDefaultingResponse = this._config.ncpRestServiceCall('policy/policyEndtDefaulting', inputJson);
    return endorsementDefaultingResponse;
  }

  getAuxData(inputJson) {
    let auxDataResponse = this._config.ncpRestServiceWithoutLoadingSubCall('aux/getAUXData', inputJson);
    return auxDataResponse;
  }
}
