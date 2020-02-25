import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { TableService } from '../../services/table.actions.service';
import * as moment from 'moment';

@Component({
  selector: 'app-late-join',
  templateUrl: './late-join.page.html',
  styleUrls: ['./late-join.page.scss'],
})
export class LateJoinPage implements OnInit {
  message: string;
  value: any;
  delay: any;
  delayList: any = [];
  datafromPopover: any;
  constructor(private commonService: CommonService, private tableService: TableService) {
    this.commonService.lateObservable.subscribe(res => {
      this.value = res.value;
      this.datafromPopover = res.data.completeData;
    });
    this.delayList = ['5', '10', '15', '20', '30', '40', '50', '60'];
  }

  ngOnInit() {
  }
  joinLate() {
    if(this.datafromPopover){
      const lateObj = {
        id: this.datafromPopover.id,
        startsAt: moment(new Date(this.datafromPopover.slot.startsAt)).format('MMM D, YYYY| h:mm A'),
        userId: this.datafromPopover.user.id,
        duration: this.delay,
        message: this.message,
        vetName: this.datafromPopover.slot.user.firstName,
        practiceName: this.datafromPopover.slot.practice.practiceName,
        practiceEmail: this.datafromPopover.slot.practice.email,
        petName: this.datafromPopover.appointments[0].pet.petName,
        bookingId: this.datafromPopover.id,
      };
      this.tableService.lateJoin(lateObj).subscribe((joined: any) => {
        this.value = false;
      });
    }
  }
}
