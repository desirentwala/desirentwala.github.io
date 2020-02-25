import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NCPWalkThroughElementComponent } from './ncp-walkthrough-element/ncp.walkthrough.element';
import { UiWalkthroughModule } from './ncp-walkthrough-core';
import { CoreModule } from '..';


@NgModule({
    imports: [CommonModule, UiWalkthroughModule, CoreModule ],
    declarations: [NCPWalkThroughElementComponent],
    exports: [NCPWalkThroughElementComponent ],
    providers: []
})

export class NCPWalkthroughElementModule { }
