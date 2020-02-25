import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../ncpapp.core.module';
import { EventComponent } from './event.component';
import { EventComposerService } from './eventComposer.service';


@NgModule({
    imports: [CommonModule,  CoreModule],
    exports: [EventComponent],
    declarations: [EventComponent],
    providers: [EventComposerService]
})
export class EventComposerModule { };
