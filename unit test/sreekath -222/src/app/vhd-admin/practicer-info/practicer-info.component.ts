import { Component, OnInit, Input } from '@angular/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import * as _ from 'underscore';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { Practice } from 'src/app/practice-admin/practice';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/common/services/notification.service';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-practicer-info',
  templateUrl: './practicer-info.component.html',
  styleUrls: ['./practicer-info.component.scss'],
})
export class PracticerInfoComponent implements OnInit {
  colSize = 1.5;
  colNavSize = .7;
  practiceData: any;
  blobPic: any;
  profilePic: any = '';
  userId: any;
  @Input()
  public set data(v) {
    if (v) {
      this.practiceData = v;
      this.getSpecies();
    }
  }
  model = new Practice();
  imgUrl: any;
  imagePath: any;
  genderList: any = [];
  speciesList: any = [];
  speciesArray: Array<any> = [];
  originalSpeciesList: Array<any> = [];
  species: Array<any> = [];
  baseList: Array<any> = [];
  iconName: any;
  initialImages = 7;
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

  constructor(
    private router: Router,
    private notify: NotificationService,
    private camera: Camera,
    private commonService: CommonService,
    public actionSheetController: ActionSheetController,
    public practiceService: PracticeAdminService,
    private platform: Platform
  ) {
    this.checkDevices();

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

  ngOnInit() {
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
    this.speciesArray = [];
    this.selectedSpeciess = [];
    this.species = [];
    this.baseList = [];
    this.practiceService.getSpecies().subscribe((species: any) => {
      this.speciesList = species.data;
      this.getUserDetails();
    });
  }

  /**
   * merging mapped practice species with all list
   */
  getUserDetails() {
    this.practiceService.getPaProfileData(this.practiceData && this.practiceData.id).subscribe((res: any) => {
      this.model = res.data;
      this.userId = res.userId;
      if (this.model.logo) {
        this.imgUrl = `${environment.baseUri}storage/download/${this.model.logo} `;
      } else {
        this.imgUrl = '';
      }
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
    if(this.model){
      this.practiceService.updateUser(this.model).subscribe((res: any) => {
        if (this.profilePic) {
          this.uploadProfilePic(this.profilePic[0], this.userId);
        } else if (this.blobPic) {
          this.uploadProfilePic(this.blobPic, this.userId);
        } else {
          this.commonService.vhdPAUpdateSubject.next('reload');
        }
        this.updateSpecies(this.model.species);
        this.notify.notification('Profile details updated successfully', 'success');
      });
    }
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
            SA.isActive = true;
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
          return species.id === speciesData.id ? species.isActive = false : species;
        });
        this.selectedSpeciess.splice(presentID, 1);
      }
    } else {
      this.selectedSpeciess.push(speciesData);
    }
  }

  /**
   * rearrange of species slider
   */
  onPrevious() {
    this.speciesArray = this.species.slice(this.from - 1, this.initialImages - 1);
    this.from -= 1;
    this.initialImages -= 1;
    this.activeIndex += 1;
  }

  /**
   * rearrange of species slider
   */
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
    this.profilePic = event.target.files;
    if (this.profilePic && this.profilePic.length === 0) {
      return;
    } else if (this.profilePic){
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
        // this.uploadProfilePic(files[0], this.practiceData.id);
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
        this.blobPic = blob;
        // this.uploadProfilePic(blob, this.practiceData.id);
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
      this.commonService.vhdPAUpdateSubject.next('reload');
      // this.notify.notification('Profile pic updated successfully', 'success');
    });
  }
}
