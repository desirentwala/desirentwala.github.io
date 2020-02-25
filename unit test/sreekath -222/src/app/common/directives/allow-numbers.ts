import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[numbersOnly]'
})
export class OnlynumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event'])
  public onKeyPress(event: any): any {
    if (event.keyCode < 48 || event.keyCode > 57) {
      event.preventDefault();
    }
  }
}
