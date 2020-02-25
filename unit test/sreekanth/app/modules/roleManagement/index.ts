export * from './newRole/newRole';
export * from './role.routes';
export * from './roleform/roleform.component';
export * from './roleList/roleList';
export * from './services/roleform.service';
export { ROLE_FORM_SERVICES };

import { RoleFormService } from './services/roleform.service';


const ROLE_FORM_SERVICES = [RoleFormService];
