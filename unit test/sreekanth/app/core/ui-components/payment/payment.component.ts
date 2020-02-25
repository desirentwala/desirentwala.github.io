import { UtilsService } from './../utils/utils.service';
import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, Input, NgModule, OnChanges, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TooltipModule } from '@swimlane/ngx-charts/release';
import { LocalStorageService } from 'angular-2-local-storage/dist';
import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { LabelModule } from '../label/label.component';
import { UiMiscModule } from '../misc-element/misc.component';
import { ModalModule } from '../modal/index';
import { UiTabModule } from '../tab/tabset';
import { PolicyService } from './../../../modules/transaction/services/policy.service';
import { QuotService } from './../../../modules/transaction/services/quote.service';
import { SharedModule } from './../../shared/shared.module';
import { UiButtonModule } from './../button/button.component';
import { PaymentService } from './payment.service';
import { Logger } from '../logger/logger';

export const CUSTOM_PAYMENT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PaymentComponent),
    multi: true
};
@Component({

    selector: 'payment-gateway',
    templateUrl: './payment.template.html',
    providers: [CUSTOM_PAYMENT_VALUE_ACCESSOR]
})
export class PaymentComponent implements ControlValueAccessor, AfterContentInit, OnInit, OnChanges, OnDestroy {
    payOnType: any;
    isIFrame: string = 'N';
    isPaymentFailedPageModal: boolean = false;
    msgRefundResult: string = '';
    isPaymentRefundResultPageModal: boolean = false;
    paymentReferenceNo: any = '';
    isPaymentRefundPageModal = false;
    public isEndorsmentFlag = false;
    @Input() radioArray: any[];
    @Input('value') radioValue: any;
    @Input() horizontalflag = false;
    @Input() elementId: string;
    @Input() radioName: string;
    @Input() radioCustomClass = '';
    @Input() indexes;
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement = 'right';
    @Input() type = '';
    @Input() changeId: string;
    @Input() iconClass: string;
    @Input() paymentInfo: any;
    @Input() isBatchPolicy: boolean = false;
    @Input() formValue: any = {};
    @Input() isCancelButtonRequired: boolean = false;
	@Input() disablePaymentButtonId: boolean = false;
    payOnName: any = 'PayOnRadio';
    paymentGatewayList: any;
    public innerValue: any;
    public invalidFlag: boolean;
    pushValue = true;
    elementControl = new FormControl();
    elementControl1 = new FormControl();
    radioButtonflag = false;
    selectedList: any;
    paymentURL: SafeResourceUrl;
    isViewpaymentPageModal = false;
    paymentGatewayModal = false;
    isPaymentWindowOpen = false;
    isViewpaymentModal = false;
    isCancelPaymentPageModal = false;
    defaultTimeoutInterval = 8000;
    paymentId: any = 'paymentId';
    responseData: any;
    selectedAmount: any = 0;
    policyNumber: any;
    checkPaymentStat: any;
    customField: any;
    payOnList: any[] = [
        { label: 'Gross $123', type: 'Gross', value: '123' },
        { label: 'Net $321', type: 'Net', value: '321' }
    ];
    showPGSelectionModal: boolean = false;
    paymentCardholderInfo: any = {
        name: 'abc',
        email: 'abc@abc.com',
        mobileNo: '01234567890'
    };
    constructor(public paymentService: PaymentService, public eventHandler: EventService, public ele: ElementRef, public configService: ConfigService, public changeRef: ChangeDetectorRef, public sanitize: DomSanitizer,
         public quoteService: QuotService, public localStorageService: LocalStorageService,
        public policyService: PolicyService, public utilsService: UtilsService, public logger: Logger) {
        let paymentListResponse = this.paymentService.getPaymentGatewayList();
        paymentListResponse.subscribe(
            (data) => {
                if (data.error !== null
                    && data.error !== undefined
                    && data.error.length >= 1) {
                } else {
                    this.paymentGatewayList = data;
                }
            });
    }

