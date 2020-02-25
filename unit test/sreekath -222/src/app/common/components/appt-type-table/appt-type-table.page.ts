import { Component, OnInit, Input, HostListener, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { AppointmentType } from './appointmentType.model';
import { AppointmentTypeService } from '../../services/appointment-types.service';
import * as _ from 'underscore';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-appt-type-table',
  templateUrl: './appt-type-table.page.html',
  styleUrls: ['./appt-type-table.page.scss'],
})
export class ApptTypeTablePage implements OnInit, OnChanges {
  @ViewChild('apptTypeForm', { static: false }) apptTypeForm: NgForm;
  @Input() apptTypes;
  private: string;
  practiceAdmin: boolean;
  value: any;
  timeslots: any = [];
  apptBtn: string;
  apptModel = new AppointmentType();
  isPublicChecked: boolean;
  isPrivateChecked: boolean;
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.value = false;
    }
  }
  constructor(
    private commonService: CommonService, private eRef: ElementRef,
    private appointmentTypeService: AppointmentTypeService, private alertController: AlertController) { }
  ionViewWillEnter() {
    this.ngOnInit();
  }
  ngOnChanges() {
    if (this.apptTypes) {
      this.apptTypes = this.apptTypes.filter(aptType => aptType.isActive === true);
    }
  }
  ngOnInit() {
    this.timeslots = [0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    if (this.commonService.getStorage && this.commonService.getStorage['userroles.role.roleName'] === 'PA') {
      this.practiceAdmin = true;
    } else {
      this.practiceAdmin = false;
    }
  }

  isPrivate(value: any): void {
    if (value === 'private') {
      this.apptModel.isPrivate = true;
    } else {
      this.apptModel.isPrivate = false;
    }
  }
  addNewApptType() {
    this.value = 'show';
    this.apptModel = new AppointmentType();
    this.apptTypeForm.form.reset();
    this.apptBtn = 'Add';
  }
  createApptType() {
    if (!this.apptModel.isPrivate) {
      this.apptModel.isPrivate = false;
    }
    if (this.practiceAdmin) {
      this.apptModel.vhdPrice = 0;
    }
    // this.apptModel.practiceId = this.apptTypes.practiceId;
    if(this.apptTypes){
      this.apptTypes.map(practiceId => {
        this.apptModel.practiceId = practiceId.practiceId;
      });
    }
    if(this.apptModel && this.apptModel.appointmentType || ''){
      this.apptModel.appointmentType = this.apptModel.appointmentType.trim();
      this.apptModel.customerFee = +this.apptModel.practiceFee + +this.apptModel.vhdPrice;
    }
      
    if (Object.keys(this.apptModel).includes('id')) {
      this.appointmentTypeService.editAppointmentType(this.apptModel).subscribe((editAppt) => {
        const dummyArr = [];
        dummyArr.push(editAppt.data);
        this.apptTypes = this.apptTypes.map(obj => dummyArr.find(o => o.id === obj.id) || obj);
      });
    } else {
      this.appointmentTypeService.addApptType(this.apptModel).subscribe((apptType) => {
        this.apptTypes.push(apptType.data);
      });
    }
  }
  editApptType(apptType) {
    if (apptType.isPrivate) {
      this.apptModel.isPrivate = false;
    } else {
      this.apptModel.isPrivate = true;
    }
    this.value = 'show';
    this.apptBtn = 'Edit';
    this.apptModel = { ...apptType };
    this.apptModel.vhdPrice = +apptType.customerFee - +apptType.practiceFee;
    console.log(this.apptModel.isPrivate);
  }

  async confirmationAlert(apptType) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: `Are you sure you want to delete ${apptType.appointmentType}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'alert-box',
          handler: (blah) => { }
        }, {
          text: 'Yes',
          handler: () => {
            this.deleteApptType(apptType);
          }
        }
      ]
    });
    await alert.present();
  }
  deleteApptType(apptType) {
    apptType.isActive = false;
    this.appointmentTypeService.deleteApptType(apptType).subscribe((deletedAppt: any) => {
      const deleted = _.findWhere(this.apptTypes, { id: apptType.id });
      const deletedIndex = _.indexOf(this.apptTypes, deleted);
      this.apptTypes.splice(deletedIndex, 1);
    });
  }
}
