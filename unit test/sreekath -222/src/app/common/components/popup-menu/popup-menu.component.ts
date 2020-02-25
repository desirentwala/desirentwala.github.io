import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.scss'],
})
export class PopupMenuComponent implements OnInit {

  public popupMenuContent: Array<String>;

  constructor(private popoverCtrl: PopoverController, public navParams: NavParams) {
    this.popupMenuContent = this.navParams.data.popupMenuContent;
  }

  ngOnInit() { }

  async onDismiss() {
    try {
      await this.popoverCtrl.dismiss();
    } catch (e) {
      //click more than one time popover throws error, so ignore...
    }
  }

  public onMenuItemClick(currentItem) {
  }

}
