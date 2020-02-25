import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from '../../shared/shared.module';
import { ConfigService } from '../../services/config.service';
import { UiTextBoxModule } from '../textbox';
import { AmountFormat } from '../amount/pipes/amountFormat';
import { TooltipModule } from '../tooltip/index';
import { CommonModule } from '@angular/common';
import { UiMiscModule } from '../misc-element/misc.component';
import { NgModule } from '@angular/core';
import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'summary-table',
    templateUrl: 'summary-table.html'
})

export class SummaryTableComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() tableControl: FormControl;
    @Input() LOB: string = '';
    @Input() tooltipTitle: string = '';
    @Input() isEndorsementFlag: boolean = false;
    @Input() summaryTableClass: string = '';
    @Input() project: string;
    @Input() transactionType: string;
    isCollapsedTr: boolean = false;
    summaryData: any = [];
    lastPremium: any = 0.00;
    type = '';
    public optionalCoversArray: string[] = [];
    public optionalCovers: string;
    public region: string = '';
    public travellingTo: string = '';
    public na: string = '--';
    constructor(public config: ConfigService, public amtFormat: AmountFormat, public utils: UtilsService, public activeRoute: ActivatedRoute) { }
    ngOnInit() {
        this.summaryData = this.tableControl.value;
        if (this.LOB === 'TRAVEL') {
            if (this.summaryData.policyInfo.policyTerm == '01') {
                this.region = this.summaryData.riskInfo[0].regionDesc;
            }
            else {
                if (this.summaryData.riskInfo[0].travellingTo !== "") {
                    this.summaryData.riskInfo[0].travellingTo.forEach(element => {
                        this.travellingTo += this.travellingTo === '' ? element.desc : ' , ' + element.desc;
                    });
                }
            }
        }
        if (this.isEndorsementFlag) {
            if(this.config.getCustom('policyLastMovementData')!==undefined)
            this.lastPremium = this.amtFormat.transform(this.config.getCustom('policyLastMovementData').lastPremium, []);
        }
        this.type = this.transactionType;
    }

    ngAfterViewInit() {
        this.tableControl.valueChanges.subscribe(data => {
            this.summaryData = data;
            if (this.LOB === 'MOTOR' && this.summaryData.riskInfo && this.summaryData.riskInfo[0].plans !== undefined) {
                this.summaryData.riskInfo[0].plans.forEach(element => {
                    if (element.planDetails !== null && element.planDetails !== undefined && element.isPlanSelected === true) {
                        this.optionalCoversArray = [];
                        element.planDetails.forEach(detail => {
                            if ((detail.coverageGrpCode === 'VPC2' || detail.coverageGrpDesc === 'Optional Cover') && detail.covgSi !== '0.00') {
                                if (this.optionalCoversArray.indexOf(detail.covgDesc) === -1) this.optionalCoversArray.push(detail.covgDesc);
                            }
                        });
                        this.optionalCovers = this.optionalCoversArray.join(' , ');
                    }
                });

            }
        });
    }

    ngOnChanges(changes?) { }

}



@NgModule({
    imports: [CommonModule, ReactiveFormsModule, TooltipModule, SharedModule, UiMiscModule],
    exports: [SummaryTableComponent],
    declarations: [SummaryTableComponent],
    providers: [AmountFormat]
})
export class SummaryTableModule { }