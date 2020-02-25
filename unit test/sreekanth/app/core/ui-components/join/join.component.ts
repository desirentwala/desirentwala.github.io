import { Component, OnInit, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilsService } from '../utils/utils.service';
@Component({
    
    selector: 'join-field',
    templateUrl: './join.html'
})
export class JoinComponent implements OnInit {
    @Input() elementLabel: string;
    @Input() elementId: string;
    utils: UtilsService;
    constructor(_utils: UtilsService) {
        this.utils = _utils;
    }
    ngOnInit() {
        this.elementLabel = this.utils.getTranslated(this.elementLabel);
    }
}


@NgModule({
    imports: [CommonModule, FormsModule],
    exports: [JoinComponent],
    declarations: [JoinComponent]
})
export class JoinModule { }
