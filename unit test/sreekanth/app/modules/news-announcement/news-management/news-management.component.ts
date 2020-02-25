import { SharedService } from '../../../core/shared/shared.service';
import { ConfigService } from './../../../core/services/config.service';
import { BreadCrumbService } from './../../common/breadCrumb/services/breadcrumb.service';
import { NewsModel } from './../models/news.model';
import { NewsService } from './../services/news.service';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { SearchBy } from './../../../core/ui-components/table-filter/pipes/searchBy';
// import { OrderBy } from './../../../core/ui-components/table-filter/pipes/orderBy';
import { TranslateService } from '@adapters/packageAdapter';
@Component({
  selector: 'news-management',
  templateUrl: './news-management.component.html',

})
export class NewsManagementComponent implements OnInit {
  @ViewChild("newsListEditView") newsListEditView;
  @ViewChild("showHideColumnModal") showHideColumnModal;
  newsModelFormModel;
  inputJson;
  loaderConfig;
  getCustomerStartIndex = "-5";
  getCustomerMaxRecords = "5";
  sliceIndex ;
  tableData = [];
  mappingList = ['newsTitle', 'creationDate', 'newsType'];
  headerList = ['NCPLabel.newsTitle', 'NCPLabel.adate', 'NCPLabel.newsType'];
  classNameList = ['', , '', ''];
  headerListBackUp = [];
  tableDetails = [];
  columnsList = [];
  newTableDetails = [];
  sortByDefault = 'Date';
  sort: any;
  searchId: any = '';
  modalID: string;
  tooltipPlacement = 'left';
  tooltipHide: boolean = false;
  backupTableData = [];
  disableShowMoreButton: boolean = false;  
  tableDataResponse = [];
  newsIdDelete;
  enquiryType: boolean = true;
  newsTableFormGroup: FormGroup; 
  flag: boolean = true;
  newsMulticheckarray ;  
  checkBoxDisableArray = [];
  checkBoxDisableArrayBackUp = []; 
  @ViewChild('newsDeleteModel') newsDeleteModel;
  @ViewChild('myTooltip') myTooltip;
  elementRef;
  checkBoxDisableArrayBackup = [];
  isLeadArticle: boolean = false;
  fullfalse: boolean = false;
  rotateFlag = "";
  existingTooltip: any = '';
  errmsg : boolean = false;
  searchErrmsg: boolean= false;
  searchNewsFormGroup: FormGroup;
  searchedData;
  tableData1 = [];
  newsFormGroup;
  newcolumnlist = [];
  newcolumnlist1 = [];
  mappingListBackUp = [];
  minSliceValue:number = 5;
  rowIndex : number = 0;
  checkboxarrayform = new FormGroup({
    newsTitle: new FormControl(true),
    creationDate: new FormControl(true),
    newsType: new FormControl(true),  
  });
  NCPDatePickerNormalOptions = {
    todayBtnTxt: 'Today',
    alignSelectorRight: true,
    indicateInvalidDate: true,
    showDateFormatPlaceholder: true,
  }
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
  constructor(_breadCrumbService: BreadCrumbService, public translate: TranslateService, _newsModel: FormBuilder, public newsService: NewsService, _elementRef: ElementRef, public _loaderConfigService: ConfigService, sharedService: SharedService) {
    _breadCrumbService.addRouteName('/ncp/news/newsManagement', [{ 'name': 'News Management' }]);
    let newModel = new NewsModel(_newsModel);
    this.newsModelFormModel = newModel;
    this.loaderConfig = _loaderConfigService;
    this.elementRef = _elementRef;
    this.headerListBackUp.push(...this.headerList);
    this.mappingListBackUp.push(...this.mappingList);
    this.sliceIndex = this.minSliceValue;
  }
  ngOnInit() {
    this.loaderConfig.loggerSub.subscribe((data) => {
      if (data === 'langLoaded') {
          this.translate.use(this.loaderConfig.currentLangName);
      }
  });
    this.newsTableFormGroup = this.newsService.getNewsCreationModel(); 
    this.getNewsData();
    this.searchNewsFormGroup = this.newsService.getNewsCreationModel();
    this._loaderConfigService.setCustom('checkboxarrayform', this.checkboxarrayform.value);
    
  }
  
