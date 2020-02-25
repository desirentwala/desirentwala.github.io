import { UiAmountModule } from '../amount';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../services/config.service';
import { UiTextBoxModule } from '../textbox';
import { AmountFormat } from '../amount/pipes/amountFormat';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from "../tooltip/index";



@Component({
    selector: 'list-view',
    templateUrl: 'listview.html'
})

export class ListViewComponent implements OnInit, AfterViewInit {
    @Input() descriptions: FormControl;
@Input() tooltipTitle: string;
@Input() tooltipPlacement: string = 'right';

    config: ConfigService;
    formattedAmount: string = '';
    constructor(public amtFormat: AmountFormat) {
    }

    ngOnInit() {}
    
    ngAfterViewInit() {}

    

}



@NgModule({
    imports: [CommonModule, ReactiveFormsModule, UiAmountModule, SharedModule, TooltipModule],
    exports: [ListViewComponent],
    declarations: [ListViewComponent],
    providers: [AmountFormat]
})
export class ListViewModule { }
