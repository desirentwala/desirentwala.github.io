import { AfterContentInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { PolicyEnquiryComponent } from "../../common/enquiry/policy/policyEnquiry";
import { TableInfo, ActivityComponent } from "../activity.component";
import { EnquiryInfoModel } from "../../common/enquiry/models/enquiryInfo.model";
import { EnquiryServices } from "../../common/enquiry/services/enquiry.services";
import { EnquiryServicesImp } from "../../common/enquiry/services/enquiry.servicesImpl";
import { Logger } from "../../../core/ui-components/logger/logger";
import { Subject } from '@adapters/packageAdapter';
import { ConfigService } from "../../../core/services/config.service";
import { BreadCrumbService } from '../../common/breadCrumb/services/breadcrumb.service';


@Component({
  selector: 'ncp-policyMovement',
  templateUrl: 'policyMovement.component.html'
})
export class PolicyMovementComponent implements  AfterContentInit {
  Ref: any;
  noPolicyEnquiryInputFlag: boolean;
  pmovFlag: boolean = true;
  policyMoveDetailsFormGroup: any;
  customerPolicyInfoHeaderMultiCheckArray: FormGroup;
  logger: any;
  enquiryServices: EnquiryServices;
  enquiryServicesImp: EnquiryServicesImp;
  enquiryinfoModel: EnquiryInfoModel;
  breadCrumbService: BreadCrumbService;
  policyInfoHeaderMultiCheckArray = [];
  policyMovementInput;
  policyTableDetails: TableInfo[] = [];
  policyActivityIconsClassNames = ['', '', '', '', '', 'fa fa-gear showPopover indexre'];
  searchId: string = '';
  policyActivityHeader = ['NCPLabel.policyNo', 'NCPLabel.policyholderName', 'NCPLabel.product', 'NCPLabel.endtReason', 'NCPLabel.inceptionDate', 'NCPLabel.enddate', 'NCPLabel.status'];
  policyActivityMapping = ['reference', 'clientFullName', 'productDesc', 'endtReasonCodeDesc', 'issueDate', 'expiryDate', 'statusDesc'];
  _policyActivityHeader = [];
  _policyActivityMapping = [];
  _policyActivityIconsClassNames = [];
  constructor(enquiryServices: EnquiryServices,public changeRef: ChangeDetectorRef, public config: ConfigService, breadCrumbService: BreadCrumbService) {
    this.enquiryServices = enquiryServices;
    this.Ref = changeRef;
    this.breadCrumbService=breadCrumbService;
    this._policyActivityHeader.push(...this.policyActivityHeader);
    this._policyActivityMapping.push(...this.policyActivityMapping);
    this._policyActivityIconsClassNames.push(...this.policyActivityIconsClassNames);

  }

  ngOnInit() {
    let policyMoventNo = this.config.getCustom('policyMoventNo');
    this.policyMoveSearch(policyMoventNo);
  }
  ngAfterContentInit()
  {

  }
 
  policyMoveSearch(policyMoveFormGroup) {
    this.addBreadCrumbRouteForPMOV();
    this.policyMoveDetailsFormGroup = policyMoveFormGroup;
    var policyNo = this.policyMoveDetailsFormGroup.policyInfo.policyNo;
    var policyEndtNo = this.policyMoveDetailsFormGroup.policyInfo.policyEndtNo;
    var policyObj: object = { 'policyNo': policyNo, 'policyEndtNo': policyEndtNo };
    let policyOutput = this.enquiryServices.getPolicyMovementInfo(policyObj);
    policyOutput.subscribe(
      (policyMoveInfodataVal) => {
        if (policyMoveInfodataVal.error !== null && policyMoveInfodataVal.error !== undefined && policyMoveInfodataVal.error.length >= 1) {
          this.logger.error('policyMoveSearch()===>' + policyMoveInfodataVal.error);
        } else {
          for (let i = 0; i < policyMoveInfodataVal.length; i++) {

            policyMoveInfodataVal[i].reference = policyMoveInfodataVal[i].policyNo + '-' + policyMoveInfodataVal[i].policyEndtNo;
            if (policyMoveInfodataVal[i].clientFullName == false) {
              policyMoveInfodataVal[i].clientFullName = policyMoveInfodataVal[i].companyName;
            }
          }
          this.policyMovementInput = policyMoveInfodataVal;
          this.Ref.markForCheck();
          this.config.setLoadingSub('no');
        }
      },
      (error) => {
        this.logger.error(error);
        this.config.setLoadingSub('no');
      });
  }
 addBreadCrumbRouteForPMOV() {
        let route="/ncp/activity/policyMove";
        let quoteRoutesPrv = { 'name': 'NCPBreadCrumb.activity', redirectUrl: '/ncp/activity'};
        this.breadCrumbService.addRouteName(route, [quoteRoutesPrv, { 'name': 'NCPBreadCrumb.policyMove' }]);
        
  }
   
}
