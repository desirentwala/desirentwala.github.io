export class AppointmentType {
    id?: number;
    appointmentType: string;
    duration: number;
    practiceFee: number;
    vhdPrice: number;
    customerFee: number;
    isPrivate: boolean = false;
    practiceId: number;
}
