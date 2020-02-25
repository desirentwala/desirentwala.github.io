import { EventEmitter, Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable ,  Subject } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';

/**
 * This class provides the QuotService service with methods to read QuotService datas.
 */
@Injectable()
export class QuotService {
  _config: ConfigService;
  public routeJson: Object = {};
  loadedSub = new Subject();
  public productKeyMap: Object = {};
  utilsServices: UtilsService;
  public postPaymentSuccess: EventEmitter<any> = new EventEmitter<any>();
  public postPaymentFailure: EventEmitter<any> = new EventEmitter<any>();
  /**
   * Creates a new QuotServiceService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private _logger: Logger, config: ConfigService, _utilsServices: UtilsService) {
    this._config = config;
    this.utilsServices = _utilsServices;
    // this.doFetchProductData();
  }
  get(key) {
    let allLOB: any = this.routeJson, productSetupKey: Object;
    if (Object.keys(allLOB).length > 0) {
      productSetupKey = this.routeJson[key] ? this.routeJson[key] : {};
    } else {
      this.doFetchProductData();
    }
    return productSetupKey;
  }
  getLOBRoute(productCode): string {
    let routeUrl: string = '';
    if (Object.keys(this.routeJson).length > 0) {
      routeUrl = this.get(this.productKeyMap[productCode][0])[this.productKeyMap[productCode][1]]['ROUTE'];
    } else {
      this.doFetchProductData();
    }
    return routeUrl;
  }
  public doFetchProductData() {
    if (this.routeJson === undefined || this.routeJson === null || Object.keys(this.routeJson).length === 0) {
      let routeResponse = this._config.ncpRestServiceCall('utils/getProductSetupDetails', '');
      routeResponse.subscribe((route) => {
        this.routeJson = route[0];
        this._config.setLoadingSub('no');
        if (this.routeJson && Object.keys(this.productKeyMap).length === 0) this.setProductKeyMap();
      });
    }
  }
  /**
     * productKeyMap property maps productCode, LobCode and LobProductCode . Ex "CPA" : [ PA, CPAPA ]
     * @return {void} 
     */
  private setProductKeyMap(): void {
    for (let lobkey in this.routeJson) {
      for (let product in this.routeJson[lobkey])
        this.productKeyMap[this.routeJson[lobkey][product]['productCd']] = [lobkey, product];
    }
    this.loadedSub.next();
  }
  getQuotInfo(inputJson) {
    let postsResponse = this._config.ncpRestServiceCall('quote/quoteDefaulting', inputJson);
    return postsResponse;
  }

  getRevisedPriceInfo(inputJson) {
    let revisedPricePostsResponse = this._config.ncpRestServiceCall('quote/quoteCalculate', inputJson);
    return revisedPricePostsResponse;
  }

  getQuoteRatingInfo(inputJson) {
    let revisedPricePostsResponse = this._config.ncpRestServiceCall('quote/quoteRating', inputJson);
    return revisedPricePostsResponse;
  }

