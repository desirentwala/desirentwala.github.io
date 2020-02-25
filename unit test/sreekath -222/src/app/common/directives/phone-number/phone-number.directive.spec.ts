import { PhoneNumberDirective } from './phone-number.directive';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule,  } from "@angular/router/testing";
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockElementRef } from '../phone-number/mockElementRef';
describe('PhoneNumberDirective', () => {
    let phoneNumberDirective : PhoneNumberDirective;
    beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [ PhoneNumberDirective ],
          imports: [HttpClientTestingModule,RouterTestingModule], 
          providers: [ PhoneNumberDirective,{provide: ElementRef, useClass: MockElementRef},
          ],
        })
        phoneNumberDirective = TestBed.get(PhoneNumberDirective);
        
        });  
  it('should create an instance', () => {
    const directive = PhoneNumberDirective;
    expect(directive).toBeTruthy();
  });
  it('should create an instance of OnKepUp', () => {
    const Event = {target:{value: 100}} 
    const directive = PhoneNumberDirective;
    expect(directive.prototype.onKeyUp(Event)).not.toBeNull();
  });
  it('should create an instance of removeErrorMessage', () => {
    var nativeElement: any = 'test';
    var parentNode: any= 'test';
    var span: any = 'test';
    var node: any = 'test';
    const directive = PhoneNumberDirective;
    directive[parentNode] = parentNode;
    expect(directive.prototype.removeErrorMessage()).not.toBeNull();
  });
  
});
