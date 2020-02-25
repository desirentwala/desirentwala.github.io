/**
 * This barrel file provides the export for the shared NavbarComponent.
 */
export * from './services/menu.service';
export * from './menubar';
import { MenuService } from './services/menu.service';


const MENU_PROVIDERS = [MenuService];

export {
MENU_PROVIDERS
};