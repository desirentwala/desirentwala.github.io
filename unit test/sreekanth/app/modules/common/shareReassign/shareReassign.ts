import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, NgModule, Output, ViewChild, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from 'angular-2-local-storage';
import { ConfigService } from '../../../core/services/config.service';
import { SharedModule } from '../../../core/shared/shared.module';
import { SharedService } from '../../../core/shared/shared.service';
import { UiButtonModule } from '../../../core/ui-components/button';
import { UiCheckboxModule } from '../../../core/ui-components/checkbox';
import { UiDropdownModule } from '../../../core/ui-components/dropdown';
import { LabelModule } from '../../../core/ui-components/label/label.component';
import { Logger } from '../../../core/ui-components/logger';
import { UiMiscModule } from '../../../core/ui-components/misc-element/misc.component';
import { ModalModule } from '../../../core/ui-components/modal';
import { UiTextBoxModule } from '../../../core/ui-components/textbox';
import { PickList } from '../models/picklist.model';
import { FavoriteService } from '../services/favorite.service';
import { EventService } from '../../../core/services/event.service';
import { ShareReassignFormValidator } from './shareReassign.validator';
import { ShareReassignService } from './services/shareReassign.service';
@Component({
  selector: 'share-reassign',
  templateUrl: './shareReassign.html',
  providers: [LocalStorageService, FavoriteService]
})
export class ShareReassignComponent implements OnInit {
  @Input() shareReassignFormGroup: FormGroup;
  @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() public doRefreshList: EventEmitter<any> = new EventEmitter<any>();
  subOrdinateUserList = new Array();
  usersUserGroupList = new Array();
  subOrdinateUserPickList = new PickList();
  parentUserPickList = new PickList();
  ugUsersPickList = new PickList();
  config: ConfigService;
  shareReassignService: ShareReassignService
  sharedByDropDownList = [];
  suShareOption;
  modalTitle;
  userID: string;
  errors = [];
  isError = false;
  successModal = false;
  successMessage = '';
  modalKey = true;
  changeSub: any;
  eventHandler: EventService;
  shareReassignFormValidator;
  sharedUsersListData = [];
  param1 : string = "";

  @ViewChild("shareReassingModal") shareReassingModal;

  constructor(public _config: ConfigService, shared: SharedService,private changeRef: ChangeDetectorRef,
    _shareReassignService: ShareReassignService,public _logger: Logger, public _eventHandler: EventService
  ) {
    this.config = _config;
    this.shareReassignService = _shareReassignService
    this.getSubordinateUserList();
    let suOption = { code: 'SU', desc: 'SubOrdinate User' };
    this.sharedByDropDownList.push(suOption);
    let ugOption = { code: 'UG', desc: 'User Group' };
    this.sharedByDropDownList.push(ugOption);
    this.eventHandler = _eventHandler;
    if (this.shareReassignFormGroup === undefined) {
      this.shareReassignFormGroup = this.shareReassignService.getShareReassingInfoModel();
      let type = this.shareReassignFormGroup.controls['type'].value;
      let permissions = this.shareReassignFormGroup.controls['permissions'].value;
      if (type && type === 'SH') {
        this.modalTitle = 'NCPLabel.shareTxn'
        if (!(permissions.suShareOption === false && permissions.ugShareOption === false)) {
          if (permissions.suShareOption) {
            this.param1 = 'SU'
          } else if (permissions.ugShareOption) {
            this.param1 = 'UG'
          }
        }
      } else if (type && type === 'RA')
        this.modalTitle = 'NCPLabel.reassign'
      if (!(permissions.suReAssignOption === false  && permissions.ugReAssignOption === false) ) {
        if (permissions.suReAssignOption) {
          this.param1 = 'SU'
        } else if (permissions.ugReAssignOption) {
          this.param1 = 'UG'
        }
      }
      this.userID = this.config.getCustom('user_id');
      this.shareReassignFormValidator = new ShareReassignFormValidator();
    }
  }

  ngOnInit(){
    this.doInitChangeSub();
    this.shareReassignFormValidator.setShareReassignFormValidator(this.shareReassignFormGroup);
  }

  getSubordinateUserList() {
    if (!(this.subOrdinateUserList.length > 0)) {
      this.subOrdinateUserPickList.auxType = 'ChildUsers';
      this.subOrdinateUserPickList.param1 = String(this.config.getCustom('user_id'));
      let subordinateUserListResponse = this.shareReassignService.getAuxData(this.subOrdinateUserPickList);
      subordinateUserListResponse.subscribe((subordinateUserListData) => {
        if (!subordinateUserListData['error'] && subordinateUserListData instanceof Array) {
          for (let i = 0; i < subordinateUserListData.length; i++) {
            this.subOrdinateUserList.push(subordinateUserListData[i].code);
          }
        }
      });
    }
  }

