import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiList } from './api-list';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockUserService {
  static updateUser() {
    throw new Error("Method not implemented.");
  }

  constructor(private http: HttpClient) { }
userDetails =[{
  "id": 5,
  "firstName": "Madhura",
  "lastName": "0",
  "email": "madhura.s@agkiya.cloud",
  "mobile": "+918722175085",
  "password": "",
  "profilePic": "PO_5.png",
  "isActive": true,
  "practiceId": null,
  "createdOn": "2019-12-24T00:00:00.000Z",
  "lastAccessOn": "2019-12-29T14:16:42.000Z"

}]  
 public id:any

      /**
     * service call to get user details
     * @param id user id
     */
    res:any
    public getUserList(id){
     let res = this.userDetails
      return res;
    }
    public updateUser(){
      let res = this.userDetails
       return res;
     }

  
    public uploadProfilePic(file, userId, role): Observable<any[]> {
      const formData: FormData = new FormData();
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'multipart/form-data');
      formData.append('file', file, file.name);
      return this.http.post(`${ApiList.PET_APIS.pictureUpload}/${role}/${userId}`, formData, {
          headers
      }).pipe(map((res: any) => res));
  }

    /**
     * API Call to update vhd admin information.
     * @param userObj update userdatails after changing their information.
     */
    public updateVhdUser(vhdObj): Observable<any[]> {
      // console.log(vhdObj)
      if (Object.keys(vhdObj).includes('id')) {
          return this.http.put(`${ApiList.USERS_APIS.user}`, vhdObj)
              .pipe(map((res: any) => res));
      }
    }



    /**
     * upload logic
     * @param file profile picture of pet
     * @param userId user id or PO id
     */
    public uploadVHDProfilePic(file, userId): Observable<any[]> {
      // console.log(file, userId);
      const formData: FormData = new FormData();
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'multipart/form-data');
      formData.append('file', file, file.name);
      return this.http.post(`${ApiList.PET_APIS.pictureUpload}/VHD/${userId}`, formData, {
          headers
      }).pipe(map((res: any) => res));
  }
}
