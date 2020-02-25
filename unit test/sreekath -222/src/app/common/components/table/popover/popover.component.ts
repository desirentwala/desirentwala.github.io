import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
// import {  } from 'protractor';
import { AppointmentService } from '../../../../pets/appointment.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {
  menuArr: any = [];
  selectedAppointment: any;
  constructor(
    private router: Router,
    private ViewController: PopoverController,
    public navParams: NavParams,
    private appointmentService: AppointmentService
  ) {
    this.menuArr = this.navParams.get('menuItems');
    this.selectedAppointment = this.navParams.get('Data');
  }

  ngOnInit() {
  }

  close() {
    this.ViewController.dismiss();
  }
  menuItemClick(menuName) {
    switch (menuName) {
      case 'Cancel Booking': this.cancelBooking(); break;
      case 'Re-Book': this.rebook(); break;
      case 'Download-Invoice': this.downloadInvoice(); break;
      case 'Joining Late': this.lateJoin(); break;
      case 'Edit Booking': this.editBooking(); break;
      case 'Confirm Appt.': this.confirmAppt(); break;
      case 'Cancel Appt.': this.cancelBooking(); break;
      default: break;
    }
  }
  async cancelBooking() {
    await this.ViewController.dismiss(this.selectedAppointment, 'Cancel Booking');
  }
  async rebook() {
   
    await this.ViewController.dismiss(this.selectedAppointment, 'Re-Book');
    this.router.navigate(['/pets/appointments'], { queryParams: { petId: this.selectedAppointment.petId, flag: 'rebook' } });
  }
  async downloadInvoice() {
    await this.ViewController.dismiss(this.selectedAppointment, 'Download-Invoice');
  }
  async lateJoin() {
    await this.ViewController.dismiss(this.selectedAppointment, 'Joining Late');
  }
  async confirmAppt() {
    await this.ViewController.dismiss(this.selectedAppointment, 'Confirm Appt.');
  }
  editBooking() {
    this.close();
    this.appointmentService.setselectedAppoitments(this.selectedAppointment);
    if(this.selectedAppointment){
      this.router.navigate(['/pets/appointments'], { queryParams: { appointmentId: this.selectedAppointment.appointmentId, slot: this.selectedAppointment.completeData.slot.id, id: this.selectedAppointment.petId, flag: 'edit' } });
    }
  }
}
