import { ChangeDetectorRef, Component, HostBinding, Inject, Input, OnDestroy, OnInit } from '@angular/core';

import { AccordionComponent } from './accordion.component';
import { UtilsService } from '../utils/utils.service';

/* tslint:disable:component-selector-name */
@Component({
  selector: 'accordion-group, accordion-panel',
  templateUrl: './accordion-group.component.html'
})
export class AccordionPanelComponent implements OnInit, OnDestroy {
  @Input() public heading: string;
  @Input() public panelClass: string;
  @Input() public isDisabled: boolean;
  @Input() public iconClass: string = '';
  @Input() public isStriked: boolean = false;
  @Input() public indexes: string;
  @Input() public showIndex: boolean = false;
  @Input() public offset : number = 0;
  
  public utils: UtilsService;
  // Questionable, maybe .panel-open should be on child div.panel element?
  @HostBinding('class.panel-open')
  @Input()
  public get isOpen(): boolean {
    return this._isOpen;
  }

  public set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.accordion.closeOtherPanels(this);
    }
  }

  _isOpen: boolean;
  public accordion: AccordionComponent;

  public constructor( @Inject(AccordionComponent) accordion: AccordionComponent, _utils: UtilsService, public changeRef: ChangeDetectorRef) {
    this.accordion = accordion;
    this.utils = _utils;
  }

  public ngOnInit(): any {
    this.panelClass = this.panelClass || 'panel-default';
    this.accordion.addGroup(this);
    // if (this.heading) {
    // this.heading = this.utils.getTranslated(this.heading);
    // }
    this.changeRef.detectChanges();
  }

  public ngOnDestroy(): any {
    this.accordion.removeGroup(this);
  }

  public toggleOpen(event: MouseEvent): any {
    event.preventDefault();
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
      this.changeRef.detectChanges();
    }
  }
}
