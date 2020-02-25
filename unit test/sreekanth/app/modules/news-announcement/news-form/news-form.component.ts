import { ConfigService } from './../../../core/services/config.service';
import { NewsService } from './../services/news.service';
import { NewsValidator } from './new.validators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NewsModel } from './../models/news.model';
import { DateDuration } from './../../../core/ui-components/ncp-date-picker/pipes/date.duration';

@Component({
  selector: 'news-form',
  templateUrl: './news-form.component.html',
  providers: [NewsValidator]
})
export class NewsFormComponent implements OnInit {

  @Input() newsFormGroup: FormGroup;
  @Input() buttonName = "";
  @Input() label ="";
  @Input() iconClass = 'fa fa-plus';
  @Input() mandatoryErrorFlag: boolean = false;
  newsCreationFormModel;
  loaderConfig;
  inputJson;
  text;
  readOnlyFlag: boolean = false;
  newsType = [
    {
      "code": "News",
      "desc": "NCPLabel.news"
    },
    {
      "code": "Announcement",
      "desc": "NCPLabel.announcement"
    },
    {
      "code": "Article",
      "desc": "NCPLabel.article"
    },
    {
      "code": "Notice",
      "desc": "NCPLabel.notice"
    }
  ];
  @Output() public doClick: EventEmitter<any> = new EventEmitter<any>();

  NCPDatePickerNormalOptions = {
    todayBtnTxt: 'Today',
    firstDayOfWeek: 'mo',
    alignSelectorRight: true,
    indicateInvalidDate: true,
    showDateFormatPlaceholder: true
  };
 /* Begins #513 (StartDate EndDate Validations */
  public setNCPDatePickerToDateOptions() {
    if (this.newsFormGroup.get('startDate').value) {
      if (this.newsFormGroup.get('endDate').value) {
        let activityFromDate = this.newsFormGroup.get('startDate').value;
        let activityToDate = this.newsFormGroup.get('endDate').value;
        let date = this.dateDuration.transform(activityFromDate,activityToDate);
        let startDate = date.startDate;
        let endDate = date.endDate;
        if (endDate < startDate) {
          this.newsFormGroup.get('endDate').patchValue(activityFromDate);
          return (this.newsFormGroup.get('endDate').value);
        }
        else {
          return (this.newsFormGroup.get('endDate').value);
        }
      }
    }
  }
/* Ends #513 (StartDate EndDate Validations */
  constructor(_newsCreationForm: FormBuilder, public newsValidator: NewsValidator, public newsService: NewsService, _loaderConfigService: ConfigService, public dateDuration: DateDuration) {

    this.loaderConfig = _loaderConfigService;

  }
  ngOnChanges() {
    if (this.newsFormGroup.enabled) {
      this.readOnlyFlag = false;
    }
    if (this.newsFormGroup.disabled) {
      this.readOnlyFlag = true;
    }
  }
  ngOnInit() {
    this.newsFormGroup = this.newsService.getNewsCreationModel();
    this.newsFormGroup.patchValue(this.newsService.getNewsCreationModel().value);
    this.newsFormGroup = this.newsValidator.setNewsValidator(this.newsFormGroup);
    let newsTypevalue = [];
    newsTypevalue["code"] = this.newsFormGroup.value.newsType;
    newsTypevalue["desc"] = this.newsFormGroup.value.newsType;
    if(this.newsFormGroup.value.newsType){
    this.newsFormGroup.get('newsType').setValue(newsTypevalue);
    }
/* Begins #513 (StartDate EndDate Validations */
    this.newsFormGroup.get('startDate').valueChanges.subscribe(() => {
      this.setNCPDatePickerToDateOptions();
    });
    this.newsFormGroup.get('endDate').valueChanges.subscribe(() => {
      this.setNCPDatePickerToDateOptions();
    });
/* Ends #513 (StartDate EndDate Validations */
  this.loaderConfig.setLoadingSub('no'); 
  }
  doAction(event) {
    this.doClick.emit(event);
  }

}
