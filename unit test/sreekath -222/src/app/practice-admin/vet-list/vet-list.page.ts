import { Component, OnInit, ChangeDetectorRef, OnChanges, ViewRef } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import { CommonService } from 'src/app/common/services/common.service';
import { SchedulingService } from 'src/app/scheduling-management/service/scheduling.service';
import * as moment from 'moment';
import { SlotBase } from 'src/app/scheduling-management/slot.base';
import { ActivatedRoute } from '@angular/router';

const colors: any = {
  unconfirmed: {
    primary: '#d3d3d3',
    secondary: '#d3d3d3'
  },
  confirmed: {
    primary: 'rgba(78, 180, 0, 0.5)',
    secondary: 'rgba(78, 180, 0, 0.5)'
  },
  booked: {
    primary: 'rgba(0, 131, 180, 0.25)',
    secondary: 'rgba(0, 131, 180, 0.25)'
  }
};

@Component({
  selector: 'app-vet-list',
  templateUrl: './vet-list.page.html',
  styleUrls: ['./vet-list.page.scss'],
})

export class VetListPage extends SlotBase implements OnInit, OnChanges {
  // default variables
  vetList: any = new Array<any>();
  user: any;
  isVetData: boolean;
  isNew: boolean;
  isCalender = true;
  currentUser = this.commonService.getStorage;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private commonService: CommonService,
    private cdnRef: ChangeDetectorRef,
    private schedulingService: SchedulingService) {
    super();
  }

  ngOnInit() {
    this.init();
    this.commonService.vetUpdateObservable.subscribe(res => {
      this.getVetListByPractice();
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.nav === 'vet') {
        this.addNewCustomer();
      }
    });
  }

  /**
   * To reflect added vet into current vet list
   */
  ngOnChanges() {
    if (this.cdnRef !== null && this.cdnRef !== undefined &&
      !(this.cdnRef as ViewRef).destroyed) {
      this.init();
      this.cdnRef.detectChanges();
    }
  }

  // destroy the all subsrciption at a time
  protected destroy(): void {
    this.removeSubscription(this.clearSubscription);
  }

  /**
   * initialize the vetlist,
   * calendar mode (Month, Week, Day),
   * by vetId, practiceId - getAll vets
   */
  init(): void {
    this.selectedCustomer('Show all vet');
    this.getVetListByPractice();
  }

  // get vet list by practice - id(number) and role(string) - VET
  getVetListByPractice(): void {
    this.isVetData = true;
    this.userService.getUsersByRole('VET', this.currentUser && this.currentUser.practiceId).subscribe(res => {
      this.vetList = res;
    });
  }

  /**
   * @param vet - selected vet (user)
   * assign vet to user,
   * practiceId - using subject,
   * calling the vet practice using week start date
   */
  selectedCustomer(vet: any): void {
    this.isNew = false;
    this.isCalender = true;
    if (vet === 'Show all vet') {
      this.user = '';
      localStorage.setItem('vet', JSON.stringify({ value: vet }));
      this.callByPractice();
    } else {
      this.user = vet;
      localStorage.setItem('vet', JSON.stringify(vet));
      this.callByVetAndPractice();
    }
  }

  /**
   * get the slot details by vet and practice - id
   * wkStartDate - start date of week
   */
  callByVetAndPractice(): void {
    if (this.user) {
      const wkStartDate = this.schedulingService.dateConversion(moment().startOf('week').toDate());
      this.setSubscription = this.schedulingService.getVetWeeklySlots(this.user.id, this.user && this.user.practiceId, wkStartDate).subscribe(res => {
        if (res) {
          res.map(S => {
            S.start = moment(S.startsAt).toDate();
            S.end = moment(S.startsAt).add(S.duration, 'm').toDate();
            if (S.isPrivate) {
              S.title = '*';
            }
            if (S.confirmed) {
              S.color = colors.confirmed;
            } else if (S.booked) {
              S.color = colors.booked;
            } else {
              S.color = colors.unconfirmed;
            }
          });
          this.calendarData = res;
        }
      });
      this.clearSubscription.push(this.setSubscription);
    }
  }

  /**
   * get the slot details by practice - id,
   * wkStartDate - start date of week
   */
  callByPractice(): void {
    const wkStartDate = this.schedulingService.dateConversion(moment().startOf('week').toDate());
    this.setSubscription = this.schedulingService.getPracticeWeeklySlots(this.currentUser && this.currentUser.practiceId, wkStartDate).subscribe(res => {
      if (res) {
        res.map(S => {
          S.start = moment(S.startsAt).toDate();
          S.end = moment(S.startsAt).add(S.duration, 'm').toDate();
          if (S.isPrivate) {
            S.title = '*';
          }
          if (S.confirmed) {
            S.color = colors.confirmed;
          } else if (S.booked) {
            S.color = colors.booked;
          } else {
            S.color = colors.unconfirmed;
          }
        });
        this.calendarData = res;
      }
    });
    this.clearSubscription.push(this.setSubscription);
  }


  /**
   * switch calender component to add new vet component
   */
  addNewCustomer() {
    this.isNew = true;
    this.isCalender = false;
  }

  onAddNewVet() {
    // this.isNew = false;
    // this.isCalender = true;
    this.getVetListByPractice();
  }

  /**
   * @param ev - emitted output data listbar,
   * ev - vet data,
   * calling the vet practice and practce basis on user exists
   */
  slotsIn(ev: any): void {
    if (this.user) {
      this.callByVetAndPractice();
    } else {
      this.callByPractice();
    }
  }

}
