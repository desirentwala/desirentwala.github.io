import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/common/services/common.service';
import { SlotBase } from '../slot.base';
import { CalendarEvent } from 'angular-calendar';
import { NotificationService } from '../../common/services/notification.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss']
})
export class CalendarPage extends SlotBase implements OnInit, OnChanges {
  tempVet: any;
  close: any;
  // getting calendar events and calendar view
  @Output() slotsOut = new EventEmitter<any>();
  selectedVetData: any;
  @Input()
  public viewDate:any ='';
  public set calendarData(v: any[]) {
    this.calendarEvents = v;
    this.selectedSlot = false;
    this.selectedVetData = false;
  }
  public get calendarData(): any[] {
    return this.calendarEvents;
  }

  @Input()
  public set view(v: any) {
    this.viewMode = v;
  }
  public get view(): any {
    return this.viewMode;
  }

  @Input()
  public set vetList(v: any[]) {
    this.vetDetails = v;
  }
  public get vetList(): any[] {
    return this.vetDetails;
  }

  constructor(private commonService: CommonService,
              private activatedRoute: ActivatedRoute,
              private notifyService: NotificationService) {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.activatedRoute.url.subscribe((url) => {
      this.selectedSlot = false;
      this.selectedVetData = false;
    });
  }

  // destroy the all subsrciption at a time
  protected destroy(): void {
    this.removeSubscription(this.clearSubscription);
  }

  // calendar events edit slot
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.handleHoursEvent(event, 1);
  }

  // calendar event to create /edit slot
  handleHoursEvent(event: any, val = 0): void {
    if (event && event.confirmed) {
      this.notifyService.notification(`Confirmed slots can't be modified !`, 'danger');
    } else if (event && event.booked) {
      this.notifyService.notification(`Booked slots can't be modified !`, 'danger');
    } else if (event && event.isPrivate) {
      this.notifyService.notification(`Private slot can't be modified !`, 'danger');
    } else if(event) {
      if (!this.dateTimeDiff(event)) {
        this.sendSlot(event);
      } else {
        this.notifyService.notification(`Can't able to add slots for past date and time`, 'danger');
      }
    }
  }

  calendarEventChange(event): void {
  }

  // create slot using button
  createAppointment(): void {
    this.sendSlot(new Date().toString());
  }

  sendSlot(slot: string): void {
    this.selectedSlot = slot;
    this.commonService.vetSubject.next({data: this.tempVet});
    this.selectedVetData = false;
  }

  eventSlotData(ev: any): any {
    this.slotsOut.emit(ev);
  }
  editVet() {
    if (this.commonService.getVetFromStorage.value === 'Show all vet') {
      this.selectedVetData = false;
    } else {
      this.selectedVetData = this.commonService.getVetFromStorage;
      this.selectedSlot = false;
    }
  }
}
