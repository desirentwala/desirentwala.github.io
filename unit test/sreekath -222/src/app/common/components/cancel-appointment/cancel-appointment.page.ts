import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { TableService } from '../../services/table.actions.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-cancel-appointment',
  templateUrl: './cancel-appointment.page.html',
  styleUrls: ['./cancel-appointment.page.scss'],
})
export class CancelAppointmentPage implements OnInit {
  value: any;
  comments: string;
  bookingData: any;
  constructor(private commonService: CommonService, private tableService: TableService, private router: Router, ) {
  }

  ngOnInit() {
    this.commonService.cancelObservable.subscribe(res => {
      this.value = res.value;
      this.bookingData = res.data;
    });
  }
  cancelBooking() {
    let obj: any = {};
    const resultObj = JSON.parse(localStorage.getItem('result'));
    if(resultObj){
      const role = resultObj['userroles.role.roleName'];
      let POName, POemail;
      if (role === 'PO') {
        POName = resultObj.firstName;
        POemail = resultObj.email;
      } else if (role === 'PA') {
        POName = this.bookingData.completeData.user.firstName;
        POemail = this.bookingData.completeData.user.email;
      }
      obj = {
        flag: role,
        comments: this.comments,
        email: POemail,
        firstName: POName,
        slot: { vet: this.bookingData.vet, startsAt: moment(new Date(this.bookingData.completeData.slot.startsAt)).format('MMM D, YYYY| h:mm A') },
        practiceName: this.bookingData.completeData.slot.practice.practiceName,
        practiceEmail: this.bookingData.completeData.slot.practice.email,
        vetName: this.bookingData.completeData.slot.user.firstName,
        vetEmail: this.bookingData.completeData.slot.user.email,
        petName: this.bookingData.completeData.appointments[0].pet.petName
      };
      
    this.tableService.cancelAppointment(this.bookingData.appointmentId, obj).subscribe(cancelled => {
      this.value = false;
      if (role === 'VET') {
        this.router.navigate(['/vetpractice/appointments'], { queryParams: { flag: 1, id: cancelled.b.id } });
      } else if (role === 'PO') {
        this.router.navigate(['/pets/bookings'], { queryParams: { flag: 1, id: cancelled.b.id } });
      } else if (role === 'PA') {
        this.router.navigate(['/practiceadmin/appointments'], { queryParams: { flag: 1, id: cancelled.b.id } });
      }
    });
  } 
 }
    
    

}
