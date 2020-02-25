
export class FilterModel {
    public filterModel = {
        'clientName': '',
        'quoteNo': '',
        'clientPhoneNo': '',
        'clientEmail': '',
        'product': null,
        'status': null,
        'quoteExpiringInDays': '',
        'startIndex': '0',
        'maxRecords': '5',
        'policyNo': '',
        'policyExpiringInDays': '',
        'isNotificationFlag': false,
        'isPolicyOrQuote': 'QT',
        'claimNo': '',
        'lossDate': '',
        'noticeDateFrom': '',
        'isSEOSearchFlag': false,
        'filterString': '',
        'ownTransaction': true,
        'subOrdinateUser': '',
        'userGroupCode': '',
        'statusDesc': '',
        'sharedBy': '',
        'customerID': '',
        'sharedBySuperUser': false,
        'sharedByUser': false,
        'txnType':'',
		'vehicleRegNo':'',
		'selectAllWithSamePartyId':false,
        'isHierarchySearch':false

    };
    getfilterModel() {
        return this.filterModel;
    }

    setfilterModel(obj: any) {

        this.filterModel.clientName = obj && obj.clientName || '';
        this.filterModel.quoteNo = obj && obj.quoteNo || '';
        this.filterModel.clientPhoneNo = obj && obj.clientPhoneNo || '';
        this.filterModel.clientEmail = obj && obj.clientEmail || '';
        this.filterModel.product = obj && obj.product || null;
        this.filterModel.status = obj && obj.status || null;
        this.filterModel.quoteExpiringInDays = obj && obj.quoteExpiringInDays;
        this.filterModel.startIndex = obj && obj.startIndex || '0';
        this.filterModel.maxRecords = obj && obj.maxRecords || '5';
        this.filterModel.policyNo = obj && obj.policyNo || '';
        this.filterModel.policyExpiringInDays = obj && obj.policyExpiringInDays;
        this.filterModel.isNotificationFlag = obj && obj.isNotificationFlag || false;
        this.filterModel.isPolicyOrQuote = obj && obj.isPolicyOrQuote || 'QT';
        this.filterModel.isSEOSearchFlag = obj && obj.isSEOSearchFlag || false;
        this.filterModel.filterString = obj && obj.filterString || '';
        this.filterModel.ownTransaction = obj && obj.ownTransaction || true;
        this.filterModel.userGroupCode = obj && obj.userGroupCode || [];
        this.filterModel.subOrdinateUser = obj && obj.subOrdinateUser || [];
        this.filterModel.sharedBy = obj && obj.sharedBy || '';
        this.filterModel.sharedBySuperUser = obj && obj.sharedBySuperUser || false;
        this.filterModel.sharedByUser = obj && obj.sharedByUser || false;
        this.filterModel.txnType = obj && obj.txnType || '';
		this.filterModel.vehicleRegNo = obj && obj.vehicleRegNo || '';
        this.filterModel.selectAllWithSamePartyId = obj && obj.selectAllWithSamePartyId|| false;
        this.filterModel.isHierarchySearch = obj && obj.isHierarchySearch|| false;
    }
    resetfilterModel() {
        this.filterModel = {
            'clientName': '',
            'quoteNo': '',
            'clientPhoneNo': '',
            'clientEmail': '',
            'product': null,
            'status': null,
            'quoteExpiringInDays': '',
            'startIndex': '0',
            'maxRecords': '5',
            'policyNo': '',
            'policyExpiringInDays': '',
            'isNotificationFlag': false,
            'isPolicyOrQuote': 'QT',
            'claimNo': '',
            'lossDate': '',
            'noticeDateFrom': '',
            'isSEOSearchFlag': false,
            "filterString": '',
            'ownTransaction': true,
            'subOrdinateUser': '',
            'userGroupCode': '',
            'statusDesc': '',
            'sharedBy': '',
            'customerID': '',
            'sharedBySuperUser': false,
            'sharedByUser': false,
            'txnType':'',
			'vehicleRegNo':'',
            'selectAllWithSamePartyId':false,
            'isHierarchySearch':false
        };
    }
}