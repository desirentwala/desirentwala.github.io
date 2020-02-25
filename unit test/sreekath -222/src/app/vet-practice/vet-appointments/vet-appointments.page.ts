import { Component, OnInit } from '@angular/core';
import { VetPracticeService } from '../vet-practice.service';
import { SchedulingService } from 'src/app/scheduling-management/service/scheduling.service';
import { CommonService } from '../../common/services/common.service';
import * as moment from 'moment';
import * as _ from 'underscore';
@Component({
  selector: 'app-vet-appointments',
  templateUrl: './vet-appointments.page.html',
  styleUrls: ['./vet-appointments.page.scss'],
})
export class VetAppointmentsPage implements OnInit {
  bookingData: any = [];
  header: any = 'Customer';
  menuItems: any = [];
  sortedData: any = [];
  statusList: any = Array<any>();
  interval: any;
  constructor(private vetPracticeService: VetPracticeService,
    private schedulingService: SchedulingService,
    private commonService: CommonService) {
    this.menuItems = ['Joining Late'];
    this.statusList = ['Awaiting confirmation', 'Confirmed', 'Cancelled', 'Completed'];
  }

  ionViewWillEnter() {
    this.interval = setInterval(() => {
      this.ngOnInit();
    }, 90 * 1000 );
  }
  ionViewDidLeave() {
    clearInterval(this.interval);
  }
  ngOnInit() {
    let tempArr = [];
 
      this.vetPracticeService.getVetBookings(this.commonService.getStorage && this.commonService.getStorage.id).subscribe((bookings: any) => {
        bookings.data.forEach(P => {
          const tableRow = {
            appointmentId: P.id,
            appointmentDate: moment(P.slot.startsAt).format('ll'),
            time: moment(P.slot.startsAt).format('hh:mm A'),
            duration: P.slot.duration,
            practicerName: P.user.firstName,
            userId: P.userId,
            paid: `£ ${P.practiceAppointmentType.customerFee}`,
            status: P.status.statusName,
            completeData: P,
            practicerId: P.slot.user.id,
            cust: P.user.firstName,
            role: 'VET'
          };
          tempArr.push(tableRow);
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
