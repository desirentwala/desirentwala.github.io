import { SEOSearchService } from '../../navbar/search/services/seo.service';
import { ConfigService } from '../../../../core/services/config.service';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { EnquiryServices } from './enquiry.services';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from '@adapters/packageAdapter';
@Injectable()
export class EnquiryServicesImp {
  enquiryService: EnquiryServices;
  quotePushedData = new EventEmitter<any>();
  policyPushedData = new EventEmitter<any>();
  claimPushedData = new EventEmitter<any>();
  renewalPushedData = new EventEmitter<any>();
  proposalPushedData = new EventEmitter<any>();
  quoteInput = '';
  policyInput = '';
  claimInput = '';
  renewalInput = '';
  proposalInput = '';
  public isLodingSub: boolean = false;
  constructor(public _enquiryServices: EnquiryServices, public _logger: Logger, public _configService: ConfigService, public seoSearch: SEOSearchService) {
    this.enquiryService = _enquiryServices;
  }
  getQuoteEnquiry(inputJson) {
    let quoteEnqResponse = this.enquiryService.getQuotEnquiryInfo(inputJson);
    quoteEnqResponse.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this._logger.error(dataVal.error);
          this._configService.setLoadingSub('no');
        } else {
          this._configService.setLoadingSub('yes');
          this.quoteInput = dataVal;
          this.quotePushedData.emit(dataVal);
          /*LoadingSub issue in customer issue.so commented this*/
          this.setLoadingSub(this.quoteInput, this.policyInput, this.claimInput, '', this.proposalInput);
        }
      },
      (error) => {
        this.handleError(error);
      });
  }
  getProposalEnquiry(inputJson) {
    let quoteEnqResponse = this.enquiryService.getQuotEnquiryInfo(inputJson);
    quoteEnqResponse.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this._logger.error(dataVal.error);
          this._configService.setLoadingSub('no');
        } else {
          this._configService.setLoadingSub('yes');
          this.proposalInput = dataVal;
          this.proposalPushedData.emit(dataVal);
          /*LoadingSub issue in customer issue.so commented this*/
          this.setLoadingSub(this.quoteInput, this.policyInput, this.claimInput, '', this.proposalInput);
        }
      },
      (error) => {
        this.handleError(error);
      });
  }

  getPolicyEnquiry(inputJson) {
    let policyEnqResponse = this.enquiryService.getPolicyEnquiryInfo(inputJson);
    policyEnqResponse.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this._logger.error(dataVal.error);
          this._configService.setLoadingSub('no');
        } else {
          this._configService.setLoadingSub('yes');
          this.policyInput = dataVal;
          this.policyPushedData.emit(dataVal);
          this.setLoadingSub(this.quoteInput, this.policyInput, this.claimInput, '', this.proposalInput);
        }
      },
      (error) => {
        this.handleError(error);
      });
  }
  getClaimEnquiry(inputJson) {
    let claimEnqResponse = this.enquiryService.getClaimEnquiryInfo(inputJson);
    claimEnqResponse.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this._logger.error(dataVal.error);
          this._configService.setLoadingSub('no');
        } else {
          this._configService.setLoadingSub('yes');
          this.claimInput = dataVal;
          this.claimPushedData.emit(dataVal);
          this.setLoadingSub(this.quoteInput, this.policyInput, this.claimInput, '', this.proposalInput);
        }
      },
      (error) => {
        this.handleError(error);
      });
  }

  getRenewalEnquiry(inputJson) {
    let renewalEnqResponse = this.enquiryService.getRenewalPoliciesData(inputJson);
    renewalEnqResponse.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this._logger.error(dataVal.error);
          this._configService.setLoadingSub('no');
        } else {
          this._configService.setLoadingSub('yes');
          this.renewalInput = dataVal;
          this.renewalPushedData.emit(dataVal);
          this.setLoadingSub(this.quoteInput, this.policyInput, this.claimInput, this.renewalInput, this.proposalInput);
        }
      },
      (error) => {
        this.handleError(error);
      });
  }
  getSEOQuoteEnquiry(filterString) {
    let quoteEnqResponse = this.seoSearch.getQuoteSEOsearch(filterString);
    quoteEnqResponse.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this._logger.error(dataVal.error);
          this._configService.setLoadingSub('no');
        } else {
          this._configService.setLoadingSub('yes');
          this.quoteInput = dataVal;
          this.setLoadingSub(this.quoteInput, this.policyInput, this.claimInput);
          this.quotePushedData.emit(dataVal);
        }
      },
      (error) => {
        this.handleError(error);
      });
  }
  getSEOPolicyEnquiry(filterString) {
    let policyEnqResponse = this.seoSearch.getPolicySEOsearch(filterString);
    policyEnqResponse.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this._logger.error(dataVal.error);
          this._configService.setLoadingSub('no');
        } else {
          this._configService.setLoadingSub('yes');
          this.policyInput = dataVal;
          this.setLoadingSub(this.quoteInput, this.policyInput, this.claimInput)
          this.policyPushedData.emit(dataVal);
        }
      },
      (error) => {
        this.handleError(error);
      });
  }
  getSEOClaimsEnquiry(filterString) {
    let claimsEnqResponse = this.seoSearch.getClaimsSEOsearch(filterString);
    claimsEnqResponse.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this._logger.error(dataVal.error);
          this._configService.setLoadingSub('no');
        } else {
          this._configService.setLoadingSub('yes');
          this.claimInput = dataVal;
          this.setLoadingSub(this.quoteInput, this.policyInput, this.claimInput)
          this.claimPushedData.emit(dataVal);
        }
      },
      (error) => {
        this.handleError(error);
      });
  }
  getSEORenewalEnquiry(filterString) {
    let renewalEnqResponse = this.seoSearch.getRenewalSEOsearch(filterString);
    renewalEnqResponse.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this._logger.error(dataVal.error);
          this._configService.setLoadingSub('no');
        } else {
          this._configService.setLoadingSub('yes');
          this.renewalInput = dataVal;
          this.setLoadingSub(this.quoteInput, this.policyInput, this.renewalInput);
          this.renewalPushedData.emit(dataVal);
        }
      },
      (error) => {
        this.handleError(error);
      });
  }
  public handleError(error: any) {

    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    this._logger.error(errMsg);
    return Observable.throw(errMsg);
  }
  setLoadingSub(quoteInput?, policyInput?, claimInput?, renewalInput?, proposalInput?) {
    if (this.isLodingSub) {
      this._configService.setLoadingSub('no');
    } else {
      let lifeLOBFlag = this._configService.get('lifeLOBFlag');
      if (quoteInput && policyInput && (lifeLOBFlag ? proposalInput : true)) {
        this._configService.setLoadingSub('no');
        this.quoteInput = '';
        this.policyInput = '';
        this.proposalInput = '';
        //this.claimInput = '';
      } else {
        this._configService.setLoadingSub('no');
      }
    }
  }
}
