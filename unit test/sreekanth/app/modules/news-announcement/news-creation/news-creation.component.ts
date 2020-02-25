import { SharedService } from '../../../core/shared/shared.service';
import { ConfigService } from './../../../core/services/config.service';
import { UtilsService } from './../../../core/ui-components/utils/utils.service';
import { BreadCrumbService } from './../../common/breadCrumb/services/breadcrumb.service';
import { NewsModel } from './../models/news.model';
import { NewsValidator } from './../news-form/new.validators';
import { NewsService } from './../services/news.service';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
@Component({
  selector: 'news-creation',
  templateUrl: './news-creation.component.html',
  providers: [NewsValidator],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class NewsCreationComponent implements OnInit {
  newsFormGroup: FormGroup;
  newsCreationFormModel;
  loaderConfig;
  inputJson;
  errmsg: boolean = false;
  setAddButtonFlag: boolean = false;
  mandatoryErrorFlag: boolean = false;
  @ViewChild('newsAddedModelWindow') newsAddedModelWindow;
  @ViewChild('newsAddedModelWindowError') newsAddedModelWindowError;
  NCPDatePickerNormalOptions = {
    todayBtnTxt: 'Today',
    firstDayOfWeek: 'mo',
    alignSelectorRight: true,
    indicateInvalidDate: true,
    showDateFormatPlaceholder: true
  };
  constructor(public translate: TranslateService, public utilsService: UtilsService, _breadCrumbService: BreadCrumbService, _newsCreationForm: FormBuilder, public newsValidator: NewsValidator, public newsService: NewsService, _loaderConfigService: ConfigService, shared: SharedService
    , public changeRef: ChangeDetectorRef) {
    _breadCrumbService.addRouteName('/ncp/news/newsCreation', [{ 'name': 'Create News' }]);
    let newCreationForm = new NewsModel(_newsCreationForm);
    this.newsCreationFormModel = newCreationForm;
    this.loaderConfig = _loaderConfigService;
  }

  ngOnInit() {
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
        this.translate.use(this.loaderConfig.currentLangName);
      }
    });
    this.newsFormGroup = this.newsService.getNewsCreationModel();
    this.newsFormGroup.enable();
    this.newsFormGroup.reset();
    this.newsFormGroup = this.newsValidator.setNewsValidator(this.newsFormGroup);
    this.newsFormGroup.get('creationDate').setValue(this.utilsService.getTodayDate());




  }

  addNewNews() {
    this.mandatoryErrorFlag = !this.newsFormGroup.valid;
    if (!this.newsFormGroup.valid) {
      this.changeRef.markForCheck();
    }

    else {
      this.newsFormGroup.get('isArticleImpo').setValue(false);
      let newsCreation = this.newsService.createNews(this.newsFormGroup.value);
      newsCreation.subscribe(
        (dataVal) => {
          let getCreateNewsResponse = dataVal;
          this.loaderConfig.setLoadingSub('no');
        });
      this.newsFormGroup.reset();
      this.newsAddedModelWindow.open();
    }
  }
  closeAndNavigate() {
    this.newsAddedModelWindow.close();
    this.loaderConfig.navigateRouterLink('ncp/news/newsManagement');

  }

}
