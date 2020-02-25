import { SharedService } from '../../shared/shared.service';
import { UtilsService } from '../utils/utils.service';
import { Ng2WizardStep } from './ng2-wizard-step.component';
import { AfterViewInit, ChangeDetectorRef, Component, ContentChildren, Input, QueryList } from '@angular/core';

@Component({

    selector: 'ng2-wizard-tab',
    templateUrl: './ng2-wizard-tab.component.html'
})
export class Ng2WizardTab implements AfterViewInit {

    @Input()
    public tabTitle: string;
    @Input()
    public tabIcon: string;
    @Input()
    public tabId: string;
    @Input()
    public enableStepNavigation: boolean;
    @Input()
    public screenManipulatorConfig: any = {};
    @Input()
    public doValidateSubBeforeNavigation: boolean = true;
    @ContentChildren(Ng2WizardStep)
    public steps: QueryList<Ng2WizardStep>;

    public active: boolean = false;
    public visited: boolean = false;
    utils: UtilsService;
    constructor(public sharedService: SharedService, _utils: UtilsService, public changeRef: ChangeDetectorRef) {
        this.utils = _utils;
    }
    public ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.steps && this.steps.length > 0) {
                this.steps.first.active = true;
                this.changeRef.markForCheck();
            }
        });

    }
}