  ngAfterContentInit() {
     this.newsMulticheckarray = [
      { value: 'newsTitle', label: 'NCPLabel.newsTitle', elementControl: this.checkboxarrayform.controls['newsTitle'], disabled:true},
      { value: 'creationDate', label: 'NCPLabel.adate', elementControl: this.checkboxarrayform.controls['creationDate']  },
      { value: 'newsType', label: 'NCPLabel.newsType', elementControl: this.checkboxarrayform.controls['newsType'] }
      ];
  }
 leadArticleSelection(j, newsTitle, startDate, endDate, newsType, creationDate, newsDetails, isArticleImpo, newsID) {
    let newsCheck = this.elementRef.nativeElement.querySelector('#newsCheck-' + j);
    if (newsCheck.checked == true) {
      this.newsTableFormGroup.get('newsTitle').setValue(newsTitle);
      this.newsTableFormGroup.get('startDate').setValue(startDate);
      this.newsTableFormGroup.get('endDate').setValue(endDate);
      this.newsTableFormGroup.get('newsType').setValue(newsType);
      this.newsTableFormGroup.get('creationDate').setValue(creationDate);
      this.newsTableFormGroup.get('newsDetails').setValue(newsDetails);
      this.newsTableFormGroup.get('isArticleImpo').setValue(true);
      this.newsTableFormGroup.get('newsID').setValue(newsID);
      let getEditnewsDetail = this.newsService.updateNews(this.newsTableFormGroup.value);
      getEditnewsDetail.subscribe(
        (newsdetail) => {
          let news = newsdetail;
          this.loaderConfig.setLoadingSub('no');
        }
      );
    }
    if (newsCheck.checked == false) {
      this.newsTableFormGroup.get('newsTitle').setValue(newsTitle);
      this.newsTableFormGroup.get('startDate').setValue(startDate);
      this.newsTableFormGroup.get('endDate').setValue(endDate);
      this.newsTableFormGroup.get('newsType').setValue(newsType);
      this.newsTableFormGroup.get('creationDate').setValue(creationDate);
      this.newsTableFormGroup.get('newsDetails').setValue(newsDetails);
      this.newsTableFormGroup.get('isArticleImpo').setValue(false);
      this.newsTableFormGroup.get('newsID').setValue(newsID);
      let getEditnewsDetail = this.newsService.updateNews(this.newsTableFormGroup.value);
      getEditnewsDetail.subscribe(
        (newsdetail) => {
          let news = newsdetail;
          this.loaderConfig.setLoadingSub('no');
        }
      );
      this.checkBoxDisableArray = new Array(this.tableDataResponse.length).fill(true);
    }
    this.searchNewsFormGroup.reset();
  }

  getNewsData() {
    this.sliceIndex = this.minSliceValue;
    let getNewsDetails = this.newsService.retrieveNews(this.inputJson);
    getNewsDetails.subscribe(
    (dataVal) => {
        this.tableDataResponse = dataVal;
        
        this.checkBoxDisableArrayBackup = [];
         this.tableData1 = this.tableDataResponse;
        for (let i = 0; i < this.tableDataResponse.length; i++) {
           this.checkBoxDisableArrayBackup.push(this.tableDataResponse[i].isArticleImpo);
        if (this.tableDataResponse[i].isArticleImpo) {
           this.fullfalse = true;
         }
        }
        if (!this.fullfalse) {
          this.checkBoxDisableArray = new Array(this.tableDataResponse.length).fill(true);
        } else {
          this.checkBoxDisableArray = this.checkBoxDisableArrayBackup;
        }
         this.loaderConfig.setLoadingSub('no');
         this.tableDetails = this.columnsList;
         this.backupTableData.push(...this.tableData1);
         this.tableData =this.tableData1.slice(0, this.sliceIndex);
        });
        this.columnsList = [];
        let tableLength = this.mappingList.length;
        for (let i = 0; i < tableLength; i++) {
          this.columnsList.push({ header: this.headerList[i], mapping: this.mappingList[i], showColumn: true, className: this.classNameList[i] });
       }
       
        this.sort = {
        column: this.sortByDefault,
        descending: false
       }; 
  }
  selectedClass(columnName): any {
    return columnName === this.sort.column ? 'sort-' + this.sort.descending : false;
  }

