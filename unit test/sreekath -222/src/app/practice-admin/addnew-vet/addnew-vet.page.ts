import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { PracticeAdminService } from '../practice-admin.service';
import { Vet } from './vet-user.model';
import { CommonService } from 'src/app/common/services/common.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/common/services/notification.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'app-addnew-vet',
  templateUrl: './addnew-vet.page.html',
  styleUrls: ['./addnew-vet.page.scss']
})
export class AddnewVetPage implements OnInit {
  @ViewChild('addVetForm', { static: false }) addVetForm: NgForm;
  @ViewChild('inviteVetForm', { static: false }) inviteVetForm: NgForm;
  @Output() success = new EventEmitter<any>();
  model = new Vet();
  inviteEmail: any = '';
  profilePic: FileList;
  imgUrl: any;
  imagePath: any;
  speciesList: any = [];
  selectedSpeciess = [];
  speciesArray = [];
  from = 0;
  initialImages = 7;
  colSize = 1.5;
  colNavSize = 0.7;
  activeIndex: number;
  addOrInvite = 'invite';
  isMobile: boolean;
  isSpeciesSelected: boolean;
  bolbPic: any;
  show: boolean;

  constructor(
    private platform: Platform,
    private camera: Camera,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private PracticeService: PracticeAdminService,
    private commonServcice: CommonService,
    private notify: NotificationService,
    private userService: UserService
  ) {
    this.getSpeciesList();
    if(this.commonServcice.getStorage){
      this.model.prefix = this.commonServcice.getStorage['practice.prefix'];
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

  ngOnInit() { this.species(); }
  species() {
    if (this.platform.is('ipad')) {
      this.initialImages = 4;
      this.colSize = 2.5;
      this.colNavSize = 1;
    }
    if ((this.platform.height() >= 1024 && this.platform.width() >= 1366 && this.platform.is('ipad')) ||
      (this.platform.height() >= 1366 && this.platform.width() >= 1024 && this.platform.is('ipad'))) {
      this.initialImages = 5;
      this.colSize = 2;
      this.colNavSize = 1;
    }
  }
  /**
   * @param data add or invite data
   */
  onAddOrInvite(data) {
    this.from = 0;
    this.species();
    this.speciesArray = this.speciesList.slice(this.from, this.initialImages);
    this.addOrInvite = data;
    this.selectedSpeciess = [];
    return this.speciesList.map((species) => species.isActive = false);
  }

  /**
   * get all available species list
   */
  getSpeciesList() {
    this.PracticeService.getPaProfileData(this.commonServcice.getStorage && this.commonServcice.getStorage.practiceId).subscribe((species: any) => {
      this.speciesList = species.data.practiceSpecies.map((eachSpices) => {
        const obj = Object.assign({}, eachSpices);
        obj.isActive = false;
        return obj;
      });
      this.initialImages = this.speciesList.length < this.initialImages ? this.speciesList.length : this.initialImages;
      this.speciesArray = this.speciesList.slice(this.from, this.initialImages);
    });
  }

  /**
   * active class set for species selection
   * @param speciesData species data on selection
   * @param index index of the species data
   */
  selectedSpecies(speciesData: any, index: any) {
    if(speciesData){
      if (this.selectedSpecies.length === 0) { }
      if (this.selectedSpecies.length !== 0) {
        this.isSpeciesSelected = true;
        const presentID = this.selectedSpeciess.findIndex((species) => {
          return speciesData.id === species.id;
        });
        if (presentID < 0) {
          this.speciesList.map((species) => {
            return species.id === speciesData.id ? species.isActive = true : species;
          });
          this.model.species.push(speciesData.id);
          this.selectedSpeciess.push(speciesData);
        } else {
          this.speciesList.map((species) => {
            return species.id === speciesData.id ? species.isActive = false : species;
          });
          this.selectedSpeciess.splice(presentID, 1);
          this.model.species.splice(speciesData.id);
        }
      } else {
        this.selectedSpeciess.push(speciesData);
        this.model.species.push(speciesData.id);
      }
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
    this.selectImage();
    this.camera.getPicture(options).then((imageData) => {
      this.imgUrl = 'data:image/jpeg;base64,' + imageData;
      this.dataURLtoFile(this.imgUrl);
    }, (err) => {
      // Handle error
    });
  }

  dataURLtoFile(dataurl) {
    fetch(dataurl)
      .then(res => res.blob())
      .then(blob => {
        this.bolbPic = blob;
        // this.uploadProfilePic(blob, this.data.id);
      });
  }
  // select image method will contain the options which provided multiple options you can
  // select eaither from camera or gallary and wait method will wait and call the methods
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image',
      buttons: [{
        text: 'Gallary',
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
  petPicUpdate(event) {
    this.profilePic = event.target.files;
    if (this.profilePic && this.profilePic.length === 0) {
      return;
    } else if(this.profilePic){
      const mimeType = this.profilePic[0].type;
      if (mimeType.match(/image\/*/) == null) { }
      const reader = new FileReader();
      this.imagePath = this.profilePic;
      reader.readAsDataURL(this.profilePic[0]);
      reader.onload = () => {
        this.imgUrl = reader.result;
      };
    }
  }

  /**
   * add new wet
   */
  createVet() {
    if(this.model.email){
      this.model.email = this.model.email.trim().toLowerCase();
    }
    const spcArr: any = [];
    this.selectedSpeciess.forEach(spc => {
      spcArr.push({ id: spc.speciesId });
    });
    this.model.species = spcArr;
    this.model.practiceId = this.commonServcice.getStorage.practiceId;
    const modelCopy = { ...this.model };
    this.PracticeService.addNewVet(modelCopy).subscribe((res: any) => {
      this.notify.notification(res.message, 'success');
      if (this.profilePic) {
        this.uploadProfilePic(this.profilePic[0], res.data.id);
      } else if (this.bolbPic) {
        this.uploadProfilePic(this.bolbPic, res.data.id);
      }
      this.getSpeciesList();
      this.selectedSpeciess = [];
      this.imgUrl = null;
      this.addVetForm.form.reset();
    });
  }

  /**
   * upload logic for upload
   * @param picture profile pic
   * @param id pet id
   */
  uploadProfilePic = (picture, id) => {
    this.PracticeService.uploadProfilePic(picture, id, 'PR').subscribe(res => {
      this.success.emit('sucess');
    });
  }

  /**
   * invite vet
   */
  inviteVet() {
    const data = {
      mlFor: 'INVITE_VET',
      userId: this.commonServcice.getStorage.id,
      practiceId: this.commonServcice.getStorage.practiceId,
      email: this.inviteEmail.trim().toLowerCase()
    };
    this.PracticeService.inviteCustomer(data).subscribe((res: any) => {
      this.notify.notification('Invitation sent successfully', 'success');
      this.inviteVetForm.reset();
      // this.inviteEmail = '';
    });
  }

  /**
   * To manage password input display and mask
   */
  showPassword() {
    this.show = !this.show;
  }

  // search by user name (unique) - availability
  onSearchUsername() {
    if(this.commonServcice.getStorage){
      this.userService.usernameAvailability(`${this.commonServcice.getStorage['practice.prefix']}${this.model.userName}`).subscribe(res => {

      });
    }
  
  }

}