  reAssignTxn() {
    this.errors = [];
    let reAssignTxnResponse = this.shareReassignService.reAssignTxn(this.shareReassignFormGroup.value);
    reAssignTxnResponse.subscribe((reAssignTxnResponseData) => {
      if (reAssignTxnResponseData) {
        if (reAssignTxnResponseData['error'] && reAssignTxnResponseData['error'].length >= 1) {
          this.isError = true;
          this.errors.push({ 'errCode': reAssignTxnResponseData.error[0].errCode, 'errDesc': reAssignTxnResponseData.error[0].errDesc });
          this._logger.error('reAssignTxn() ===>' + reAssignTxnResponseData.error);
          this.config.setLoadingSub('no');
          window.scrollTo(150, 150);
          this.changeRef.markForCheck();
        } else {
          this.modalKey = false;
          this.successModal = true;
          this.config.setLoadingSub('no');
          this.changeRef.markForCheck();
        }
      }
    });
  }

  shareTxn() {
    let shareTxnResponse = this.shareReassignService.shareTxn(this.shareReassignFormGroup.value);
    shareTxnResponse.subscribe((shareTxnResponseData) => {
      if(shareTxnResponseData){
        if (shareTxnResponseData['error'] && shareTxnResponseData['error'].length >= 1) {
          this.isError = true;
          this.errors.push({ 'errCode': shareTxnResponseData.error[0].errCode, 'errDesc': shareTxnResponseData.error[0].errDesc });
          this._logger.error('shareTxn() ===>' + shareTxnResponseData.error);
          this.config.setLoadingSub('no');
          window.scrollTo(150, 150);
          this.changeRef.markForCheck();
        }else{
          this.modalKey = false;
          this.successModal = true;
          this.config.setLoadingSub('no');
          this.changeRef.markForCheck();
        }
      }
      this.config.loadingSub.next('no');
    });
  }

  reset() {
    let leadId = this.shareReassignFormGroup.get('txnId').value;
    let type = this.shareReassignFormGroup.get('type').value;
    let txnType = this.shareReassignFormGroup.get('txnType').value;
    this.shareReassignFormGroup.reset();
    this.shareReassignFormGroup.get('txnId').patchValue(leadId);
    this.shareReassignFormGroup.get('type').patchValue(type);
    this.shareReassignFormGroup.get('txnType').patchValue(txnType);
  }

  doActionProcess(event) {
    this.doClick.emit(event);
  }

  doRefreshListProcess(event) {
    this.doRefreshList.emit(event);
  }

  public doInitChangeSub() {
    this.changeSub = this.eventHandler.changeSub.subscribe((data) => {
      if (data.id === 'shareGroupChangeId') {
        this.shareReassignFormGroup.controls['userId'].patchValue('');
        this.shareReassignFormGroup.controls['userId'].updateValueAndValidity();
        this.shareReassignFormGroup.controls['userIdDesc'].patchValue('');
        this.shareReassignFormGroup.controls['userIdDesc'].updateValueAndValidity();
        this.shareReassignFormGroup.controls['userGroupCode'].patchValue('');
        this.shareReassignFormGroup.controls['userGroupCode'].updateValueAndValidity();
        this.shareReassignFormGroup.controls['userGroupDesc'].patchValue('');
        this.shareReassignFormGroup.controls['userGroupDesc'].updateValueAndValidity();
        this.shareReassignFormValidator.setValidatorForGroup(this.shareReassignFormGroup);
        if (this.shareReassignFormGroup.controls['type'].value === 'SH' && data.value === 'SU') {
          let sharedUsersListResponse = this.shareReassignService.getSharedUsersList(this.shareReassignFormGroup.value);
          sharedUsersListResponse.subscribe((sharedUsersListData) => {
            if (!sharedUsersListData['error'] && sharedUsersListData instanceof Array) {
              this.sharedUsersListData = sharedUsersListData; 
              this.shareReassignFormGroup.controls['userId'].patchValue(sharedUsersListData);
              this.shareReassignFormGroup.controls['userId'].updateValueAndValidity();
            }
          });
        }
      }else if (data.id === 'userGroupChangeId' && data.value){
        if (this.shareReassignFormGroup.controls['type'].value === 'SH') {
          let sharedUsersListResponse = this.shareReassignService.getSharedUsersList(this.shareReassignFormGroup.value);
          sharedUsersListResponse.subscribe((sharedUsersListData) => {
            if (!sharedUsersListData['error'] && sharedUsersListData instanceof Array) {
              this.shareReassignFormGroup.controls['userId'].patchValue(sharedUsersListData);
              this.shareReassignFormGroup.controls['userId'].updateValueAndValidity();
            }
          });
        }
      }
    });
  }
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule, SharedModule, 
    UiMiscModule, ModalModule, LabelModule, 
    UiTextBoxModule, UiDropdownModule, 
    UiButtonModule, UiCheckboxModule],
  exports: [ShareReassignComponent],
  declarations: [ShareReassignComponent],
  providers: [ShareReassignService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShareReassignModule { }
