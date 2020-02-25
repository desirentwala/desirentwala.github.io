import { SharedService } from '../../../core/shared/shared.service';
import { ConfigService } from '../../../core/services/config.service';
import { Logger } from '../../../core/ui-components/logger';
import { ReportService } from './services/report.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@adapters/packageAdapter';
import { DateFormatService } from '../../../core/ui-components/ncp-date-picker';
import { EventService } from '../../../core/services/event.service';

@Component({
    selector: 'ncp-report',
    templateUrl: 'report.component.html'
})

export class ReportComponent implements OnInit {
    repFilter: FormGroup;
    multiJson: any[] = [];
    repMultiJson: any[] = [];
    uniJson: any[] = [];
    repUniJson: any[] = [];
    lobFilter: Boolean = false;
    lob: Array<any> = [];
    selectedLob: Array<any> = [];
    reportsMenu: Array<any> = [];
    graphObj: Object = {};
    years: any[] = [];
    public year = '';
    currentReport: String = '';
    toggleFlag;
    currentDate: Date = new Date();
    NCPDatePickerNormalOptions: Object = {
        todayBtnTxt: 'Today',
        firstDayOfWeek: 'mo',
        alignSelectorRight: true,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true,
        disabledUntil: { year: new Date().getFullYear(), month: 1, day: 1, dayTxt: '' }
    };
    NCPDatePickerSecondField: Object = {
        todayBtnTxt: 'Today',
        firstDayOfWeek: 'mo',
        alignSelectorRight: true,
        indicateInvalidDate: true,
        showDateFormatPlaceholder: true,
        disabledUntil: { year: new Date().getFullYear(), month: 1, day: 1, dayTxt: '' }
    };
    isNoData = false;
    isDepthGraph = undefined;
    view = [800, 400];
    isNoFilterFlag: boolean = false;
    public currentMonth: number = 0;
    public presentYear: number = 2000;
    public todayString: any;
    public isProductWise: boolean = false;
    constructor(public repService: ReportService,
        public eventHandlerService: EventService,
        public config: ConfigService,
        public log: Logger,
        public translate: TranslateService,
        sharedService: SharedService,
        public dateFormatService: DateFormatService
    ) { }


    ngOnInit() {
        this.config.loggerSub.subscribe((data) => {
            if (data === 'langLoaded') {
                this.translate.use(this.config.currentLangName);
            }
        });
        this.repService.clearFilterModel();
        this.repFilter = this.repService.getFilterModel();
        let menuResp = this.config.getJSON({ key: 'META', path: 'reportsMenu' });
        menuResp.subscribe((data) => {
            if (data['error']) {
                this.log.error(data['error']);
            } else if (data) {
                this.reportsMenu = data;
                this.setGraphObj(data[0]['graphDetails']);
                this.repFilter.get('filterType').setValue(data[0]['defaultFilterValue']);
                this.repFilter.get('filterType').updateValueAndValidity();
            }
        });
        this.repFilter.get('reportType').setValue('PR');
        this.currentReport = 'PR';
        this.lobFilter = true;
        let date = new Date();
        this.presentYear = date.getFullYear();
        this.currentMonth = date.getMonth();
        let j = 0;

        for (let i = 2000; i <= this.presentYear; i++) {
            this.years[j] = i;
            j++;

        }
        if (this.years) {
            this.years = this.years.reverse();
        }
        this.todayString = this.dateFormatService.formatDate(this.currentDate);
        this.repFilter.get('filterType').valueChanges.subscribe((data) => {
            if (data) {
                this.isNoFilterFlag = false;
                this.setFilterType(data);
            } else if (data === '') {
                this.isNoFilterFlag = true;
                this.setFilterType(data);
            }
        });
        this.eventHandlerService.changeSub.subscribe((data) => {
            if ( data.id == 'startDateChangedId') {
                    this.startDateChangedId();
            }
        });
    }

