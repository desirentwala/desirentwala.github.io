import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { ConfigService } from '../../core/services/config.service';
import { SharedService } from '../../core/shared/shared.service';
import { UtilsService } from '../../core/ui-components/utils/utils.service';
import { EditorService } from '../service/screenEditor.service';
import { environment } from '../../../environments/environment.prod';

@Component({
    selector: 'screen-starter',
    templateUrl: 'starter.html',
    styleUrls: ['starter.component.css']
})

export class ScreenStarterComponent implements OnInit, OnDestroy {
    applicableProds: Array<any> = [];
    lobList: Array<any> = [];
    productList: any = [];
    isNewProd: any;
    isB2c: any;
    isCopyProd: any;
    disableEdit: any;
    masterJson: Array<any> = [];
    modelMethodList: Array<any> = [];
    lob: FormControl = new FormControl('', Validators.required);
    productSetupLOBCode: FormControl = new FormControl('', Validators.required);
    copiedProductSetupLOBCode: FormControl = new FormControl('');
    mode: FormControl = new FormControl('');
    langCode: FormControl = new FormControl('');
    projectCode: FormControl = new FormControl('');
    countryCode: FormControl = new FormControl('');
    prodCode: FormControl = new FormControl('', Validators.required);
    existingProd: FormControl = new FormControl('', Validators.required);
    modeList: Array<any> = ['Quotes', 'Endorsements', 'Snippet', 'Language upload/download', 'Product Setup', 'Menu Setup'];
    endtArray: Array<any> = [];
    snippetArray: Array<any> = [];
    templateJson: any;
    langArray: Array<any> = [];
    isAddLang: boolean = false;
    isUploadExcel: boolean = false;
    langDownload = {};
    isNewLOB: boolean = false;
    constructor(public config: ConfigService,
        public utils: UtilsService,
        public editorService: EditorService, public shared: SharedService) {
        config.setCustom('editorMode', true);
    }

    ngOnInit() {
        this.langArray = this.shared.translate.getLangs();
        this.config.disableRefreshCheck();
        let productDetails = this.utils.getProductDetails();
        let lang = this.config.getI18NLang();
        let resp = this.editorService.getMapJson();
        resp.subscribe(data => {
            if (data) {
                this.processMapJson(data);
            }
        });
        if (productDetails && productDetails.length > 0) {
            this.initLobDetails();
            this.editorService.setMenuJSON();
        } else {
            this.utils.loadedSub.subscribe(() => {
                this.initLobDetails();
                this.editorService.setMenuJSON();
            });
        }
        this.lob.valueChanges.subscribe(data => {
            this.populateProdList(data);
            this.masterJson = [];
            this.editorService.masterJson = [];
            this.editorService.createMasterJson(this.applicableProds, this.lob.value);
        });
    }

    initLobDetails() {
        let lobList = Object.keys(this.utils.routeJson);
        let productDetails = this.utils.getProductDetails();
        if (lobList && lobList.length > 0) {
            this.lobList = lobList;
            this.populateLobList(this.utils.routeJson);
        } else {
            this.utils.loadedSub.subscribe(() => {
                lobList = Object.keys(this.utils.routeJson);
                this.lobList = lobList;
                this.populateLobList(this.utils.routeJson);
            });
        }
        this.config.setLoadingSub('no');
    }

