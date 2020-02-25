import { Component, OnInit, ViewChild } from '@angular/core';
import { PetService } from 'src/app/pets/pets.service';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { Vet } from 'src/app/practice-admin/addnew-vet/vet-user.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { CommonService } from 'src/app/common/services/common.service';
import { VetPracticeService } from 'src/app/vet-practice/vet-practice.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/common/services/auth.service';
import { NotificationService } from 'src/app/common/services/notification.service';
import { MagicLinkService } from 'src/app/common/services/magic-link/magic-link.service';

import { from } from 'rxjs';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-practice-selection',
  templateUrl: './practice-selection.page.html',
  styleUrls: ['./practice-selection.page.scss'],
})
export class PracticeSelectionPage implements OnInit {
  @ViewChild(NgForm, {static: false}) ngForm: NgForm;

  allVets: any = [];
  vet = new Vet();
  vets: any = [];
  searchResults: boolean;
  practice: any;
  vetPracticeId: any;
  isNextBtn: boolean;
  addPracticeDetails: boolean;
  isMobile: boolean;
  speciesList: any = [];
  speciesArray: any = [];
  initialImages = 3;
  from = 0;
  activeIndex: number;
  selectedSpeciess: any = [];
  profDetails: any;
  isDisabled: boolean = false;
  practiceName: any;
  constructor(
    private platform: Platform,
    private petService: PetService, private practiceService: PracticeAdminService, private camera: Camera,
    public actionSheetController: ActionSheetController,
    private commonService: CommonService,
    private vetPracticeService: VetPracticeService,
    private router: Router,
    public storage: Storage,
    private authService: AuthService,
    private magicLinkService: MagicLinkService,
    private nfs: NotificationService) {
    this.addPracticeDetails = false;
    this.profDetails = this.commonService.getStorage;
    if (this.profDetails) {
      this.vet.firstName = this.profDetails.firstName;
      this.vet.email = this.profDetails.email;
      this.vet.mobile = this.profDetails.mobile;
      this.vet.id = this.profDetails.id;
      this.petService.getAllPractices().subscribe((practices: any) => {
        this.allVets = practices.data;
      });
    }

    /**
     * device check
     */
    if (navigator.userAgent.match(/Android/i)
      // || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    if (this.platform.is('mobileweb')) {
      this.isMobile = false;
    }
  }

  ionViewWillEnter() {
    this.storage.get('ONBOARD_VET').then((val) => {
      if (val !== null) {
        this.vet.id = this.authService.getUser().id;
        this.vet.practiceId = val.practiceId;
        this.practice = val.practiceName;
        this.vetPracticeId = val.practiceId;
        this.practiceName = val.practiceName;
        this.isDisabled = true;
        this.navigateToDetails();
      }

    });
  }
  ngOnInit() {
    this.vets = this.allVets;
    this.storage.get('ONBOARD_VET').then((val) => {
      if (val !== null) {
        this.vet.id = this.authService.getUser().id;
        this.vet.practiceId = val.practiceId;
        this.practice = val.practiceName;
        this.vetPracticeId = val.practiceId;
        this.practiceName = val.practiceName;
        this.isDisabled = true;
        this.navigateToDetails();
      }

    });
  }
  /**
   *  filter the vets based on search value
   * @param val contains search value to filter
   */
  search(val) {
    this.isNextBtn = false;
    if (val === '') {
      this.vets = [];
      this.searchResults = false;
    } else {
      this.searchResults = true;
      const value = val.toLowerCase();
      this.vets = [];
      this.allVets.map((data) => {
        if (data.practiceName.toLowerCase().indexOf(value) !== -1 || value === '') {
          this.vets.push(data);
        }
      });
    }
  }

  /**
   * @param selectedPractice contains selected data of practicer list
   */
  hideList(selectedPractice) {
    this.isNextBtn = true;
    this.searchResults = false;
    this.practice = selectedPractice.practiceName;
    this.vetPracticeId = selectedPractice.id;
  }
  navigateToDetails() {

    if (this.isDisabled) {
      this.storage.get('ONBOARD_VET').then((val) => {
        if (val !== null) {
          this.vet.practiceId = val.practiceId;
          this.practice = val.practiceName;
          this.vetPracticeId = val.practiceId;
          this.practiceName = val.practiceName;
          this.isDisabled = true;
        }
      });
    }
    this.addPracticeDetails = true;
    this.practiceService.getPaProfileData(this.vetPracticeId).subscribe((PaDetails: any) => {
      this.speciesList = PaDetails.data.practiceSpecies.map((eachSpices) => {
        const obj = Object.assign({}, eachSpices);
        obj.isActive = false;
        return obj;
      });
      this.initialImages = this.speciesList.length < this.initialImages ? this.speciesList.length : 3;
      this.speciesArray = this.speciesList.slice(this.from, this.initialImages);
    });
  }
  /**
   * active class set for species selection
   * @param speciesData species data on selection
   * @param index index of the species data
   */
  selectedSpecies(speciesData: any, index: any) {
    if (this.selectedSpecies.length === 0) { }
    if (this.selectedSpecies.length !== 0) {
      const presentID = this.selectedSpeciess.findIndex((species) => {
        return speciesData.id === species.id;
      });
      if (presentID < 0) {
        this.speciesList.map((species) => {
          return species.id === speciesData.id ? species.isActive = true : species;
        });
        this.vet.species.push(speciesData.id);
        this.selectedSpeciess.push(speciesData);
      } else {
        this.speciesList.map((species) => {
          return species.id === speciesData.id ? species.isActive = false : species;
        });
        this.selectedSpeciess.splice(presentID, 1);
        this.vet.species.splice(speciesData.id);
      }
    } else {
      this.selectedSpeciess.push(speciesData);
      this.vet.species.push({ id: speciesData.id });
    }
  }

  /**
   * show more species
   */
  onPrevious() {
    this.speciesArray = this.speciesList.slice(this.from - 1, this.initialImages - 1);
    this.from -= 1;
    this.initialImages -= 1;
    this.activeIndex += 1;
  }

  /**
   * show less species
   */
  onNext() {
    this.speciesArray = this.speciesList.slice(this.from + 1, this.initialImages + 1);
    this.from += 1;
    this.initialImages += 1;
    this.activeIndex -= 1;
  }
  updateVet() {
    this.storage.get('ONBOARD_VET').then((val) => {
      this.vetPracticeId = val.practiceId;
    })
    const spcArr: any = [];
    this.selectedSpeciess.forEach(spc => {
      spcArr.push(spc.speciesId);
    });
    this.vet.species = spcArr;
    this.vet.isActive = true;
    if (this.vetPracticeId !== undefined) {
      this.vet.practiceId = this.vetPracticeId;
    }
    this.vetPracticeService.updateVetProfile(this.vet).subscribe((vet: any) => {
      const profDetails = this.commonService.getStorage || {};
      profDetails['practiceId'] = this.vet.practiceId;
      localStorage.setItem('result', JSON.stringify(profDetails));
      if (this.isDisabled) {
        this.router.navigateByUrl('/auth');
        this.nfs.notification('Registered Successfully Please Login', 'success');
        if (this.magicLinkService.checkforMaglinkId()) {
          this.magicLinkService.setStatusToUsed().subscribe(res => {
            this.storage.clear();
          });
        }
      } else {
        this.router.navigate(['/vetpractice/dashboard']);
      }
    });
  }
}
