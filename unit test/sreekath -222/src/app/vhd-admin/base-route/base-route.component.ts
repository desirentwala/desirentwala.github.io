import { Component, OnInit } from '@angular/core';
import { vhdAdminNavigationList } from '../../common/components/sidebar/titles';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-base-route',
  templateUrl: './base-route.component.html',
  styleUrls: ['./base-route.component.scss'],
})
export class BaseRoutePage implements OnInit {
  navigationList: any = new Array<any>();

  constructor(private commonService: CommonService) {
    this.navigationInitialize();
  }

  ngOnInit() {
  }

  navigationInitialize(): void {
    this.navigationList = vhdAdminNavigationList;
    this.commonService.routesSubject.next({routeList: this.navigationList});
  }

}
