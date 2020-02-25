import { NCPFormUtilsService } from './ncp.form.utils';
import { AllUiComponents } from '../ui-components/all.uicomponents.module';
import { NCPElementComponent } from './ncp-element/ncp.element';
import { NCPFormComponent } from './ncp-form/ncp.form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EventComposerModule } from '../dynamic-events/eventComposer.module';
import { NgxDnDModule } from '@swimlane/ngx-dnd';


@NgModule({
    imports: [AllUiComponents, CommonModule, FormsModule, ReactiveFormsModule, EventComposerModule, NgxDnDModule],
    declarations: [NCPFormComponent, NCPElementComponent],
    exports: [NCPFormComponent, NCPElementComponent],
    providers: [NCPFormUtilsService]
})

export class NCPFormModule { }