    setFilterType(type) {
        this.isProductWise = false;
        this.isDepthGraph = false;
        if (type === '') {
            this.repFilter.get('isReportDateWise').setValue(false);
            this.repFilter.get('isYearly').setValue(false);
            this.repFilter.get('isMonthly').setValue(false);
            this.repFilter.get('isQuarterly').setValue(false);
            this.graphObj['fileHeaderGroupName'] = '';
        }
        if (type === 'Days') {
            this.repFilter.get('isReportDateWise').setValue(true);
            this.repFilter.get('isYearly').setValue(false);
            this.repFilter.get('isMonthly').setValue(false);
            this.repFilter.get('isQuarterly').setValue(false);
            this.repFilter.get('startDate').setValue(this.todayString);
            this.repFilter.get('endDate').setValue(this.todayString);
            this.graphObj['fileHeaderGroupName'] = this.graphObj['fileHeaderGroupForDays'];
            this.validateFilter();
        }
        if (type === 'Yearly') {
            this.repFilter.get('isReportDateWise').setValue(false);
            this.repFilter.get('isYearly').setValue(true);
            this.repFilter.get('isMonthly').setValue(false);
            this.repFilter.get('isQuarterly').setValue(false);
            this.graphObj['fileHeaderGroupName'] = this.graphObj['fileHeaderGroupForYear'];
            this.repFilter.get('startingYear').setValue(this.currentDate.getFullYear());
            this.repFilter.get('endingYear').setValue(this.currentDate.getFullYear());
            this.validateFilter();
        }
        if (type === 'Monthly') {
            this.repFilter.get('isReportDateWise').setValue(false);
            this.repFilter.get('isYearly').setValue(false);
            this.repFilter.get('isMonthly').setValue(true);
            this.repFilter.get('isQuarterly').setValue(false);
            this.repFilter.get('reportYear').setValue(this.currentDate.getFullYear());
            this.graphObj['fileHeaderGroupName'] = this.graphObj['fileHeaderGroupForMonth'];
            this.validateFilter();
        }
        if (type === 'Quarterly') {
            this.repFilter.get('isReportDateWise').setValue(false);
            this.repFilter.get('isYearly').setValue(false);
            this.repFilter.get('isMonthly').setValue(false);
            this.repFilter.get('isQuarterly').setValue(true);
            if (!this.repFilter.get('quarter').value) {
                this.repFilter.get('quarter').setValue(1);
            }
            if (!this.repFilter.get('quarterYear').value) {
                this.repFilter.get('quarterYear').setValue(this.currentDate.getFullYear());
            }
            this.repFilter.get('startDate').setValue('');
            this.repFilter.get('endDate').setValue('');
            this.graphObj['fileHeaderGroupName'] = this.graphObj['fileHeaderGroupForQuarter'];
            this.validateFilter();
        }

    }

   startDateChangedId() {
        let tripStartDt = this.repFilter.get('startDate').value;
        let firstDate = this.repService.parseSelectedDate(tripStartDt);
        this.NCPDatePickerSecondField['disabledUntil']= firstDate;
        this.repFilter.get('endDate').patchValue(tripStartDt);
        this.repFilter.get('endDate').updateValueAndValidity();
    }

    getReports() {
        let repResp = this.repService.getReports();
        repResp.subscribe((data) => {
            if (data && data.error) {
                this.log.error(data.error);
            } else {
                if (data && data.length > 0) {
                    this.handleReportOutPut(data);
                } else {
                    this.isNoData = true;
                }
            }
            this.config.setLoadingSub('no');
        });
    }

    setGraphObj(obj: any) {
        this.graphObj = obj;
    }

    handleReportOutPut(data: Array<any>) {
        if (data instanceof Array) {
            let tempObj: Object = data[0];
            this.uniJson = [];
            this.multiJson = [];
            if (tempObj.hasOwnProperty('series')) {
                data = data.filter(element => {
                    if (element['series'] && element['series'].length > 0) {
                        return true;
                    } else {
                        return false;
                    }
                });
                this.repService.setCurrentJson(data);
                this.multiJson.push(...data);
                this.uniJson = [];
            } else {
                this.repService.setCurrentJson(data);
                this.multiJson = [];
                this.uniJson.push(...data);
            }

            if (this.multiJson && this.multiJson.length > 0) {
                let series: Array<any> = data[0]['series'];
                if (this.lob.length > 0) {
                    this.lob = [];
                    this.selectedLob = [];
                }
                series.forEach((element) => {
                    let lobItem = element['name'];
                    this.lob.push(lobItem);
                    this.selectedLob.push(lobItem);
                });

            }
            if (this.uniJson && this.uniJson.length > 0) {
                if (this.lob.length > 0) {
                    this.lob = [];
                    this.selectedLob = [];
                }
                this.uniJson.forEach(element => {
                    this.lob.push(element['name']);
                    this.selectedLob.push(element['name']);
                });
            }
            this.config.loadingSub.next('no');
            this.filterBasedOnLob();
        }
    }

