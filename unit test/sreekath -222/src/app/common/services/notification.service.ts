import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  isMobile: boolean;

  constructor(public toastController: ToastController) {
    // is mobile check
    if (navigator.userAgent.match(/Android/i)
      // || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  /**
   * @param value notification message
   */
  async notification(value, colorTheme) {
    let toastPos;
    if (this.isMobile) {
      toastPos = 'bottom';
    } else {
      toastPos = 'top';
    }
    const toast = await this.toastController.create({
      message: value,
      duration: 3000,
      position: toastPos,
      cssClass: 'toast-scheme',
      color: colorTheme.trim(),
      mode: 'ios',
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          handler: () => {
            this.toastController.dismiss();
          }
        }
      ]
    });
    toast.present();
  }
}
