import { FormBuilder } from '@angular/forms';

export class ReportFilter {
    constructor(public reportFilterForm: FormBuilder) { }

    getFilter() {
        return this.reportFilterForm.group({
            reportType: [''],
            startDate: [''],
            endDate: [''],
            isProductWise: false,
            lobCodeForProduct: [''],
            reportMonthForProduct: [''],
            reportYearForProduct: [''],
            reportYear: [''],
            quarter: [''],
            quarterYear: [''],
            startingYear: [''],
            endingYear: [''],
            isReportDateWise: [''],
            isMonthly: [''],
            isQuarterly: [''],
            isYearly: [''],
            isGraph2D: false,
            isPremiumNet: false,
            isPremiumInPrimeCurrency: false,
            filterType: [''],
            isDataforAllQuarter: false
        });
    }
}