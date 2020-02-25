import { Component, Input, NgModule, OnInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@Component({
 
  selector: 'table-simple',
  templateUrl: './table.simple.html'
})

export class TableSimple implements OnChanges {
  @Input() elementId: string;
  @Input() tableData: Object;
  @Input() mappingList: string[];
  @Input() headerList: string[];
  @Input() hasCustomProperties: boolean = false;
  colspan: number;
   ngOnChanges(): void {
    if (this.hasCustomProperties) {
      this.colspan = this.headerList.length;
    }
  }
}
const UI_TABLE_SIMPLE_DIRECTIVES = [TableSimple];

@NgModule({
  declarations: UI_TABLE_SIMPLE_DIRECTIVES,
  imports: [CommonModule, FormsModule, SharedModule],
  exports: UI_TABLE_SIMPLE_DIRECTIVES,
})

export class UiTableSimpleModule { }