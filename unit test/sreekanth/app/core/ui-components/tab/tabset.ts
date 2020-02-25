import {
  Component,
  Input,
  Output,
  ContentChildren,
  HostListener,
  EventEmitter
} from '@angular/core';

import { Tab } from './tab';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/core/ui-components/common/shared';

@Component({
  selector: 'tabset',
  template: `
    <section class="tab-set pull-left bg-even p30 w100p mb10">
     <div class=" col-md-3 col-sm-4 col-xs-12 pl0"> <ul
        class="paymentTypeLists"
        [class.tab-set_nav-pills]="vertical"
        [class.tab-set_nav-tabs]="!vertical">
        <li
          *ngFor="let tab of tabs"
          [class.selected]="tab.active">
          <a
            (click)="tabClicked(tab)"
            
            [class.disabled]="tab.disabled">
            <span>{{tab.title}}</span>
          </a>
        </li>
      </ul>
      </div>
      <div class="tab-set_tab-content col-md-9 col-sm-8 col-xs-12 paymentContainer">
        <div><ng-content></ng-content></div>
      </div>
    </section>
  `
})
export class Tabset {

  @Input() vertical;
  @Output() onSelect = new EventEmitter();
  @ContentChildren(Tab) tabs;

  ngAfterContentInit() {
    const tabs = this.tabs.toArray();
    const actives = this.tabs.filter(t => { return t.active });

    if(actives.length > 1) {
      console.error(`Multiple active tabs set 'active'`);
    } else if(!actives.length && tabs.length) {
      tabs[0].active = true;
    }
  }

  tabClicked(tab) {
    const tabs = this.tabs.toArray();

    tabs.forEach(tab => tab.active = false);
    tab.active = true;

    this.onSelect.emit(tab);
  }

}

export const TAB_COMPONENTS = [
  Tabset,
  Tab
];

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, SharedModule],
    exports: [TAB_COMPONENTS],
    declarations: [TAB_COMPONENTS]
})
export class UiTabModule { }