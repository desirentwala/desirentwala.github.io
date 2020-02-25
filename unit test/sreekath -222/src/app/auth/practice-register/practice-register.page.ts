import { Component, OnInit, ViewChild } from '@angular/core';
import { PracticeAdminService } from 'src/app/practice-admin/practice-admin.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Practice } from '../../practice-admin/practice';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/common/services/user.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { TokenValidaterService } from 'src/app/common/services/token-validater.service';


import { Storage } from '@ionic/storage';
import { NotificationService } from 'src/app/common/services/notification.service';
import { MagicLinkService } from 'src/app/common/services/magic-link/magic-link.service';
import { NgForm } from '@angular/forms';
import { isThisSecond } from 'date-fns';

@Component({
  selector: 'app-practice-register',
  templateUrl: './practice-register.page.html',
  styleUrls: ['./practice-register.page.scss'],
  providers:[Camera]
})
export class PracticeRegisterPage implements OnInit {
  @ViewChild('practiceRegistrationForm', {static: false}) practiceRegistrationForm: NgForm;
  @ViewChild(NgForm, {static: false}) ngForm: NgForm;

  model = new Practice();
  speciesList: any = [];
  speciesArray: any[];
  imgUrl: any;
  imagePath: any;
  iconName: any;
  initialImages = 3;
  from = 0;
  activeIndex: any;
  selectedSpeciess = [];
  currentItemIndex: number;
  passwordShow: boolean;
  confirmPasswordShow: boolean;
  missmatch: boolean;
  isDisabled: boolean;
  isMobile: boolean;
  bolbPic: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private tokenValidatorService: TokenValidaterService,
    private platform: Platform,
    public camera: Camera,
    public actionSheetController: ActionSheetController,
    private practiceService: PracticeAdminService,
    private notificationService: NotificationService,
    private storage: Storage,
    private magicLinkservice: MagicLinkService
  ) {
    this.deviceFinder();
   }


  ionViewWillEnter() {

    this.storage.get('ONBOARD_PA').then((val) => {
      if (val !== null) {
        this.model.email = val.email;
        this.model.practiceName = val.practiceName;
        this.isDisabled = true;
      }

    });
  }
  ngOnInit() {
    this.retrieveSpecies();
    // Or to get a key/value pair
  }

  /**
   * Find your device
   */
  deviceFinder() {
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
   * Retrieving species list
   */
  retrieveSpecies() {
    this.practiceService.getSpecies().subscribe((species: any) => {
      this.speciesList = species.data;
      this.speciesList = species.data.map((eachSpices) => {
        const obj = Object.assign({}, eachSpices);
        obj.isActive = false;
        return obj;
      });
      this.speciesArray = this.speciesList.slice(this.from, this.initialImages);
    });
  }

  /**
   * update profile picture
   */
  profilePicUpdate(event) {
    const files = event;
    if (!files) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) { }
    const reader = new FileReader();
    this.imagePath = files;

    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.imgUrl = reader.result;
    };
  }

  /**
   * active class set for species selection
   * @param speciesData species data on selection
   */
  selectedSpecies(speciesData: any, index: any) {
    if (this.selectedSpeciess.length !== 0) {
      const presentID = this.selectedSpeciess.findIndex((species) => {
        return speciesData.id === species.id;
      });
      if (presentID < 0) {
        this.speciesList.map((species) => {
          return species.id === speciesData.id ? species.isActive = true : species;
        });
        this.selectedSpeciess.push(speciesData);
      } else {
        this.speciesList.map((species) => {
          return species.id === speciesData.id ? species.isActive = false : species;
        });
        this.selectedSpeciess.splice(presentID, 1);
      }
    } else {
      this.speciesList.map((species) => {
        return species.id === speciesData.id ? species.isActive = true : species;
      });
      this.selectedSpeciess.push(speciesData);
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
   * upload logic for upload
   * @param picture profile pic
   * @param id pet id
   */
  uploadProfilePic = (picture, id) => {
    this.practiceService.uploadProfilePic(picture, id, 'PA').subscribe(res => {
    });
  }

  /**
   * Practice registration api call
   */
  registerPractice() {
    if(this.model.email!=undefined || this.model.email!=null){
    this.model.email = this.model.email.trim().toLowerCase();
    let modelCopy: any;
    const p = this.model.password;
    this.model = {
      ...this.model, species: this.selectedSpeciess,
    };
    this.model.password = p;
    this.model.species = this.selectedSpeciess;
    modelCopy = Object.assign({}, this.model);
    this.practiceService.practiceCheck(modelCopy).subscribe((res: any) => {
      if (res.code === 500) {
        this.notificationService.notification(res.message, 'danger');
      } else {
        this.practiceService.practiceRegistration(modelCopy, p).subscribe((res: any) => {
          localStorage.setItem('secret', res.secret);
          if (this.imagePath) {
            this.uploadProfilePic(this.imagePath[0], res.user.id);
            if (this.magicLinkservice.checkforMaglinkId()) {
              this.setMagicLinkStatus();
            } else {
              this.router.navigate(['/auth/otpverification']);
            }
          } else if (this.bolbPic) {
            this.uploadProfilePic(this.bolbPic, res.user.id);
            if (this.magicLinkservice.checkforMaglinkId()) {
              this.setMagicLinkStatus();
            } else {
              this.router.navigate(['/auth/otpverification']);
            }
          } else {
            if (this.magicLinkservice.checkforMaglinkId()) {
              this.setMagicLinkStatus();
            }
            this.router.navigate(['/auth/otpverification']);
          }
          this.resetForm();
      });
      }
    });
  }}

  setMagicLinkStatus() {
    this.magicLinkservice.setStatusToUsed().subscribe(resp => {
      this.router.navigate(['/auth/otpverification']);
    });
  }


  /**
   * Clearing form data on submit
   */
  resetForm() {
    this.practiceRegistrationForm.form.reset();
    this.retrieveSpecies();
    this.imgUrl = '';
  }

  /**
   * upadete practice id at user table
   * @param res user details
   */
  // updateUserPractice(res) {
  //   let userData = this.authService.getUser();
  //   userData = { ...userData, practiceId: res.data.id };
  //   this.userService.updateUser(userData).subscribe((res: any) => {
  //     this.router.navigate(['/auth/otpverification']);
  //   });
  // }

  /**
   * on close sign up page
   */
  onCloseSignup() {
    this.router.navigateByUrl('/home');
    this.storage.clear();
  }

  /**
   * to change input type for password
   */
  changePasswordType() {
    this.passwordShow = !this.passwordShow;
  }

  /**
   * to change input type for password
   */
  showConfirmPassword() {
    this.confirmPasswordShow = !this.confirmPasswordShow;
  }

  passwordMatchValidator() {
    if (this.model.password && this.model.confirmPassword) {
      this.model.password === this.model.confirmPassword ? this.missmatch = false : this.missmatch = true;
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
}
