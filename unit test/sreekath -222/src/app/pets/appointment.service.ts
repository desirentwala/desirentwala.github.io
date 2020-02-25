import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiList } from '../common/services/api-list';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private http: HttpClient) { }

  selectedAppoitment: any;


  /**
   * API Call to add appointment.
   * @param appointmentObj added pet information.
   */
  public bookAppointment(appointmentObj): Observable<any> {
    if (Object.keys(appointmentObj).includes('id')) {
      return this.http.put(`${ApiList.APPOINTMENT_APIS.appointment}`, appointmentObj)
        .pipe(map((res: any) => res));
    } else {
      return this.http.post(`${ApiList.APPOINTMENT_APIS.appointment}/v2`, appointmentObj)
        .pipe(map((res: any) => res));
    }
  }

  public setselectedAppoitments(appointment) {
    this.selectedAppoitment = appointment;
  }

  public getselectedAppoitments() {
    return this.selectedAppoitment;
  }

  /**
 * API Call to add appointment which has no payment.
 * @param appointmentObj added pet information.
 */
  public bookDirectAppointment(appointmentObj): Observable<any> {
    return this.http.post(`${ApiList.APPOINTMENT_APIS.appointment}`, appointmentObj)
      .pipe(map((res: any) => res));
  }

  /**
   * API call to get all appointments.
   * @param userId logged-in user id.
   */
  public getAllAppointments(userId): Observable<any> {
    return this.http.get<any>(`${ApiList.APPOINTMENT_APIS.allAppointment}/${userId}`)
      .pipe(map((res: any) => res));
  }

  /**
   * Get selected appointment details.
   * @param appId selected appointment id
   */
  public getAppointmentById(appId): Observable<any> {
    return this.http.get<any>(`${ApiList.APPOINTMENT_APIS.appointment}/${appId}`)
      .pipe(map((res: any) => res));
  }

  /**
   * Cancel appointment
   * @param appId selected appointment id
   */
  public cancelAppointment(appId): Observable<any> {
    return this.http.delete<any>(`${ApiList.APPOINTMENT_APIS}/${appId}`)
      .pipe(map((res: any) => res));
  }
}
