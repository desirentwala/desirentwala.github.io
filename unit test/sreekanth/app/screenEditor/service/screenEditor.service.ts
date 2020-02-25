import { Injectable, isDevMode } from '@angular/core';

import { ConfigService } from '../../core/services/config.service';
import { UtilsService } from '../../core/ui-components/utils/utils.service';
import { EventConstants } from '../../modules/transaction/constants/ncpEvent.constants';
import { Subject } from '@adapters/packageAdapter';
import { MenuService } from '../../modules/common';

@Injectable()
export class EditorService {
    private starterObj: any;
    private uiElementsJson: any;
    private productPreviewJson: any;
    private themeList: Array<any> = [];
    snippetArray: Array<any> = [];
    modelMethodList: Array<any> = [];
    masterJson: Array<any> = [];
    masterElementChangeSub: Subject<any> = new Subject<any>();
    eventArrayChangeSub: Subject<any> = new Subject<any>();
    public eventConstants: any = EventConstants;
    public transactionMapping: any;
    private _menuJSON: any;
    public productSetupDataForLOB: any;
    public storeSetupToProductCdObject: string;
    public doUpdateSetupToLOBObject: boolean;
    constructor(public config: ConfigService, public utils: UtilsService, public menuService: MenuService) {
        let resp = this.config.ncpJsonCall('assets/config/theme.json');
        resp.subscribe(data => {
            if (data && data['themes'] instanceof Array) {
                this.themeList = data['themes'];
            }
        });
    }

    getStarterObj() {
        return this.starterObj;
    }

    setStarterObj(obj) {
        this.starterObj = obj;
    }

    getUIElements() {
        if (this.uiElementsJson) {
            return this.uiElementsJson;
        } else {
            let uiElemResp = this.config.ncpJsonCall('assets/se/utility/utility.json');
            return uiElemResp;
        }
    }

    getProductJson(productCode: string, lob: string) {
        // let prodResp = this.util.getProductElements(productCode.toLocaleLowerCase());
        let template = this.utils.get(lob)[productCode]['templateName'];
        return this.config.getProductElements(template.toLowerCase());
    }

    getProductPreviewJson() {
        return this.productPreviewJson;
    }

    setProductPreviewJson(json: any) {
        this.productPreviewJson = json;
    }

