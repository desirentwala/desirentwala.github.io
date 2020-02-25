import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { VhdAdminService } from '../vhd-admin.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import * as _ from 'underscore';
import { AppointmentTypeService } from 'src/app/common/services/appointment-types.service';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-practicer-details',
  templateUrl: './practicer-details.page.html',
  styleUrls: ['./practicer-details.page.scss'],
})
export class PracticerDetailsPage implements OnInit, OnChanges {

  @Input() selectedPracticeData;
  detailsType: any;
  appointmentsData: any = [];
  value: any;
  columns: any;
  menuItems: any = [];
  practicerDetails: any;
  vetsByPractice: any;
  customersByPractice = [];
  tableMenuItems: { action: string; }[];
  imgLength = 3;
  apptTypes: any = [];
  constructor(
    private vhdAdminService: VhdAdminService,
    private commonService: CommonService,
    private appointmentTypeService: AppointmentTypeService
  ) {
    this.detailsType = 'appointments';
  }

  ngOnInit() {
    this.practiceDetailsType('appointments');
    this.commonService.vetUpdateObservable.subscribe(res => {
      this.practiceDetailsType(this.detailsType);
    });
  }

  ngOnChanges() {
    this.practiceDetailsType(this.detailsType);
  }

  /**
   * component and data change for change in tab
   * @param val contains current tab value
   */
  practiceDetailsType(val) {
    switch (val) {
      case 'vets':
        this.getVetsByPracticeId();
        break;
      case 'customers':
        this.getCustomersByPracticeId();
        break;
      case 'practiceInfo':
        this.getpracticerDetailsPracticeId();
        break;
      case 'practiceApptType':
        this.PracticeApptTypes();
        break;
      default:
        this.getPracticeAppointments();
    }
    this.detailsType = val;
  }

  /**
   * get selected practicer daetails
   */
  getpracticerDetailsPracticeId() {
    this.vhdAdminService.getPracticeDetailsById(this.selectedPracticeData && this.selectedPracticeData.id).subscribe((res) => {
      this.practicerDetails = res.data;
      if (res.data.logo) {
        this.practicerDetails.imgUrl = `${environment.baseUri}storage/download/${res.data.logo}`;
      } else {
        this.practicerDetails.imgUrl = '../../../assets/user-avatar.svg';
      }
    });
  }

  /**
   * get all vets by practicer id
   */
  getVetsByPracticeId() {
    this.vetsByPractice = [];
    this.columns = { col1: 'Vet', col3: 'Species treated' };
    this.tableMenuItems = [
      // { action: 'action1' },
      // { action: 'action2' },
      // { action: 'action3' }
    ];
    this.vhdAdminService.getVetsByPractice(this.selectedPracticeData && this.selectedPracticeData.id).subscribe((res) => {
      res.map((data) => {
        if (data.active) {
          this.vetsByPractice.push(
            {
              id: data.id,
              practiceId: this.selectedPracticeData.id,
              name: data.firstName,
              firstName: data.firstName,
              email: data.email,
              mobile: data.mobile,
              pets: data.vetSpecies,
              userName: data.userName,
              active: data.active,
              start: 0,
              end: this.imgLength,
              images: data.vetSpecies.slice(0, this.imgLength),
              imgUrl: data.profilePic ? `${environment.baseUri}storage/download/${data.profilePic}` :
                '../../../assets/user-avatar.svg'
            });
        }
      });
    });
  }

  /**
   * get all customers by practicer id
   */
  getCustomersByPracticeId() {
    this.customersByPractice = [];
    this.columns = { col1: 'Customers', col3: 'Pets' };
    this.tableMenuItems = [
      // { action: 'action1' },
      // { action: 'action2' },
      // { action: 'action3' }
    ];
    this.vhdAdminService.getCustomersByPractice(this.selectedPracticeData && this.selectedPracticeData.id).subscribe((res) => {
      res.data.map((data) => {
        // tslint:disable-next-line: no-shadowed-variable
        data.pets.map((res: any) => {
          if (!res.profilePic) {
            res.imgUrl = '../../../assets/imgs/default-dog.png';
          } else {
            res.imgUrl = `${environment.baseUri}storage/download/${res.profilePic} `;
          }
        });
        this.customersByPractice.push(
          {
            id: data.id,
            practiceId: this.selectedPracticeData.id,
            name: data.firstName,
            firstName: data.firstName,
            email: data.email,
            mobile: data.mobile,
            pets: data.pets,
            start: 0,
            end: this.imgLength,
            images: data.pets.slice(0, this.imgLength),
            imgUrl: data.profilePic ? `${environment.baseUri}storage/download/${data.profilePic}` :
              '../../../assets/user-avatar.svg'
          });
      });
    });
  }

  /**
   * get and format the appointment data for appointment table
   */
  getPracticeAppointments() {
    const tempArr = [];
    this.appointmentsData = [];
    this.vhdAdminService.getAppointmentsByPractice(this.selectedPracticeData && this.selectedPracticeData.id).subscribe((res: any) => {
      res.data.filter(app => {
        if (app.appointments) {
          app.appointments.filter(P => {
            const tableRow = {
              appointmentId: app.id,
              appointmentDate: moment(app.slot.startsAt).format('ll'),
              time: moment(app.slot.startsAt).format('hh:mm A'),
              duration: `${app.slot.duration} min`,
              practicerName: app.slot.practice.practiceName,
              practicerId: app.slot.practice.id,
              userId: app.userId,
              paid: `£ ${app.practiceAppointmentType.customerFee}`,
              status: app.status.statusName,
              vet: app.slot.user.firstName,
              petId: P.petId,
              completeData: app,
              imgUrl: app.profilePic ? `${environment.baseUri}storage/download/${app.profilePic}` :
                '../../../assets/user-avatar.svg'
            };
            tempArr.push(tableRow);
          });
        }
      });
      this.appointmentsData =  _.uniq(tempArr, (book) => {
        return book.appointmentId; 
      });
    });
  }
  PracticeApptTypes() {
    if(this.selectedPracticeData){
      let id = this.selectedPracticeData.id;
      this.appointmentTypeService.getApptTypeByPractice(id).subscribe((apptTypes: any) => {
        this.apptTypes = apptTypes.data;
        this.apptTypes.practiceId = this.selectedPracticeData.id;
      });
    }
  }
}