    populateLobList(setupJson: any) {
        this.lobList.forEach(elem => {
            let lob = setupJson[elem];
            let templates = [];
            Object.keys(lob).forEach(product => {
                let obj = {};
                let element = lob[product]['DETAILS'];
                obj['productCode'] = element['productCode'];
                obj['productDesc'] = element['title'];
                obj['lob'] = elem;
                obj['modelMethodName'] = element['modelMethodName'];
                obj['templateName'] = lob[product]['templateName'];
                templates.push({
                    code: element['productCode'],
                    desc: element['title']
                });
                this.productList.push(obj);
                if (element['modelMethodName']) {
                    let i = this.modelMethodList.findIndex(ele => {
                        if (ele['modelMethodName'] === element['modelMethodName']) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (i < 0) {
                        let obj: {} = {};
                        obj['lob'] = elem;
                        obj['modelMethodName'] = element['modelMethodName'];
                        this.modelMethodList.push(obj);
                    }
                }
            });
            let i = this.modelMethodList.findIndex(ele => {
                if (ele['lob'] === elem) {
                    return true;
                } else {
                    return false;
                }
            });
            if (i > -1) {
                this.modelMethodList[i]['templates'] = templates;
            }
        });
        this.editorService.modelMethodList = this.modelMethodList;
    }

    populateProdList(selectedLob) {
        this.applicableProds = [];
        // let lob: Object = this.utils.get(selectedLob);
        // let prodCodes: Array<any> = Object.keys(lob);
        // // selectedLob = lob[prodCodes[0]]['DETAILS']['lineOfBusiness'];
        this.productList.forEach(element => {
            if (element['lob'] === selectedLob) {
                let obj = {
                    'code': element['productCode'],
                    'desc': this.utils.getTranslated(element['productDesc']),
                    'lob': element['lob'],
                    'template': element['templateName']
                };
                this.applicableProds.push(obj);
            }
        });
        if (this.applicableProds.length === 1) {
            this.existingProd.setValue(this.applicableProds[0]['code']);
        }
    }

    setCheckBoxValue() {
        this.isCopyProd = !this.isCopyProd;
    }

    goToEditor() {
        let obj: any = {};
        obj['mode'] = this.mode.value;
        obj['isNewProd'] = this.isNewProd;
        obj['isCopyProd'] = this.isCopyProd;
        obj['newProdCode'] = this.prodCode.value;
        obj['existingProdCode'] = this.existingProd.value;
        obj['isSetupJSON'] = obj['mode'] === 'Product Setup' || obj['mode'] === 'Menu Setup';
        if (obj['mode'] === 'Product Setup') {
            if (this.copiedProductSetupLOBCode.value) {
                this.editorService.productSetupDataForLOB = this.utils.getProductSetupDataByLOB(this.copiedProductSetupLOBCode.value);
            } else {
                this.editorService.productSetupDataForLOB = this.utils.getProductSetupDataByLOB(this.productSetupLOBCode.value);
            }
            obj['isNewLOB'] = this.isNewLOB === true;
            if (Object.keys(this.editorService.productSetupDataForLOB).length === 0 && this.editorService.productSetupDataForLOB.constructor === Object) {
                if (this.utils.routeJson.constructor === Object) {
                    this.editorService.productSetupDataForLOB = this.utils.routeJson[Object.keys(this.utils.routeJson)[0]];
                }
                obj['isNewLOB'] = true;
            }
            let productCode = this.prodCode.value || this.existingProd.value;
            if (productCode) {
                obj['setupDetails'] = this.editorService.productSetupDataForLOB[productCode];
                if (typeof obj['setupDetails'] === 'undefined') {
                    this.editorService.productSetupDataForLOB[productCode] = {};
                    this.editorService.productSetupDataForLOB[productCode] = this.editorService.flashObjectValues(this.editorService.productSetupDataForLOB[Object.keys(this.editorService.productSetupDataForLOB)[0]]);
                    obj['setupDetails'] = this.editorService.productSetupDataForLOB[productCode];
                }
                this.editorService.doUpdateSetupToLOBObject = false;
            } else {
                obj['setupDetails'] = this.editorService.productSetupDataForLOB;
                this.editorService.doUpdateSetupToLOBObject = true;
            }
            this.editorService.storeSetupToProductCdObject = productCode;
        }
        if (obj['mode'] === 'Menu Setup') {
            obj['setupDetails'] = this.editorService.getMenuJSON();
        }
        if (this.isB2c) {
            this.config.setCustom('b2cFlag', this.isB2c);
        }
        if (this.lob.value) {
            obj['lob'] = this.lob.value;
            if (this.config.useLegacy === true) {
                obj['modelMethodName'] = this.fetchMethodModelName(this.applicableProds[0]['lob']);
            } else {
                obj['transactionMappingObserver'] = this.editorService.getProductMappingData(this.applicableProds[0]['lob'].toUpperCase());
            }
        }
        if (this.editorService.masterJson && this.editorService.masterJson.length > 0) {
            obj['masterJson'] = this.editorService.masterJson;
            obj['templateProds'] = this.applicableProds;
        }
        if (this.templateJson) {
            obj['templateJson'] = this.templateJson;
        }

        this.editorService.setStarterObj(obj);
        this.editorService.masterJson = [];
        this.config.navigateRouterLink('se/editor');
    }

    downloadMasterJson() {
        if (this.masterJson && this.masterJson.length > 0) {
            this.editorService.saveData(this.masterJson, this.lob.value + '.json');
        }
    }

    fetchMethodModelName(lob: string) {
        let modelMethodName;
        if (lob) {
            this.productList.forEach(element => {
                if (element['lob'] === lob) {
                    modelMethodName = element['modelMethodName'];
                }
            });
        }
        return modelMethodName;
    }

    ngOnDestroy() {
        this.config.enableRefreshCheck();
    }

    processMapJson(data) {
        if (data instanceof Object && data['children'] && data['children'].length > 0) {
            data.children.forEach(element => {
                if (element['name'] === 'endorsements' && Array.isArray(element['children']) && element['children'].length > 0) {
                    this.populateFileArray(element['children'], 'endt');
                }
                if (element['name'] === 'snippets' && Array.isArray(element['children']) && element['children'].length > 0) {
                    this.populateFileArray(element['children'], 'snippet');
                    this.editorService.snippetArray = this.snippetArray;
                }
            });
        } else {
            alert('Common dude! Run seProdJsonFile.js');
            this.config.navigateToHome();
        }
    }

    populateFileArray(fileArray: Array<any>, type: string, dir?: string) {
        fileArray.forEach(element => {
            let obj = {};
            if (element['type'] === 'file') {
                if (dir) {
                    obj['name'] = dir + element['name'];
                    if (type === 'endt') {
                        obj['path'] = 'assets/json/products/endorsements/' + dir + element['name'];
                    } else if (type === 'snippet') {
                        obj['path'] = 'assets/json/products/snippets/' + dir + element['name'];
                    }
                } else {
                    obj['name'] = element['name'];
                    if (type === 'endt') {
                        obj['path'] = 'assets/json/products/endorsements/' + element['name'];
                    } else if (type === 'snippet') {
                        obj['path'] = 'assets/json/products/snippets/' + element['name'];
                    }
                }
                if (obj) {
                    if (type === 'endt') {
                        this.endtArray.push(obj);
                    }
                    if (type === 'snippet') {
                        this.snippetArray.push(obj);
                    }
                }
            } else if (element['type'] === 'directory') {
                let folderName = '';
                if (dir) {
                    folderName = dir + element['name'] + '/';
                } else {
                    folderName = element['name'] + '/';
                }
                if (Array.isArray(element['children']) && element['children'].length > 0) {
                    this.populateFileArray(element['children'], type, folderName);
                }
            } else {
                console.error('invalid map json', element);
            }
        });
    }

    selectTemplate(template: any) {
        if (template) {
            let resp = this.editorService.getTemplateJson(template);
            if (resp) {
                resp.subscribe(data => {
                    if (data) {
                        this.templateJson = data;
                    }
                });
            } else {
                this.templateJson = null;
                console.error('not able to find Json' + template['path']);
            }
        }
    }

    fileUploaded(event) {
        let e = event;
        if (event.target && event.target.files) {
            let file = event.target.files[0];
            // console.log(file, event.target.files);
            let fr = new FileReader();
            fr.onload = (e) => {
                const wb: XLSX.WorkBook = XLSX.read(e.target['result'], { type: 'binary' });
                /* grab first sheet */
                const wsName: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsName];
                let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                this.convertToJson(data);
            };
            fr.readAsBinaryString(file);
        }
    }

    convertToJson(excelData: any) {
        let langJson: Object = {};
        this.langDownload = {};
        if (excelData instanceof Array) {
            let headers = excelData[0];
            headers.forEach((element, i) => {
                if (element !== 'key') {
                    langJson[i.toString()] = {};
                }
            });
            for (let index = 1; index < excelData.length; index++) {
                const element = excelData[index];
                for (let j = 0; j < element.length; j++) {
                    const val = element[j];
                    if (j !== 0 && val) {
                        langJson[j.toString()][element[0]] = val;
                    }
                }
            }
            Object.keys(langJson).forEach(key => {
                const json = langJson[key] !== {} ? langJson[key] : undefined;
                if (json) {
                    let label: string = 'ncp' + environment.country + environment.project + '_' + headers[parseInt(key)] + '.json';
                    this.langDownload[label] = json;
                }
            });
        }
    }

    downLoadLang(lang) {
        if (this.shared.translate.getLangs().indexOf(lang) > -1) {
            this.shared.translate.getTranslation(lang).subscribe(data => {
                this.mergeLangWithDefault(data, lang);
            });
        }
    }

    mergeLangWithDefault(selectedLang: Object, lang) {
        let defLang: Object = this.config.getI18NLang();
        let mergedLang: Array<any> = [];
        let currentLang: string = this.config.currentLangName || 'en';
        if (lang !== currentLang) {
            if (Object.keys(selectedLang).length > 0) {
                Object.keys(selectedLang).forEach(key => {
                    let obj = { key: '' };
                    obj['key'] = key;
                    if (defLang.hasOwnProperty(key)) {
                        obj[currentLang] = defLang[key];
                        delete defLang[key];
                    }
                    obj[lang] = selectedLang[key];
                    mergedLang.push(obj);
                });
            } else {
                let obj = { key: '' };
                obj[lang] = '';
                mergedLang.push(obj);
            }
        }
        if (Object.keys(defLang).length > 0) {
            Object.keys(defLang).forEach(key => {
                let obj = { key: '' };
                obj['key'] = key;
                obj[currentLang] = defLang[key];
                mergedLang.push(obj);
            });
        }
        const ws_name = 'Language' + '_' + currentLang + '_' + lang;
        const wb: XLSX.WorkBook = { SheetNames: [], Sheets: {} };
        const ws: any = XLSX.utils.json_to_sheet(mergedLang);
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;
        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
        fs.saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), 'exportedLang' + '_' + currentLang + '_' + lang + '.xlsx');
    }

    s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF;
        };
        return buf;
    }

    addLang(lang) {
        if (lang && this.langArray.indexOf(lang) === -1) {
            this.langArray.push(lang);
            this.isAddLang = false;
        } else {
            alert('Invalid Lang');
        }
    }

    updateProjectCode(projectCode) {
        environment.project = projectCode;
    }

    updateCountryCode(countryCode) {
        environment.country = countryCode;
    }

    saveLang(lang) {
        this.editorService.saveData(this.langDownload[lang], lang);
    }
}