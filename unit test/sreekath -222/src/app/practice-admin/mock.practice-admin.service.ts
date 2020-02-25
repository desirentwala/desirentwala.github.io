import { Injectable } from "@angular/core";
import { Observable, ObservedValueOf } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ApiList } from "../common/services/api-list";
import { map } from "rxjs/operators";
import { mockPracticeData } from './mockpractice';

@Injectable({
  providedIn: "root"
})
export class MockPracticeAdminService {

  public getPaProfileData() {
    let Appointments = this.mockPracticeData.data;
     return Appointments
   }
 
  mockPracticeData = new mockPracticeData()
  practiceData:any
  constructor(private http: HttpClient) {}

  /**
   * API Call to get practicer slots.From MOCK JSON
   * @param practiceId practicer id mapped with the pet.
   */
  public getPracticeSlots() {
    let practiceData = this.mockPracticeData.data;
    return practiceData
  }
  public updateUser(userObj): Observable<any[]> {
        return this.http.put(`${ApiList.PRACTICEADMIN_APIS.practice}`, userObj).pipe(map((res: any) => res));
}
  /**
   * getting all species
   */
  public getSpecies(): Observable<any[]> {
    return this.http
      .get<any>(`${ApiList.SPECIES_APIS.species}`)
      .pipe(map((res: any) => res));
  }

  /**
   * API Call to get pet owners by practice id
   * @param id practiceId
   */
  public getCustomersByPractice(id): Observable<any> {
    return this.http
      .get<any>(
        `${ApiList.USERS_APIS.user}/${ApiList.PRACTICEADMIN_APIS.practice}/${id}/po`
      )
      .pipe(map((res: any) => res));
  }

 
  /**
   * name
   *  @param newVetdata new vet data
   */
  public addNewVet(newVetdata): Observable<any> {
    return this.http
      .post(`${ApiList.USERS_APIS.user}/vet`, newVetdata)
      .pipe(map((res: any) => res));
  }

  public inviteCustomer(vet): Observable<any> {
    return this.http
      .post(`${ApiList.MAGICLINK_APIS.mls}`, vet)
      .pipe(map((res: any) => res));
  }
  /**
   * upload logic
   * @param file profile picture of vet
   * @param id  vet id
   */
  public uploadProfilePic(file, id, role): Observable<any[]> {
    const formData: FormData = new FormData();
    const headers = new HttpHeaders();
    headers.set("Content-Type", "multipart/form-data");
    formData.append("file", file, file.name);
    return this.http
      .post(`${ApiList.PET_APIS.pictureUpload}/${role}/${id}`, formData, {
        headers
      })
      .pipe(map((res: any) => res));
  }
  /**
   * Add practice
   * @param newData practice data from practice
   */
  public practiceRegistration(practice): Observable<any> {
    return this.http
      .post(`${ApiList.PRACTICEADMIN_APIS.practice}`, practice)
      .pipe(map((res: any) => res));
  }

  /**
   * Service call to get appointment type of practice
   * @param practice id
   */
  public getAppointmentTypes(practiceId): Observable<any> {
    return this.http
      .get(`${ApiList.PRACTICES_APIS.practice}/apptype/${practiceId}`)
      .pipe(map((res: any) => res.data));
  }

 

 

  /**
   * API Call to get private slot details for Mock.
   * @param slotId - private slot id received over magic link for mock.
   */
  public magicData = [
        {"slotId":49,
        "SlotNumber":12,
        "vet":"Chetan KV"
        }]
  public magiclinkdata :any
  public getPrivateSlotInfo(slotId: number) {
    this.magicData = this.magiclinkdata;
    return this.magicData

  }
}
