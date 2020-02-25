import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from "../../../../core/services/config.service";
import { Logger } from '../../../../core/ui-components/logger';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../core/shared/shared.service';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { EventService } from '../../../../core/services/event.service';
import { CurrencyFormValidator } from './currencyForm.validator';
import { CurrencyService } from '../services/currency.service';
@Component({
  selector: 'currencyForm',
  templateUrl: './currencyForm.component.html'
})
export class CurrencyFormComponent implements OnInit, AfterContentInit {
  @Input() currencyFormGroup: FormGroup;
  loaderConfig: ConfigService;
  @Input() changeId: string;
  errorFlag: boolean = false;
  IsError = false;
  currencyType: any[] = [
    { label: 'NCPLabel.foreignCurrency', value: 'F' },
    { label: 'NCPLabel.homeCurrency', value: 'H' }
];
switchbutton: any = "";
  currencyFormValidator;
  @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
  constructor(public currencyService: CurrencyService,
    public translate: TranslateService,
    public utilsService: UtilsService,
    loaderConfigService: ConfigService,
    public _eventHandler: EventService,
    public changeRef: ChangeDetectorRef,
    public _logger: Logger,
    shared: SharedService) {
    this.loaderConfig = loaderConfigService;
    this.currencyFormValidator = new CurrencyFormValidator();
    this.currencyFormGroup = this.currencyService.getCurrencyFormInfo();
    this.currencyFormGroup.patchValue(this.currencyService.getCurrencyFormInfo().value);
    this.currencyFormGroup = this.currencyFormValidator.setCurrencyFormValidator(this.currencyFormGroup);
    this.currencyFormGroup.controls['currencyType'].patchValue('F');
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
