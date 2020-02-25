import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from '@adapters/packageAdapter';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'navigator-step',
  template:
    `
    <div class="animated" [class.hide]="!isActive" [ngClass]="animationClass" [class.radio-btn]="isActive" [class.stepDeactivate]="!isActive">
      <ng-content></ng-content>
    </div>
  `
})
export class WizardStepComponent {
  @Input() stepTitle: string;
  @Input() stepId: string;
  @Input() hidden: boolean = false;
  @Input() isValid: boolean = true;
  @Input() showNext: boolean = true;
  @Input() showPrev: boolean = true;
  @Input() eventValidateStepId: string;
  @Input() nextStepId: string = '';
  @Input() doCheckForNext: boolean = false;
  @Input() doValidate: boolean = true;
  @Input() animationClass: string = ' ';
  @Input() nextStepButtonName: string = '';
  @Input() prevStepButtonName: string = '';
  @Input() screenManipulatorConfig;
  @Output() onNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPrev: EventEmitter<any> = new EventEmitter<any>();
  @Output() onComplete: EventEmitter<any> = new EventEmitter<any>();

  onGoToStepIdWithoutNavigateButton = new Subject<any>();
  private _isActive: boolean = false;
  private _goToStepIdWithoutNavigateButton: any;
  isDisabled: boolean = true;

  constructor(private ref: ChangeDetectorRef, public shared: SharedService) { }
  @Input('isActive')
  set isActive(isActive: boolean) {
    this._isActive = isActive;
    this.isDisabled = false;
    this.ref.detectChanges();
  }

  get isActive(): boolean {
    return this._isActive;
  }

  @Input('goToStepIdWithoutNavigateButton')
  set goToStepIdWithoutNavigateButton(doNavigate: any) {
    if (typeof doNavigate !== 'boolean') {
      this._goToStepIdWithoutNavigateButton = doNavigate;
      this.onGoToStepIdWithoutNavigateButton.next();
    }
  }

  get goToStepIdWithoutNavigateButton(): any {
    return this._goToStepIdWithoutNavigateButton;
  }
}
