import { Subject } from '@adapters/packageAdapter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportFilter } from '../report.filter.model';
import { ConfigService } from '../../../../core/services/config.service';
import { Injectable } from '@angular/core';
import { DateFormatService } from '../../../../core/ui-components/ncp-date-picker';

@Injectable()
export class ReportService {
    dateFormat: string;
    public reportFilterVO: FormGroup;
    public currentJson: any;
    public filter;
    constructor(
        public config: ConfigService,
        formBuilder: FormBuilder,
        public dateFormatService: DateFormatService) {
        this.dateFormat = this.config.get('dateFormat');
        this.filter = new ReportFilter(formBuilder);
        this.reportFilterVO = this.filter.getFilter();
    }

    parseSelectedDate(ds: string) {
         let date: any = { day: 0, month: 0, year: 0, dayTxt: '' };
         if (ds) {
             let fmt= this.dateFormat;
             let dpos = fmt.indexOf('dd');
             if (dpos >= 0) {
                 date.day = parseInt(ds.substring(dpos, dpos + 2));
             }
             let mpos = fmt.indexOf('MM');
             if (mpos >= 0) {
                 date.month = parseInt(ds.substring(mpos, mpos + 2));
             }
             let ypos = fmt.indexOf('yyyy');
             if (ypos >= 0) {
                 date.year = parseInt(ds.substring(ypos, ypos + 4));
             }
         }
         return date;
     }

    getFilterModel() {
        return this.reportFilterVO;
    }

    setFilterModel(filterValues: any) {
        this.reportFilterVO.reset();
        this.reportFilterVO.patchValue(filterValues);
    }

    clearFilterModel() {
        this.reportFilterVO.reset();
        this.reportFilterVO = this.filter.getFilter();
    }

    getReports() {
        if (this.reportFilterVO.get('reportType').value === 'PR') {
            let reportsResp = this.config.ncpRestServiceCall('report/retrievePolicyPremiumForReports', this.reportFilterVO.value);
            return reportsResp;
        }
    }


    public getCurrentJson(): any {
        return this.currentJson;
    }
    public setCurrentJson(json) {
        this.currentJson = json;
    }


}