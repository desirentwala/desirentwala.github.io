import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  SimpleChange,
  ElementRef,
  forwardRef,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TooltipModule } from '@swimlane/ngx-charts/release';

import { ConfigService } from '../../services/config.service';
import { EventService } from '../../services/event.service';
import { LabelModule } from '../label/label.component';
import { UiMiscModule } from '../misc-element/misc.component';
import { ModalModule } from '../modal/index';
import { UiTabModule } from '../tab/tabset';
import { SharedModule } from './../../shared/shared.module';
import { UiButtonModule } from './../button/button.component';
@Component({
  selector: 'ncp-password-strength-bar',
  templateUrl: './PasswordStrenghtBar.html'

})
export class PasswordStrengthBarComponent implements OnChanges {
  @Input() passwordToCheck: string;
  public colors: any = ['#D9534F', '#DF6A4F', '#E5804F', '#EA974E', '#F0AD4E', '#D2AF51', '#B5B154', '#97B456', '#7AB659', '#5CB85C', '#5CB85C'];
  public color = '#D9534F';
  // public message: string = "NCPLabel.passwordConditions";
  public symbool: Boolean = false;
  public nucbool: Boolean = false;
  public numbool: Boolean = false;
  public repeated:Boolean = false;
  public samechar:Boolean = false;
  private value: string;
  public width = 1;
 
  private static measureStrength(p: string) {
    let _force = 0;
    const _regex = /[$-/:-?{-~!"^_`\[\]]/g; // "

    const _lowerLetters = /[a-z]+/.test(p);
    const _upperLetters = /[A-Z]+/.test(p);
    const _numbers = /[0-9]+/.test(p);
    const _symbols = _regex.test(p);

    const _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];

    let _passedMatches = 0;
    for (let _flag of _flags) {
      _passedMatches += _flag === true ? 1 : 0;
    }

    _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
    _force += _passedMatches * 10;

    // penality (short password)
    _force = (p.length <= 8) ? Math.min(_force, 10) : _force;

    // penality (poor variety of characters)
    _force = (_passedMatches === 1) ? Math.min(_force, 10) : _force;
    _force = (_passedMatches === 2) ? Math.min(_force, 20) : _force;
    _force = (_passedMatches === 3) ? Math.min(_force, 40) : _force;

    return _force;

  }

  private getColor(s: number) {
    let idx = 0;
    if (s <= 10) {
      idx = 0;
    }
    else if (s <= 20) {
      idx = 1;
    }
    else if (s <= 30) {
      idx = 2;
    }
    else if (s <= 40) {
      idx = 3;
    }
    else {
      idx = 4;
    }
    return {
      idx: idx + 1,
      col: this.colors[idx]
    };
  }


  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    let password = changes['passwordToCheck'].currentValue;
    
    this.onKey(password);
    
  }
  
  onKey(event: any) {
    if (event) {
      this.value = event;
    } else {
      this.value = '';
    }
    // Additions :-D
    let noc = this.value.length; // Number of Characters
    let nuc = this.value.replace(/[^A-Z]/g, "").length; // Uppercase Letters
    let nlc = this.value.replace(/[^a-z]/g, "").length; // Lowercase Letters
    let num = this.value.replace(/[^0-9]/g, "").length; // Numbers
    let symr: number;
    this.samechar=this.value.match(/(.)\1{2}/) ? true : false;
    let sym = this.value.match(/[ !@#$£%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g); // Symbols
    if (!sym) { symr = 0 } else { symr = sym.length };

    // Deductions :-(
    let aucr: number; // Letters Only Resolver
    let auc = this.value === this.value.toUpperCase(); if (auc == false) { aucr = noc } else { aucr = 0 }; // Letters Only
    let anvr: number; // Number Only Resolver
    let anv = +this.value; if (anv !== NaN || anv !== 0) { anvr = noc } else { anvr = 0 }; // Numbers Only
    let cons: number; // Repeat Characters Resolver
    if (this.value.match(/(.)\1\1/)) { cons = noc * noc } else { cons = 0 } // Repeat Characters
    // The MF math
    let additions = ((noc * 5) + ((noc - nuc) * 2) + ((nlc - nuc) * 2) + (num * 4) + ((symr) * 6));
    let deductions = ((aucr) + (anvr) + cons);
    let total = additions - deductions;
    if (sym == null) {
      this.symbool = false;
    } else {
      this.symbool = true;
    }
    if (nuc == 0) {
      this.nucbool = false;
    } else {
      this.nucbool = true;
    }
    if (num == 0) {
      this.numbool = false;
    } else {
      this.numbool = true;
    }
    if(this.samechar){
      this.repeated = false;
    }else{
      this.repeated = true;
      }
    
    if (total < 50) {
      if (total < 0) {
        this.width = 1;
      } else {
        this.width = total;
      }
    } else {
      if(this.symbool && this.numbool && this.nucbool && (total>80) ){
        this.width = 100;
      }
      else if(this.symbool && this.numbool && this.nucbool && (total<80) &&(total>65) ){
        this.width = 80;
      }
      else if(this.symbool && this.numbool && this.nucbool && (total<65) ){
        this.width = total;
      }
      
      else if(((this.symbool && this.numbool) ||(this.numbool && this.nucbool)||(this.symbool && this.nucbool))  &&(total<80) )
        {
          this.width= total;
        }
      
      else{
        this.width= 60;
      }
      
    }
    this.updateBar();
  }
  updateBar() {
    var i = Math.round(this.width / 10);
    this.color = this.colors[i];
  }
}
export const UI_PWDSTRBAR_DIRECTIVES = [PasswordStrengthBarComponent];
@NgModule({
  declarations: UI_PWDSTRBAR_DIRECTIVES,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, TooltipModule, SharedModule, UiButtonModule, ModalModule, UiMiscModule, LabelModule, UiTabModule],
  exports: [UI_PWDSTRBAR_DIRECTIVES, SharedModule],
})
export class UIPasswordStrengthBarModule { }