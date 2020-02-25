import { Component, OnInit, OnDestroy, ChangeDetectorRef, OnChanges, ViewRef } from '@angular/core';
import { PetService } from '../pets.service';
import { SchedulingService } from '../../scheduling-management/service/scheduling.service';
import { CommonService } from '../../common/services/common.service';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy, OnChanges {
  appointments;
  interval: any;
  petCount: any;
  isAppointments: boolean;
  constructor(
    private petservice: PetService,
    private schedulingservice: SchedulingService,
    private commonService: CommonService,
    private storage: Storage,
    private router: Router,
    private cdnRef: ChangeDetectorRef,
    private statusBar: StatusBar
  ) {

  }

  ionViewWillEnter() {
    this.ngOnInit();
    this.storage.get('ONBOARD_PO').then((petOnwerValue) => {
      if (petOnwerValue !== null) {
        this.router.navigateByUrl('/pets/new');
      }
    });
  }

  ionViewDidEnter() {
    if (cordova && cordova.platformId == 'ios') {
      this.statusBar.styleLightContent();
    } else {
      this.statusBar.styleDefault();
    }
  }

  ngOnChanges() {
    if (this.cdnRef !== null && this.cdnRef !== undefined &&
      !(this.cdnRef as ViewRef).destroyed) {
      this.getAppointments();
      this.cdnRef.detectChanges();
    }
  }
  ngOnInit() {
    this.appointments = [];
    this.getAppointments();
    this.getPetList();
    const resultObj = JSON.parse(localStorage.getItem('result'));
    if(resultObj){
      const role = resultObj['userroles.role.roleName'];
      this.interval = setInterval(() => {
        if (role === 'PO') {
          this.getAppointments();
        }
      }, 90 * 10000);
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /**
   * get pet information
   */
  getPetList() {
    this.petservice.getPetList(this.commonService.getStorage && this.commonService.getStorage.id).subscribe((res: any) => {
      this.petCount = res.data.length;
    });
  }

  getAppointments() {
    if (this.commonService.getStorage) {
      let tableRow: any;
      const TempArray = [];
      const result = JSON.parse(localStorage.getItem('result'));
      this.petservice.getAllBookingsByUser(result.id).subscribe((res: any) => {
        res.bookings.forEach(Appoitment => {
          tableRow = {
            id: Appoitment.id,
            appointmentDate: this.schedulingservice.dateConversion(Appoitment.slot.startsAt),
            time: Appoitment.apptOn,
            slot: Appoitment.slot.startsAt,
            practicerName: Appoitment.slot.user.firstName,
            paid: `£ ${Appoitment.practiceAppointmentType.customerFee}`,
            status: Appoitment.status.statusName,
            practicerId: Appoitment.slot.practice.id,
            userId: Appoitment.userId,
            duration: Appoitment.slot.duration,
            completeData: Appoitment,
            apptOnORg: moment(Appoitment.slot.startsAt)
          };
          TempArray.push(tableRow);
        });
        this.appointments = TempArray;
        this.isAppointments = true;
      });
    }
  }
}


