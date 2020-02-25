export class Practice {
    id?: number;
    practiceName: string;
    password: string;
    confirmPassword: string;
    tag?: string;
    logo?: string;
    phoneNo: string;
    email: string;
    website: string;
    address1: string; // address
    address2: string;
    country: string;
    postCode: number;
    groupName: string;
    addOrInvite: true;
    speciesId: number;
    brandingInfo: Array<any>;
    contactFullName?: string;
    contactEmail?: string;
    contactPhoneNo?: string;
    species: Array<any> = [];
    prefix: any;
}
