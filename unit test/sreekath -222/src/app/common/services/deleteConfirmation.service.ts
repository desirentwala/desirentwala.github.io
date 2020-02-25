import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Platform, ActionSheetController, AlertController } from '@ionic/angular';
import { PetService } from 'src/app/pets/pets.service';
import { CommonService } from './common.service';
import { VhdAdminService } from 'src/app/vhd-admin/vhd-admin.service';
import { NotificationService } from './notification.service';
@Injectable({
  providedIn: 'root'
})
export class DeleteConfirmationService {

  constructor(
    public platform: Platform,
    private petService: PetService,
    public actionSheetController: ActionSheetController,
    private commonService: CommonService,
    private alertController: AlertController,
    private vhdAdminService: VhdAdminService,
    private notify: NotificationService,
  ) { }

  /**
   * soft delete pet
   */
  deletePet(petId, petName) {
    this.petService.getAppointmentsByPet(petId).subscribe((res) => {
      const appts = [];
      let data: any;
      data = res;
      // tslint:disable-next-line: no-shadowed-variable
      data.bookings.map((data: any) => {
        if ((data.statusName !== 'Completed' || data.statusName !== 'Cancelled') &&
          (moment(data.slot.startsAt).add(data.slot.duration, 'minutes') > moment())) {
          appts.push(data.slot);
        }
      });
      if (appts.length === 0) {
        this.deleteConfirmation(petId, petName, 'pet');
      } else {
        this.slotExist(petName, 'pet');
      }
    });
  }

  /**
   * soft delete pet
   */
  deleteVet(vetData) {
    this.vhdAdminService.getAppointmentsByVet(vetData.id, vetData.practiceId).subscribe((res) => {
      let d: any;
      d = res;
      if (d.data.length === 0) {
        this.deleteConfirmation(vetData, vetData.firstName, 'vet');
      } else {
        this.slotExist(vetData.firstName, 'vet');
      }
    });
  }

  /**
   * alert for not deleting pet/vet
   * @param data contains upcoming appts
   */
  async slotExist(name, petOrVet) {
    let msg = '';
    if (petOrVet === 'pet') {
      msg = `Unable to delete ${name} due to upcoming appointment scheduled for the Pet`;
    } else {
      msg = `Unable to delete ${name} due to upcoming slots for the Vet`;
    }
    const alert = await this.alertController.create({
      header: 'Warning!',
      message: msg,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'alert-box',
          handler: (blah) => { }
        }
      ]
    });
    await alert.present();
  }

  /**
   * delete pet/vet
   */
  async deleteConfirmation(data, name, petOrVet) {
    const msg1 = data.active ? 'deactivate' : 'activate';
    let msg = '';
    if (petOrVet === 'pet') {
      msg = `Are you sure you want to delete ${name}?`;
    } else {
      msg = `Are you sure you want to ${msg1} ${name}?`;
    }
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: msg,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'alert-box',
          handler: (blah) => { }
        }, {
          text: 'Yes',
          handler: () => {
            if (petOrVet === 'pet') {
              this.petService.deletePet(data).subscribe((res) => {
                this.commonService.vetUpdateSubject.next(res);
                // this.notify.notification(`pet deleted sucessfully`, 'success');
              });
            } else if (petOrVet === 'vet') {
              this.vhdAdminService.deleteVet(data.id).subscribe((res) => {
                this.commonService.vetUpdateSubject.next('');
                this.notify.notification(`vet ${msg1} sucessfully`, 'success');
              });
            }

          }
        }
      ]
    });
    await alert.present();
  }
}
