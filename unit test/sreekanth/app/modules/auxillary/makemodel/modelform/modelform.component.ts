import { AfterContentInit, ChangeDetectorRef, Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config.service';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { Logger } from '../../../../core/ui-components/logger';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../../../core/services/event.service';
import { SharedService } from '../../../../core/shared/shared.service';
import { MakeModelService } from '../services/makemodel.service';


@Component({
    selector: 'model-form',
    templateUrl: './modelform.component.html'
})

export class ModelFormComponent implements OnInit,AfterContentInit{
    @Input() modelFormGroup: FormGroup;
    loaderConfig: ConfigService;
    //branchFormValidator;
    errorFlag: boolean = false;
    userModelCode: string;
    isError = false;
    @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
    
    constructor(public makeModelService: MakeModelService,
        public utilsService: UtilsService,
        public _logger: Logger,
        public translate: TranslateService,
        loaderConfigService: ConfigService,
        public _eventHandler: EventService,
        shared: SharedService
        ) {
        
        this.loaderConfig = loaderConfigService;
        this.modelFormGroup = this.makeModelService.getMakeModelInfo();
        //this.modelFormGroup.patchValue(this.makeModelService.getMakeModelInfo().value);
        
    }

    ngOnInit() {
        //this.userModelCode = this.loaderConfig.getCustom('modelDetails');
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