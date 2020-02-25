export class PickList {
    auxType: string;
    auxSubType: string;
    productCode: string;
    param1: string;
    param2: string;
    param3: string;
    param4: string;
    param5: string;
    isExactSearch: string;
    code: string;
    desc: string;
    skipResult: number;
    maxResult: number;
    lobCode: string;
    retParam1: string;
    retParam2: string;
    retParam3: string;
    retParam4: string;
    retParam5: string;
    retParam6: string;
    constructor(obj?: any) {
        this.auxType = obj && obj.auxType || '';
        this.auxSubType = obj && obj.auxSubType || '';
        this.productCode = obj && obj.productCode || '';
        this.param1 = obj && obj.param1 || '';
        this.param2 = obj && obj.param2 || '';
        this.param3 = obj && obj.param3 || '';
        this.param4 = obj && obj.param4 || '';
        this.param5 = obj && obj.param5 || '';
        this.isExactSearch = obj && obj.isExactSearch || '';
        this.code = obj && obj.code || '';
        this.desc = obj && obj.desc || '';
        this.skipResult = obj && obj.skipResult || 0;
        this.maxResult = obj && obj.maxResult || 1000;
        this.lobCode = obj && obj.lobCode || '';
        this.retParam1 = obj && obj.retParam1 || '';
        this.retParam2 = obj && obj.retParam2 || '';
        this.retParam3 = obj && obj.retParam3 || '';
        this.retParam4 = obj && obj.retParam3 || '';
        this.retParam5 = obj && obj.retParam3 || '';
        this.retParam6 = obj && obj.retParam3 || '';
    }
}
