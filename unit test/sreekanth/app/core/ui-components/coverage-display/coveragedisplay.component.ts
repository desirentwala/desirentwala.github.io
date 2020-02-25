import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { AmountFormat } from '../amount/pipes/amountFormat';
import { UiCheckboxModule } from '../checkbox/index';
import { LabelModule } from '../label/label.component';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { PlanService } from '../plantable/service/plan.service';
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    NgModule,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiMiscModule } from '../misc-element/misc.component';


@Component({

    selector: 'coverage-display',
    templateUrl: './coveragedisplay.html'
})

export class CoverageDisplayComponent implements OnInit, OnChanges {
    @Input() plans: Array<any> = [];
    @Input() elementId: string;
    @Input() selectedPlanIndex: any = 0;
    @Input() productCode: string;
    @Input() riskInfoArray: FormArray;
    @Input() selectedRiskIndex: any;
    rotateFlag = '';
    na: string = 'NCPLabel.na';
    favPlansFlag: boolean = true;
    favCvgCodes = [];
    cvgGroups = {};
    selectedPlanPremium: string;
    relativeCoveragesMapBuffer: any = {};
    configPlan;
    config: ConfigService;
    public amtFormat: AmountFormat;
    public lastMovementSelectedPlanIndex: number = 1;
    public obj = Object;
    constructor(public utils: UtilsService,
        _config: ConfigService, public changeRef: ChangeDetectorRef, _eventHandler: EventService, public planService: PlanService) {
        this.config = _config;
        this.amtFormat = new AmountFormat(this.config);
        this.configPlan = planService;
        if (typeof this.selectedPlanIndex === 'string') this.selectedPlanIndex = 0;
    }

    ngOnInit() {
        this.na = this.utils.getTranslated(this.na);
        this.favCvgCodes = this.configPlan.get(this.productCode);
    }
    ngOnChanges(changes: SimpleChanges) {
        if ((changes.selectedPlanIndex && changes.selectedPlanIndex.currentValue !== "" && this.plans[this.selectedPlanIndex] !== undefined) || (changes.plans !== undefined && changes.plans.currentValue !== "" && (this.plans[this.selectedPlanIndex] !== undefined || this.plans.length === 1))) {
            for (let i = 0; i < this.plans.length; i++) {
                if (this.plans[i].isPlanSelected == true)
                    this.lastMovementSelectedPlanIndex = i;
            }
            if (this.plans.length == 1) this.selectedPlanIndex = 0;
            this.selectedPlanPremium = this.amtFormat.transform(parseFloat(this.plans[this.selectedPlanIndex].planPrem), []);
            this.doPopulateCoveragesMapBuffer(this.plans.length === 1 ? this.riskInfoArray[this.selectedRiskIndex]['plans'][0] : this.plans[this.lastMovementSelectedPlanIndex]);
        }
        this.changeRef.markForCheck();
    }

