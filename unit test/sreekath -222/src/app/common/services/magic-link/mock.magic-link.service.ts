import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Storage } from '@ionic/Storage';

@Injectable({
  providedIn: 'root'
})
export class MockMagicLinkService {
  constructor(private http: HttpClient,private storage: Storage) { }

 
  public get linkTragetRoute(): string {
    let targetRoute;
    return targetRoute;
  }
  public createMagicLink(slotObj: any){}
  public verifyMagicLink(id: number, random: string){}

}
