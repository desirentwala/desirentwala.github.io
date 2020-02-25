import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Pet } from '../pet.model';
import { CommonService } from '../../common/services/common.service';
import { PetService } from '../pets.service';
import * as _ from 'underscore';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { CDVPhotoLibraryPipe } from '../../common/pipes/cdvphotolibrary.pipe';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { formatDate } from '@angular/common';
import { NotificationService } from 'src/app/common/services/notification.service';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { Storage } from '@ionic/storage';
import { MagicLinkService } from 'src/app/common/services/magic-link/magic-link.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
  providers: [Camera]
})
export class NewPage implements OnInit {
  @ViewChild('petForm', { static: false }) petForm: NgForm;

  pet = new Pet();
  imgUrl: any;
  heading: string;
  imagePath: any;
  genderList: any = [];
  speciesList: any = [];
  speciesArray: any[];
  isNeutered: boolean;
  initialImages = 3;
  from = 0;
  activeIndex: any;
  addPracticeDetails: boolean;
  // new
  allVets: any = [];
  practice: any;
  vets = [];
  searchResults: boolean;
  vetPracticeId: any;
  disablePractice: boolean;
  profilePic: FileList;
  isNextBtn: boolean;
  // for choosing one image
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  isMobile: boolean;
  presentDate: any;
  isInvalid: boolean;
  bolbPic: any;
  isGender: boolean;
  vetDetails = [];
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private petService: PetService,
    private commonServcice: CommonService,
    private camera: Camera,
    private storage: Storage,
    public actionSheetController: ActionSheetController,
    public notificationService: NotificationService,
    private PracticeService: PracticeAdminService,
    private magicLinkservice: MagicLinkService,
    public platform: Platform
  ) {
    // is mobile check
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

    this.addPracticeDetails = false;
    this.activeRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.disablePractice = true;
        this.addPracticeDetails = true;
        this.retrivePet(params.id);
      } else {
        this.petService.getAllPractices().subscribe((practices: any) => {
          this.allVets = practices.data;
        });
        this.pet = new Pet();
      }
    });
    this.genderList = ['Male', 'Female'];
    this.heading = 'Please enter your pet’s details ';
  }

  ionViewWillEnter() {
    this.isGender = false;
    this.isInvalid = false;
    this.storage.get('ONBOARD_PO').then((petOnwerValue) => {
      if (petOnwerValue !== null && petOnwerValue.petName !== null) {
        this.pet.petName = petOnwerValue.petName;
        // this.vetPracticeId = petOnwerValue.practiceId;
        this.practice = petOnwerValue.practiceName;
        let practice = { practiceName: petOnwerValue.practiceName, id: petOnwerValue.practiceId };
        this.hideList(practice);
        this.navigatetoCreate();
      }
    });

    this.activeRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.disablePractice = true;
        this.addPracticeDetails = true;
        this.retrivePet(params.id);
      }
    });
  }


  ngOnInit() {
    this.pet = new Pet();
    this.vets = this.allVets;
    this.practice = '';
    this.presentDate = moment().format('YYYY-MM-DD');

  }
  /**
   * retrieve pet info
   * @param id query param id
   */
  retrivePet(id) {
    this.petService.getPetById(id).subscribe((petDetails: any) => {
      this.pet = petDetails.data;
      this.vetPracticeId = this.pet.practiceId;
      this.PracticeService.getPaProfileData(this.vetPracticeId).subscribe((species: any) => {
        this.speciesList = species.data.practiceSpecies;
        this.speciesArray = this.speciesList.slice(this.from, this.initialImages);
        const subSpcs = _.pluck(this.speciesList, 'species');
        const activeObj = _.findWhere(subSpcs, { id: this.pet.speciesId });
        const activeSpcs = _.findWhere(this.speciesList, { species: activeObj });
        this.activeIndex = _.indexOf(this.speciesList, activeSpcs);
      });
      this.heading = 'Please edit your pet’s details';
      if (!this.pet.profilePic) {
        this.imgUrl = '../../../assets/imgs/default-dog.png';
      } else {
        this.imgUrl = `${environment.baseUri}storage/download/${this.pet.profilePic} `;
      }
      this.practice = this.pet.practice.practiceName;
    });
  }

  /**
   * change nuetured value
   * @param value nuetured
   */
  neutered(value) {
    if (value) {
      this.pet.neutered = true;
    } else {
      this.pet.neutered = false;
    }
  }
  /**
   * create pet intiated
   */
  createPet() {
    if(this.storage){
      this.storage.get('ONBOARD_PO').then((petOnwerValue) => {
        if (petOnwerValue !== null && petOnwerValue.petName !== null) {
          if (this.magicLinkservice.checkforMaglinkId()) {
            this.magicLinkservice.setStatusToUsed().subscribe(res => {
            });
          }
        }
      });
    }
   

    if (!this.pet.neutered) {
      this.pet.neutered = false;
    }
    if(this.pet.gender){
      this.pet.gender = this.pet.gender.trim();
    }
    if(this.commonServcice.getStorage){
      this.pet.userId = this.commonServcice.getStorage.id;
    }
    this.pet.practiceId = this.vetPracticeId;
    this.pet.hide = false;
    this.pet.active = true;
    this.pet.deceased = false;
    this.petService.addPet(this.pet).subscribe((pet: any) => {
      if (Object.keys(this.pet).includes('id')) {
        this.notificationService.notification('Your pet details updated successfully', 'success');
      } else {
        this.notificationService.notification('Your pet details added successfully', ' success');
      }
      this.pet = pet.data;
      if (this.profilePic) {
        this.uploadProfilePic(this.profilePic[0], pet.data.id);
      } else if (this.bolbPic) {
        this.uploadProfilePic(this.bolbPic, pet.data.id);
      } else {
        this.router.navigate(['/pets/list'], { queryParams: { flag: 1 } });
      }
      this.addPracticeDetails = true;
      this.practice = '';
    });
    this.activeIndex = '';
    if(this.petForm){
      this.petForm.form.reset();
    } 
  }

  /**
   * update pet picture
   */
  petPicUpdate(event) {
    this.profilePic = event.target.files;
    if (this.profilePic.length === 0) {
      return;
    }
    const mimeType = this.profilePic[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    this.imagePath = this.profilePic;
    reader.readAsDataURL(this.profilePic[0]);
    reader.onload = () => {
      this.imgUrl = reader.result;
    };
  }
  /**
   * active class set for species selection
   * @param speciesData species data on selection
   * @param index index of the species data
   */
  selectedSpecies(speciesData, index) {
    if(speciesData){
      this.pet.speciesId = speciesData.speciesId;
      this.activeIndex = index;
    }
  }

  onPrevious() {
    this.speciesArray = this.speciesList.slice(this.from - 1, this.initialImages - 1);
    this.from -= 1;
    this.initialImages -= 1;
    this.activeIndex += 1;
  }

  onNext() {
    this.speciesArray = this.speciesList.slice(this.from + 1, this.initialImages + 1);
    this.from += 1;
    this.initialImages += 1;
    this.activeIndex -= 1;
  }
  /**
   *  filter the vets based on search value
   * @param val contains search value to filter
   */
  // search(val) {
  //   this.isNextBtn = false;
  //   if (val === '') {
  //     this.vets = [];
  //     this.searchResults = false;
  //   } else {
  //     this.searchResults = true;
  //     const value = val.toLowerCase();
  //     this.vets = [];
  //     this.allVets.map((data) => {
  //       if (data.practiceName.toLowerCase().indexOf(value) !== -1 || value === '') {
  //         this.vets.push(data);
  //       }
  //     });
  //   }
  // }

  /**
   * @param selectedPractice contains selected data of practicer list
   */
  hideList(selectedPractice) {
    this.searchResults = false;
    this.isNextBtn = true;
    if(selectedPractice){
      this.practice = selectedPractice.practiceName;
      this.vetPracticeId = selectedPractice.id;
      this.PracticeService.getPaProfileData(this.vetPracticeId).subscribe((species: any) => {
        this.speciesList = species.data.practiceSpecies;
        this.speciesArray = this.speciesList.slice(this.from, this.initialImages);
      });
    }
  }
  /**
   * navigate to create pet form
   */
  navigatetoCreate() {
    this.addPracticeDetails = true;
  }

  /**
   * navigate back to step1 of add pet
   */
  backtoStep1() {
    this.addPracticeDetails = false;
  }

  /**
   * validating selecting data
   * @param date selected date
   */
  dateValidation(date) {
    if(date){
      if (moment(date.target.value) <= moment(this.presentDate)) {
        this.isInvalid = false;
      } else {
        this.isInvalid = true;
      }
    } 
  }

  /**
   * upload logic for upload
   * @param picture profile pic
   * @param id pet id
   */
  uploadProfilePic = (picture, id) => {
    const totalBytes = picture.size;
    const size = Math.floor(totalBytes / 1000000) + 'MB';
    if (size >= '4MB') {
      this.notificationService.notification('File size exceeded (max 4MB)!', ' danger');
      const subSpcs = _.pluck(this.speciesList, 'species');
      const activeObj = _.findWhere(subSpcs, { id: this.pet.speciesId });
      const activeSpcs = _.findWhere(this.speciesList, { species: activeObj });
      this.activeIndex = _.indexOf(this.speciesList, activeSpcs);
    } else {
      this.petService.uploadPetPic(picture, id, 'PE').subscribe(res => {
        this.router.navigate(['/pets/list'], { queryParams: { flag: 1 } });
        this.imgUrl = null;
      });
    }
  }


  // Taking A picture from Gallary or Camera options should be as camera op
  /**
   * options -will contains the image quality ,source type(gallary or camera),
   *  destination,media type these things come camera library
   * getPicture - default method for camera package
   * @param sourceType - should represents the path to choosen whather gallery or camera
   */
  takePicture(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      this.imgUrl = 'data:image/jpeg;base64,' + imageData;
      this.dataURLtoFile(this.imgUrl);
    }, (err) => {
      // Handle error
    });
  }

  // select image method will contain the options which provided multiple options you can
  // select eaither from camera or gallary and wait method will wait and call the methods
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image',
      buttons: [{
        text: 'Gallery',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }
  dataURLtoFile(dataurl) {
    fetch(dataurl)
      .then(res => res.blob())
      .then(blob => {
        this.bolbPic = blob;
      });
  }

  /**
   * validate gender input field
   */
  validateGender(ev) {
    setTimeout(() => {
      if (!this.pet.gender) {
        this.isGender = true;
      } else {
        this.isGender = false;
      }
    }, 3000);
  }
  /**
    * Fetch practice details based on name and postal code
   */

  searchChangeObserver;

  onSearchChange(searchValue: string) {

    if (!this.searchChangeObserver) {
      Observable.create(observer => {
        this.searchChangeObserver = observer;
      }).pipe(debounceTime(300)) // wait 300ms after the last event before emitting last event
        .pipe(distinctUntilChanged()) // only emit if value is different from previous value
        .subscribe(val => {
          this.isNextBtn = false;
        if (val === '') {
          this.vetDetails = [];
          this.searchResults = false;
        } else {
          this.petService.searchVets(val).subscribe((vetDetails: any) => {
            this.searchResults = true;
            this.vetDetails = vetDetails;
          })
        }
        });
    }

    this.searchChangeObserver.next(searchValue);
  }
}
