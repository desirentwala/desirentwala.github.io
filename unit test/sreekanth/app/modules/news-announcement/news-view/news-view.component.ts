import { ConfigService } from './../../../core/services/config.service';
import { BreadCrumbService } from './../../common/breadCrumb/services/breadcrumb.service';
import { NewsService } from './../services/news.service';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
@Component({
  selector: 'news-view',
  templateUrl: './news-view.component.html',

})
export class NewsViewComponent implements OnInit, AfterContentInit {
  newsViewFormGroup: FormGroup;
  newViewFormModel;

  loaderConfig;
  constructor(public translate: TranslateService,_breadCrumbService: BreadCrumbService, public newsService: NewsService, _loaderConfigService: ConfigService) {
    _breadCrumbService.addRouteName('/ncp/news/newsView', [{ 'name': 'News Management' }]);
    this.loaderConfig = _loaderConfigService;
  }

  ngOnInit() {
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
          this.translate.use(this.loaderConfig.currentLangName);
      }
  });

  }

  ngAfterContentInit() {
    this.newsViewFormGroup = this.newsService.getNewsCreationModel();
    this.newsViewFormGroup.disable();

  }

  navigateBack() {
    this.loaderConfig.navigateRouterLink('ncp/news/newsManagement');
    this.newsViewFormGroup.enable();
  }
}
