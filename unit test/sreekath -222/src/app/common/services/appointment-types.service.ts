import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiList } from './api-list';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AppointmentTypeService {

    constructor(private http: HttpClient) { }
    /**
     * cancel appointment for a booking
     * @param apptId appointment id
     * @param cancelNotes reason for cancellation
     */
    public addApptType(apptObj): Observable<any> {
        return this.http.post(`${ApiList.APPOINTMENT_TYPE_API.types}`, apptObj)
            .pipe(map((res: any) => res));
    }

    public editAppointmentType(apptObj): Observable<any> {
        return this.http.put(`${ApiList.APPOINTMENT_TYPE_API.types}`, apptObj)
            .pipe(map((res: any) => res));
    }
    public deleteApptType(apptType): Observable<any> {
        return this.http.delete(`${ApiList.APPOINTMENT_TYPE_API.types}/${apptType.id}`, apptType)
            .pipe(map((res: any) => res));
    }
    public getApptTypeByPractice(practiceId): Observable<any> {
        return this.http.get<any>(`${ApiList.APPOINTMENT_APIS.appointment}/${ApiList.PRACTICEADMIN_APIS.practice}/${practiceId}/type`)
            .pipe(map((res: any) => res));
    }
    public getApptTypeById(apptTypeId): Observable<any> {
        return this.http.get<any>(`${ApiList.APPOINTMENT_TYPE_API.types}/${apptTypeId}`)
            .pipe(map((res: any) => res));
    }
    // practice/:id/type
}
