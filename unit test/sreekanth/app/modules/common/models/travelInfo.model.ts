import {DefaultPolicyModel} from '../services/defaultModel.service';

export class TravelInfo {
    _travelInfoForm;
    constructor(public defaultModelService: DefaultPolicyModel) {
        this._travelInfoForm = this.defaultModelService._formBuilderInstance;
    }

    getTravelInfoModel() {
        return this._travelInfoForm.group({
            startDate: [''],
            endDate: [''],
            travellingToCode: [''],
            travellingToDesc: [''],
            seqNo: [''],
            key: ['']
        });
    }
}