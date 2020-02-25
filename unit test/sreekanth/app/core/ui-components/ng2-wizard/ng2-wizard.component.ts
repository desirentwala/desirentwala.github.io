import { DOCUMENT } from '@angular/platform-browser';
import {
    ChangeDetectorRef,
    Component,
    ContentChildren,
    DoCheck,
    HostListener,
    Inject,
    Input,
    OnChanges,
    QueryList,
    SimpleChange,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { Logger } from '../../../core/ui-components/logger/logger';
import { EventService } from '../../services/event.service';
import { UtilsService } from '../utils/utils.service';
import { Ng2WizardStep } from './ng2-wizard-step.component';
import { Ng2WizardTab } from './ng2-wizard-tab.component';
import { INg2WizardConfig } from './ng2-wizard.config';
import { SharedService } from '../../shared/shared.service';

@Component({
    selector: 'ng2-wizard',
    templateUrl: './ng2-wizard.component.html'
})
export class Ng2Wizard implements OnChanges, DoCheck, OnDestroy, OnInit {

    // represents the user's config values
    @Input()
    public config: INg2WizardConfig;
    @Input() previousTabButton: string;
    @Input() nextTabButton: string;
    @Input() disableNext: boolean;
    @Input() disableStickNavButtons: boolean = false;
    @Input() makeNavigationStepsSticky: boolean = false;
    @Input() public screenManipulatorConfig: any = {};
    @Input() public navigateOnLoadTabIndex: number = 0;
    @Input() public headerInputs: any = [];
    @Input() public doNavigateOnTabClick: boolean = false;
    isFirstStepActive: boolean = false;
    stickTabNav: boolean = false;
    stickTabNavButtons: boolean = false;
    public utils: UtilsService;
    public defaultConfig: INg2WizardConfig = {
        'showNavigationButtons': true,
        'navigationButtonLocation': 'bottom',
        'preventUnvisitedTabNavigation': true,
        'isValidateTabNavigation': true,
        'showProgress': true
    };

    public combinedConfig: INg2WizardConfig = this.defaultConfig;
    @Input() eventValidateTabId: string;
    @Input() eventNextTabId: string;
    @Input() eventPreviousTabId: string;
    @Input() eventNextStepId: string;
    @Input() eventPreviousStepId: string;
    @Input() eventTabChangeId: string;
    @Input() elementId: string;
    eventHandler: EventService;
    @ContentChildren(Ng2WizardTab)
    tabs: QueryList<Ng2WizardTab>;
    public get steps(): Array<Ng2WizardStep> {
        let steps: Array<Ng2WizardStep> = new Array<Ng2WizardStep>();

        this.tabs.forEach((tab) => {
            steps = steps.concat(tab.steps.toArray());
        });

        return steps;
    }

    // Allow usage of enum in template
    public navigationDirection = NavigationDirection;

    public get activeStep(): Ng2WizardStep {
        return this.steps.find(step => step.active);
    }

    public get currentStepIndex(): number {
        return this.steps.indexOf(this.activeStep);
    }

    public get currentTab(): Ng2WizardTab {
        return this.tabs.toArray().find(tab => tab.active);
    }

    public get hasNextStep(): boolean {
        return this.currentStepIndex < this.steps.length - 1;
    }

    public get hasPreviousStep(): boolean {
        return this.currentStepIndex > 0;
    }

    /* Configuration Properties */

    public get showTopNavigationButtons(): boolean {
        return this.combinedConfig.showNavigationButtons &&
            (this.combinedConfig.navigationButtonLocation === 'top' || this.combinedConfig.navigationButtonLocation === 'both');
    }

    public get showBottomNavigationButtons(): boolean {
        return this.combinedConfig.showNavigationButtons &&
            (this.combinedConfig.navigationButtonLocation === 'bottom' || this.combinedConfig.navigationButtonLocation === 'both');
    }

    public get showProgress(): boolean {
        return this.config.showProgress;
    }

    constructor(public sharedService: SharedService, public _logger: Logger, _utils: UtilsService, _eventHandler: EventService, public changeRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: Document) {
        this.utils = _utils;
        this.eventHandler = _eventHandler;
    }

    public ngOnChanges(changes?): void {
        this.verifyConfig();
        this.combineConfig();
    }

    public ngDoCheck() {
        if (this.tabs && this.tabs.length > 0 && !this.isFirstStepActive) {
            this.tabs.first.active = true;
            this.tabs.first.steps.first.active = true;
            this.isFirstStepActive = true;
            if (Object.keys(this.tabs.first.screenManipulatorConfig).length > 0) this.tabs.first.sharedService.doTriggerScreenManipulatorEvent(this.tabs.first.screenManipulatorConfig);
            else if (Object.keys(this.screenManipulatorConfig).length > 0) this.sharedService.doTriggerScreenManipulatorEvent(this.screenManipulatorConfig);
            if (this.navigateOnLoadTabIndex) {
                for (let tabId = 0; tabId < this.navigateOnLoadTabIndex - 1; tabId++) {
                    this.onButtonClick(NavigationDirection.NEXT);
                }
            }
            this.changeRef.markForCheck();
        }
    }

    public onTabClick(selectedTab: Ng2WizardTab): void {
        this.deactivateAllTabs();
        selectedTab.active = true;
    }

    public onButtonClick(direction: NavigationDirection): void {
        switch (direction) {
            case NavigationDirection.NEXT:
                this.next();
                break;
            case NavigationDirection.PREVIOUS:
                this.previous();
                break;
            default:
                throw new Error(direction + ' is not a valid NavigationDirection');
        }
    }

    public next(): void {

        if (!this.currentTab.enableStepNavigation) window.scrollTo(200, 200);
        this.eventValidateTabId = this.currentTab.tabId;
        this.eventHandler.setEvent('onValidateTab', this.eventValidateTabId);
        if (this.config.isValidateTabNavigation === true) {
            if (this.currentTab.doValidateSubBeforeNavigation === true) {
                this.utils.nextAfterSubscriptionSub.subscribe(() => {
                    this.doProceedToNext();
                    this.utils.nextAfterSubscriptionSub.observers.pop();
                });
            } else {
                this.doProceedToNext();
            }
        }
    }

    public previous(): void {
        if (!this.currentTab.enableStepNavigation) window.scrollTo(200, 200);
        if (this.hasPreviousStep) {
            let previousTab1: Ng2WizardTab = this.currentTab;
            let step: Ng2WizardStep = this.steps[this.currentStepIndex - 1];
            this.deactivateAllSteps();
            step.active = true;
            if (this.currentTab.enableStepNavigation) this.eventHandler.setEvent('onPreviousStep', this.eventPreviousStepId, { ui: previousTab1 });
            this.selectTab(step);
            //////
            let previousTab: Ng2WizardTab = this.currentTab;
            let currentTabId = document.getElementById(previousTab.tabId);
            currentTabId.className = '';

            /////
        }
    }

    public selectTab(newStep: Ng2WizardStep): void {
        let previousTab: Ng2WizardTab = this.currentTab;
        previousTab.visited = true;
        this.deactivateAllTabs();

        this.tabs.forEach((tab) => {
            tab.steps.forEach((step) => {
                if (newStep === step) {
                    tab.active = true;
                    if (previousTab !== tab) {
                        if (previousTab.tabId < tab.tabId) this.eventHandler.setEvent('onNext', this.eventNextTabId, { ui: previousTab });
                        else this.eventHandler.setEvent('onPrevious', this.eventPreviousTabId, { ui: previousTab });
                    }
                    this.eventHandler.setEvent('onTabChange', this.eventTabChangeId);
                    if (Object.keys(tab.screenManipulatorConfig).length > 0) tab.sharedService.doTriggerScreenManipulatorEvent(tab.screenManipulatorConfig);
                    else if (Object.keys(this.screenManipulatorConfig).length > 0) this.sharedService.doTriggerScreenManipulatorEvent(this.screenManipulatorConfig);
                    return;
                }
            });
        });
    }

    public deactivateAllTabs(): void {
        this.tabs.forEach((tab) => {
            tab.active = false;
        });
    }

    public deactivateAllSteps(): void {
        this.steps.forEach((step) => {
            step.active = false;
        });
    }

    // check configuration rules and warn user when they have conficting config values
    public verifyConfig(): void {
        if (this.combinedConfig.navigationButtonLocation && !this.combinedConfig.showNavigationButtons) {
            this._logger.warn('ng2-wizard: config value "navigationButtonLocation" ignored because "showNavigationButtons" is false.');
        }
    }

    // loop through all configuation settings in user input config and over write the defaults
    public combineConfig(): void {
        for (var key in this.config) {
            if (this.config.hasOwnProperty(key)) {
                this.combinedConfig[key] = this.config[key];
            }
        }
    }

    @HostListener("window:scroll", [])
    scrolled() {
        if (this.makeNavigationStepsSticky) {
            let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (number > 200) {
                this.stickTabNav = true;
                this.eventHandler.pageScrolled.next('down');
            } else if (this.stickTabNav && number < 200) {
                this.stickTabNav = false;
                this.eventHandler.pageScrolled.next('up');
                if (!this.disableStickNavButtons) {
                    let diff = document.documentElement.scrollHeight - document.documentElement.scrollTop;
                    if (diff > 1200) {
                        this.stickTabNavButtons = true;
                    } else if (this.stickTabNavButtons && number < 1200) {
                        this.stickTabNavButtons = false;
                    }
                }
            }
        }
    }
    ngOnDestroy() {
        this.sharedService.doTriggerScreenManipulatorEvent();
    }

    ngOnInit() {
        this.utils.navigatorSub.subscribe(data => {
            if (data && data['id'] === this.elementId) {
                if (data.direction === 'PREV' && this.hasPreviousStep) {
                    this.onButtonClick(NavigationDirection.PREVIOUS);
                }
                if (data.direction === 'NEXT' && this.hasNextStep) {
                    this.onButtonClick(NavigationDirection.NEXT);
                }
            }
        });
    }

    public doProceedToNext() {
        if (this.config.isValidateTabNavigation) {
            if (this.hasNextStep) {
                let previousTab: Ng2WizardTab = this.currentTab;
                let currentTabId = document.getElementById(previousTab.tabId);
                    currentTabId.className = 'done';
                let step: Ng2WizardStep = this.steps[this.currentStepIndex + 1];
                this.deactivateAllSteps();
                step.active = true;
                if (this.currentTab.enableStepNavigation) this.eventHandler.setEvent('onNextStep', this.eventNextStepId, { ui: previousTab });
                this.selectTab(step);
            }
        }
    }

    public doNavigateToTabOnClick(destTab: Ng2WizardTab) {
        if (this.doNavigateToTabOnClick && destTab.visited) {
            let destTabId = parseInt(destTab.tabId, 10) - 1;
            if (this.currentStepIndex > destTabId) {
                for (let tabId = this.currentStepIndex; tabId > destTabId; tabId--) {
                    this.onButtonClick(NavigationDirection.PREVIOUS);
                }
            } else if (this.currentStepIndex < destTabId) {
                for (let tabId = this.currentStepIndex; tabId < destTabId; tabId++) {
                    this.onButtonClick(NavigationDirection.NEXT);
                }
            }
        }
    }
}

enum NavigationDirection {
    PREVIOUS,
    NEXT
}