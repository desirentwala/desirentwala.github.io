import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vhd-popover',
  templateUrl: './vhd-popover.component.html',
  styleUrls: ['./vhd-popover.component.scss'],
})
export class VhdPopoverComponent implements OnInit {
  menuArr: any = [];
  constructor(
    private router: Router,
    private ViewController: PopoverController,
    public navParams: NavParams) {
    this.menuArr = this.navParams.get('menuItems');
  }

  ngOnInit() { }

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
      default: break;
    }
  }

  async cancelBooking() {
    await this.ViewController.dismiss();
  }
  async rebook() {
    await this.ViewController.dismiss();
    this.router.navigate(['/pets/appointments']);
  }
  async downloadInvoice() {
    await this.ViewController.dismiss();
  }
  async lateJoin() {
    await this.ViewController.dismiss();
  }
  editBooking() {
    this.close();
  }

}
