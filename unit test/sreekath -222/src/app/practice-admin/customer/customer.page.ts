import { Component, OnInit, OnChanges } from '@angular/core';
import { User } from '../../common/models/user';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common/services/common.service';
import { PracticeAdminService } from '../practice-admin.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit, OnChanges {
  model: any = new Array<User>();
  selectedCustomer: any;
  isNew = true;
  isView: boolean;
  flag = 'customer';
  isCustomerData: boolean;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private practiceAdminService: PracticeAdminService
  ) {
  }

  ngOnInit() {
    this.getCustomers();
    this.commonService.vetUpdateObservable.subscribe(res => {
      this.getCustomers();
    });
  }

  ngOnChanges() {
    this.getCustomers();
  }

  /**
   * send magic link to customer
   */
  sendInvite() {
  }

  /**
   * get customer list by practice id
   */
  getCustomers() {
    this.practiceAdminService.getCustomersByPractice(this.commonService.getStorage && this.commonService.getStorage.practiceId).subscribe((res) => {
      this.model = res.data;
      res.data.map((d) => {
        if (this.selectedCustomer && d.id === this.selectedCustomer.id) {
          this.viewCustomerInfo(d);
        }
      });
      this.isCustomerData = true;
    });
  }

  /**
   * Get emmited data
   */
  viewCustomerInfo(customer) {
    this.isNew = false;
    this.isView = true;
    this.selectedCustomer = customer;
  }

  addNewCustomer(customer) {
    this.isNew = true;
    this.isView = false;
  }
}
