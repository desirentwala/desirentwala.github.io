import { Injectable } from '@angular/core';
import { Observable, ObservableLike } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiList } from '../api-list';
import { map } from 'rxjs/operators';
import { LinkType } from '../../models/magicLinks'
import { Params, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class MagicLinkService {
  _mlId: number;
  _linkData: any ='';
  LINK_INVALID_ERROR = 'Link has been used more than once or expired, please contact admin!';
  LINK_RETRIEVAL_ERROR = 'Failed to get Slot details, please retry';

  constructor(private http: HttpClient, private storage: Storage, private router: Router) { }

  // -------------------- Handle 
  initMagicLink(params: Params): boolean {
    if (params['r'] && params['n']) {
      this._mlId = + params['n'];
      return true;
    }
    return false;
  }

  public get linkTragetRoute(): string {
    let targetRoute;
    switch (this._linkData.linkType) {
      case LinkType.PRIVATE_SLOT:
        targetRoute = `/pets/appointments?ml=yes`;
        break;
      case LinkType.INVITE_VET:
        targetRoute = `/auth/register?role=VET`; break;
      case LinkType.INVITE_PA:
        targetRoute = `/auth/practiceregister`; break;
      case LinkType.INVITE_PO:
        targetRoute = `/auth/register?role=PO`; break;
      default: break;
    }
    return targetRoute;
  }

  // -------------------- 

  // -------------------- API Calls
  /**
   * create magic link
   */
  public createMagicLink(slotObj: any): Observable<any> {
    return this.http.post(`${ApiList.MAGICLINK_APIS.mls}`, slotObj)
      .pipe(map((res: any) => res));
  }

  /**
   * Get the details of magic link using embedded details like id and random hash
   */
  public verifyMagicLink(id: number, random: string): Observable<any> {
    return this.http.get(`${ApiList.MAGICLINK_APIS.mls}/${id}?r=${random}`)
      .pipe(map((res: any) => {
        let flag = false; // (res ? res.data.status : false);
        if (res.data) {
          this._linkData = res.data;
          flag = res.data.status;
          if (!flag) { // if magic link is not used or expired
            this.storage.set(this._linkData.linkType, this._linkData.data);
            if (!localStorage.getItem('accessToken') && !localStorage.getItem('result')) {
              if (this._linkData.linkType === 'BOOKING_PRIVATE_SLOT') {
                this.router.navigateByUrl('/auth');
              }
            }
          }
        }

        return flag;
      }));
  }

  checkforMaglinkId() {
    if (this._mlId && this._mlId > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Update the status of Magic Link after usage
   */
  public setStatusToUsed(): Observable<any> {
    if (this._mlId && this._mlId > 0) {
      this.storage.clear();
      return this.http.put(`${ApiList.MAGICLINK_APIS.mls}/${this._mlId}/flag`, {}).pipe(map((res: any) => { this._mlId = -1; return res; }));
    }
  }

  // -------------------- End of API Calls

}
