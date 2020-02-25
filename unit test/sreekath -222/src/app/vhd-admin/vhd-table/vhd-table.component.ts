import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { CommonService } from 'src/app/common/services/common.service';
import { VhdAdminService } from '../vhd-admin.service';
import { NotificationService } from 'src/app/common/services/notification.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DeleteConfirmationService } from 'src/app/common/services/deleteConfirmation.service';

@Component({
  selector: 'app-vhd-table',
  templateUrl: './vhd-table.component.html',
  styleUrls: ['./vhd-table.component.scss'],
})
export class VhdTableComponent implements OnInit, OnChanges {
  contents: any;
  @Input() practicerDetails;
  @Input() header;
  @Input() menuItems;
  addOrEditPet: any;
  addOrEditVet: string;
  @Input()
  public set data(v) {
    if (v) {
      this.update();
      this.contents = v;
    }
  }
  columnType: any;
  selectedVetData: any;
  selectedPetOwnerData: any;
  petInfo: any;
  @Input()
  public set type(v: any) {
    this.columnType = v;
  }
  public get type(): any {
    return this.columnType;
  }

  interval: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private deleteVet: DeleteConfirmationService
  ) { }

  ionViewWillEnter() {

    const resultObj = JSON.parse(localStorage.getItem('result'));
    if(resultObj!=null || resultObj!=undefined){
    const role = resultObj['userroles.role.roleName'];
    this.interval = setInterval(() => {
      if (role === 'VHDA') {
        this.ngOnInit();
        }
      },  90 * 10000 );
    }
  }
  ionViewDidLeave() {
    clearInterval(this.interval);
  }
  ngOnInit() {  }
  ngOnChanges() {
    // console.log(this.contents);
  }

  /**
   * rearrang for species or pets slider
   * @param id contains selected vet or petOwner
   */
  onPrevious(id) {
    if(this.contents){
    this.contents.map((data) => {
      if (id === data.id && data.start !== 0) {
        data.start -= 1;
        data.end -= 1;
        data.images = data.pets.slice(data.start, data.end);
      }
    });
  }
  }

  /**
   * rearrang for species or pets slider
   * @param id contains selected vet or petOwner
   */
  onNext(id) {
    if(this.contents){
    this.contents.map((data) => {
      if (id === data.id && data.end < data.pets.length) {
        data.start += 1;
        data.end += 1;
        data.images = data.pets.slice(data.start, data.end);
      }
    });
  }

}

  /**
   * edit vet or petOwner
   * @param val contains selected vet or pet data for edit
   */
  edit(val, type) {
    if (this.type === 'vets') {
      this.selectedVetData = { id: val.id, practiceId: this.practicerDetails.id };
      this.selectedPetOwnerData = false;
      this.addOrEditVet = type;
    } else {
      this.selectedVetData = false;
      this.petInfo = false;
      this.selectedPetOwnerData = val;
    }
  }

  /**
   * soft delete pet
   */
  async delete(data) {
    this.deleteVet.deleteVet(data);
  }
  /**
   * emited data back from child component
   */
  update() {
    this.selectedVetData = false;
    this.selectedPetOwnerData = false;
    this.petInfo = false;
  }

  /**
   * add or edit pet
   * @param data contains selected pet data for edit
   * @param val add or edit flag
   */
  editPet(data, val) {
    this.petInfo = data;
    this.addOrEditPet = val;
    this.selectedPetOwnerData = false;
  }

  /**
   *
   * @param val contains edit or add vet or petOwner
   */
  add(val) {
    this.addOrEditVet = val;
    if(this.practicerDetails){
      this.selectedVetData = { practiceId: this.practicerDetails.id, prefix: this.practicerDetails.prefix };
    }
  }
}
