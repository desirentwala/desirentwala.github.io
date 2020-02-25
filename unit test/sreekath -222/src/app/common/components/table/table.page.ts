import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.service';
import * as _ from 'underscore';
import { OnlineconsultationService } from '../../../online-consultation/onlineconsultation.service';
import { InvoicePdfService } from '../../invoicePdf/InvoicePdfService';
import * as moment from 'moment';
import { TableService } from '../../services/table.actions.service';
import { AppointmentService } from 'src/app/pets/appointment.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.page.html',
  styleUrls: ['./table.page.scss'],
})
export class TablePage implements OnInit, OnChanges {
  selectvalue: any;
  getarray: any;
  value: boolean;
  isTableChecked: boolean;
  // table data
  @Input() bookingdata;
  // header for type of user
  @Input() header;
  // menu items on popover
  @Input() menuItems;
  // navigation indication
  @Input() flag;
  cancelled: string;
  lateJoin: string;
  // isEnable: boolean;
  isCustomer: boolean;
  isVet: boolean;

  constructor(
    private popoverController: PopoverController,
    private commonService: CommonService,
    private activeRoute: ActivatedRoute,
    private invoicePdfService: InvoicePdfService,
    private onlineconsultationService: OnlineconsultationService,
    private router: Router, // tslint:disable-next-line: no-shadowed-variable,
    private tableService: TableService,
    private appointmentService: AppointmentService
  ) {
    this.isTableChecked = false;
  }

  ngOnChanges() {
    this.activeRoute.queryParams.subscribe(params => {
      if (params.flag === '1') {
        if (this.bookingdata) {
          let findbooking;
          findbooking = _.findWhere(this.bookingdata, { appointmentId: +params.id });
          findbooking.status = 'Cancelled';
        }
      } else if (params.flag === '2') {

      }
    });
    if (this.bookingdata) {
      this.bookingdata.forEach((bookingData: any) => {
        bookingData.isTableChecked = false;
      });
      this.initiateVideoSession();
      this.customerFlag();
    }
  }

  ngOnInit() {
  }

  /**
   * Start video session only before 10 minutes of appointment time
   */
  initiateVideoSession() {
    if(this.bookingdata){
      this.bookingdata.map(B => {
        const dtSlotTime: any = new Date(B.completeData.slot.startsAt);
        const dtNow: any = new Date();
        // const diff = Math.abs(dtNow - dtSlotTime);
        // const dif = moment.duration(moment(dtSlotTime).diff(moment())).asMinutes();
        // B.isEnable = ((Math.ceil((diff / 1000) / 60) <= (10 + B.completeData.slot.duration)) && (B.status === 'Confirmed'));
        const diff = dtSlotTime - dtNow;
        if (((diff / 1000) / 60) <= 10 && ((diff / 1000) / 60) >= - B.completeData.slot.duration
          && (B.status === 'Confirmed') && (B.status !== 'Completed')) {
          B.isEnable = true;
          // } else {
          //   B.isEnable = false;
        }
      });
    }
  }

