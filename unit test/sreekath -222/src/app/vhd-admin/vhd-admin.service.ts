import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiList } from '../common/services/api-list';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VhdAdminService {

  constructor(private http: HttpClient) { }

  getAllPractices(): Observable<any> {
    return this.http.get(`${ApiList.PRACTICES_APIS.practice}`)
      .pipe(map((res: any) => res));
  }

  /**
   * API Call to get pet owners by practice id
   * @param id practiceId
   */
  public getAppointmentsByPractice(id): Observable<any> {
    return this.http.get<any>(`${ApiList.APPOINTMENT_APIS.appointment}/${ApiList.PRACTICEADMIN_APIS.practice}/${id}`)
      .pipe(map((res: any) => res));
  }

  /**
   * getting all species
   */
  public getSpecies(): Observable<any[]> {
    return this.http.get<any>(`${ApiList.SPECIES_APIS.species}`)
      .pipe(map((res: any) => res));
  }

  /**
   * Adding new practice
   * @param newData practice data from practice
   */
  public addNewPractice(newData): Observable<any> {
    // console.log('service', newData);
    return this.http.post(`${ApiList.PRACTICEADMIN_APIS.practice}`, newData)
      .pipe(map((res: any) => res));
  }
  /**
   * @param file profile picture of practicer
   * @param id practice id
   */
  public uploadVetPic(file, id): Observable<any[]> {
    const formData: FormData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    formData.append('file', file, file.name);
    return this.http.post(`${ApiList.PET_APIS.pictureUpload}/PA/${id}`, formData, {
      headers
    }).pipe(map((res: any) => res));
  }

  /**
   * invite new practicer
   * @param data invite magic link data
   */
  public invitePractic(data): Observable<any> {
    return this.http.post(`${ApiList.MAGICLINK_APIS.mls}`, data)
      .pipe(map((res: any) => res));
  }

  /**
   * API Call to get pet customers by practice id
   * @param id practiceId
   */
  public getCustomersByPractice(id): Observable<any> {
    return this.http.get<any>(`${ApiList.USERS_APIS.user}/${ApiList.PRACTICEADMIN_APIS.practice}/${id}/po`)
      .pipe(map((res: any) => res));
  }

  /**
   * API Call to get practicer details by practice id
   * @param id practiceId
   */
  public getPracticeDetailsById(id): Observable<any> {
    return this.http.get<any>(`${ApiList.PRACTICEADMIN_APIS.practice}/${id}`)
      .pipe(map((res: any) => res));
  }

  /**
   * listing all vets by practice id
   * @param role practicer role
   * @param id practice id
   */
  public getVetsByPractice(id: any): Observable<any[]> {
    return this.http.get(`${ApiList.USERS_APIS.user}/${id}/vets`)
      .pipe(map((res: any) => res.data));
  }

  /**
 * practice existing check in both practice and user table
 * for email and mobile
 * @param practice - info
 */
  public practiceCheck(practice): Observable<any> {
    return this.http.post(`${ApiList.PRACTICEADMIN_APIS.practice}/check`, practice)
      .pipe(map((res: any) => res));
  }
  /**
   * Get selected vet details.
   * @param petId selected vet id
   */
  public deleteVet(vetId): Observable<any> {
    return this.http.delete<any>(`${ApiList.USERS_APIS.user}/${vetId}`)
      .pipe(map((res: any) => res));
  }

  /**
   * upcoming slots for vet
   * @param vId vetId
   * @param pId petId
   */
  public getAppointmentsByVet(vId, pId): Observable<any[]> {
    return this.http.get<any>(`${ApiList.SCHEDULING_APIS.slots}/vet/${vId}/practice/${pId}`)
      .pipe(map((res: any) => res));
  }
}
