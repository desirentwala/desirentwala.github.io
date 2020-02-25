import { Component } from '@angular/core';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { environment } from 'src/environments/environment';
import { ActionSheetController, Platform } from '@ionic/angular';
import { NotificationService } from 'src/app/common/services/notification.service';
import { VetPracticeService } from '../vet-practice.service';
import { UserService } from '../../common/services/user.service';
import { CommonService } from 'src/app/common/services/common.service';
import * as _ from 'underscore';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-vet-profile',
  templateUrl: './vet-profile.page.html',
  styleUrls: ['./vet-profile.page.scss'],
  providers: [Camera]
})
export class VetProfilePage {
  readFormValue: boolean;
  public imagePath;
  public vetData:any = '';
  public imgUrl = '../../../assets/profile-picture.png';
  currentImage: any;
  speciesList: any = [];
  speciesArray: Array<any> = [];
  originalSpeciesList: Array<any> = [];
  species: Array<any> = [];
  baseList: Array<any> = [];
  initialImages = 3;
  from = 0;
  activeIndex: any;
  selectedSpeciess: Array<any> = [];
  // for choosing one image
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  isMobile: boolean;
  isEdit: boolean;
  show: boolean;
  mCopy: any;

  constructor(
    private platform: Platform,
    private vetPracticeService: VetPracticeService,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private notify: NotificationService,
    private userService: UserService,
    private commonService: CommonService,
    private practiceService: PracticeAdminService,
    private authService: AuthService,
  ) {
    this.getAdminSpecies();
    // tslint:disable-next-line: deprecation
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
  /**
   * get practice admin species
   */

  getAdminSpecies() {
    this.practiceService.getPaProfileData(this.commonService.getStorage && this.commonService.getStorage.practiceId).subscribe((PaDetails: any) => {
      this.speciesList = PaDetails.data.practiceSpecies;
      this.getUserDetails();
      this.initialImages = this.speciesList.length < this.initialImages ? this.speciesList.length : 3;
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
  // edit enable for change the form data
  editProfileEnable() {
    this.readFormValue = true;
    this.isEdit = true;
  }

  // user Details from service
  getUserDetails() {
    this.vetPracticeService.getVetDetails(this.commonService.getStorage && this.commonService.getStorage.id).subscribe(res => {
      this.vetData = res.data[0];
      if (this.vetData && this.vetData.profilePic) {
      //   this.currentImage = './assets/user-avatar.svg';
      // } else {
        this.currentImage = `${environment.baseUri}storage/download/${this.vetData.profilePic} `;
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
   * update user
   */
  updateProfile() {
    this.isEdit = false;
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
      password: this.vetData.password
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
    const vetDetails = { ...vetDetailsObj, species: finaleSpecies };
    this.updateVetService(vetDetails);
  }

  updateVetService(vetDetails) {
    vetDetails.type = 'VET';
    this.userService.updateUser(vetDetails).subscribe((user: any) => {
      this.readFormValue = false;
      const profDetails = this.commonService.getStorage;
      profDetails.firstName = user.data.firstName;
      localStorage.setItem('result', JSON.stringify(profDetails));
      this.commonService.picSubject.next({ user: user.data });
      this.notify.notification('Profile details updated successfully', 'success');
      if (this.vetData.password !== this.mCopy.password) {
        this.authService.signOut();
      }
    });
  }

  /**
   * updating species list for editable
   * @param val selected species
   */
  updateSpecies(val) {
    val.forEach(S => {
       this.speciesArray.map((SA) => {
          if (S.speciesName === SA.speciesName) {
            SA.isEditable = true;
          }
       });
     });
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

  onPrevious() {
    this.speciesArray = this.species.slice(this.from - 1, this.initialImages - 1);
    this.from -= 1;
    this.initialImages -= 1;
    this.activeIndex += 1;
  }

  onNext() {
    this.speciesArray = this.species.slice(this.from + 1, this.initialImages + 1);
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
    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
      this.dataURLtoFile(this.currentImage);
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
    const files = event.target.files;
    if (files && files.length === 0) {
      return;
    }else if(files){
      const totalBytes = files[0].size;
      const size = Math.floor(totalBytes / 1000000) + 'MB';
      if (size >= '4MB') {
        this.notify.notification('Profile picture should not exceed 4MB ', 'danger');
      } else {
        const mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) { }
        const reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
          this.currentImage = reader.result;
        };
  
        this.uploadProfilePic(files[0], this.vetData.id);
        // this.vetPracticeService.uploadProfilePic(files[0], this.vetData.id, 'PR').subscribe((pic: any) => {
        //   this.commonService.picSubject.next({ data: pic.data });
        // });
      }
    }
  }

  /**
   * upload call
   * @param picture file data
   * @param id vet id
   */
  uploadProfilePic(picture, id) {
      this.userService.uploadProfilePic(picture, id, 'PR').subscribe((pic: any) => {
        this.commonService.picSubject.next({ data: pic.data });
        this.updateStorage(pic.data);
      });
  }

  /**
   * Updating profile pic info to local storage
   * @param pic profile pic name
   */
  updateStorage(pic) {
      const store = this.commonService.getStorage;
      if(store){
        store.profilePic = pic;
        localStorage.setItem('result', JSON.stringify(store));
      }
  }
  dataURLtoFile(dataurl) {
    fetch(dataurl)
      .then(res => res.blob())
      .then(blob => {
        this.uploadProfilePic(blob, this.vetData.id);
      });
  }

  /**
   * To manage password input display and mask
   */
  showPassword() {
    this.show = !this.show;
  }
}