    saveData = (function () {
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        return function (data, fileName) {
            var json = JSON.stringify(data),
                blob = new Blob([json], { type: "octet/stream" }),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    getThemeList() {
        return this.themeList;
    }

    getMapJson() {
        let resp = this.config.ncpJsonCall('assets/se/utility/map.json');
        return resp;
    }

    getTemplateJson(item) {
        if (item) {
            let resp = this.config.ncpJsonCall(item);
            return resp;
        } else {
            return null;
        }
    }

    createMasterJson(applicableProds, lob) {
        if (applicableProds && applicableProds.length > 0) {
            applicableProds.forEach(element => {
                let i = 0;
                let productResp;
                productResp = this.getProductJson(element['code'], lob);
                productResp.subscribe(data => {
                    if (data instanceof Object && i < applicableProds.length) {
                        this.populateMasterJson(data, applicableProds[i]['code']);
                        this.populateEventJson(data, applicableProds[i]['code']);
                    }
                    if (i === (applicableProds.length - 1) && i < applicableProds.length) {
                        this.masterElementChangeSub.next(this.masterJson);
                        this.eventArrayChangeSub.next(this.eventConstants);

                    }
                    i++;
                });
            });
        }
    }

    populateMasterJson(prodJson, prodCode) {
        prodJson.elementList.forEach(element => {
            if (element['controlType'] === 'Row') {
                let obj = this.checkForFormNames(element['elementList']);
                if (obj.hasOwnProperty('elementFormName') && obj.hasOwnProperty('controlType')) {
                    this.pushToMasterJson(element, obj, prodCode);
                }
            } else {
                if (element['elementList'] && element['elementList'].length > 0) {
                    this.populateMasterJson(element, prodCode);
                } else {
                    let obj = this.checkForFormNames(element);
                    if (obj.hasOwnProperty('elementFormName') && obj.hasOwnProperty('controlType')) {
                        this.pushToMasterJson(element, obj, prodCode);
                    }
                }
            }
        });
    }

    checkForFormNames(rowElemList: any): Object {
        let obj = {};
        if (rowElemList instanceof Array && rowElemList.length > 0) {
            rowElemList.forEach(element => {
                if (element['elementFormName']) {
                    obj['controlType'] = element['controlType'];
                    obj['elementFormName'] = element['elementFormName'];
                    if (element['secondaryFormName']) {
                        obj['secondaryFormName'] = element['secondaryFormName'];
                    }
                    if (element['thirdFormName']) {
                        obj['thirdFormName'] = element['thirdFormName'];
                    }
                    if (element['fourthFormName']) {
                        obj['fourthFormName'] = element['fourthFormName'];
                    }
                    if (element['elementControlhome']) {
                        obj['elementControlhome'] = element['elementControlhome'];
                    }
                } else {
                    if (element['elementList'] && element['elementList'].length > 0) {
                        obj = this.checkForFormNames(element['elementList']);
                    }
                }
            });
        }
        if (rowElemList instanceof Object) {
            let element = rowElemList;
            if (element['controlType'] && element['elementFormName']) {
                obj['controlType'] = element['controlType'];
                obj['elementFormName'] = element['elementFormName'];
                if (element['secondaryFormName']) {
                    obj['secondaryFormName'] = element['secondaryFormName'];
                }
                if (element['thirdFormName']) {
                    obj['thirdFormName'] = element['thirdFormName'];
                }
                if (element['fourthFormName']) {
                    obj['fourthFormName'] = element['fourthFormName'];
                }
                if (element['elementControlhome']) {
                    obj['elementControlhome'] = element['elementControlhome'];
                }
            }
        }
        return obj;
    }

    pushToMasterJson(item: any, infoObj: Object, prodCode: any) {
        let masterElementName: string = '';
        if (infoObj['controlType']) {
            masterElementName = masterElementName + infoObj['controlType'];
        }
        if (infoObj['elementFormName']) {
            masterElementName = masterElementName + '-' + infoObj['elementFormName'];
        }
        if (infoObj['secondaryFormName']) {
            masterElementName = masterElementName + '-' + infoObj['secondaryFormName'];
        }
        if (infoObj['thirdFormName']) {
            masterElementName = masterElementName + '-' + infoObj['thirdFormName'];
        }
        if (infoObj['fourthFormName']) {
            masterElementName = masterElementName + '-' + infoObj['fourthFormName'];
        }
        if (infoObj['elementControlhome']) {
            masterElementName = masterElementName + '-' + infoObj['elementControlhome'];
        }
        masterElementName = masterElementName + '(' + prodCode + ')';
        item['masterElementName'] = masterElementName;
        item['prodCode'] = prodCode;
        let index = this.masterJson.findIndex(element => {
            if (element['masterElementName'] === masterElementName) {
                return true;
            } else {
                return false;
            }
        });
        if (index === -1) {
            this.masterJson.push(item);
        }
    }

    public getProductMappingData(lobCode) {
        let input = {
            'lobCode': lobCode
        };
        return this.config.ncpRestServiceCall('utils/getTransactionMapping', input);

    }

    public updateProductMappingData(lobCode, details) {
        let input = {
            'lobCode': lobCode,
            'details': JSON.stringify(details)
        };
        return this.config.ncpRestServiceCall('utils/updateTransactionMapping', input);

    }

    public setMenuJSON() {
        let menuResponse = this.menuService.getMasterMenuJson();
        menuResponse.subscribe(menu => {
            this._menuJSON = menu[0];
            this.config.setLoadingSub('no');
        });
    }

    public getMenuJSON() {
        return this._menuJSON;
    }

    public flashObjectValues(obj: any) {
        let output, v, key;
        output = Array.isArray(obj) ? [] : {};
        for (key in obj) {
            v = obj[key];
            output[key] = (typeof v === "object") ? this.flashObjectValues(v) : (typeof v === 'boolean') ? false : (typeof v === 'number') ? 0 : '';
        }
        return output;
    }

    populateEventJson(formData, prodCode) {
        if (formData['events'] && formData['events'].length > 0) {
            this.pushToEventJson(formData['events'], prodCode);
        }
        if (formData['elementList'] && formData['elementList'].length > 0) {
            formData['elementList'].forEach(element => {
                this.populateEventJson(element, prodCode);
            });
        }
    }

    pushToEventJson(eventList, prodCode) {
        eventList.forEach(element => {
            element['name'] = element['eventId'] + ' - ' + prodCode;
            this.eventConstants[element['eventId']] = element;
        });
    }

}