  customerFlag() {
    this.isCustomer = (this.flag === 'customer');
    this.isVet = (this.flag === 'vet');
  }
  /**
   * popover call
   * @param data table data
   * @param ev trigger event from popover
   */
  async presentPopover(data, ev: any) {
    this.checkRole(data, ev);
    // popover Trigger logic
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      showBackdrop: false,
      cssClass: 'table-pop-over-style',
      componentProps: { Data: data, menuItems: this.menuItems }
    });
    popover.onDidDismiss().then((popoverMenu) => {
      if (popoverMenu !== null) {
        this.popoverActions(popoverMenu.data, popoverMenu.role);
      }
    });
    return await popover.present();
  }
  /**
   * action for menu item
   * @param dataFromPopover data from table
   * @param menuItem menu name check
   */
  popoverActions(dataFromPopover, menuItem) {
    if (menuItem === 'Cancel Booking') {
      this.commonService.cencelledSubject.next({ value: true, data: dataFromPopover });
      dataFromPopover.isTableChecked = false;
    } else if (menuItem === 'Joining Late') {
      this.commonService.lateSubject.next({ value: true, data: dataFromPopover });
      dataFromPopover.isTableChecked = false;
    } else if (menuItem === 'Download-Invoice') {
      this.invoicePdfService.generateInvPDF(dataFromPopover.appointmentId);
      dataFromPopover.isTableChecked = false;
    } else if (menuItem === 'Confirm Appt.') {
      const confirmApptObj = {
        bookingId: dataFromPopover.completeData.id,
        slotId: dataFromPopover.completeData.slotId,
        startsAt: moment(new Date(dataFromPopover.completeData.slot.startsAt)).format('MMM D, YYYY| h:mm A'),
        email: dataFromPopover.completeData.user.email,
        vetName: dataFromPopover.completeData.slot.user.firstName,
        appointmentOn: dataFromPopover.completeData.createdOn,
        practiceName: dataFromPopover.completeData.slot.practice.practiceName,
        firstName: dataFromPopover.completeData.user.firstName,
        petName: dataFromPopover.completeData.appointments[0].pet.petName,
        practiceEmail: dataFromPopover.completeData.slot.practice.email,
        vetEmail: dataFromPopover.completeData.slot.user.email,
      };
      this.tableService.canfirmAppointment(confirmApptObj).subscribe(res => {
        let findbooking;
        findbooking = _.findWhere(this.bookingdata, { appointmentId: +confirmApptObj.bookingId });
        findbooking.status = 'Confirmed';
      });
    } else if (menuItem === 'Re-Book') {
      this.router.navigate(['/pets/appointments'], { queryParams: { petId: dataFromPopover.petId, flag: 'rebook' } });
      dataFromPopover.isTableChecked = false;
    } else if (menuItem === 'Edit Booking') {
      this.appointmentService.setselectedAppoitments(dataFromPopover);
      dataFromPopover.isTableChecked = false;
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['/pets/appointments'], { queryParams: { appointmentId: dataFromPopover.appointmentId, slot: dataFromPopover.completeData.slot.id, id: dataFromPopover.petId, flag: 'edit' } });
    }
  }
  /** Function to Start the Video Session for the Selected Booking
   * @param bookingData Contains the Selected BookingData
   */
  StartVideo(bookingData) {
    const bookingDatavideo = {};
    if(bookingData){
      bookingDatavideo['bookingId'] = bookingData.appointmentId;
      bookingDatavideo['userId'] = bookingData.userId;
      bookingDatavideo['vetId'] = bookingData.practicerId;
      bookingDatavideo['Vetname'] = bookingData.practicerName;
    }
    if (this.commonService.getStorage && this.commonService.getStorage['userroles.role.roleName'] === 'PO') {
      bookingDatavideo['subscriberPic'] = bookingData.completeData.slot.user.profilePic;
    } else if (this.commonService.getStorage && this.commonService.getStorage['userroles.role.roleName'] === 'VET') {
      bookingDatavideo['subscriberPic'] = bookingData.completeData.appointments[0].pet.profilePic;
    }
    this.onlineconsultationService.setBookingDetails(bookingDatavideo);
    this.router.navigate(['/online-consultation/startvideo']);
  }

  checkRole(data, ev: any) {
    if(data){
      const temp = new Date(data.completeData.slot.startsAt);
      const appDate = moment(temp).subtract(24, 'hours');
      if (data.role === 'VET') {
        // check for vet booking
        switch (data.status) {
          case 'Cancelled': this.menuItems = ['No actions available']; break;
          // Joining Late enable before 24 hours
          case 'Confirmed':
            this.menuItems = ['Joining Late']; break;
          case 'Awaiting confirmation': this.menuItems = ['No actions available']; break;
          case 'Completed': this.menuItems = ['No actions available']; break;
          default: break;
        }
      } else if (data.role === 'PO') {
        // console.log(data);
        switch (data.status) {
          case 'Cancelled': this.menuItems = ['Re-Book']; break;
          case 'Confirmed':
            if ((moment(appDate).diff(moment()) > 0)) {
              if (!data.completeData.slot.isPrivate) {
                this.menuItems = ['Cancel Booking', 'Edit Booking']; break;
              } else {
                this.menuItems = ['Cancel Booking']; break;
              }
            } else {
              this.menuItems = ['Cancel Booking']; break;
            }
          case 'Awaiting confirmation':
            if ((moment(appDate).diff(moment()) > 0)) {
              this.menuItems = ['Cancel Booking', 'Edit Booking']; break;
            } else {
              this.menuItems = ['Cancel Booking']; break;
            }
          case 'Completed': this.menuItems = ['Download-Invoice', 'Re-Book']; break;
          default: break;
        }
      } else if (data.role === 'PA') {
        switch (data.status) {
          case 'Cancelled': this.menuItems = ['No actions available']; break;
          case 'Confirmed': this.menuItems = ['No actions available']; break;
          // Joining Late enable before 24 hours
          case 'Awaiting confirmation':
            this.menuItems = ['Confirm Appt.', 'Cancel Appt.']; break;
          case 'Completed': this.menuItems = ['Download-Invoice']; break;
          default: break;
        }
      }
    }
  }
}
