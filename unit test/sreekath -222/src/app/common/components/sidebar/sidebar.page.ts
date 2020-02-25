import { Component, OnInit, Input, OnChanges, ChangeDetectorRef, ViewRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.page.html',
  styleUrls: ['./sidebar.page.scss']
})

export class SidebarPage implements OnInit, OnChanges {
  routePaths: any = new Array<any>();
  userProfile: any;
  userName: any;
  colorList: any = [];
  role: any;
  randomNum: number;
  @Input()
  public set routeList(v: any[]) {
    this.routePaths = v;
  }
  public get routeList(): any[] {
    return this.routePaths;
  }

  public status: boolean;
  activeIndex: number = null;

  constructor(
    private router: Router,
    private auth: AuthService,
    private commonService: CommonService,
    private cdnRef: ChangeDetectorRef
  ) {
    // this.updateColor(this.colorList[0], this.colorList[1]);
    this.userProfile = this.commonService.getStorage;
    if(this.userProfile){
      this.userName = this.userProfile.firstName;
      this.role = this.userProfile['userroles.role.roleName'];
    }
  }

  ngOnChanges() {

    this.commonService.picUpdate.subscribe(res => {
      this.randomNum = Math.random();
      if (res.data) {
        this.userProfile.profilePic = res.data;
      } else if (res.user) {
        this.userName = res.user.firstName;
      }
      if (this.cdnRef !== null && this.cdnRef !== undefined &&
        !(this.cdnRef as ViewRef).destroyed) {
        this.cdnRef.detectChanges();
      }
    });

  }

  ngOnInit() {
    this.activeRouterHighLight();

  }
  /**
   * update color for branding
   * @param colorprimary primary color
   * @param colorsecondary secondary color
   */
  // updateColor(colorprimary, colorsecondary) {
  //   document.documentElement.style.setProperty(`--ion-color-nav-primary`, colorprimary);
  //   document.documentElement.style.setProperty(`--ion-color-secondary-shade`, colorsecondary);
  // }
  // default router active status as nav url
  activeRouterHighLight(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects.includes('/pets/view')) {
          this.activeIndex = 2;
        } else {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < this.routeList.length; index++) {
            if (event.urlAfterRedirects.includes(this.routeList[index].path)) {
              this.activeIndex = index;
              break;
            }
          }
        }
      }
    });
  }

  // active status and n=router navigation
  selecteByRoute(navigation, index) {
    this.activeIndex = index;
    if(navigation){
      this.router.navigate([`/${navigation.path}`]);
    }
  }

  logout() {
    this.auth.signOut();
  }
  navigateToProfile() {
    // console.log(this.userProfile['userroles.role.roleName']);
    if (this.userProfile && this.userProfile['userroles.role.roleName']) {
      switch (this.userProfile['userroles.role.roleName']) {
        case 'PA': this.selecteByRoute({ path: 'practiceadmin/profile' }, this.routeList.length + 1); break;
        case 'PO': this.selecteByRoute({ path: 'pets/profile' }, this.routeList.length + 1); break;
        case 'VET': this.selecteByRoute({ path: 'vetpractice/profile' }, this.routeList.length + 1); break;
        case 'VHDA': this.selecteByRoute({ path: 'vhdadmin/profile' }, this.routeList.length + 1); break;
      }
    }
  }
  /**
   * basepath for download
   */
  get basePath(): string {
    return environment.baseUri;
  }
}
