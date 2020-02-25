export class Appointment {
    id?: number;
    userId: number;
    email: string;
    petId: number;
    firstName: string;
    bookingId: number;
    appointmentDate: Date;
    speciesId: number;
    // slot: string;
    slotId: number;
    paymentId: string;
    status: string;
    petName: string;
    practiceId: number;
    practicerName: string;
    price: string;
    isPrivate: boolean;
    practiceAppointmentTypeId: number;
    profilePic: string;
    appointments: Array<any> = [];
    slot: { id: number, isPrivate: boolean, vet: string, duration: string, startsAt: string,
      practiceAppointmentTypeId: number, appointmentType: string, originalDateTime: any };
    oldSlotId?: number;
    practiceName?: any;
    vet?: any;
  vetEmail?: any;
  practiceEmail?: any;
    //{userId: number; petId: number}
}
