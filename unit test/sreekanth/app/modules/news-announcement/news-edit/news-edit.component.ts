import { SharedService } from '../../../core/shared/shared.service';
import { ConfigService } from './../../../core/services/config.service';
import { BreadCrumbService } from './../../common/breadCrumb/services/breadcrumb.service';
import { NewsService } from './../services/news.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
@Component({
  selector: 'news-edit',
  templateUrl: './news-edit.component.html'
})
export class NewsEditComponent implements OnInit {
 newsViewFormGroup:FormGroup;
  newViewFormModel;
   loaderConfig;
   @ViewChild('newsUpdatedModel') newsUpdatedModel;
  constructor(public translate: TranslateService,_breadCrumbService: BreadCrumbService, public newsService: NewsService, _loaderConfigService: ConfigService,shared : SharedService) {
_breadCrumbService.addRouteName('/ncp/news/newsEdit', [{'name':'News Edit'}]);
this.loaderConfig = _loaderConfigService;
   
    this.newsViewFormGroup = this.newsService.getNewsCreationModel();
 
   }

  ngOnInit() {
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
          this.translate.use(this.loaderConfig.currentLangName);
      }
  });
  }

updateNews(){
 
    let getEditnewsDetail = this.newsService.updateNews(this.newsViewFormGroup.value);
    getEditnewsDetail.subscribe(
      (newsdetail) => {
       let news = newsdetail;
    
        this.loaderConfig.setLoadingSub('no');
        this.newsUpdatedModel.open();
      }
    );
}

closeAndNavigate(){
this.newsUpdatedModel.close();
 this.loaderConfig.navigateRouterLink('ncp/news/newsManagement');
}
}
