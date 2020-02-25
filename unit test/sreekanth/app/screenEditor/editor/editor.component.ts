import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2'
import { FactoryProvider } from '../../core/factory/factoryprovider';
import { NCPFormUtilsService } from '../../core/ncp-forms/ncp.form.utils';
import { ConfigService } from '../../core/services/config.service';
import { EventService } from '../../core/services/event.service';
import { SharedService } from '../../core/shared/shared.service';
import { Logger } from '../../core/ui-components/logger';
import { UtilsService } from '../../core/ui-components/utils/utils.service';
import { EditorService } from '../service/screenEditor.service';

@Component({
    selector: 'screen-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditorComponent implements OnInit, OnDestroy {
    uiElementList: Array<any> = [];
    uiElementIds: Array<any> = [];
    eventConstants: any = {};
    productCode: string = '';
    mode: string = '';
    lob: string = '';
    masterElements: Array<any> = [];
    masterElementIds: Array<any> = [];
    productJson: any = {
        'formName': '',
        'elementId': 'formName',
        'uniqueId': 1,
        'elementList': []
    };
    isCopyProd: string = '';
    copyProdCode: string = '';
    selectedElements: Array<any> = [];
    isNewProd: boolean = false;
    editingModal: boolean = false;
    jsonEdit: Object;
    editingUniqueId: any;
    idGen: number = 0;
    baseFormGroup: FormGroup = new FormGroup({});
    searchTemplate: FormControl = new FormControl('');
    searchElement: FormControl = new FormControl('');
    searchModel: FormControl = new FormControl('');
    addedModelGroup: FormGroup = this.builder.group({
        type: [''],
        value: ['']
    });
    previewFlag: boolean = false;
    isCollapseTemplate: boolean = false;
    isCollapseUIElement: boolean = false;
    isCollapseModelElement: boolean = true;
    isCollapseEvents: boolean = true;
    derivedModel: any;
    derivedModelBck: any;
    dummyList: Array<any> = []; // Needed for Model drop
    avilableProdTemplateList: Array<any> = []; // Needed for Model drop
    modalPreviewJson: any = {
        'formName': '',
        'elementId': 'formName',
        'uniqueId': 1,
        'elementList': []
    };
    toggleFlag: any;
    toggleTempProdFlag: any;
    toggleThemeFlag: any;
    themeList: Array<any> = [];
    currentTheme: string;
    isRtl: boolean = false;
    marginTowards: any = 'marginLeft';
    enableLOBSwitch: any = false;
    snippetArray: Array<any> = [];
    toggleLobFlag: boolean = false;
    jsonEditDone: boolean = false;
    snippetJson: any;
    snippetModal: boolean = false;
    isPreviewMode: boolean = false;
    b2bFlag: boolean = true;
    b2b2cFlag: boolean = false;
    b2cFlag: boolean = false;
    screenPreviewConfig: any;
    isInspectMode: boolean = false;
    isStructHover: boolean = false;
    section: number = 0;
    logObj: Object = {};
    savePointModal: boolean = false;
    logArray: Array<any> = [];
    mapModificationArray: Array<any> = [];
    addedFormControlListToggle: boolean = false;
    addNewMappingRowShowButton: boolean = false;
    list: any;
    map: any;
    isNewLOB: boolean = false;
    formControlTypeList: Array<string> = ['Control', 'Group', 'Array'];
    isSetupJSON: boolean = false;
    setupDetails: any;
    doShowDraggableMenu: boolean = true;
    sampleEventJson: any = { 'eventId': '', 'triggerEvent': '', 'isCreateSubscribtion': false, 'path': '', 'subscribtionKey': '', 'subscribtionType': '', 'inputParams': [{ 'isDerivedValue': false, 'staticValue': '', 'isFromGroupValue': false, 'path': '', 'keyName': '', 'isEventValue': false, 'eventDataKey': '' }], 'eventBody': [{ 'operation': '', 'operationProcedure': [{ 'order': 1, 'isOperationOutput': false, 'operationOutputVar': '', 'inputParamIndex': 1, 'isFromInputParams': false, 'inputParam': { 'isDerivedValue': true, 'staticValue': '', 'isFromGroupValue': false, 'path': '', 'keyName': '', 'isEventValue': false, 'eventDataKey': '' } }, { 'order': 2, 'operator': '', 'isOperation': false, 'operation': '', 'operationProcedure': [{ 'order': 1, 'isOperationOutput': false, 'operationOutputVar': '', 'inputParamIndex': 1, 'isFromInputParams': true, 'inputParam': { 'isDerivedValue': true, 'staticValue': '', 'isFromGroupValue': false, 'path': '', 'keyName': '', 'isEventValue': false, 'eventDataKey': '' } }, { 'order': 2, 'operator': '', 'isOperation': false, 'operation': '' }, { 'order': 1, 'isOperationOutput': true, 'operationOutputVar': '', 'inputParamIndex': 1 }] }, { 'order': 1, 'isOperationOutput': true, 'operationOutputVar': '', 'inputParamIndex': 1 }], 'isOperationHaveOutput': true, 'operationOutputVar': '', 'order': 1, 'subOperations': [{ 'operation': '', 'operationProcedure': [{ 'order': 1, 'isOperationOutput': false, 'operationOutputVar': '', 'inputParamIndex': 1, 'isFromInputParams': true, 'inputParam': { 'isDerivedValue': true, 'staticValue': '', 'isFromGroupValue': false, 'path': '', 'keyName': '', 'isEventValue': false, 'eventDataKey': '' } }, { 'order': 2, 'operator': '', 'isOperation': false, 'operation': '', 'operationProcedure': [{ 'order': 1, 'isOperationOutput': false, 'operationOutputVar': '', 'inputParamIndex': 1, 'isFromInputParams': true, 'inputParam': { 'isDerivedValue': true, 'staticValue': '', 'isFromGroupValue': false, 'path': '', 'keyName': '', 'isEventValue': false, 'eventDataKey': '' } }, { 'order': 2, 'operator': '', 'isOperation': false, 'operation': '' }, { 'order': 1, 'isOperationOutput': true, 'operationOutputVar': '', 'inputParamIndex': 1 }] }, { 'order': 1, 'isOperationOutput': true, 'operationOutputVar': '', 'inputParamIndex': 1 }], 'isOperationHaveOutput': false, 'operationOutputVar': '', 'order': 1, 'subOperations': [] }] }], 'output': [{ 'isUpdateView': true, 'viewDetails': [{ 'elementId': '', 'key': '', 'valueName': '', 'reCurringId': false }, { 'elementId': '', 'key': '', 'valueName': '', 'reCurringId': false }], 'isUpdateFormGroup': true, 'formDetails': [{ 'keyName': '', 'path': '', 'valueName': '', 'fillPath': true, 'isGroup': false, 'isArray': true }] }] };
    currentEditingEventItem: any = {};
    constructor(public editorService: EditorService,
        public eventHandler: EventService,
        public formService: NCPFormUtilsService, public ref: ChangeDetectorRef,
        public config: ConfigService, public builder: FormBuilder, public logger: Logger,
        public shared: SharedService, public utils: UtilsService) { }

    ngOnInit() {
        this.config.enableRefreshCheck();
        this.searchElement.valueChanges.subscribe(data => {
            if (data) {
                this.uiElementList = this.uiElementIds.filter(element => {
                    let type: string = element['controlType'] ? element['controlType'] : element['subControlType'];
                    if (type && type.toLowerCase().includes(data.toLowerCase())) {
                        return true;
                    } else {
                        return false;
                    }
                });
            } else {
                this.uiElementList = this.uiElementIds;
            }
        });
        this.searchTemplate.valueChanges.subscribe(data => {
            if (data) {
                this.masterElements = this.masterElementIds.filter(element => {
                    let type: string = element['masterElementName'];
                    if (type && type.toLowerCase().includes(data.toLowerCase())) {
                        return true;
                    } else {
                        return false;
                    }
                });
            } else {
                this.masterElements = this.masterElementIds;
            }
        });

        this.searchModel.valueChanges.subscribe(data => {
            if (data) {
                this.filterSearchModel(data);
            } else {
                this.derivedModel = this.derivedModelBck;
            }
        });


        let obj = this.editorService.getStarterObj();
        this.initFromStarterObj(obj);
        this.themeList = this.editorService.getThemeList();
        this.snippetArray = this.editorService.snippetArray;
        if (this.snippetArray && this.snippetArray.length > 0) {
            this.snippetArray.forEach(element => {
                element['controlType'] = 'Include';
                element['fileName'] = element['name'];
                element['isExcludeControl'] = true;
                delete element['name'];
                let resp = this.config.ncpJsonCall(element['path']);
                resp.subscribe(data => {
                    if (Array.isArray(data)) {
                        element['elementList'] = data;
                    } else {
                        element['elementList'] = [data];
                    }
                });
            });
        }
        this.screenPreviewConfig = this.shared.getScreenConfiguration();
        this.formService.hoverSub.subscribe(data => {
            if (data && document.getElementById(data) && this.isInspectMode) {
                if (!this.isStructHover) {
                    document.getElementById(data).scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
                }
                document.getElementById(data).style.backgroundColor = '#fff';
                document.getElementById(data).style.color = 'black';
                document.getElementById(data).style.border = '1px dashed blue';
            }
        });
        this.formService.mouseLeaveSub.subscribe(data => {
            if (data && document.getElementById(data) && this.isInspectMode) {
                document.getElementById(data).style.backgroundColor = '';
                document.getElementById(data).style.color = '';
                document.getElementById(data).style.border = '';
            }
        });

        this.eventHandler.nextTabSub.subscribe(data => {
            if (data) {
                let parentItem: any = this.findParent(this.modalPreviewJson.elementList.length > 0 ? this.modalPreviewJson : this.productJson, 'tabId', data['value']['ui']['tabId']);
                if (parentItem instanceof Object) {
                    this.processNavigation(parentItem, 'NEXT', true);
                }
            }
        });
        this.eventHandler.nextStepSub.subscribe(data => {
            if (data) {
                let parentItem: any = this.findParent(this.modalPreviewJson.elementList.length > 0 ? this.modalPreviewJson : this.productJson, 'stepId', data['value']['ui']['stepId']);
                if (parentItem instanceof Object) {
                    this.processNavigation(parentItem, 'NEXT', true);
                }
            }
        });
        this.eventHandler.prevStepSub.subscribe(data => {
            if (data) {
                let parentItem: any = this.findParent(this.modalPreviewJson.elementList.length > 0 ? this.modalPreviewJson : this.productJson, 'stepId', data['value']['ui']['stepId']);
                if (parentItem instanceof Object) {
                    this.processNavigation(parentItem, 'PREV', true);
                }
            }
        });
        this.eventHandler.prevTabSub.subscribe(data => {
            if (data) {
                let parentItem: any = this.findParent(this.modalPreviewJson.elementList.length > 0 ? this.modalPreviewJson : this.productJson, 'tabId', data['value']['ui']['tabId']);
                if (parentItem instanceof Object) {
                    this.processNavigation(parentItem, 'PREV', true);
                }
            }
        });

        // this.logArray = JSON.parse(localStorage.getItem('SavePointSE'));
        // if(this.logArray && this.logArray.length > 10){

        // }
    }

    initFromStarterObj(obj, fromSavePoint?: boolean) {
        this.logObj['starterObj'] = obj;
        if (obj) {
            this.productCode = obj['isNewProd'] ? obj['newProdCode'] : obj['existingProdCode'];
            this.mode = obj['mode'];
            this.lob = obj['lob'];
            this.isNewProd = obj['isNewProd'];
            this.isCopyProd = obj['isCopyProd'];
            this.copyProdCode = obj['isCopyProd'] ? obj['existingProdCode'] : null;
            this.isSetupJSON = obj['isSetupJSON'];
            if (this.isSetupJSON === false) {
                if (obj['masterJson'] && obj['masterJson'].length > 0) {
                    this.masterElements = obj['masterJson'];
                    this.masterElementIds = obj['masterJson'];
                    this.avilableProdTemplateList = obj['templateProds'];
                }
                let uiElem = this.editorService.getUIElements();
                if (uiElem instanceof Array) {
                    this.uiElementList = uiElem;
                    this.uiElementIds = uiElem;
                } else {
                    uiElem.subscribe((data) => {
                        if (data instanceof Array) {
                            this.uiElementList = data;
                            this.uiElementIds = data;
                            this.ref.markForCheck();
                        }
                    });
                }
                if (!fromSavePoint) {
                    if ((!obj['isNewProd'] || obj['isCopyProd']) && !obj['templateJson']) {
                        let productResp = this.editorService.getProductJson(obj['isCopyProd'] ? this.copyProdCode : this.productCode, this.lob);
                        productResp.subscribe(data => {
                            if (data instanceof Object) {
                                this.productJson = data;
                                this.productJson = this.generateUniqueId(this.productJson);
                                this.doPreview();
                                this.ref.markForCheck();
                            }
                        });
                    }
                    if (obj['templateJson']) {
                        this.productJson = obj['templateJson'];
                    }
                    if (obj['isNewProd']) {
                        this.template();
                    }
                }
                if (obj['modelMethodName']) {
                    this.initModels(obj['modelMethodName']);
                    this.ref.markForCheck();
                }
                if (obj['transactionMappingObserver']) {
                    obj['transactionMappingObserver'].subscribe(data => {
                        this.editorService.transactionMapping = data['status'] !== false ? data : {};
                        this.isNewLOB = data['status'] === false;
                        this.initModels(this.editorService.transactionMapping);
                    });
                    this.ref.markForCheck();
                }
                if (this.mode === 'Snippet' || this.mode === 'Endorsements') {
                    this.enableLOBSwitch = true;
                } else {
                    this.enableLOBSwitch = false;
                }
                this.eventConstants = this.editorService.eventConstants;
                this.initProductJson();
                this.doPreview();
                this.snippetArray = this.editorService.snippetArray;
            } else {
                this.setupDetails = obj['setupDetails'];
                this.isNewLOB = obj['isNewLOB'] === true;
            }
            this.doShowDraggableMenu = !this.isSetupJSON;
            this.ref.markForCheck();
        } else {
            this.editorService.config.navigateRouterLink('se');
        }


        this.editorService.masterElementChangeSub.subscribe(data => {
            this.masterElements = data;
            this.masterElementIds = data;
            this.ref.markForCheck();
        });
        this.editorService.eventArrayChangeSub.subscribe(data => {
            this.eventConstants = data;
            this.ref.markForCheck();
        });
    }

    ngOnDestroy() {
        this.formService.previewModal = [];
        this.config.disableRefreshCheck();
        this.config.setCustom('editorMode', false);
    }

    initProductJson() {
        if (!this.productJson) {
            this.productJson = {
                'formName': '',
                'elementId': 'formName',
                'uniqueId': 1,
                'elementList': []
            };
        } else {
            if (this.mode === 'Snippet') {
                if (Array.isArray(this.productJson)) {
                    this.productJson = {
                        'formName': '',
                        'elementId': 'formName',
                        'uniqueId': 1,
                        'elementList': this.productJson
                    };
                } else if (this.productJson instanceof Object && !this.productJson['formName']) {
                    this.productJson = {
                        'formName': '',
                        'elementId': 'formName',
                        'uniqueId': 1,
                        'elementList': [this.productJson]
                    };
                }
            }
        }
    }

    generateUniqueId(ncpJson, idInit?: boolean, modalInit?: boolean) {
        try {
            if (!idInit) {
                this.idGen = 0;
            }
            if (modalInit) {
                this.idGen = ncpJson['elementList'][0]['uniqueId'] - 1;
            }
            if (ncpJson && ncpJson['elementList'] && ncpJson['elementList'].length > 0) {
                let child = ncpJson.elementList;
                for (let i in child) {
                    if (i) {
                        child[i]['uniqueId'] = this.idGen + 1;
                        this.idGen = this.idGen + 1;
                        if (child[i]['controlType'] && child[i]['controlType'] === 'Modal') {
                            if (this.formService.previewModal.length === 0) {
                                this.formService.previewModal.push(child[i]);
                            } else {
                                let k = this.formService.previewModal.findIndex(modalElem => {
                                    if (child[i]['uniqueId'] === modalElem['uniqueId']) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                                if (k < 0) {
                                    this.formService.previewModal.push(child[i]);
                                } else {
                                    this.formService.previewModal[k] = child[i];
                                }
                            }
                        }

                        this.generateUniqueId(child[i], true);
                    }
                }
            }
            return ncpJson;
        } catch (e) {
            this.logger.error(e.stack);
        }
    }

    openEditingModal(item) {
        if (item && item['uniqueId'] && !this.editingModal) {
            this.jsonEdit = item;
            this.editingUniqueId = item;
            delete this.jsonEdit['uniqueId'];
            this.editingModal = true;
            this.jsonEditDone = false;
        } else {
            if (!item['uniqueId']) {
                Swal.fire({
                    type: 'error',
                    title: 'Unique ID generation has failed',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }
    }

    jsonEdited(e: Object) {
        if (e && !e.hasOwnProperty('isTrusted')) {
            this.jsonEdit = e;
        }
        this.jsonEditDone = true;
    }

    closeModal(save: boolean) {
        if (this.jsonEdit && this.jsonEditDone) {
            let item = this.copy(this.jsonEdit);
            if (this.currentEditingEventItem && this.jsonEdit['eventId']) {
                if (this.currentEditingEventItem['events'] && this.currentEditingEventItem['events'].length > 0) {
                    this.currentEditingEventItem['events'].push(this.copy(this.jsonEdit));
                } else {
                    this.currentEditingEventItem['events'] = [];
                    this.currentEditingEventItem['events'].push(this.copy(this.jsonEdit));
                }
                item = this.copy(this.currentEditingEventItem);
            } else {
                item['uniqueId'] = this.editingUniqueId['uniqueId'];
                if (item['controlType'] === 'Array') {
                    if (!item['groupArrayName'] || item['groupArrayName'] === '') {
                        if (!item['firstLevelArray'] && !item['nestedArray']) {
                            item['firstLevelArray'] = true;
                        }
                    }
                }
            }
            if (save) {
                if (this.modalPreviewJson.elementList.length > 0) {
                    this.modalPreviewJson.elementList = this.findInProduct(this.modalPreviewJson.elementList, item);
                } else {
                    this.productJson.elementList = this.findInProduct(this.productJson.elementList, item);
                }
            }
        }
        this.jsonEdit = undefined;
        this.editingUniqueId = undefined;
        this.editingModal = false;
        this.genUniqueId();
    }

    genUniqueId() {
        if (this.modalPreviewJson.elementList.length > 0) {
            this.modalPreviewJson = this.generateUniqueId(this.modalPreviewJson, true, true);
        } else {
            this.productJson = this.generateUniqueId(this.productJson);
        }
    }

    remove(item) {
        if (this.modalPreviewJson.elementList.length > 0) {
            this.modalPreviewJson.elementList = this.findInProduct(this.modalPreviewJson.elementList, item, true);
        } else {
            this.productJson.elementList = this.findInProduct(this.productJson.elementList, item, true);
        }
    }

    findInProduct(ncpJson: Array<any>, item, deleteFlag?: boolean, duplicateFlag?: boolean) {
        ncpJson.forEach((element, i) => {
            if (element['uniqueId'] === item['uniqueId'] || !element['uniqueId']) {
                if (deleteFlag && !duplicateFlag) {
                    // if (!element['uniqueId'])
                    ncpJson.splice(i, 1);
                    deleteFlag = false;
                } else if (duplicateFlag) {
                    item['uniqueId'] = null;
                    ncpJson.splice(i, 0, item);
                    duplicateFlag = false;
                } else {
                    ncpJson.splice(i, 1);
                    ncpJson.splice(i, 0, item);
                }
            } else {
                if (element['elementList'] && element.elementList.length > 0) {
                    element.elementList = this.findInProduct(element.elementList, item, deleteFlag, duplicateFlag);
                }
            }
        });
        return ncpJson;
    }

    copyToClipboard(event) {
        let tempProductJson = this.copy(this.formService.setJsonByElementId(this.productJson, 'formName', 'formName', ''));
        tempProductJson = this.refineFinalJson(tempProductJson);
        tempProductJson = this.generateUniqueId(tempProductJson);
        let text = tempProductJson;
        text = JSON.stringify(text);
        if (event.clipboardData && event.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return event.clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                Swal.fire({
                    type: 'success',
                    title: 'Copied to clipboard',
                    showConfirmButton: false,
                    timer: 3000
                });
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                this.logger.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    saveDataToFile(event) {
        let tempProductJson = this.copy(this.formService.setJsonByElementId(this.productJson, 'formName', 'formName', ''));
        let tempRefinedProductJson = this.refineFinalJson(tempProductJson);
        tempRefinedProductJson = this.generateUniqueId(tempRefinedProductJson);
        if (this.productJson['elementList'] && this.productJson['elementList'].length > 0) {
            if (this.mapModificationArray.length > 0 && this.config.useLegacy === false) {
                Swal.fire({
                    title: 'You have modified mappings!',
                    text: 'Do you wish to save the mapping changes?\n Else these changes will not be persistent',
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonColor: 'rgb(98, 124, 177)',
                    cancelButtonColor: 'rgb(207, 80, 80)',
                    showCloseButton: true,
                    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Save & download!',
                    confirmButtonAriaLabel: 'Thumbs up, great!',
                    cancelButtonText: 'No, download JSON without saving '
                }).then((result) => {
                    if (result.value) {
                        this.editorService.saveData(tempRefinedProductJson, this.productCode.toLowerCase() + '.json');
                        this.editorService.updateProductMappingData(this.lob, this.editorService.transactionMapping).subscribe(data => {
                            if (data.status === true) {
                                Swal.fire({
                                    type: 'success',
                                    title: 'Json has been downloaded & mapping changes are saved to database',
                                    showConfirmButton: false,
                                    timer: 3000
                                });
                            }
                        });
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        this.editorService.saveData(tempRefinedProductJson, this.productCode.toLowerCase() + '.json');
                        Swal.fire({
                            type: 'success',
                            title: 'Json has been downloaded without saving the mapping changes to database',
                            showConfirmButton: false,
                            timer: 3000
                        });
                    }
                })
            } else {
                this.editorService.saveData(tempRefinedProductJson, this.productCode.toLowerCase() + '.json');
                Swal.fire({
                    type: 'success',
                    title: 'Json has been downloaded',
                    showConfirmButton: false,
                    timer: 3000
                });
            }

        }

    }

    saveSetupToFile() {
        this.editorService.saveData(this.setupDetails, this.mode.toLowerCase() + '.json');
        Swal.fire({
            type: 'success',
            title: 'Setup Json has been downloaded',
            showConfirmButton: false,
            timer: 3000
        });
    }

    copySetupToClipboard(event) {
        let text = this.setupDetails;
        text = JSON.stringify(text);
        if (event.clipboardData && event.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return event.clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                Swal.fire({
                    type: 'success',
                    title: 'Copied to clipboard',
                    showConfirmButton: false,
                    timer: 3000
                });
                return document.execCommand('copy');  // Security exception may be thrown by some browsers.
            } catch (ex) {
                this.logger.warn('Copy to clipboard failed.', ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    saveSetupToDatabase() {
        let updateSetupResponse: any;
        Swal.fire({
            title: 'Are you sure?',
            text: 'Modifications are going to be saved into NCP Database!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(98, 124, 177)',
            cancelButtonColor: 'rgb(207, 80, 80)',
            confirmButtonText: 'Yes, Go to starter!'
        }).then((result) => {
            if (result.value) {
                if (this.mode === 'Product Setup') {
                    if (this.isNewLOB) {
                        this.editorService.productSetupDataForLOB = {};
                    }
                    if (this.editorService.doUpdateSetupToLOBObject) {
                        this.editorService.productSetupDataForLOB = this.setupDetails;
                    } else {
                        if (this.editorService.storeSetupToProductCdObject) {
                            this.editorService.productSetupDataForLOB[this.editorService.storeSetupToProductCdObject] = this.setupDetails;
                        }
                    }
                    updateSetupResponse = this.editorService.utils.updateProductSetupDetails(this.editorService.productSetupDataForLOB, this.isNewLOB, this.isNewProd ? this.productCode : false);
                } else if (this.mode === 'Menu Setup') {
                    updateSetupResponse = this.utils.updateMenuCache(this.setupDetails);
                }
                if (updateSetupResponse) {
                    updateSetupResponse.subscribe(data => {
                        this.config.setLoadingSub('no');
                        if (data['status'] === true) {
                            Swal.fire({
                                type: 'success',
                                title: 'Saved to database',
                                showConfirmButton: false,
                                timer: 3000
                            });
                        } else {
                            Swal.fire({
                                type: 'error',
                                title: 'Oops! something went wrong.',
                                showConfirmButton: false,
                                timer: 3000
                            });
                        }
                    })
                }
            }
        })
    }

    navigateStart() {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(98, 124, 177)',
            cancelButtonColor: 'rgb(207, 80, 80)',
            confirmButtonText: 'Yes, Go to starter!'
        }).then((result) => {
            if (result.value) {
                this.editorService.config.navigateRouterLink('se');
            }
        })
    }

    doPreview() {
        this.productJson = this.generateUniqueId(this.productJson);
        this.productJson = this.formService.setJsonByElementId(this.productJson, 'formName', 'formName', this.baseFormGroup);
    }

    openModals(index?: any) {
        let previewModal;
        if (index || index === 0) {
            if (this.formService.isSnippetPreview) {
                previewModal = this.copy(this.formService.snippetPreviewModal.slice(index)[0]);
            } else {
                previewModal = this.copy(this.formService.previewModal.slice(index)[0]);
            }
            previewModal['modalKey'] = true;
            this.modalPreviewJson = this.formService.setJsonByElementId(this.modalPreviewJson, 'formName', 'formName', this.baseFormGroup);
            if (this.modalPreviewJson.elementList.length > 0) {
                this.modalPreviewJson.elementList.pop();
            }
            this.productJson.elementList = this.findInProduct(this.productJson.elementList, true);
            this.modalPreviewJson.elementList.push(previewModal);
        } else {
            previewModal = this.modalPreviewJson.elementList.pop();
            previewModal['modalKey'] = false;
            this.productJson.elementList = this.findInProduct(this.productJson.elementList, previewModal);
            this.genUniqueId();
        }
    }

    initModels(methodName: any) {
        let quoteModel, formGroupVal;
        let countryFactory = FactoryProvider.getFactoryInstance(this.config, this.logger, this.builder);   // + Country Creation Factory
        let countryModelInstance = countryFactory.getPolicyModelInstance();
        let quoteInfo = countryModelInstance.getQuotInfo();
        if (typeof methodName === 'string') {
            quoteModel = quoteInfo[methodName]();
            if (quoteModel) {
                formGroupVal = quoteModel.value;
                this.editorService.transactionMapping = formGroupVal;
            }
        } else {
            if (methodName instanceof Object) {
                formGroupVal = methodName;
            }
        }
        this.doPreview();
        if (formGroupVal) {
            this.derivedModelBck = this.deriveModel(formGroupVal);
            this.derivedModel = this.copy(this.derivedModelBck);
        }
    }

    deriveModel(modelObj: Object) {
        let modelArray: Array<any> = [];
        for (let key in modelObj) {
            if (!modelObj.hasOwnProperty(key))
                continue;
            let obj = {};
            if (modelObj[key] instanceof Object && !Array.isArray(modelObj[key])) {
                obj['keyName'] = key;
                obj['keyType'] = 'Group';
                obj['children'] = this.deriveModel(modelObj[key]);
            } else if (Array.isArray(modelObj[key])) {
                if (modelObj[key].length > 0) {
                    obj['keyName'] = key;
                    obj['keyType'] = 'Array';
                    obj['children'] = this.deriveModel(modelObj[key][0]);
                }
            } else {
                obj['keyName'] = key;
                obj['keyType'] = 'Control';
            }
            modelArray.push(obj);
        }
        return modelArray;
    }

    filterModel(modelList: Array<any>, data: string) {
        return modelList.filter(element => {
            if (data && data.toLowerCase().includes(element['keyName'].toLowerCase())) {
                return true;
            } else if (element['children'] && element['children'].length > 0) {
                element['children'] = this.filterModel(element['children'], data);
                if (element['children'] && element['children'].length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
    }

    handleMappingDrop(model: Object, event, type?) {
        let elem = event.value;
        if (type) {
            model[type] = elem['keyName'];
        }
        this.dummyList = [];
        this.productJson['elementList'] = this.findInProduct(this.productJson['elementList'], model);
        this.genUniqueId();
    }
    handleEventDrop(constant: Object, event, type?: string) {
        let elem = event.value.name || event.value;
        if (type) {
            constant[type] = elem;
        }
        if (event['eventId']) {
            if (constant['events'] && constant['events'].length > 0) {
                let index = constant['events'].findIndex(element => {
                    if (element['eventId'].toLowerCase() === event['eventId'].toLowerCase()) {
                        return true;
                    }
                });
                if (index > -1) {
                    constant['events'].push(event);
                }
            } else {
                constant['events'] = [];
                constant['events'].push(event);
            }
        }
        this.dummyList = [];
        this.productJson['elementList'] = this.findInProduct(this.productJson['elementList'], constant);
        this.genUniqueId();
    }

    duplicate(item: Object, list: Array<any>) {
        let elem = this.copy(item); // Method is created for deep copying 
        if (elem['uniqueId']) {
            if (this.modalPreviewJson.elementList.length > 0) {
                this.modalPreviewJson['elementList'] = this.findInProduct(this.modalPreviewJson['elementList'], elem, false, true);
            } else {
                this.productJson['elementList'] = this.findInProduct(this.productJson['elementList'], elem, false, true);
            }
        }
        this.genUniqueId();
    }


    copy(o) {
        let output, v, key;
        output = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            output[key] = (typeof v === "object") ? this.copy(v) : v;
        }
        return output;
    }

    template() {
        let display = document.getElementById('template').style.display;
        if (display === 'none') {
            document.getElementById('model').style.display = 'none';
            document.getElementById('uiComponents').style.display = 'none';
            document.getElementById('snippets').style.display = 'none';
            document.getElementById('eventConstants').style.display = 'none';
            document.getElementById('se-main').style.marginLeft = '21%';
            document.getElementById('keyButtons').style.marginLeft = '21%';
            document.getElementById('template').style.display = 'block';
            this.isCollapseTemplate = true;
            this.isCollapseModelElement = true;
            this.isCollapseUIElement = false;
            this.isCollapseEvents = true;
        } else {
            document.getElementById('se-main').style[this.marginTowards] = '0%';
            document.getElementById('template').style.display = 'none';
            document.getElementById('keyButtons').style[this.marginTowards] = '0%';
            this.isCollapseTemplate = false;
        }
    }

    model() {
        let display = document.getElementById('model').style.display;
        if (display === 'none') {
            document.getElementById('template').style.display = 'none';
            document.getElementById('uiComponents').style.display = 'none';
            document.getElementById('snippets').style.display = 'none';
            document.getElementById('se-main').style.marginLeft = '21%';
            document.getElementById('eventConstants').style.display = 'none';
            document.getElementById('keyButtons').style.marginLeft = '21%';
            document.getElementById('model').style.display = 'block';
            this.isCollapseTemplate = false;
            this.isCollapseModelElement = false;
            this.isCollapseUIElement = false;
            this.isCollapseEvents = true;
        } else {
            document.getElementById('se-main').style[this.marginTowards] = '0%';
            document.getElementById('model').style.display = 'none';
            document.getElementById('keyButtons').style[this.marginTowards] = '0%';
            this.isCollapseModelElement = true;
        }
    }
    snippets() {
        let display = document.getElementById('snippets').style.display;
        if (display === 'none') {
            document.getElementById('model').style.display = 'none';
            document.getElementById('template').style.display = 'none';
            document.getElementById('uiComponents').style.display = 'none';
            document.getElementById('se-main').style[this.marginTowards] = '21%';
            document.getElementById('keyButtons').style[this.marginTowards] = '21%';
            document.getElementById('snippets').style.display = 'block';
            this.isCollapseTemplate = false;
            this.isCollapseModelElement = true;
            this.isCollapseUIElement = true;
        } else {
            document.getElementById('se-main').style[this.marginTowards] = '0%';
            document.getElementById('snippets').style.display = 'none';
            document.getElementById('keyButtons').style[this.marginTowards] = '0%';
            this.isCollapseUIElement = false;
        }
    }
    UiElement() {
        let display = document.getElementById('uiComponents').style.display;
        if (display === 'none') {
            document.getElementById('template').style.display = 'none';
            document.getElementById('model').style.display = 'none';
            document.getElementById('se-main').style[this.marginTowards] = '21%';
            document.getElementById('keyButtons').style[this.marginTowards] = '21%';
            document.getElementById('snippets').style.display = 'none';
            document.getElementById('eventConstants').style.display = 'none';
            document.getElementById('uiComponents').style.display = 'block';
            this.isCollapseTemplate = false;
            this.isCollapseModelElement = true;
            this.isCollapseUIElement = true;
            this.isCollapseEvents = true;
        } else {
            document.getElementById('se-main').style[this.marginTowards] = '0%';
            document.getElementById('uiComponents').style.display = 'none';
            document.getElementById('keyButtons').style[this.marginTowards] = '0%';
            this.isCollapseUIElement = false;
        }
    }

    displayEventConstants() {
        let display = document.getElementById('eventConstants').style.display;
        if (display === 'none') {
            document.getElementById('template').style.display = 'none';
            document.getElementById('model').style.display = 'none';
            document.getElementById('uiComponents').style.display = 'none';
            document.getElementById('se-main').style.marginLeft = '21%';
            document.getElementById('keyButtons').style.marginLeft = '21%';
            document.getElementById('eventConstants').style.display = 'block';
            this.isCollapseTemplate = false;
            this.isCollapseModelElement = true;
            this.isCollapseUIElement = false;
            this.isCollapseEvents = false;
        } else {
            document.getElementById('se-main').style.marginLeft = '0%';
            document.getElementById('eventConstants').style.display = 'none';
            document.getElementById('keyButtons').style.marginLeft = '0%';
            this.isCollapseEvents = true;
        }
    }

    keyButtons() {
        let display = document.getElementById('keyButtons').style.display;
        if (display === 'none') {
            document.getElementById('keyButtons').style.display = 'grid';
        } else {
            document.getElementById('keyButtons').style.display = 'none';
        }
    }

    keyButtonDragHandler(e) {
        document.getElementById('keyButtons').style.top = e.y + 'px';
        document.getElementById('keyButtons').style[this.marginTowards] = '0px';
        document.getElementById('keyButtons').style.left = e.x + 'px';
    }

    filterMasterJsonByProdCode(prodCode?) {
        if (prodCode) {
            this.masterElements = this.masterElementIds.filter(element => {
                if (element['prodCode'] === prodCode) {
                    return true;
                } else {
                    return false;
                }
            });
        } else {
            this.masterElements = this.masterElementIds;
        }
        this.ref.markForCheck();
    }

    changeTheme(theme) {
        let themeName = theme.split('.')[0];
        if (themeName !== this.currentTheme) {
            if (this.currentTheme !== 'defaultStyle' && this.currentTheme) {
                this.config.removeThemeName(this.currentTheme);
            }
            this.currentTheme = themeName;
            if (themeName !== 'defaultStyle') {
                this.config.changeThemeName(theme);
            }
        }
        this.ref.detectChanges();
    }

    toggleRTL() {
        let theme = this.themeList.filter(item => {
            if (item.split('.')[0] === 'rtlTheme') {
                return true;
            } else {
                return false;
            }
        })[0];
        if (!this.isRtl) {
            this.isRtl = true;
            this.config.changeThemeName(theme);
        } else {
            this.isRtl = false;
            this.config.removeThemeName(theme);
        }
        this.changeFixedPositions();
        this.ref.detectChanges();
    }

    changeFixedPositions() {
        // if (this.isRtl) {
        //     this.marginTowards = 'marginRight';
        // } else {
        //     this.marginTowards = 'marginLeft';
        // }
    }

    changeLob(lobItem) {
        if (this.lob !== lobItem['lob']) {
            this.lob = lobItem['lob'];
            this.editorService.masterJson = [];
            this.avilableProdTemplateList = lobItem['templates'];
            this.editorService.createMasterJson(lobItem['templates'], this.lob);
            if (lobItem['modelMethodName'] && this.config.useLegacy === true) {
                this.initModels(lobItem['modelMethodName']);
            } else {
                this.editorService.getProductMappingData(lobItem['lob'].toUpperCase()).subscribe(data => {
                    this.editorService.transactionMapping = data['status'] !== false ? data : {};
                    this.initModels(this.editorService.transactionMapping);
                    this.config.setLoadingSub('no');
                });
            }
            this.ref.markForCheck();
        }
    }

    previewSnippet(snip) {
        this.snippetJson = {
            'formName': '',
            'elementId': 'formName',
            'uniqueId': 1,
            'elementList': snip['elementList']
        };
        this.snippetJson = this.generateUniqueId(this.snippetJson);
        this.snippetJson = this.formService.setJsonByElementId(this.snippetJson, 'formName', 'formName', this.baseFormGroup);
        this.snippetModal = true;
        this.formService.isSnippetPreview = true;
        this.ref.markForCheck();
    }

    refineFinalJson(ncpJson: Object) {
        if (ncpJson) {
            Object.keys(ncpJson).forEach(key => {
                if (key === 'controlType') {
                    if (ncpJson[key] === 'Include') {
                        if (ncpJson['elementList'] && Array.isArray(ncpJson['elementList'])) {
                            delete ncpJson['elementList'];
                            delete ncpJson['path'];
                        }
                    }
                    if (ncpJson[key] === 'Array') {
                        if (ncpJson['groupArrayName'] === 'dummyGroup' && ncpJson['controlArrayName'] !== 'dummyArray') {
                            ncpJson['firstLevelArray'] = true;
                        } else if (ncpJson['controlArrayName'] === 'dummyArray') {
                            Swal.fire({
                                type: 'warning',
                                title: 'Mapping is not complete dummyArray is present',
                                showConfirmButton: false,
                                timer: 3000
                            });
                        }
                    }
                }
                if (key === 'elementList') {
                    if (ncpJson[key] && Array.isArray(ncpJson[key])) {
                        ncpJson[key].forEach(element => {
                            element = this.refineFinalJson(element);
                        });
                    }
                }
                if (ncpJson[key] === 'dummyControl' || ncpJson[key] === 'dummyGroup') {
                    Swal.fire({
                        type: 'warning',
                        title: 'Mapping is not complete dummyControl and/or dummyGroup is present',
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            });
        }
        return ncpJson;
    }

    filterUIComponentPropByControlType(controlType, eventConstant) {
        return this.uiElementList.filter(obj => obj.controlType === controlType && obj[eventConstant] !== undefined);
    }

    setHover(item) {
        if (item['uniqueId'] && this.isInspectMode) {
            this.formService.hoverSub.next(item['uniqueId']);
        }
    }

    setMouseLeave(item) {
        if (item['uniqueId'] && this.isInspectMode) {
            this.formService.mouseLeaveSub.next(item['uniqueId']);
        }
    }

    toggleInspectMode() {
        this.isInspectMode = !this.isInspectMode;
        this.formService.isInspectMode = this.isInspectMode;
    }

    processNavigation(item: any, direction: string, isFromForm?: boolean) {

        if (item['controlType'] && (item['controlType'] === 'Ng2Wizard' || item['controlType'] === 'Navigator')) {
            if (!isFromForm) {
                this.utils.navigatorSub.next({ id: item['elementId'], direction: direction });
            } else {
                switch (direction) {
                    case 'NEXT':
                        if (item['elementList'] && item['elementList'].length > 0 && item['elementList'].length - 1 > this.section) {
                            this.section = this.section + 1;
                        } else {
                            if (this.section > item['elementList'].length || this.section === item['elementList'].length - 1) {
                                this.section = item['elementList'].length - 1;
                            }
                        }
                        break;
                    case 'PREV':
                        if (this.section > 0) {
                            this.section = this.section - 1;
                        } else {
                            this.section = 0;
                        }
                        break;
                }
                // document.getElementById(item['uniqueId']).scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
                document.getElementById(item['elementList'][this.section]['uniqueId']).scrollIntoView({ block: 'start', behavior: 'smooth' });
            }
        }
    }

    findParent(ncpJson, key, value): any {
        let parent;
        if (ncpJson['elementList'] && ncpJson['elementList'].length > 0) {
            ncpJson['elementList'].forEach((element: Object) => {
                if (element.hasOwnProperty(key)) {
                    if (element[key] === value) {
                        parent = ncpJson;
                    }
                }
                if (!parent && element['elementList'] && element['elementList'].length > 0) {
                    parent = this.findParent(element, key, value);
                }
            });
        }
        return parent;
    }

    logIt(item?) {
        if (this.logObj['starterObj']['templateJson'] && this.logObj['starterObj']['templateJson']['formName']) {
            delete this.logObj['starterObj']['templateJson']['formName'];
        }
        let obj = this.copy(this.logObj);
        let tempProductJson = this.copy(this.formService.setJsonByElementId(this.productJson, 'formName', 'formName', ''));
        const logId = Swal.fire({
            title: 'Enter a Refrence Log ID',
            input: 'text',
            inputPlaceholder: 'Enter a Refrence Log ID',
            showCancelButton: true,
            inputValidator: (value) => {
                return !value && 'You need to write something!';
            }
        });
        if (logId) {
            logId.then(val => {
                if (val['value']) {
                    obj['productJson'] = tempProductJson;
                    obj['id'] = val['value'];
                    obj['timeStamp'] = new Date();
                    let logArray: any = localStorage.getItem('SavePointSE');
                    logArray = JSON.parse(logArray);
                    if (logArray && logArray.length > 0) {
                        logArray.push(obj);
                    } else {
                        logArray = [];
                        logArray.push(obj);
                    }
                    localStorage.removeItem('SavePointSE');
                    localStorage.setItem('SavePointSE', JSON.stringify(logArray));
                    Swal.fire({
                        toast: true,
                        type: 'success',
                        title: 'Logged successfully',
                        position: 'top',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    if (item) {
                        this.initFromStarterObj(item['starterObj'], true);
                        this.productJson = item['productJson'];
                        this.doPreview();
                        this.savePointModal = false;
                    }
                }
            });
        }
    }

    openSavePoint() {
        this.logArray = JSON.parse(localStorage.getItem('SavePointSE'));
        if (this.logArray && this.logArray.length > 0) {
            this.savePointModal = true;
        } else {
            Swal.fire({
                toast: true,
                type: 'info',
                title: 'Nothing saved to save point',
                position: 'top',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }

    setNewTransactionMapping() {

    }

    openFromLog(item) {
        Swal.fire({
            title: 'Are you sure?',
            text: "Any existing changes will be lost",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(98, 124, 177)',
            cancelButtonColor: 'rgb(207, 80, 80)',
            confirmButtonText: 'Proceed',
            cancelButtonText: 'Proceed, After logging Current',
        }).then((result) => {
            if (result.value) {
                this.savePointModal = false;
                this.initFromStarterObj(item['starterObj'], true);
                this.productJson = item['productJson'];
                this.doPreview();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                this.logIt(item);
            }
        });
    }

    deleteFromLog(index) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(98, 124, 177)',
            cancelButtonColor: 'rgb(207, 80, 80)',
            confirmButtonText: 'Yes, Delete!'
        }).then((result) => {
            if (this.logArray && this.logArray[index] && result.value) {
                this.logArray.splice(index, 1);
                localStorage.removeItem('SavePointSE');
                localStorage.setItem('SavePointSE', JSON.stringify(this.logArray));
                Swal.fire({
                    toast: true,
                    type: 'success',
                    position: 'top',
                    title: 'Deleted successfully',
                    showConfirmButton: false,
                    timer: 2000
                });
                if (this.logArray.length === 0) {
                    this.savePointModal = false;
                }
                this.ref.detectChanges();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    toast: true,
                    type: 'error',
                    position: 'top',
                    title: 'Log Point is safe',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        });
    }

    filterSearchModel(data) {
        if (data && data.length > 3) {
            this.derivedModel = [];
            let list = this.copy(this.derivedModelBck);
            list.forEach((element: Object) => {
                if (element.hasOwnProperty('children') && element['children'].length > 0) {
                    let obj = this.recursiveFilterList(element['children'], data);
                    if (obj['found']) {
                        element['children'] = obj['list'];
                        this.derivedModel.push(element);
                    } else {
                        if (element['keyName'] && element['keyName'].toLowerCase().includes(data.toLowerCase())) {
                            this.derivedModel.push(element);
                        }
                    }
                } else {
                    if (element['keyName'] && element['keyName'].toLowerCase().includes(data.toLowerCase())) {
                        this.derivedModel.push(element);
                    }
                }
            });
        } else {
            this.derivedModel = this.copy(this.derivedModelBck);
        }
    }

    recursiveFilterList(modelList: Array<any>, filterKey): any {
        let obj = { list: [], found: false };
        obj['list'] = modelList.filter((element: Object) => {
            if (element['keyName'] && element['keyName'].toLowerCase().includes(filterKey.toLowerCase())) {
                return true;
            } else if (element.hasOwnProperty('children') && element['children'].length > 0) {
                let resObj = this.recursiveFilterList(element['children'], filterKey);
                if (obj['found']) {
                    return true;
                }
            }
        });
        if (obj['list'].length > 0) {
            obj['found'] = true;
        }
        return obj;
    }
    createMapping() {
        let parentObj = this.map[0] || this.map;
        if (this.addedModelGroup.value['value'] && this.addedModelGroup.value['type']) {
            if (!parentObj.hasOwnProperty(this.addedModelGroup.value['value'])) {
                let newFormControlValue: any;
                if (this.addedModelGroup.value['type'] === 'Control') {
                    newFormControlValue = '';
                } else if (this.addedModelGroup.value['type'] === 'Group') {
                    newFormControlValue = {};
                } else if (this.addedModelGroup.value['type'] === 'Array') {
                    newFormControlValue = [];
                }
                parentObj[this.addedModelGroup.value['value']] = newFormControlValue;
                let item = {
                    'keyName': this.addedModelGroup.value['value'],
                    'keyType': 'Control',
                    'isNew': true
                };
                item['keyType'] = this.addedModelGroup.value['type'];
                if (newFormControlValue !== '') {
                    item['children'] = [];
                }
                this.list.push(item);
                setTimeout(() => {
                    document.getElementById(item['keyName']).scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
                });
                this.derivedModelBck = this.copy(this.derivedModel);
                this.mapModificationArray.push(this.addedModelGroup.value['value']);
                Swal.fire({
                    type: 'success',
                    title: 'New mapping created successfully',
                    showConfirmButton: false,
                    timer: 2000
                });
                this.addedModelGroup.reset();
                this.addNewMappingRowShowButton = false;
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Mapping already exists!',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }
    }

    removeMapping(list, map, item): void {
        let parentObj = map[0] || map;
        if (parentObj.hasOwnProperty(item.keyName)) {
            delete parentObj[item.keyName];
            list.forEach((element, key) => {
                if (element.keyName === item.keyName) {
                    list.splice(key, 1);
                    Swal.fire({
                        type: 'success',
                        title: 'Mapping deleted successfully',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    let eleIndex = this.mapModificationArray.indexOf(element.keyName);
                    if (eleIndex > -1) {
                        this.mapModificationArray.splice(eleIndex, 1);
                    }
                    this.derivedModelBck = this.copy(this.derivedModel);
                    return;
                }
            });

        } else {
            Swal.fire({
                type: 'error',
                title: 'Sorry! unable to delete mapping',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }
    setUnsetListAndMap(addNewMappingRowShowButton, list, map) {
        if (addNewMappingRowShowButton) {
            this.list = list;
            this.map = map;
            setTimeout(() => {
                document.getElementById('addedModelGroupValue').scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
            });
        } else {
            this.list = null;
            this.map = null;
        }
    }

    removeEvent(item: Object, eventId) {
        let eventArray: Array<any> = item['events'];
        let index = eventArray.findIndex(element => {
            if (eventId === element['eventId']) {
                return true;
            } else {
                return false;
            }
        });
        if (index > -1) {
            eventArray.splice(index, 1);
        }
        item['events'] = eventArray;
        if (this.modalPreviewJson.elementList.length > 0) {
            this.modalPreviewJson.elementList = this.findInProduct(this.modalPreviewJson.elementList, item);
        } else {
            this.productJson.elementList = this.findInProduct(this.productJson.elementList, item);
        }
    }

    addEventObj(item) {
        this.jsonEdit = this.copy(this.sampleEventJson);
        this.jsonEditDone = false;
        this.editingModal = true;
        this.currentEditingEventItem = item;
    }

    editEvent(item, eventId) {
        let eventArray: Array<any> = item['events'];
        let eventObj;
        let index = eventArray.findIndex(element => {
            if (eventId === element['eventId']) {
                return true;
            } else {
                return false;
            }
        });
        if (index > -1) {
            eventObj = eventArray.splice(index, 1);
        }
        this.jsonEdit = this.copy(eventObj[0]);
        this.jsonEditDone = true;
        this.editingModal = true;
        this.currentEditingEventItem = item;
    }
}