import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { OnlineconsultationService } from '../onlineconsultation.service';
// import * as OT from '@opentok/client';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import NetworkTest, { ErrorNames } from 'opentok-network-test-js';
import { NotificationService } from '../../common/services/notification.service';
import { LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { LocationStrategy } from '@angular/common';
import { CommonService } from 'src/app/common/services/common.service';

declare var OT: any;
@Component({
  selector: 'app-videosession-landing',
  templateUrl: './videosession-landing.page.html',
  styleUrls: ['./videosession-landing.page.scss'],
  providers: [AndroidPermissions]
})
export class VideosessionLandingPage implements OnInit {
  @ViewChild('subscriberDiv', { static: true }) subscriberDiv: ElementRef;
  public devWidth = this.platform.width();
  public audiotext: string;
  session: any;
  streams: Array<OT.Stream> = [];
  changeDetectorRef: ChangeDetectorRef;
  PracticeName: any;
  serverSession: any;
  otNetworkTest: any;
  subscriberPic: any;

  constructor(
    private androidPermissions: AndroidPermissions, public platform: Platform, private router: Router,
    private ocs: OnlineconsultationService, private ref: ChangeDetectorRef,
    public alertController: AlertController, private Nfs: NotificationService,
    public loadingController: LoadingController, private location: LocationStrategy,
    private commonService: CommonService) {
    this.changeDetectorRef = ref;
    this.audioText();
    this.hardwareTesting();
    this.checkAndroidPermissions();
    // preventing back button in browser
    this.preventBack();
  }
  // preventing back button in browser
  public preventBack() {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
  }
  public checkAndroidPermissions() {
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA]);
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.RECORD_AUDIO]);
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => console.log('Has permission?', result.hasPermission),
      err => {
        console.log('Camer permission check err: ', err);
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
      }
    );
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
      result => console.log('Has permission?', result.hasPermission),
      err => {
        console.log('Mic permission check err: ', err);
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO);
      }
    );
  }

  public audioText() {
    if (this.devWidth < 480) {
      this.audiotext = "Use Internet for Audio";
    } else {
      this.audiotext = "Use Computer for Audio";
    }
  }

  async presentLoading() {
    return await this.loadingController.create({
      message: 'Hardware Testing In progress',
    });
  }



  async hardwareTesting() {
    const loading = await this.presentLoading();
    loading.present().then(() => {
      this.ocs.sessionDetails().subscribe(async (session) => {
        this.serverSession = session;
        this.ocs.setSession(this.serverSession); // Set the session for the 
        this.otNetworkTest = new NetworkTest(OT, {
          apiKey: session.APIKEY, // Add the API key for your OpenTok project here.
          sessionId: session.data.sessionId, // Add a test session ID for that project
          token: session.data.token // Add a token for that session here
        });
        if (this.platform.is('ios') || this.platform.is('android') || this.platform.is('mobileweb')) {
          loading.dismiss();
        } else {
          // this.otNetworkTest.testConnectivity().then((results) => {
          // this.otNetworkTest.testQuality(function updateCallback(stats) {
          // }).then((result) => {
          // console.log("result",result)
          loading.dismiss();
          // }).catch((error) => {
          // this.Nfs.notification('OpenTok quality test error' + error);
          // });
          // });
        }

      });

    });
  }

  async showSettings() {

  }

  ngOnInit() {
    const data = this.ocs.getBookingDetails();
    if(data){
      this.PracticeName = data.Vetname;
      if (!data.subscriberPic) {
        this.subscriberPic = '../../../assets/user-avatar.svg';
      } else {
        this.subscriberPic = `${environment.baseUri}storage/download/${data.subscriberPic} `;
      }
    }
  }
  mic() {
    alert('mic');
  }
  videocam() {
    alert('videocam');
  }
  public startSession() {
    this.router.navigateByUrl('/online-consultation/videosession');
  }
  cancelVideoCall() {
    if (this.commonService.getStorage && this.commonService.getStorage['userroles.role.roleName'] === 'PO') {
      this.router.navigateByUrl('/pets/dashboard');
    }else if(this.commonService.getStorage && this.commonService.getStorage['userroles.role.roleName'] === 'VET'){
      this.router.navigateByUrl('/vetpractice/dashboard');
    }
  }
}
