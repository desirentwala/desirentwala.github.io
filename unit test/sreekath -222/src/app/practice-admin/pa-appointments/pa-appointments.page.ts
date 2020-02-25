import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../common/services/common.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import { PracticeAdminService } from '../practice-admin.service';

@Component({
  selector: 'app-pa-appointments',
  templateUrl: './pa-appointments.page.html',
  styleUrls: ['./pa-appointments.page.scss'],
})
export class PaAppointmentsPage implements OnInit, OnDestroy {
  bookingData: any = [];
  header: any = 'Vet';
  value = 'vet';
  menuItems: any = [];
  sortedData: any = [];
  statusList: any = Array<any>();
  interval: any;
  constructor(
    private practiceAdminService: PracticeAdminService,
    private commonService: CommonService) {
    this.menuItems = ['Confirm Appt.', 'Reject Appt.', 'Download Invoice'];
    this.statusList = ['Awaiting confirmation', 'Confirmed', 'Cancelled', 'Completed'];
  }
  ionViewWillEnter() {
    this.getPracticeAppointments();
    this.ngOnInit();
    this.getPracticeAppointments();
  }
  ngOnInit() {
    const resultObj = JSON.parse(localStorage.getItem('result'));
    if(resultObj){
      const role = resultObj['userroles.role.roleName'];
      
    this.interval = setInterval(() => {
      if (role === 'PA') {
        this.getPracticeAppointments();
      }
    }, 90 * 10000);
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  ionViewDidLeave() {
    clearInterval(this.interval);
  }
  /**
   * get and format the appointment data for appointment table
   */
  getPracticeAppointments() {

    let tempArr = [];
    let tableRow: any;
    this.bookingData = [];
    this.practiceAdminService.getAppointmentsByPractice(this.commonService.getStorage && this.commonService.getStorage.practiceId).subscribe((res: any) => {
      res.data.filter(app => {
        if (app.appointments) {
          app.appointments.filter(P => {
            tableRow = {
              appointmentId: app.id,
              appointmentDate: moment(app.slot.startsAt).format('ll'),
              time: moment(app.slot.startsAt).format('hh:mm A'),
              duration: app.slot.duration,
              practicerName: app.slot.user.firstName,
              practicerId: app.slot.practice.id,
              userId: app.userId,
              paid: `£ ${app.practiceAppointmentType.customerFee}`,
              status: app.status.statusName,
              vet: app.slot.user.firstName,
              cust: app.user.firstName,
              petId: P.petId,
              completeData: app,
              role: 'PA'
            };
          });
          tempArr.push(tableRow);
        }
      });
      tempArr = _.uniq(tempArr, (book) => {
        return book.appointmentId;
      });
      this.sortedData = tempArr.sort((a, b) => {
        return this.statusList.indexOf(a.status) - this.statusList.indexOf(b.status);
      });
      this.bookingData = this.sortedData;
    });
  }
}
