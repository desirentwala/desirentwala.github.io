import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiList } from '../../common/services/api-list';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {

  constructor(private http: HttpClient) { }

  /**
   * create slot scheduling for vet
   */
  public createSlotScheduling(slotObj: any, model: any): Observable<any> {
    if (model.id) {
      slotObj = { ...slotObj, id: model.id, isPrivate: model.isPrivate,
        booked: model.booked, confirmed: model.confirmed };
      return this.http.put(`${ApiList.SCHEDULING_APIS.slots}/vet`, slotObj)
      .pipe(map((res: any) => res.data));
    } else {
      return this.http.post(`${ApiList.SCHEDULING_APIS.slots}/vet`, slotObj)
      .pipe(map((res: any) => res.data));
    }
  }

  /**
   * get VetsWeeklySlots
   * @param vetId - number user id
   * @param practiceId - number user id
   * @param week - start date
   */
  public getVetWeeklySlots(vetId: any, practiceId: any, week: any) {
    const url = `${ApiList.SCHEDULING_APIS.slots}/vet/${vetId}/practice/${practiceId}/week?start=${week}`;
    return this.http.get(url).pipe(map((res: any) => res.data));
  }

  public getPracticeWeeklySlots(practiceId: any, week: any) {
    const url = `${ApiList.SCHEDULING_APIS.slots}/practice/${practiceId}/week?start=${week}`;
    return this.http.get(url).pipe(map((res: any) => res.data));
  }

  /**
   * @param d - is date
   * return the week start date
   */
  public getWeekStartDate(d): any {
    d = new Date(d);
    const day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  /**
   * converting date format - yyyy-mm-dd
   * @param v (date string) - 'Thu Dec 12 2019 02:30:00 GMT+0530 (India Standard Time)'
   */
  public dateConversion(v): any {
    const dateSplit = v.toString().split('GMT')[0].trim();
    const convertedDate = new Date(dateSplit);
    let cDate: any;
    if (convertedDate.getDate() <= 9) {
      cDate = '0' + +convertedDate.getDate();
    } else {
      cDate = convertedDate.getDate();
    }
    return convertedDate.getFullYear() + '-' + (convertedDate.getMonth() + 1) + '-' + cDate;
  }

  /**
   * setting up an attributes for slotsList
   * @param slotsList - arrays
   * attributes - start, end, title, color
   */
  public setSlotsAttributes(slotsList: any[]): any {
    return slotsList.map(S => {
      S.start = moment(S.startsAt).toDate();
      S.end = moment(S.startsAt).add(S.duration, 'm').toDate();
      S.title = S.firstName;
      S.color = colors.red;
    });
  }

}
