import { ConfigService } from '../../../core/services/config.service';
import { EventService } from '../../../core/services/event.service';
import { BreadCrumbService } from '../../common/breadCrumb/index';
import { customerService } from '../services/customer.service';
import { FactoryProvider } from './../../../core/factory/factoryprovider';
import { Logger } from './../../../core/ui-components/logger/logger';
import { UtilsService } from '../../../core/ui-components/utils/utils.service';
import { DateDuration } from './../../../core/ui-components/ncp-date-picker/pipes/date.duration';
import { DateFormatService } from '../../../core/ui-components/ncp-date-picker/index';
import { CustomerFormValidator } from './customer-form.validator';
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormArray, FormControl } from '@angular/forms/src/model';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@adapters/packageAdapter';
import { ProductFactory } from '../../../core/factory/productfactory';

@Component({
    selector: 'customer-form',
    templateUrl: './customer-form.template.html',
    providers: [customerService, CustomerFormValidator, DateDuration],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerFormComponent implements OnInit, AfterContentInit {

    customerFormGroup: FormGroup;
    public factoryInstance: ProductFactory;
    public isValidCustomerForm: boolean = true;
    public todayString: string;
    errors = [];
    isError = false;
    formBuilder: FormBuilder;
    router: Router;
    dateDelimiter: string;
    dateFormat: string;
    todayDate: Date;
    dateFormatService;
    dateDuration;
    loaderConfig: ConfigService;
    eventHandler: EventService;
    changeSub: any;
    validateTabSub: any;
    clickSub: any;
    isHolderTypeIndividual: boolean = true;
    isAddCustomerModal: boolean = false;
    isDuplicateCustomer: boolean = false;
    isCustomerRefreshed: boolean = false;
    isCustomer: boolean = false;
    customerPerDetails;
    customerFormValidator;
    customerService;
    elementRef;
    imageSrc = 'assets/img/icon_profile.png';
    controls;
    text;
    prefixItems = [
        {
            "code": "Mr",
            "desc": "Mr"
        },
        {
            "code": "Miss",
            "desc": "Miss"
        },
        {
            "code": "Mrs",
            "desc": "Mrs"
        },
        {
            "code": "Dr",
            "desc": "Dr"
        }
    ];
    public zipCodePattern: any = /^[0-9]*$/;
    contactType: string = 'Phone';
    constructor(
        public _customerFormFB: FormBuilder,
        _eventHandler: EventService,
        _element: ElementRef,
        _customerService: customerService,
        breadCrumbService: BreadCrumbService,
        _customerFormValidator: CustomerFormValidator,
        public logger: Logger,
        router: Router,
        public translate: TranslateService,
        loaderConfigService: ConfigService,
        public activeRoute: ActivatedRoute,
        _dateFormatService: DateFormatService,
        public utilsService: UtilsService,
        _dateduration: DateDuration,
        public changeRef: ChangeDetectorRef
    ) {
        this.eventHandler = _eventHandler;
        this.elementRef = _element;
        breadCrumbService.addRouteName('/ncp/customer/addCustomer', [{ 'name': 'NCPBreadCrumb.addCustomer' }]);
        this.loaderConfig = loaderConfigService;
        this.customerService = _customerService;
        this.router = router;
        this.formBuilder = _customerFormFB;
        this.factoryInstance = FactoryProvider.getFactoryInstance(this.loaderConfig, this.logger, this.formBuilder);
        let policyModelInstance = this.factoryInstance.getPolicyModelInstance();
        this.customerPerDetails = policyModelInstance.getCustomerPersonalDetailsInfo();
        this.customerFormValidator = _customerFormValidator;
        this.dateFormatService = _dateFormatService;
        this.dateDuration = _dateduration;
        this.loaderConfig.setLoadingSub('no');
    }


    ngOnInit() {
        this.loaderConfig.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.loaderConfig.currentLangName);
            }
        });
        this.dateDelimiter = this.loaderConfig.get('dateDelimiter');
        this.dateFormat = this.loaderConfig.get('dateFormat');
        this.todayDate = new Date();
        this.todayDate.setHours(0, 0, 0, 0);
        this.todayString = this.dateFormatService.formatDate(this.todayDate);
        this.customerFormGroup = this.customerPerDetails.getCustomerDetailsForm();

        this.customerFormGroup.controls['customerInfo'].get('policyHolderType').setValue('I');
        this.customerFormGroup.controls['customerInfo'].get('policyHolderType').updateValueAndValidity();

        this.customerFormGroup.controls['customerInfo'].get('maritalStatus').setValue('I');
        this.customerFormGroup.controls['customerInfo'].get('maritalStatus').updateValueAndValidity();

        this.clickSub = this.eventHandler.clickSub.subscribe((data) => {
            if (data.id === 'policyHolderTypeSelected') {
                this.policyHolderTypeSelected(data.value);
            }
            this.changeRef.markForCheck();
        });

        this.changeSub = this.eventHandler.changeSub.subscribe((data) => {
            if (data.id === 'contactTypeChanged') {
                this.doUpdateContactNumberValidatorsByType(data.value);
            }
            this.changeRef.markForCheck();
        });

    }

    navigateRouterLink(routerUrl: any) {
        if (routerUrl !== '' && routerUrl !== null) {
            this.router.navigate([routerUrl]);
        } else {
            this.logger.info('Not a valid URL', routerUrl);
        }
    }

    ngAfterContentInit() {
        this.customerFormGroup = this.customerFormValidator.setCustomerInfoValidator(this.customerFormGroup);
    }

    policyHolderTypeSelected(value?) {
        this.customerFormGroup = this.customerFormValidator.setCustomerInfoValidator(this.customerFormGroup);
        if (value === 'I') {
            this.isHolderTypeIndividual = true;
        } else {
            this.isHolderTypeIndividual = false;
        }
        if (this.isCustomerRefreshed) this.resetCustomerInfo();
    }

    addCustomer() {
        if (this.customerFormGroup.valid) {
            //this.customerFormGroup.enable();
            if (this.isCustomerRefreshed) {
                this.isError = false;
                let customerID = this.customerFormGroup.controls['customerInfo'].get('appCode').value;
                let setCustomerId = { "customerID": customerID }
                let retrieveCustomerDetails = this.customerService.retrieveCustomerDetails(setCustomerId);
                retrieveCustomerDetails.subscribe(
                    (data) => {
                        if (data && (data.error !== null
                            && data.error !== undefined
                            && data.error.length >= 1)) {
                            this.isError = true;
                            this.loaderConfig.setLoadingSub('no');
                        } else {
                            if (data && data.customerInfo.appCode === this.customerFormGroup.controls['customerInfo'].get('appCode').value) {
                                this.isError = false;
                                this.isDuplicateCustomer = true;
                                this.loaderConfig.setLoadingSub('no');
                            }
                            else {
                                this.createCustomer();
                            }
                        }
                    });
            }
            else {
                this.createCustomer();
            }
        }
        else {
            this.eventHandler.validateTabSub.next({ value: '', id: 'customer' });
            this.isCustomer = true;
            window.scroll(0, 200);
        }

    }

    private createCustomer() {
        let addCustomerResponse = this.customerService.addNewCustomer(this.customerFormGroup.value);
        addCustomerResponse.subscribe(
            (customerInfodataVal) => {
                if (customerInfodataVal.error !== null && customerInfodataVal.error !== undefined && customerInfodataVal.error.length >= 1) {
                    this.updateErrorObject(customerInfodataVal);
                    this.isAddCustomerModal = false;
                    this.loaderConfig.setLoadingSub('no');
                } else {
                    this.isError = false;
                    let fullName = customerInfodataVal.customerInfo.appFullName;
                    this.customerFormGroup.controls['customerInfo'].get('appFullName').patchValue(fullName);
                    this.isAddCustomerModal = true;
                    this.loaderConfig.setLoadingSub('no');
                }
                this.changeRef.markForCheck();
            });
    }

    updateCustomer(){
            //this.customerFormGroup.enable();
            let addUpdateResponse = this.customerService.updateCustomerDetails(this.customerFormGroup.value);
            addUpdateResponse.subscribe(
                (customerInfodataVal) => {
                    if (customerInfodataVal.error !== null && customerInfodataVal.error !== undefined && customerInfodataVal.error.length >= 1) {
                        this.updateErrorObject(customerInfodataVal);
                        this.loaderConfig.setLoadingSub('no');
                    } else {
                        this.isError = false;
                        this.loaderConfig.setLoadingSub('no');
                    }
                    this.changeRef.markForCheck();
                });
    }

    imageUploaded(input) {
        let reader = new FileReader();
        let image = this.elementRef.nativeElement.querySelector('.img-responsive');
        reader.onload = (e) => {
            let src = reader.result;
            image.src = src;
        };
        reader.readAsDataURL(input.target.files[0]);
        this.changeRef.markForCheck();
    }

    doUpdateContactNumberValidatorsByType(type: string) {
        this.contactType = type;
    }

    public updateErrorObject(inputErrorObject) {
        this.isError = true;
        this.errors = [];
        for (let i = 0; i < inputErrorObject.error.length; i++) {
            if (inputErrorObject.error[i].errCode) {
                this.errors.push({ 'errCode': inputErrorObject.error[i].errCode, 'errDesc': inputErrorObject.error[i].errDesc });
                this.logger.log('Error===>' + inputErrorObject.error[i].errCode + ':' + inputErrorObject.error[i].errDesc);
            }
        }
        window.scrollTo(100, 100);
    }
    public doCustomerRefresh() {
        let customerInfoResponse = this.customerService.doCustomerRefresh({ identityNo: this.customerFormGroup.controls['customerInfo'].get('identityNo').value });
        customerInfoResponse.subscribe((data) => {
            if ((data.error !== null && data.error !== undefined && data.error.length >= 1) || typeof data.appCode === 'undefined') {
                this.loaderConfig.setLoadingSub('no');
                this.isCustomerRefreshed = false;
            } else {
                this.isCustomerRefreshed = true;
                let identityNo = this.customerFormGroup.controls['customerInfo'].get('identityNo').value;
                let identityTypeCode = this.customerFormGroup.controls['customerInfo'].get('identityTypeCode').value;
                let identityTypeDesc = this.customerFormGroup.controls['customerInfo'].get('identityTypeDesc').value;
                let maritalStatusBeforePatch = this.customerFormGroup.controls['customerInfo'].get('maritalStatus').value;
                this.customerFormGroup.controls['customerInfo'].patchValue(data);
                this.customerFormGroup.controls['customerInfo'].get('mobilePh').patchValue(data.mobilePh);
                this.customerFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
                let maritalStatusAfterPatch = this.customerFormGroup.controls['customerInfo'].get('maritalStatus').value;
                this.customerFormGroup.controls['customerInfo'].get('prefix').patchValue(data.prefix);
                this.customerFormGroup.controls['customerInfo'].get('prefixDesc').patchValue(data.prefix);
                if (identityNo && !this.customerFormGroup.controls['customerInfo'].get('identityNo').value) {
                    this.customerFormGroup.controls['customerInfo'].get('identityNo').patchValue(identityNo);
                }
                this.customerFormGroup.controls['customerInfo'].get('identityTypeCode').patchValue(identityTypeCode);
                this.customerFormGroup.controls['customerInfo'].get('identityTypeDesc').patchValue(identityTypeDesc);
                if (maritalStatusAfterPatch !== "I" && maritalStatusAfterPatch !== "O") {
                    this.customerFormGroup.controls['customerInfo'].get('maritalStatus').patchValue(maritalStatusBeforePatch);
                }
                this.customerFormGroup.controls['customerInfo'].updateValueAndValidity();
                this.disableCustomerInfo();
            }
            this.changeRef.markForCheck();
            this.loaderConfig.setLoadingSub('no');
        });

    }
    public disableCustomerInfo() {
        // this.customerFormGroup.controls['customerInfo'].disable();
        this.customerFormGroup.controls['customerInfo'].get('policyHolderType').enable();
        this.customerFormGroup.controls['customerInfo'].get('identityNo').enable();
        this.customerFormGroup.controls['customerInfo'].get('identityTypeCode').enable();
        this.customerFormGroup.controls['customerInfo'].get('identityTypeDesc').enable();
        this.customerFormGroup.controls['customerInfo'].updateValueAndValidity();
    }
    public resetCustomerInfo() {
        this.customerFormGroup.controls['customerInfo'].get('prefix').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('prefix').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('prefixDesc').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('prefixDesc').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('appFName').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('appFName').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('appMName').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('appMName').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('appLName').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('appLName').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('gender').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('gender').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('DOB').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('DOB').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('identityTypeCode').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('identityTypeCode').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('identityTypeDesc').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('identityTypeDesc').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('identityNo').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('identityNo').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('age').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('age').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('companyName').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('companyName').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('zipCd').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('zipCd').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('appUnitNumber').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('blockNumber').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('blockNumber').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('address1').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('address1').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('address2').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('address2').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('cityCode').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('cityCode').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('cityDesc').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('cityDesc').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('state').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('state').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('countryCode').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('countryCode').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('countryDesc').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('countryDesc').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('mobilePh').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('mobilePh').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('homePh').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('homePh').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('officePhone').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('officePhone').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('fax').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('fax').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].get('emailId').setValue(null);
        this.customerFormGroup.controls['customerInfo'].get('emailId').updateValueAndValidity();
        this.customerFormGroup.controls['customerInfo'].enable();
    }

    public doPostalCodeRefresh() {
        let PostalCodeResponse = this.customerService.getpostalCodeRefreshValues({ customerInfo: this.customerFormGroup.controls['customerInfo'].value });
        PostalCodeResponse.subscribe(
            (postalCodeResponseData) => {
                if (postalCodeResponseData == null) {
                    this.resetCustomerInfoAddress();
                } else if (postalCodeResponseData.error !== null && postalCodeResponseData.error !== undefined && postalCodeResponseData.error.length >= 1) {
                    // this.updateErrorObject(postalCodeResponseData);
                    this.resetCustomerInfoAddress();
                } else {
                    this.customerFormGroup.controls['customerInfo'].patchValue(postalCodeResponseData);
                    this.customerFormGroup.controls['customerInfo'].updateValueAndValidity();
                    this.customerFormGroup.controls['customerInfo'].get('appUnitNumber').patchValue(postalCodeResponseData.address1.trim());
                    this.customerFormGroup.controls['customerInfo'].get('appUnitNumber').updateValueAndValidity();
                    this.customerFormGroup.controls['customerInfo'].get('blockNumber').patchValue(postalCodeResponseData.address2.trim());
                    this.customerFormGroup.controls['customerInfo'].get('blockNumber').updateValueAndValidity();
                    this.customerFormGroup.controls['customerInfo'].get('address1').patchValue(postalCodeResponseData.address3.trim());
                    this.customerFormGroup.controls['customerInfo'].get('address1').updateValueAndValidity();
                    this.customerFormGroup.controls['customerInfo'].get('address2').patchValue(postalCodeResponseData.address4.trim());
                    this.customerFormGroup.controls['customerInfo'].get('address2').updateValueAndValidity();
                    this.customerFormGroup.controls['customerInfo'].get('cityCode').patchValue(postalCodeResponseData.cityCode.trim());
                    this.customerFormGroup.controls['customerInfo'].get('cityCode').updateValueAndValidity();
                    this.customerFormGroup.controls['customerInfo'].get('cityDesc').patchValue(postalCodeResponseData.cityDesc.trim());
                    this.customerFormGroup.controls['customerInfo'].get('cityDesc').updateValueAndValidity();
                    this.customerFormGroup.controls['customerInfo'].get('state').patchValue(postalCodeResponseData.stateCode.trim());
                    this.customerFormGroup.controls['customerInfo'].get('state').updateValueAndValidity();
                    this.customerFormGroup.controls['customerInfo'].get('stateDesc').patchValue(postalCodeResponseData.state.trim());
                    this.customerFormGroup.controls['customerInfo'].get('stateDesc').updateValueAndValidity();
                    this.customerFormGroup.controls['customerInfo'].get('countryCode').patchValue(postalCodeResponseData.countryCode);
                    this.customerFormGroup.controls['customerInfo'].get('countryCode').updateValueAndValidity();
                    this.customerFormGroup.controls['customerInfo'].get('countryDesc').patchValue(postalCodeResponseData.countryDesc);
                    this.customerFormGroup.controls['customerInfo'].get('countryDesc').updateValueAndValidity();
                    this.loaderConfig.setLoadingSub('no');
                    this.changeRef.markForCheck();
                }
            }
        );
    }
    public resetCustomerInfoAddress() {
        this.customerFormGroup.controls['customerInfo'].get('appUnitNumber').enable();
        this.customerFormGroup.controls['customerInfo'].get('blockNumber').enable();
        this.customerFormGroup.controls['customerInfo'].get('address1').enable();
        this.customerFormGroup.controls['customerInfo'].get('address2').enable();
        this.customerFormGroup.controls['customerInfo'].get('cityCode').enable();
        this.customerFormGroup.controls['customerInfo'].get('cityDesc').enable();
        this.customerFormGroup.controls['customerInfo'].get('state').enable();
        this.customerFormGroup.controls['customerInfo'].get('stateDesc').enable();
        this.customerFormGroup.controls['customerInfo'].get('countryCode').enable();
        this.customerFormGroup.controls['customerInfo'].get('countryDesc').enable();
        this.customerFormGroup.controls['customerInfo'].get('appUnitNumber').reset();
        this.customerFormGroup.controls['customerInfo'].get('blockNumber').reset();
        this.customerFormGroup.controls['customerInfo'].get('address1').reset();
        this.customerFormGroup.controls['customerInfo'].get('address2').reset();
        this.customerFormGroup.controls['customerInfo'].get('cityCode').reset();
        this.customerFormGroup.controls['customerInfo'].get('cityDesc').reset();
        this.customerFormGroup.controls['customerInfo'].get('state').reset();
        this.customerFormGroup.controls['customerInfo'].get('stateDesc').reset();
        this.customerFormGroup.controls['customerInfo'].get('countryCode').reset();
        this.customerFormGroup.controls['customerInfo'].get('countryDesc').reset();
        this.loaderConfig.setLoadingSub('no');

    }
}
