import { DefaultPolicyModel } from '../services/defaultModel.service';

export class TabInfo {
    _tabInfoForm: any;
    constructor(public quoteModelInstance: DefaultPolicyModel) {
        this._tabInfoForm = this.quoteModelInstance._formBuilderInstance;
    }
    getTabInfoModel() {
        return this._tabInfoForm.group({
            headerContentInfo : this._tabInfoForm.array([
                this.getHeaderContentInfo(),
            ]),
            currentIndex: [0]
        });
    }

    getHeaderContentInfo() {
        return this._tabInfoForm.group({
            label: [''],
            data: ['']
        });
    }
}