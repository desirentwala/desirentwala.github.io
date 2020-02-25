import { Component, OnInit, ChangeDetectorRef, OnChanges, ViewRef } from '@angular/core';
import { VhdAdminService } from '../vhd-admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/common/services/common.service';

@Component({
  selector: 'app-practice-list',
  templateUrl: './practice-list.component.html',
  styleUrls: ['./practice-list.component.scss'],
})
export class PracticeListComponent implements OnInit, OnChanges {
  isPractice: boolean;
  isPracticeList: boolean;
  isNew = true;
  practiceList = [];
  selectedPracticeData: any;

  constructor(
    private vhdService: VhdAdminService,
    private router: Router,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private cdnRef: ChangeDetectorRef
      ) {
        this.selectedPracticeData = false;
   }

  ngOnInit() {
    this.getAllPractices();
    this.commonService.vhdPAUpdateObservable.subscribe((res) => {
      this.getAllPractices();
    });
   }

   ngOnChanges() {
    if (this.cdnRef !== null && this.cdnRef !== undefined &&
      !(this.cdnRef as ViewRef).destroyed) {
      this.getAllPractices();
      this.cdnRef.detectChanges();
    }
  }
  /**
   * retrive all practicers
   */
  getAllPractices() {
    this.isPracticeList = true;
    this.vhdService.getAllPractices().subscribe((res) => {
      this.practiceList = res.data;
      res.data.map((data) => {
        data.firstName =  data.practiceName;
        data.mobile = data.phoneNo;
        data.profilePic = data.logo;
        data.prefix = data.prefix;
      });
    });
  }

  /**
   * switch to add new practicer component
   */
  addNewPractice() {
    this.isNew = true;
    this.isPractice = false;
  }

/**
 * switch to practicerData component
 * @param data contains selected practicer data
 */
  selectedPractice(data) {
    if (data !== 'See All Vets') {
      this.isNew = false;
      this.isPractice = true;
      this.selectedPracticeData = data;
      this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: {id: data.id  }});
    } else {
      this.selectedPracticeData = false;
    }
  }
}
