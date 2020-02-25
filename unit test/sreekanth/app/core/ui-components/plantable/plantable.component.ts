import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { AmountFormat } from '../amount/pipes/amountFormat';
import { UiCheckboxModule } from '../checkbox/index';
import { LabelModule } from '../label/label.component';
import { NcpCarouselModule } from '../ncp-carousel/ncp.carousel';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { PlanService } from './service/plan.service';
import { CommonModule } from '@angular/common';
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    NgModule,
    OnChanges,
    OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiMiscModule } from '../misc-element/misc.component';


@Component({

    selector: 'plan-table',
    templateUrl: './plantable.html'
})

export class PlantableComponent implements OnInit {
    @Input() planControl: FormControl;
    @Input() productCode: any;
    @Input() selectText: any;
    @Input() unSelectText: any;
    @Input() policyViewText: any;
    @Input() keyViewText: any;
    @Input() planSelectText: any;
    @Input() selectedPlanText: any;
    @Input() unSelectedPlanText: any;
    @Input() noOfColumns: number = 2;
    @Input() showPlansInSinglePage: boolean = false;
    @Input() filterByCoverageGrpCode: string | Array<string> ;
    @Input() enquiryFlag: boolean = false;
    @Input() doFilterZeroPremiumPlans: boolean = true;
    @Input() doFilterZeroCovgSi: boolean = true;
    @Input() showCoveragePremimum: boolean = false;
    @Input() premiumBreakupText: any = '';
    @Input() siBreakupText: any = '';
    plans: Array<any> = [];
    configPlan;
    carouselFlag: boolean = false;
    favPlansFlag: boolean = true;
    initial: boolean = true;
    cvgGroups: Array<any> = [];
    favCvgCodes = [];
    favCvgResponse;
    owlElement;
    planProcessed = false;
    bckEnquiryFlag: any;
    utils: UtilsService;
    config: ConfigService;
    changeRef: ChangeDetectorRef;
    position: number = 0;
    prevFlag: boolean = true;
    nextFlag: boolean = false;
    isPremChangedFlag: boolean;
    eventHandler: EventService;
    isReOpenCase: boolean = false;
    planSelectText1;
    selectText1;
    unSelectText1;
    policyViewText1;
    keyViewText1;
    rotateFlag = '';
    showbenefits: boolean = false;
    unSelectedPlanText1;
    na: string = 'NCPLabel.na';
    public innerValue;
    public amtFormat: AmountFormat;
    showCoveragePremimunFlag: boolean = false;
    constructor(public planService: PlanService, _utils: UtilsService,
        _config: ConfigService, changeRef: ChangeDetectorRef, _eventHandler: EventService) {
        this.configPlan = planService;
        this.utils = _utils;
        this.config = _config;
        this.changeRef = changeRef;
        this.eventHandler = _eventHandler;
        this.amtFormat = new AmountFormat(this.config);
    }

    ngOnInit() {
        // if (isNaN(this.noOfColumns)) {
        //     this.noOfColumns = parseInt(this.noOfColumns, 0);
        // }

        if (this.noOfColumns) {
            if (this.noOfColumns < 2) {
                this.noOfColumns = 2;
            }
        } else {
            this.noOfColumns = 2;
        }
        // this.selectText = this.utils.getTranslated(this.selectText);
        // this.unSelectText = this.utils.getTranslated(this.unSelectText);
        this.na = this.utils.getTranslated(this.na);
        this.planSelectText1 = this.planSelectText;
        this.keyViewText = this.utils.getTranslated(this.keyViewText);
        this.policyViewText = this.utils.getTranslated(this.policyViewText);
        this.unSelectedPlanText1 = this.unSelectedPlanText;
        // this.configPlan.getPlanJson().subscribe((plans) => {
        this.configPlan.setPlan(this.configPlan.getPlanJson());
        this.preProcessPlanData();
        // });
        this.planControl.valueChanges.subscribe(data => {
            this.preProcessPlanData(data);
        });
    }


    preProcessPlanData(data?) {
        data = data ? data : this.planControl.value;
        if (data[0] && data[0].planTypeCode) {
            let hasPlanPremChangedResponse: boolean = this.hasPlanPremChanged(data);
            if (!this.planProcessed || hasPlanPremChangedResponse) {
                if (this.plans.length > 1 && hasPlanPremChangedResponse) {
                    this.carouselFlag = false;
                    if (this.owlElement) {
                        this.owlElement = null;
                        this.changeRef.detectChanges();
                    }
                }
                this.plans = null;
                this.plans = data;
                this.intializeAfterData();
            }
        }
    }

