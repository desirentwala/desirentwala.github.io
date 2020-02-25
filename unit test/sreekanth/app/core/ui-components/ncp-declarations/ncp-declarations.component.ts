import { UiTextAreaModule } from '../textarea';
import { AccordionModule } from '../accordion/accordion.module';
import { UiCheckboxModule } from '../checkbox';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
    selector: 'ncp-declarations',
    templateUrl: './ncp-declarations.html'
})

export class NCPDeclarationsComponent implements OnInit {
    @Input() agreeAllDecelerationsCondition: boolean = true;
    @Input() hideIndividualCheckBoxCondition: boolean = true;
    @Input() elementControl: FormControl;
    @Input() secondaryFormName: FormControl;
    @Input() importantNotice: string;
    @Input() thirdElementForm: FormControl;
    @Input() warrantyAndDeclaration;
    @Input() fourthElementForm: FormControl;
    @Input() personalDataProtectionActStatement;
    @Input() firstHeading: string;
    @Input() secondHeading: string;
    @Input() thirdHeading: string;
    @Input() changeId: string;
    config: ConfigService;
    eventHandler: EventService;
    constructor(_config: ConfigService, _eventHandler: EventService) {
        this.config = _config;
        this.eventHandler = _eventHandler;
    }
    ngOnInit() {
        if (this.hideIndividualCheckBoxCondition == undefined) this.hideIndividualCheckBoxCondition = true;
    }
}



@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedModule, UiCheckboxModule, AccordionModule, UiTextAreaModule],
    exports: [NCPDeclarationsComponent],
    declarations: [NCPDeclarationsComponent],
    providers: []
})
export class UiNCPDeclarationsModule { }
