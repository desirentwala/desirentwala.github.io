import { Component, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { PetService } from '../pets.service';
import { CommonService } from '../../common/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnChanges {
  data: Array<any>;
  petList: Array<any>;
  allPets: Array<any>;
  listData: Array<any>;
  result: any;
  isShow: boolean;
  isDisabled: boolean;

  constructor(
    private router: Router,
    private petService: PetService,
    private commonServcice: CommonService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) { }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.getPetList();
      this.isShow = false;
    });
  }

  ngOnChanges() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.getPetList();
      this.isShow = false;
    });
  }
  /**
   * get pet information
   */
  getPetList() {
    this.petService.getPetList(this.commonServcice.getStorage && this.commonServcice.getStorage.id).subscribe((res: any) => {
      this.allPets = res.data;
      this.showActivePets();
      this.isShow = false;
    });
  }
  /**
   * basepath for download
   */
  get basePath(): string {
    return environment.baseUri;
  }

  /**
   * Handle show and hide pet
   */
  showActivePets() {
    if (!this.isShow) {
      this.petList = [];
      if (this.allPets) {
        this.petList = this.allPets.filter(pet => pet.hide === false);
      }
    } else {
      this.petList = this.allPets;
    }
  }

  /**
   * Navigating to pet edit page to update pet info
   * @param pet selected pet info
   */
  viewPetInfo(pet) {
      this.router.navigate(['/pets/view'], { queryParams: { id: pet.id } });
  }

  /**
   * Navigating to selected pet info page
   * @param pet Selected pet details
   */
  viewPet(pet) {
    this.router.navigate(['/pets/view'], { queryParams: { id: pet.id } });
  }

  /**
   * Navigating to appointment page only for active pets
   * @param pet selected pet for appointment
   */
  handleBookingButton(pet) {
    if (pet && !pet.hide) {
      this.router.navigate(['/pets/appointments'], { queryParams: { id: pet.id } });
    }
  }

  /**
   * Confirmation before delete
   */
  async confirmationAlert(pet) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: `Are you sure you want to delete ${pet.petName}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'alert-box',
          handler: (blah) => { }
        }, {
          text: 'Yes',
          handler: () => {
            this.deletePet(pet);
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Deletig pet profile
   * @param pet selected pet info
   */
  deletePet(pet) {
    this.petService.deletePet(pet && pet.id).subscribe(res => {
      this.petList = this.petList.filter(P => P.id !== pet.id);
      this.allPets = this.allPets.filter(P => P.id !== pet.id);
    });
  }
}
