import { ClickOutSideModule } from '../directives/clickOutside.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { Tooltip } from './Tooltip';
import { TooltipContent } from './TooltipContent';

export * from './Tooltip';
export * from './TooltipContent';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ClickOutSideModule
    ],
    declarations: [
        Tooltip,
        TooltipContent,
    ],
    exports: [
        Tooltip,
        TooltipContent,
        SharedModule
    ],
    entryComponents: [
        TooltipContent
    ]
})
export class TooltipModule {

}