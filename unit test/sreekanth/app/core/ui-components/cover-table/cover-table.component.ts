import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, NgModule, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlanDetailsInfo } from '../../../modules/common/models/plandetailInfo.model';
import { DefaultPolicyModel } from '../../../modules/common/services/defaultModel.service';
import { ConfigService } from '../../services/config.service';
import { SharedModule } from '../../shared/shared.module';
import { UiAmountModule } from '../amount';
import { AmountFormat } from '../amount/pipes/amountFormat';
import { UiCheckboxModule } from '../checkbox';
import { UiMiscModule } from '../misc-element/misc.component';
import { UiTextBoxModule } from '../textbox';
import { TooltipModule } from '../tooltip';
import { UtilsService } from '../utils/utils.service';
import { CoverageLoadingInfo } from './../../../modules/common/models/coverageLoadingInfo.model';
import { PickListService } from './../../../modules/common/services/picklist.service';
import { EventService } from './../../services/event.service';
import { UiButtonModule } from './../button/button.component';
import { UiDropdownModule } from './../dropdown/dropdown.component';
import { LabelModule } from './../label/label.component';
import { ModalModule } from './../modal';
import { CoverTableService } from './service/cover-table.service';


@Component({
    selector: 'cover-table',
    templateUrl: 'cover-table.html'
})