    intializeAfterData() {
        this.config.setLoadingSub('yes');
        let favPlans;
        if (this.plans) {
            if (this.plans.length > this.noOfColumns - 1) {
                this.carouselFlag = true;
                if (this.plans.length <= this.noOfColumns) {
                    this.prevFlag = true;
                    this.nextFlag = true;
                } else {
                    this.prevFlag = false;
                    this.nextFlag = false;
                }
            }
            if (this.plans.length < this.noOfColumns) {
                this.carouselFlag = false;
            }

            for (let i = 0; i < this.plans.length; i++) {

                // document.getElementById('selectDisplayText').innerText = ' ';
                this.planSelectText1 = '';
                this.favCvgCodes = this.configPlan.get(this.productCode);
                this.plans[i] = this.formatAmountField(this.plans[i]);
                favPlans = this.chooseFavPlans(this.plans[i]);
                if (this.plans[i].isPlanSelected) {
                    this.bckEnquiryFlag = this.enquiryFlag;
                    this.enquiryFlag = false;
                    this.isReOpenCase = true;
                    this.selectPlan(this.plans[i]);
                }
                if (favPlans && favPlans.length > 0) {
                    this.plans[i]['favPlans'] = favPlans;
                    favPlans = [];
                }
            }

            this.planProcessed = true;
            this.config.loggerSub.next('planProcessed');
        }
        this.config.setLoadingSub('no');
    }
    chooseFavPlans(plan) {
        var favPlan = [];
        if (plan.planTypeCode !== '' && plan.planTypeCode !== undefined && plan.planTypeCode !== null) {
            var temp = this.favCvgCodes;
            if (temp) {
                for (var j = 0; j < plan.planDetails.length; j++) {
                    for (var k = 0; k < temp.length; k++) {
                        if (temp[k] === plan.planDetails[j].covgCd) {
                            favPlan.push(plan.planDetails[j]);
                        }
                    }
                }
            }
            this.getCvgGroups(plan);
            return favPlan;
        }
    }

