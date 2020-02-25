import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as OT from '@opentok/client';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiList } from '../common/services/api-list';
import { NotificationService } from '../common/services/notification.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class OnlineconsultationService {
  session: OT.Session;
  token: string;
  bookingDetails: any;

  constructor(private http: HttpClient, private Nfs: NotificationService,
    private router: Router) {
  }

  /** Return Open Tox Box Object
   */
  getOT() {
    return OT;
  }

  /** Return Token 
   */
  getToken() {
    return this.token;
  }

  /**
   * @param  {} selectedAppointment Appoitment Object Details
   */
  setBookingDetails(selectedAppointment) {
    this.bookingDetails = selectedAppointment;
  }

  /** Get The Booking Booking Details For the Selected Vedio Appoitment
   */
  getBookingDetails() {
    return this.bookingDetails;
  }

  /** Get The session Details For the Booking Details 
   */
  sessionDetails() {
    return this.http.post(`${ApiList.ONLINE_CONSULTATION_API.start}`, this.getBookingDetails())
      .pipe(map((res: any) => res)
      );
  }

  /** Function to Set the Session with Session Data of Server
   * @param  {} sessionData SessionId, TokenID, and API Key 
   */
  setSession(sessionData) {
    this.session = this.getOT().initSession(sessionData.APIKEY, sessionData.data.sessionId);
    this.token = sessionData.data.token;
  }

  /** Get The Sesssion Data
   */
  getSession() {
    return this.session;
  }

  /** End The vedio Session
   */
  endSession() {
    return this.http.post(`${ApiList.ONLINE_CONSULTATION_API.end}`, this.getBookingDetails())
      .subscribe((sessionEnd) => {
        this.session.disconnect();
        // this.router.navigateByUrl('/');
        this.router.navigateByUrl('/', { queryParams: { flag: 1 } });
        const token = JSON.parse(localStorage.getItem('result'));
        if (token['userroles.role.roleName'] === 'VET') {
          this.router.navigateByUrl('/vetpractice/dashboard');
        } else if (token['userroles.role.roleName'] === 'PO') {
          this.router.navigateByUrl('/pets/dashboard');
        }
        this.Nfs.notification(`Thank You For Using The Vet Help Direct Video `, 'success');
      });
  }

  /** Start The Video Session For the Booking
   * @param  {} Token For the Session Connect
   */
  connect(Token) {
    return new Promise((resolve, reject) => {
      this.session.connect(Token, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this.session);
        }
      });
    });
  }
}
