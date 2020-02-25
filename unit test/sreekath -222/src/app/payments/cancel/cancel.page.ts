import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PaymentsService } from '../payments.service';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.page.html',
  styleUrls: ['./cancel.page.scss'],
})
export class CancelPage implements OnInit {
  failure = false;
  transaction_ID: any;
  message:any;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router, 
              private paymentsService: PaymentsService,
              private cd: ChangeDetectorRef ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.transaction_ID = params.trans_id;
      this.intiateSlotRelease(params.trans_id);
    });
  }


  intiateSlotRelease(transid) {
   const transupdate = {};
   transupdate['id'] = transid;
   transupdate['statusName'] = 'Cancelled';
   this.paymentsService.updateStatus(transupdate).subscribe(res => {
     this.failure = true;
     this.message = res.message;
     this.cd.detectChanges();
      // console.log('res', res);

    });
  }

  manageAppointment() {
    this.router.navigate(['/pets/dashboard'], { queryParams: { flag: 1 } });
  }

}
