import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiList } from '../common/services/api-list';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VetPracticeService {

  constructor(private http: HttpClient) { }

  public getVetBookings(userId): Observable<any> {
    return this.http.get(`${ApiList.APPOINTMENT_APIS.appointment}/vet/${userId}`)
      .pipe(map((res: any) => res));
  }
  public getVetDetails(vetId): Observable<any> {
    return this.http.get(`${ApiList.USERS_APIS.user}/vet/${vetId}`)
      .pipe(map((res: any) => res));
  }
  // upload profile picture for vet
  public uploadProfilePic(file, vetId, role): Observable<any[]> {
    const formData: FormData = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    formData.append('file', file, file.name);
    return this.http.post(`${ApiList.PET_APIS.pictureUpload}/${role}/${vetId}`, formData, {
      headers
    }).pipe(map((res: any) => res));
  }
  public updateVetProfile(vetObj): Observable<any[]> {
    return this.http.put(`${ApiList.USERS_APIS.user}/vet`, vetObj)
      .pipe(map((res: any) => res));
  }

   /**
    * getting all species
    */
    public getSpecies(): Observable<any[]> {
      return this.http.get<any>(`${ApiList.SPECIES_APIS.species}`)
          .pipe(map((res: any) => res));
  }
}