    selectPlan(plan) {
        if (!this.enquiryFlag) {
            if (!plan.isPlanSelected || this.isReOpenCase) {
                for (var i = 0; i < this.plans.length; i++) {
                    if (this.plans[i].planTypeCode === plan.planTypeCode) {
                        this.plans[i].isPlanSelected = true;
                        // if (document.getElementById(i.toString())) {
                        //     document.getElementById(i.toString()).innerText = this.unSelectText;
                        // }
                        this.planSelectText1 = this.planSelectText;
                        if (this.plans[i].planPrem) {
                            if (parseFloat(this.plans[i].summaryInfo.clientPremiumPrime) < parseFloat(this.plans[i].planPrem)) {
                                if (plan.planDetails[i].PremCurr) {
                                    this.unSelectedPlanText1 = this.plans[i].planTypeDesc + ' ' + this.amtFormat.transform(parseFloat(this.plans[i].summaryInfo.clientPremiumPrime), ['', '', plan.planDetails[i].PremCurr]);
                                } else {
                                    this.unSelectedPlanText1 = this.plans[i].planTypeDesc + ' ' + this.amtFormat.transform(parseFloat(this.plans[i].summaryInfo.clientPremiumPrime), []);
                                }
                            } else if (this.plans[i].displayPlanPrem) {
                                this.unSelectedPlanText1 = this.plans[i].planTypeDesc + ' ' + this.plans[i].displayPlanPrem;
                            }
                            else {
                                this.unSelectedPlanText1 = this.plans[i].planTypeDesc + " 0.00";
                            }
                            // document.getElementById('planSelectText').innerText = this.plans[i].planTypeDesc + ' ' + this.plans[i].displayPlanPrem;
                        } else {
                            // document.getElementById('planSelectText').innerText = this.plans[i].planTypeDesc;
                            this.unSelectedPlanText1 = this.plans[i].planTypeDesc;
                        }
                    } else {
                        this.plans[i].isPlanSelected = false;
                        // if (document.getElementById(i.toString())) {
                        //     document.getElementById(i.toString()).innerText = this.selectText;
                        // }
                    }
                    if (!this.bckEnquiryFlag) {
                        this.setPlanToControl(this.plans);
                    }
                }
            } else {
                // document.getElementById('selectDisplayText').innerText = '';
                this.planSelectText1 = "";
                for (var i = 0; i < this.plans.length; i++) {
                    if (this.plans[i].planTypeCode === plan.planTypeCode) {
                        this.plans[i].isPlanSelected = false;
                        this.setPlanToControl(this.plans);
                        // if (document.getElementById(i.toString())) {
                        //     document.getElementById(i.toString()).innerText = this.selectText;
                        // }
                        // document.getElementById('selectDisplayText').innerText = ' ';
                        this.planSelectText1 = "";
                        // document.getElementById('planSelectText').innerText = this.unSelectedPlanText;
                        this.unSelectedPlanText1 = this.unSelectedPlanText;
                    }
                }
            }
            this.config.loggerSub.next('planProcessed');
        }
        if (this.bckEnquiryFlag) {
            this.enquiryFlag = this.bckEnquiryFlag;
        }

    }
    getCvgGroups(plan) {
        var notPresent;
        if (this.cvgGroups.length < 1) {
            for (var l = 0; l < plan.planDetails.length; l++) {
                if (this.cvgGroups.length > 0) {
                    notPresent = false;
                    for (var m = 0; m < this.cvgGroups.length; m++) {
                        if (this.cvgGroups[m].cvgGrpCode !== plan.planDetails[l].coverageGrpCode) {
                            notPresent = true;
                        }
                        if (this.cvgGroups[m].cvgGrpCode === plan.planDetails[l].coverageGrpCode) {
                            notPresent = false;
                            break;
                        }
                    }
                    if (notPresent) {
                        this.cvgGroups[this.cvgGroups.length] = { 'cvgGrpCode': '', 'cvgGrpDesc': '' };
                        this.cvgGroups[this.cvgGroups.length - 1].cvgGrpCode = plan.planDetails[l].coverageGrpCode;
                        this.cvgGroups[this.cvgGroups.length - 1].cvgGrpDesc = plan.planDetails[l].coverageGrpDesc;
                    }
                }
                if (this.cvgGroups.length < 1) {
                    if (plan.planDetails[l].coverageGrpCode != '' && plan.planDetails[l].coverageGrpCode != null
                        && plan.planDetails[l].coverageGrpCode != undefined) {
                        this.cvgGroups[0] = { 'cvgGrpCode': '', 'cvgGrpDesc': '' };
                        this.cvgGroups[0].cvgGrpCode = plan.planDetails[l].coverageGrpCode;
                        this.cvgGroups[0].cvgGrpDesc = plan.planDetails[l].coverageGrpDesc;
                    }

                }
            }
        }

    }

    toggleDetail(i, d) {
        var id = i.toString() + d.toString() + '-plan';
        if (document.getElementById(id).style.display === 'none') {
            document.getElementById(id).style.display = 'block';
        } else {
            document.getElementById(id).style.display = 'none';
        }
    }

    switchView() {
        window.scrollTo(200, 200);
        if (this.favPlansFlag) {
            this.favPlansFlag = false;
            document.getElementById('viewPlans').innerText = this.keyViewText;
        } else {
            this.favPlansFlag = true;
            document.getElementById('viewPlans').innerText = this.policyViewText;
        }
    }

    getOwlElement(owlElement) {
        if (!this.showPlansInSinglePage) {
            this.owlElement = owlElement;
            // document.getElementById('viewPlans').innerText = this.policyViewText;
            this.policyViewText1 = this.policyViewText;
        }
    }

    prev() {
        this.owlElement.trigger('prev.owl.carousel');
    }

    doShowHidePrevNavButton() {
        if (this.position > -1) {
            this.position = this.position - 1;
            this.prevFlag = false;
        }
        if (this.position == 0) {
            this.prevFlag = true;
            this.nextFlag = false;
        }
        if (this.position <= this.plans.length - 2) {
            this.nextFlag = false;
        }
    }
    next() {
        this.owlElement.trigger('next.owl.carousel');
    }

    doShowHideNextNavButton() {
        this.position = this.position + 1;

        if (this.position > 0) {
            this.prevFlag = false;
            this.nextFlag = false;
        }
        if (this.position >= this.plans.length - 2) {
            this.nextFlag = true;
        }

        if (this.position == 0) {
            this.nextFlag = false;
        }

    }

