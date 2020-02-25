import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-device-inputs',
  templateUrl: './device-inputs.page.html',
  styleUrls: ['./device-inputs.page.scss'],
})
export class DeviceInputsPage implements OnInit {

  constructor( public modalController: ModalController ) {
    this.medicaDeviceForm();
   }

   
  Microphone;
  Camera;
  Speaker;
  Speakers = "Speakers";
  @Input() microphones: [];
  @Input() camera: [];
  @Input() speakers: [];
  formData: any;

  ngOnInit() {
  }


  /** Media Form Intialize
   */
  medicaDeviceForm(){
    this.formData = new FormGroup({
      Microphone: new FormControl(''),
      Camera: new FormControl(''),
      Speaker: new FormControl(''),
    });
  }

  /** Device Inputs values from the form
   */
  deviceInputs() {
    const data = {
      Microphone: this.formData.value.Microphone,
      Camera: this.formData.value.Camera,
      Speaker: this.formData.value.Speaker
    };
    this.modalController.dismiss(data);

  }
  mediaDevices(): void {
  }

  cancel() {
    this.modalController.dismiss()
  }
}
