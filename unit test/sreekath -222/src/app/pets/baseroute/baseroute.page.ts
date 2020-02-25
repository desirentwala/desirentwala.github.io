import { Component, OnInit } from '@angular/core';
import { petsNavigationList } from '../../common/components/sidebar/titles';
import { CommonService  } from '../../common/services/common.service';
@Component({
  selector: 'app-baseroute',
  templateUrl: './baseroute.page.html',
  styleUrls: ['./baseroute.page.scss'],
})
export class BaseroutePage implements OnInit {
  navigationList: any = new Array<any>();
  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.navigationInitialize();
  }

  navigationInitialize(): void {
    this.navigationList = petsNavigationList;
    this.commonService.routesSubject.next({routeList: this.navigationList});
  }

}
