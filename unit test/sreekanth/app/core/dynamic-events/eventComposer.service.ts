import { Injectable } from '@angular/core';
import { NCPFormUtilsService } from '../ncp-forms/ncp.form.utils';
import { EventObject, InputParam, Operations, OperationProcedure, EventBody, Output, subscriptionType } from './library/eventLibrary.interface';
import { Logger } from '../ui-components/logger';
import { FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';

@Injectable()
export class EventComposerService {
    public subscribtionList: Array<any> = [];
    outputObject = {};
    constructor(public ncpFormService: NCPFormUtilsService, public logger: Logger) { }

    createEventString(eventObj: EventObject, triggerData: any) {
        let ipParam: Array<any> = [];
        let opParam: Map<any, any> = new Map<any, any>();
        let eventString: string = '';
        let subString: string = '';
        if (eventObj['isCreateSubscribtion']) {
            if (eventObj['subscribtionType'] && eventObj['subscribtionKey'] && eventObj['path'] && eventObj['eventId']) {
                let context = this.ncpFormService.getTransactionContextObj();
                let formG: FormGroup = context['formGroup'];
                let sFormG: any;
                subString = 'this.outputObject["' + eventObj['eventId'] + '"]';
                let pathArray: Array<any> = eventObj['path'].toString().split('/');
                pathArray.forEach((path, i) => {
                    if (i === 0) {
                        if (formG.contains(path)) {
                            sFormG = formG.get(path);
                        } else if (sFormG && sFormG.contains(path)) {
                            sFormG = sFormG.get(path);
                        }
                    }
                });
                if (sFormG && sFormG.contains(eventObj['subscribtionKey'])) {
                    sFormG = sFormG.get(eventObj['subscribtionKey']);
                } else if (formG.contains(eventObj['subscribtionKey'])) {
                    sFormG = formG.get(eventObj['subscribtionKey']);
                } else {
                    this.logger.error('Error at runtime subscription');
                    this.logger.error('Data available is  ' + JSON.stringify(eventObj));
                }
                if (sFormG) {
                    subString += '= sFormG.' + subscriptionType[eventObj['subscribtionType']] + '.subscribe(function(data){';
                }
            } else {
                this.logger.error('Error at runtime subscription');
                this.logger.error('Data available is  ' + JSON.stringify(eventObj));
            }
        }
        if (eventObj['inputParams'] && eventObj['inputParams'].length > 0) {
            eventObj.inputParams.forEach(data => {
                let ip = this.extractInput(data, triggerData);
                if (ip) {
                    ipParam.push(ip);
                }
            });
        }
        if (eventObj['eventBody'] && eventObj['eventBody'].length > 0) {
            let rObj = this.createOperation(eventObj.eventBody, eventString, opParam, ipParam, triggerData);
            if (rObj) {
                eventString = rObj['eventString'] + ';';
                opParam = rObj['opParam'];
            }
        }
        if (eventObj['isCreateSubscribtion']) {
            let outputString = '; opParam.forEach(function(value, key)  { opParam.set(key, this.outputObject[key]);}); eventObj.output.forEach(function(dataOut) {this.handleOuput(dataOut, opParam);});';
            eventString += outputString;
        }
        try {
            if (eventObj['isCreateSubscribtion']) {
                subString += eventString + '});'
                eval(subString);
                this.subscribtionList.push(eval(eventObj['eventId']));
            } else {
                eval(eventString);
            }
        } catch (e) {
            this.logger.error('Error at Runtime in the composition');
            this.logger.error('For event ' + eventObj['eventId'] + ' ' + eventString);
            this.logger.error(e);
        }
        if (!eventObj['isCreateSubscribtion']) {
            if (eventObj['output'] && eventObj['output'].length > 0) {
                opParam.forEach((value, key) => {
                    opParam.set(key, this.outputObject[key]);
                });
                eventObj.output.forEach(dataOut => {
                    this.handleOuput(dataOut, opParam);
                });
            }
        }
        this.outputObject = {};

    }

    createOperation(eventBody: EventBody[], eString: string, oMap: Map<any, any>, iMap: Array<any>, triggerData: any) {
        eventBody.forEach(dataProc => {
            if (dataProc['operationOutputVar']) {
                oMap.set(dataProc['operationOutputVar'], '');
                eString = 'this.outputObject["' + dataProc['operationOutputVar'] + '"] = ';
            }
            if (dataProc.operation && dataProc.operation !== '' && Operations[dataProc.operation]) {
                eString += Operations[dataProc.operation] + '(';
            }
            if (dataProc['operationProcedure'] && dataProc['operationProcedure'].length > 0) {
                let rObj = this.createProcedure(dataProc['operationProcedure'], eString, oMap, iMap, triggerData);
                if (rObj) {
                    eString = rObj['eventString'];
                    oMap = rObj['opParam'];
                    if (dataProc.operation) {
                        eString += ')';
                    }
                }
            }
            if (dataProc['subOperations'] && dataProc['subOperations'].length > 0) {
                if (dataProc.operation) {
                    eString += '{';
                }
                let rObj = this.createOperation(dataProc['subOperations'], eString, oMap, iMap, triggerData);
                if (rObj) {
                    eString = rObj['eventString'];
                    oMap = rObj['opParam'];
                    if (dataProc.operation) {
                        eString += '}';
                    }
                }
            }
        });
        return { eventString: eString, opParam: oMap };
    }

    extractInput(ipObj: InputParam, eventObject) {
        try {
            let rip = '';
            if (ipObj['isDerivedValue']) {
                if (ipObj['isFromGroupValue'] && (ipObj['path'] || ipObj['keyName'])) {
                    let txnContext = this.ncpFormService.getTransactionContextObj();
                    let formG = txnContext['formGroup'];
                    let formV = formG.value;
                    if (formG) {
                        if (ipObj['path']) {
                            let pathArray: Array<any> = ipObj['path'].toString().split('/');
                            let pathString = '';
                            pathArray.forEach((path, i) => {
                                if (i > 0) {
                                    pathString += '.' + path;
                                } else {
                                    pathString += path;
                                }
                            });
                            if (pathString && formV[pathString]) {
                                formV = formV[pathString];
                            } else {
                                this.logger.error('Error at extracting Input');
                                this.logger.error('Invalid Path' + ipObj['path']);
                                return null;
                            }
                        }
                        if (formV && formV[ipObj['keyName']]) {
                            rip = formV[ipObj['keyName']];
                            return rip;
                        } else {
                            this.logger.error('Error at extracting Input');
                            this.logger.error('Invalid Path or KeyName' + JSON.stringify(ipObj));
                            this.logger.error('value at the path' + JSON.stringify(formV));
                            return null;
                        }
                    }

                }
                if (ipObj['isEventValue'] && eventObject) {
                    if (ipObj['eventDataKey'] && eventObject['value'][ipObj['eventDataKey']]) {
                        rip = eventObject['value'][ipObj['eventDataKey']];
                        return rip;
                    } else if (ipObj['eventDataKey'] && eventObject[ipObj['eventDataKey']]) {
                        rip = eventObject[ipObj['eventDataKey']];
                        return rip;
                    } else {
                        this.logger.error('Error at extracting Input');
                        this.logger.error('Invalid eventDataKey' + JSON.stringify(ipObj));
                        this.logger.error('Event Emitted value' + JSON.stringify(eventObject));
                        return null;
                    }
                }
            } else {
                rip = ipObj['staticValue'];
            }
            return rip;
        } catch (e) {
            this.logger.error('Error at extracting Input');
            this.logger.error('Input object --> ' + JSON.stringify(ipObj));
            this.logger.error(e);
        }
    }

    createProcedure(procArray: OperationProcedure[], subEventString: string, subOpParam: Map<any, any>, subIpParam: Array<any>, triggerData: any) {
        procArray.forEach(procedure => {
            if (procedure['isOperationOutput']) {
                if (procedure['operationOutputVar']) {
                    if (!subOpParam.has(procedure['operationOutputVar'])) {
                        subEventString += ' this.outputObject["' + procedure['operationOutputVar'] + '"]=';
                        subOpParam.set(procedure['operationOutputVar'], '');
                    } else {
                        this.logger.error('Error at creating Output variable');
                        this.logger.error('Output variable  --> ' + procedure['operationOutputVar'] + 'this variable already exists');
                        this.logger.error('Repeated output var in procedure' + JSON.stringify(procedure));
                    }
                }
            }
            if (procedure['isFromInputParams']) {
                if (procedure['inputParamIndex'] > -1 && subIpParam.length - 1 > procedure['inputParamIndex']) {
                    subEventString += ' ' + subIpParam[procedure['inputParamIndex']];
                }
            } else if (procedure['inputParam']) {
                subEventString += ' ' + this.extractInput(procedure['inputParam'], triggerData);
            }
            if (procedure['isOperation']) {
                if (procedure['operationOutputVar']) {
                    subOpParam.set(procedure['operationOutputVar'], '');
                    subEventString = 'this.outputObject["' + procedure['operationOutputVar'] + '"]= ';
                }
                if (procedure.operation && procedure.operation !== '' && Operations[procedure.operation]) {
                    subEventString += Operations[procedure.operation] + '(';
                }
                if (procedure['operationProcedure'] && procedure['operationProcedure'].length > 0) {
                    let rObj = this.createProcedure(procedure['operationProcedure'], subEventString, subOpParam, subIpParam, triggerData);
                    if (rObj) {
                        subEventString = rObj['eventString'];
                        subOpParam = rObj['opParam'];
                        if (procedure['isOperation']) {
                            subEventString += ') {';
                        }
                    }
                }
                if (procedure['subOperations'] && procedure['subOperations'].length > 0) {
                    let rObj = this.createOperation(procedure['subOperations'], subEventString, subOpParam, subIpParam, triggerData);
                    if (rObj) {
                        subEventString = rObj['eventString'];
                        subOpParam = rObj['opParam'];
                        if (procedure['isOperation']) {
                            subEventString += '}';
                        }
                    }
                }
            }
            if (procedure['isEndOfLine']) {
                subEventString += ';';
            }
        });
        return { eventString: subEventString, opParam: subOpParam };
    }


    handleOuput(output: Output, opParam: Map<any, any>) {
        let txnContext = this.ncpFormService.getTransactionContextObj();
        if (output['isUpdateView']) {
            if (output['viewDetails'] && output['viewDetails'].length > 0) {
                let formData = txnContext['formData'];
                if (formData) {
                    output.viewDetails.forEach(viewData => {
                        if (viewData['elementId'] && viewData['key'] && viewData['valueName']) {
                            if (opParam.has(viewData['valueName'])) {
                                formData = this.ncpFormService.setJsonByElementId(formData, viewData['elementId'], viewData['key'], opParam.get(viewData['valueName']), viewData['reCurringId']);
                            } else {
                                this.logger.error('Error at handling Output ');
                                this.logger.error('Wrong Output value/Output Value does not exist  --> ' + JSON.stringify(viewData['valueName']));
                            }
                        } else {
                            this.logger.error('Error at handling Output ');
                            this.logger.error('View details not available --> ' + JSON.stringify(viewData));
                        }
                    });
                } else {
                    this.logger.error('Error at handling Output ');
                    this.logger.error('Context not set and deos not have formData');
                }
                txnContext['formData'] = formData;
                txnContext['changeRef'].detectChanges();

            }
        }
        if (output['isUpdateFormGroup']) {
            if (output['formDetails'] && output['formDetails'].length > 0) {
                let formG: FormGroup = txnContext['formGroup'];
                let eFormG: any;
                if (formG) {
                    output.formDetails.forEach(formInfo => {
                        if (formInfo['valueName']) {
                            if (formInfo['path']) {
                                //TODO: Think about Adding Group or Array;
                                let pathArray: Array<any> = formInfo['path'].toString().split('/');
                                pathArray.forEach((path, i) => {
                                    try {
                                        if (i === 0) {
                                            if (formG.contains(path)) {
                                                eFormG = formG.get(path);
                                            } else {
                                                if (formInfo['fillPath']) {
                                                    if (formInfo['isGroup']) {
                                                        formG.addControl(path, new FormGroup({}));
                                                    } else if (formInfo['isArray']) {
                                                        formG.addControl(path, new FormArray([]));
                                                    } else {
                                                        formG.addControl(path, new FormControl(''));
                                                    }
                                                    formG.updateValueAndValidity();
                                                    eFormG = formG.get(path);
                                                }
                                            }
                                            eFormG = formG.get(path);
                                        } else {
                                            if (eFormG.contains(path)) {
                                                eFormG = eFormG.get(path);
                                            } else {
                                                if (formInfo['fillPath']) {
                                                    if (formInfo['isGroup']) {
                                                        eFormG.addControl(path, new FormGroup({}));
                                                    } else if (formInfo['isArray']) {
                                                        eFormG.addControl(path, new FormArray([]));
                                                    } else {
                                                        eFormG.addControl(path, new FormControl(''));
                                                    }
                                                    eFormG.updateValueAndValidity();
                                                    eFormG = eFormG.get(path);
                                                }
                                            }
                                        }
                                    } catch (e) {
                                        this.logger.error('Error at handling Output ');
                                        this.logger.error('Error in extracting Form for --> ' + JSON.stringify(formInfo));
                                        this.logger.error(e);
                                    }
                                });
                            }
                            if (formInfo['valueName'] && eFormG && eFormG.contains(formInfo['keyName'])) {
                                eFormG.patchValue(opParam.get(formInfo['valueName']));
                            } else {
                                this.logger.error('Error at handling Output ');
                                this.logger.error('Error in updating value to form --> ' + JSON.stringify(formInfo));
                                this.logger.error('Error in extracted form--> ' + eFormG);
                            }
                        }
                    });
                    txnContext['changeRef'].detectChanges();
                }
            }
        }
    }

}
