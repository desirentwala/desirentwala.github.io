import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Customer } from '../customer';
import { PracticeAdminService } from '../practice-admin.service';
import { CommonService } from 'src/app/common/services/common.service';
import { NotificationService } from 'src/app/common/services/notification.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.page.html',
  styleUrls: ['./invite-user.page.scss'],
})
export class InviteUserPage implements OnInit {
  @ViewChild('customerForm', { static: false }) customerForm: NgForm;

  model = new Customer();
  // passwordShow: boolean;
  // isInvite: boolean;
  // isAdd: boolean;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private notify: NotificationService,
    private practiceAdminService: PracticeAdminService
  ) { }

  ngOnInit() {
    // this.init();
  }

  // init() {
  //   this.model.value = 'invite';
  // }

  /**
   * to change input type for password
   */
  // changePasswordType() {
  //   this.passwordShow = !this.passwordShow;
  // }

  // optionSelector(val) {
  //   this.model.value = val;
  //   if (val === 'invite') {
  //     this.isInvite = true;
  //     this.isAdd = false;
  //   } else {
  //     this.isAdd = true;
  //     this.isInvite = false;
  //   }
  // }

  /**
   * send magic link to customer
   */
  inviteCustomer() {
    const data = {
    //  email: this.model.email.trim().toLowerCase(), check with suneel
      petName: this.model.petName,
      userId: this.commonService.getStorage.id,
      practiceId: this.commonService.getStorage.practiceId,
      mlFor: 'INVITE_PO'
    };
    this.practiceAdminService.inviteCustomer(data).subscribe((res) => {
      this.model = res.data;
      this.notify.notification('Invitation sent successfully', 'success');
      this.customerForm.reset();
    });
  }
}
