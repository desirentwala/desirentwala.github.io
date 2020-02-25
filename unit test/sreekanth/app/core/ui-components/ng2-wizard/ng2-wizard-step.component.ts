import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilsService } from '../utils/utils.service';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({

    selector: 'ng2-wizard-step',
    templateUrl: './ng2-wizard-step.component.html'
})
export class Ng2WizardStep{
    @Input() public tabTitle: string;
    utils: UtilsService;
    public active: boolean;
    public visited: boolean;
    constructor(_util: UtilsService, public changeRef: ChangeDetectorRef) {
        this.utils = _util;
    }

}