import { Component, OnInit, Input, OnChanges, HostListener, ElementRef, ChangeDetectorRef, ViewRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.page.html',
  styleUrls: ['./sidenavbar.page.scss'],
})
export class SidenavbarPage implements OnInit, OnChanges {
  routePaths: any = new Array<any>();
  toggle: boolean;
  userProfile: any = '';
  userName: any;
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

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.toggle = false;
    }
  }

  constructor(
    private router: Router,
    private auth: AuthService, private commonService: CommonService, private eRef: ElementRef,
    private cdnRef: ChangeDetectorRef) {
    this.userProfile = this.commonService.getStorage;
    if(this.userProfile){
      this.userName = this.userProfile.firstName;
    }
    
  }

  ngOnInit() {
    this.activeRouterHighLight();
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
        !(this.cdnRef as ViewRef).destroyed){
          this.cdnRef.detectChanges();
        }
    });
  }
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
    this.toggle = false;
    this.activeIndex = index;
    this.router.navigate([`/${navigation.path}`]);
  }

  logout() {
    this.auth.signOut();
  }
  navigateToProfile() {
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
