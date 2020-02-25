import { Component, Input, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';

import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { Logger } from '../../ui-components/logger';
import { NCPFormUtilsService } from '../ncp.form.utils';
import { INg2WizardConfig } from '../../ui-components/ng2-wizard/ng2-wizard.config';

@Component({
    selector: 'ncp-element',
    templateUrl: 'ncp.element.html'
})
export class NCPElementComponent implements OnChanges, OnDestroy {
    @Input() element: any;
    @Input() ncpForm: any;
    @Input() valueElement: any;
    @Input() indexes: number;
    @Input() parentIndex: number;
    @Input() superParentIndex: number;
    @Input() lastItem: boolean = false;
    @Input() isOdd: boolean = false;
    @Input() isEven: boolean = false;
    @Input() makeElementsDraggable: boolean = false;
    public compareResult: boolean = false;
    @Input() fieldTabId: any;

    controlType: string = '';
    elementForm: any = null;
    secondElementForm: any = null;
    elementFormValue: any = null;
    secondaryFormValue: any = null;
    thirdElementForm: any = null;
    fourthElementForm: any = null;
    fifthElementForm: any = null;
    sixthElementForm: any = null;
    dummyControl: any;
    public elementValueSubscribe;
    public secandoryValueSubscribe;
    public compareValueSubscribe;
    public editorMode: boolean = false;
    clk: boolean = true;//Added for table feature to be refined 
    hoverMode: boolean = false;
    NCPDatePickerNormalOptions = {
        todayBtnTxt: 'Today',
        alignSelectorRight: true,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true,
    };
    public wizardConfig: INg2WizardConfig = {
        'showNavigationButtons': true,
        'navigationButtonLocation': 'bottom',
        'preventUnvisitedTabNavigation': false,
        'isValidateTabNavigation': true,
        'showProgress': true
    };

    // Added only for Screen configuration
    @Input() sourceArray: any[];
    constructor(public logger: Logger,
        public eventHandler: EventService, public formUtils: NCPFormUtilsService, public config: ConfigService) {
        this.config.loggerSub.subscribe(data => {
            if (data === 'formDataChanged') {
                this.ngOnChanges();
            }
        });
    }
    ngOnChanges(changes?) {
        this.editorMode = this.config.getCustom('editorMode') ? this.config.getCustom('editorMode') : false;
        this.elementForm = this.ncpForm;
        if (this.element) {
            if (this.editorMode) {
                this.forPreview(this.element);
                this.formUtils.hoverSub.subscribe(data => {
                    if ((data === this.element['uniqueId']) && this.formUtils.isInspectMode) {
                        this.hoverMode = true;
                    } else {
                        this.hoverMode = false;
                    }
                });
                this.formUtils.mouseLeaveSub.subscribe(data => {
                    if ((data === this.element['uniqueId']) && this.formUtils.isInspectMode) {
                        this.hoverMode = false;
                    }
                });
            }
            this.controlType = this.element['controlType'] ? this.element['controlType'] : '';
            if (this.controlType === '') {
                this.logger.error('Element control type is not mentioned for ' + this.element['keyId']);
            } else {
                if (!this.element['isExcludeControl'] &&
                    !this.element['isChangeControlGroup'] &&
                    !this.element['isCustomControl']) {
                    this.setElementForm();
                }
                if (this.element['isGetControlValue'] && this.element['elementFormName']) {
                    if (this.ncpForm.get(this.element['elementFormName'])) {
                        this.elementFormValue = this.ncpForm.get(this.element['elementFormName']).value;
                    }
                    this.elementValueSubscribe = this.ncpForm.get(this.element['elementFormName']).valueChanges.subscribe((data) => {
                        this.elementFormValue = data;
                    });
                }
                if (this.element['isGetControlValue'] && this.element['secondaryFormName']) {
                    if (this.ncpForm.get(this.element['secondaryFormName'])) {
                        this.secondaryFormValue = this.ncpForm.get(this.element['secondaryFormName']).value;
                    }
                    this.secandoryValueSubscribe = this.ncpForm.get(this.element['secondaryFormName']).valueChanges.subscribe((data) => {
                        this.secondaryFormValue = data;
                    });
                }
                if ((this.controlType === 'Radio' || this.controlType === 'TextArea') && this.element['isExcludeControl']) {
                    this.dummyControl = new FormControl();
                }
                if (this.element['isChangeControlGroup']) {
                    this.ncpForm = this.formUtils.getMainFormGroup();
                    this.elementForm = this.ncpForm;
                    this.setElementForm();
                }
                if (this.element['isCustomControl']) {
                    if (this.element['customControl']) {
                        if (!(this.element['customControl'] instanceof FormControl)) {
                            let customControls = [];
                            if (typeof this.element['customControl'] === 'string') {
                                customControls.push(this.element['customControl']);
                            } else if (this.element['customControl'].constructor === Array) {
                                customControls = this.element['customControl'];
                            }
                            customControls.forEach((customControl: string) => {
                                if (!this.elementForm.contains(customControl)) {
                                    this.elementForm.addControl(customControl, new FormControl(''));
                                }
                                this.elementForm = this.elementForm.get(this.element['customControl']);
                            });
                        } else {
                            this.elementForm = this.element['customControl'];
                        }
                    } else {
                        this.elementForm = new FormControl('');
                    }
                }
                if (this.element['isCompareFormValue']) {
                    this.compareResult = this.elementFormValue === this.element['compareWith'] ? true : false;
                    if (this.element['invertCompare']) {
                        this.compareResult = !this.compareResult;
                    }
                    this.compareValueSubscribe = this.ncpForm.get(this.element['elementFormName']).valueChanges.subscribe((data) => {
                        this.compareResult = this.elementFormValue === this.element['compareWith'] ? true : false;
                        if (this.element['invertCompare']) {
                            this.compareResult = !this.compareResult;
                        }
                    });
                } else {
                    if (!this.element['isCompareFormValue'] &&
                        !this.element['isCompareIndexValue'] && this.element['listValue'] && this.valueElement) {
                        this.compareResult = this.valueElement[this.element['listValue']] === this.element['compareWith'] ? true : false;
                    }
                }
                if (this.element['isCompareIndexValue'] && !this.element['isCompareFormValue']) {
                    if (this.indexes > -1) {
                        this.compareResult = this.element['compareWith'] === this.indexes ? true : false;
                    }
                    if (this.element['invertCompare']) {
                        this.compareResult = !this.compareResult;
                    }
                }
                if (this.element['isCompareIndexWithParentIndexValue'] && !this.element['isCompareFormValue']) {
                    if (this.indexes > -1 && this.parentIndex > -1) {
                        this.compareResult = this.parentIndex === this.indexes ? true : false;
                    }
                    if (this.element['invertCompare']) {
                        this.compareResult = !this.compareResult;
                    }
                }
                if (this.element['isCompareIndexWithSuperParentIndexValue'] && !this.element['isCompareFormValue']) {
                    if (this.indexes > -1 && this.superParentIndex > -1) {
                        this.compareResult = this.superParentIndex === this.indexes ? true : false;
                    }
                    if (this.element['invertCompare']) {
                        this.compareResult = !this.compareResult;
                    }
                }
            }
            if (this.element['enableParentIndex']) {
                this.parentIndex = this.indexes;
            }
            if (this.element['enableSuperParentIndex']) {
                this.superParentIndex = this.indexes;
            }
        } else {
            this.logger.error('Element is Undefined in NCP element');
        }
    };

    // Handling click on table Row 
    trClick(id: any) {
        this.eventHandler.setEvent('click', id);
    }

    setElementForm() {
        if (this.controlType.toUpperCase() === 'GROUP') {
            try {
                if (this.element['groupName'] && !this.ncpForm.contains(this.element['groupName'])) {
                    this.logger.error(this.element['groupName'] + ' GroupName is not defined .. creating on the fly!');
                    this.ncpForm.addControl(this.element['groupName'], new FormGroup({}));
                }
                this.elementForm = this.ncpForm.get(this.element['groupName']);
            } catch (e) {
                this.logger.error(e + ' GroupName is not defined in the main Form Group');
            }
        } else if (this.controlType.toUpperCase() === 'ARRAY' && (this.element['firstLevelArray'] || this.element['nestedArray'])) {
            this.elementForm = this.ncpForm;
        } else if (this.controlType.toUpperCase() === 'ARRAY' && !this.element['firstLevelArray']) {
            try {
                if (this.element['groupArrayName'] && !this.ncpForm.contains(this.element['groupArrayName'])) {
                    this.logger.error(this.element['groupArrayName'] + ' Group Array name is not defined in creating on the fly!');
                    this.ncpForm.addControl(this.element['groupArrayName'], new FormArray([]));
                }
                this.elementForm = this.ncpForm.get(this.element['groupArrayName']);

            } catch (e) {
                this.logger.error(e + 'Group Array name is not defined in ' + this.ncpForm.controls);
            }
        } else {
            try {
                if (this.element['elementFormName']) {
                    if (!this.ncpForm.contains(this.element['elementFormName'])) {
                        this.ncpForm.addControl(this.element['elementFormName'], new FormControl(''));
                    }
                    this.elementForm = this.ncpForm.get(this.element['elementFormName']);
                    if (!this.elementForm.value) {
                        if (this.element['defaultPrimaryControlValue']) {
                            this.elementForm.patchValue(this.formUtils.parseJSONValue(this.element['defaultPrimaryControlValue']));
                        }
                    }
                }
                if (this.element['secondaryFormName']) {
                    if (!this.ncpForm.contains(this.element['secondaryFormName']) && this.ncpForm.controls[this.element['secondaryFormName']] === null) {
                        this.ncpForm.addControl(this.element['secondaryFormName'], new FormControl(''));
                    }
                    this.secondElementForm = this.ncpForm.get(this.element['secondaryFormName']);
                    if (!this.secondElementForm.value) {
                        if (this.element['defaultSecondaryControlValue']) {
                            this.secondElementForm.patchValue(this.formUtils.parseJSONValue(this.element['defaultSecondaryControlValue']));
                        }
                    }
                }
                if (this.element['thirdFormName']) {
                    if (!this.ncpForm.contains(this.element['thirdFormName'])) {
                        this.ncpForm.addControl(this.element['thirdFormName'], new FormControl(''));
                    }
                    this.thirdElementForm = this.ncpForm.get(this.element['thirdFormName']);
                }
                if (this.element['fourthFormName']) {
                    if (!this.ncpForm.contains(this.element['fourthFormName'])) {
                        this.ncpForm.addControl(this.element['fourthFormName'], new FormControl(''));
                    }
                    this.fourthElementForm = this.ncpForm.get(this.element['fourthFormName']);
                }
                if (this.element['fifthFormName']) {
                    if (!this.ncpForm.contains(this.element['fifthFormName'])) {
                        this.ncpForm.addControl(this.element['fifthFormName'], new FormControl(''));
                    }
                    this.fifthElementForm = this.ncpForm.get(this.element['fifthFormName']);
                }
                if (this.element['sixthFormName']) {
                    if (!this.ncpForm.contains(this.element['sixthFormName'])) {
                        this.ncpForm.addControl(this.element['sixthFormName'], new FormControl(''));
                    }
                    this.sixthElementForm = this.ncpForm.get(this.element['sixthFormName']);
                }
            } catch (e) {
                this.logger.error(e + ' Element Form Name is not defined in the main Form Group');
            }
        }
    }

    doIncludeInSteps(ele) {
        let doInclude: boolean = true;
        if (ele.controlType === 'TabHeaderError' || (ele.controlType === 'Condition' && !ele['condition'])) doInclude = false;
        return doInclude;
    }

    ngOnDestroy() {
        if (this.elementValueSubscribe) {
            this.elementValueSubscribe.unsubscribe();
        }
        if (this.secandoryValueSubscribe) {
            this.secandoryValueSubscribe.unsubscribe();
        }
    }

    setHover(element: any) {
        this.formUtils.hoverSub.next(element['uniqueId']);
        return true;
    }

    setMouseLeave(element: any) {
        this.formUtils.mouseLeaveSub.next(element['uniqueId']);
    }

    filterElements(func: any, item: any): boolean {
        let return_val = true;
        if (!func) {
            return return_val;
        } else if (typeof func === 'function') {
            func.call(this, item);
        } else if (Array.isArray(func)) {
            func.forEach(ele => {
                if (ele['key'] && item[ele['key']] !== ele['value']) {
                    return_val = false;
                }
            });
            return return_val;
        }
    }
    forPreview(element) {
        if (element['controlType']) {
            if (element['controlType'].toUpperCase() === 'GROUP') {
                try {
                    if (element['groupName'] && element['groupName'] === '') {
                        if (!this.ncpForm.contains('dummyGroup')) {
                            this.ncpForm.addControl('dummyGroup', new FormGroup({}));
                        }
                        element['groupName'] = 'dummyGroup';
                    } else {
                        if (element['groupName']) {
                            if (!this.ncpForm.contains(element['groupName'])) {
                                this.ncpForm.addControl(element['groupName'], new FormGroup({}));
                            }
                        }
                    }
                } catch (e) {
                    this.logger.error(e);
                }
            } else if (element['controlType'].toUpperCase() === 'ARRAY') {
                try {
                    if (element['groupArrayName'] && element['controlArrayName']
                        && (element['groupArrayName'] !== '' && element['controlArrayName'] !== '')) {
                        if (!this.ncpForm.contains(element['groupArrayName'])) {
                            this.ncpForm.addControl(element['groupArrayName'], new FormGroup({}));
                            if (!this.ncpForm.get(element['groupArrayName']).contains(element['controlArrayName'])) {
                                this.ncpForm.get(element['groupArrayName']).addControl(element['controlArrayName'], new FormArray([new FormGroup({})]));
                            }
                        }
                    }
                    if (element['controlArrayName'] && element['controlArrayName'] !== '') {
                        if (!this.ncpForm.contains(element['controlArrayName'])) {
                            this.ncpForm.addControl(element['controlArrayName'], new FormArray([new FormGroup({})]));
                        }
                    }
                    if (element['groupArrayName'] && element['controlArrayName']
                        && (element['groupArrayName'] === '' && element['controlArrayName'] === '')) {
                        if (!this.ncpForm.contains('dummyGroup')) {
                            this.ncpForm.addControl('dummyGroup', new FormGroup({}));
                            if (!this.ncpForm.get('dummyGroup').contains('dummyArray')) {
                                this.ncpForm.get('dummyGroup').addControl('dummyArray', new FormArray([new FormGroup({})]));
                            }
                        }
                        element['groupArrayName'] = 'dummyGroup';
                        element['controlArrayName'] = 'dummyArray';
                    }
                    if (!element['controlArrayName'] || element['controlArrayName'] === '') {
                        if (!this.ncpForm.contains('dummyArray')) {
                            this.ncpForm.addControl('dummyArray', new FormArray([new FormGroup({})]));
                        }
                        element['controlArrayName'] = 'dummyArray';
                    }
                } catch (e) {
                    this.logger.error(e);
                }
            } else {
                if (element['elementFormName'] || element['elementFormName'] === '') {
                    try {
                        if (element['controlType'] === 'AutoRenewal') {
                            if (element['elementFormName'] && element['elementFormName'] === '') {
                                if (!this.ncpForm.contains('dummyGroup')) {
                                    this.ncpForm.addControl('dummyGroup', new FormGroup({}));
                                }
                                element['elementFormName'] = 'dummyGroup';
                            } else {
                                if (element['elementFormName']) {
                                    if (!this.ncpForm.contains(element['elementFormName'])) {
                                        this.ncpForm.addControl(element['elementFormName'], new FormGroup({}));
                                    }
                                }
                            }
                        } else {
                            if (element['elementFormName'] && element['elementFormName'] === '') {
                                if (!this.ncpForm.contains('dummyControl')) {
                                    this.ncpForm.addControl('dummyControl', new FormControl(''));
                                }
                                element['elementFormName'] = 'dummyControl';
                            } else {
                                if (element['elementFormName']) {
                                    if (!this.ncpForm.contains(element['elementFormName'])) {
                                        this.ncpForm.addControl(element['elementFormName'], new FormControl(''));
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
                if (element['secondaryFormName'] === '') {
                    try {
                        if (!this.ncpForm.contains('dummyControl')) {
                            this.ncpForm.addControl('dummyControl', new FormControl(''));
                        }
                        element['secondaryFormName'] = 'dummyControl';
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
                if (element['secondaryFormName'] && element['secondaryFormName'] !== '') {
                    try {
                        if (!this.ncpForm.contains(element['secondaryFormName'])) {
                            this.ncpForm.addControl(element['secondaryFormName'], new FormControl(''));
                        }
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
                if (element['thirdFormName'] === '') {
                    try {
                        if (!this.ncpForm.contains('dummyControl')) {
                            this.ncpForm.addControl('dummyControl', new FormControl(''));
                        }
                        element['thirdFormName'] = 'dummyControl';
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
                if (element['thirdFormName'] && element['thirdFormName'] !== '') {
                    try {
                        if (!this.ncpForm.contains(element['thirdFormName'])) {
                            this.ncpForm.addControl(element['thirdFormName'], new FormControl(''));
                        }
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
                if (element['fourthFormName'] === '') {
                    try {
                        if (!this.ncpForm.contains('dummyControl')) {
                            this.ncpForm.addControl('dummyControl', new FormControl(''));
                        }
                        element['fourthFormName'] = 'dummyControl';
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
                if (element['fourthFormName'] && element['fourthFormName'] !== '') {
                    try {
                        if (!this.ncpForm.contains(element['fourthFormName'])) {
                            this.ncpForm.addControl(element['fourthFormName'], new FormControl(''));
                        }
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
                if (element['fifthFormName'] === '') {
                    try {
                        if (!this.ncpForm.contains('dummyControl')) {
                            this.ncpForm.addControl('dummyControl', new FormControl(''));
                        }
                        element['fifthFormName'] = 'dummyControl';
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
                if (element['fifthFormName'] && element['fifthFormName'] !== '') {
                    try {
                        if (!this.ncpForm.contains(element['fifthFormName'])) {
                            this.ncpForm.addControl(element['fifthFormName'], new FormControl(''));
                        }
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
                if (element['sixthFormName'] === '') {
                    try {
                        if (!this.ncpForm.contains('dummyControl')) {
                            this.ncpForm.addControl('dummyControl', new FormControl(''));
                        }
                        element['sixthFormName'] = 'dummyControl';
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
                if (element['sixthFormName'] && element['sixthFormName'] !== '') {
                    try {
                        if (!this.ncpForm.contains(element['sixthFormName'])) {
                            this.ncpForm.addControl(element['sixthFormName'], new FormControl(''));
                        }
                    } catch (e) {
                        this.logger.error(e);
                    }
                }
            }
        }
        if (element['controlType']) {
            if (element['controlType'] === 'Condition') {
                element['condition'] = true;
            }
            if (element['controlType'] === 'Compare') {
                this.compareResult = true;
            }
            if (element['controlType'] === 'DatePicker') {
                element['options'] = this.NCPDatePickerNormalOptions;
            }
            if (element['controlType'] === 'Ng2Wizard') {
                element['wizardConfig'] = this.wizardConfig;
            }
            if (element['controlType'] === 'Modal') {
                if (!this.formUtils.isSnippetPreview) {
                    if (this.formUtils.previewModal.length === 0) {
                        this.formUtils.previewModal.push(element);
                    } else {
                        let i = this.formUtils.previewModal.findIndex(modalElem => {
                            if (element['uniqueId'] === modalElem['uniqueId']) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        if (i < 0) {
                            this.formUtils.previewModal.push(element);
                        } else {
                            this.formUtils.previewModal[i] = element;
                        }
                    }
                } else {
                    if (this.formUtils.snippetPreviewModal.length === 0) {
                        this.formUtils.snippetPreviewModal.push(element);
                    } else {
                        let i = this.formUtils.snippetPreviewModal.findIndex(modalElem => {
                            if (element['uniqueId'] === modalElem['uniqueId']) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        if (i < 0) {
                            this.formUtils.snippetPreviewModal.push(element);
                        } else {
                            this.formUtils.snippetPreviewModal[i] = element;
                        }
                    }
                }
            }
        }
    }

    getElementFormRawValue(formGroup: FormGroup) {
        if (formGroup.disabled) {
            if (typeof formGroup.getRawValue === 'function') {
                return formGroup.getRawValue();
            }
            return null;
        }
        return null;
    }
}