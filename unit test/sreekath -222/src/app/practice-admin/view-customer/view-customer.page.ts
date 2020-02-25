import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, AlertController } from '@ionic/angular';
import * as _ from 'underscore';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../common/services/common.service';
import { PetService } from '../../pets/pets.service';
import { NotificationService } from 'src/app/common/services/notification.service';
import { DeleteConfirmationService } from 'src/app/common/services/deleteConfirmation.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.page.html',
  styleUrls: ['./view-customer.page.scss'],
})
export class ViewCustomerPage implements OnInit, OnChanges {
  petData: Array<any>;
  @Input() customer;
  bookingData: any = [];
  header = 'Vet';
  menuItems: any = [];
  isBook: boolean;
  @Input() flag;
  MAX_PET = 3;
  colSize = 3;
  selectedPet: any = '';
  tempArr: Array<any>;
  statusList: any = Array<any>();
  sortedData: any = [];
  selectedPetOwnerData: any;
  petInfo: any;
  petFlag: string;

  constructor(
    private router: Router,
    private notify: NotificationService,
    private commonService: CommonService,
    private petService: PetService,
    public platform: Platform,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private deleteService: DeleteConfirmationService
  ) {
    this.menuItems = ['Edit Booking', 'Cancel Booking', 'Re-Book', 'Invoice'];
    this.statusList = ['Awaiting confirmation', 'Confirmed', 'Cancelled', 'Completed'];
    // this.onOrientationChange();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.customer && this.customer.pets && this.customer.pets.length > 0) {
      this.customer.pets.map(P => P.hide === false);
      this.defaultPetSelection();
      this.petData = this.customer.pets;
    }
    this.onSelect(this.selectedPet);
  }

  /**
   * default pet selection
   */
  defaultPetSelection() {
    if (!this.selectedPet) {
      if(this.customer){
        this.selectedPet = this.customer.pets[0];
      }
      
    } else {
      let p = this.customer;
      p = p.pets.filter((r) => r.id === this.selectedPet.id);
      if (p.length === 0) { this.selectedPet = this.customer.pets[0]; }
    }
  }

  /**
   * edit customer
   */
  editCustomer() {
    this.selectedPetOwnerData = this.customer;
    this.petInfo = false;
  }

  /**
   * edit pet
   * @param val pet data
   */
  editPet(pet) {
    if(this.selectedPet){
      if (this.selectedPet.id === pet.id) {
        this.petInfo = pet;
        this.petFlag = 'edit';
        this.selectedPetOwnerData = false;
      } else {
        this.petInfo = false;
      }
    }
  }

  /**
   * add new pet
   */
  addPet() {
    if(this.customer){
      this.petInfo = { id: this.customer.id, practiceId: this.commonService.getStorage.practiceId };
      this.petFlag = 'add';
    }
  }
  update() {
    this.selectedPetOwnerData = false;
    this.petInfo = false;
  }
  /**
   * delete pet
   * @param pet selected pet data
   */
  delete(pet) {
    if (this.selectedPet.id === pet.id) {
      this.petInfo = false;
      this.deleteService.deletePet(pet.id, pet.petName);
    }
  }

  // @HostListener('window:orientationchange')
  // onOrientationChange() {
  //   if (this.platform.is('desktop')) {
  //     this.MAX_PET = 5;
  //     this.colSize = 2;
  //   } else {
  //     this.MAX_PET = 3;
  //     this.colSize = 3;
  //   }
  // }

  /**
   * basepath for download
   */
  get basePath(): string {
    return environment.baseUri;
  }

  /**
   * selected pet details
   * @param pet selected pet
   */
  onSelect(pet) {
    this.petInfo = false;
    this.selectedPetOwnerData = false;
    this.isBook = true;
    this.selectedPet = pet;
    this.getAllAppointments();
  }

  navigateToAppointment(pet) {
    // this.router.navigate(['appointments/new'], { queryParams: { id: pet.id, flag: 'edit' } });
  }

  /**
   * get appointments by selected pet
   */
  getAllAppointments() {
    this.tempArr = [];
    let tableRow: any;
    this.bookingData = [];
    this.petService.getAllBookingsByUser(this.customer && this.customer.id).subscribe((res: any) => {
      res.bookings.forEach(bookings => {
        if (bookings.appointments) {
          bookings.appointments.filter(appointment => {
            tableRow = {
              appointmentId: bookings.id,
              appointmentDate: moment(bookings.slot.startsAt).format('ll'),
              time: moment(bookings.slot.startsAt).format('hh:mm A'),
              duration: bookings.slot.duration,
              practicerName: bookings.slot.user.firstName,
              practicerId: bookings.slot.practice.id,
              userId: bookings.userId,
              paid: `£ ${bookings.practiceAppointmentType.customerFee}`,
              status: bookings.status.statusName,
              petId: appointment.petId,
              vet: bookings.slot.user.firstName,
              completeData: bookings,
              role: 'PA'
            };
          });
          this.tempArr.push(tableRow);
        }
      });
      this.tempArr = _.uniq(this.tempArr, (book) => {
        return book.appointmentId;
      });
      this.sortedData = this.tempArr.sort((a, b) => {
        return this.statusList.indexOf(a.status) - this.statusList.indexOf(b.status);
      });
      this.bookingData = this.sortedData.filter(B => B.petId === this.selectedPet.id);
    });
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
}
