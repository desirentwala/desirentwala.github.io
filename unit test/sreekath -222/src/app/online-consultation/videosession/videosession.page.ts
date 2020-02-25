import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OnlineconsultationService } from '../onlineconsultation.service';
import { Platform, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../common/services/notification.service';
import { DeviceInputsPage } from '../device-inputs/device-inputs.page';
import { AlertController } from '@ionic/angular';
import { LocationStrategy } from '@angular/common';

declare var OT: any;
@Component({
  selector: 'app-videosession',
  templateUrl: './videosession.page.html',
  styleUrls: ['./videosession.page.scss'],
})
export class VideosessionPage implements OnInit {

  @ViewChild('subscriberDiv', { static: true }) subscriberDiv: ElementRef;
  public devWidth = this.platform.width();
  session: any;
  publisher: any;
  streams = [];
  sessionID: any;
  changeDetectorRef: ChangeDetectorRef;
  publisherOptions: any;
  mediaDevices: any;
  audioInput = [] = [];
  audioOutput = [] = [];
  videoInput = [] = [];
  selectedAudioInput = [] = [];
  selectedAudioOutput = { 'deviceId': '' };
  selectedVideoInput = { 'deviceId': '' };
  selectedOutput = [] = [];
  subscriber;
  mic = 'mic';
  serverSession: any;
  deviceSettings: any;
  showsetting:boolean = false;

  constructor(public platform: Platform, private ref: ChangeDetectorRef,
    private ocs: OnlineconsultationService, private Nfs: NotificationService,
    public modalController: ModalController, private location: LocationStrategy,
    public alertController: AlertController) {
    this.changeDetectorRef = ref;
    if (this.platform.is('ios') || this.platform.is('android') || this.platform.is('mobileweb')) {
      this.showsetting  = false;
    } else {
      // this.getMediaDevices();
      this.showsetting = true;
    }
    this.preventBack();
  }
  // preventing back button in browser
  public preventBack() {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
  }

  /** Intializaing the Video Session for the Appointment
   */
  initSession() {
      this.ocs.getSession()
      this.session = this.ocs.getSession();
      if(this.session){
        this.session.on({
          // Stream Creation for the Session
          streamCreated: (event: any) => {
            this.subscriber = this.session.subscribe(event.stream, 'subscriber', {insertMode: 'append'});
            // OT.updateViews();
          },
          // Reconnection for the Session
          sessionReconnecting: (event: any) => {
            this.Nfs.notification('Disconnected from the session. Attempting to reconnect...', 'danger');
            // OT.updateViews();
          },
          // Session Destory
          streamDestroyed: (event: any) => {
            // OT.updateViews();
          },
          // Send Signal of From One user to Another
          signal: (event: any) => {
            if (event.from == this.session.connection) {
              var fromStr = 'from you'
            } else {
              fromStr = 'from another client'
            }
            var timeStamp = new Date().toLocaleString()
            timeStamp = timeStamp.substring(timeStamp.indexOf(',') + 2);
            // this.Nfs.notification('User Left the session');
          },
          // Session Connection Establish
          sessionConnected: this.publishSession ,
          sessionDisconnected: (event: any) => {
            this.Nfs.notification('Disconnected from the session.', 'danger');
          }
        });
      }
      this.startSession();
  }

  ngOnInit() {
        if (this.platform.is('ios') || this.platform.is('android') || this.platform.is('mobileweb')) {
          this.showsetting  = false;
    } else {
      // this.getMediaDevices();
      this.showsetting  = true;
    }
        this.initSession();
    
  }
  /**
   * @param  {any} event  Publisher Session Starting
   */
  publishSession = (event: any) => {
    this.publisher = OT.initPublisher('publisher');
    // this.session.publish(this.publisher, this.deviceSettings);
    this.session.publish(this.publisher);
  }

  /** Subscriber Session Starting
   */
  startSession = () => {
    if(this.session){
      this.session.connect(this.ocs.getToken(), (error: any) => {
        if (error) {
          this.Nfs.notification(`The Vedio Session was Not Able to Connect Because of ${error}`, ' danger');
        }
      });
    }
  };

  /** Initailize the Setting of the Audio and Video for the Session
   * @param  {any} audioOut 
   * @param  {any} videoIn
   * @param  {any} audioIn
   */
  setSettings(audioOut: any, videoIn: any, audioIn: any) {
    this.deviceSettings = {
      resolution: '1280 × 720',
      audioSource: audioOut.deviceId,
      videoSource: videoIn.deviceId
    }
  }

  /** Confirm Model for the close of the model 
   */
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: '<strong>Do you really want to close the video</strong>?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.ocs.endSession();
          }
        }
      ]
    });

    await alert.present();
  }

  /** Mic Mute / Unmute of the Publisher
   */
  micControl() {
    if (this.mic === 'mic') {
      this.mic = 'mic-off';
      this.publisher['publishAudio'](false);
    } else if (this.mic === 'mic-off') {
      this.mic = 'mic';
      this.publisher['publishAudio'](true);
    }
  }


  /** Get The List of Media Device Attached to Device
   */
  getMediaDevices() {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        const sorted = { kind: '' };
        for (let i = 0, max = devices.length; i < max; i++) {
          if (sorted && sorted[devices[i].kind] === undefined) {
            sorted[devices[i].kind] = [];
          }
          sorted[devices[i].kind].push(devices[i]);
        }
        this.audioInput = sorted['audioinput'];
        this.audioOutput = sorted['audiooutput'];
        this.videoInput = sorted["videoinput"];

        this.setSettings(this.audioInput[0], this.videoInput[0], this.audioOutput[0]);
      });
  }

  /** Model For Media Devices List
   */
  async presentModal() {
    const modal = await this.modalController.create({
      component: DeviceInputsPage,
      componentProps: {
        microphones: this.audioInput,
        camera: this.videoInput,
        speakers: this.audioOutput
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.selectedOutput.push(data['data']); // Here's your selected user!
        if(this.selectedOutput[0].speakers && this.selectedOutput[0].camera != undefined){
          this.setSettings(this.selectedOutput[0].speakers, this.selectedOutput[0].camera, null);
          if (this.subscriber && this.session) {
          this.session.unpublish(); // force connection disconnection to recreate with new settings
          this.publishSession(null);
        }
        }
      });
    return await modal.present();
  }

  /** Ending of The Current Session
   */
  endSession() {
    this.presentAlertConfirm();
  }

}