export class CoverTableComponent implements OnInit, AfterViewInit, AfterContentInit, OnChanges, OnDestroy {
    transactionTypeInstance: any;
    _formBuilder: FormBuilder;
    @Input() tableControl: FormArray;
    @Input() LOB: string = '';
    @Input() tooltipTitle: string = '';
    @Input() isEndorsementFlag: boolean = false;
    @Input() project: string;
    @Input() transactionType: string;
    @Input() endtReasonCode: string;
    @Input() productCode: any;
    @Input() planIndex: any;
    @Input() sectionClass: FormControl;
    @Input() coverageHeader: Array<string> = [];
    @Input() coverageMapping: Array<string> = [];
    coverTableFormGroup: any;
    isCollapsedTr: boolean = false;
    rotateFlag: '';
    enquiryMode: boolean = false;
    coverageGroupCode: string = '';
    coverageIconsClassNames = ['', '', '', '', 'glyphicon glyphicon-cog showPopover indexre', ''];
    tableDetails: any[];
    columnsList: Array<any> = [];
    planDetail: PlanDetailsInfo;
    plans: Array<any> = [];
    _coverageHeader = [];
    cvgGroups: Array<any> = [];
    _coverageMapping = [];
    sort: any;
    changeRef: ChangeDetectorRef;
    _coverageIconsClassNames = [];
    defFormGroup = new FormGroup({
        defCode: new FormControl(),
        defCodeDesc: new FormControl()
    });
    remarksFormGroup = new FormGroup({
        remarks: new FormControl(),
        remarksDesc: new FormControl()
    });
    planDetailsObject: any = {};
    isChangeInSumInsuredEndt: boolean = false;
    coverageLoadingModalFlag: boolean = false;
    remarksModalFlag: boolean = false;
    adddeletecovflag: boolean = false;
    unoccupancyflag: boolean = false;
    isError: boolean = false;
    errDesc: string = '';
    coverTableConfig: any;
    coverageCode: FormControl = new FormControl('');
    coverageLoadingInfo: CoverageLoadingInfo;
    changeSub: any;
    isUpdatedCoverTableGroup: boolean = false;
    constructor(public _travelPolicyFB: FormBuilder, public config: ConfigService,
        changeRef: ChangeDetectorRef, public amtFormat: AmountFormat,
        public utils: UtilsService, public activeRoute: ActivatedRoute,
        public pickListService: PickListService, public coverTableService: CoverTableService,
        public eventHandlerService: EventService) {
        let quoteModelInstance = new DefaultPolicyModel(_travelPolicyFB);
        this._coverageHeader.push(...this.coverageHeader);
        this._coverageMapping.push(...this.coverageMapping);
        this._coverageIconsClassNames.push(...this.coverageIconsClassNames);
        this.changeRef = changeRef;
        this.planDetail = quoteModelInstance.getPlanDetailsInfo();
        this.coverageLoadingInfo = quoteModelInstance.getCoverageLoadingInfo();
    }
    ngOnInit() {
        if (!this.planIndex) {
            this.planIndex = 0;
        }
        if (this.endtReasonCode === this.utils.getEndorsementNCPTypeCode('CHANGE_IN_SUM_INSURED') || this.endtReasonCode === this.utils.getEndorsementNCPTypeCode('ADD_DELETE_COVERAGE')) {
            this.isChangeInSumInsuredEndt = this.endtReasonCode === this.utils.getEndorsementNCPTypeCode('CHANGE_IN_SUM_INSURED');
            if (this.isChangeInSumInsuredEndt) {
                this.coverageHeader = ['NCPLabel.coverApplicable', 'NCPLabel.covgDesc', 'NCPLabel.oldCovgSI', 'NCPLabel.userSIValue', 'NCPLabel.covgSI', 'NCPLabel.coverageDeductibles', 'NCPLabel.covgPrm'];
                this.coverageMapping = ['recalcFlag', 'covgDesc', 'oldCovgSi', 'userSIValue', 'covgSi', 'viewDEF', 'covgPrm'];
            } else if (this.endtReasonCode === this.utils.getEndorsementNCPTypeCode('ADD_DELETE_COVERAGE')) {
                this.adddeletecovflag = true;
                this.coverageHeader = ['NCPLabel.coverApplicable', 'NCPLabel.covgDesc', 'NCPLabel.covgSI', 'NCPLabel.coverageDeductibles', 'NCPLabel.covgPrm', 'NCPBtn.adddelete'];
                this.coverageMapping = ['recalcFlag', 'covgDesc', 'covgSi', 'viewDEF', 'covgPrm', 'isCoverageDeleted'];
            } else {
                this.adddeletecovflag = false;
                this.coverageHeader = ['NCPLabel.coverApplicable', 'NCPLabel.covgDesc', 'NCPLabel.oldCovgSI', 'NCPLabel.covgSI', 'NCPLabel.coverageDeductibles', 'NCPLabel.covgPrm'];
                this.coverageMapping = ['recalcFlag', 'covgDesc', 'oldCovgSi', 'covgSi', 'viewDEF', 'covgPrm'];
            }
        }
        if (this.coverageHeader === undefined || (this.coverageHeader && this.coverageHeader.length < 1)) {
            this.coverageHeader = ['NCPLabel.coverApplicable', 'NCPLabel.covgDesc', 'NCPLabel.covgSI', 'NCPLabel.coverageDeductibles', 'NCPLabel.covgPrm', 'NCPLabel.remarks'];
        }
        if (this.coverageMapping === undefined || (this.coverageMapping && this.coverageMapping.length < 1)) {
            this.coverageMapping = ['recalcFlag', 'covgDesc', 'covgSi', 'viewDEF', 'covgPrm', 'remarks'];
        }
        let tableLength = this.coverageMapping.length;
        this.columnsList = [];
        for (let i = 0; i < tableLength; i++) {
            this.columnsList.push({ header: this.coverageHeader[i], mapping: this.coverageMapping[i], showColumn: true, className: this.coverageIconsClassNames[i] });
        }
        this.coverTableConfig = this.coverTableService.get(this.productCode) ? this.coverTableService.get(this.productCode) : '';
        this.tableDetails = this.columnsList;
        this.plans = this.tableControl.value;
        this.enquiryMode = this.tableControl.status === "DISABLED";


        this.sort = {
            column: 'NAME',
            descending: false
        };

    }
    updateCoverTableValue(data) {
        if (data.length > 0) {
            this.plans = data;
            if (this.plans.length > 0) {
                for (let i = 0; i < this.plans.length; i++) {
                    if (this.plans[i].planDetails && this.plans[i].planDetails.length > 0 && this.plans[i].planDetails[0].coverageGrpCode) {
                        this.plans[i] = this.getCvgGroups(this.plans[i]);
                        this.isUpdatedCoverTableGroup = true;
                    }
                }
            }
        }
    }
    updateDetails(inputPlanDetailsObject, value) {
        this.plans[parseInt(this.planIndex)] = this.updateTableControl(this.plans[parseInt(this.planIndex)], inputPlanDetailsObject, value);
        this.tableControl.patchValue(this.plans);
        this.changeRef.markForCheck();
    }
    ngAfterContentInit() {
        this.changeSub = this.eventHandlerService.changeSub.subscribe((data) => {
            if (data.id) {
                if (data.id === 'defcodeselected') {
                    this.addDEFCode();
                }
                if (data.id === 'remarksid') {
                    this.updateRemarksTableControlValues(data.value);
                }
            }
        });
        this.changeSub = this.eventHandlerService.dataShare.subscribe((data) => {
            if (data.id) {
                if (data.id === 'coverTable') {
                    this.tableControl.patchValue(data.value);
                    this.tableControl.updateValueAndValidity();
                    this.plans = this.tableControl.value;
                    // if (!this.isUpdatedCoverTableGroup) {
                    this.updateCoverTableValue(data.value);
                    // }
                }
            }
        });
        if (this.enquiryMode) {
            this.remarksFormGroup.disable();
        }
    }
    ngAfterViewInit() {

    }
    selectedClass(columnName): any {
        return columnName === this.sort.column ? 'sort-' + this.sort.descending : false;
    }
    changeSorting(columnName): void {
        if (columnName) {
            let sort = this.sort;
            if (sort.column === columnName) {
                sort.descending = !sort.descending;
            } else {
                sort.column = columnName;
                sort.descending = false;
            }
        }
    }
    convertSorting(): string {
        return this.sort.descending ? '-' + this.sort.column : this.sort.column;
    }

