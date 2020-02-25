/**
 * This barrel file provides the exports for the common resources (services, components).
 */
export * from './navbar/index';
export * from './menubar/index';
export * from './breadCrumb/index';
export * from './dashboard/index';
export * from './banner/index';
export * from './chatbot/index';
export * from './shareReassign/index'

export * from './services/picklist.service';
import { PickListService } from './services/picklist.service';
import { ScreenManipulationHandler } from './services/screen-manipulation-handler.service';
import { ScreenManipulatorEvent } from './services/screen-manipulator-event.service';
import { ShareReassignService } from './shareReassign/services/shareReassign.service'

const PICKLIST_SERVICES = [PickListService];
const SCREEN_MANIPULATOR_SERVICES = [ ScreenManipulationHandler, ScreenManipulatorEvent, ShareReassignService ]
export {
PICKLIST_SERVICES, SCREEN_MANIPULATOR_SERVICES
};
