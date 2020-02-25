import { Component, OnInit } from '@angular/core';
import { practiceNavigationList } from '../../common/components/sidebar/titles';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-base-route',
  templateUrl: './base-route.page.html',
  styleUrls: ['./base-route.page.scss'],
})
export class BaseRoutePage implements OnInit {
  navigationList: any = new Array<any>();

  constructor(private commonService: CommonService) {
    this.navigationInitialize();
  }

  ngOnInit() {
  }

  navigationInitialize(): void {
    this.navigationList = practiceNavigationList;
    this.commonService.routesSubject.next({routeList: this.navigationList});
  }

}
