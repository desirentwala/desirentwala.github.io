import { Attachments } from '../../claims/models';
import { CampaignService } from '../services/campaign.service';
import { EventService } from '../../../core/services/event.service';
import { ProductFactory } from '../../../core/factory/productfactory';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfigService } from '../../../core/services/config.service';
import { SharedService } from '../../../core/shared/shared.service';
import { BreadCrumbService } from '../../common/breadCrumb/index';
import { Logger } from './../../../core/ui-components/logger/logger';
import { FactoryProvider } from './../../../core/factory/factoryprovider';
import { UtilsService } from "../../../core/ui-components/utils/utils.service";
import { DefaultPolicyModel } from '../../common/services/defaultModel.service';

@Component({
  selector: 'campaignDetails',
  templateUrl: './campaignDetail.html',
  providers: [CampaignService]
})
export class CampaignDetailComponent implements OnInit, AfterViewChecked {
  campaignFormGroup: FormGroup;
  public emailTemplateModal: boolean = false;
  public emailSuccessModal: boolean = false;
  public attachmentModal: boolean = false;
  public emailQuoteInfo: any;
  public campaignInfo: any;
  public emailCampaignInfo: any;
  public attachments: any;
  public ncpfactory: ProductFactory;
  changeSub: any;
  clickSub: any;
  public campaign: any = {
    'primary': [],
    'secondary': []
  };
  constructor(public config: ConfigService,
    shared: SharedService,
    public logger: Logger,
    public breadCrumbService: BreadCrumbService,
    public formBuilder: FormBuilder,
    public campaignService: CampaignService,
    public eventHandler: EventService,
    public util: UtilsService) {
    breadCrumbService.addRouteName('/ncp/campaigns/campaignDetails', [{ 'name': 'Manage Campaigns', redirectUrl: '/ncp/campaigns' }, { 'name': 'Campaign Details' }]);
    this.ncpfactory = FactoryProvider.getFactoryInstance(this.config, this.logger, this.formBuilder);
    let policyModelInstance = this.ncpfactory.getPolicyModelInstance();
    this.campaignInfo = policyModelInstance.getCampaignModel();
  }
  ngOnInit() {
    this.campaignFormGroup = this.campaignInfo.getCampaignInfoModel();
    this.emailCampaignInfo = this.campaignInfo.getEmailInfoModel();
    this.attachments = this.campaignInfo.getAttachmentsModel();
    this.campaign = this.config.getCustom('campaign');
    this.clickSub = this.eventHandler.clickSub.subscribe((data) => {
      if (data.id === 'emailQuoteModalMailSend') {
        // this.config.setLoadingSub('yes');
        // this.campaignService.sendEmail(this.campaignFormGroup.value);
        // this.campaignFormGroup.disable();
        // this.config.setLoadingSub('no');
      }
      if (data.id === 'documentQuoteView') {
      }
    });
  }
  ngAfterViewChecked() {
    this.doUpdateProgressBarsStyle();
  }
  navigateToHome() {
    if (this.config.getCustom('b2cFlag')) {
      this.config.navigateRouterLink('b2c/home');
    } else if (this.config.getCustom('b2b2cFlag')) {
      this.config.navigateRouterLink('b2b2c');
    } else {
      this.config.navigateRouterLink('ncp/home');
    }
  }
   doUpdateProgressBarsStyle() {
  //   if (this.campaign['overallProgress'] !== undefined) {
  //     let overallProgress_premium = (this.campaign['overallProgress']['premium']['value'] / this.campaign['overallProgress']['premium']['total']) * 100;
  //     document.getElementById("overallProgress_premium").style.width = overallProgress_premium + "%";
  //     let overallProgress_policyCount = (this.campaign['overallProgress']['policyCount']['value'] / this.campaign['overallProgress']['policyCount']['total']) * 100;
  //     document.getElementById("overallProgress_policyCount").style.width = overallProgress_policyCount + "%";
  //     let overallProgress_customerCount = (this.campaign['overallProgress']['customerCount']['value'] / this.campaign['overallProgress']['customerCount']['total']) * 100;
  //     document.getElementById("overallProgress_customerCount").style.width = overallProgress_customerCount + "%";
  //   }
     if (this.campaign['myProgress'] !== undefined) {
       let myProgress_premium = (this.campaign['myProgress']['premium']['value'] / this.campaign['myProgress']['premium']['total']) * 100;
       document.getElementById("myProgress_premium").style.width = myProgress_premium + "%";
       let myProgress_policyCount = (this.campaign['myProgress']['policyCount']['value'] / this.campaign['myProgress']['policyCount']['total']) * 100;
       document.getElementById("myProgress_policyCount").style.width = myProgress_policyCount + "%";
       let myProgress_customerCount = (this.campaign['myProgress']['customerCount']['value'] / this.campaign['myProgress']['customerCount']['total']) * 100;
       document.getElementById("myProgress_customerCount").style.width = myProgress_customerCount + "%";
     }
   }
  doGetNoteDetails() {
    let input: object = { "referenceNo": "CAMP" + this.campaign.code, "referenceType": "CMBR" }
    let campaignsData = this.campaignService.getNoteDetails(input);
    // let campaignsData = this.config.ncpJsonCall('assets/config/getNoteDetails.json');
    campaignsData.subscribe((attachments) => {
      this.updateAttachments(attachments);
      this.attachmentModal = true;
      this.config.setLoadingSub('no');
    });
  }
  public updateAttachments(dataValInputDoc) {
    let tempFormGroupDoc;
    tempFormGroupDoc = this.campaignFormGroup.controls['attachments'];
    if (tempFormGroupDoc.length > 0) {
      for (let j = 0; j < tempFormGroupDoc.length; j++) {
        tempFormGroupDoc.removeAt(j);
      }
    }
    let tempLength = dataValInputDoc.attachments.length;
    for (let i = 0; i < tempLength; i++) {
      tempFormGroupDoc.push(this.campaignInfo.getAttachmentsModel());
    }
    tempFormGroupDoc.patchValue(dataValInputDoc.attachments);
    tempFormGroupDoc.updateValueAndValidity();
  }
}