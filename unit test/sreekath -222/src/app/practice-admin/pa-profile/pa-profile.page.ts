import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
import { Practice } from '../practice';
import { environment } from 'src/environments/environment';
import { PracticeAdminService } from '../practice-admin.service';
import { NotificationService } from 'src/app/common/services/notification.service';
import { CommonService } from 'src/app/common/services/common.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-pa-profile',
  templateUrl: './pa-profile.page.html',
  styleUrls: ['./pa-profile.page.scss'],
  providers: [Camera]
})
export class PaProfilePage implements OnInit {

  model = new Practice();
  readFormValue = true;
  imgUrl: any;
  imagePath: any;
  genderList: any = [];
  speciesList: any = [];
  speciesArray: Array<any> = [];
  originalSpeciesList: Array<any> = [];
  species: Array<any> = [];
  baseList: Array<any> = [];
  iconName: any;
  initialImages = 4;
  from = 0;
  activeIndex: any;
  selectedSpeciess: Array<any> = [];
  currentItemIndex: number;
  // for choosing one image
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  isMobile: boolean;
  isEdit: boolean;

  constructor(
    private router: Router,
    private notify: NotificationService,
    private commonService: CommonService,
    public camera: Camera,
    public actionSheetController: ActionSheetController,
    private practiceService: PracticeAdminService,
    private platform: Platform
  ) {
    this.getSpecies();
    this.checkDevices();
    if(this.commonService.getStorage){
      this.model.logo = this.commonService.getStorage.profilePic;
      if (this.model.logo) {
        this.imgUrl = `${environment.baseUri}storage/download/${this.model.logo} `;
      }
    }
   
  }

  ngOnInit() {
    this.readFormValue = true;
  }
  goback() {
    window.history.back();
    this.router.navigateByUrl('this.router.url');
  }

  checkDevices() {
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
   * get all species list
   */
  getSpecies() {
    this.practiceService.getSpecies().subscribe((species: any) => {
      this.speciesList = species.data;
      this.getUserDetails();
    });
  }

  editProfileEnable() {
    this.readFormValue = false;
    this.isEdit = true;
  }

  /**
   * merging mapped practice species with all list
   */
  getUserDetails() {
    this.practiceService.getPaProfileData(this.commonService.getStorage && this.commonService.getStorage.practiceId).subscribe((res: any) => {
      this.model = res.data;
      this.originalSpeciesList = res.data.practiceSpecies;
      this.originalSpeciesList.map(list => {
        list.species.isActive = true;
        list.species.isEditable = true;
      });
      this.speciesList.forEach(el => {
        this.originalSpeciesList.forEach(ell => {
          if (ell.species.id === el.id) {
            el = ell.species;
            this.baseList.push(ell.species);
            this.selectedSpeciess.push(ell.species);
          }
        });
        this.species.push(el);
      });
      this.species = _.sortBy(this.species, e => !e.isActive);
      this.speciesArray = this.species.slice(this.from, this.initialImages);
    });
  }

  /**
   * Initiating update species process
   */
  updateProfile() {
    this.isEdit = false;
    const current = [];
    let removedSpecies = [];
    this.model.brandingInfo = [];
    // getting removed species from original list
    removedSpecies = this.baseList.filter((obj) => {
      return this.selectedSpeciess.indexOf(obj) === -1;
    });
    // merging selected and removed species with flag indication
    if (this.selectedSpeciess) {
      this.selectedSpeciess.forEach(select => {
        removedSpecies.forEach(removed => {
          removed.flag = 'removed';
          current.push(removed);
        });
        current.push(select);
      });
    }

    // getting final uniq species list
    this.model.species = _.uniq(current, (book) => {
      return book.id;
    });
    this.practiceService.updateUser(this.model).subscribe((user: any) => {
      this.readFormValue = true;
      // if (this.imagePath) {
      //   this.uploadProfilePic(this.imagePath[0], this.commonService.getStorage.id);
      // }
      user.data.firstName = user.data.practiceName;
      const profDetails = this.commonService.getStorage;
      profDetails.firstName = user.data.firstName;
      localStorage.setItem('result', JSON.stringify(profDetails));
      this.commonService.picSubject.next({ user: user.data });
      this.updateSpecies(this.model.species);
      this.notify.notification('Profile details updated successfully', 'success');
    });
  }

  /**
   * updating species list for editable
   * @param val selected species
   */
  updateSpecies(val) {
    if(val){
      val.forEach(S => {
        this.speciesArray.map((SA) => {
           if (S.speciesName === SA.speciesName) {
             SA.isEditable = true;
           }
        });
      });
    }
  }

  /**
   * active class set for species selection
   * @param speciesData species data on selection
   */
  selectedSpecies(speciesData: any, index: any) {
    if(speciesData){
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
            return species.id === speciesData.id ? species.isActive = false : species;
          });
          this.selectedSpeciess.splice(presentID, 1);
        }
      } else {
        this.selectedSpeciess.push(speciesData);
      }
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

  /**
   * update profile picture
   */
  profilePicUpdate(event) {
    const files = event.target.files;
    if (files && files.length === 0) {
      return;
    } else if(files){
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
          this.imgUrl = reader.result;
        };
        this.uploadProfilePic(files[0], this.commonService.getStorage.id);
      }
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

  dataURLtoFile(dataurl) {
    fetch(dataurl)
      .then(res => res.blob())
      .then(blob => {
        this.uploadProfilePic(blob, this.commonService.getStorage.id);
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
   * upload call to update profile pic
   * @param picture file data
   * @param id practice admin id
   */
  uploadProfilePic(picture, id) {
    this.practiceService.uploadProfilePic(picture, id, 'PA').subscribe((pic: any) => {
      this.commonService.picSubject.next({ data: pic.data });
      this.updateStorage(pic.data);
    });
  }

  /**
   * Updating profile pic info at local storage
   * @param pic profile pic name

   */
  updateStorage(pic) {
    const store = this.commonService.getStorage;
    if(store){
      store.profilePic = pic;
      localStorage.setItem('result', JSON.stringify(store));
    }
  }
}
