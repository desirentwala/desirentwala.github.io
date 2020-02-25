import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiList } from '../common/services/api-list';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PetService {
    constructor(private http: HttpClient) { }

    /**
     * API Call to add pet information.
     * @param petObj added pet information.
     */
    public addPet(petObj): Observable<any> {
        if (Object.keys(petObj).includes('id')) {
            return this.http.put(`${ApiList.PET_APIS.pet}`, petObj)
                .pipe(map((res: any) => res));
        } else {
            return this.http.post(`${ApiList.PET_APIS.pet}`, petObj)
                .pipe(map((res: any) => res));
        }
    }

    /**
     * API call to get pet list.
     * @param userId logged-in user id.
     */
    public getPetList(userId): Observable<any> {
        return this.http.get<any>(`${ApiList.PET_APIS.petList}/${userId}`)
            .pipe(map((res: any) => res));
    }

    /**
     * Get selected pet details.
     * @param petId selected pet id
     */
    public getPetById(petId): Observable<any> {
        return this.http.get<any>(`${ApiList.PET_APIS.pet}/${petId}`)
            .pipe(map((res: any) => res));
    }

    /**
     * Get selected pet details.
     * @param petId selected pet id
     */
    public deletePet(petId): Observable<any> {
        return this.http.delete<any>(`${ApiList.PET_APIS.pet}/${petId}`)
            .pipe(map((res: any) => res));
    }
    /**
     */
    public getSpecies(): Observable<any[]> {
        return this.http.get<any>(`${ApiList.SPECIES_APIS.species}`)
            .pipe(map((res: any) => res));
    }

    /**
     */
    public getAllPractices(): Observable<any[]> {
        return this.http.get<any>(`${ApiList.PRACTICES_APIS.practice}`)
            .pipe(map((res: any) => res));
    }

    /** Service to get All the Booking s
     * @param userId Loged In User taken From Bowser Storage and sent
     */
    public getAllBookingsByUser(userId): Observable<any[]> {
        return this.http.get<any>(`${ApiList.APPOINTMENT_APIS.getAllAppointmentByUser}/${userId}`);
    }
    /**
     * upload logic
     * @param file profile picture of pet
     * @param userId user id or PO id
     */
    public uploadPetPic(file, userId, role): Observable<any[]> {
        const formData: FormData = new FormData();
        const headers = new HttpHeaders();
        headers.set('Content-Type', 'multipart/form-data');
        formData.append('file', file, file.name);
        return this.http.post(`${ApiList.PET_APIS.pictureUpload}/${role}/${userId}`, formData, {
            headers
        }).pipe(map((res: any) => res));
    }
    public getAppointmentsByPet(petId): Observable<any[]> {
        return this.http.get<any>(`${ApiList.APPOINTMENT_APIS.appointment}/pet/${petId}`)
            .pipe(map((res: any) => res));
    }

    /**
     * Fetch vet details based on name and postal code
     * @param alphanumeric
     */
    public searchVets(data) {
        let pattern = {
             pattern: data
         }
         return this.http.post<any>(`${ApiList.PRACTICES_APIS.practice}/search`, pattern)
             .pipe(map((res: any) => res.data));
     }
}
