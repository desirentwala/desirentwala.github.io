import { ConfigService } from '../../../../core/services/config.service';
import { SharedModule } from '../../../../core/shared/shared.module';
import { SharedService } from '../../../../core/shared/shared.service';
import { UtilsService } from '../../../../core/ui-components/utils/utils.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UiButtonModule } from '../../../../core/ui-components/button/index';


/**
 * This class represents the navigation bar component.
 */
@Component({


  selector: 'ncp-search',
  templateUrl: './search.html'
})
export class Search implements OnInit {
  type: string = '';
  selected: string = '';
  typeList: Object = {
    policy: 'NCPTab.policy',
    quote: 'NCPTab.quote',
    claim: 'NCPLabel.claims',
    customer: 'NCPLabel.customer'
  };
  filterString: FormControl = new FormControl();
  placeHolder: string = 'NCPBtn.search';
  translated: boolean = false;
  constructor(
    public config: ConfigService,
    public utils: UtilsService,
    public ref: ChangeDetectorRef,
    shared: SharedService) {

  }

  ngOnInit() {

    this.config.loggerSub.subscribe((data) => {
      if (data === 'langLoaded' && !this.translated) {
        this.type = this.typeList['quote'];
        this.selected = 'quote';
        this.translated = true;
      }
    });

    if (!this.translated) {
      let temp = this.typeList;
      if (this.utils.getTranslated(temp['policy'])) {
        this.type = this.typeList['quote'];
        this.selected = 'quote';
        this.translated = true;
      }
    }



  }

  setType(type) {
    this.type = this.typeList[type];
    this.selected = type;
    this.ref.markForCheck();
  }

  searchFilterString() {
    if (this.filterString.value && this.filterString.value.toString().length > 2) {
      this.filterString.setValue(this.filterString.value.trim());
      let obj = {
        isSEOSearchFlag: true,
        filterString: this.filterString.value,
        isPolicyOrQuote: 'QT'
      };
      if (this.selected === 'quote') {
        obj['isPolicyOrQuote'] = 'QT';
        this.config.setfilterModel(obj);
        this.config.navigateRouterLink('/ncp/activity');
        this.ref.markForCheck();
      } else if (this.selected === 'policy') {
        obj['isPolicyOrQuote'] = 'PO';
        this.config.setfilterModel(obj);
        this.config.navigateRouterLink('/ncp/activity');
        this.ref.markForCheck();
      }
      else if (this.selected === 'claim') {
        obj['isPolicyOrQuote'] = 'CL';
        this.config.setfilterModel(obj);
        this.config.navigateRouterLink('/ncp/activity');
        this.ref.markForCheck();
      } else if (this.selected === 'customer') {

      } else if (this.selected === 'customer') {

      }
      //else if(this.selected === 'claim'){

      // } 
      this.filterString.setValue('');
      this.placeHolder = 'NCPLabel.entersearchValue';
    } else {
      if (this.filterString.value) {
        this.placeHolder = 'NCPLabel.enteratleast3chars';
        this.filterString.setValue('');
      } else {
        this.placeHolder = 'NCPLabel.entersearchValue';
      }
    }
  }




}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule, UiButtonModule],
  declarations: [Search],
  exports: [Search]
})
export class SearchModule { }
