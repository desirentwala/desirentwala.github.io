import { DateDuration } from './../../../core/ui-components/ncp-date-picker/pipes/date.duration';
import { ConfigService } from './../../../core/services/config.service';
import { NewsService } from './../../news-announcement/services/news.service';
import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'news-dashboard',
  templateUrl: './news-dashboard.component.html',
  providers: [NewsService, DateDuration]
})
export class NewsDashboardComponent {
  newsService;
  inputJson;
  newsDataResponse = [];
  loaderConfig;
  dateFormat = [];
  newsDate = [];
  userLang: string = '';
  d = [];
  c;
  displayDate;
  @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() newsData = [];
  constructor(public dateDuration: DateDuration, public _newsService: NewsService, _configService: ConfigService) {
    this.newsService = _newsService;
    this.loaderConfig = _configService;
    this.userLang = this.loaderConfig.getCustom('userLang');
  }
  viewAllNews() {
    this.loaderConfig.navigateRouterLink('ncp/news/viewAllNews');
    window.scrollTo(0, 0);
  }

  doAction(i) {

    this.doClick.emit(this.newsData[i]);
  }
}

