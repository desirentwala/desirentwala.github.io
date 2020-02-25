import { ScreenManipulatorEvent } from './screen-manipulator-event.service';
import { Injectable } from '@angular/core';


@Injectable()
export class ScreenManipulationHandler {
    public screenManipulatorConfig = {};
    get configBuffer(): any {
        return {
            showNavbar: true,
            showSearch: true,
            showNotification: true,
            showMenu: true,
            showBanner: true,
            showFooter: true,
            showBreadCrumb: true,
            showFooterMap: true,
            showChatbot: true
        };
    };
    constructor(public screenManipulator: ScreenManipulatorEvent) {
        this.screenManipulatorConfig = this.configBuffer;
        screenManipulator.notifierSub.subscribe(data => {
            this.combineConfig(data);
            if(screenManipulator.notifierSub && screenManipulator.notifierSub.observers.length > 0){
                screenManipulator.notifierSub.observers.pop();
            }
        });
    }
    // loop through all configuration settings in user input config and over-write the defaults
    public combineConfig(config): void {
        if (!config || Object.keys(config['value']).length < 1) this.screenManipulatorConfig = this.configBuffer;
        else {
            Object.keys(this.configBuffer).forEach(key => this.screenManipulatorConfig[key] = config['value'].hasOwnProperty(key) ? config['value'][key] : this.configBuffer[key]);
        }
    }
}