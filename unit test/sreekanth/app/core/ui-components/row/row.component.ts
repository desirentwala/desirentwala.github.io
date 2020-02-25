import { AfterContentInit, Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'ncp-row',
    templateUrl: 'row.html'
})
export class RowComponent implements AfterContentInit {
    @Input() rowClass: any = '';

    ngAfterContentInit() {
        this.rowClass = this.rowClass ? this.rowClass : '';
    }
}


@NgModule({
    imports: [CommonModule],
    exports: [RowComponent],
    declarations: [RowComponent]
})
export class UiRowModule { }
