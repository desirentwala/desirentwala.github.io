import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mockData } from '../vet-practice/mock.vetdata';
import { mockprofileData } from '../vet-practice/mock.vetprofiledata';


@Injectable({
  providedIn: 'root'
})
export class MockVetPracticeService {
  mockData = new mockData()
  mockprofileData = new mockprofileData()
  vetbookings:any

  constructor(private http: HttpClient) { }

  public getVetBookings() {
    let vetbookings = this.mockData.data
    return vetbookings
  }
  public getVetDetails() {
    let vetProfiledata = this.mockprofileData.data
    return vetProfiledata
  }
 
}
