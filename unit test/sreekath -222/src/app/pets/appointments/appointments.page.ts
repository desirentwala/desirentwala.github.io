import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'underscore';
import * as moment from 'moment';
import { Appointment } from '../appointment.model';
import { AppointmentService } from '../appointment.service';
import { AppointmentConditionsPage } from '../../common/components/appointment-conditions/appointment.conditions.page';
import { PetService } from '../../pets/pets.service';
import { CommonService } from '../../common/services/common.service';
import { PracticeAdminService } from '../../practice-admin/practice-admin.service';
import { SchedulingService } from 'src/app/scheduling-management/service/scheduling.service';
import { environment } from 'src/environments/environment';
import { MagicLinkService } from 'src/app/common/services/magic-link/magic-link.service';
import { NotificationService } from '../../common/services/notification.service';
import { Storage } from '@ionic/storage';
import { ChangeDetectorRef } from '@angular/core';
import { parseTemplate } from '@angular/compiler';
import { PaymentsService } from 'src/app/payments/payments.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
  model = new Appointment();
  petData: Array<any>;
  isShow: boolean;
  showSlots: boolean;
  getData: any;
  displaySlots: any = [];
  activePetId: number;
  appointmentslots: any = [];
  appointments: any;
  diffDay: Date;
  MAX_PET = 3;
  editId: any;
  activeIndex: number;
  activeSlot: number;
  appointmentId: number;
  isPrivateSlot = false;
  privateSlot: any;
  isInvalid: boolean;
  bookingHead: string;
  editBooking: boolean;
  previousAppoiment: any;
  tc = ['You have access to a desktop computer or mobile device with camera and microphone enabled.',
    'You have access to wifi.',
    'Your pet is within easy reach, put your dog on a lead or make sure your cat cannot hide somewhere.',
    'There is good lighting and no background noise.',
    'You are ready and logged onto the app at least 5 minutes before your appointment time.',
    'You advice the practice if you will be late for the appointment at least 2 hours before.',
    'Please note that no-shows may result in a cancellation charge'
  ];
  isEditable = true;
  selectedDate: any;
  today: string;
  oldSlotId: any;
  slideOpts = {
    initialSlide: 2,
    // centeredSlides: false,
    speed: 400,
    pager: false,
    slidesPerView: 3,
    // spaceBetween: 20,
    uniqueNavElements: false,
    slidesPerGroup: 3,
    freeMode: true,
    updateOnWindowResize: true,
    breakpoints: {
      // when window width is <= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: -70
      },
      // when window width is <= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: -25
      },
      // when window width is <= 640px
      780: {
        slidesPerView: 3,
        spaceBetween: -120
      }
    }
  };
  isMobile: boolean;
  magicLink: string;
  actionFlag: string;

  constructor(
    public alertController: AlertController,
    public modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private appointmentService: AppointmentService,
    private petService: PetService,
    private schedulingService: SchedulingService,
    private commonServcice: CommonService,
    private practiceAdminService: PracticeAdminService,
    private magicLinkService: MagicLinkService,
    private notificationService: NotificationService,
    public storage: Storage,
    public cdr: ChangeDetectorRef,
    private paymentsService: PaymentsService,
    public statusBar: StatusBar
  ) {
    // Checking device
    if (navigator.userAgent.match(/Android/i)
      // || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      // || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.previousAppoiment = undefined;
      this.oldSlotId = '';
      // if not Magic Link based lading then continue from here
      if (params.id) {
        this.model.petId = +params.id;
        this.activePetId = +params.id;
        this.isEditable = true;
        this.getPetAppointment();
        this.actionFlag = '';
      } else {
        this.activePetId = null;
        this.getPetList();
        this.isEditable = true;
        this.appointmentslots = [];
        this.selectedDate = '';
        this.actionFlag = '';
      }
      if (params.flag === 'edit' && params.appointmentId) {
        this.actionFlag = params.flag;
        this.bookingHead = 'Edit';
        this.model.petId = +params.id;
        this.isEditable = false;
        this.model.id = +params.appointmentId;
        this.oldSlotId = params.slot;
      } else {
        this.bookingHead = 'Book';
        this.actionFlag = '';
      }
      if (params.flag === 'rebook' && params.petId) {
        this.actionFlag = params.flag;
        this.model.petId = +params.petId;
        this.activePetId = +params.petId;
        this.isEditable = false;
        this.getPetAppointment();
      }
    });
    this.today = moment().format('YYYY-MM-DD');
  }

  ionViewWillEnter() {
    let petPractice;
    this.activatedRoute.queryParams.subscribe(params => {
      petPractice = params.practice;
      this.magicLink = params.ml;
    });
    if (this.magicLink === 'yes') {
      this.storage.get('BOOKING_PRIVATE_SLOT').then((val) => {
        if (val) {
          this.getPetListforPractise(val.practiceId);
        }
      });
    }
    this.selectedDate = moment(new Date()).format('YYYY-MM-DD');
    this.previousAppoiment = undefined;
    this.checkPrivateSlotAvailability(petPractice);
    // setTimeout(() => {
    // this.getPetAppointment();
    // this.storage.get('BOOKING_PRIVATE_SLOT').then((val) => {
    //   if (val !== null) {
    //     this.practiceAdminService.getPrivateSlotInfo(val.slotId).subscribe(
    //       slotInfo => {
    //         if (slotInfo.data.practiceId === +petPractice) {
    //           this.privateSlot = slotInfo.data;
    //           this.privateSlot['Appon'] = moment(slotInfo.data.startsAt.toString()).format('YYYY-MM-DD');
    //           this.privateSlot['time'] = moment(slotInfo.data.startsAt.toString()).format('HH:mm');
    //           this.isShow = true;
    //           this.getPetListforPractise(val.practiceId);
    //           this.isEditable = true;
    //           this.isPrivateSlot = true;
    //           this.cdr.detectChanges();
    //         } else {
    //           this.privateSlot = undefined;
    //           this.isPrivateSlot = false;
    //         }
    //       }, err => {
    //         this.notificationService.notification('Failed to retrieve slot details, please use the link from mail again.', 'danger');
    //       });
    //   }
    // });
    // }, 500);

    if (sessionStorage.getItem('TRANS_CANCELLED')) {
      const bookingId = sessionStorage.getItem('TRANS_CANCELLED');
      const transupdate = {};
      transupdate['id'] = bookingId;
      transupdate['statusName'] = 'Cancelled';
      this.paymentsService.updateStatus(transupdate).subscribe(() => {
        this.notificationService.notification('Transaction cancelled', 'danger');
      });
      sessionStorage.clear();
    }

  }

  ionViewDidEnter() {
    if (cordova.platformId === 'ios') {
      this.statusBar.styleLightContent();
    } else {
      this.statusBar.styleDefault();
    }
  }

  getPetListforPractise(practiceId: any) {
    return new Promise((resolve) => {
      if (this.commonServcice.getStorage && this.commonServcice.getStorage.id) {
        this.petService.getPetList(this.commonServcice.getStorage && this.commonServcice.getStorage.id).subscribe(res => {
          // this.petData = res.data;
          if (res.data) {
            this.petData = res.data.filter(pet => pet.hide === false);
            this.petData = res.data.filter(pet => pet.practiceId === practiceId);
          }
          resolve(res.data);

        });
      }
    });
  }

   processMagicLink(magicLinkService: MagicLinkService) {
     if(magicLinkService){
      var PslotId = this.magicLinkService._linkData.data.slotId
     }
    // link is valid and need to proceed
    this.practiceAdminService.getPrivateSlotInfo(PslotId).subscribe(
      slotInfo => {
        this.privateSlot = slotInfo.data;
        this.isPrivateSlot = true;
      }, err => {
        this.notificationService.notification('Failed to retrieve slot details, please use the link from mail again.', 'danger');
      });
  }

  ngOnInit() {

  }

  /**
   * basepath for download
   */
  get basePath(): string {
    return environment.baseUri;
  }

  /**
   * Handling appointment and pet selection
   */
  async getPetAppointment() {
    await this.getPetList(this.activePetId);
    const activeObj = _.findWhere(this.petData, { id: this.activePetId });
    this.activeIndex = _.indexOf(this.petData, activeObj);
    this.petData = this.swap(this.petData, 0, this.activeIndex);
    this.selectedPet(activeObj);
  }

  /**
   * Function to swap selected pet to begining
   */
  swap = (arr, index1, index2) => arr.map((val, idx) => {
    if (idx === index1) { return arr[index2]; }
    if (idx === index2) { return arr[index1]; }
    return val;
  })

  /**
   * creating slot Object
   */
  getSlotsForPet() {
    this.appointmentslots = [];
    this.displaySlots = [];
    if (this.getData && this.getData.length > 0) {
      this.getData = this.getData.sort((a, b) => moment(a.startsAt).diff(b.startsAt));
      this.getData.filter(S => {
        // this.model.appointmentDate = new Date(moment.utc(S.startsAt).format('YYYY/MM/DD'));
        // this.selectedDate = moment(S.startsAt).format('YYYY-MM-DD');
        const slots = {
          date: moment(S.startsAt).format('YYYY/MM/DD'),
          slot: moment(S.startsAt).format('hh:mm a'),
          duration: `${S.duration} minutes`,
          price: S.price,
          slotId: S.id,
          vet: S.vet,
          isPrivate: S.isPrivate,
          practiceAppointmentTypeId: S.practiceAppointmentTypeId,
          appointmentType: S.appointmentType,
          originalDateTime: S.startsAt,
          vetEmail: S.vetEmail,
          practiceName: S.practiceName,
          practiceEmail: S.practiceEmail
        };
        this.appointmentslots.push(slots);
      });
    } else {
      this.appointmentslots = [];
    }
    this.showSlots = true;
  }

  /**
   * Get User pet list
   */
  getPetList(petId?: any) {
    this.previousAppoiment = undefined;
    return new Promise((resolve) => {
      this.petService.getPetList(this.commonServcice.getStorage && this.commonServcice.getStorage.id).subscribe(res => {
        // this.petData = res.data;
        if (res.data) {
          this.petData = res.data.filter(pet => pet.hide === false);
        }
        if (petId && this.oldSlotId) {
          this.petData = this.petData.filter(pet => pet.id === petId);
          this.petData = [...this.petData];
          this.editBooking = true;
          this.previousAppoiment = this.appointmentService.getselectedAppoitments();
        }
        resolve(res.data);
      });
    });
  }

  /**
   * Get available slots of practice
   * @param practicerId selected pet practicer Id
   */
  getPracticeSlots(practiceId, date?) {
    const slotDate = date ? date : this.model.appointmentDate;
    // const d = moment.parseZone(slotDate);
    return new Promise((resolve) => {
      this.practiceAdminService.getPracticeSlots(practiceId, this.model.speciesId, slotDate).subscribe(res => {
        this.getData = res.data;
        resolve(res.data);
      });
    });
  }

  /**
   * Initiate Pet booking process
   * @param pet selected pet info
   */
  async selectedPet(pet) {
    this.activePetId = pet.id;
    this.appointmentslots = [];
    this.activePetId = pet.id;
    this.model = {
      ...this.model, petId: pet.id, petName: pet.petName,
      practiceId: pet.practiceId, speciesId: pet.speciesId,
      profilePic: pet.profilePic || 'default-dog.png'
    };
    // if (this.privateSlot && this.isPrivateSlot) {
    //   this.isShow = true;
    // not required for Private slot
    // } else {
    // for regular booking flow
    // this.selectedAppointmentDate(moment(new Date()).add(1, 'days'));
    this.checkPrivateSlotAvailability(pet.practiceId);
    this.isShow = true;
    this.selectedDate = moment(this.selectedDate).format('YYYY-MM-DD');
    this.selectedAppointmentDate(new Date());
    await this.getPracticeSlots(pet.practiceId, this.selectedDate);
    this.getSlotsForPet();
    // }
  }

  /**
   * Checking private slots for selected pets based on practice
   * @param practice selected pet's practice id
   */
  checkPrivateSlotAvailability(practice) {
    if (this.actionFlag !== 'edit' && this.actionFlag !== 'rebook') {
      setTimeout(() => {
        this.storage.get('BOOKING_PRIVATE_SLOT').then((val) => {
          if (val !== null) {
            this.practiceAdminService.getPrivateSlotInfo(val.slotId).subscribe(
              slotInfo => {
                if (slotInfo.data.practiceId === practice || this.magicLink === 'yes') {
                  this.privateSlot = slotInfo.data;
                  this.privateSlot['Appon'] = moment(slotInfo.data.startsAt.toString()).format('YYYY-MM-DD');
                  this.privateSlot['time'] = moment(slotInfo.data.startsAt.toString()).format('HH:mm');
                  this.isShow = true;
                  this.isEditable = true;
                  this.isPrivateSlot = true;
                  this.cdr.detectChanges();
                } else {
                  this.privateSlot = undefined;
                  this.isPrivateSlot = false;
                }
              }, err => {
                this.notificationService.notification('Failed to retrieve slot details, please use the link from mail again.', 'danger');
              });
          }
        });
      }, 500);
    } else {
      this.privateSlot = undefined;
      this.isPrivateSlot = false;
    }
  }

  /**
   * Assigning selected date to model
   * @param date selected date
   */
  selectedAppointmentDate(date) {
    this.model.appointmentDate = this.schedulingService.dateConversion(date);
    // this.selectedDate = moment(date).format('YYYY-MM-DD');
  }

  /**
   * Function for Displaying the AppointmentSlots
   */
  async onDisplaySlots(date) {
    // this.selectedDate = date;
    if (this.activePetId !== null) {
      await this.getPracticeSlots(this.model.practiceId, date);
      this.getSlotsForPet();
    } else {
      this.notificationService.notification('Please select the pet', 'danger');
    }
  }

  /**
   * hadling slot filtering
   * @param value contains filtered value
   */
  // filterSlots(value) {
  //   if (value === 'ion-sb-0') {
  //     this.appointmentslots = this.appointments;
  //   } else if (value === 'ion-sb-1') {
  //     this.appointmentslots = this.appointments.slice().filter(item => item.slot.split(':').slice(0, 1).toString() < 12);
  //   } else if (value === 'ion-sb-2') {
  //     this.appointmentslots = this.appointments.slice().filter(item => item.slot.split(':').slice(0, 1).toString() > 12);
  //   }
  // }

  /**
   * To book appointment for pet
   * @param slot Selected slot by pet owner
   */
  bookAppointment(data) {
    if(data && this.commonServcice.getStorage){
      this.activeSlot = data.id;
      this.model.price = data.price;
      this.model.userId = this.commonServcice.getStorage.id;
      this.model.practiceName = data.slot.practiceName;
    }
    this.model.slot = {
      id: data.slotId, isPrivate: data.isPrivate, vet: data.vet, duration: data.duration, startsAt: data.slot
      , practiceAppointmentTypeId: data.practiceAppointmentTypeId,
      appointmentType: data.appointmentType, originalDateTime: moment(new Date(data.originalDateTime)).format('MMM D, YYYY| h:mm A')
    };
    this.model.appointments.push({
      userId: this.model.userId,
      petId: this.model.petId,
    });
    if(this.commonServcice.getStorage){
      this.model = {
        ...this.model, appointmentDate: data.date, oldSlotId: this.oldSlotId,
        // paymentId: data.paymentId, status: data.status, bookingId: data.bookingId,
        practiceAppointmentTypeId: 1, firstName: this.commonServcice.getStorage.firstName,
        email: this.commonServcice.getStorage.email,
        vetEmail: data.vetEmail, practiceName: data.practiceName, practiceEmail: data.practiceEmail,
        vet: data.vet
      };
    }
    
    this.initPayment();
  }

  public initPayment() {
    // appointment type is with zero price, then don't go for payment flow
    // if (+this.model.price > 0) {
    this.presentModal(this.model);
    // } else { //complete the appointment creation because no payment required
    //   this.presentModal(this.model);
  }

  /**
   * To book appointment for pet from private slot magic link
   */
  bookPrivateSlot() {
    if (!this.model.petId) {
      this.notificationService.notification('Please select the pet', 'danger');
    } else {
      if (this.magicLinkService.checkforMaglinkId()) {
        // this.magicLinkService.setStatusToUsed().subscribe(res => {
          this.activeSlot = this.privateSlot.id;
          this.model.price = this.privateSlot.practiceAppointmentType.customerFee;
          this.model.userId = this.commonServcice.getStorage.id;
          this.model.practiceName = this.privateSlot.practice.practiceName;
          this.model.slot = {
            id: this.privateSlot.id, isPrivate: true, vet: this.privateSlot.user.firstName
            , appointmentType: this.privateSlot.practiceAppointmentType.appointmentType, duration: this.privateSlot.duration,
            startsAt: this.privateSlot.time, practiceAppointmentTypeId: this.privateSlot.practiceAppointmentTypeId,
            originalDateTime: moment(new Date(this.privateSlot.startsAt)).format('MMM D, YYYY| h:mm A')

          };
          this.model.appointments.push({
            userId: this.model.userId,
            petId: this.model.petId
          });

          this.model = {
            ...this.model, appointmentDate: this.privateSlot.Appon,
            practiceAppointmentTypeId: this.privateSlot.practiceAppointmentType.id, firstName: this.commonServcice.getStorage.firstName,
            email: this.commonServcice.getStorage.email
          };
          // this.storage.clear();

          this.initPayment();
          // this.privateSlot = undefined;
        // });
      } else {
        this.notificationService.notification('Invalid magic link please contact admin', 'danger');
      }


    }

  }

  /**
   * Selection indication
   * @param data selected slot
   */
  slotSelection(data) {
    if(data){
      this.activeSlot = data.slotId;
    }
  }

  /**
   * Modal to display agreement
   */
  async presentModal(data) {
    const modal = await this.modalController.create({
      component: AppointmentConditionsPage,
      componentProps: {
        bookingInfo: data, tc: this.tc,
        header: 'On Appointment Day',
        subHeader: 'To ensure that your consultation runs smoothly, please check the following:'
      },
    });
    return await modal.present();
  }

  /**
   * show more species
   */
  showMorePets() {
    if(this.petData){
      this.MAX_PET += this.petData.length;
    }
  }

  /**
   * show less species
   */
  showLessPets() {
    if(this.petData){
    this.MAX_PET -= this.petData.length;
    }
  }

  /**
   * validating selecting data
   * @param date selected date
   */
  dateValidation(date) {
    if(date){
      if (moment(date.target.value) >= moment(this.today)) {
        this.isInvalid = false;
        this.onDisplaySlots(date.target.value);
        this.selectedAppointmentDate(date.target.value);
      } else {
        this.isInvalid = true;
        this.appointmentslots = [];
      }
    }
  }
}
