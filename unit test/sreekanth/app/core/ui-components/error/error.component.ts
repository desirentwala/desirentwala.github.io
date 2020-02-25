import { SharedModule } from './../../shared/shared.module';
import { Logger } from '../logger';
import { AfterContentInit, Component, Input, NgModule, OnChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../utils/utils.service';
import { ConfigService } from '../../services/config.service';

@Component({
    selector: 'error-handler',
    templateUrl: './error.html'
})
export class ErrorComponent implements AfterContentInit {

    @Input() elementControl: FormControl;
    @Input() customMessages: {} = {};
    @Input() showErrorOnBlur: boolean = false;
    @Input() skipDirtyCheck: boolean = false;
    @Input() customFlag: boolean = false;
    @Input() errorCustomClass: string = '';
    errorMsgShow: string;
    config;
    logger: Logger;
    constructor(config: ConfigService, _logger: Logger, public utilsService: UtilsService) {
        this.config = config;
        this.logger = _logger;
    }


    ngAfterContentInit() {
        if (this.elementControl) {
            this.elementControl.statusChanges.subscribe(() => {
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
            });
        }

    }

}



@NgModule({
    imports: [FormsModule, CommonModule, ReactiveFormsModule, SharedModule],
    declarations: [ErrorComponent],
    exports: [ErrorComponent, SharedModule]
})
export class ErrorModule { }
