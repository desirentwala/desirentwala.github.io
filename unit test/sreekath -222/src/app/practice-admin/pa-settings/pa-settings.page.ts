import { Component, OnInit } from '@angular/core';
import { AppointmentTypeService } from 'src/app/common/services/appointment-types.service';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-pa-settings',
  templateUrl: './pa-settings.page.html',
  styleUrls: ['./pa-settings.page.scss'],
})
export class PaSettingsPage implements OnInit {
  apptTypes: any = [];
  menuItems: any = [];
  activeIndex: number;
  storageItem: any;
  constructor(
    private appointmentTypeService: AppointmentTypeService,
    private commonService: CommonService
  ) {
    this.storageItem = this.commonService.getStorage;
  }
  ionViewWillEnter() {
    this.activeIndex = 0;
    this.appointmentTypeService.getApptTypeByPractice(this.storageItem && this.storageItem.practiceId).subscribe((apptTypes: any) => {
      this.apptTypes.practiceId = this.storageItem.practiceId;
      this.apptTypes = apptTypes.data;
    });
    this.menuItems = [
      { icon: 'fal fa-users-cog', route: 'Appointment types' },
      // { icon: 'fal fa-copyright' , route: 'Branding'},
    ];
  }
  ngOnInit() {
  }
  selecteByRoute(navigation, index) {
    this.activeIndex = index;
  }
}
