import { Injectable } from '@angular/core';

import { PickListService } from '../../../modules/common/services/picklist.service';
import { PickList } from '../../../modules/common/models/picklist.model';
import { ConfigService } from '../../services/config.service';
import { Logger } from '../logger';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from '@adapters/packageAdapter';

@Injectable()
export class PickListHelper {
    initalDropDownListLength: number = 1;
    inputPickList = new PickList();
    displayLoader: boolean = false;
    paramControls: FormGroup = new FormGroup({});
    param1Control: FormControl;
    param2Control: FormControl;
    param3Control: FormControl;
    param4Control: FormControl;
    InputArrayLoaded: any = new Subject();
    constructor(public config: ConfigService,
        public pickListService: PickListService,
        public logger: Logger
    ) {
    }

    getAUXData(inputArray, miscType, miscSubType?: string, productCode?: string, param1?, param2?, param3?, param4?, param1Control?, param2Control?, param3Control?, param4Control?) {
        this.param1Control = param1Control;
        this.param2Control = param2Control;
        this.param3Control = param3Control;
        this.param4Control = param4Control;
        if (this.param1Control) {
            this.param1Control.valueChanges.subscribe(data => {
                if (data) {
                    inputArray = [];
                    this.populateInputByAUXData(inputArray, miscType, miscSubType, productCode, param1, param2, param3, param4);
                }
            });
        }
        if (this.param2Control) {
            this.param2Control.valueChanges.subscribe(data => {
                if (data) {
                    inputArray = [];
                    this.populateInputByAUXData(inputArray, miscType, miscSubType, productCode, param1, param2, param3, param4);
                }
            });
        }
        if (this.param3Control) {
            this.param3Control.valueChanges.subscribe(data => {
                if (data) {
                    inputArray = [];
                    this.populateInputByAUXData(inputArray, miscType, miscSubType, productCode, param1, param2, param3, param4);
                }
            });
        }
        if (this.param4Control) {
            this.param4Control.valueChanges.subscribe(data => {
                if (data) {
                    inputArray = [];
                    this.populateInputByAUXData(inputArray, miscType, miscSubType, productCode, param1, param2, param3, param4);
                }
            });
        }
        this.populateInputByAUXData(inputArray, miscType, miscSubType, productCode, param1, param2, param3, param4);
    }

    populateInputByAUXData(inputArray, miscType, miscSubType: string, productCode: string, param1, param2, param3, param4) {
        if (inputArray.length <= this.initalDropDownListLength) {
            let dropDownValues;
            this.inputPickList.auxType = miscType;
            if (miscSubType) {
                this.inputPickList.auxSubType = miscSubType;
            }
            if (productCode) {
                this.inputPickList.productCode = productCode;
            }
            this.inputPickList.param1 = (this.param1Control && this.param1Control['value']) ? this.param1Control.value : param1 ? param1 : '';
            this.inputPickList.param2 = (this.param2Control && this.param2Control['value']) ? this.param2Control.value : param2 ? param2 : '';
            this.inputPickList.param3 = (this.param3Control && this.param3Control['value']) ? this.param3Control.value : param3 ? param3 : '';
            this.inputPickList.param4 = (this.param4Control && this.param4Control['value']) ? this.param4Control.value : param4 ? param4 : '';
            dropDownValues = this.pickListService.getPickList(this.inputPickList, this.displayLoader);
            dropDownValues.subscribe(
                (dataVal) => {
                    if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
                        // TODO error Handling
                    } else {
                        let dataList, inputArrayBuffer = [];
                        for (let i = 0; i < dataVal.length; i++) {
                            dataList = { value: '', label: '' };
                            dataList.value = dataVal[i].code;
                            dataList.label = dataVal[i].desc;
                            inputArrayBuffer.push(dataList);
                        }
                        inputArray = inputArrayBuffer;
                        this.initalDropDownListLength = inputArray.length;
                        this.InputArrayLoaded.next(inputArray);
                    }
                    if (this.displayLoader) {
                        this.config.setLoadingSub('no');
                    }
                },
                (error) => {
                    this.logger.error(error);
                }
            );
        }
    }

}

export const PICK_LIST_HELPER_SERVICES = [
    PickListHelper
];