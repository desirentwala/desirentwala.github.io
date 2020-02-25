import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, Input, NgModule, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { EventService } from '../../services/event.service';
import { ValidationHandler } from '../common/api';
import { Logger } from '../logger';
import { UtilsService } from '../utils/utils.service';
import { AgeValidator } from '../validators/age/age.validator';
import { DateValidator } from '../validators/date/date.validator';
import { EmailIdvalidators } from '../validators/emailid/emailid.validator';
import { MaxNumberValidator } from '../validators/maxnumber/maxnumber.validator';
import { MaxSizeValidator } from '../validators/maxsize/maxsize.validator';
import { MinNumberValidator } from '../validators/minnumber/minnumber.validator';
import { MinSizeValidator } from '../validators/minsize/minsize.validator';
import { SharedModule } from './../../shared/shared.module';

@Component({
    selector: 'validation-handler',
    templateUrl: './validation.handler.html'
})
export class ValidationHandlerComponent implements AfterContentInit, OnInit, OnChanges {

    @Input() elementControl: FormControl;
    @Input() customMessages: {} = {};
    @Input() showErrorOnBlur: boolean = false;
    @Input() skipDirtyCheck: boolean = false;
    @Input() customFlag: boolean = false;
    @Input() errorCustomClass: string = '';
    @Input() options: ValidationHandler;
    @Input() activationID: string;
    @Input() fieldTabId: string;
    validateTab: boolean;
    errorMsgShow: string;
    logger: Logger;
    constructor(_logger: Logger, public utilsService: UtilsService, public eventHandler: EventService) {
        this.logger = _logger;
    }

    ngOnInit() {
        this.eventHandler.validateTabSub.subscribe((data) => {
            if (this.fieldTabId === data['id']) {
                this.elementControl.markAsDirty();
                this.doSetErrorMsg();
                if (this.errorMsgShow) {
                    this.validateTab = true;
                }
            }
        });
        this.eventHandler.tabChangeSub.subscribe(() => {
            this.doResetValidateTab();
        });
        this.eventHandler.nextStepSub.subscribe((data) => {
            this.doResetValidateTab();
        });
        this.eventHandler.prevStepSub.subscribe((data) => {
            this.doResetValidateTab();
        });
        this.utilsService.activeValidationIDChangeSub.subscribe(() => {
            this.doCheckActivationIdsToValidate();
        });
    }

    ngOnChanges(changes?: SimpleChanges) {
        this.doCheckActivationIdsToValidate();
    }


