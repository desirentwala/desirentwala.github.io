import { SharedModule } from '../../shared/shared.module';
import { UtilsService } from '../utils/utils.service';
import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, HostListener, Input, NgModule, OnChanges, Output } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import * as json2Csv from 'json2csv';
import * as _ from 'lodash.flatten';
import { UiButtonModule } from '../button/index';
import { UiMiscModule } from '../misc-element/misc.component';
import { ConfigService } from '../../../core/services/config.service';

@Component({
    selector: 'ncp-chart',
    templateUrl: 'ncpChart.component.html'
})

export class ChartComponent implements AfterContentInit, OnChanges {
    @Input() single: any[];
    @Input() multi: any[];

    // view: any[] = [1175, 150];
    @Input() type: string = '';
    @Input() titleHeader: string = '';
    @Input() pieView;
    bckPieView;
    bckBarView;
    @Input() barView = [550, 300];
    view;
    numberCardView;
    // options
    @Input() showXAxis: boolean = true;
    @Input() showYAxis: boolean = true;
    @Input() showLabels: boolean = false;
    @Input() gradient: boolean = false;
    @Input() showLegend: boolean = true;
    @Input() showXAxisLabel: boolean = true;
    @Input() xAxisLabel: string = '';
    @Input() showYAxisLabel: boolean = true;
    @Input() yAxisLabel: string = '';
    @Input() explodeSlices: boolean = false;
    @Input() autoScale: boolean = false;
    @Input() showUtilityButton: boolean = false;
    @Input() headerGroup: string = '';
    @Input() header1: string = '';
    @Input() header2: string = '';
    @Input() fileName: string = '';
    @Input() widthClass: string = 'col-md-6 col-sm-6 col-xs-12 pr5';
    @Input() timeline: boolean = false;
    @Input() doTranslate: boolean = false;
    @Input() isDepthGraph: boolean = false;
    @Input() colorScheme = {
        domain: ['#D35034', '#E6B600', '#0080B1', '#008040']
    };

    @Input() isSingle: boolean = true;
    @Input() serviceId: string = '';

    @Output() chartSelect: EventEmitter<any> = new EventEmitter();
    @Output() chartBack: EventEmitter<any> = new EventEmitter();
    toggleMenu: Boolean = false;
    constructor(public utils: UtilsService,
        public config: ConfigService) { }

    ngAfterContentInit() {
        this.resize(null);
        this.xAxisLabel = this.utils.getTranslated(this.xAxisLabel);
        this.yAxisLabel = this.utils.getTranslated(this.yAxisLabel);
        this.bckBarView = this.barView;
        this.bckPieView = this.pieView;
    }

    ngOnChanges(changes?) {
        if (this.doTranslate) {
            if (this.single && this.single.length > 0) {
                this.single.forEach(element => {
                    element['name'] = this.utils.getTranslated(element['name']);
                });
            }
        }
        if ( this.serviceId ) {
            this.displayGraph();
        }
    }

    select(e: any) {
        this.chartSelect.emit(e);
    }

    generateCsv() {
        if (this.single && this.single.length > 0) {
            let fields = ['name', 'value'];
            let fieldNames = [this.utils.getTranslated(this.headerGroup), this.utils.getTranslated(this.header1)];
            let opts = {
                data: this.single,
                fields: fields,
                fieldNames: fieldNames,
                quotes: ''
            };
            let csv = json2Csv(opts);
            this.download(csv);
        }
        if (this.multi && this.multi.length > 0) {
            const data2 = _(this.multi.map((o) =>
                o.series.map((f) => ({
                    name: o.name,
                    name1: f.name,
                    value: f.value
                }))
            ));
            let fields = ['name', 'name1', 'value'];
            let fieldNames = [this.utils.getTranslated(this.headerGroup),
            this.utils.getTranslated(this.header1), this.utils.getTranslated(this.header2)];
            let opts = {
                data: data2,
                fields: fields,
                fieldNames: fieldNames,
                quotes: ''
            };
            let csv = json2Csv(opts);
            this.download(csv);
        }
    }

    download(csvData: any) {
        var a: any = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;

        var isIE = /*@cc_on!@*/false || !!(<any>document).documentMode;

        if (isIE) {
            var retVal = navigator.msSaveBlob(blob, this.fileName + '.csv');
        }
        else {
            a.download = this.fileName + '.csv';
        }
        // If you will any error in a.download then dont worry about this. 
        a.click();
    }

    goBack() {
        this.chartBack.emit();
    }

    displayGraph() {
        this.single = [];
        this.multi = [];
        let expResp = this.config.ncpRestServiceWithoutLoadingSubCall(this.serviceId, {});
        expResp.subscribe((data) => {
            if (!data['error'] && data instanceof Array) {
                if (this.isSingle) {
                    this.single = data;
                } else {
                    this.multi = data;
                }
            }
        });
    }

    @HostListener('window:resize')
    resize(event: any) {
        if (window.innerWidth < 767) {
            this.view = undefined;
            this.pieView = undefined;
            this.barView = undefined;
            this.numberCardView = undefined;
        } else {
            this.view = [window.innerWidth - 225, 150];
            if (!this.pieView) {
                this.pieView = this.bckPieView;
            }
            if (!this.barView) {
                this.barView = this.bckBarView;
            }
            this.numberCardView = [1130, 170];
        }
    }


}





@NgModule({
    imports: [CommonModule, NgxChartsModule, SharedModule, UiButtonModule, UiMiscModule],
    exports: [ChartComponent],
    declarations: [ChartComponent]
})
export class ChartModule { }
