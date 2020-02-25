import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
import { CommonService } from 'src/app/common/services/common.service';
import { InvoicePdfService } from 'src/app/common/invoicePdf/InvoicePdfService';
import { PopoverComponent } from 'src/app/common/components/table/popover/popover.component';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss'],
})
export class AppointmentsListComponent implements OnInit, OnChanges {
  selectvalue: any;
  getarray: any;
  // table data
  @Input() data;
  // menu items on popover
  @Input() menuItems;
  statusList: any = Array<any>();
  sortedData: any[];

  constructor(
    private popoverController: PopoverController,
  ) {
    this.statusList = ['Awaiting confirmation', 'Confirmed', 'Cancelled', 'Completed'];
  }

  ngOnChanges() {
    if(this.data!=undefined)
    {

  
     this.data.sort((a, b) => {
      return this.statusList.indexOf(a.status) - this.statusList.indexOf(b.status);
    });
  }
  }

  ngOnInit() {
  }

  /**
   * popover call
   * @param data table data
   * @param ev trigger event from popover
   */
  async presentPopover(data, ev: any) {
    // popover Trigger logic
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
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

  }
}
