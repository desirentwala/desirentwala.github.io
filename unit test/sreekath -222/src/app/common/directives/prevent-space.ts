import { Directive, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[preventWhiteSpace]'
})
export class PreventSpaceDirective {

  @HostListener('keypress', ['$event'])
  public onKeyDown(event: any): void {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  }
}
