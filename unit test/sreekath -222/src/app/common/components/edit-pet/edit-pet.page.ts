import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { Platform, ActionSheetController, AlertController } from '@ionic/angular';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { PetService } from 'src/app/pets/pets.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/common/services/common.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NotificationService } from 'src/app/common/services/notification.service';
import { UserService } from 'src/app/common/services/user.service';
import * as moment from 'moment';
import * as _ from 'underscore';
import { DeleteConfirmationService } from '../../services/deleteConfirmation.service';

@Component({
  selector: 'app-edit-pet',
  templateUrl: './edit-pet.page.html',
  styleUrls: ['./edit-pet.page.scss'],
})
export class EditPetPage implements OnInit, OnChanges {
  genderList: any = [];
  speciesList: any = [];
  speciesArray: any[];
  initialImages = 3;
  from = 0;
  activeIndex: any;
  isMobile: boolean;
  petData: any;
  pet: any;
  value: any;
  imgUrl: any;
  profilePic: FileList;
  public imagePath;
  presentDate: string;
  isInvalid: boolean;
  blobPic: any;
  @Input() flag;
  VHDA: boolean;
  @Input()
  public set petInfo(v) {
    if (v) {
      this.pet = v;
      this.value = 'show';
    } else {
      this.value = '!show';
    }
  }
  @Output() petDataEmit = new EventEmitter<any>();

  constructor(
    public platform: Platform,
    private practiceService: PracticeAdminService,
    private petService: PetService,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private notify: NotificationService,
    private commonService: CommonService,
    private userService: UserService,
    private deleteService: DeleteConfirmationService
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
    this.genderList = ['Male', 'Female'];
  }

  ngOnInit() {
    this.presentDate = moment().format('YYYY-MM-DD');
    if (this.commonService.getStorage && this.commonService.getStorage['userroles.role.roleName'] === 'VHDA') {
      this.VHDA = true;
    } else {
      this.VHDA = false;
    }
  }
  ngOnChanges() {
    this.getAdminSpecies();
  }

  /**
   * retrive practicer species
   */
  getAdminSpecies() {
    this.practiceService.getPaProfileData(this.pet && this.pet.practiceId).subscribe((PaDetails: any) => {
      this.speciesList = PaDetails.data.practiceSpecies;
      if (this.flag === 'edit') {
        this.getPetDetails();
      } else {
        this.petData = {};
        this.speciesArray = this.speciesList.slice(this.from, this.initialImages);
      }
    });
  }

  /**
   * retrive pet details
   */
  getPetDetails() {
    this.petService.getPetById(this.pet && this.pet.id).subscribe((petDetails: any) => {
      this.petData = petDetails.data;
      const activeObj = _.findWhere(this.speciesList, { speciesId: this.petData.speciesId });
      this.activeIndex = _.indexOf(this.speciesList, activeObj);
      this.speciesList = this.swap(this.speciesList, 0, this.activeIndex);
      this.initialImages = this.speciesList.length < this.initialImages ? this.speciesList.length : 3;
      this.speciesArray = this.speciesList.slice(this.from, this.initialImages);
      if (this.petData.profilePic) {
        this.imgUrl = `${environment.baseUri}storage/download/${this.petData.profilePic} `;
      }
    });
  }

  /**
   * Function to swap selected pet to begining
   */
  swap = (arr, index1, index2) => arr.map((val, idx) => {
    if (idx === index1) { return arr[index2]; }
    if (idx === index2) { return arr[index1]; }
    return val;
  })
  /**
   * active class set for species selection
   * @param speciesData species data on selection
   * @param index index of the species data
   */
  selectedSpecies(speciesData, index) {
    if(speciesData){
      this.petData.speciesId = speciesData.speciesId;
      this.activeIndex = index;
    }
  }

  /**
   * rearrange of species for slider
   */
  onPrevious() {
    this.speciesArray = this.speciesList.slice(this.from - 1, this.initialImages - 1);
    this.from -= 1;
    this.initialImages -= 1;
    this.activeIndex += 1;
  }

  /**
   * rearrange of species for slider
   */
  onNext() {
    this.speciesArray = this.speciesList.slice(this.from + 1, this.initialImages + 1);
    this.from += 1;
    this.initialImages += 1;
    this.activeIndex -= 1;
  }

  /**
   * change nuetured value
   * @param value nuetured
   */
  neutered(value) {
    if (value) {
      this.petData.neutered = true;
    } else {
      this.petData.neutered = false;
    }
  }

  /**
   * validating selecting data
   * @param date selected date
   */
  dateValidation(date) {
    if (moment(date.target.value) <= moment(this.presentDate)) {
      this.isInvalid = false;
    } else {
      this.isInvalid = true;
    }
  }

  /**
   * update pet
   */
  updateProfile() {
    /**
     * attaching userId from petOwnerId
     */
    if (this.flag === 'add') {
      if (!this.petData.neutered) {
        this.petData.neutered = false;
      }
      this.petData.userId = this.pet.id;
      this.petData.practiceId = this.pet.practiceId;
      this.petData.gender = this.petData.gender.trim();
      this.petData.hide = false;
      this.petData.active = true;
      this.petData.deceased = false;
    }
    this.petService.addPet(this.petData).subscribe((pet: any) => {
      const msg = this.flag === 'add' ? 'added' : 'updated';
      this.notify.notification(`pet ${msg} sucessfully`, 'success');
      if (this.profilePic) {
        this.uploadProfilePic(this.profilePic[0], pet.data.id);
      } else if (this.blobPic) {
        this.uploadProfilePic(this.blobPic, pet.data.id);
      } else {
        this.commonService.vetUpdateSubject.next(pet);
      }
      this.close();
    });
  }

  /**
   * soft delete pet
   */
  delete() {
    if(this.pet){
      this.deleteService.deletePet(this.pet.id, this.petData.petName);
    }
  }
  close() {
    this.value = '!show';
    this.petDataEmit.emit('sucess');
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

  /**
   * method load image
   * @param event contains file
   */
  uploadPicture(event) {
    this.profilePic = event.target.files;
    if (this.profilePic.length === 0) {
      return;
    }
    const totalBytes = this.profilePic[0].size;
    const size = Math.floor(totalBytes / 1000000) + 'MB';
    if (size >= '4MB') {
      this.notify.notification('Profile picture should not exceed 4MB ', 'danger');
    } else {
      const mimeType = this.profilePic[0].type;
      if (mimeType.match(/image\/*/) == null) { }
      const reader = new FileReader();
      this.imagePath = this.profilePic;
      reader.readAsDataURL(this.profilePic[0]);
      reader.onload = () => {
        this.imgUrl = reader.result;
      };

      // this.uploadProfilePic(files[0], this.petData.id);
    }
  }

  /**
   * upload call
   * @param picture file data
   * @param id vet id
   */
  uploadProfilePic(picture, id) {
    this.userService.uploadProfilePic(picture, id, 'PE').subscribe((pic: any) => {
      this.commonService.vetUpdateSubject.next('');
    });
  }

  dataURLtoFile(dataurl) {
    fetch(dataurl)
      .then(res => res.blob())
      .then(blob => {
        this.blobPic = blob;
        // this.uploadProfilePic(blob, this.petData.id);
      });
  }

  // upload image for profile pic
  imageFilePathChange(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imagePath = reader.result;
      reader.readAsDataURL(file);
    }
  }
}
