import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ApiList } from '../services/api-list';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

    /**
     * API call to get appointment/booking details.
     * @param bookingId for to generate invoice Pdf.
     */
  public getAppointmentDetails(bookingId): Observable<any> {
    return this.http.get<any>(`${ApiList.APPOINTMENT_APIS.details}/${bookingId}`)
      .pipe(map((res: any) => res.booking));
  }
}
