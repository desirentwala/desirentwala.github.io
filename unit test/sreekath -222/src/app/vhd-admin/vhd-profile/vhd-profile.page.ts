import { Component, OnInit } from '@angular/core';
import { UserService } from '../../common/services/user.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { NotificationService } from 'src/app/common/services/notification.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-vhd-profile',
  templateUrl: './vhd-profile.page.html',
  styleUrls: ['./vhd-profile.page.scss'],
  providers: [Camera]
})
export class VhdProfilePage implements OnInit {

  readFormValue = true;
  public imagePath;
  userData: any;
  public vhdData;
  public status;
  public nonActive;
  updateProfile: any;
  nonActiveMode: string;
  currentImage: any;
  isNameChanged: boolean;
  // for choosing one image
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  isMobile: boolean;

  constructor(
    private userService: UserService,
    public camera: Camera,
    public actionSheetController: ActionSheetController,
    public notify: NotificationService,
    private commonService: CommonService,
    public platform: Platform
  ) {
    // tslint:disable-next-line: deprecation
    if (
      navigator.userAgent.match(/Android/i) ||
      // || navigator.userAgent.match(/webOS/i)
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
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
    this.getUserData();
  }

  // getting the localstorage data for form
  getUserData() {
    if (JSON.parse(localStorage.getItem('result')) !== null) {
      this.getUserDetails(JSON.parse(localStorage.getItem('result')));
    }
  }

  // upload image for profile pic
  imageFilePathChange(event) {
    if (event) {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => (this.imagePath = reader.result);
        reader.readAsDataURL(file);
      }
    }
  }

  // edit enable for change the form data
  editProfileEnable() {
    this.readFormValue = false;
    this.isNameChanged = true;
  }

  // user Details from service
  getUserDetails(data) {
    if (data.id!=undefined) {
      this.userService.getUserList(data && data.id).subscribe(res => {
        if (res) {
          this.status = res;

          this.vhdData = this.status.data;

          if (!this.vhdData.profilePic) {
            this.currentImage = '';
          } else {
            this.currentImage = `${environment.baseUri}storage/download/${this.vhdData.profilePic} `;
          }
        }
      });
    }
  }

  /**
   * update user
   */
  updateVhdProfile() {
    const vhdDetailsObj = {
      id: this.vhdData.id,
      firstName: this.vhdData.firstName,
      lastName: this.vhdData.lastName,
      email: this.vhdData.email,
      mobile: this.vhdData.mobile,
      password: this.vhdData.password,
      // profilePic: this.vhdData.profilePic,
      isActive: this.vhdData.isActive,
      practiceId: this.vhdData.practiceId
    };
    this.userService.updateVhdUser(vhdDetailsObj).subscribe((user: any) => {
      const profDetails = this.commonService.getStorage;
      profDetails.firstName = user.data.firstName;
      localStorage.setItem('result', JSON.stringify(profDetails));
      this.commonService.picSubject.next({ user: user.data });
      this.notify.notification(
        'Profile details updated successfully',
        'success'
      );
      this.readFormValue = true;
      this.isNameChanged = false;
    });
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
    this.camera.getPicture(options).then(
      imageData => {
        this.currentImage = 'data:image/jpeg;base64,' + imageData;
        this.dataURLtoFile(this.currentImage);
      },
      err => {
        // Handle error
      }
    );
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
      buttons: [
        {
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
        }
      ]
    });
    await actionSheet.present();
  }

  /**
   * method load image
   * @param event contains file
   */
  // uploadPicture(event) {
  //     const files = event.target.files;
  //     if (files && files.length === 0) {
  //       return;
  //     } else if(files){
  //       const totalBytes = files[0].size;
  //       const size = Math.floor(totalBytes / 1000000) + 'MB';
  //       if (size >= '4MB') {
  //         this.notify.notification(
  //           'Profile picture should not exceed 4MB',
  //           'danger'
  //         );
  //       } else {
  //         const mimeType = files[0].type;
  //         if (mimeType.match(/image\/*/) == null) {
  //         }
  //         const reader = new FileReader();
  //         this.imagePath = files;
  //         reader.readAsDataURL(files[0]);
  //         reader.onload = () => {
  //           this.currentImage = reader.result;
  //         };
  //         this.uploadProfilePic(files[0], this.vhdData.id);
  //       }
      
  //     }
      
  // }
  uploadPicture(event) {
    const files = event.target.files;
    if(files){
      if (files.length === 0) {
        return;
      }
      const totalBytes = files[0].size;
      const size = Math.floor(totalBytes / 1000000) + 'MB';
      // console.log(size);
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
        this.uploadProfilePic(files[0], this.vhdData.id);
      }
    }
  }
  /**
   * upload call
   * @param picture file data
   * @param id vhd admin id
   */
  uploadProfilePic(picture, id) {
    this.userService
      .uploadProfilePic(picture, id, 'VHD')
      .subscribe((pic: any) => {
        this.commonService.picSubject.next({ data: pic.data });
        this.updateStorage(pic.data);
      });
  }

  /**
   * Updating profile pic info to local storage
   * @param pic profile pic name
   */
  updateStorage(pic) {
    // if (this.commonService.getStorage.profilePic !== pic) {
    const store = this.commonService.getStorage;
    if(store){
      store.profilePic = pic;
      localStorage.setItem('result', JSON.stringify(store));
    }
    // }
  }
  
}
