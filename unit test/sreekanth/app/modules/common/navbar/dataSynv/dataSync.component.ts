import { ConfigService } from '../../../../core/services/config.service';
import { SharedModule } from '../../../../core/shared/shared.module';
import { SharedService } from '../../../../core/shared/shared.service';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UiButtonModule } from '../../../../core/ui-components/button/index';
import { Tooltip, TooltipModule } from '../../../../core/ui-components/tooltip';

@Component({
  selector: 'ncp-dataSync',
  templateUrl: './dataSync.html'
})
export class dataSync implements OnInit {
  syncFlag: boolean = false;
  enableDataSync: boolean = false;
  constructor(
    public config: ConfigService,
    public utils: UtilsService,
    public ref: ChangeDetectorRef,
    shared: SharedService) {
  }

  ngOnInit() {
    if (this.config._config['enableDataSync']) {
      this.enableDataSync = this.config._config['enableDataSync'];
    }
  }

  dataSync() {
    let inputJSON = { 'module': '' };
    this.syncFlag = true;
    let dataSyncResult = this.utils.doDataSync(inputJSON);
    dataSyncResult.subscribe(
      (response) => {
        if (response.error !== null && response.error !== undefined && response.error.length >= 1) {
          this.syncFlag = false;
        } else {
          this.syncFlag = false;
        }
      },
      (error) => {
      }
    );
  }

}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TooltipModule, SharedModule, UiButtonModule],
  declarations: [dataSync],
  exports: [dataSync]
})
export class DataSyncModule { }
