import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiList } from '../common/services/api-list';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { AuthService } from '../common/services/auth.service';
import { TokenValidaterService } from '../common/services/token-validater.service';

@Injectable({
    providedIn: 'root'
})
export class PracticeAdminService {
    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private tokenValidatorService: TokenValidaterService,
    ) { }

    /**
     * practice existing check in both practice and user table
     * for email and mobile
     * @param practice - info
     */
    public practiceCheck(practice): Observable<any> {
        delete practice.password;
        delete practice.confirmPassword;
        return this.http.post(`${ApiList.PRACTICEADMIN_APIS.practice}/check`, practice)
            .pipe(map((res: any) => res));
    }

    /**
     * Add practice
     * @param newData practice data from practices
     */
    public practiceRegistration(practice, password): Observable<any> {
        delete practice.confirmPassword;
        practice.password = this.authService.encryptPassword(password, this.tokenValidatorService.secretToken()).toString();
        return this.http.post(`${ApiList.PRACTICEADMIN_APIS.practice}`, practice)
            .pipe(map((res: any) => res));
    }

    /**
     * API Call to get practicer slots.
     * @param practiceId practicer id mapped with the pet.
     */
    public getPracticeSlots(practiceId, speciesId, day): Observable<any> {
        // send selected date time with time zone
        const current = moment(day, 'YYYY-MM-DD').toDate();
        if (moment(current).isSame(moment(), 'day')) {
            day = new Date().toISOString();
        } else {
            day = new Date(day).toISOString();
        }
        return this.http.get<any>(
            `${ApiList.SCHEDULING_APIS.slots}/${ApiList.PRACTICEADMIN_APIS.practice}/day/${practiceId}/${speciesId}?d=${day}`
        ).pipe(map((res: any) => res));
    }


    /**
     * getting all species
     */
    public getSpecies(): Observable<any[]> {
        return this.http.get<any>(`${ApiList.SPECIES_APIS.species}`)
            .pipe(map((res: any) => res));
    }

    /**
     * API Call to get pet owners by practice id
     * @param id practiceId
     */
    public getCustomersByPractice(id): Observable<any> {
        return this.http.get<any>(`${ApiList.USERS_APIS.user}/${ApiList.PRACTICEADMIN_APIS.practice}/${id}/po`)
            .pipe(map((res: any) => res));
    }

    /**
     * API Call to get pet owners by practice id
     * @param id practiceId
     */
    public getAppointmentsByPractice(id): Observable<any> {
        return this.http.get<any>(`${ApiList.APPOINTMENT_APIS.appointment}/${ApiList.PRACTICEADMIN_APIS.practice}/${id}`)
            .pipe(map((res: any) => res));
    }

    /**
     * name
     *  @param newVetdata new vet data
     */
    public addNewVet(newVetdata): Observable<any> {
        newVetdata.password = this.authService.encryptPassword(newVetdata.password, this.tokenValidatorService.secretToken()).toString();
        newVetdata.userName = `${newVetdata.prefix}${newVetdata.userName.toLowerCase()}`;
        return this.http.post(`${ApiList.USERS_APIS.user}/vet`, newVetdata)
            .pipe(map((res: any) => res));
    }

    public inviteCustomer(vet): Observable<any> {
        return this.http.post(`${ApiList.MAGICLINK_APIS.mls}`, vet)
            .pipe(map((res: any) => res));
    }
    /**
     * upload logic
     * @param file profile picture of vet
     * @param id  vet id
     */
    public uploadProfilePic(file, id, role): Observable<any[]> {
        const formData: FormData = new FormData();
        const headers = new HttpHeaders();
        headers.set('Content-Type', 'multipart/form-data');
        formData.append('file', file, file.name);
        return this.http.post(`${ApiList.PET_APIS.pictureUpload}/${role}/${id}`, formData, {
            headers
        }).pipe(map((res: any) => res));
    }

    /**
     * Service call to get appointment type of practice
     * @param practice id
     */
    public getAppointmentTypes(practiceId): Observable<any> {
        return this.http.get(`${ApiList.PRACTICES_APIS.practice}/apptype/${practiceId}`)
            .pipe(map((res: any) => res.data));
    }

    /**
     * API Call to get pet owners by practice id
     * @param id practiceId
     */
    public getPaProfileData(id): Observable<any> {
        return this.http.get<any>(`${ApiList.PRACTICEADMIN_APIS.practice}/${id}`)
            .pipe(map((res: any) => res));
    }

    /**
     * API Call to put  method by profile update based on id
     * @param id practiceId
     */
    public updateUser(userObj): Observable<any[]> {
        if (Object.keys(userObj).includes('id')) {
            return this.http.put(`${ApiList.PRACTICEADMIN_APIS.practice}`, userObj)
                .pipe(map((res: any) => res));
        }
    }

    /**
     * API Call to get private slot details.
     * @param slotId - private slot id received over magic link.
     */
    public getPrivateSlotInfo(slotId: number): Observable<any> {
        return this.http.get<any>(`${ApiList.SCHEDULING_APIS.slots}/${slotId}/private`)
            .pipe(map((res: any) => res));
    }
}


