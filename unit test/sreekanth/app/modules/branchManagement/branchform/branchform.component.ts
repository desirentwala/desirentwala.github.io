import { AfterContentInit, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';

import { ConfigService } from '../../../core/services/config.service';
import { EventService } from '../../../core/services/event.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { BranchFormService } from '../services/branchform.service';
import { BranchFormValidator } from './branchform.validator';
import { SharedService } from '../../../core/shared/shared.service';



@Component({
    selector: 'branch-form',
    templateUrl: 'branchform.component.html'
})

export class BranchformComponent implements OnInit,AfterContentInit {
    @Input() branchMaintenanceFormGroup: FormGroup;
    loaderConfig: ConfigService;
    branchFormValidator;
    errorFlag: boolean = false;
    userBranchCode: string;
    @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(public branchService: BranchFormService,
        public utilsService: UtilsService,
        public _logger: Logger,
        public translate: TranslateService,
        loaderConfigService: ConfigService,
        public _eventHandler: EventService,
        shared: SharedService
        ) {
        this.branchMaintenanceFormGroup = this.branchService.getbranchformModel();
        this.branchMaintenanceFormGroup.patchValue(this.branchService.getbranchformModel().value);
        this.branchFormValidator = new BranchFormValidator();
        this.branchMaintenanceFormGroup = this.branchFormValidator.setBranchFormValidator(this.branchMaintenanceFormGroup);
        this.loaderConfig = loaderConfigService;
    }

    ngOnInit() {
        this.userBranchCode = this.loaderConfig.getCustom('user_branch');
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