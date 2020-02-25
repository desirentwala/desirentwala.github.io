import { DefaultClaimModel } from '../services/defaultClaimmodel';

export class ClaimCodeReserveInfo {
    claimCodeReserveInfo;
    constructor(public claimModelInstance: DefaultClaimModel) {
        this.claimCodeReserveInfo = this.claimModelInstance._formBuilderInstance;
    }
    getClaimCodeReserveInfoModel() {

        return this.claimCodeReserveInfo.group({
            claimCode: [''],
            sequence: [''],
            claimCodeType: [''],
            claimCodeDesc: [''],
            currencyCode: [''],
            currencyCodeDesc: [''],
            rate: [''],
            key: [''],
            claimCodeReserveAllocationList: ['']
        });
    }
}