    setLobFilters(lob: any) {
        if (lob) {
            if (this.selectedLob.includes(lob)) {
                let i = this.selectedLob.indexOf(lob);
                this.selectedLob.splice(i, 1);
            } else {
                this.selectedLob.push(lob);
            }
            this.repMultiJson = [];
            this.repUniJson = [];
            this.filterBasedOnLob();
        }
    }

    filterBasedOnLob() {
        if (this.selectedLob && this.selectedLob.length > 0) {
            this.repMultiJson = [];
            this.repUniJson = [];
            let json: Array<any> = this.repService.getCurrentJson();
            if (this.multiJson && this.multiJson.length > 0) {

                this.graphObj['graphType'] = 'BarVerticalGrouped';
                json.forEach(element => {
                    let temp = {
                        name: '',
                        series: []
                    };
                    temp['name'] = element['name'];
                    let tempList = [];
                    tempList.push(...element['series']);
                    let repTempList = [];
                    tempList.forEach(elem => {
                        if (this.selectedLob.includes(elem['name'])) {
                            repTempList.push(elem);
                        }
                    });
                    temp['series'] = repTempList;
                    this.repMultiJson.push(temp);
                    this.isNoData = false;
                });
            }
            if (this.uniJson && this.uniJson.length > 0) {
                this.repUniJson = [];
                this.graphObj['graphType'] = 'BarVertical';
                json.forEach(element => {
                    if (this.selectedLob.includes(element['name'])) {
                        this.repUniJson.push(element);
                    }
                });
                this.isNoData = false;
            }
        }
    }

    validateFilter() {
        let temp = this.repFilter.value;
        this.isNoData = true;
        if (temp['isReportDateWise']) {
            if (temp['startDate'] && temp['endDate']) {
                this.getReports();
            }
        } else if (temp['isMonthly']) {
            if (temp['reportYear']) {
                this.getReports();
            }
        } else if (temp['isQuarterly']) {
            if (temp['quarter'] && temp['quarterYear']) {
                this.getReports();
            }
        } else if (temp['isYearly']) {
            if (temp['startingYear'] && temp['endingYear']) {
                this.getReports();
            }
        }
    }

    getProductLevelDetails(event) {
        if (typeof event !== 'string') {
            /* condition for click event triggered when legend is clicked */
            let filterType = this.repFilter.get('filterType').value;
            if (!this.isDepthGraph) {
                this.repFilter.get('isProductWise').setValue(true);
                this.repFilter.get('lobCodeForProduct').setValue(event['name']);
                if (filterType === 'Monthly') {
                    this.repFilter.get('reportMonthForProduct').setValue(this.getMonthFromString(event['series']));
                }
                if (filterType === 'Yearly') {
                    this.repFilter.get('reportYearForProduct').setValue(parseInt(event['series']));
                }
                if (filterType === 'Quarterly') {
                    let tempQuarter: string = event['series'];
                    if (tempQuarter) {
                        let temp: Array<string> = tempQuarter.split('-');
                        this.repFilter.get('quarter').setValue(temp[0].charAt(1));
                        this.repFilter.get('quarterYear').setValue(temp[1]);
                    }
                }
                this.isProductWise = true;
                this.getReports();
                this.isDepthGraph = true;
                this.repFilter.get('isProductWise').setValue(false);
                this.config.setLoadingSub('no');
            }
        }
    }

    getMonthFromString(mon) {
        let d = new Date();
        return new Date(Date.parse(mon + " 1, " + d.getFullYear().toString())).getMonth() + 1;
    }

    changeGraph2d() {
        let filterType = this.repFilter.get('filterType').value;
        if (filterType === 'Monthly' || filterType === 'Yearly') {
            this.repFilter.get('isGraph2D').setValue(true);
            this.getReports();
        }
    }

    changeGraph3d() {
        let filterType = this.repFilter.get('filterType').value;
        if (filterType === 'Monthly' || filterType === 'Yearly') {
            this.repFilter.get('isGraph2D').setValue(false);
            this.getReports();
        }
    }

    goToPreviousState() {
        this.isProductWise = false;
        this.isDepthGraph = undefined;
        this.getReports();
    }
}