    ngAfterContentInit() {
        if (this.elementControl) {
            this.elementControl.statusChanges.subscribe(() => {
                this.doSetErrorMsg();
            });
        }
    }
    doSetErrorMsg() {
        if ((this.elementControl.dirty || this.skipDirtyCheck) && this.elementControl.errors) {
            if (this.showErrorOnBlur) {
                this.elementControl.markAsUntouched();
            }
            if (this.elementControl.errors['required']) {
                this.errorMsgShow = 'required';
            } else {
                this.errorMsgShow = undefined;
                if (this.elementControl.hasError('minlength') && !this.errorMsgShow) {
                    this.errorMsgShow = 'minlength';
                } else {
                    this.errorMsgShow = undefined;
                    if (this.elementControl.errors['maxlength'] && !this.errorMsgShow) {
                        this.errorMsgShow = 'maxlength';
                    } else {
                        this.errorMsgShow = undefined;
                        if (this.elementControl.errors['validateDate'] && !this.errorMsgShow) {
                            this.errorMsgShow = 'validateDate';
                        } else {
                            this.errorMsgShow = undefined;
                            if (this.elementControl.errors['validateAge'] && !this.errorMsgShow) {
                                this.errorMsgShow = 'validateAge';
                            } else {
                                this.errorMsgShow = undefined;
                                if (this.elementControl.errors['maxNumber'] && !this.errorMsgShow) {
                                    this.errorMsgShow = 'maxNumber';
                                } else {
                                    this.errorMsgShow = undefined;
                                    if (this.elementControl.errors['minNumber'] && !this.errorMsgShow) {
                                        this.errorMsgShow = 'minNumber';
                                    } else {
                                        this.errorMsgShow = undefined;
                                        if (this.elementControl.errors['mailFormat'] && !this.errorMsgShow) {
                                            this.errorMsgShow = 'mailFormat';
                                        } else {
                                            this.errorMsgShow = undefined;
                                            if (this.elementControl.errors['multiplemailFormat'] && !this.errorMsgShow) {
                                                this.errorMsgShow = 'multiplemailFormat';
                                            } else {
                                                this.errorMsgShow = undefined;
                                                if (this.elementControl.errors['mismatch'] && !this.errorMsgShow) {
                                                    this.errorMsgShow = 'mismatch';
                                                } else {
                                                    this.errorMsgShow = undefined;
                                                    if (this.elementControl.errors['pattern'] && !this.errorMsgShow) {
                                                        this.errorMsgShow = 'pattern';
                                                    } else {
                                                        this.errorMsgShow = undefined;

                                                        if (this.elementControl.errors['maxSize'] && !this.errorMsgShow) {
                                                            this.errorMsgShow = 'maxSize';
                                                        } else {
                                                            this.errorMsgShow = undefined;
                                                            if (this.elementControl.errors['minSize'] && !this.errorMsgShow) {
                                                                this.errorMsgShow = 'minSize';
                                                            } else {
                                                                this.errorMsgShow = undefined;
                                                                if (this.elementControl.errors['notFound'] && !this.errorMsgShow) {
                                                                    this.errorMsgShow = 'notFound';
                                                                } else {
                                                                    this.errorMsgShow = undefined;

                                                                }

                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
            if (this.customMessages) {
                try {
                    this.errorMsgShow = this.customMessages[this.errorMsgShow];
                } catch (e) {
                    this.logger.error('Custom error message is not Added for' + this.errorMsgShow);
                    this.logger.error(e);
                }

            }

        } else {
            this.errorMsgShow = undefined;
        }
    }

    doSetValidators() {
        let composedValidations: any = [];
        Object.keys(this.options).forEach(key => {
            switch (key) {
                case 'required': {
                    composedValidations.push(Validators.required);
                    break;
                }
                case 'requiredTrue': {
                    composedValidations.push(Validators.requiredTrue);
                    break;
                }
                case 'nullValidator': {
                    composedValidations.push(Validators.nullValidator);
                    break;
                }
                case 'minlength': {
                    composedValidations.push(Validators.minLength(this.options[key]));
                    break;
                }
                case 'maxlength': {
                    composedValidations.push(Validators.maxLength(this.options[key]));
                    break;
                }
                case 'validateDate': {
                    composedValidations.push(DateValidator.validateDate);
                    break;
                }
                case 'minAge': {
                    composedValidations.push(AgeValidator.minAge(this.options[key]));
                    break;
                }
                case 'maxAge': {
                    composedValidations.push(AgeValidator.maxAge(this.options[key]));
                    break;
                }
                case 'maxNumber': {
                    composedValidations.push(MaxNumberValidator.maxNumber(this.options[key]));
                    break;
                }
                case 'minNumber': {
                    composedValidations.push(MinNumberValidator.minNumber(this.options[key]));
                    break;
                }
                case 'mailFormat': {
                    composedValidations.push(EmailIdvalidators.mailFormat);
                    break;
                }
                case 'multiplemailFormat': {
                    composedValidations.push(EmailIdvalidators.multiplemailFormat);
                    break;
                }
                case 'pattern': {
                    composedValidations.push(Validators.pattern(this.options[key]));
                    break;
                }
                case 'maxSize': {
                    composedValidations.push(MaxSizeValidator.maxSize(this.options[key]));
                    break;
                }
                case 'minSize': {
                    composedValidations.push(MinSizeValidator.minSize(this.options[key]));
                    break;
                }
                default: {
                    this.logger.log('notFound', key);
                    break;
                }
            }
        });
        this.elementControl.setValidators(Validators.compose(composedValidations));
        this.elementControl.updateValueAndValidity();
    }
    doResetValidateTab() {
        this.validateTab = false;
    }
    doCheckActivationIdsToValidate() {
        this.elementControl.setValidators(null);
        // this.elementControl.reset();
        this.elementControl.updateValueAndValidity();
        if (this.utilsService.activeValidationIDs.includes(this.activationID)) {
            this.doSetValidators();
        }
    }

}



@NgModule({
    imports: [FormsModule, CommonModule, ReactiveFormsModule, SharedModule],
    declarations: [ValidationHandlerComponent],
    exports: [ValidationHandlerComponent, SharedModule]
})
export class ValidationHandlerModule { }
