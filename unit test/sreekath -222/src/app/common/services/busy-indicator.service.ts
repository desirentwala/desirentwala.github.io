import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusyIndicatorService {
  private busy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private status: boolean;
  constructor() { }

  public getStatus(): Observable<boolean> {
    return this.busy.asObservable();
  }

  public setStatus(status: boolean) {
    this.status = status;
    this.busy.next(status);
  }
}
