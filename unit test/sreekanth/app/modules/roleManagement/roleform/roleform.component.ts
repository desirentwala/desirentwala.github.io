import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { ConfigService } from '../../../core/services/config.service';
import { EventService } from '../../../core/services/event.service';
import { SharedService } from '../../../core/shared/shared.service';
import { Logger } from '../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { RoleFormService } from '../services/roleform.service';
import { RoleFormValidator } from './roleform.validator';

@Component({
    selector: 'role-form',
    templateUrl: 'roleform.component.html'
})

export class RoleformComponent implements OnInit, AfterContentInit {
    @Input() roleMaintenanceFormGroup: FormGroup;
    loaderConfig: ConfigService;
    roleFormValidator;
    errorFlag: boolean = false;
    userRoleCode: string;
    @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(public roleService: RoleFormService,
        public utilsService: UtilsService,
        public _logger: Logger,
        public translate: TranslateService,
        loaderConfigService: ConfigService,
        public _eventHandler: EventService,
        shared: SharedService
    ) {
        this.roleMaintenanceFormGroup = this.roleService.getroleformModel();
        this.roleMaintenanceFormGroup.patchValue(this.roleService.getroleformModel().value);
        this.roleFormValidator = new RoleFormValidator();
        this.roleMaintenanceFormGroup = this.roleFormValidator.setRoleFormValidator(this.roleMaintenanceFormGroup);
        this.loaderConfig = loaderConfigService;
    }

    ngOnInit() {
        this.userRoleCode = this.loaderConfig.getCustom('user_role');
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