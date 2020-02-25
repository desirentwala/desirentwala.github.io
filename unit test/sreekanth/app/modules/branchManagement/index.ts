export * from './branch.routes';
export * from './branchform/branchform.component';
export * from './branchList/branchList';
export * from './newBranch/newBranch';
export * from './services/branchform.service';

import { BranchFormService } from './services/branchform.service';


const BRANCH_FORM_SERVICES = [BranchFormService];
export { BRANCH_FORM_SERVICES };