import { AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { ConfigService } from '../../../../core/services/config.service';
import { EventService } from '../../../../core/services/event.service';
import { Logger } from '../../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { PostalCodeFormService } from '../services/postalcodeform.service';
import { PostalCodeFormValidator } from './postalcode.validator';
import { SharedService } from '../../../../core/shared/shared.service';
import { PickListService } from '../../../common/services/picklist.service';


@Component({
  selector: 'postalcode-form',
  templateUrl: './postalcodeform.component.html'
})
export class PostalCodeFormComponent implements OnInit, AfterContentInit {
  @Input() postalCodeFormGroup: FormGroup;
  loaderConfig: ConfigService;
  postalCodeFormValidator;
  @Input() changeId: string;
  errorFlag: boolean = false;
  IsError = false;
  miscArray = [];
  @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
  countryParam;
  stateParam;
  districtParam;
  constructor(
    public pickListService: PickListService,
    public postalCodeService: PostalCodeFormService,
    public translate: TranslateService,
    public utilsService: UtilsService,
    loaderConfigService: ConfigService,
    public _eventHandler: EventService,
    public changeRef: ChangeDetectorRef,
    public _logger: Logger,
    shared: SharedService) {
    this.postalCodeFormGroup = this.postalCodeService.getPostalCodeFormInfo();
    this.postalCodeFormGroup.patchValue(this.postalCodeService.getPostalCodeFormInfo().value);
    this.postalCodeFormValidator = new PostalCodeFormValidator();
    this.postalCodeFormGroup = this.postalCodeFormValidator.setPostalCodeFormValidator(this.postalCodeFormGroup);
    this.loaderConfig = loaderConfigService;
  }
  ngOnInit() {
    this.doInitChangeSub();
  }

  doInitChangeSub() {
    this.postalCodeFormGroup.get('countryCode').valueChanges.subscribe((data) => {
      this.countryParam = data;
    });
    this.postalCodeFormGroup.get('stateCode').valueChanges.subscribe((data) => {
      this.stateParam = data;
    });
    this.postalCodeFormGroup.get('districtCode').valueChanges.subscribe((data) => {
      this.districtParam = data;
    });   

  }
  ngAfterContentInit() {
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.loaderConfig.currentLangName);
      }
    });
    this.loaderConfig.setLoadingSub('no');
  }
  doAction(event) {
    this.doClick.emit(event);
  }
}
