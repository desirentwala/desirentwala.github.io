import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { PetService } from '../pets.service';
import { CommonService } from '../../common/services/common.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy, OnChanges {

  bookingData: any = [];
  header: any = 'Vet';
  menuItems: any = [];
  sortedData: any;
  interval: any;
  constructor(
    private petservice: PetService,
    private commonService: CommonService, private activeRoute: ActivatedRoute) {
    this.menuItems = ['Edit Booking', 'Cancel Booking', 'Re-Book', 'Download-Invoice'];
  }

  ionViewWillEnter() {
    this.activeRoute.queryParams.subscribe(
      params => {
        if (params.flag) {
          this.ngOnInit();
        }
      });
    if (JSON.parse(localStorage.getItem('result'))) {
        const resultObj = JSON.parse(localStorage.getItem('result'));
        const role = resultObj['userroles.role.roleName'];
        this.interval = setInterval(() => {
          if (role === 'PO') {
            this.ngOnInit();
          }
        }, 90 * 10000);
      }
  }

  ngOnChanges() {

  }
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  ionViewDidLeave() {
    clearInterval(this.interval);
  }
  ngOnInit() {
    let tableRow: any;
    const tempArr = [];
    this.petservice.getAllBookingsByUser(this.commonService.getStorage && this.commonService.getStorage.id).subscribe((res: any) => {

        res.bookings.forEach(Appoitment => {
          Appoitment.appointments.filter(P => {
            tableRow = {
              appointmentId: Appoitment.id,
              appointmentDate: moment(Appoitment.slot.startsAt).format('ll'),
              time: moment(Appoitment.slot.startsAt).format('hh:mm A'),
              duration: Appoitment.slot.duration,
              practicerName: Appoitment.slot.user.firstName,
              practicerId: Appoitment.slot.user.id,
              userId: Appoitment.userId,
              paid: `£ ${Appoitment.practiceAppointmentType.customerFee}`,
              status: Appoitment.status.statusName,
              petId: P.petId,
              vet: Appoitment.slot.user.firstName,
              completeData: Appoitment,
              role: 'PO'
            };
          });
          tempArr.push(tableRow);
        });
        this.sortedData = tempArr.filter((data) => data.status === 'Awaiting confirmation');
        tempArr.map((sort) => {
          if (sort.status === 'Confirmed') {
            this.sortedData.push(sort);
          }
        });
        tempArr.map((sort) => {
          if (sort.status === 'Cancelled') {
            this.sortedData.push(sort);
          }
        });
        tempArr.map((sort) => {
          if (sort.status === 'Completed') {
            this.sortedData.push(sort);
          }
        });
        this.bookingData = this.sortedData;
      });


  }
}
