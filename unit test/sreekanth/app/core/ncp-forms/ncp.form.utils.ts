import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from '@adapters/packageAdapter';

import { Logger } from '../ui-components/logger';

@Injectable()
export class NCPFormUtilsService {
    logger: Logger;
    public mainFormGroup: FormGroup;
    public loadedSub = new Subject();
    previewModal: Array<any> = [];
    snippetPreviewModal: Array<any> = [];
    isSnippetPreview: boolean = false;
    hoverSub: Subject<any> = new Subject<any>();
    mouseLeaveSub: Subject<any> = new Subject<any>();
    mainFormDataUpdatedSub: Subject<any> = new Subject<any>();
    isInspectMode: boolean = false;
    private transactionContextObj: any;
    eventArray: Array<any> = [];
    public clickedElementUniqueId: number;
    constructor(_logger: Logger) {
        this.logger = _logger;
    }
    public setJsonValues(ncpJson: any, keyId: string, key: string, value: any): any {
        try {
            let keys: Array<string> = keyId.split('-');
            let levels: number = keys.length;
            let ncpElements;
            let tempkeys;
            let keymatch = false;
            if (levels > 1) {
                ncpElements = ncpJson.elementList;
                while (!keymatch) {
                    for (var k = 0; k < ncpElements.length; k++) {
                        tempkeys = ncpElements[k].keyId.split('-');
                        if (tempkeys.length === keys.length) {
                            keymatch = this.compareKeys(tempkeys, keys, ncpElements[k], key, value);
                            if (keymatch) {
                                break;
                            }
                        }
                        if (keys.length > tempkeys.length && !keymatch) {
                            if (ncpElements[k].elementList && ncpElements[k].elementList.length > 0) {
                                keymatch = this.recusiveSearchForKey(ncpElements[k], keys, key, value);
                                if (keymatch) {
                                    break;
                                }
                            }
                        }

                    }
                }
            }
            if (levels === 1) {
                ncpJson[key] = value;
            }
        } catch (e) {
            this.logger.error(e + 'Error in setting value for keyId' + keyId);
        }
        return ncpJson;
    }

    public recusiveSearchForKey(element, keys, key, value) {
        let tempKeys;
        let keyMatch;
        for (var j = 0; j < element.elementList.length; j++) {
            tempKeys = element.elementList[j].keyId.split('-');
            if (tempKeys.length === keys.length) {
                keyMatch = this.compareKeys(tempKeys, keys, element.elementList[j], key, value);
                if (keyMatch) {
                    break;
                }
            }
            if (keys.length > tempKeys.length && !keyMatch) {
                if (element.elementList[j].elementList && element.elementList[j].elementList.length > 0) {
                    keyMatch = this.recusiveSearchForKey(element.elementList[j], keys, key, value);
                }
            }
        }
        return keyMatch;
    }

    public compareKeys(tempkeys, keys, element, key, value): boolean {
        let keymatched = false;
        for (let i = 0; i < tempkeys.length; i++) {
            if (parseInt(tempkeys[i]) == parseInt(keys[i])) {
                keymatched = true
            } else {
                keymatched = false;
                break;
            }
        }
        if (keymatched) {
            element[key] = value;
        }
        return keymatched;
    }

    getMainFormGroup() {
        return this.mainFormGroup;
    }

    setMainFormGroup(formGroup: FormGroup) {
        this.mainFormGroup = formGroup;
    }


    setJsonByElementId(ncpJson: any, elementId: string, key: string, value: any, reCurringId?: boolean) {
        let idMatched = false;
        if (ncpJson['elementId'] === elementId) {
            idMatched = true;
            ncpJson = this.setValue(ncpJson, key, value);
        } else {
            if (Array.isArray(ncpJson['elementList'])) {
                for (let i = 0; i < ncpJson['elementList'].length; i++) {
                    if (ncpJson['elementList'][i]['elementId'] === elementId) {
                        ncpJson['elementList'][i] = this.setValue(ncpJson['elementList'][i], key, value);
                        idMatched = true;
                        if (!reCurringId) {
                            break;
                        }
                    } else {
                        let elemList = ncpJson['elementList'][i]['elementList'];
                        idMatched = this.recursiveSearchForElementId(elemList, elementId, key, value, reCurringId);
                        if (idMatched && !reCurringId) {
                            break;
                        }
                    }
                };
            }
        }
        if (idMatched) {
            return ncpJson;
        } else {
            this.logger.info('Element Id ' + elementId + 'is not available');
            return ncpJson;
        }
    }

    setValue(item: Object, key: string, value: any) {
        item[key] = value;
        return item;
    }

    recursiveSearchForElementId(elemList: Array<any>, elementId: string, key: string, value: any, reCurringId?: boolean): boolean {
        let idMatched: boolean = false;
        if (Array.isArray(elemList)) {
            for (let i = 0; i < elemList.length; i++) {
                if (elemList[i]['elementId'] === elementId) {
                    elemList[i] = this.setValue(elemList[i], key, value);
                    idMatched = true;
                    if (!reCurringId) {
                        break;
                    }
                } else {
                    if (elemList[i]['elementList'] && Array.isArray(elemList[i]['elementList'])
                        && elemList[i]['elementList'].length > 0) {
                        let subList = elemList[i]['elementList'];
                        idMatched = this.recursiveSearchForElementId(subList, elementId, key, value, reCurringId);
                        if (idMatched && !reCurringId) {
                            break;
                        }
                    }
                }
            }
        }
        return idMatched;
    }
    parseJSONValue(value) {
        if (value && (typeof value === 'string')) {
            let doEvaluate: boolean;
            let logicalExpression = value.indexOf('function:') === 0;
            if (logicalExpression) {
                value = value.split('function:').pop();
                doEvaluate = true;
            } else {
                return value;
            }
            if (doEvaluate === true) {
                // we can only pass a function as string in JSON ==> doing a real function
                let func = 'function () { ' + value + ' }';
                let jsFunc = new Function('return ' + func)();
                return jsFunc.call(this.getTransactionContextObj());
            }
        } else {
            return value;
        }
    }

    saveContextInFormUtils(obj) {
        this.setTransactionContextObj(obj);
    }

    public getTransactionContextObj() {
        return this.transactionContextObj;
    }

    public setTransactionContextObj(obj) {
        this.transactionContextObj = obj;
    }
    createEventArray(ncpForm) {
        if (ncpForm['events'] && ncpForm['events'].length > 0) {
            this.eventArray = this.eventArray.concat(ncpForm['events']);
        }
        if (ncpForm['elementList'] && ncpForm['elementList'].length > 0) {
            ncpForm['elementList'].forEach(element => {
                this.createEventArray(element);
            });
        }
        return this.eventArray;
    }

    openEditingModal(ele) {
        let data = {};
        data['id'] = 'openEditingModal';
        data['value'] = ele;
        if (ele['uniqueId']) {
            this.mainFormDataUpdatedSub.next(data);
        }
    }

    remove(ele) {
        let data = {};
        data['id'] = 'remove';
        data['value'] = ele;
        if (ele['uniqueId']) {
            this.mainFormDataUpdatedSub.next(data);
        }
    }

    duplicate(ele, sourceArray) {
        let data = {};
        data['id'] = 'duplicate';
        data['value'] = [ele, sourceArray];
        if (ele['uniqueId']) {
            this.mainFormDataUpdatedSub.next(data);
        }
    }

    showOptions(ele: any, e: any) {
        if (ele['uniqueId']) {
            this.clickedElementUniqueId = ele['uniqueId'];
        }
        e.stopPropagation();
    }
}
