import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, NgModule, OnChanges, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Logger } from '../../../core/ui-components/logger/logger';
import { PickList } from '../../../modules/common/models/picklist.model';
import { PickListService } from '../../../modules/common/services/picklist.service';
import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { UiAmountModule } from '../amount';
import { UiCheckboxModule } from '../checkbox';
import { ClickOutSideModule } from '../directives/clickOutside.directive';
import { UiMiscModule } from '../misc-element/misc.component';
import { TooltipModule } from '../tooltip/index';
import { UtilsService } from '../utils/utils.service';


const noop = () => {
};

export const CUSTOM_DROPDOWN_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownComponent),
    multi: true
};

@Component({

    selector: 'drop-down',
    templateUrl: './dropdown.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CUSTOM_DROPDOWN_VALUE_ACCESSOR]
})

export class DropdownComponent implements ControlValueAccessor, AfterViewInit, AfterContentInit, OnChanges, OnDestroy, OnInit {
    @Input() miscType: string;
    @Input() miscSubType: string;
    @Input() productCode: string;
    @Input() param1: string;
    @Input() param2: string;
    @Input() param3: string;
    @Input() param4: string;
    @Input() lobCode: string;
    @Input() dropdownItems: any[] = [];
    @Input() multipleSelect = false;
    @Input() placeHolder = '';
    public innerValue;
    @Input() filteredItems: any[] = [];
    @Input() selectedItem = '';
    @Input() selectedItems: any[] = [];
    @Input() elementId = '';
    @Input() elementWidth: string;
    @Input() tooltipPlacement = 'right';
    @Input() tooltipTitle: string;
    placeHolderProxy = '';
    @Input() hideArrowFlag = false;
    @Input() showCodeFlag = false;
    @Input() pickListFlag = false;
    @Input() isCodeDesc = false;
    @Input() descControl: FormControl;
    @Input() mandatoryFlag = false;
    @Input() customFlag = false;
    @Input() dropdownClass = '';
    @Input() param3Info = '';
    @Input() changeId: string;
    @Input() elementValue: string;
    @Input() displayCodeAndDesc = false;
    @Input() displayOnClick = false;
    @Input() displayLoader = false;
    @Input() fieldTabId: any;
    @Input() typeAheadSearch = true;
    @Input() enableIndex = false;
    @Input() excluded = '';
    @Input() noFilter: boolean;
    @Input() index;
    @Input() parentIndex;
    @Input() superParentIndex;
    @Input() param1Control: FormControl;
    @Input() param2Control: FormControl;
    @Input() param3Control: FormControl;
    @Input() param4Control: FormControl;
    @Input() elementLabel: string;
    @Input() isLazyLoading: boolean = false;
    @Input() isAcceptExternalData: boolean = false;
    @Input() lazyLoadingOffsetValue: number = 5;
    @Input() initialItemsNumber: number = 7;
    @Input() useCheckBoxMultiSelect: boolean = false;
    @Input() displaySelectAllCheckBox: boolean = false;
    @Input() sharedValue: any = '';
    @Input() filterBy: any = 'CODEANDDESC';
    @Input() type: string;
    @Input() displayOnlyCode: boolean;
    @Input() isSort: boolean = true;


    itemSelectedFlag: boolean = false;
    focusIdx: any;
    selectedObject: any = ''; // contains whole selected object for single select dropdown
    tooltipShow = false;
    lazyLoader: boolean = false;
    public pattern = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    public allowlang;

    utils: UtilsService;
    eventHandler: EventService;
    // Placeholders for the callbacks which are later provided
    // by the Control Value Accessor
    public onTouchedCallback: () => void = noop;
    public onChangeCallback: (_: any) => void = noop;
    public item: string;
    multiIndex: number;
    readOnlyFlag = false;
    elementControl = new FormControl();
    inputPickList = new PickList();
    initalDropDownListLength = 1;
    _pickListService;
    loadingSub;
    invalidFlag: boolean;
    isTouchDevice: Boolean = false;
    emptyItems: Boolean = false;
    constructor(pickListService: PickListService, _utils: UtilsService, public _logger: Logger,
        public loaderConfigService: ConfigService, _eventHandler: EventService, public ref: ChangeDetectorRef, public ele: ElementRef) {
        this._pickListService = pickListService;
        this.utils = _utils;
        this.loadingSub = loaderConfigService;
        this.eventHandler = _eventHandler;
    }
    ngAfterContentInit() {
        this.tooltipShow = this.elementControl.valid;
    }

