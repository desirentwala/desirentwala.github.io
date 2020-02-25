import { Component, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PetService } from '../pets.service';
import { Pet } from '../pet.model';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/common/services/common.service';
import { SchedulingService } from 'src/app/scheduling-management/service/scheduling.service';
import * as moment from 'moment';
@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  petDetails: any;
  pet = new Pet();
  appointments: any;
  apptArr: any;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private alertController: AlertController,
    private schedulingservice: SchedulingService,
    private commonService: CommonService,
    private petService: PetService) {
    this.activeRoute.queryParams.subscribe(params => {
      this.appointments = [];
      if (params.id) {
        this.petService.getPetById(params.id).subscribe((petDetails: any) => {
          this.petDetails = petDetails.data;
          this.pet = this.petDetails;
          this.petService.getAppointmentsByPet(this.pet.id).subscribe((res: any) => {
            this.apptArr = res;
            this.getAppointments();
          });
        });
      }
    });
  }
  

  ngOnInit() {
  }
  editPet() {
    if(this.petDetails){
      this.router.navigate(['/pets/edit'], { queryParams: { id: this.petDetails.id } });
    }
  }
  getAppointments() {
    // console.log(this.pet.id);
    const TempArray = [];
    if(this.apptArr){
      this.apptArr.bookings.forEach(Appoitment => {
        const tableRow = {
          id: Appoitment.id,
          appointmentDate: this.schedulingservice.dateConversion(Appoitment.slot.startsAt),
          time: Appoitment.apptOn,
          slot: Appoitment.slot.startsAt,
          practicerName: Appoitment.slot.practice.practiceName,
          paid: `£ ${Appoitment.practiceAppointmentType.customerFee}`,
          status: Appoitment.status.statusName,
          duration: Appoitment.slot.duration,
          completeData: Appoitment,
          apptOnORg: moment(Appoitment.slot.startsAt)
        };
        TempArray.push(tableRow);
        // tempdata.push(tableRow);
      });
    }
    this.appointments = TempArray;
  }
  startVideoSession() {
    this.router.navigate(['online-consultation']);
  }
  hidePet() {
    this.pet.hide = true;
    this.petService.addPet(this.pet).subscribe((pet: any) => {
      this.pet = pet.data;
    });
  }
  showPet() {
    this.pet.hide = false;
    this.petService.addPet(this.pet).subscribe((pet: any) => {
      this.pet = pet.data;
    });
  }
  /**
   * Navigating to appointment page only for active pets
   * @param pet selected pet for appointment
   */
  handleBookingButton(pet) {
    if (!pet.hide) {
      this.router.navigate(['/pets/appointments'], { queryParams: { id: this.pet.id, practice: pet.practiceId } });
    }
  }
  /**
   * Deletig pet profile
   * @param pet selected pet info
   */
  deletePet() {
    this.petService.deletePet(this.pet.id).subscribe(res => {
      this.router.navigate(['/pets/list']);
    });
  }
  /**
   * basepath for download
   */
  get basePath(): string {
    return environment.baseUri;
  }

  /**
   * Confirmation before delete
   */
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: `Are you sure you want to delete ${this.pet.petName}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: 'Yes',
          handler: () => {
            this.deletePet();
          }
        }
      ]
    });
    await alert.present();
  }

}