    doPopulateCoveragesMapBuffer(lastMovementPlan: any) {
        let found: boolean = false;
        this.relativeCoveragesMapBuffer = {};
        if (this.plans[this.selectedPlanIndex] !== undefined) {
            for (let j = 0; j < this.plans[this.selectedPlanIndex].planDetails.length; j++) {
                found = false;
                for (let i = 0; i < lastMovementPlan.planDetails.length; i++) {
                    // if (lastMovementPlan.planDetails[i].covgCd === this.plans[this.selectedPlanIndex].planDetails[j].covgCd && this.plans[this.selectedPlanIndex].planDetails[j].covgSi !== "0.00") {
                    if (lastMovementPlan.planDetails[i].covgCd === this.plans[this.selectedPlanIndex].planDetails[j].covgCd) {
                        found = true;
                        break;
                    }
                }
                this.relativeCoveragesMapBuffer[this.plans[this.selectedPlanIndex].planDetails[j].covgCd] = {};
                this.relativeCoveragesMapBuffer[this.plans[this.selectedPlanIndex].planDetails[j].covgCd]['type'] = found ? 1 : 2;
                // if (!found)
                //     this.relativeCoveragesMapBuffer[this.plans[this.selectedPlanIndex].planDetails[j].covgCd]['type'] = 4;
                this.relativeCoveragesMapBuffer[this.plans[this.selectedPlanIndex].planDetails[j].covgCd]['covgDesc'] = this.plans[this.selectedPlanIndex].planDetails[j].covgDesc;
                this.relativeCoveragesMapBuffer[this.plans[this.selectedPlanIndex].planDetails[j].covgCd]['coverageGrpCode'] = this.plans[this.selectedPlanIndex].planDetails[j].coverageGrpCode;
                this.relativeCoveragesMapBuffer[this.plans[this.selectedPlanIndex].planDetails[j].covgCd]['coverageGrpDesc'] = this.plans[this.selectedPlanIndex].planDetails[j].coverageGrpDesc;
                this.relativeCoveragesMapBuffer[this.plans[this.selectedPlanIndex].planDetails[j].covgCd]['displayCovgSi'] = this.plans[this.selectedPlanIndex].planDetails[j].covgSi != "0.00" ? this.amtFormat.transform(parseFloat(this.plans[this.selectedPlanIndex].planDetails[j].covgSi), []) : this.na;
                this.relativeCoveragesMapBuffer[this.plans[this.selectedPlanIndex].planDetails[j].covgCd]['isFavPlan'] = this.favCvgCodes.indexOf(this.plans[this.selectedPlanIndex].planDetails[j].covgCd) !== -1;

            }
            for (let i = 0; i < lastMovementPlan.planDetails.length; i++) {
                if (this.relativeCoveragesMapBuffer[lastMovementPlan.planDetails[i].covgCd] === undefined) {
                    this.relativeCoveragesMapBuffer[lastMovementPlan.planDetails[i].covgCd] = {};
                    this.relativeCoveragesMapBuffer[lastMovementPlan.planDetails[i].covgCd]['type'] = 3;
                    this.relativeCoveragesMapBuffer[lastMovementPlan.planDetails[i].covgCd]['covgDesc'] = lastMovementPlan.planDetails[i].covgDesc;
                    this.relativeCoveragesMapBuffer[lastMovementPlan.planDetails[i].covgCd]['coverageGrpCode'] = lastMovementPlan.planDetails[i].coverageGrpCode;
                    this.relativeCoveragesMapBuffer[lastMovementPlan.planDetails[i].covgCd]['coverageGrpDesc'] = lastMovementPlan.planDetails[i].coverageGrpDesc;
                    this.relativeCoveragesMapBuffer[lastMovementPlan.planDetails[i].covgCd]['displayCovgSi'] = lastMovementPlan.planDetails[i].covgSi != "0.00" ? this.amtFormat.transform(parseFloat(lastMovementPlan.planDetails[i].covgSi), []) : this.na;
                    this.relativeCoveragesMapBuffer[lastMovementPlan.planDetails[i].covgCd]['isFavPlan'] = this.favCvgCodes.indexOf(lastMovementPlan.planDetails[i].covgCd) !== -1;
                }
            }
            // + Create Array Based Upon Coverage favCvgCodes
            this.cvgGroups = {};
            if (this.favPlansFlag) {
                Object.keys(this.relativeCoveragesMapBuffer).map(e => {
                    if (this.cvgGroups[this.relativeCoveragesMapBuffer[e]['type']] === undefined) this.cvgGroups[this.relativeCoveragesMapBuffer[e]['type']] = {};
                    let tempCoverageGroupObj = {};
                    tempCoverageGroupObj['covgDesc'] = this.relativeCoveragesMapBuffer[e]['covgDesc'];
                    tempCoverageGroupObj['displayCovgSi'] = this.relativeCoveragesMapBuffer[e]['displayCovgSi'];
                    if (this.cvgGroups[this.relativeCoveragesMapBuffer[e]['type']][this.relativeCoveragesMapBuffer[e].coverageGrpCode] === undefined) {
                        this.cvgGroups[this.relativeCoveragesMapBuffer[e]['type']][this.relativeCoveragesMapBuffer[e].coverageGrpCode] = {};
                        this.cvgGroups[this.relativeCoveragesMapBuffer[e]['type']][this.relativeCoveragesMapBuffer[e].coverageGrpCode]['coverageGrpDesc'] = this.relativeCoveragesMapBuffer[e].coverageGrpDesc;
                        this.cvgGroups[this.relativeCoveragesMapBuffer[e]['type']][this.relativeCoveragesMapBuffer[e].coverageGrpCode]['coverage'] = [];
                    }
                    this.cvgGroups[this.relativeCoveragesMapBuffer[e]['type']][this.relativeCoveragesMapBuffer[e].coverageGrpCode]['coverage'].push(tempCoverageGroupObj);
                });
            }
        }
    }
    switchView() {
        this.favPlansFlag = !this.favPlansFlag;
    }
    toggleDetail(type) {
        var id = type;
        if (document.getElementById(id) !== null) {
            if (document.getElementById(id).style.display === 'none') {
                document.getElementById(id).style.display = 'block';
            } else {
                document.getElementById(id).style.display = 'none';
            }
        }
    }

    toggleCovgGroupDetail( planChangeType: string,  i) {
        var id = i.toString() + '-plan-' + planChangeType;
        if (document.getElementById(id).style.display === 'none') {
            document.getElementById(id).style.display = 'block';
        } else {
            document.getElementById(id).style.display = 'none';
        }
    }

}


export const UI_COVERAGEDISPLAY_DIRECTIVES = [CoverageDisplayComponent];
@NgModule({
    declarations: UI_COVERAGEDISPLAY_DIRECTIVES,
    imports: [CommonModule, FormsModule, UiCheckboxModule, ReactiveFormsModule, LabelModule, SharedModule, UiMiscModule],
    exports: [UI_COVERAGEDISPLAY_DIRECTIVES, SharedModule],
    providers: []
})
export class UiCoverageDisplayModule { }