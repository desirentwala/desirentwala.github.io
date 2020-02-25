import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { RuleInfo } from '../../modules/common/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonConstants } from '../../modules/constants/module.constants';

@Injectable()
export class CommonService {

  constructor(public configService: ConfigService, public formBuilder: FormBuilder) {

  }

  jsonRating(ruleList: Array<any>,object,productCd?) {
    let ratingResponse;
    let jsonRationgInfo = new RuleInfo(this.formBuilder);
    let jsonRatingFormGroup: FormGroup;
    jsonRatingFormGroup = jsonRationgInfo.getRuleInfoModel();
    jsonRatingFormGroup.controls['moduleID'].patchValue(CommonConstants.MODULE_ID);
    jsonRatingFormGroup.controls['projectID'].patchValue(CommonConstants.PROJECT_ID);
    jsonRatingFormGroup.controls['effectiveDate'].patchValue(new Date());
    jsonRatingFormGroup.controls['ruleSetList'].patchValue(ruleList);
    jsonRatingFormGroup.controls['serviceName'].patchValue(CommonConstants.JSONRATING_SERVICE_NAME);
    jsonRatingFormGroup.controls['productCd'].patchValue(productCd);
    jsonRatingFormGroup.controls['object'].patchValue(object);

    ratingResponse = this.configService.ncpRestServiceCall('utils/triggerNIPService', jsonRatingFormGroup.value);
    return ratingResponse;
  }

}

export const COMMON_SERVICES = [
  CommonService
];