  changeSorting(columnName): void {
    if (columnName) {
      var sort = this.sort;
      if (sort.column === columnName) {
        sort.descending = !sort.descending;
      } else {
        sort.column = columnName;
        sort.descending = false;
      }
    }
  }
  convertSorting(): string {
    return this.sort.descending ? '-' + this.sort.column : this.sort.column;
  }
  changeColumns(): any {
    this.newTableDetails = [];
    for (var i = 0; i < this.columnsList.length; i++) {
      if (this.columnsList[i].showColumn === true) {
        this.newTableDetails.push(this.columnsList[i]);
      }
    }
    this.tableDetails = this.newTableDetails;
  }



  checkbox() {

  }
  editNews(newsID) {
    let setViewNews;
    setViewNews = this.newsService.getNewsListModel().value;
    setViewNews.newsID = newsID;
    let getEditnewsDetail = this.newsService.retrieveNews(setViewNews);
    getEditnewsDetail.subscribe(
      (newsdetail) => {
        this.newsService.setNewsFormModel(newsdetail[0]);
        this.loaderConfig.navigateRouterLink('ncp/news/newsEdit');
        this.loaderConfig.setLoadingSub('no');
      }
    );
  }

  viewNews(newsID) {
    let setViewNews;
    setViewNews = this.newsService.getNewsListModel().value;
    setViewNews.newsID = newsID;
    let getEditnewsDetail = this.newsService.retrieveNews(setViewNews);
    getEditnewsDetail.subscribe(
      (newsdetail) => {
        this.newsService.setNewsFormModel(newsdetail[0]);
        this.loaderConfig.navigateRouterLink('ncp/news/newsView');
        this.loaderConfig.setLoadingSub('no');
      });


  }





  delete(newsID) {
    this.newsDeleteModel.open();
    this.myTooltip.hide();
    this.newsIdDelete = newsID;
    this.myTooltip.hide();


  }

  deleteNews() {
    let setViewNews;
    this.checkBoxDisableArray = [];
    setViewNews = this.newsService.getNewsListModel().value;
    setViewNews.newsID = this.newsIdDelete;
    let getEditnewsDetail = this.newsService.deleteNews(setViewNews);
    getEditnewsDetail.subscribe(
      (newsdetail) => {
        let responseData = newsdetail;
        this.getNewsData();
        this.loaderConfig.navigateRouterLink('ncp/news/newsManagement');
        this.newsDeleteModel.close();
        this.myTooltip.hide();
        this.loaderConfig.setLoadingSub('no');
      }
    );
  }

  returnToNews() {
    this.newsDeleteModel.close();
    this.loaderConfig.navigateRouterLink('ncp/news/newsManagement');
  }
  colhide(): any {
    let colSort: boolean = true;
    if (this.checkboxarrayform.controls['newsTitle'].value == true || this.checkboxarrayform.controls['newsType'].value == true || this.checkboxarrayform.controls['creationDate'].value == true) {
      this.newcolumnlist = [];
      this.newcolumnlist1 = [];
      for (var i = 0; i < this.headerListBackUp.length; i++) {
        if (this.checkboxarrayform.controls['newsTitle'].value == false && this.headerListBackUp[i] == "NCPLabel.newsTitle") { continue; }
        if (this.checkboxarrayform.controls['creationDate'].value == false && this.headerListBackUp[i] == "NCPLabel.adate") { continue; }
        if (this.checkboxarrayform.controls['newsType'].value == false && this.headerListBackUp[i] == "NCPLabel.newsType") { continue; }
        this.newcolumnlist.push(this.headerListBackUp[i]);
        this.newcolumnlist1.push(this.mappingListBackUp[i]);
      }
      this.mappingList = [];
      this.headerList = [];
      this.headerList.push(...this.newcolumnlist);
      this.mappingList.push(...this.newcolumnlist1);
      let tableLength = this.mappingList.length;
      for (let i = 0; i < tableLength; i++) {
        this.columnsList.push({ header: this.headerList[i], mapping: this.mappingList[i], showColumn: true });
      }
      this.tableDetails = this.columnsList;
      this.columnsList = [];
      this.errmsg = false;
      colSort = true;
    }
    else {
      this.errmsg = true;
      colSort = false;
    }
    if (colSort == true) {
      this.showHideColumnModal.close();
    } else {
      this.errmsg = true;
    }
    this._loaderConfigService.setCustom('checkboxarrayform', this.checkboxarrayform.value);
  }

