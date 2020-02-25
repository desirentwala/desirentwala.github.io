import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PaymentsService } from '../../../payments/payments.service';
import { AppointmentService } from '../../../pets/appointment.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { MagicLinkService } from '../../services/magic-link/magic-link.service';

@Component({
  selector: 'app-appointment.conditions.page',
  templateUrl: './appointment.conditions.page.html',
  styleUrls: ['./appointment.conditions.page.scss'],
})
export class AppointmentConditionsPage implements OnInit {
  @Input() header;
  @Input() subHeader;
  @Input() tc;
  @Input() bookingInfo;
  status = false;
  isActive: boolean;
  userProfile: any;
  email: any;

  constructor(
    public modalController: ModalController,
    private paymentsService: PaymentsService,
    private router: Router,
    private magicLinkService: MagicLinkService,
    private appService: AppointmentService) {
  }

  ngOnInit() {
  }

  /** Fucntion to Navigate to Payment Using Stripe
   */
  bookAndPay() {
    this.appService.bookAppointment(this.bookingInfo).subscribe((res) => {
      if (this.bookingInfo.slot.isPrivate) {
        this.magicLinkService.setStatusToUsed().subscribe((resp) => { });
      }
      if (this.bookingInfo.price === 0) {
        this.dismiss();
        this.appService.bookDirectAppointment(this.bookingInfo).subscribe(
          booking => {
            if (booking.data.id) {
              this.router.navigate(['/payments/success'], { queryParams: { session_id: 'zero_transaction', bookingId: booking.data.id } });
            }
          }
          , err => {
          }
        );
        // this.router.navigateByUrl('/pets/bookings', { queryParams: { flag: 1 } });
      } else if (this.bookingInfo.id && this.bookingInfo.oldSlotId) {
        this.router.navigateByUrl('/pets/bookings', { queryParams: { flag: 2 } });
        this.dismiss();
      } else {
        this.bookingInfo.bookingId = res.data.bookingId;
        this.dismiss();
        this.paymentsService.onCheckOut(this.bookingInfo);
      }
    });
  }

  /**
   * Closing the modal
   */
  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
