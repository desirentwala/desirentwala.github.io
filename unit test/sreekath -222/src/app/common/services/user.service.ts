import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiList } from './api-list';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TokenValidaterService } from './token-validater.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private authService: AuthService,
    private tokenValidatorService: TokenValidaterService,
    ) { }

  public getUsersByRole(role: any, pid: any): Observable<any> {
    let query: any;
    if (pid) {
      query = `&pid=${pid}`;
    }
    return this.http.get(`${ApiList.USERS_APIS.user}/by?r=${role}${query}`)
      .pipe(map((res: any) => res.data));
  }

      /**
     * service call to get user details
     * @param id user id
     */
    public getUserList(id: any): Observable<any[]> {
      return this.http.get<any>(`${ApiList.USERS_APIS.user}/${id}`)
          .pipe(map((res: any) => res));
    }

    /**
     * API Call to add pet information.
     * @param userObj update userdatails after changing their information.
     */
    public updateUser(userObj): Observable<any[]> {
      if (userObj.type === 'VET') {
        userObj.password = this.authService.encryptPassword(userObj.password, this.tokenValidatorService.secretToken()).toString();
      }
      if (Object.keys(userObj).includes('id')) {
          return this.http.put(`${ApiList.USERS_APIS.user}`, userObj)
              .pipe(map((res: any) => res));
      }
    }

    /**
     * upload logic
     * @param file profile picture of pet
     * @param userId user id or PO id
     */
    public uploadProfilePic(file, userId, role): Observable<any[]> {
      const formData: FormData = new FormData();
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'multipart/form-data');
      formData.append('file', file);
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
      vhdObj.type = 'VHD';
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

  /**
   * user name existence check
   * @param name - user name (unique)
   */
  public usernameAvailability(name: any): Observable<any> {
    return this.http.post(`${ApiList.USERS_APIS.user}/username/check`, { userName: name})
    .pipe(map((res: any) => res));
  }
}
