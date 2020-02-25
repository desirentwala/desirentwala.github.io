import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import { Platform, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NotificationService } from 'src/app/common/services/notification.service';
import { CommonService } from 'src/app/common/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-pet-owner',
  templateUrl: './edit-pet-owner.page.html',
  styleUrls: ['./edit-pet-owner.page.scss'],
})
export class EditPetOwnerPage implements OnInit {
  petOwnerData: any = '';
  value: any;
  currentImage: any;
  isMobile: boolean;
  public imgUrl;
  public imagePath;
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  images: any;
  end = 3;
  start = 0;
  blobPic: any;
  profilePic: FileList;
  @Input()
  public set selectedPetOwnerData(v) {
    if (v) {
      this.petOwnerData = {...v};
      this.imgUrl = v.imgUrl;
      this.value = 'show';
      if(this.petOwnerData && this.petOwnerData.pet){
        this.petOwnerData.pets.map((res: any) => {
          if (!res.profilePic) {
            res.imgUrl = '../../../assets/imgs/default-dog.png';
          } else {
            res.imgUrl = `${environment.baseUri}storage/download/${res.profilePic} `;
          }
        });
        this.images = this.petOwnerData.pets.slice(this.start, this.end);
      }
    } else {
      this.value = '!show';
    }
  }
  @Output() petOwnerDataEmit = new EventEmitter<any>();

  constructor(
    private platform: Platform,
    private userService: UserService,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private notify: NotificationService,
    private commonService: CommonService
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
   }

  ngOnInit() {
  }
  onPrevious() {
    if (this.start !== 0) {
      this.start -= 1;
      this.end -= 1;
      this.images = this.petOwnerData.pets.slice(this.start, this.end);
    }
  }

  onNext() {
    if(this.petOwnerData){
      if (this.end < this.petOwnerData.pets.length) {
        this.start += 1;
        this.end += 1;
        this.images = this.petOwnerData.pets.slice(this.start, this.end);
      }
    }
  }

  /**
   * update pet owner
   */
  updateProfile() {
    this.petOwnerData.type = 'PO';
    // this.petOwnerData.firstName = this.petOwnerData.name;
    this.userService.updateUser(this.petOwnerData).subscribe((user: any) => {
      if (this.profilePic) {
        this.uploadProfilePic(this.profilePic[0], this.petOwnerData.id);
      } else if (this.blobPic) {
        this.uploadProfilePic(this.blobPic, this.petOwnerData.id);
      } else {
        this.commonService.vetUpdateSubject.next(user);
      }
      this.value = '!show';
      this.petOwnerDataEmit.emit('success');
    });
  }
  close() {
    this.value = '!show';
    this.petOwnerDataEmit.emit('success');
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
    } else if(this.profilePic){
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
  
        // this.uploadProfilePic(files[0], this.petOwnerData.id);
      }
    }
    
  }

  /**
   * upload call
   * @param picture file data
   * @param id vet id
   */
  uploadProfilePic(picture, id) {
    this.userService.uploadProfilePic(picture, id, 'PO').subscribe((pic: any) => {
      this.commonService.vetUpdateSubject.next('');
    });
  }

  dataURLtoFile(dataurl) {
    fetch(dataurl)
      .then(res => res.blob())
      .then(blob => {
        this.blobPic = blob;
        // this.uploadProfilePic(blob, this.petOwnerData.id);
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
