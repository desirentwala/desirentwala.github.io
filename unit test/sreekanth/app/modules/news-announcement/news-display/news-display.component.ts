import { ConfigService } from './../../../core/services/config.service';
import { DateDuration } from './../../../core/ui-components/ncp-date-picker/pipes/date.duration';
import { BreadCrumbService } from './../../common/breadCrumb/services/breadcrumb.service';
import { NewsService } from './../services/news.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { SharedService } from '../../../core/shared/shared.service';
import { TranslateService } from '@adapters/packageAdapter';
@Component({
  selector: 'news-display',
  templateUrl: './news-display.component.html'
})
export class NewsDisplayComponent implements OnInit {
  loaderConfig;
  inputJson;
  tableDataResponse = [];
  newsData = [];
  leadNews = [];
  normalNews = [];
  leadNewsData = [];
  normalNewsData = [];
  leadNewsDate=[];
  normalNewsDate=[];
  userLang:string = '';
  displayDateLeadNews;
  displayDateNormaldNews;
  newsDataForModel;
  newsDataForModelTitle;
  newsDataForModelDate;
  newsDataForModelNewsDetails;
  newsDate;
  displayDate;
  newsType;
  @ViewChild("viewNewsModel") viewNewsModel;
  constructor(public translate: TranslateService,public dateDuration: DateDuration,_breadCrumbService: BreadCrumbService, public newsService: NewsService, _loaderConfigService: ConfigService, sharedService: SharedService,) {
     _breadCrumbService.addRouteName('/ncp/news/viewAllNews', [{'name':'View All News'}]);
    this.loaderConfig = _loaderConfigService;
          this.userLang = this.loaderConfig.getCustom('userLang');
  }

  ngOnInit() {
    this.getAllNews();
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
          this.translate.use(this.loaderConfig.currentLangName);
      }
  });
  }
  getAllNews() {
    let getNewsDetails = this.newsService.retrieveNews(this.inputJson);
    getNewsDetails.subscribe(
      (dataVal) => {
        for (let i = 0; i < dataVal.length; i++) {
          if (dataVal[i].isArticleImpo == true) {
            this.leadNews.push(dataVal[i]);
          }
          else {
            this.normalNews.push(dataVal[i]);
          }
        }
        this.leadNewsData.push(...this.leadNews);
        this.normalNewsData.push(...this.normalNews);
        this.loaderConfig.setLoadingSub('no');
         for (let i = 0; i < this.leadNewsData.length; i++) {
            let date = this.dateDuration.transform(this.leadNewsData[i].creationDate).startDate;
      this.displayDateLeadNews = date.toDateString();
      this.leadNewsDate.push(this.displayDateLeadNews);
    }

       for (let i = 0; i < this.normalNewsData.length; i++) {
        let date = this.dateDuration.transform(this.normalNewsData[i].creationDate).startDate;
        this.displayDateNormaldNews = date.toDateString();
        this.normalNewsDate.push(this.displayDateNormaldNews);
        }
      });
  }
  readMore(newsDataReceived){
    this.newsDataForModel = newsDataReceived;
    this.newsDataForModelTitle = this.newsDataForModel.newsTitle;
    this.newsType = this.newsDataForModel.newsType;
    this.newsDataForModelNewsDetails = this.newsDataForModel.newsDetails;
    let date = this.dateDuration.transform(this.newsDataForModel.creationDate).startDate;
    this.displayDate = date.toDateString();
    this.newsDate = (this.displayDate);
    this.viewNewsModel.open();
  }

}
