export * from './newUserGroup/newUserGroup';
export * from './services/userGroup.service';
export * from './usergroup.routes';
export * from './usergroup/userGroupForm.component';
export * from './userGroupList/userGroupList';

import { UserGroupService } from './services/userGroup.service';


const USER_GROUP_SERVICES = [UserGroupService];
export { USER_GROUP_SERVICES };
