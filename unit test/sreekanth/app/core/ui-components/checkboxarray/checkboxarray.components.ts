import { Component, Input, NgModule} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiCheckboxModule } from '../checkbox/index';
import { UtilsService } from '../utils/utils.service';
import { TooltipModule } from "../tooltip/index";
import { EventService } from '../../services/event.service';
const noop = () => {
};
@Component({
    
    selector: 'multi-check',
    templateUrl: './checkboxarray.html'
})
export class CheckboxArray{
   @Input() elementId: string;
   @Input() checkboxArray: any[] = [];  
   @Input() separator: any = '';
   @Input() tooltipPlacement: string = 'right';
   @Input() tooltipTitle: string;
   @Input() changeId: string;
   @Input() indexes;
   @Input() parentIndex;
   @Input() superParentIndex;
   public innerValue;
   eventHandler: EventService;
   public onChangeCallback: (_: any) => void = noop;

setCheckBoxValue(item) {

    this.eventHandler.setEvent('change', item.changeId, {'innerValue': item.elementControl.value, 'index': this.indexes - 1, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
}
constructor(_eventHandler: EventService) {
    this.eventHandler = _eventHandler;
}
}
@NgModule({
    imports: [FormsModule, CommonModule, ReactiveFormsModule,UiCheckboxModule,TooltipModule],
    declarations: [CheckboxArray],
    exports: [CheckboxArray]
})
export class CheckboxarrayModule { }
