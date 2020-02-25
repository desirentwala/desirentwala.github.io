import { Pet } from './pet';

export class User {
    id?: number;
    firstName: string;
    email: string;
    mobile: string;
    password: string;
    profilePic: string;
    isActive: boolean;
    practiceId: number;
    createdOn: Date;
    lastAccessOn: Date;
    pet: Pet = new Pet();
}