    ngOnInit() {
        this.forTocuchDevices();
    }
    forTocuchDevices(filterItem?) {
        try {
            if (this.isTouchDevice) {
                if (filterItem && this.multipleSelect) {
                    this.itemHover(filterItem);
                }
                if (filterItem && !this.multipleSelect) {
                    this.itemSelected(filterItem);
                }
                setTimeout(() => {
                    document.getElementById(this.elementId).blur();
                }, 10);
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    @HostListener('mouseleave')
    closeDropDown() {
        if (!this.elementControl.disabled) {

            if (this.multipleSelect) {
                this.itemHover(this.elementControl.value);
            } else {
                let item: any;
                if (this.isCodeDesc) {
                    if (this.showCodeFlag) {
                        item = this.elementControl.value;
                    } else if (this.elementControl.value) {
                        item = { 'code': '', 'desc': '' };
                        item.desc = this.descControl.value;
                        item.code = this.value;
                    } else {
                        item = '';
                    }
                } else {
                    item = this.elementControl.value;
                }
                if (item) {
                    this.itemSelected(item);
                } else {
                    this.descControl ? this.descControl.setValue('') : '';
                    this.elementControl.setValue('');
                    this.elementControl.updateValueAndValidity();
                    this.filteredItems = [];
                    this.writeValue('');
                }
            }
        } else {
            this.filteredItems = [];
        }
        this.focusIdx = false;
        let dropDownItemsInput = document.getElementById(this.elementId);
        // tslint:disable-next-line:no-unused-expression
        dropDownItemsInput ? dropDownItemsInput.blur.apply(dropDownItemsInput) : '';
    }
    ngAfterViewInit() {
        this.allowlang = this.loaderConfigService.get('allowLanguages');
        if (this.param1Control) {
            this.param1Control.valueChanges.subscribe(data => {
                if (data) {
                    this.dropdownItems = [];
                    this.filteredItems = [];
                }
            });
        }
        this.elementControl.valueChanges.subscribe(data => {
            if (this.elementControl.dirty) {
                this.searchItem(data);
            } else {
                this.invalidFlag = false;
            }
        });
        if (this.dropdownItems && this.dropdownItems.length) {
            this.initalDropDownListLength = this.dropdownItems.length;
        }
        // this.tooltipTitle = this.utils.getTranslated(this.tooltipTitle);
        // this.placeHolder = this.utils.getTranslated(this.placeHolder);
        if (!this.pickListFlag) {
            if (this.dropdownItems.length > 0) {
                for (let i = 0; i < this.dropdownItems.length; i++) {
                    this.dropdownItems[i].desc = this.utils.getTranslated(this.dropdownItems[i].desc);
                }
            }
        }
        if (!this.placeHolder) {
            this.placeHolder = '';
            this.placeHolderProxy = '';
        } else {
            this.placeHolderProxy = this.placeHolder;
        }

        this.eventHandler.validateTabSub.subscribe((data) => {
            let classNames: string = this.ele.nativeElement.className;
            if (this.fieldTabId === data['id']) {
                if (classNames && classNames.includes('ng-invalid')) {
                    this.invalidFlag = true;
                    this.ref.markForCheck();
                }
            }
        });
    }

    // get accessor
    get value(): any {
        return this.innerValue;
    };

    // set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    onTouched() {
        if (this.isTouchDevice) {
            this.filteredItems = [];
        }
        this.onTouchedCallback();
    }

    ngOnChanges(change?) {
        if (this.multipleSelect && (this.elementValue || this.elementValue === '') && this.elementValue.length !== this.selectedItems.length) {
            this.writeValue(this.elementValue);
            let arra: any[] = Array(this.elementValue);
            this.selectedItems = arra[0];

        }
        // commented for cascading filter
        /* if (change && ((this.param1 && this.param1 !== undefined) || (this.param1Control && this.param1Control['value'] !== undefined && this.param1Control.value))) {
            if (this.displayOnClick) {
                this.dropdownItems = [];
                this.getDropdownItems();
            }
        } */
        if (!this.multipleSelect && this.elementValue) {
            this.writeValue(this.elementValue);
        }
        if (this.elementControl.valid) {
            // tslint:disable-next-line:no-unused-variable
            let classNames: string = this.ele.nativeElement.className;
            this.invalidFlag = false;
        }

    }


    writeValue(value: any) {
        if (value) {
            this.innerValue = value;

            if (this.multipleSelect) {
                if (this.value) {
                    this.selectedItems = this.value;

                }

                if (this.selectedItems.length > 0) {
                    this.placeHolder = '';
                } else {
                    this.placeHolder = this.placeHolderProxy;
                }
            }
            if (!this.multipleSelect) {
                if (!this.isCodeDesc) {
                    if (value) {
                        this.selectedItem = value.desc;
                        this.elementControl.patchValue(this.selectedItem);
                        this.elementControl.updateValueAndValidity();
                    }
                } else if (this.isCodeDesc) {
                    this.selectedItem = this.descControl.value ? this.descControl.value : value;
                    this.elementControl.patchValue(this.selectedItem);
                }
                if (this.showCodeFlag) {
                    this.selectedItem = value.code;
                    this.elementControl.patchValue(this.selectedItem);
                    this.elementControl.updateValueAndValidity();
                }
            }
        } else {
            if (this.multipleSelect) {
                this.selectedItems = [];
            } else {
                this.selectedItem = '';
            }
            this.value = '';
        }
        if (!this.placeHolder) {
            this.placeHolder = '';
        }

        this.ref.markForCheck();
    }

    onInput(event) {
        let target = event.srcElement || event.target;
        if (!target.value) {
            this.value = '';
            this.elementControl.setValue('');
            this.descControl ? this.descControl.setValue('') : '';
            this.eventHandler.setEvent('change', this.changeId, this.value);
        }
        if (this.allowlang === 'en') {
            if (!this.pattern.test(target.value)) {
                target.value = '';
            }
        }
    }



    // From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }


    // calls when typed
    searchItem(searchToken: string) {
        if (searchToken) {
            this.filteredItems = [];
            this.dropdownItems = this.dropdownItems;
            if (!this.itemSelectedFlag) {
                let j = 0;
                if (this.isLazyLoading) {
                    this.inputPickList.skipResult = 0;
                    this.inputPickList.maxResult = this.initialItemsNumber;
                    if (this.filterBy === 'CODE') {
                        this.inputPickList.code = searchToken;
                    } else if (this.filterBy === 'DESC') {
                        this.inputPickList.desc = searchToken;
                    } else if (this.filterBy === 'CODEANDDESC') {
                        this.inputPickList.code = searchToken;
                        this.inputPickList.desc = searchToken;
                    }
                    this.setPickList();
                }
                if (this.dropdownItems) {
                    if (!this.typeAheadSearch) {
                        for (let i = 0; i < this.dropdownItems.length; i++) {
                            if (this.dropdownItems[i].desc !== '' && this.dropdownItems[i].code !== '' && searchToken !== '') {
                                let descIndex: boolean = false;
                                if (this.dropdownItems[i].code.toString().toLowerCase().includes(searchToken.toString().toLowerCase()) || this.dropdownItems[i].desc.toString().toLowerCase().includes(searchToken.toString().toLowerCase())) {
                                    descIndex = true;
                                }
                                // var codeIndex = this.dropdownItems[i].code.toString().toLowerCase().indexOf(searchToken.toString().toLowerCase());
                                if (descIndex) {
                                    this.filteredItems[j] = { code: '', desc: '' };
                                    this.filteredItems[j].code = this.dropdownItems[i].code;
                                    this.filteredItems[j].desc = this.dropdownItems[i].desc;
                                    j++;
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < this.dropdownItems.length; i++) {
                            if (this.dropdownItems[i].desc !== '' && this.dropdownItems[i].code !== '' && searchToken !== '') {
                                let descIndex = this.dropdownItems[i].desc.toString().toLowerCase().indexOf(searchToken.toString().toLowerCase());
                                // var codeIndex = this.dropdownItems[i].code.toString().toLowerCase().indexOf(searchToken.toString().toLowerCase());
                                if (descIndex === 0) {
                                    this.filteredItems[j] = { code: '', desc: '' };
                                    this.filteredItems[j].code = this.dropdownItems[i].code;
                                    this.filteredItems[j].desc = this.dropdownItems[i].desc;
                                    j++;
                                }
                            }
                        }
                    }
                    if (this.noFilter === false) {
                        if (this.filteredItems && this.filteredItems.length > 5) {
                            if (this.isSort) {
                                this.filteredItems.sort(this.compareDropdownItems);
                            }
                            this.filteredItems = this.filteredItems.slice(0, 5);
                        }
                    } else {
                        if (!this.isLazyLoading && this.isSort)
                            this.filteredItems.sort(this.compareDropdownItems);
                    }
                }
                if (this.filteredItems.length === 0 && this.isAcceptExternalData) {
                    if (this.showCodeFlag) { this.filteredItems[0] = { code: searchToken, desc: searchToken } }
                    else { this.filteredItems[0] = { code: ' ', desc: searchToken } };
                }
            }
        } else {
            this.filteredItems = this.dropdownItems;
            if (this.noFilter === false) {
                if (this.filteredItems && this.filteredItems.length > 5) {
                    if (this.isSort) {
                        this.filteredItems.sort(this.compareDropdownItems);
                    }
                    this.filteredItems = this.filteredItems.slice(0, 5);
                }
            } else {
                this.filteredItems = this.dropdownItems;
                if (!this.isLazyLoading && this.isSort)
                    this.filteredItems.sort(this.compareDropdownItems);
            }

        }
    }
    compareDropdownItems(item1, item2) {
        if (item1.desc && item2.desc) {
            let _item1 = item1.desc;
            let _item2 = item2.desc;
            _item1 = parseInt(item1.desc.toLowerCase(), 10);
            _item2 = parseInt(item2.desc.toLowerCase(), 10);
            if (isNaN(_item1) && isNaN(_item2)) {
                if (item1.desc < item2.desc) {
                    return -1;
                } else if (item1.desc > item2.desc) {
                    return 1;
                }
                return 0;
            }
            return _item1 - _item2;
        }

    }
    // called for click
    getFilterList(dropDownitems) {
        this.dropdownItems = dropDownitems ? dropDownitems : [];
        if (!this.multipleSelect) {
            this.filteredItems = this.dropdownItems;
            this.filteredItems = this.filteredItems.filter(element => {
                if (element['desc'] === this.selectedItem || (this.excluded && this.excluded.split(',').includes(element['code']))) {
                    return false;
                } else {
                    return true;
                }
            });
        } else {
            if (this.selectedItems) {
                this.multiIndex = this.selectedItems.length;

            }
            if (this.multiIndex > -1) {
                this.multiIndex = this.selectedItems.length;
            } else {
                this.multiIndex = 0;
            }

            this.filteredItems = this.dropdownItems;
            let valueList: Array<any> = [];
            if (this.selectedItems && this.selectedItems.length > 0) {
                valueList = this.selectedItems;
            } else {
                valueList = this.elementControl.value;
            }
            if (valueList !== null && valueList.length > 0) {
                this.filteredItems = this.filteredItems.filter(element => {
                    let ind = valueList.findIndex(ele => {
                        if (element['code'] === ele['code']) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (ind > -1) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        }
        if (this.noFilter === false) {
            if (this.filteredItems && this.filteredItems.length > 5) {
                if (this.isSort) {
                    this.filteredItems.sort(this.compareDropdownItems);
                }
                this.filteredItems = this.filteredItems.slice(0, 5);
            }
        } else {
            if (!this.isLazyLoading && this.isSort) {
                this.filteredItems.sort(this.compareDropdownItems);
            }
        }
        this.placeHolder = '';
        let height = window.innerHeight;
        if (document.getElementById(this.elementId)) {
            let clientTop = document.getElementById(this.elementId).getBoundingClientRect();
            if (this.noFilter === false) {
                let dropdownHeight = 34 * this.filteredItems.length;

                if (clientTop.top + dropdownHeight >= height) {
                    window.scrollTo(window.pageXOffset, window.pageYOffset + dropdownHeight);
                }
            }
        }
        if (this.isLazyLoading) {
            this.initalDropDownListLength = this.dropdownItems.length;
        }
    }
    getDropdownItems() {
        if (!this.elementControl.disabled) {
            if (this.isLazyLoading && this.multipleSelect) {
                this.dropdownItems = [];
            }
            this.dropdownItems = this.dropdownItems ? this.dropdownItems : [];
            if (this.pickListFlag && this.dropdownItems.length <= this.initalDropDownListLength) {
                // let dropdownValus;
                // let outputData = [];
                this.inputPickList.auxType = this.miscType;
                if (this.miscSubType) {
                    this.inputPickList.auxSubType = this.miscSubType;
                }
                if (this.productCode) {
                    this.inputPickList.productCode = this.productCode;
                }
                if (this.lobCode) {
                    this.inputPickList.lobCode = this.lobCode;
                }
                // if (this.param1) {
                this.inputPickList.param1 = (this.param1Control && this.param1Control['value']) ? this.param1Control.value : this.param1 ? this.param1 : '';
                // }
                // if (this.param2) {
                this.inputPickList.param2 = (this.param2Control && this.param2Control['value']) ? this.param2Control.value : this.param2 ? this.param2 : '';
                // }
                // if (this.param3) {
                this.inputPickList.param3 = (this.param3Control && this.param3Control['value']) ? this.param3Control.value : this.param3 ? this.param3 : '';
                // }
                // if (this.param4) {
                this.inputPickList.param4 = (this.param4Control && this.param4Control['value']) ? this.param4Control.value : this.param4 ? this.param4 : '';
                if (this.isLazyLoading) {
                    this.inputPickList.skipResult = 0;
                    this.inputPickList.maxResult = this.initialItemsNumber;
                    if (this.selectedItem || this.selectedItems.length > 0) {
                        if (this.multipleSelect) {
                            this.inputPickList.maxResult = this.selectedItems.length + this.initialItemsNumber + 1;
                        } else {
                            this.inputPickList.maxResult = this.initialItemsNumber + 1;
                        }
                    }
                    this.filteredItems = [];
                    this.dropdownItems = [];
                    this.inputPickList.code = '';
                    this.inputPickList.desc = '';
                }
                this.setPickList();

            } else {
                this.getFilterList(this.dropdownItems);
            }
            this.placeHolder = '';
        }
    }

    selectAll() {
        for (let i = 0; i < this.dropdownItems.length; i++) {
            this.selectedItems[i] = this.dropdownItems[i];
        }
        this.placeHolder = '';
        this.filteredItems = [];
        this.clearMulti();
    }

    itemHover(item: any) {
        if (this.dropdownItems.length > 0) {
        if (item && this.dropdownItems) {
            this.selectedItems[this.multiIndex] = item;
            this.placeHolder = '';
            this.clearMulti();
        } else {
            this.elementControl.setValue('');
            this.elementControl.updateValueAndValidity();
            this.filteredItems = [];
        }
        this.emptyItems = this.selectedItems.length === this.dropdownItems.length;
        } else {
			this.emptyItems = false;
		}
    }

    itemSelected(itemObject: any) {
        try {
            this.itemSelectedFlag = false;
            let hasCodeFlag = itemObject.code ? true : false;
            let item = itemObject.desc ? itemObject.desc : itemObject;
            let isChangeEvent = false;
            let value = this.isCodeDesc ? this.descControl.value : (this.showCodeFlag ? this.elementControl.value : '');
            isChangeEvent = value === item ? true : false;
            if (this.dropdownItems) {
                for (let i = 0; i < this.dropdownItems.length; i++) {
                    if (item) {
                        if (this.showCodeFlag) {
                            if (item === this.dropdownItems[i].desc || item === this.dropdownItems[i].code) {
                                this.selectedItem = this.dropdownItems[i].code;
                                this.selectedObject = this.dropdownItems[i];
                                this.value = this.dropdownItems[i];
                                this.itemSelectedFlag = true;
                                this.elementControl.setValue(this.selectedItem);
                                this.filteredItems = [];
                                break;
                            } else if (item !== this.dropdownItems[i].desc || item !== this.dropdownItems[i].code) {
                                if (item.desc === this.dropdownItems[i].desc || item.code === this.dropdownItems[i].code || typeof (item) === 'object') {
                                    break;
                                } else {
                                    this.elementControl.setValue('');
                                    this.elementControl.updateValueAndValidity();
                                    this.filteredItems = [];
                                }
                            }

                        } else if (hasCodeFlag && itemObject.code === this.dropdownItems[i].code && item === this.dropdownItems[i].desc) {
                            if (this.isCodeDesc) {
                                this.value = this.dropdownItems[i].code;
                                this.selectedObject = this.dropdownItems[i];
                                this.descControl.patchValue(this.dropdownItems[i].desc);
                                this.descControl.updateValueAndValidity();
                            } else {
                                this.value = this.dropdownItems[i];
                                this.selectedObject = this.dropdownItems[i];
                            }
                            this.selectedItem = this.dropdownItems[i].desc;
                            this.itemSelectedFlag = true;
                            this.elementControl.setValue(this.selectedItem);
                            this.filteredItems = [];
                            break;
                        } else if (!hasCodeFlag && item === this.dropdownItems[i].desc) {
                            if (this.isCodeDesc) {
                                this.value = this.dropdownItems[i].code;
                                this.selectedObject = this.dropdownItems[i];
                                this.descControl.patchValue(this.dropdownItems[i].desc);
                                this.descControl.updateValueAndValidity();
                            } else {
                                this.value = this.dropdownItems[i];
                                this.selectedObject = this.dropdownItems[i];
                            }
                            this.selectedItem = this.dropdownItems[i].desc;
                            this.itemSelectedFlag = true;
                            this.elementControl.setValue(this.selectedItem);
                            this.filteredItems = [];
                            break;
                        } else if (item !== this.dropdownItems[i].desc) {
                            this.elementControl.setValue('');
                            this.elementControl.updateValueAndValidity();
                            this.filteredItems = [];
                            if (this.isAcceptExternalData && item) {
                                this.selectedItem = undefined;
                                this.selectedObject = undefined;
                            }
                        }
                    } else {
                        this.elementControl.setValue('');
                        this.elementControl.updateValueAndValidity();
                        this.filteredItems = [];
                        this.selectedObject = '';
                    }
                }
                if (this.isAcceptExternalData && !this.selectedObject && !this.selectedItem) {
                    if (this.isCodeDesc) {
                        item = { code: item, desc: item };
                        this.value = item['code'];
                        this.selectedObject = item;
                        this.descControl.patchValue(item['desc']);
                        this.descControl.updateValueAndValidity();
                    } else {
                        item = { code: '', desc: item };
                        this.value = item['desc'];
                        this.selectedObject = item;
                    }
                    if (this.showCodeFlag) {
                        this.selectedItem = item['code'];
                        this.selectedObject = item['desc'];
                        this.value = item['desc'];
                        this.elementControl.setValue(this.selectedItem);
                    } else {
                        this.selectedItem = item['desc'];
                        this.elementControl.setValue(this.selectedItem);
                    }
                    this.filteredItems = [];
                }
                if (!isChangeEvent) {
                    // tslint:disable-next-line:curly
                    if (!this.enableIndex) {
                        if (this.index !== undefined && this.index !== null) {
                            this.eventHandler.setEvent('change', this.changeId, { 'index': this.index, 'value': this.value, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex, sharedValue: this.sharedValue });
                        } else {
                            this.eventHandler.setEvent('change', this.changeId, this.value);
                        }
                    }
                    else {
                        if (typeof this.dropdownItems !== 'undefined') {
                            let index = this.getCodeIndexUtility(this.value);
                            this.eventHandler.setEvent('change', this.changeId, { 'index': index, 'value': this.value, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex, sharedValue: this.sharedValue });
                        }
                    }
                }

            }
            this.ref.markForCheck();
        } catch (e) {
            this._logger.error("Formcontrol is not defined", e);
            this.loadingSub.setLoadingSub('no');
        }
    }

    getCodeIndexUtility(code): number {
        for (let i = 0; i < this.dropdownItems.length; i++) {
            // tslint:disable-next-line:curly
            if (code === this.dropdownItems[i].code) return i;
        }
    }
    // called for onblur
    unselectItem(item: any) {
        this.emptyItems = false;
        let pushFlag = false;
        for (let i = 0; i < this.selectedItems.length; i++) {
            if (this.selectedItems[i].desc === item.desc) {
                if (this.selectedItems.length > 0) {
                    this.multiIndex = this.selectedItems.length - 1;
                }
                this.selectedItems.splice(i, 1);
                break;
            }
        }
        if (this.dropdownItems && this.dropdownItems.length > 0) {
            for (let j = 0; j < this.dropdownItems.length; j++) {
                if (this.dropdownItems[j].desc === item.desc) {
                    pushFlag = false;
                    break;
                } else {
                    pushFlag = true;
                }
            }
        } else {
            pushFlag = true;
        }
        if (pushFlag && this.dropdownItems) {
            this.dropdownItems.push(item);
        }
        this.filteredItems = [];
        if (this.selectedItems.length < 1) {
            this.placeHolder = this.placeHolderProxy;
            this.value = '';
        }
        // tslint:disable-next-line:curly
        if (!this.enableIndex)
            if (this.index !== undefined && this.index !== null) {
                this.eventHandler.setEvent('change', this.changeId, { 'index': this.index, 'value': this.selectedItems, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex, sharedValue: this.sharedValue });
            } else {
                this.eventHandler.setEvent('change', this.changeId, this.selectedItems);
            }
        else {
            if (typeof this.dropdownItems !== 'undefined') {
                let index = this.getCodeIndexUtility(this.value);
                this.eventHandler.setEvent('change', this.changeId, { 'index': index, 'value': this.selectedItems, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex, sharedValue: this.sharedValue });
            }
        }
    }

    clearItem(item) {
        if (item) {
            this.elementControl.setValue('');
            this.value = '';
            this.selectedItem = '';
            this.itemSelectedFlag = false;
        }

    }
    clearMulti() {
        if (this.selectedItems.length > 0) {
            this.elementControl.setValue('');
            this.elementControl.updateValueAndValidity();
            // tslint:disable-next-line:no-unused-variable
            let selectedItemsIndex = this.selectedItems.length - 1;
            this.value = this.selectedItems;
            // commented cause on clear in activity search , previously  selected values are not shown.
            /*  for (var i = 0; i < this.dropdownItems.length; i++) {
                  if (this.selectedItems[selectedItemsIndex].desc === this.dropdownItems[i].desc) {
                      this.dropdownItems.splice(i, 1);
                      this.elementControl.setValue('');
                      this.placeHolder = '';
                  }
              }
              this.multiIndex = this.selectedItems.length - 1;*/

        } else {
            this.elementControl.setValue('');
            this.elementControl.updateValueAndValidity();
            this.filteredItems = [];
        }

        this.filteredItems = [];
        this.eventHandler.setEvent('change', this.changeId, this.selectedItems);
    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.elementControl.disable();
            this.placeHolder = '';
            this.readOnlyFlag = true;
            this.hideArrowFlag = true;
        } else {
            this.elementControl.enable();
            this.readOnlyFlag = false;
            this.hideArrowFlag = false;
        }
    }
    changeInSingle(item) {
        if (item.length < 1) {
            this.elementControl.setValue('');
            this.elementControl.updateValueAndValidity();
            this.filteredItems = [];
            this.value = '';
            this.selectedItem = '';
        }
    }

    ngOnDestroy() {
        this.eventHandler.validateTabSub.observers.pop();
    }

    handleKeyDown(direction) {
        switch (direction) {
            case 'down':
                if (!this.focusIdx && this.focusIdx !== 0) {
                    if (this.isLazyLoading) {
                        if (!(this.filteredItems.length > 0)) {
                            this.getDropdownItems();
                        }
                    } else {
                        this.getDropdownItems();
                    }
                    this.focusIdx = 0;
                } else {
                    if ((this.filteredItems.length - 1) > this.focusIdx) {
                        this.focusIdx = this.focusIdx + 1;
                    }
                    if (this.focusIdx > (this.filteredItems.length - 1)) {
                        this.focusIdx = this.focusIdx + 1;
                        this.focusIdx = this.focusIdx - this.filteredItems.length - 1;
                    }
                }
                break;
            case 'up':
                if (this.focusIdx && this.focusIdx > 0) {
                    this.focusIdx = this.focusIdx - 1;
                }
                break;
            case 'enter':
                if (this.focusIdx || this.focusIdx > -1) {
                    if (this.multipleSelect) {
                        this.itemHover(this.filteredItems[this.focusIdx]);
                    } else {
                        this.itemSelected(this.filteredItems[this.focusIdx]['desc']);
                    }
                    this.closeDropDown();
                }
                break;
            case 'tab':
                if (this.multipleSelect) {
                    this.itemHover(this.filteredItems[0]);
                } else {
                    this.itemSelected(this.filteredItems[0]['desc']);
                }
                this.closeDropDown();
                break;
            default:
                break;
        }
        if (this.focusIdx || this.focusIdx > -1) {
            if (document.getElementById(this.focusIdx + 'dropdown')) {
                document.getElementById(this.focusIdx + 'dropdown').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }
        }
    }

    // called for  on scroll of dropdownitems
    scrollCallled(event) {
        if (this.isLazyLoading) {
            let srcelement = event.srcElement || event.target;
            let scrolltop, elementHeight, scrollHeight;
            if (srcelement) {
                scrolltop = srcelement.scrollTop;
                elementHeight = srcelement.clientHeight;
                scrollHeight = srcelement.scrollHeight;
                if ((scrolltop + elementHeight >= scrollHeight)) {
                    this.lazyLoader = true;
                    this.inputPickList.maxResult = this.lazyLoadingOffsetValue;
                    this.inputPickList.skipResult = this.filteredItems.length;
                    if (this.selectedItem || this.selectedItems.length > 0) {
                        if (this.multipleSelect) {
                            this.inputPickList.skipResult = this.filteredItems.length + this.selectedItems.length;
                        } else {
                            this.inputPickList.skipResult = this.filteredItems.length;
                        }
                    }
                    this.setPickList(true);
                }
            }
        }
    }
    setPickList(isFromScroll: boolean = false) {
        // function to get  picklist...
        let outputData = [];
        let dropdownValus = this._pickListService.getPickList(this.inputPickList, this.displayLoader);
        dropdownValus.subscribe(
            (dataVal) => {
                if (dataVal.error !== null && dataVal.error !== undefined && dataVal.error.length >= 1) {
                    // TODO error Handling
                } else {
                    if (dataVal && dataVal.length > 0) {
                        let dataListData = [];
                        let index = 0;
                        if (isFromScroll) {
                            // for appending new results to filtered items after scroll end
                            dataListData = this.filteredItems;
                            index = this.filteredItems.length;
                        }
                        let dataList;
                        for (let i = 0; i < dataVal.length; i++) {
                            dataList = { code: '', desc: '', key: '', multiLevelMapping: '' };
                            dataList.code = dataVal[i].code;
                            dataList.key = dataVal[i].code;
                            dataList.desc = dataVal[i].desc;
                            dataList.multiLevelMapping = dataVal[i].multiLevelMapping ? dataVal[i].multiLevelMapping : '';
                            dataListData[index] = dataList;
                            index++;
                        }
                        outputData = dataListData;
                        this.initalDropDownListLength = this.dropdownItems.length;
                        this.loadingSub.setLoadingSub('no');
                        this.getFilterList(outputData);
                    }
                    this.lazyLoader = false;
                    this.ref.markForCheck();
                }
            },
            (error) => {
                this._logger.error(error);
                this.loadingSub.setLoadingSub('no');
            }
        );
    }
}

export const UI_DROPDOWN_DIRECTIVES = [DropdownComponent];
@NgModule({
    declarations: UI_DROPDOWN_DIRECTIVES,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TooltipModule, ClickOutSideModule, UiCheckboxModule, UiMiscModule, UiAmountModule],
    exports: UI_DROPDOWN_DIRECTIVES
})
export class UiDropdownModule { }


