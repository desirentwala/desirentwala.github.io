import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DateConvertorService } from '../../services/date-convertor.service';
import { Router } from '@angular/router';
import { OnlineconsultationService } from '../../../online-consultation/onlineconsultation.service';
import { CommonService } from '../../services/common.service';
import * as moment from 'moment';
import { isArray } from 'util';
import { Appointment } from 'src/app/pets/appointment.model';
import { AppointmentService } from 'src/app/pets/appointment.service';
@Component({
  selector: 'app-appointment-card',
  templateUrl: './appointment-card.component.html',
  styleUrls: ['./appointment-card.component.scss'],
})
export class AppointmentCardComponent implements OnInit, OnChanges {

  @Input() appointments;
  upcommingAppointments = [];
  previousAppointments = [];
  sheduledAppointments = [];
  petOwner: boolean;

  constructor(
    private router: Router,
    private dateConvertorService: DateConvertorService,
    private onlineconsultationService: OnlineconsultationService,
    private commonServcice: CommonService,
    private appointmentService: AppointmentService) { }

  ngOnInit() {
    this.dateConvertion();
    if (this.commonServcice.getStorage && this.commonServcice.getStorage['userroles.role.roleName'] === 'PO') {
      this.petOwner = true;
    } else {
      this.petOwner = false;
    }
  }

  ngOnChanges(): void {
    this.dateConvertion();
  }

  /**
   * converts date format to day month and year
   */
  dateConvertion() {
    let upcoming = [];
    let previous = [];
    let sheduled = [];
    if(this.appointments){
      this.appointments.sort((a, b) => {
        return Number(new Date(a.slot)) - Number(new Date(b.slot));
      });
      this.appointments.map(res => {
  
        if (res.status !== 'Cancelled') {
          res.time = this.dateConvertorService.slotConvertion(res.slot, res.duration);
        }
      });
      this.appointments.map((res) => {
        if (res.status !== 'Cancelled' && res.status !== 'Awaiting confirmation') {
          if (res.time.dateDiff === 0) {
            if (res.time.timeDiff >= -res.duration + 1 && res.status !== 'Completed') {
              upcoming.push(res);
            } else {
              previous.push(res);
            }
          } else if (res.time.dateDiff > 0) {
            upcoming.push(res);
          } else if (res.time.dateDiff < 0) {
            previous.push(res);
          }
        } else if (res.status === 'Awaiting confirmation') {
          if (res.time.dateDiff === 0 && res.time.timeDiff >= -10) {
            sheduled.push(res);
          } else if (res.time.dateDiff > 0) {
            sheduled.push(res);
          }
        }
      });
    }
    
    const pReverse = previous.reverse();
    this.upcommingAppointments = upcoming.slice(0, 3);
    this.previousAppointments = pReverse.slice(0, 3);
    this.sheduledAppointments = sheduled.slice(0, 3);
  }

  /**
   * navigate to video call
   */
  navigateToVideo(appointmentData) {
    const bookingDatavideo = {};
    if(appointmentData){
      bookingDatavideo['bookingId'] = appointmentData.id;
      bookingDatavideo['userId'] = appointmentData.userId;
      bookingDatavideo['vetId'] = appointmentData.practicerId;
      bookingDatavideo['practicerName'] = appointmentData.practicerName;
      bookingDatavideo['Vetname'] = appointmentData.practicerName;
    }
    if (this.commonServcice.getStorage && this.commonServcice.getStorage['userroles.role.roleName'] === 'PO') {
      bookingDatavideo['subscriberPic'] = appointmentData.completeData.slot.user.profilePic;
    } else if (this.commonServcice.getStorage && this.commonServcice.getStorage['userroles.role.roleName'] === 'VET') {
      bookingDatavideo['subscriberPic'] = appointmentData.completeData.appointments[0].pet.profilePic;
    }
    this.onlineconsultationService.setBookingDetails(bookingDatavideo);
    this.router.navigateByUrl('/online-consultation');
  }

  /**
   * navigating to edit booking
   * @param appId appointment id
   * @param petId pet id
   */
  editAppointment(data) {
    let EditObj = {};
    if(data){
      EditObj['appointmentId'] = data.id;
      if(data.slot){
        EditObj['appointmentDate'] = moment(data.slot.startsAt).format('ll');
        EditObj['time'] = moment(data.slot.startsAt).format('hh:mm A');
        EditObj['duration'] = data.slot.duration;
      } 
      if(data.status){
        EditObj['status'] = data.status.statusName;
        EditObj['vet'] = data.slot.user.firstName;
      }
      this.appointmentService.setselectedAppoitments(EditObj);
    }
    if (isArray(data && data.appointments)) {
      const petDetails = data.appointments[0];
      this.router.navigate(['/pets/appointments'],
        { queryParams: { appointmentId: data.id, slot: data.slot.id, id: petDetails.petId, flag: 'edit' } });
    }
  }

}
