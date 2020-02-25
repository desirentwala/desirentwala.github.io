import { EventService } from '../../services/event.service';
import { UtilsService } from '../utils/utils.service';
import { SharedModule } from './../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges, OnInit } from '@angular/core';
import { UiMiscModule } from '../misc-element/misc.component';
import { TooltipModule } from "../tooltip/index";
@Component({

  selector: 'button-field',
  templateUrl: './button.html',
})

export class ButtonComponent implements OnInit, OnChanges {
  @Input() parentIndex;
  @Input() indexes;
  @Input() superParentIndex;
  @Input() buttonType: string = '';
  @Input() buttonName: string = '';
  @Input() buttonClass: string = 'btn btn-default';
  @Input() public isDisabled: boolean = false;
  @Input() clickId: string;
  @Input() iconClass: string;
  @Input() clickParam: any;
  @Input() tooltipPlacement: string = 'right';
  @Input() tooltipTitle: string;
  @Input() hasImageIcon: boolean = false;
  @Input() customImageIconClass: any = '';
  @Input() imgIconSrc: string = '';
  @Input() btnTitle: any;
  prevButtonName: string;
  utils: UtilsService;
  eventHandler: EventService;
  constructor(_util: UtilsService, _eventHandler: EventService) {
    this.utils = _util;
    this.eventHandler = _eventHandler;
  }
  ngOnInit() {
    this.prevButtonName = this.buttonName;
    if(this.btnTitle === undefined){ 
      this.btnTitle = '';
    }
  }
  ngOnChanges(changes?) {
    if (this.prevButtonName !== this.buttonName) {
      this.prevButtonName = this.buttonName;
    }
  }

  buttonClick() {
    if (!this.isDisabled) {
      if (this.clickParam !== undefined) {
        this.eventHandler.setEvent('click', this.clickId, this.clickParam);
      } else {
        this.eventHandler.setEvent('click', this.clickId, { 'index': this.indexes - 1, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
      }
    }
  }
}

export const UI_BUTTON_DIRECTIVES = [ButtonComponent];
@NgModule({
  declarations: UI_BUTTON_DIRECTIVES,
  imports: [CommonModule, SharedModule, TooltipModule, UiMiscModule],
  exports: [UI_BUTTON_DIRECTIVES, SharedModule],
})
export class UiButtonModule { }