    changeExcess(event) {

    }


    setPlanToControl(plansVar) {
        // for (var i =0 ;i < plansVar.length;i++){
        //     delete plansVar[i]['favPlans'];
        // }
        this.planProcessed = true;
        let plan: any = this.planControl.value;
        for (let i = 0; i < plan.length; i++) {
            if (plan[i].planTypeCode) {
                for (let j = 0; j < plansVar.length; j++) {
                    if (plansVar[j].planTypeCode === plan[i].planTypeCode) {
                        plan[i].isPlanSelected = plansVar[j].isPlanSelected;
                        plan[i].excessDeductibleCode = plansVar[j].excessDeductibleCode;
                        plan[i].excessDeductibleDesc = plansVar[j].excessDeductibleDesc;
                    }
                }
            }
        }
        this.planControl.patchValue(plan);
        this.changeRef.markForCheck();
    }

    formatAmountField(plan) {
        /*Currency symbol vanishing is not showing in enquiry */
        // if (!this.enquiryFlag) {
        if (parseFloat(plan.summaryInfo.clientPremiumPrime) < parseFloat(plan.planPrem)) {
            if (!isNaN(parseFloat(plan.summaryInfo.clientPremiumPrime))) {
                if (plan.planDetails[0].PremCurr) {
                    plan.displayClientPrem = this.amtFormat.transform(parseFloat(plan.summaryInfo.clientPremiumPrime), ['', '', plan.planDetails[0].PremCurr]);
                } else {
                    plan.displayClientPrem = this.amtFormat.transform(parseFloat(plan.summaryInfo.clientPremiumPrime), []);
                }
            }
        }
        if (!isNaN(parseFloat(plan.planPrem))) {
            if (plan.planDetails[0].PremCurr) {
                plan.displayPlanPrem = this.amtFormat.transform(parseFloat(plan.planPrem), ['', '', plan.planDetails[0].PremCurr]);
            } else {
                plan.displayPlanPrem = this.amtFormat.transform(parseFloat(plan.planPrem), []);
            }
            for (var i = 0; i < plan.planDetails.length; i++) {
                if (plan.planDetails[i].siCurr) {
                    plan.planDetails[i].displayCovgSi = this.amtFormat.transform(parseFloat(plan.planDetails[i].covgSi), ['', '', plan.planDetails[i].siCurr]);
                } else {
                    plan.planDetails[i].displayCovgSi = this.amtFormat.transform(parseFloat(plan.planDetails[i].covgSi), []);
                }
                if (!plan.planDetails[i].displayCovgSi || plan.planDetails[i].displayCovgSi == 0.00) {
                    plan.planDetails[i].displayCovgSi = this.na;
                }
                if (this.showCoveragePremimum) {
                    if (plan.planDetails[i].PremCurr) {
                        plan.planDetails[i].displayCovgPrm = this.amtFormat.transform(parseFloat(plan.planDetails[i].covgPrm), ['', '', plan.planDetails[i].PremCurr]);
                    } else {
                        plan.planDetails[i].displayCovgPrm = this.amtFormat.transform(parseFloat(plan.planDetails[i].covgPrm), []);
                    }
                }
            }
        }

        //   }
        return plan;
    }

    hasPlanPremChanged(data: Object[]): boolean {
        if (data.length > 0 && this.plans.length > 0 && data.length === this.plans.length) {
            for (let key in data) {
                if (data[key]['planPrem'] !== this.plans[key]['planPrem']  || data[key]['summaryInfo']['clientPremiumPrime'] !== this.plans[key]['summaryInfo']['clientPremiumPrime']) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
    showprodBrochurePdf() {
        this.eventHandler.setEvent('click', 'productBrochureclickId');
    }

    showhideCoveragePremium() {
        window.scroll(200, 200);
    }
}


export const UI_PLANTABLE_DIRECTIVES = [PlantableComponent];
@NgModule({
    declarations: UI_PLANTABLE_DIRECTIVES,
    imports: [CommonModule, FormsModule, UiCheckboxModule, NcpCarouselModule, ReactiveFormsModule, LabelModule, SharedModule, UiMiscModule],
    exports: [UI_PLANTABLE_DIRECTIVES, SharedModule],
    providers: [PlanService]
})
export class UiPlantableModule { }