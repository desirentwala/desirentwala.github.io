export * from './userform/userform.component';
export * from './services/userform.service';
export * from './newUser/newUser';
export * from './userList/userList';
export * from './user.routes';
import { UserFormService } from './services/userform.service';


const USER_FORM_SERVICES = [UserFormService];
export {
    USER_FORM_SERVICES
};
