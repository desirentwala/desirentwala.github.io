import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common/services/common.service';
import { AuthService } from '../common/services/auth.service';
import { PopoverController, MenuController } from '@ionic/angular';
import { HomePopoverPage } from '../common/components/home-popover/home-popover.page';
import { Market } from '@ionic-native/market/ngx';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isMobile: boolean;
  constructor(
    private popoverCtrl: PopoverController,
    private menuCtrl: MenuController,
    private commonServcice: CommonService,
    private authService: AuthService,
    private market: Market,
    private router: Router,
    private platform: Platform,
    private storage: Storage
  ) {

    this.isMobile = false;
    if (this.platform.is('ios') || this.platform.is('android') && !this.platform.is('mobileweb')) {
      this.isMobile = true;
    }

    if (!localStorage.getItem('accessToken') && !localStorage.getItem('result')) {

      this.storage.forEach((value, key, index) => {
        switch (key) {
          case 'ONBOARD_PA': if (value !== null) {
            this.router.navigateByUrl('/auth/practiceregister');
          }
            break;
          case 'ONBOARD_PO': if (value !== null) {
            this.router.navigateByUrl('/auth/register');
          }
            break;
          case 'ONBOARD_VET': if (value !== null) {
            this.router.navigateByUrl('/auth/register');
          }
            break;
          case 'BOOKING_PRIVATE_SLOT': if (value !== null) {
            this.router.navigateByUrl('/auth');
          }
            break;
          default: this.authService.autoNavigate(this.commonServcice.getToken); break;
        }
      });
    } else if (localStorage.getItem('accessToken') && localStorage.getItem('result')) {
      // private solt and role - PO then navigate to pet appointment
      this.storage.get('BOOKING_PRIVATE_SLOT').then((val) => {
        if (val && this.commonServcice.getStorage['userroles.role.roleName'] === 'PO') {
          this.router.navigateByUrl('/pets/appointments?ml=yes');
        } else {
          this.router.navigateByUrl('/auth');
        }
      });
    } else {
      this.router.navigateByUrl('/');
    }
  }

  ionViewWillEnter() {

  }

  ngOnInit() {

  }
  /**
   * Get popover for signup by category
   * @param ev event
   */
  async settingsPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: HomePopoverPage,
      event: ev,
      showBackdrop: false,
      cssClass: 'custom-popover'
    });
    return await popover.present();
  }

  /**
   * Open home menu
   */
  openMenu() {
    this.menuCtrl.open();
  }

  /**
   * Closing home menu
   */
  eventFromPopover() {
    this.menuCtrl.close();
  }

  navigateRegister(roleName) {
    if (roleName === 'PA') {
      this.router.navigate(['auth/practiceregister'], { queryParams: { role: roleName } });
    } else if (roleName === 'auth') {
      this.router.navigate(['/auth']);
    } else {
      this.router.navigate(['auth/register'], { queryParams: { role: roleName } });
    }
    this.menuCtrl.close();
  }


  // 'APPLE' or 'GOOGLE'
  gotoMarket(target: string) {
    const storeUri = (target === 'APPLE' ?
      'https://apps.apple.com/us/app/whatsapp-messenger/id310633997'
      : 'https://play.google.com/apps/testing/com.agkiya.vethelpdirect');
    if (this.isMobile) {
      this.market.open(storeUri);
    } else {
      window.open(storeUri);
    }
  }
}
