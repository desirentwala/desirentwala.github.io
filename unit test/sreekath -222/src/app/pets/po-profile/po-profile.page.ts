import { Component } from '@angular/core';
import { UserService } from '../../common/services/user.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { NotificationService } from 'src/app/common/services/notification.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-po-profile',
  templateUrl: './po-profile.page.html',
  styleUrls: ['./po-profile.page.scss'],
  providers: [Camera]
})
export class PoProfilePage {

  readFormValue = true;
  public imagePath;
  userData: any;
  public data;
  public status;
  public nonActive;
  nonActiveMode: string;
  public imgUrl = '../../../assets/profile-picture.png';
  currentImage: any;
  isNameChanged: boolean;
  // for choosing one image
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  isMobile: boolean;

  constructor(
    private platform: Platform,
    private userService: UserService,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    public notify: NotificationService,
    private commonService: CommonService
  ) {
    this.getUserData();
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

  // getting the localstorage data for form
  getUserData() {
    if (JSON.parse(localStorage.getItem('result')) !== null) {
      this.getUserDetails(JSON.parse(localStorage.getItem('result')));
    }
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
    this.readFormValue = false;
    this.isNameChanged = true;
  }

  // user Details from service
  getUserDetails(data) {
    this.userService.getUserList(data.id).subscribe(res => {
      if (res) {
        this.status = res;
        this.data = this.status.data;
        if (this.data.profilePic) {
          //   this.currentImage = './assets/user-avatar.svg';
          // } else {
          this.currentImage = `${environment.baseUri}storage/download/${this.data.profilePic} `;
        }
      }
    });
  }

  /**
   * update user
   */
  updateProfile() {
    this.data.type = 'PO';
    this.userService.updateUser(this.data).subscribe((user: any) => {
      this.isNameChanged = false;
      this.readFormValue = true;
      const profDetails = this.commonService.getStorage;
      profDetails.firstName = user.data.firstName;
      localStorage.setItem('result', JSON.stringify(profDetails));
      this.commonService.picSubject.next({ user: user.data });
      this.notify.notification('Profile details updated successfully', 'success');
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
    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
      // this.convertB64toBolob();
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
        this.uploadProfilePic(files[0], this.data.id);
      }
    }
  }

  dataURLtoFile(dataurl) {
    fetch(dataurl)
      .then(res => res.blob())
      .then(blob => {
        this.uploadProfilePic(blob, this.data.id);
      });
  }
  /**
   * upload call
   * @param picture file data
   * @param id pet owner id
   */
  uploadProfilePic(picture, id) {
    this.userService.uploadProfilePic(picture, id, 'PO').subscribe((pic: any) => {
      this.commonService.picSubject.next({ data: pic.data });
      this.updateStorage(pic.data);
    });
  }

  /**
   * Updating profile pic info to local storage
   * @param pic profile name
   */
  updateStorage(pic) {
    const store = this.commonService.getStorage;
      store.profilePic = pic;
      localStorage.setItem('result', JSON.stringify(store));
    }
    
}
