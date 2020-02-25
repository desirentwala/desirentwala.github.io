import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from "../../../../core/services/config.service";
import { Logger } from '../../../../core/ui-components/logger';
import { TranslateService } from '@ngx-translate/core';
import { MiscSetupService } from '../services/miscsetup.service';
import { SharedService } from '../../../../core/shared/shared.service';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { EventService } from '../../../../core/services/event.service';
import { MiscSetupFormValidator } from '../miscSetupForm/miscSetupForm.validator';
import { DateFormatService } from '../../../../core/ui-components/ncp-date-picker/services/ncp-date-picker.date.format.service';
@Component({
  selector: 'miscSetupForm',
  templateUrl: './miscSetupForm.component.html'
})
export class MiscSetupFormComponent implements OnInit, AfterContentInit {
  @Input() miscSetupFormGroup: FormGroup;
  loaderConfig: ConfigService;
  @Input() changeId: string;
  errorFlag: boolean = false;
  isError = false;
  dateFormatService;
  NCPDatePickerNormalOptions = {
    todayBtnTxt: 'Today',
    firstDayOfWeek: 'mo',
    alignSelectorRight: true,
    indicateInvalidDate: true,
    showDateFormatPlaceholder: true
};
  miscSetupFormValidator: MiscSetupFormValidator;
  @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
  constructor(public miscSetupService: MiscSetupService,
    public translate: TranslateService,
    public utilsService: UtilsService,
    loaderConfigService: ConfigService,
    public _eventHandler: EventService,
    public changeRef: ChangeDetectorRef,
    public _logger: Logger,
    public configService: ConfigService,
    shared: SharedService) {
    this.loaderConfig = loaderConfigService;
    this.miscSetupFormValidator = new MiscSetupFormValidator();
    this.dateFormatService = new DateFormatService(this.configService);
    this.miscSetupFormGroup = this.miscSetupService.getMiscSetupFormInfo();
    this.miscSetupFormGroup = this.miscSetupFormValidator.setPostalCodeFormValidator(this.miscSetupFormGroup);
    this.miscSetupFormGroup.get('effectiveFrom').patchValue(this.utilsService.getTodayDate());
    let date = new Date('01/01/9999');
    this.miscSetupFormGroup.get('effectiveTo').patchValue(this.dateFormatService.formatDate(date));
  }

  ngOnInit() {

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
