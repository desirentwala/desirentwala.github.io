import { Directive, HostListener, ElementRef, Input, OnInit } from '@angular/core';
import { checkUKTelephone  } from './mobileNoValidator';

const telNumberErrors: any = [];
telNumberErrors[1] = 'Telephone number not provided';
telNumberErrors[2] = 'UK telephone number without the country code, please';
telNumberErrors[3] = 'UK telephone numbers should contain 10 or 11 digits';
telNumberErrors[4] = 'The telephone number should start with a 0';
telNumberErrors[5] = 'The telephone number is either invalid or inappropriate';

@Directive({
  selector: '[appPhoneNumber]'
})

export class PhoneNumberDirective {
  @Input() tempclass: any;
  nativeElement: any = '';
  parentNode: any= '';
  span: any = '';
  node: any = '';

  constructor(private el: ElementRef) {
    this.nativeElement = this.el.nativeElement;
    this.parentNode = this.nativeElement.parentNode;
  }

  @HostListener('keyup', ['$event'])
    public onKeyUp(event: any): void {
      this.chkPattern(event);
  }

  chkPattern(event: any): void {
    const eventLen = event.target.value.length;
    const value = event.target.value;
    if (eventLen === 0) {
      console.log('empty');
      this.removeErrorMessage();
    } else {
      if (checkUKTelephone(value) === true) {
        this.removeErrorMessage();
      } else {
        this.removeErrorMessage();
        const ind: any = checkUKTelephone(value);
        this.span = document.createElement('small');
        this.node = document.createTextNode(telNumberErrors[ind]);
        this.span.className = 'text-danger error-message ' + this.tempclass;
        this.span.appendChild(this.node);
        if(this.parentNode){
          this.parentNode.insertBefore(this.span, this.nativeElement.nextSibling);
        }
      }
    }
  }

  public removeErrorMessage(): void {
    if(this.parentNode){
     var arraylength = this.parentNode.children.length;
    }
    const childrenLen = arraylength;
    for (let i = 0; i < childrenLen; i++) {
      if (this.parentNode.children[i] !== undefined &&
        'text-danger error-message ' + this.tempclass === this.parentNode.children[i].className) {
        this.parentNode.removeChild(this.parentNode.children[i]);
      }
    }
  }
}
