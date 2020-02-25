import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, Events } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-popover',
  templateUrl: './home-popover.page.html',
  styleUrls: ['./home-popover.page.scss'],
})
export class HomePopoverPage implements OnInit {
  data = [
    {pic: 'fal fa-dog', category: 'Pet Owner', roleId: 'PO'},
    // {pic: 'fal fa-user-md', category: 'Veterinarian', roleId: 'VET'},
    {pic: 'fal fa-home-lg-alt', category: 'Practice Admin', roleId: 'PA'},
  ];

  constructor(
    private events: Events,
    private router: Router,
    private popoverController: PopoverController) {
  }

  ngOnInit() {

  }

  /**
   * dismmis popover
   */
  eventFromPopover(value) {
    if(value){
      if (value.roleId === 'PA') {
        this.router.navigate(['auth/practiceregister'], { queryParams: { role: value.roleId } });
      } else {
        this.router.navigate(['auth/register'], { queryParams: { role: value.roleId } });
      }
    }
    this.events.publish('fromPopoverEvent');
    this.popoverController.dismiss();
  }
}
