import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Slot } from '../slot.model';
import { SchedulingService } from '../service/scheduling.service';
import { CommonService } from '../../common/services/common.service';
import * as moment from 'moment';
import { MagicLinkService } from '../../common/services/magic-link/magic-link.service';
import { SlotBase } from '../slot.base';
import { PracticeAdminService } from '../../practice-admin/practice-admin.service';
import { NotificationService } from 'src/app/common/services/notification.service';
@Component({
  selector: 'app-slot',
  templateUrl: './slot.page.html',
  styleUrls: ['./slot.page.scss'],
})

export class SlotPage extends SlotBase implements OnInit {
  vet: any;
  slotModel: Slot = new Slot();
  today: string;

  // output emmitter for slots to calendar
  @Output() slotsDataEmit = new EventEmitter<any>();
  isInvalid: boolean;


  /**
   * input emmitter for slot, vetList, practiceId
   */
  @Input()
  public set slot(v: any) {
    // v date format - 'Thu Dec 12 2019 02:30:00 GMT+0530 (India Standard Time)'
    if (v) {
      this.value = 'show';
      if (v.firstName) { // vet exist
        this.model = {
          id: v.slotId, userId: v.id, vetId: v.id, vetName: v.firstName, isPrivate: v.isPrivate, booked: v.booked,
          confirmed: v.confirmed, practiceId: v.practiceId, duration: v.duration
        };
        this.model.date = moment(v.startsAt.toString()).format('YYYY-MM-DD');
        this.model.time = moment(v.startsAt.toString()).format('HH:mm');
        if (v.isPrivate) {
          this.isStatus(false, true);
        } else {
          this.isStatus(true, false);
        }
      } else {
        const t = JSON.parse(localStorage.getItem('vet'));
        // t.value = Show all vet
        if (t.value) {
          this.model = {
            ...this.model,
            date: moment(v.toString()).format('YYYY-MM-DD'),
            time: moment(v.toString()).format('HH:mm'),
            practiceId: this.commonService.getStorage.practiceId,
            isPrivate: false
          };
          this.isStatus(true, false);
        } else { // vet selection
          this.model = {
            ...this.model, userId: +t.id, vetId: +t.id,
            date: moment(v.toString()).format('YYYY-MM-DD'),
            time: moment(v.toString()).format('HH:mm'),
            practiceId: t.practiceId,
            isPrivate: false
          };
          this.isStatus(true, false);
        }
      }
      this.slotTime = v;
      this.getAppointmentTypes();
      this.getCustomerDetails();
    } else {
      this.value = '!show';
    }
  }

  public get slot(): any {
    return this.slotTime;
  }

  @Input()
  public set vetList(v: any[]) {
    this.value = 'show';
    const newArr = v.sort((a, b) => {
      const nameA = a.firstName.toLowerCase();
      const nameB = b.firstName.toLowerCase();
      if (nameA < nameB) { return -1; } else if (nameA > nameB) { return 1; }
      return 0;
    });
    this.vetDetails = newArr;
  }
  public get vetList(): any[] {
    return this.vetDetails;
  }

  constructor(
    private schedulingService: SchedulingService,
    private commonService: CommonService,
    private practiceAdminService: PracticeAdminService,
    private mlService: MagicLinkService,
    private notifyService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    // this.today = moment().add(1, 'day').format('YYYY-MM-DD');
    this.today = moment().format('YYYY-MM-DD');
  }

  // destroy the all subsrciption at a time
  protected destroy(): void {
    this.removeSubscription(this.clearSubscription);
  }

  /**
   * isPrivate - true / false
   * @param value (string) - private / public
   */
  isPrivate(value: any): void {
    if (value === 'private') {
      this.model.isPrivate = true;
      this.isStatus(false, true);
      this.getAppointmentTypes();
    } else {
      this.model.isPrivate = false;
      this.isStatus(true, false);
    }
  }

  // asssign vetname
  vetSelection(id: any): void {
    if(id){
      this.model.vetName = this.vetDetails.filter(V => V.id === +id)['0'].firstName;
      this.model.vetId = +id;
    }
  }

  emailSelect(email): void {
    this.model.email = email;
  }

  // create slot for the vet
  createSlot(): void {
    const t = `${this.model.date} ${this.model.time}`;
    if (this.slotTimeCompare(this.model.time)) {
      // slot start date conversion
      const T = moment(t);
      if (!this.dateTimeDiff(T)) {
        const sModel = this.model;
        sModel.vetName = this.vetDetails.filter(V => V.id === +this.model.vetId)['0'].firstName;
        this.slotModel = {
          userId: +this.model.vetId,
          practiceId: this.model.practiceId,
          startsAt: T,
          duration: +this.model.duration.toString().trim().split('mins')[0],
          isPrivate: this.model.isPrivate,
          practiceAppointmentTypeId: (this.model.practiceAppointmentTypeId) ? this.model.practiceAppointmentTypeId : 1,
          appointmentType: this.appointmentTypes.filter(A => A.id === +this.model.practiceAppointmentTypeId)[0].appointmentType
        };
        this.setSubscription = this.schedulingService.createSlotScheduling(this.slotModel, this.model).subscribe(res => {
          // isPrivate slot chk for magic link generation, isPrivate - true / false
          if (this.slotModel.isPrivate) {
            res = {
              ...res, mlFor: 'PRIVATE_SLOT', appointmentType: this.slotModel.appointmentType,
              vetName: sModel.vetName, email: sModel.email.toLowerCase()
            };
            this.mlService.createMagicLink(res).subscribe(resp => {
              if (resp.status === 201) {
                this.notifyService.notification('Private slot created, and mail has been sent!', 'success');
              }
            });
          }
          this.slotsDataEmit.emit(res);
        });
        this.model = {};
        this.clearSubscription.push(this.setSubscription);
      } else {
        this.model = {};
        this.notifyService.notification(`Can't able to add / edit slots for past date and time`, 'danger');
      }
    } else {
      this.model = {};
      this.notifyService.notification(`Slot scheduling is only for 9AM to 9PM`, 'danger');
    }
  }

  close(): void {
    this.model = {};
    this.isStatus(false, false);
  }

  isStatus(isPublic: boolean, isPrivate: boolean): void {
    this.isPrivateChecked = isPrivate;
    this.isPublicChecked = isPublic;
  }

  // get appointment types by practice id
  getAppointmentTypes() {
    this.practiceAdminService.getAppointmentTypes(this.commonService.getStorage && this.commonService.getStorage.practiceId).subscribe((res: any) => {
      this.appointmentTypes = res;
      this.model.practiceAppointmentTypeId = res[0].id;
    });
  }

  // get customer details by practice id
  getCustomerDetails() {
    this.practiceAdminService.getCustomersByPractice(this.commonService.getStorage && this.commonService.getStorage.practiceId).subscribe(res => {
      this.customerDetails = res.data;
    });
  }

  /**
   * validating selecting data
   * @param date selected date
   */
  dateValidation(date) {
    if (moment(date) >= moment(this.today)) {
      this.isInvalid = false;
    } else {
      this.isInvalid = true;
    }
  }
}
