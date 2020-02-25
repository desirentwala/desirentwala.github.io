import { SharedModule } from '../../shared/shared.module';
import { TimeLineService } from './service/timeline.service';
import { CommonModule } from '@angular/common';
import { UiMiscModule } from '../../ui-components/misc-element/misc.component';
import { Component, EventEmitter, Input, NgModule, OnChanges, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'time-line',
    templateUrl: 'timeline.component.html'
})

export class TimelineComponent implements OnChanges {
    @Input() eventData: any[] = [];
    @Input() eventKey: any = '';
    @Input() productCd: any = '';
    @Output() viewProd: EventEmitter<any> = new EventEmitter();
    //TODO have to put a default value
    public timeLineEvents: any = [];
    constructor(public timelineService: TimeLineService) {

    }
    ngOnChanges(changes?) {
        if (this.eventData && this.eventData.length > 0) {
            this.timeLineEvents = this.composeTimeline(this.eventData);
        }
    }
    composeTimeline(events: Array<any>) {
        var timeLineEvents: Array<any> = [];
        events = events.sort((a, b) => {
            if (!(a['timeStamp'] instanceof Date))
                a['timeStamp'] = new Date(a['timeStamp']);
            if (!(b['timeStamp'] instanceof Date))
                b['timeStamp'] = new Date(b['timeStamp']);
            return b['timeStamp'].getTime() - a['timeStamp'].getTime();
        });
        let year: any;
        let tempYear: any;
        events.forEach((event) => {
            event['timeStamp'] = new Date(event['timeStamp']);
            if (!year) {
                year = event['timeStamp'].getFullYear();
                let obj = {
                    'isYearBlock': true,
                    'year': year
                }
                timeLineEvents.push(obj);
            } else {
                tempYear = null;
                tempYear = event['timeStamp'].getFullYear();
                if (year !== tempYear) {
                    year = tempYear;
                    let obj = {
                        'isYearBlock': true,
                        'year': year
                    }
                    timeLineEvents.push(obj);
                }
            }
            let timelineEvent = {
                eventKey: {}
            };
            timelineEvent['eventTime'] = event['timeStamp'];
            timelineEvent['eventType'] = event['eventCode'];
            if (event['eventCode'] === 'QA') {
                this.eventKey['policyNo'] = event['policyNo'];
            }
            if (event['policyEndtNo']) {
                timelineEvent['eventKey']['policyEndtNo'] = event['policyEndtNo'];
            }
            if (this.eventKey['policyNo']) {
                timelineEvent['eventKey']['policyNo'] = this.eventKey['policyNo'];
            }
            if (this.eventKey['quoteNo']) {
                timelineEvent['eventKey']['quoteNo'] = this.eventKey['quoteNo'];
            }
            if (this.eventKey['claimNo']) {
                timelineEvent['eventKey']['claimNo'] = this.eventKey['claimNo'];
            }
            if (this.eventKey['renPolicyNo']) {
                timelineEvent['eventKey']['renPolicyNo'] = this.eventKey['renPolicyNo'];
            }
            timelineEvent['productCd'] = this.productCd;
            timelineEvent['eventHeader'] = this.timelineService.getHeaderForType(event['eventCode']);
            timelineEvent['eventIcon'] = this.timelineService.getIconForType(event['eventCode']);
            timelineEvent['eventDesc'] = this.timelineService.getDescForType(event['eventCode']);
            timelineEvent['keyMapping'] = this.timelineService.getKeyMapForType(event['eventCode']);
            timeLineEvents.push(timelineEvent);
        });
        return timeLineEvents;
    }

    routeTo() {
        this.viewProd.emit();
    }
}

export const UI_TIME_DIRECTIVES = [TimelineComponent];
@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, UiMiscModule],
    declarations: UI_TIME_DIRECTIVES,
    exports: UI_TIME_DIRECTIVES,
    providers: [TimeLineService]
})
export class UiTimelineModule { }