import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(public loadingController: LoadingController) { }

  /**
   * creates the spinner
   */
  async show() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: null,
      translucent: true,
      cssClass: 'custom-loading'
    });
    return await loading.present();
  }

  /**
   * Dismiss's the spinner
   */
  async hide() {
    return await this.loadingController.dismiss();
  }
}