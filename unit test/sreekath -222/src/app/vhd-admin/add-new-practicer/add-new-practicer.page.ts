import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, OnChanges, HostListener } from '@angular/core';
import { VhdAdminService } from '../vhd-admin.service';
import { NotificationService } from 'src/app/common/services/notification.service';
import { PracticeModel } from './add-practice.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common/services/common.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-new-practicer',
  templateUrl: './add-new-practicer.page.html',
  styleUrls: ['./add-new-practicer.page.scss'],
  providers: [Camera]
})
export class AddNewPracticerPage implements OnInit {
  @Output() public newPracticer: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('addPractice', { static: false }) addPractice: NgForm;
  @ViewChild(NgForm, {static: false}) ngForm: NgForm;

  practiceModel = new PracticeModel();
  addOrInvite: boolean;
  imgUrl: any;
  heading: string;
  imagePath: any;
  genderList: any = [];
  speciesList: any = [];
  speciesArray: any[];
  iconName: any;
  initialImages = 7;
  colSize = 1.5;
  colNavSize = 0.7;
  profilePic: FileList;
  from = 0;
  activeIndex: any;
  selectedSpeciess = [];
  currentItemIndex: number;
  vet: any;
  isSpeciesSelected: boolean;
  isMobile: boolean;
  bolbPic: any;
  constructor(
    public commonServcice: CommonService,
    public vhdAdminService: VhdAdminService,
    public notify: NotificationService,
    public camera: Camera,
    public actionSheetController: ActionSheetController,
    public router: Router,
    public platform: Platform
  ) {
    /**
     * device check
     */
  
    if (navigator.userAgent.match(/Android/i)
      // || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i) && navigator.userAgent.match!=undefined

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
    this.getSpeciesList();
    this.speciesLength();
  }
  speciesLength() {
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
   * retrive all species
   */
  getSpeciesList() {
    this.vhdAdminService.getSpecies().subscribe((species: any) => {
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
   * adding New Practice .
   */
  createPractice = () => {
   if (this.practiceModel.email != null || this.practiceModel.email  != undefined) {
      const data = {

        ...this.practiceModel,
        species: this.speciesList.slice().filter((species) => species.isActive === true),
        email: this.practiceModel.email.trim().toLowerCase(),
      };


      this.vhdAdminService.practiceCheck(data).subscribe((res: any) => {
      if (res.code === 500) {
        this.notify.notification(res.message, 'success');
      } else {
        this.vhdAdminService.addNewPractice(data).subscribe((vet) => {
          this.vet = vet.data;
          if (this.profilePic) {
            this.uploadProfilePic(this.profilePic[0], vet.user.id);
          } else if (this.bolbPic) {
            this.uploadProfilePic(this.bolbPic, vet.user.id);
          }
          // tslint:disable-next-line: no-conditional-assignment
          if (vet.active = true) {
            this.practiceModel = new PracticeModel();
            this.addPractice.resetForm();
            this.getSpeciesList();
            this.imgUrl = '';
            this.newPracticer.emit('success');
            this.notify.notification('Practice details added successfully', 'success');
            // this.router.navigateByUrl('vhdadmin/dashboard');
          }
        });
      }
    });
  }}

  /**
   * Inviting Practice .
   */
  invitePractice() {
    if (this.commonServcice.getStorage != undefined || this.practiceModel.practiceEmail != undefined || this.practiceModel.practiceEmail != null) {


    const data = {
      mlFor: 'INVITE_PA',
      userId: this.commonServcice.getStorage.id,
      practiceName: this.practiceModel.invitePracticeName,
      email: this.practiceModel.practiceEmail.trim().toLowerCase(),
    };
    this.vhdAdminService.invitePractic(data).subscribe((res: any) => {
      if (res.message) {
        this.notify.notification('Invitation sent successfully', 'success');
        this.practiceModel = new PracticeModel();
        this.addPractice.reset();
      }
    });

  }}

  /**
   * change the mode Add or Invite
   */
  onAddOrInvite(data) {
    this.from = 0;
    this.speciesLength();
    this.speciesArray = this.speciesList.slice(this.from, this.initialImages);
    this.addOrInvite = data;
    this.selectedSpeciess = [];
    return this.speciesList.map((species) => species.isActive = false);
  }

  /**
   * upload logic for upload
   * @param picture profile pic
   * @param id vet id
   */
  uploadProfilePic = (picture, id) => {
    this.vhdAdminService.uploadVetPic(picture, id).subscribe(res => res);
  }
  /**
   * active class set for species selection
   * @param speciesData species data on selection
   */
  selectedSpecies(speciesData: any, index: any) {
    if (this.selectedSpecies.length > 0) {
      this.isSpeciesSelected = false;
    }
    if (this.selectedSpecies.length !== 0) {
      this.isSpeciesSelected = true;
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
      this.selectedSpeciess.push(speciesData);
    }
  }

  /**
   * spesies array changes for back button
   */
  onPrevious() {
    if (this.from !== 0) {
      this.speciesArray = this.speciesList.slice(this.from - 1, this.initialImages - 1);
      this.from -= 1;
      this.initialImages -= 1;
      this.activeIndex += 1;
    }
  }

  /**
   * apecies array changes for next button
   */
  onNext() {
    if (this.initialImages < this.speciesList.length) {
      this.speciesArray = this.speciesList.slice(this.from + 1, this.initialImages + 1);
      this.from += 1;
      this.initialImages += 1;
      this.activeIndex -= 1;
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
  petPicUpdate(e) {
    let event=e.target.files;
    if (event) {
    this.profilePic = event;
    // if (this.profilePic.length === 0) {
    //   return;
    // }
    if (this.profilePic) {
    const mimeType = this.profilePic[0].type;
    // if (mimeType.match(/image\/*/) == null) { }
    const reader = new FileReader();
    this.imagePath = this.profilePic;
    reader.readAsDataURL(this.profilePic[0]);
    reader.onload = () => {
      this.imgUrl = reader.result;
    };
  }}
  }
}