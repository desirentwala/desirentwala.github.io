import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventService } from '../../services/event.service';
import { SharedModule } from '../../shared/shared.module';
import { TooltipModule } from '../tooltip';


@Component({
  selector: 'counter',
  templateUrl: './counter.html'
})
export class CounterComponent implements OnInit, AfterViewInit, AfterContentInit {
  @Input() elementId: string;
  @Input() counterMin;
  @Input() counterMax;
  @Input() tooltipTitle: string;
  @Input() tooltipPlacement: string = 'right';
  @Input() acceptPattern: any = /^[1-9][0-9]*$/;
  @Input() inputType: string;
  @Input() changeId: string;
  @Input() fieldTabId: any;
  @Input() elementLabel: string;
  @Input() mandatoryFlag: string; 
  @Input() placeholder: string = '';
  @Input() customFlag: boolean = false;
  @Input() wrapperClass: string = '';
  @Input() incrementBtnText: string = '';
  @Input() decrementBtnText: string = '';
  eventHandler;
  disabled: boolean = false;
  invalidFlag: boolean = false;
  @Input() elementControl: FormControl;
  counterValue: number = 0;
  public innerValue;
  constructor(public event: EventService, public ele: ElementRef, public ref: ChangeDetectorRef) {
    this.eventHandler = event;
  }

  ngOnInit() {
    this.elementControl.valueChanges.subscribe(data => {
      this.counterValue = typeof data === 'number' && data < 1 ? 0 : data;
      this.invalidFlag = false;
    });
    this.counterValue = this.elementControl.value      
  }

  ngAfterContentInit() {
    if (!this.inputType) {
      this.inputType = 'text';
    }
  }
  ngAfterViewInit() {
    this.eventHandler.validateTabSub.subscribe((data) => {
      if (this.fieldTabId === data['id']) {
        if (this.elementControl.invalid) {
          this.invalidFlag = true;
          this.ref.markForCheck();
        }else if (this.elementControl.valid) {
          this.invalidFlag = false;
          this.ref.markForCheck();
        }
      }
    });
  }
  onInputText(event) {
    let target = event.srcElement || event.target;
    if (this.acceptPattern) {
      let pattern: RegExp = new RegExp(<RegExp>this.acceptPattern);
      let validValue = '';
      if (target.value) {
        for (let i = 1; i <= target.value.length; i++) {
          let elementValue = target.value;
          let slicedValue = elementValue.slice(0, i);
          if (!pattern.test(slicedValue)) {
            target.value = validValue;
            this.elementControl.patchValue(validValue);
            this.elementControl.updateValueAndValidity();
          } else {
            validValue = slicedValue;
          }
        }
      }
    }
  }

  increment() {
    this.counterValue = this.elementControl.value;
    this.counterValue++;
    this.elementControl.patchValue(this.counterValue);
    if (!this.elementControl.dirty) {
      this.elementControl.markAsDirty();
      this.elementControl.markAsTouched();
    }
    this.elementControl.updateValueAndValidity();
    this.changeInValue();
  }

  decrement() {
    this.counterValue = this.elementControl.value;
    this.counterValue--;
    this.elementControl.patchValue(this.counterValue);
    if (!this.elementControl.dirty) {
      this.elementControl.markAsDirty();
      this.elementControl.markAsTouched();
    }
    this.elementControl.updateValueAndValidity();
    this.changeInValue();
  }

  isdisabled1() {
    if (this.elementControl.disabled) {
      return true;
    } else {
      if (this.counterValue <= this.counterMax) {
        return false;
      }
      return true;
    }
  }

  isdisabled2() {
    if (this.elementControl.disabled) {
      return true;
    } else {
      if (this.counterValue <= this.counterMin) {
        return true;
      }
      return false;
    }
  }
  changeInValue() {
    this.eventHandler.setEvent('change', this.changeId, this.elementControl.value);
  }
}

@NgModule({
  imports: [SharedModule, FormsModule, CommonModule, ReactiveFormsModule, TooltipModule],
  declarations: [CounterComponent],
  exports: [CounterComponent]
})
export class UiCounterModule { }