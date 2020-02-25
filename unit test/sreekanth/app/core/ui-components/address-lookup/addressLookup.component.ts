import { QuotService } from '../../../modules/transaction/services/quote.service';
import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { ModalModule } from '../modal';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiButtonModule } from '../button/index';
import { UiTextBoxModule } from '../textbox/textbox.component';
import { UiMiscModule } from '../misc-element/misc.component';

export class TableInfo {
    mapping: string;
    header: string;
}

@Component({

    selector: 'address-lookup',
    templateUrl: './addressLookup.html'
})

export class AddressLookupComponent {
    @Input() placeHolder: string = ' ';
    @Input() disabledFlag: boolean;
    @Input() textAlign: string = '';
    @Input() elementId: string;
    @Input() buttonText: string;
    @Input() maxLength: string;
    @Input() tableData: string[];
    // mappingList = ['slNo', 'buildingName', 'estateName', 'blockDescriptor', 'blockDescriptorPrecedenceIndicator', 'blockNo', 'district', 'buildingNo', 'streetName', 'region'];
    // headerList = ['NCPLabel.slNo', 'NCPLabel.buildingName', 'NCPLabel.estateName', 'NCPLabel.blockDescriptor', 'NCPLabel.blockDescriptorPrecedenceIndicator', 'NCPLabel.blockNo', 'NCPLabel.district', 'NCPLabel.buildingNo', 'NCPLabel.streetName', 'NCPLabel.region'];
    mappingList = ['appUnitNumber', 'blockNumber', 'address1', 'address2'];
    headerList = ['NCPLabel.apt/UnitNumber', 'NCPLabel.building/Block/HouseNumber', 'NCPLabel.streetName', 'NCPLabel.areaName']
    rotateFlag: boolean = false;
    addressLookUpModal = false;
    public utils;
    eventHndler: EventService;
    element;
    tableDetails: TableInfo[] = [];
    columnsList: TableInfo[] = [];
    tableDataReceived = [];
    addressKey = '';
    serviceInput = { 'addressKey': '', 'policyNo': '' };
    policyNo = '';
    addressModal: boolean = false;
    modalTitle;
    invalidFlag;
    text;
    constructor(_utils: UtilsService,
        _eventHandler: EventService,
        public config: ConfigService,
        public quoteService: QuotService,
        public changeRef: ChangeDetectorRef) {
        this.utils = _utils;
        this.eventHndler = _eventHandler;
        this.columnsList = [];
        let tableLength = this.mappingList.length;
        for (let i = 0; i < tableLength; i++) {
            this.columnsList.push({ header: this.headerList[i], mapping: this.mappingList[i] });
        }
        this.tableDetails = this.columnsList;
    }
    getAddress() {
        this.policyNo = this.config.getCustom('policyNo');
        this.serviceInput.addressKey = this.addressKey;
        this.serviceInput.policyNo = this.policyNo;
        let addressLookUpResponse = this.quoteService.getpostalCodeRefreshValues(this.serviceInput);
        addressLookUpResponse.subscribe((addressData) => {
            if (addressData.error) {
                this.eventHndler.setEvent('change', 'addressErrorId', addressData);
                this.config.setLoadingSub('no');
            } else if (!addressData) {
                this.addressModal = true;
                this.config.setLoadingSub('no');
                this.changeRef.detectChanges();
            }
            else if (addressData || addressData.length > 0) {
                this.tableDataReceived = addressData;
                this.config.setLoadingSub('no');
                this.addressModal = true;
                this.changeRef.detectChanges();
            }
        });
    }
    addressSelected(object) {
        this.addressModal = false;
        this.eventHndler.setEvent('click', 'adresslookUpId', object);
    }
}
@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, ModalModule, UiTextBoxModule, UiButtonModule, UiMiscModule],
    exports: [SharedModule, AddressLookupComponent],
    declarations: [AddressLookupComponent]
})
export class AddressLookUpModule { }