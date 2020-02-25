import { Subscription, Subject } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import * as _ from 'underscore';
import { differenceInMinutes } from 'date-fns';

import { CalendarView } from 'angular-calendar';
import * as moment from 'moment';

export abstract class SlotBase implements OnInit, OnDestroy {
    // default variable list and config for calendar
    calendarData: any = new Array<any>();
    calendarViewMode: any;
    calendarEvents: any = new Array<any>();
    viewMode: any;
    viewDate: Date = new Date();
    refresh: Subject<any> = new Subject();
    vetDetails: any = new Array<any>();
    appointmentTypes: any = new Array<any>();
    customerDetails: any = new Array<any>();
    selectedSlot: any;
    modalData: any;
    value: any = '';
    slotTime: any;
    model: any = {};
    timeslots: any = new Array<any>();
    isPublicChecked: boolean;
    isPrivateChecked: boolean;
    clickedDate: any;
    activeDayIsOpen = true;

    // exclude weekends
    excludeDays: number[] = [0, 7];
    CalendarView = CalendarView;
    day = {
        start: 9,
        end: 20
    };

    // array of subscribers
    clearSubscription: Array<Subscription> = [];
    setSubscription: any;
    weekDays: any = new Array<any>();

    constructor() {
        this.calendarViewMode = CalendarView.Week;
        this.timeslots = [10,15, 20, 25, 30, 35, 40, 45, 50, 55];
        this.weekDays = [{ id: 1, value: 'MON'}, { id: 2, value: 'TUE'}, { id: 3, value: 'WED'},
        { id: 4, value: 'THU'}, { id: 5, value: 'FRI'}, { id: 6, value: 'SAT'}];
    }

    ngOnInit(): void { }

    ngOnDestroy(): void {
        this.destroy();
    }

    protected abstract destroy(): void;

    // remove the list of subscription
    protected removeSubscription(subscription: Array<Subscription>): void {
        for (const subs of subscription) {
            subs.unsubscribe();
        }
    }

    dateTimeDiff(event): boolean {
        let b;
        if (event.startsAt) {
            b = event.startsAt;
        } else {
            b = event;
        }
        const dtSlotTime: any = new Date(b);
        const dtNow: any = new Date();
        return (differenceInMinutes(dtNow, dtSlotTime) <= 0) ? false : true;
    }
    
    slotTimeCompare(event): boolean {
        if (this.model.time >= '09:00' && this.model.time <= '21:00') {
            return true;
        }
        return false;
    }
}