  colClose(): any {
    this.checkboxarrayform.patchValue(this._loaderConfigService.getCustom('checkboxarrayform'));
  }
  searchNewsModel() {
    this.sliceIndex = this.minSliceValue;
    this.searchTableData(this.tableDataResponse, this.searchNewsFormGroup.controls['newsTitle'].value, this.searchNewsFormGroup.controls['creationDate'].value, this.searchNewsFormGroup.controls['newsType'].value);
  }
 clearNewsSearchModel() {
    this.searchErrmsg = false;
    this.searchNewsFormGroup.reset();
  }
 resetNewsSearchModel() {
    this.searchErrmsg = false;
    this.sliceIndex = this.minSliceValue;
    this.tableData1 = this.backupTableData;
    this.tableData = this.tableData1.slice(0, this.sliceIndex);
    this.setShowMoreFlag();
    this.clearNewsSearchModel();
    this.newsListEditView.close();   
  }
 showMore() {
    this.sliceIndex = this.minSliceValue + Number(this.sliceIndex);
    let showMoreList = this.tableData1;
    this.setShowMoreFlag();
    this.tableData =  showMoreList.slice(0, this.sliceIndex);  
  }
 searchTableData(myArray, keyOne, keyTwo, keyThree) {
    let currentNewsList = [];
    this.sliceIndex=this.minSliceValue;
    currentNewsList = myArray.filter((data) => {
      if (keyOne && keyTwo && keyThree) {
        if((data.newsTitle.toLowerCase().indexOf(keyOne.toLowerCase()) !== -1) && (data.creationDate.toLowerCase().indexOf(keyTwo.toLowerCase()) !== -1) && (data.newsType.toLowerCase().indexOf(keyThree.desc.toLowerCase()) !== -1)) { return true; }  
      }
      else if (keyOne && keyTwo) {
        if((data.newsTitle.toLowerCase().indexOf(keyOne.toLowerCase()) !== -1) && (data.creationDate.toLowerCase().indexOf(keyTwo.toLowerCase()) !== -1)) { return true; }  
      }
      else if (keyTwo && keyThree) {
        if((data.creationDate.toLowerCase().indexOf(keyTwo.toLowerCase()) !== -1) && (data.newsType.toLowerCase().indexOf(keyThree.desc.toLowerCase()) !== -1)) { return true; }  
      }
      else if (keyOne && keyThree) {
        if((data.newsTitle.toLowerCase().indexOf(keyOne.toLowerCase()) !== -1) && (data.newsType.toLowerCase().indexOf(keyThree.desc.toLowerCase()) !== -1)) { return true; }  
      }
      else if (keyOne) {
        if((data.newsTitle.toLowerCase().indexOf(keyOne.toLowerCase()) !== -1)) { return true; }  
      }
      else if (keyTwo) {
        if (data.creationDate.toLowerCase().indexOf(keyTwo.toLowerCase()) !== -1) { return true; }  
      }
      else if (keyThree) {
         if (data.newsType.toLowerCase().indexOf(keyThree.desc.toLowerCase()) !== -1) { return true;  }
      }
      else{ return false;}
    }); 
    this.disableShowMoreButton = false;
    if(currentNewsList.length>=1)   {
       this.tableData1 = currentNewsList;
       this.tableData =this.tableData1.slice(0, this.sliceIndex);
       this.setShowMoreFlag();
       this.sliceIndex = this.minSliceValue + Number(this.sliceIndex);
       this.searchErrmsg = false;
       this.newsListEditView.close();
     }
  else{
      this.searchErrmsg = true;
    }
}
 setShowMoreFlag(){
   if (this.tableData1.length <= this.minSliceValue  || this.sliceIndex >= this.tableData1.length ) {
     this.disableShowMoreButton = true;
   }
   else{
      this.disableShowMoreButton = false;
   }  
}

}