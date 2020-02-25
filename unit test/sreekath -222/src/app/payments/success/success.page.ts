import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { PaymentsService } from '../payments.service';
import { Router, ActivatedRoute, Params, } from '@angular/router';
import { stringify } from 'querystring';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage implements OnInit {
  currentURL = '';
  appointmentID: string;
  isPrivate: boolean;
  constructor(private paymentsService: PaymentsService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router,private cd: ChangeDetectorRef ) { 
      sessionStorage.clear();
    }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.session_id === 'zero_transaction') {
        this.appointmentID = params.bookingId
      } else {
        const session = {
          session_id: '',
          bookingId: ''
        };
        session.session_id = params.session_id;
        this.sessionData(session);
      }
    });
  }

  sessionData(sessionID) {
    let onSucess = {};
    if(sessionID){
      onSucess['sessionId'] = sessionID.session_id;
      onSucess['status'] = 'Success';
      this.paymentsService.onSuccess(onSucess).subscribe((res) => {
        setTimeout(() => {
          this.paymentsService.getSessionData(sessionID).subscribe((sessionData) => {
            this.appointmentID = sessionData.booking.id;
            this.isPrivate = sessionData.slots.isPrivate;
            this.cd.detectChanges();
          });
        }, 500);
      });
    }
      //Call the Appointment Post Data Service Call for Appoitment Confirm  
  }

  manageAppointment() {
    this.router.navigate(['/pets/dashboard'], { queryParams: { flag: 1 } });
  }

}
