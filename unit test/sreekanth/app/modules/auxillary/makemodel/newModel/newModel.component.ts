import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@adapters/packageAdapter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../../../../core/services/event.service';
import { ConfigService } from "../../../../core/services/config.service";
import { Logger } from '../../../../core/ui-components/logger';
import { MakeModelService } from '../services/makemodel.service';
import { ModelFormValidator } from '../modelform/modelform.validator';

@Component({
  selector: 'new-model',
  templateUrl: './newModel.component.html'
})
export class NewModelComponent implements OnInit {
  modelFormGroup: FormGroup;
  controls;
  modelFormValidator;
  errorFlag: boolean = false;
  errors = [];
  isError = false;
  eventHandler: EventService;
  isAddModelModal: boolean = false;
  isModelCreation: boolean = false;
  loaderConfig;
  constructor(
    public formBuilder: FormBuilder,
    public makeModelService: MakeModelService,
    public config: ConfigService,
    public translate: TranslateService,
    loaderConfigService: ConfigService,
    public _logger: Logger,
    public changeRef: ChangeDetectorRef,
  ) {
    this.loaderConfig = loaderConfigService;
    this.modelFormValidator = new ModelFormValidator();
    this.modelFormGroup = this.makeModelService.getMakeModelInfo();
    this.modelFormGroup = this.modelFormValidator.setModelFormValidator(this.modelFormGroup);
    
  }
  addModelCreation() {
    if (this.modelFormGroup.get('modelCode').value != null && this.modelFormGroup.get('modelCode').value != '') {
      this.createNewModelCreation();
      this.isModelCreation = false;
    }
    else {
      this.isModelCreation = true;
    }

  }
  private createNewModelCreation() {
    let addModelCreationResponse = this.makeModelService.createModel(this.modelFormGroup.value);

    addModelCreationResponse.subscribe(
      (dataVal) => {
        if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
          this.isAddModelModal = false;
          this.errors.push({ 'errCode': dataVal.error[0].errCode, 'errDesc': dataVal.error[0].errDesc });
          this._logger.error('createNewMakeCreation() ===>' + dataVal.error);
          window.scrollTo(150, 150);
          this.changeRef.markForCheck(); this.config.setLoadingSub('no');
        } else {
          this.isError = false;
          console.log(dataVal);
          this.isAddModelModal = true;         
          this.config.setLoadingSub('no');
        }
        this.config.setLoadingSub('no');
      });
  }
  ngOnInit() {
    this.config.setLoadingSub('no');
    this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });
  }
  navigateList() {
    this.loaderConfig.navigateRouterLink('ncp/makemodel/modelList');
}
}
