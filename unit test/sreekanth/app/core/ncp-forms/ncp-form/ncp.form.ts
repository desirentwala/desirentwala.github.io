import { FormGroup } from '@angular/forms';
import { NCPFormUtilsService } from '../ncp.form.utils';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    AfterViewInit
} from '@angular/core';
import { Logger } from '../../ui-components/logger/logger';
import { ConfigService } from '../../services/config.service';

@Component({
    selector: 'ncp-form',
    templateUrl: 'ncp.form.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NCPFormComponent implements OnChanges, AfterViewInit {
    @Input() formData: any;
    @Input() makeElementsDraggable: boolean = false;
    formName: FormGroup;
    logger: Logger;
    formElements: any;
    isEditorMode: boolean;
    eventArray: Array<any> = [];
    show: boolean = false;
    public editorMode: boolean = false;
    constructor(_logger: Logger, public changeRef: ChangeDetectorRef, public formUtils: NCPFormUtilsService, public config: ConfigService) {
        this.logger = _logger;
    }

    ngOnChanges(changes?) {
        if (this.formData) {
            this.formName = this.formData['formName'] ? this.formData['formName'] : null;
            this.editorMode = this.config.getCustom('editorMode') ? this.config.getCustom('editorMode') : false;
            if (this.formName) {
                this.formUtils.setMainFormGroup(this.formName);
                if (this.formData['elementList']) {
                    this.formElements = this.formData['elementList'];
                    this.show = true;
                }
            } else {
                this.show = false;
            }
            this.logger.info('NCP Form with form group => ' + this.formName);
            this.formUtils.eventArray = [];
            this.eventArray = this.formUtils.createEventArray(this.formData);
        }
        this.isEditorMode = this.config.getCustom('editorMode');
        this.changeRef.detectChanges();
    }
    ngAfterViewInit() {
        this.formUtils.loadedSub.next(this.formUtils.getMainFormGroup());
    }
}