  getDocumentInfo(inputJson) {
    this._config.ncpViewDocument('utils/viewDocument', inputJson);
  }
  getPolicyPostingOnCreditInfo(inputJson) {
    let policyPostsResponse = this._config.ncpRestServiceCall('quote/quoteConfirm', inputJson);
    return policyPostsResponse;
  }
  getQuotEnquiryInfo(inputJson) {
    let quotEnquiryResponse = this._config.ncpRestServiceCall('quote/quoteEnquiry', inputJson);
    return quotEnquiryResponse;
  }
  getQuotOpenheldInfo(inputJson) {
    let quotEnquiryResponse = this._config.ncpRestServiceCall('quote/quoteOpenheld', inputJson);
    return quotEnquiryResponse;
  }
  quoteSaveOpenheldInfo(inputJson, isupdateToTargetSystem?) {
    let quotEnquiryResponse = this._config.ncpRestServiceCall('quote/quoteSave', inputJson, isupdateToTargetSystem);
    return quotEnquiryResponse;
  }
  saveQuoteOpenheldInfo(inputJson, isupdateToTargetSystem?) {
    let quotEnquiryResponse = this._config.ncpRestServiceCall('quote/saveQuote', inputJson, isupdateToTargetSystem);
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
    let regionResponse = this._config.ncpRestServiceCall('quote/getRegionDetails', inputJson);
    return regionResponse;
  }
  /**
    * Handle HTTP error
    */
  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    this._logger.error(errMsg); // log to console instead
    return observableThrowError(errMsg);
  }

  getPAQuotInfo() {
    let menuResponse = this._config.ncpJsonCall('assets/config/paresponsevalue.json');
    return menuResponse;
  }
  getMotorQuotInfo() {
    let menuResponse = this._config.ncpJsonCall('assets/config/motorresponsejsonvalue.json');
    return menuResponse;
  }

  // getProductElements(prodCd){
  //   let prodResponse = this._config.getProductElements(prodCd);
  //   (prodResponse);
  //   return prodResponse;
  // }

  getpostalCodeRefreshValues(postalCode) {
    let postalCodeRefreshResponse = this._config.ncpRestServiceCall('utils/zipcodeRefresh', postalCode);
    return postalCodeRefreshResponse;
  }
  getemailTemplateResponse(inputJson) {
    let emailTemplateResponse = this._config.ncpRestServiceCallWithoutJsonResponse('utils/previewTemplate', inputJson);
    return emailTemplateResponse;
  }
  sendEmail(inputJson) {
    this._config.ncpViewDocument('utils/viewDocument', inputJson);
  }

  getreferralService(inputJson) {
    let referralResponse = this._config.ncpRestServiceCall('quote/referQuote', inputJson);
    return referralResponse;
  }

  quoteReferral(inputJson) {
    let referralResponse = this._config.ncpRestServiceCall('quote/quoteReferral', inputJson);
    return referralResponse;
  }

  quotePostAndSettle(inputJson) {
    return this._config.ncpRestServiceCall('quote/doSettlementAndPosting', inputJson);
  }

  getPaymentDetailTelemoney(inputJson) {
    return this._config.ncpRestServiceWithoutLoadingSubCall('payment/getEasyPayPaymentDetails', inputJson);
  }

  getPaymentURLTelemoney(inputJson) {
    return this._config.ncpRestServiceCall('payment/getEasyPayPaymentURL', inputJson);
  }

  doPopulateInsuredListService(inputJson) {
    return this._config.ncpRestServiceCall('quote/populateInsuredList', inputJson);
  }

  doCustomerRefresh(identityNo) {
    let customerInfoResponse = this._config.ncpRestServiceCall('customer/doCustomerRefresh', identityNo);
    return customerInfoResponse;
  }
  customerEnquiry(inputJson) {
    let customerInfoResponse = this._config.ncpRestServiceCall('customer/customerEnquiry', inputJson);
    return customerInfoResponse;
  }
  quoteValidate(inputJson) {
    return this._config.ncpRestServiceCall('quote/quoteValidate', inputJson);
  }
  postQuote(inputJson) {
    return this._config.ncpRestServiceCall('quote/postQuote', inputJson);
  }
  postQuotewithoutLoadingSub(inputJson) {
    return this._config.ncpRestServiceWithoutLoadingSubCall('quote/postQuote', inputJson);
  }
  addItemCoverage(inputJson) {
    let addItemResponse = this._config.ncpRestServiceCall('quote/addItemCoverage', inputJson);
    return addItemResponse;
  }
  deleteItemCoverage(inputJson) {
    let deleteItemResponse = this._config.ncpRestServiceCall('quote/deleteItemCoverage', inputJson);
    return deleteItemResponse;
  }
  noteUpload(inputJson) {
    let referralResponse = this._config.ncpRestServiceCall('utils/createAndSaveNotes', inputJson);
    return referralResponse;
  }
  getPlansForComparison(inputJson) {
    let referralResponse = this._config.ncpRestServiceCall('quote/getPlansForComparison', inputJson);
    return referralResponse;
  }

  addItemDetails(inputJson) {
    let addItemDetailsResponse = this._config.ncpRestServiceCall('quote/addItemDetails', inputJson);
    return addItemDetailsResponse;
  }

  deleteItemDetails(inputJson) {
    let deleteItemDetailsResponse = this._config.ncpRestServiceCall('quote/deleteItemDetails', inputJson);
    return deleteItemDetailsResponse;
  }

  getPartyDetails(inputJSON) {
    let partyDetails = this._config.ncpRestServiceCall('customer/getPartyDetails', inputJSON);
    return partyDetails;
  }

  convertQuotToProposal(inputJson) {
    let convertQuotToProposalResponse = this._config.ncpRestServiceCall('quote/convertQuoteToProposal', inputJson);
    return convertQuotToProposalResponse;
  }

  getMultiQuoteInfo(inputJson) {
    let multiQuotResponse = this._config.ncpRestServiceCall('quote/doMultiQuote', inputJson);
    return multiQuotResponse;
  }
  uploadDrone(inputJson) {
    return this._config.ncpRestServiceCall('quote/droneUpload', inputJson);
  }

  createQuote(inputJson) {
    let postsResponse = this._config.ncpRestServiceCall('quote/createQuote', inputJson);
    return postsResponse;
  }

 /*  doCustomerRefreshSearch(inputJson) {
    return this._config.ncpRestServiceCall('customer/doCustomerRefreshSearch', inputJson);
  } */

  createTask(inputJson) {
    return this._config.ncpRestServiceCall('task/createTask', inputJson);
  }

  updateCustomerDetails(inputJson) {
    return this._config.ncpRestServiceCall('customer/updateCustomerDetails', inputJson);
  }

  referTxn(inputJSON) {
    return this._config.ncpRestServiceCall('utils/referTransaction', inputJSON);
  }

  addDeleteSubItem(inputJSON) {
    return this._config.ncpRestServiceCall('quote/addDeleteSubItem', inputJSON);
  }

  addDeleteMultiSectionItem(inputJSON) {
    return this._config.ncpRestServiceCall('quote/addDeleteMultiSectionItem', inputJSON);
  }
}