    // get accessor
    get value(): any {

        return this.innerValue;
    };
    public getPayOnList(inputObjectList: any): Object[] {
        let payOnListDetails: Object[] = [], payOnObject: Object;
        if (this.isBatchPolicy) {
            for (let index = 0; index < inputObjectList.length; index++) {
                if (inputObjectList[index].totalAmount) {
                    payOnObject = {
                        'type': 'Gross',
                        'label': 'Payable Amount ' + inputObjectList[index].totalAmount,
                        'value': inputObjectList[index].totalAmount
                    };
                    payOnListDetails.push(payOnObject);
                }
            }
        } else {
            let currencyCode = '';
            inputObjectList.forEach(element => {
                if (element.currency) {
                    currencyCode = ' ' + element.currency;
                }
            });
            for (let index = 0; index < inputObjectList.length; index++) {
                if (inputObjectList[index].gross) {
                    payOnObject = {
                        'type': 'Gross',
                        'label': 'Gross ' + inputObjectList[index].gross + currencyCode,
                        'value': inputObjectList[index].gross
                    };
                    payOnListDetails.push(payOnObject);
                }
                if (inputObjectList[index].net) {
                    payOnObject = {
                        'type': 'Net',
                        'label': 'Net ' + inputObjectList[index].net + currencyCode,
                        'value': inputObjectList[index].net
                    };
                    payOnListDetails.push(payOnObject);
                }
                if (inputObjectList[index].policyNo) {
                    this.policyNumber = inputObjectList[index].policyNo;
                }
            }
        }

        if (this.configService.getCustom('b2cFlag') || this.configService.getCustom('b2b2cFlag')) {
            for (let index = 0; index < inputObjectList.length; index++) {
                if (inputObjectList[index].cardHolderInfo) {
                    if (inputObjectList[index].cardHolderInfo.policyHolderType === 'I') {
                        this.paymentCardholderInfo.name = inputObjectList[index].cardHolderInfo.appFName;
                    } else {
                        this.paymentCardholderInfo.name = inputObjectList[index].cardHolderInfo.companyName;
                    }
                    this.paymentCardholderInfo.email = inputObjectList[index].cardHolderInfo.emailId;
                    this.paymentCardholderInfo.mobileNo = inputObjectList[index].cardHolderInfo.mobilePh;
                }
            }
        }

        return payOnListDetails;
    }
    ngAfterContentInit() {
        this.configService.setLoadingSub('no');
        this.radioButtonflag = this.elementControl.valid;
        this.radioButtonflag = this.elementControl1.valid;
        if (this.value) {
            this.pushValue = (this.value === this.radioArray[0].value) ? true : false;
        }
        this.elementControl.valueChanges.subscribe(data => {
            if (data) {
                this.setSelectedObject(data);
            }
        });
        this.elementControl1.valueChanges.subscribe(data => {
            this.selectedAmount = data;
            this.setSelectedPayOnObject(this.selectedAmount);
        });

        this.paymentService.paymentPushedData.subscribe(data => {
            let amount, policyNo, policyEndtNo, merchantID, customField, imageUrl = null, currency, savePaymentDetailsUrl = null, identifier1, identifier2, identifier3, identifier4 = null, identifier5 = null;
            if (data) {
                for (let index = 0; index < data.length; index++) {
                    if (data[index].showPGSelectionModal) {
                        this.showPGSelectionModal = true;
                    }
                    if (data[index].merchantID) {
                        merchantID = data[index].merchantID;
                    }
                    if (data[index].amount && parseFloat(data[index].amount) > 0) {
                        amount = data[index].amount;
                    }
                    if (data[index].policyNo) {
                        policyNo = data[index].policyNo;
                    }
                    if (data[index].policyEndtNo) {
                        policyEndtNo = data[index].policyEndtNo;
                    }
                    if (data[index].customField) {
                        customField = data[index].customField;
                    }
                    if (data[index].isEndorsmentFlag) {
                        this.isEndorsmentFlag = data[index].isEndorsmentFlag;
                    }
                    if(data[index].currency){
                        currency = data[index].currency;
                    }
                    if(data[index].imageUrl){
                        identifier1 = data[index].imageUrl;
                    }
                    if(data[index].savePaymentDetailsUrl){
                        identifier1 = data[index].savePaymentDetailsUrl;
                    }
                    if(data[index].identifier1){
                        identifier1 = data[index].identifier1;
                    }
                    if(data[index].identifier2){
                        identifier2 = data[index].identifier2;
                    }
                    if(data[index].identifier3){
                        identifier3 = data[index].identifier3;
                    }
                    if(data[index].identifier4){
                        identifier4 = data[index].identifier4;
                    }
                    if(data[index].identifier5){
                        identifier5 = data[index].identifier5;
                    }
                }
            }

            if (data && this.showPGSelectionModal) {
                this.isViewpaymentModal = true;
                this.payOnList = this.getPayOnList(data);
                this.changeRef.markForCheck();
            } else if (data && !this.showPGSelectionModal) {
                this.isViewpaymentModal = false;
                for (let i = 0; i < this.paymentGatewayList.length; i++) {
                    let pgList = this.paymentGatewayList[i].pgList;
                    if (pgList.length > 1) {
                        for (let j = 0; j < pgList.length; j++) {
                            if (pgList[j].merchantID === merchantID) {
                                if(amount && amount > 0){
                                    let _setSelectedObject = { 
                                        'amount': amount.toString(), 
                                        'policyNo': policyNo, 
                                        'policyEndtNo': policyEndtNo, 
                                        'pgName': pgList[j].pgName, 
                                        'pgType': pgList[j].pgType, 
                                        'merchantID': pgList[j].merchantID, 
                                        'customField': customField,
                                        'currency': currency,
                                        'identifier1': identifier1,
                                        'identifier2': identifier2,
                                        'identifier3': identifier3,
                                        'identifier4': identifier4,
                                        'identifier5': identifier5,
                                        'savePaymentDetailsUrl': savePaymentDetailsUrl,
                                        'imageUrl': imageUrl
                                    };
                                    this.getPaymentGatewayURL(_setSelectedObject);
                                }else{
                                    this.configService.setLoadingSub('no');
                                }
                            }
                        }
                    } else if (pgList.length === 1) {
                        if(amount && amount > 0){
                            let _setSelectedObject = { 
                                'amount': amount.toString(), 
                                'policyNo': policyNo, 
                                'policyEndtNo': policyEndtNo, 
                                'pgName': pgList[0].pgName, 
                                'pgType': pgList[0].pgType, 
                                'merchantID': pgList[0].merchantID, 
                                'customField': customField,
                                'currency': currency,
                                'identifier1': identifier1,
                                'identifier2': identifier2,
                                'identifier3': identifier3,
                                'identifier4': identifier4,
                                'identifier5': identifier5,
                                'savePaymentDetailsUrl': savePaymentDetailsUrl,
                                'imageUrl': imageUrl
                            };
                            this.getPaymentGatewayURL(_setSelectedObject);
                        }else{
                            this.configService.setLoadingSub('no');
                        }
                    }
                }
            }
        });
        this.paymentService.initRefundEmitter.subscribe(data => {
            if (data) {
                this.isPaymentRefundPageModal = true;
                this.paymentReferenceNo = data.paymentInfo.paymentReferenceNo ? data.paymentInfo.paymentReferenceNo : '';
                this.policyNumber = data.paymentInfo.policyNo ? data.paymentInfo.policyNo : '';
            }
        });
        this.paymentService.initPaymentEmitter.subscribe(data => {
            if (!data.isPayment) {
                this.isPaymentFailedPageModal = true;
            }
        });
    }
    doReTryPayment() {
        this.isPaymentFailedPageModal = false;
        if (this.showPGSelectionModal) {
            this.isViewpaymentModal = true;
        }
    }
    setSelectedObject(input) {
        this.selectedList = {};
        this.selectedList['pgName'] = input['pgName'];
        this.selectedList['pgType'] = input['pgType'];
        this.selectedList['merchantID'] = input['merchantID'];
        this.selectedList['amount'] = this.elementControl1.value;

    }
    setSelectedPayOnObject(input) {
        for (let temp = 0; temp < this.payOnList.length; temp++) {
            if (this.payOnList[temp].value === input) {
                this.payOnType = this.payOnList[temp].type;
            }
        }
    }
    // set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onModelChange(v);
            let classNames: string = this.ele.nativeElement.className;
            if (classNames && classNames.includes('ng-valid')) {
                this.invalidFlag = false;
            }
            this.eventHandler.setEvent('change', this.changeId, this.innerValue);

        }
    }


    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    onModelChange: Function = () => { };
    onModelTouched: Function = () => { };

    // From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onModelChange = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onModelTouched = fn;
    }
    setPushButtonValue(value) {
        this.value = this.radioArray[(value === true) ? 0 : 1].value;
    }

    ngOnInit() {
        this.eventHandler.validateTabSub.subscribe((data) => {
            let classNames: string = this.ele.nativeElement.className;
            if (classNames && classNames.includes('ng-invalid')) {
                this.invalidFlag = true;
            }
        });
        // this.paymentURL = this.sanitize.bypassSecurityTrustResourceUrl(this.paymentURL);

    }
    ngOnChanges(changes?) {
        this.indexes = this.indexes ? this.indexes : '';
        this.elementId = this.elementId + this.indexes;
        this.radioName = this.radioName + this.indexes;
    }

    setDisabledState(isDisabled: any) {
        if (isDisabled) {
            this.elementControl.disable();
        } else {
            this.elementControl.enable();
        }
    }
    getPaymentGatewayURL(inputData) {
        this.isViewpaymentModal = false;
        if (inputData) {
            let paymentURLResponse = this.paymentService.getPaymentGatewayURL(inputData);
            paymentURLResponse.subscribe(
                (data) => {
                    this.configService.setLoadingSub('no');
                    if (data.error !== null
                        && data.error !== undefined
                        && data.error.length >= 1) {
                    } else if (data) {
                        if (!this.isBatchPolicy) {
                            this.localStorageService.set('isBatchPayment', '');
                            this.localStorageService.set('batchSettlementInfoFormGroup', '');
                            if(this.formValue['policyInfo'] && this.formValue['paymentInfo']){
                                this.formValue['policyInfo']['hasSinglePlan'] = true;
                                this.formValue['paymentInfo']['paymentReferenceNo'] = data.transRefNo;
                                this.formValue['policyInfo']['paymentTime'] = this.utilsService.getTimeNow();
                                this.formValue['policyInfo']['paymentDate'] = this.utilsService.getTodayDate();
                            }
                            this.customField = data.customField;
                            let quotSaveResponse;
                            if (this.isEndorsmentFlag) {
                                quotSaveResponse = this.policyService.doPolicySave(this.formValue);
                            } else {
                                quotSaveResponse = this.quoteService.saveQuoteOpenheldInfo(this.formValue);
                            }
                            quotSaveResponse.subscribe((quotSaveInfo) => {
                                if (quotSaveInfo) {
                                    if (quotSaveInfo.error !== null && quotSaveInfo.error !== undefined && quotSaveInfo.error.length >= 1) {
                                        this.eventHandler.setEvent('change', 'saveQuoteErrorPayment', quotSaveInfo);
                                        this.configService.setLoadingSub('no');
                                    } else {
                                        this.responseData = data;
                                        this.isIFrame = this.responseData.isIFrame;
                                        if (this.responseData.pgHandleType === 'IFRAME') {
                                            this.isIFrame = 'Y';
                                            if(this.responseData.pgIFrameHandleBy === 'External'){
                                                this.doPaymentTransactionIFrameHandleByExternal(data);
                                            }else{
                                                this.doPaymentTransactionIframe(data);
                                            }
                                        } else if (this.responseData.pgHandleType === 'SELFWINDOW') {
                                            this.configService.disableRefreshCheck();
                                            let pgUrl = data.pgWindowUrl + '?' + data.pgReqParam;
                                            location.replace(pgUrl);
                                        } else if (this.responseData.pgHandleType === 'NEWWINDOW') {
                                            this.doPaymentTransaction(data);
                                        }
                                    }

                                }
                            });
                        } else {
                            this.paymentService.updatedBatchSettlementInfo(data.transRefNo, this.configService.getCustom('batchSettlementInfoFormGroup'));
                            this.responseData = data;
                            this.isIFrame = this.responseData.isIFrame;
                            if (this.responseData.pgHandleType === 'IFRAME') {
                                this.doPaymentTransactionIframe(data);
                            } else if (this.responseData.pgHandleType === 'SELFWINDOW') {
                                this.configService.disableRefreshCheck();
                                let pgUrl = data.pgWindowUrl + '?' + data.pgReqParam;
                                location.replace(pgUrl);
                            } else if (this.responseData.pgHandleType === 'NEWWINDOW') {
                                this.doPaymentTransaction(data);
                            }
                        }
                    }

                });
        }
    }
    doPaymentTransactionIframe(data) {
        let transferRefNo;
        try {
            let paymentIFrameUrl = '';
            if (data.pgReqParam) {
                paymentIFrameUrl = data.pgWindowUrl + '?' + data.pgReqParam;
            } else {
                paymentIFrameUrl = data.pgWindowUrl;
            }

            this.configService.setLoadingSub('no');
            this.paymentURL = this.sanitize.bypassSecurityTrustResourceUrl(paymentIFrameUrl);
            transferRefNo = data.transRefNo;
            let saveDetail = {
                "transRefNo": transferRefNo,
                "status": "",
                "paymentReferenceNo": transferRefNo,
                "cardType": "3",
                "ccExpiryDate": "012018",
                "responseDesc": ""
            };
            if (this.paymentURL) {
                this.isViewpaymentPageModal = true;
                this.changeRef.markForCheck();
                if (data.backDBUpdation === 'false') {
                    this.validatePaymentStatusIframe(saveDetail, data.timeOut);
                } else {
                    this.validatePaymentStatus(transferRefNo, data.timeOut);
                }
            }
        } catch (e) { }
    }
    doPaymentTransactionIFrameHandleByExternal(data){
        try {
            let handler = (<any>window).StripeCheckout.configure({
                key:  data.publishableKey,
                image: data.imageUrl,
                locale: 'auto',
                token: (token) => {
                  let payload = {
                    token: token.id,
                    email: token.email,
                    address:'',
                    amount: ((parseFloat(data.amount)) * 100).toString(),
                    pgName: data.pgName,
                    pgType: data.pgType,
                    merchantID: data.merchantID,
                    transRefNo: data.transRefNo,
                    currency: data.currency,
                    identifier1: data.identifier1,
                    identifier2: data.identifier2,
                    identifier3: data.identifier3,
                    identifier4: data.identifier4,
                    identifier5: data.identifier5
                  };
                  setTimeout(()=>{
                    this.configService.setLoadingSub('yes');
                  }, 100);
                  let savePaymentDetailsResponse = this.paymentService.savePaymentDetails(payload);
                  savePaymentDetailsResponse.subscribe(
                        (dataVal) => {
                            if (dataVal) {
                                this.configService.setCustom('paymentRedirectPage', 'internal');
                                this.configService._router.navigate(['/paymentRedirect'], { queryParams: { transRefNo: dataVal.transRefNo } });
                            } 
                        },
                        (error) => {
                            this.logger.error('error savePaymentDetailsResponse ', error);
                        }
                    );
                },
                opened: () => {},
                closed: () => {
                    this.configService.setLoadingSub('no');
                }
              }
            );
        
            handler.open({  
              name: data.headerName,
              description: data.headerDescription,
              amount: ((parseFloat(data.amount)) * 100),
              currency: data.currency
            });
        } catch (e) { }
    }
    doPaymentTransaction(data) {
        let transferRefNo;
        try {
            transferRefNo = data.transRefNo;
            // window.open(data.URL,"","height=600,width=800,scrollbars=1,location=no,menubar=no,resizable=1,status=no,toolbar=no");
            let mapForm = document.createElement('form');
            mapForm.target = 'Map';
            mapForm.method = 'POST'; // or "post" if appropriate
            let paymentIFrameUrl = '';
            if (data.pgRequestType === 'GETREQ') {
                if (data.pgReqParam) {
                    paymentIFrameUrl = data.pgWindowUrl + '?' + data.pgReqParam;
                } else {
                    paymentIFrameUrl = data.pgWindowUrl;
                }
                let childWindow = window.open(paymentIFrameUrl, 'Map', 'status=0,title=0,height=600,width=800,scrollbars=1');
                this.validatePaymentStatus(transferRefNo, '', childWindow);
                this.configService.setLoadingSub('yes');
            } else {
                paymentIFrameUrl = data.pgWindowUrl;
                if (data.pgReqParam) {
                    let reqPostData = JSON.parse(data.pgReqParam);
                    for (let temp in reqPostData) {
                        let mapInput = document.createElement('input');
                        mapInput.type = 'text';
                        mapInput.style.display = 'none';
                        mapInput.name = temp;
                        mapInput.value = reqPostData[temp];
                        mapForm.appendChild(mapInput);
                    }
                }
                mapForm.action = paymentIFrameUrl;

                document.body.appendChild(mapForm);
                this.configService.setLoadingSub('yes');
                let map = window.open('', 'Map', 'status=0,title=0,height=600,width=800,scrollbars=1');

                if (map) {
                    // mapForm.setRequestHeader('x-filename', 'guna');
                    mapForm.submit();
                    this.validatePaymentStatus(transferRefNo, this.defaultTimeoutInterval, map);
                } else {
                    alert('You must allow popups for this map to work.');
                }
            }
            if (this.paymentURL) {
                // this.isViewpaymentPageModal = true;
                this.changeRef.markForCheck();
                this.validatePaymentStatus(transferRefNo);
            }
        } catch (e) { }
    }
    validatePaymentStatus(transRefNoInput, timeoutInterval?, childWindow?) {
        this.configService.setLoadingSub('yes');
        if (this.isIFrame === 'Y') {
            this.configService.setLoadingSub('no');
        }
        if (timeoutInterval) {
            this.defaultTimeoutInterval = timeoutInterval;
        }
        this.checkPaymentStat = setInterval(() => {
            try {
                let transDetail = {
                    'transRefNo': transRefNoInput,
                    'customField': this.customField
                };
                let updateStatus = this.paymentService.getPaymentDetails(transDetail);
                updateStatus.subscribe((data) => {
                    if (data) {
                        data.payOn = this.payOnType;
                        if (data.status === 'YES') {
                            this.configService.setLoadingSub('no');
                            childWindow ? childWindow.close() : '';
                            this.isViewpaymentPageModal = false;
                            this.paymentService.initPostEmitter.emit(data);
                            this.changeRef.markForCheck();
                            clearInterval(this.checkPaymentStat);
                        } else if (data.status === 'NO') {
                            this.paymentService.initPostEmitter.emit(data);
                            this.configService.setLoadingSub('no');
                            childWindow ? childWindow.close() : '';
                            this.isViewpaymentPageModal = false;
                            this.changeRef.markForCheck();
                            clearInterval(this.checkPaymentStat);
                        }
                        else if (data.status === 'REQ') {
                            if (childWindow && childWindow.closed) {
                                this.paymentService.initPostEmitter.emit(data);
                                clearInterval(this.checkPaymentStat);
                            }
                        }
						else if(this.responseData.pgHandleType === 'IFRAME' && !this.isViewpaymentPageModal){
                            clearInterval(this.checkPaymentStat);
                        }
                    }
                });
            }
            catch (e) {
                this.configService.setLoadingSub('no');
                clearInterval(this.checkPaymentStat);
            }
        }, this.defaultTimeoutInterval);
    }
    getPaymentRefund() {
        this.isPaymentRefundPageModal = false;
        let input: any = {
            'transRefNo': this.paymentReferenceNo
        };
        let updateStatus = this.paymentService.getPaymentRefund(input);
        updateStatus.subscribe((data) => {
            this.configService.setLoadingSub('no');
            if (data.status === 'YES') {
                this.isPaymentRefundResultPageModal = true;
                this.msgRefundResult = 'Refund Success';
                this.changeRef.markForCheck();
            } else if (data.status === 'NO') {
                this.isPaymentRefundResultPageModal = true;
                this.msgRefundResult = 'Refund Failed Please contact Admin';
                this.changeRef.markForCheck();
            }
        });
    }
    doPolicyRePost() {
        this.paymentService.initRePostEmitter.emit(true);
    }
    callPaymentGateway() {
        if (this.isBatchPolicy) {
            this.selectedAmount = this.payOnList[0].value;
            this.setSelectedPayOnObject(this.selectedAmount);
        }
        this.selectedList['amount'] = this.selectedAmount.toString();
        this.selectedList['policyNo'] = this.policyNumber;
        this.selectedList['name'] = this.paymentCardholderInfo.name;
        this.selectedList['email'] = this.paymentCardholderInfo.email;
        this.selectedList['mobileNo'] = this.paymentCardholderInfo.mobileNo;
        this.getPaymentGatewayURL(this.selectedList);
    }
    openPaymentGatewayModel() {
        this.isViewpaymentPageModal = true;
    }
    ngOnDestroy() {
        clearInterval(this.checkPaymentStat);
        this.eventHandler.validateTabSub.observers.pop();
        this.paymentService.paymentPushedData.observers.pop();
        this.isIFrame = 'N';
        this.isPaymentFailedPageModal = false;
        this.msgRefundResult = '';
        this.isPaymentRefundResultPageModal = false;
        this.paymentReferenceNo = '';
        this.isPaymentRefundPageModal = false;
        this.paymentURL = '';
    }
    validatePaymentStatusIframe(saveDetail, timeOut) {
        let checkPaymentStat = setInterval(() => {
            let ele = this.ele.nativeElement.querySelector('#paymentGateWayIframe');
            try {
                let iframeDocument = ele.contentDocument || ele.contentWindow.document;
                let id = iframeDocument.getElementById('payment').innerHTML;
                if (id === 'payment-success') {
                    this.isViewpaymentPageModal = false;
                    saveDetail.status = 'YES';
                    this.changeRef.markForCheck();
                    let updateStatus = this.paymentService.savePaymentDetails(saveDetail);
                    updateStatus.subscribe((data) => {
                        if (data) {
                            data['transRefNo'] = data.paymentReferenceNo;
                            if (data.status === 'YES') {
                                this.paymentService.initPostEmitter.emit(data);
                                this.changeRef.markForCheck();
                                clearInterval(checkPaymentStat);
                            }
                        }
                    })
                }
                if (id === 'payment-failure') {
                    this.isViewpaymentPageModal = false;
                    saveDetail.status = 'NO';
                    let updateStatus = this.paymentService.savePaymentDetails(saveDetail);
                    updateStatus.subscribe((data) => {
                        if (data) {
                            data['transRefNo'] = data.paymentReferenceNo;
                            this.paymentService.initPostEmitter.emit(data);
                            this.changeRef.markForCheck();
                            clearInterval(checkPaymentStat);
                            this.configService.setLoadingSub('no');
                        }
                    });
                }

                if (id === 'payment-cancel') {
                    this.isViewpaymentPageModal = false;
                    saveDetail.status = 'CANCEL';
                    let updateStatus = this.paymentService.savePaymentDetails(saveDetail);
                    updateStatus.subscribe((data) => {
                        if (data) {
                            data['transRefNo'] = data.paymentReferenceNo;
                            this.paymentService.initPostEmitter.emit(data);
                            this.changeRef.markForCheck();
                            clearInterval(checkPaymentStat);
                            this.configService.setLoadingSub('no');
                        }
                    });
                }
            } catch (e) {

            }
        }, timeOut);
    }
    cancelQuestionModal() {
        this.isCancelPaymentPageModal = true;
        this.changeRef.markForCheck();

    }
    cancelPayment(param) {
        if (param) {
            this.isCancelPaymentPageModal = false;
            this.isViewpaymentPageModal = false;
			this.paymentService.disablePaymentButton = false;
            this.eventHandler.setEvent('click', this.disablePaymentButtonId, { 'type': 'disablePayment', 'index': this.indexes - 1 });
        }
        else {
            this.isCancelPaymentPageModal = false;
        }
        this.changeRef.markForCheck();
    }

};


export const UI_PGLIST_DIRECTIVES = [PaymentComponent];
@NgModule({
    declarations: UI_PGLIST_DIRECTIVES,
    imports: [CommonModule, SharedModule, ReactiveFormsModule, TooltipModule, SharedModule, UiButtonModule, ModalModule, UiMiscModule, LabelModule, UiTabModule],
    exports: [UI_PGLIST_DIRECTIVES, SharedModule],
})
export class UiPaymentGatewayModule { }