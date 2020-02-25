import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ApiList } from '../common/services/api-list';
import { map } from 'rxjs/operators';
import { mockData } from '../pets/mockdata';
import { Bookings } from '../pets/mockbookings';

@Injectable({
    providedIn: 'root'
})
export class MockPetService {
    mockData = new mockData();
    Bookings = new Bookings();
    userId:any
    data:any
    bookingData:any;

    constructor(private http: HttpClient) { }
   
    /**
     * sample data calling from moCkDATA for pets list
     */
     public getPetList(){
      let data = this.mockData.data;
      return  data;
    }
    public getSlotsForPet(){
        let data = this.mockData.data;
        return  data;
      }
    
    /**
     */
    practiceId = 5;
    date = '2015-01-01';
    public getAllPractices(practiceId, date){
        let data = this.mockData.data;
        return data;
    }
    /**
     * sample Data Calling From +++++
     */
    public getPetById(){
        return  
      }
     /**
     * Sample Data calling from moCkBookings for Allthe pets
     */
    public getAllBookingsByUser() {
        let bookingData = this.Bookings.bookings;
        return bookingData;
    }
     /**
     * Sample Data calling from moCkBookings Based on ID
     */
    public getAppointmentsByPet() {
        let bookingData = this.Bookings.bookings;
        return bookingData;
     
    }
    

}
