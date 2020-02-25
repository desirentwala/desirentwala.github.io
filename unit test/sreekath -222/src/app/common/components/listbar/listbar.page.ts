import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as _ from 'underscore';
@Component({
  selector: 'app-listbar',
  templateUrl: './listbar.page.html',
  styleUrls: ['./listbar.page.scss'],
})
export class ListbarPage implements OnInit, OnChanges {

  appointments = [];
  userList: Array<any>;
  searchValue: string;
  activeIndex: any;
  activeAll: any;

  @Input() header;
  @Input() data;
  @Input() flag;
  @Output() selectedData = new EventEmitter<any>();
  @Output() addNewMember = new EventEmitter<any>();
  selData: any;
  constructor(
  ) { this.activeAll = true; }
  ionViewWillEnter() {
    this.searchValue = '';
  }
  ngOnInit() {
    this.searchValue = '';
  }
  ngOnChanges() {
    this.activeAll = true;
    if (this.data && this.data.length > 0) {
      this.userList = this.data;
      this.userList.forEach((data) => {
        if (data.profilePic) {
          data.imgUrl = `${environment.baseUri}storage/download/${data.profilePic} `;
        } else if (!data.profilePic || data.profilePic === '') {
          data.nameShortForm = data.firstName.charAt(0).toUpperCase();
        }
      });
    }
  }

  /**
   *  filter the data based on search value
   * @param val contains search value to filter
   */
  search(val) {
    const value = val.toLowerCase();
    this.userList = [];
    if(this.data){
      this.data.map((data) => {
        if (data.firstName.toLowerCase().indexOf(value) !== -1 || value === '') {
          this.userList.push(data);
        }
      });
    }
  }

  /**
   * displays all data
   */
  showAll() {
    this.activeIndex = '';
    this.searchValue = '';
    this.search('');
    this.activeAll = true;
    this.selectedData.emit('Show all vet');
  }

  /**
   * method to emit selected data
   * @param data selected data
   */
  selected(data, index) {
    this.selData = data;
    this.activeIndex = index;
    this.activeAll = false;
    this.selectedData.emit(data);
  }

  /**
   * add new
   */
  addNew() {
    this.addNewMember.emit(true);
  }
}
