import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/common/services/common.service';
import { VetPracticeService } from '../vet-practice.service';
import { SchedulingService } from 'src/app/scheduling-management/service/scheduling.service';

@Component({
  selector: 'app-vet-dashboard',
  templateUrl: './vet-dashboard.page.html',
  styleUrls: ['./vet-dashboard.page.scss'],
})
export class VetDashboardPage implements OnInit {
  appointments = [];
  interval: any;
  isAppointments: boolean;
  constructor(private commonService: CommonService, private vetPracticeService: VetPracticeService,
              private schedulingservice: SchedulingService) { }


  ionViewWillEnter() {
    this.ngOnInit();
  }



  ngOnDestroy(): void {
   clearInterval(this.interval);
  }

  ngOnInit() {
    const resultObj = JSON.parse(localStorage.getItem('result'));
    if(resultObj){
      const role = resultObj['userroles.role.roleName'];
      this.getAppointments();
      this.interval = setInterval(() => {
          if(role === 'VET'){
          this.getAppointments();
          }
        },  90 * 10000 );
    }
  }
  ionViewDidLeave() {
    clearInterval(this.interval);
  }
  getAppointments() {
    if (this.commonService.getStorage) {
      const TempArray = [];
      const result = JSON.parse(localStorage.getItem('result'));
      this.vetPracticeService.getVetBookings(result.id).subscribe((res: any) => {
        res.data.forEach(Appoitment => {
          const tableRow = {
            id: Appoitment.id,
            appointmentDate: this.schedulingservice.dateConversion(Appoitment.slot.startsAt),
            time: Appoitment.apptOn,
            slot: Appoitment.slot.startsAt,
            practicerName: Appoitment.user.firstName,
            paid: `£ ${Appoitment.practiceAppointmentType.customerFee}`,
            practicerId: Appoitment.slot.user.id,
            userId: Appoitment.userId,
            status: Appoitment.status.statusName,
            duration: Appoitment.slot.duration,
            completeData: Appoitment,
            petDetails: Appoitment.appointments[0].pet
          };
          TempArray.push(tableRow);
        });
        this.appointments = TempArray;
        this.isAppointments = true;
      });
    }
  }
}