    toggleDisplayCoverages(coverageGroupCode: string) {
        if (this.coverageGroupCode === '' || this.coverageGroupCode !== coverageGroupCode) {
            this.isCollapsedTr = true;
        } else if (this.coverageGroupCode === coverageGroupCode) {
            this.isCollapsedTr = !this.isCollapsedTr;
        }
        this.coverageGroupCode = coverageGroupCode;
    }

    getCvgGroups(plan) {
        let notPresent;
        this.cvgGroups = [];
        for (let i = 0; i < plan.planDetails.length; i++) {
            if (this.cvgGroups.length > 0) {
                notPresent = false;
                for (let m = 0; m < this.cvgGroups.length; m++) {
                    if (this.cvgGroups[m].cvgGrpCode !== plan.planDetails[i].coverageGrpCode) {
                        notPresent = true;
                    }
                    if (this.cvgGroups[m].cvgGrpCode === plan.planDetails[i].coverageGrpCode) {
                        notPresent = false;
                        break;
                    }
                }
                if (notPresent) {
                    this.cvgGroups[this.cvgGroups.length] = { 'cvgGrpCode': '', 'cvgGrpDesc': '' };
                    this.cvgGroups[this.cvgGroups.length - 1].cvgGrpCode = plan.planDetails[i].coverageGrpCode;
                    this.cvgGroups[this.cvgGroups.length - 1].cvgGrpDesc = plan.planDetails[i].coverageGrpDesc;
                }
            }
            if (this.cvgGroups.length < 1) {
                if (plan.planDetails[i].coverageGrpCode != '' && plan.planDetails[i].coverageGrpCode != null
                    && plan.planDetails[i].coverageGrpCode != undefined) {
                    this.cvgGroups[0] = { 'cvgGrpCode': '', 'cvgGrpDesc': '' };
                    this.cvgGroups[0].cvgGrpCode = plan.planDetails[i].coverageGrpCode;
                    this.cvgGroups[0].cvgGrpDesc = plan.planDetails[i].coverageGrpDesc;
                }
            }
            plan.planDetails[i]['disableRecalcFlag'] = this.enquiryMode ? true : plan.planDetails[i]['disableRecalcFlag'] ? plan.planDetails[i]['disableRecalcFlag'] : false;
            plan.planDetails[i]['disableCovgSi'] = this.enquiryMode ? true : plan.planDetails[i]['disableCovgSi'] ? plan.planDetails[i]['disableCovgSi'] : false;
            if (plan.planDetails[i]['remarks'] === undefined) {
                plan.planDetails[i]['remarks'] = '';
                plan.planDetails[i]['remarksDesc'] = '';
            }
            
            plan.planDetails[i]['remarksDropdownFlag'] = plan.planDetails[i]['remarksDropdownFlag'] ? plan.planDetails[i]['remarksDropdownFlag'] : false;
            // plan.planDetails[i]['remarksDescDisplayFlag'] = false;
            if (this.coverTableConfig.MANDATORY && this.coverTableConfig.MANDATORY.length > 0) {
                for (let j = 0; j < this.coverTableConfig.MANDATORY.length; j++) {
                    if (plan.planDetails[i].covgCd === this.coverTableConfig.MANDATORY[j] && plan.planDetails[i].disableRecalcFlag === false) {
                        plan.planDetails[i]['disableRecalcFlag'] = true;
                    }
                }
            }
            if (this.coverTableConfig.SI_NON_EDITABLE && this.coverTableConfig.SI_NON_EDITABLE.length > 0) {
                for (let j = 0; j < this.coverTableConfig.SI_NON_EDITABLE.length; j++) {
                    if (plan.planDetails[i].covgCd === this.coverTableConfig.SI_NON_EDITABLE[j] && plan.planDetails[i].disableCovgSi === false) {
                        plan.planDetails[i]['disableCovgSi'] = true;
                    }
                }
            }

            if (plan.planDetails[i].recalcFlag === false || plan.planDetails[i].recalcFlag === 'false') {
                plan.planDetails[i]['disableCovgSi'] = true;
                plan.planDetails[i]['disableUserSIValue'] = true;
            }
            if (this.isChangeInSumInsuredEndt) {
                plan.planDetails[i]['disableRecalcFlag'] = true;
                plan.planDetails[i]['disableCovgSi'] = true;
            }
            if (this.coverTableConfig.REMARKS_DROPDOWN && this.coverTableConfig.REMARKS_DROPDOWN.length > 0) {
                for (let j = 0; j < this.coverTableConfig.REMARKS_DROPDOWN.length; j++) {
                    if (plan.planDetails[i].covgCd === this.coverTableConfig.REMARKS_DROPDOWN[j] && plan.planDetails[i].remarksDropdownFlag === false) {
                        plan.planDetails[i]['remarksDropdownFlag'] = true;
                        if (plan.planDetails[i]['remarks']) {
                            let remarksPicklistInput = { auxType: "Party", code: plan.planDetails[i]['remarks'], param1: plan.planDetails[i]['remarksRoleId'] };
                            let remarksDetails = this.pickListService.getPickList(remarksPicklistInput, null);
                            remarksDetails.subscribe(
                                (response) => {
                                    if (response.error !== null && response.error !== undefined && response.error.length >= 1) {
                                        this.isError = true;
                                        this.errDesc = response.error[0].errDesc;
                                    } else {
                                        this.isError = false;
                                        plan.planDetails[i]['remarksDesc'] = response[0].desc;
                                        this.changeRef.detectChanges();
                                    }
                                });
                        }
                    }
                }
            }
            // if (plan.planDetails[i]['remarks'] && plan.planDetails[i]['remarksDropdownFlag'] === true) {
            //     plan.planDetails[i]['remarksDropdownFlag'] = false;
            //     // plan.planDetails[i]['remarksDescDisplayFlag'] = true;
            // }
            if (!this.enquiryMode && this.coverTableConfig && (this.coverTableConfig.SERVICE_PROVIDER)) {
                if (this.coverTableConfig.SERVICE_PROVIDER && this.coverTableConfig.SERVICE_PROVIDER.length > 0) {
                    for (let j = 0; j < this.coverTableConfig.SERVICE_PROVIDER.length; j++) {
                        for (let k = 0; k < this.coverTableConfig.SERVICE_PROVIDER[j].DEPENDENT_COVG_CD.length; k++) {
                            if (this.coverTableConfig.SERVICE_PROVIDER[j].DEPENDENT_COVG_CD[k] === plan.planDetails[i].covgCd) {
                                if (plan.planDetails[i]['remarksRoleId'] === undefined) {
                                    plan.planDetails[i]['remarksRoleId'] = this.coverTableConfig.SERVICE_PROVIDER[j].SP_ROLE_ID;
                                }
                            }
                        }
                    }
                }

            }

        }
        return plan;
    }
    updateTableControlValues(inputObject, value) {
        if (inputObject) {
            if (this.plans.length > 0) {
                for (let i = 0; i < this.plans.length; i++) {
                    if (this.plans[i].planDetails && this.plans[i].planDetails.length > 0 && this.plans[i].planDetails[0].coverageGrpCode) {
                        for (let j = 0; j < this.plans[i].planDetails.length; j++) {
                            if (this.plans[i].planDetails[j].covgCd === inputObject.covgCd) {
                                if (inputObject.remarksDropdownFlag && this.remarksFormGroup) {
                                    this.plans[i].planDetails[j]['remarks'] = this.remarksFormGroup.get('remarksDesc').value;
                                    inputObject.remarks = this.remarksFormGroup.get('remarksDesc').value;
                                }
                                this.plans[i].planDetails[j] = inputObject;
                                this.tableControl.patchValue(this.plans);
                                this.tableControl.updateValueAndValidity();
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    updateRemarksTableControlValues(inputObject) {
        // if (inputObject.length > 0) {
        if (this.plans.length > 0) {
            for (let i = 0; i < this.plans.length; i++) {
                if (this.plans[i].planDetails && this.plans[i].planDetails.length > 0 && this.plans[i].planDetails[0].coverageGrpCode) {
                    for (let j = 0; j < this.plans[i].planDetails.length; j++) {
                        if (this.plans[i].planDetails[j].covgCd === inputObject.sharedValue) {
                            if (this.remarksFormGroup) {
                                this.plans[i].planDetails[j]['remarks'] = inputObject.value;
                                this.plans[i].planDetails[j]['remarksDesc'] = this.remarksFormGroup.get('remarksDesc').value;
                            }
                            this.tableControl.patchValue(this.plans);
                            this.tableControl.updateValueAndValidity();
                            break;
                        }
                    }
                }
            }
        }
        //  }
    }
    updateTableControl(plan, inputPlanDetailsObject, value) {
        this.unoccupancyflag = false;
        for (let i = 0; i < plan.planDetails.length; i++) {
            if (!this.enquiryMode && this.coverTableConfig && (this.coverTableConfig.MUTUALLY_EXCLUSIVE_COVG || this.coverTableConfig.DEPENDENT)) {
                if (this.coverTableConfig.DEPENDENT && this.coverTableConfig.DEPENDENT.length > 0) {
                    for (let j = 0; j < this.coverTableConfig.DEPENDENT.length; j++) {
                        if (plan.planDetails[i].covgCd === this.coverTableConfig.DEPENDENT[j].MAIN_COVG_CD && this.coverTableConfig.DEPENDENT[j].DEPENDENT_COVG_CD && this.coverTableConfig.DEPENDENT[j].DEPENDENT_COVG_CD.length > 0) {
                            for (let k = 0; k < this.coverTableConfig.DEPENDENT[j].DEPENDENT_COVG_CD.length; k++) {
                                for (let l = 0; l < plan.planDetails.length; l++) {
                                    if (this.coverTableConfig.DEPENDENT[j].DEPENDENT_COVG_CD[k] === this.plans[0].planDetails[l].covgCd && (plan.planDetails[i].recalcFlag === false || plan.planDetails[i].recalcFlag === 'false')) {
                                        plan.planDetails[l]['recalcFlag'] = false;
                                        plan.planDetails[l]['disableRecalcFlag'] = true;
                                        plan.planDetails[l]['covgSi'] = '0.00';
                                        break;
                                    } else if (this.coverTableConfig.DEPENDENT[j].DEPENDENT_COVG_CD[k] === this.plans[0].planDetails[l].covgCd && (plan.planDetails[i].recalcFlag === true || plan.planDetails[i].recalcFlag === 'true')) {
                                        plan.planDetails[l]['disableRecalcFlag'] = false;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                if (this.coverTableConfig.MUTUALLY_EXCLUSIVE_COVG && this.coverTableConfig.MUTUALLY_EXCLUSIVE_COVG.GROUP1 && this.coverTableConfig.MUTUALLY_EXCLUSIVE_COVG.GROUP1.length > 1 && inputPlanDetailsObject) {
                    for (let j = 0; j < this.coverTableConfig.MUTUALLY_EXCLUSIVE_COVG.GROUP1.length; j++) {
                        if (plan.planDetails[i].covgCd === this.coverTableConfig.MUTUALLY_EXCLUSIVE_COVG.GROUP1[j] && plan.planDetails[i].covgCd != inputPlanDetailsObject.covgCd) {
                            plan.planDetails[i]['recalcFlag'] = false;
                            plan.planDetails[i]['covgSi'] = '0.00';
                        }
                    }
                }
            }
            plan.planDetails[i]['disableRecalcFlag'] = this.enquiryMode ? true : plan.planDetails[i]['disableRecalcFlag'] ? plan.planDetails[i]['disableRecalcFlag'] : false;
            plan.planDetails[i]['disableCovgSi'] = this.enquiryMode ? true : plan.planDetails[i]['disableCovgSi'] ? plan.planDetails[i]['disableCovgSi'] : false;
            if (plan.planDetails[i]['remarks'] === undefined) {
                plan.planDetails[i]['remarks'] = '';
                plan.planDetails[i]['remarksDesc'] = '';
            }


            plan.planDetails[i]['remarksDropdownFlag'] = plan.planDetails[i]['remarksDropdownFlag'] ? plan.planDetails[i]['remarksDropdownFlag'] : false;
            if (this.coverTableConfig.MANDATORY && this.coverTableConfig.MANDATORY.length > 0) {
                for (let j = 0; j < this.coverTableConfig.MANDATORY.length; j++) {
                    if (plan.planDetails[i].covgCd === this.coverTableConfig.MANDATORY[j] && plan.planDetails[i].disableRecalcFlag === false) {
                        plan.planDetails[i]['disableRecalcFlag'] = true;
                    }
                }
            }
            if (this.coverTableConfig.SI_NON_EDITABLE && this.coverTableConfig.SI_NON_EDITABLE.length > 0) {
                for (let j = 0; j < this.coverTableConfig.SI_NON_EDITABLE.length; j++) {
                    if (plan.planDetails[i].covgCd === this.coverTableConfig.SI_NON_EDITABLE[j] && plan.planDetails[i].disableCovgSi === false) {
                        plan.planDetails[i]['disableCovgSi'] = true;
                    }
                }
            }
            if (this.coverTableConfig.COVERTABLE_SI_EDITABLE) {
                let SI_EDITABLE: Array<String> = this.coverTableConfig.COVERTABLE_SI_EDITABLE;
                for (let j = 0; j < SI_EDITABLE.length; j++) {
                    if (plan.planDetails[i].covgCd === SI_EDITABLE[j] && plan.planDetails[i].covgCd === inputPlanDetailsObject.covgCd) {
                        if (value) {
                            plan.planDetails[i]['disableCovgSi'] = false;
                            plan.planDetails[i]['recalcFlag'] = true;
                        } else {
                            plan.planDetails[i]['disableCovgSi'] = true;
                            plan.planDetails[i]['recalcFlag'] = false;
                        }
                    }
                }
            }
            if (this.coverTableConfig.COVERTABLE_UNOCCUPANCYDATE_FLAG) {
                let UNOCCUPANCYDATE_FLAG: Array<String> = this.coverTableConfig.COVERTABLE_UNOCCUPANCYDATE_FLAG;
                for (let j = 0; j < UNOCCUPANCYDATE_FLAG.length; j++) {
                    if (plan.planDetails[i].covgCd === UNOCCUPANCYDATE_FLAG[j] && plan.planDetails[i].recalcFlag === true && plan.planDetails[i].covgCd === inputPlanDetailsObject.covgCd) {
                        this.unoccupancyflag = true;
                    }
                    plan.planDetails[i]['remarks'] = '';
                    plan.planDetails[i]['remarksDesc'] = '';
                    this.eventHandlerService.dataShare.next({ value: this.unoccupancyflag, id: 'unoccupancydate' });
                }
            }
            if (this.coverTableConfig.COVERTABLE_SI_DISABLED) {
                let SI_DISABLED: Array<String> = this.coverTableConfig.COVERTABLE_SI_DISABLED;
                for (let j = 0; j < SI_DISABLED.length; j++) {
                    if (plan.planDetails[i].covgCd === SI_DISABLED[j] && plan.planDetails[i].disableCovgSi === false) {
                        plan.planDetails[i]['disableCovgSi'] = true;
                    }
                }
            }
            if (plan.planDetails[i].recalcFlag === false || plan.planDetails[i].recalcFlag === 'false') {
                plan.planDetails[i]['disableCovgSi'] = true;
                plan.planDetails[i]['disableUserSIValue'] = true;
            }
            if (this.isChangeInSumInsuredEndt) {
                plan.planDetails[i]['disableRecalcFlag'] = true;
                plan.planDetails[i]['disableCovgSi'] = true;
            }
            if (this.coverTableConfig.REMARKS_DROPDOWN && this.coverTableConfig.REMARKS_DROPDOWN.length > 0) {
                for (let j = 0; j < this.coverTableConfig.REMARKS_DROPDOWN.length; j++) {
                    if (plan.planDetails[i].covgCd === this.coverTableConfig.REMARKS_DROPDOWN[j] && plan.planDetails[i].remarksDropdownFlag === false) {
                        plan.planDetails[i]['remarksDropdownFlag'] = true;
                    }
                }
            }
        }
        return plan;
    }

    toggleDetail(i, d) {
        let id = i.toString() + d.toString() + '-plan';
        if (document.getElementById(id).style.display === 'none') {
            document.getElementById(id).style.display = 'block';
        } else {
            document.getElementById(id).style.display = 'none';
        }
    }

    openCoverageLoadingModal(planDetailsObject) {
        this.planDetailsObject = planDetailsObject;
        if (this.sectionClass && this.sectionClass.value) {
            this.coverageCode.setValue(this.planDetailsObject.covgCd);
        }
        this.coverageLoadingModalFlag = true;
        this.changeRef.detectChanges();
    }

    closeCoverageLoadingModal() {
        if (!this.enquiryMode && !this.tableControl.disabled) {
            this.plans.forEach(planObject => {
                planObject.planDetails.forEach(planDetailsObject => {
                    if (planDetailsObject.covgCd === this.planDetailsObject.covgCd) {
                        planDetailsObject = this.planDetailsObject;
                    }
                });
            });
            for (let i = 0; i < this.tableControl.length; i++) {
                let tablePlanDetailsArray: FormArray = <FormArray>this.tableControl.at(i).get('planDetails');
                for (let j = 0; j < tablePlanDetailsArray.length; j++) {
                    let tableCoverageLoading: FormArray = <FormArray>tablePlanDetailsArray.at(j).get('coverageLoadingInfo');

                    if (tablePlanDetailsArray.at(j).get('covgCd').value === this.planDetailsObject.covgCd) {

                        // To remove existing 'coverageLoadingInfo'
                        if (tableCoverageLoading && tableCoverageLoading.length > 0) {
                            for (let k = 0; k < tableCoverageLoading.length; k++) {
                                tableCoverageLoading.removeAt(k);
                                k--;
                            }
                        }
                        //End

                        // To add 'coverageLoadingInfo'
                        if (this.planDetailsObject['coverageLoadingInfo'] !== undefined) {
                            let coverageLoadingInfoLength: number = this.planDetailsObject.coverageLoadingInfo.length;
                            for (let k = 0; k < coverageLoadingInfoLength; k++) {
                                tableCoverageLoading.push(this.coverageLoadingInfo.getCoverageLoadingInfoModel());
                                tableCoverageLoading.at(k).setValue(this.planDetailsObject.coverageLoadingInfo[k]);
                            }
                        }
                        // End
                    }
                }
            }
            this.planDetailsObject = {};
            this.defFormGroup.get('defCode').setValue('');
            this.defFormGroup.get('defCodeDesc').setValue('');
            this.coverageCode.setValue('');
        }
        this.coverageLoadingModalFlag = false;
        this.isError = false;
    }

    addDEFCode() {
        this.isError = false;
        let duplicateDEFCodeFlag: boolean = false;
        if (this.planDetailsObject['coverageLoadingInfo'] === undefined && this.defFormGroup.get('defCode').value) {
            this.planDetailsObject['coverageLoadingInfo'] = [];
        }
        if (this.planDetailsObject['coverageLoadingInfo'] !== undefined) {
            for (let i = 0; i < this.planDetailsObject.coverageLoadingInfo.length; i++) {
                if (this.defFormGroup.get('defCode').value === this.planDetailsObject.coverageLoadingInfo[i].loadCode) {
                    duplicateDEFCodeFlag = true;
                    break;
                }
            }
        }
        if (duplicateDEFCodeFlag) {
            this.defFormGroup.get('defCode').setValue('');
            this.defFormGroup.get('defCodeDesc').setValue('');
            this.errDesc = 'NCPErrorMessage.defCodeAlreadyExists';
            this.isError = true;
        } else {
            let defDetailsPicklistInput = { auxType: "DEFDetails", param1: this.defFormGroup.get('defCode').value };
            let defDetails = this.pickListService.getPickList(defDetailsPicklistInput, null);
            defDetails.subscribe(
                (response) => {
                    if (response.error !== null && response.error !== undefined && response.error.length >= 1) {
                        this.isError = true;
                        this.errDesc = response.error[0].errDesc;
                    } else {
                        this.isError = false;
                        this.defFormGroup.get('defCode').setValue('');
                        this.defFormGroup.get('defCodeDesc').setValue('');
                        if (response[0]) {
                            let index = 0;
                            if (this.planDetailsObject.coverageLoadingInfo && this.planDetailsObject.coverageLoadingInfo.length > 0) {
                                index = this.planDetailsObject.coverageLoadingInfo.length;
                                for (let temp = 0; temp < this.planDetailsObject.coverageLoadingInfo.length; temp++) {
                                    if (this.planDetailsObject.coverageLoadingInfo[temp].limitType === response[0].defLimitType) {
                                        index = temp;
                                    }
                                }
                            }
                            this.planDetailsObject.coverageLoadingInfo[index] = this.coverageLoadingInfo.getCoverageLoadingInfoModel().value;
                            this.planDetailsObject.coverageLoadingInfo[index].loadCode = response[0].defCode;
                            this.planDetailsObject.coverageLoadingInfo[index].loadDesc = response[0].defCodeDesc;
                            this.planDetailsObject.coverageLoadingInfo[index].limitType = response[0].defLimitType;
                            this.planDetailsObject.coverageLoadingInfo[index].limitTypeCategory = response[0].defCategory;
                            this.planDetailsObject.coverageLoadingInfo[index].limitAmount = response[0].defLimitValueNumber ? response[0].defLimitValueNumber : '';
                            this.planDetailsObject.coverageLoadingInfo[index].limitPercent = response[0].defLimitValuePercent ? response[0].defLimitValuePercent : '';
                            this.planDetailsObject.coverageLoadingInfo[index].limitCount = response[0].defLimitValueCount ? response[0].defLimitValueCount : '';
                            this.planDetailsObject.coverageLoadingInfo[index].key = response[0].defCode;
                            this.planDetailsObject.coverageLoadingInfo[index].covgCd = this.planDetailsObject.covgCd;
                            this.planDetailsObject.coverageLoadingInfo[index].policyNo = this.planDetailsObject.policyNo;
                            this.planDetailsObject.coverageLoadingInfo[index].policyEndtNo = this.planDetailsObject.policyEndtNo;
                            this.planDetailsObject.coverageLoadingInfo[index].itemNo = this.planDetailsObject.itemNo;
                            this.planDetailsObject.coverageLoadingInfo[index].sectNo = this.planDetailsObject.sectNo;
                        }
                        this.changeRef.detectChanges();
                    }
                });
        }
    }

    deleteDEFCode(index: number) {
        if (this.planDetailsObject.coverageLoadingInfo && this.planDetailsObject.coverageLoadingInfo.length > 0) {
            this.planDetailsObject.coverageLoadingInfo.splice(index, 1);
        }
    }


    openRemarksModal(planDetailsObject) {
        this.planDetailsObject = planDetailsObject;
        this.remarksFormGroup.get('remarksDesc').patchValue(planDetailsObject.remarksDesc);
        this.remarksFormGroup.get('remarks').patchValue(planDetailsObject.remarks);
        this.remarksFormGroup.get('remarksDesc').updateValueAndValidity();
        this.remarksFormGroup.get('remarks').updateValueAndValidity();
        this.remarksModalFlag = true;
        this.changeRef.markForCheck();

    }
    closeRemarksModal() {
        this.planDetailsObject = {};
        this.remarksFormGroup.get('remarks').setValue('');
        this.remarksFormGroup.get('remarksDesc').setValue('');
        this.remarksModalFlag = false;
    }

    ngOnChanges(changes?) { }
    ngOnDestroy() {
        this.changeSub.unsubscribe();
    }

}



@NgModule({
    imports: [CommonModule, UiCheckboxModule,
        FormsModule, UiTextBoxModule, ReactiveFormsModule, TooltipModule, SharedModule, UiMiscModule, UiAmountModule, UiButtonModule, ModalModule, LabelModule, UiDropdownModule],
    exports: [CoverTableComponent],
    declarations: [CoverTableComponent],
    providers: [AmountFormat, CoverTableService]
})
export class CoverTableModule { }