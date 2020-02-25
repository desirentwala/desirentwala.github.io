import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from "../../../../core/services/config.service";
import { Logger } from '../../../../core/ui-components/logger';
import { MakeModelService } from "../services/makemodel.service";
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'make-form',
  templateUrl: './makeform.component.html'
})
export class MakeFormComponent implements OnInit, AfterContentInit {
  @Input() makeMaintenanceFormGroup: FormGroup;
  loaderConfig: ConfigService;
  branchFormValidator;
  errorFlag: boolean = false;
  isError = false;
  userBranchCode: string;
  @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public formBuilder: FormBuilder,
    public makeModelService: MakeModelService,
    public config: ConfigService,
    public _logger: Logger,
    _element: ElementRef,
    public translate: TranslateService,
    _loaderConfigService: ConfigService,
    public changeRef: ChangeDetectorRef) {
    this.loaderConfig = _loaderConfigService;
    this.makeMaintenanceFormGroup = this.makeModelService.getMakeModelInfo()
  }

  ngOnInit() {
  }

  doAction(event) {
    this.doClick.emit(event);
  }

  ngAfterContentInit() {
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.loaderConfig.currentLangName);
      }
    });
    this.loaderConfig.setLoadingSub('no');
  }

}
