import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiList } from './api-list';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TableService {

    constructor(private http: HttpClient) { }
/**
 * cancel appointment for a booking
 * @param apptId appointment id
 * @param cancelNotes reason for cancellation
 */
    public cancelAppointment(apptId, cancelNotes): Observable<any> {
        return this.http.post(`${ApiList.APPOINTMENT_APIS.appointment}/cancel/${apptId}`, cancelNotes)
            .pipe(map((res: any) => res));
    }

    public lateJoin(lateObj): Observable<any> {
        return this.http.post(`${ApiList.APPOINTMENT_APIS.appointment}/delay`, lateObj)
            .pipe(map((res: any) => res));
    }
    public canfirmAppointment(confirmObj): Observable<any> {
        return this.http.post(`${ApiList.APPOINTMENT_APIS.appointment}/confirm`, confirmObj)
            .pipe(map((res: any) => res));
    }
}
