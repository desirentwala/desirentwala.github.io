import { Pet } from './pet'
import { Slot } from './slot';

export class Appointment {
    id?: number;
    userId: number;
    petId: number;
    bookingId: number;
    notes: string;
    pet: Pet = new Pet();
    slot: Slot = new Slot();
}