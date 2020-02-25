import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/common/services/common.service';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { VetPracticeService } from 'src/app/vet-practice/vet-practice.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/common/services/auth.service';
import * as _ from 'underscore';
import { UserService } from 'src/app/common/services/user.service';
import { Platform, ActionSheetController, AlertController } from '@ionic/angular';
import { NotificationService } from 'src/app/common/services/notification.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { VhdAdminService } from 'src/app/vhd-admin/vhd-admin.service';
import { DeleteConfirmationService } from '../../services/deleteConfirmation.service';

@Component({
  selector: 'app-edit-vet',
  templateUrl: './edit-vet.page.html',
  styleUrls: ['./edit-vet.page.scss'],
})
export class EditVetPage implements OnInit, OnChanges {
  vet: any;
  isMobile: boolean;
  blobPic: Blob;
  profilePic: any;
  @Input() flag;
  isUsernameValid = false;
  VHDA: boolean;
  @Input()
  public set vetInfo(v) {
    if (v) {
      this.vet = v;
      this.value = 'show';
    } else {
      this.value = '!show';
    }
  }
  @Output() vetDataEmit = new EventEmitter<any>();

  public vetData;
  public imagePath;
  imgUrl: any;
  speciesList: any = [];
  speciesArray: Array<any> = [];
  originalSpeciesList: Array<any> = [];
  species: Array<any> = [];
  baseList: Array<any> = [];
  initialImages = 3;
  from = 0;
  activeIndex: any;
  selectedSpeciess: Array<any> = [];
  mCopy: any;
  value = 'show';
  show: boolean;
  newPassword: any;
  constructor(
    private vetPracticeService: VetPracticeService,
    private commonService: CommonService,
    private practiceService: PracticeAdminService,
    private authService: AuthService,
    private userService: UserService,
    private platform: Platform,
    private vhdAdminService: VhdAdminService,
    private camera: Camera,
    private alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private notify: NotificationService,
    private deleteService: DeleteConfirmationService
  ) {
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

  ngOnInit() {
    if (this.commonService.getStorage && this.commonService.getStorage['userroles.role.roleName'] === 'VHDA') {
      this.VHDA = true;
    } else {
      this.VHDA = false;
    }
   }
  ngOnChanges() {
    this.getAdminSpecies();
  }
  getAdminSpecies() {
    this.practiceService.getPaProfileData(this.vet && this.vet.practiceId).subscribe((PaDetails: any) => {
      this.speciesList = PaDetails.data.practiceSpecies;
      this.initialImages = this.speciesList.length < this.initialImages ? this.speciesList.length : 3;
      if (this.flag === 'edit') {
        this.getUserDetails();
        this.isUsernameValid = false;
      } else {
        this.speciesList.map((S) => {
          this.species.push(S.species);
        });
        this.vetData = {};
        this.speciesArray = this.species.slice(this.from, this.initialImages);
      }
    });
  }

  // user Details from service
  getUserDetails() {
    this.vetPracticeService.getVetDetails(this.vet && this.vet.id).subscribe(res => {
      this.vetData = res.data[0];
      this.mCopy = { ...res.data[0] };
      this.vetData.password = this.authService.passwordDecrypt(res.data[0].password);
      this.mCopy.password = this.vetData.password;
      this.newPassword = '';
      if (this.vetData.profilePic) {
        this.imgUrl = `${environment.baseUri}storage/download/${this.vetData.profilePic} `;
      }
      this.originalSpeciesList = res.data[0].vetSpecies;
      this.originalSpeciesList.map(list => {
        list.species.isActive = true;
        list.species.isEditable = true;
      });
      this.speciesList.forEach(adminSpecies => {
        this.originalSpeciesList.forEach(vetSpecies => {
          if (vetSpecies.species.id === adminSpecies.species.id) {
            adminSpecies = vetSpecies;
            this.baseList.push(vetSpecies.species);
            this.selectedSpeciess.push(vetSpecies.species);
          }
        });
        this.species.push(adminSpecies.species);
      });
      this.species = _.sortBy(this.species, e => !e.isActive);
      this.speciesArray = this.species.slice(this.from, this.initialImages);
    });
    // }
  }

  /**
   * update vet
   */
  updateProfile(): void {
    this.show = false;
    const current = [];
    let removedSpecies = [];
    const vetDetailsObj = {
      id: this.vetData.id,
      firstName: this.vetData.firstName,
      lastName: this.vetData.lastName,
      email: this.vetData.email,
      mobile: this.vetData.mobile,
      profilePic: this.vetData.profilePic,
      isActive: this.vetData.isActive,
      practiceId: this.vetData.practiceId,
      userName: this.vetData.userName,
      password: this.newPassword ? this.newPassword : this.vetData.password
    };
    // getting removed species from original list
    removedSpecies = this.baseList.filter((obj) => {
      return this.selectedSpeciess.indexOf(obj) === -1;
    });
    // merging selected and removed species with flag indication
    this.selectedSpeciess.forEach(select => {
      removedSpecies.forEach(removed => {
        removed.flag = 'removed';
        current.push(removed);
      });
      current.push(select);
    });
    // getting final uniq species list
    const finaleSpecies = _.uniq(current, (book) => {
      return book.id;
    });

    const vetDetails = { ...vetDetailsObj, species: finaleSpecies, type: 'VET' };
    if (this.flag === 'edit') {
      this.userService.updateUser(vetDetails).subscribe((user: any) => {
        if (this.profilePic) {
          this.uploadProfilePic(this.profilePic[0], this.vetData.id);
        } else if (this.blobPic) {
          this.uploadProfilePic(this.blobPic, this.vetData.id);
        } else {
          this.commonService.vetUpdateSubject.next(user);
        }
        this.close();
      });
    } else if (this.flag === 'add') {
      vetDetails['prefix'] = this.vet.prefix;
      vetDetails.practiceId = this.vet.practiceId;
      this.practiceService.addNewVet(vetDetails).subscribe((user: any) => {
        // this.notify.notification(user.message, 'success');
        if (this.profilePic) {
          this.uploadProfilePic(this.profilePic[0], user.data.id);
        } else if (this.blobPic) {
          this.uploadProfilePic(this.blobPic, user.data.id);
        } else {
          this.commonService.vetUpdateSubject.next(user);
        }
        this.close();
      });
    }
  }

  // search by user name (unique) - availability
  onSearchUsername() {
    this.isUsernameValid = true;
    if(this.vet){
      this.userService.usernameAvailability(`${this.vet.prefix}${this.vetData.userName.toLowerCase()}`).subscribe(res => {
        this.isUsernameValid = false;
      });
    }
  }

  /**
   * active class set for species selection
   * @param speciesData species data on selection
   */
  selectedSpecies(speciesData: any, index: any) {
    if (this.selectedSpecies.length === 0) { }
    if (this.selectedSpecies.length !== 0) {
      const presentID = this.selectedSpeciess.findIndex((species) => {
        return speciesData.id === species.id;
      });
      if (presentID < 0) {
        this.speciesArray.map((species) => {
          return species.id === speciesData.id ? species.isActive = true : species;
        });
        speciesData.flag = 'new';
        this.selectedSpeciess.push(speciesData);
      } else {
        this.speciesArray.map((species) => {
          return (species.id === speciesData.id) ? species.isActive = false : species;
        });
        this.selectedSpeciess.splice(presentID, 1);
      }
    } else {
      this.selectedSpeciess.push(speciesData);
    }
  }

  /**
   * rearrange of species for slider
   */
  onPrevious() {
    this.speciesArray = this.species.slice(this.from - 1, this.initialImages - 1);
    this.from -= 1;
    this.initialImages -= 1;
    this.activeIndex += 1;
  }

  /**
   * rearrange of species for slider
   */
  onNext() {
    this.speciesArray = this.species.slice(this.from + 1, this.initialImages + 1);
    this.from += 1;
    this.initialImages += 1;
    this.activeIndex -= 1;
  }

  /**
   * To manage password input display and mask
   */
  showPassword() {
    this.show = !this.show;
  }

  /**
   * closing the slider for cancel action
   */
  close() {
    this.value = '!show';
    this.vetDataEmit.emit('sucess');
  }

  /**
   * soft delete vet
   */
  async delete(data) {
    this.deleteService.deleteVet(data);
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
    if (this.profilePic && this.profilePic.length === 0) {
      return;
    }else if (this.profilePic){
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
    }
    

      // this.uploadProfilePic(files[0], this.vetData.id);
    }
  }

  /**
   * upload call
   * @param picture file data
   * @param id vet id
   */
  uploadProfilePic(picture, id) {
    this.userService.uploadProfilePic(picture, id, 'PR').subscribe((pic: any) => {
      this.commonService.vetUpdateSubject.next('');
    });
  }

  dataURLtoFile(dataurl) {
    fetch(dataurl)
      .then(res => res.blob())
      .then(blob => {
        this.blobPic = blob;
        // this.uploadProfilePic(blob, this.vetData.id);
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
