import { Component, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit, ChangeDetectorRef, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { WizardStepComponent } from './wizard-step.component';
import { EventService } from '../../services/event.service';
import { UtilsService } from '../utils/utils.service';
import { DOCUMENT } from '@angular/platform-browser';
import { Logger } from '../logger';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'navigator',
  templateUrl: './wizard.component.html'
})
export class WizardComponent implements AfterContentInit, OnDestroy, OnInit {
  @ContentChildren(WizardStepComponent)
  wizardSteps: QueryList<WizardStepComponent>;

  private _steps: Array<WizardStepComponent> = [];
  private _isCompleted: boolean = false;

  @Output()
  onStepChanged: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();
  eventHandler: EventService;
  public utils: UtilsService;
  @Input() eventNextStepId: string;
  @Input() eventPreviousStepId: string;
  @Input() eventDoCheckForNext: string;
  @Input() nextButtonTemplate: string;
  @Input() nextBtnNavigatorImageSrc: string;
  @Input() prevButtonTemplate: string;
  @Input() prevBtnNavigatorImageSrc: string;
  @Input() navButtonPosition: string;
  @Input() prevButtonPosition: string;
  @Input() nextButtonPosition: string;
  @Input() screenManipulatorConfig;
  @Input() elementId: string;
  @Input() doShowStepTitles: boolean;
  @Input() hasClickableStepTitles: boolean;
  @Input() doShowProgressBar: boolean;
  @Input() helpBtnImageSrc: string;
  @Input() doShowCompleteBtn: boolean;
  @Input() progressOffset: number;
  stepsBuffer: WizardStepComponent[] = [];
  progressValue: number = 0;
  numOfStepsNavigated: number = 0;

  constructor(public _logger: Logger, _utils: UtilsService, _eventHandler: EventService, public changeRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document, public shared: SharedService) {
    this.utils = _utils;
    this.eventHandler = _eventHandler;
  }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => this._steps.push(step));
    this.steps[0].isActive = true;
    if (!this.utils.config.getCustom('editorMode')) {
      document.getElementById('wrapper').style.maxWidth = '100%';
    } else {
      this.doShowProgressBar = false;
    }
    if (Object.keys(this.activeStep.screenManipulatorConfig).length > 0) this.activeStep.shared.doTriggerScreenManipulatorEvent(this.activeStep.screenManipulatorConfig);
    else if (Object.keys(this.screenManipulatorConfig).length > 0) this.shared.doTriggerScreenManipulatorEvent(this.screenManipulatorConfig);
    this.progressValue += this.progressOffset;
  }

  get steps(): Array<WizardStepComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  get isCompleted(): boolean {
    return this._isCompleted;
  }

  get activeStep(): WizardStepComponent {
    return this.steps.find(step => step.isActive);
  }

  set activeStep(step: WizardStepComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
      // this.onStepChanged.emit(step);
      this.subscribeToNavigateNext();
    }
  }

  public get activeStepIndex(): number {
    return this.steps.indexOf(this.activeStep);
  }

  get hasNextStep(): boolean {
    return this.activeStepIndex < this.steps.length - 1;
  }

  public getStepById(id: string): WizardStepComponent {
    return this.steps.find(step => step.stepId === id);
  }

  get hasPrevStep(): boolean {
    return this.activeStepIndex > 0;
  }

  public goToStep(step: WizardStepComponent): void {
    if (!this.isCompleted) {
      this.activeStep = step;
    }
  }

  public next(fromHTML: boolean = true): void {
    if ((this.steps[this.activeStepIndex].doValidate && this.steps[this.activeStepIndex].isValid) || !this.steps[this.activeStepIndex].doValidate) {
      if (this.hasNextStep) {
        this.pushStepIntoBuffer();
        let currentStep: WizardStepComponent = this.steps[this.activeStepIndex];
        let nextStep: WizardStepComponent;
        if (currentStep.doCheckForNext && fromHTML) {
          this.eventHandler.setEvent('onDoCheckForNext', this.eventDoCheckForNext, { ui: currentStep });
        }
        if (currentStep.nextStepId) {
          nextStep = this.getStepById(currentStep.nextStepId);
        } else {
          nextStep = this.steps[this.activeStepIndex + 1];
        }
        // this.activeStep.onNext.emit();
        nextStep.isDisabled = false;
        this.activeStep = nextStep;
        this.eventHandler.setEvent('onNextStep', this.eventNextStepId, { ui: this.activeStep });
        this.changeRef.markForCheck();
        this.progressValue = this.progressOffset + (((++this.numOfStepsNavigated) / this.steps.length) * 100);
        if (Object.keys(this.activeStep.screenManipulatorConfig).length > 0) this.activeStep.shared.doTriggerScreenManipulatorEvent(this.activeStep.screenManipulatorConfig);
        else if (Object.keys(this.screenManipulatorConfig).length > 0) this.shared.doTriggerScreenManipulatorEvent(this.screenManipulatorConfig);
      }
    }
  }

  public previous(): void {
    if (this.hasPrevStep) {
      let currentStep: WizardStepComponent = this.steps[this.activeStepIndex];
      // let prevStep: WizardStepComponent = this.steps[this.activeStepIndex - 1];
      let prevStep: WizardStepComponent = this.stepsBuffer.pop();
      // this.activeStep.onPrev.emit();
      prevStep.isDisabled = false;
      this.activeStep = prevStep;
      this.eventHandler.setEvent('onPreviousStep', this.eventPreviousStepId, { ui: currentStep });
      this.progressValue = this.progressOffset + (((--this.numOfStepsNavigated) / this.steps.length) * 100);
      if (Object.keys(this.activeStep.screenManipulatorConfig).length > 0) this.activeStep.shared.doTriggerScreenManipulatorEvent(this.activeStep.screenManipulatorConfig);
      else if (Object.keys(this.screenManipulatorConfig).length > 0) this.shared.doTriggerScreenManipulatorEvent(this.screenManipulatorConfig);
    }
  }

  public subscribeToNavigateNext() {
    this.activeStep.onGoToStepIdWithoutNavigateButton.observers.pop();
    this.activeStep.onGoToStepIdWithoutNavigateButton.subscribe(() => {
      this.next(false);
    });
  }

  public complete(): void {
    this.activeStep.onComplete.emit();
    this._isCompleted = true;
  }

  private pushStepIntoBuffer() {
    let bufferIndex = this.getStepByIdFromStepsBuffer(this.steps[this.activeStepIndex]);
    if (bufferIndex > -1) this.stepsBuffer.splice(bufferIndex, this.stepsBuffer.length - (bufferIndex + 1))
    else this.stepsBuffer.push(this.steps[this.activeStepIndex]);
  }

  private getStepByIdFromStepsBuffer(step: WizardStepComponent): number {
    for (let i = 0; i < this.stepsBuffer.length; i++) {
      if (this.stepsBuffer[i].stepId === step.stepId) return i;
    }
    return -1;
  }
  ngOnDestroy() {
    this.shared.doTriggerScreenManipulatorEvent();
  }

  ngOnInit() {
    this.utils.navigatorSub.subscribe(data => {
      if (data && data['id'] === this.elementId) {
        if (data.direction === 'PREV' && this.hasPrevStep) {
          this.previous();
        }
        if (data.direction === 'NEXT' && this.hasNextStep) {
          this.next(false);
        }
      }
    });
  }
}
