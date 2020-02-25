import { ChangeDetectorRef, Component, Input, OnChanges, ViewChildren, QueryList, AfterViewInit } from '@angular/core';

import { ConfigService } from '../../services/config.service';
import { Logger } from '../../ui-components/logger/logger';
import { WalkthroughComponent, WalkthroughFlowComponent } from '../ncp-walkthrough-core';
import { UtilsService } from '../../ui-components/utils/utils.service';

@Component({
    selector: 'ncp-walkthrough-element',
    templateUrl: 'ncp.walkthrough.element.html'
})
export class NCPWalkThroughElementComponent implements OnChanges, AfterViewInit {
    @ViewChildren(WalkthroughComponent) walkthroughComponents: QueryList<WalkthroughComponent>;
    @ViewChildren(WalkthroughFlowComponent) walkthroughFlowComponents: QueryList<WalkthroughFlowComponent>;
    @Input()
    walkthroughInput: any = {};
    @Input()
    showFlow: boolean = true;
    @Input()
    showOnAction: boolean = false;
    @Input()
    doShow: boolean = false;
    @Input()
    hasCustomSwitch: boolean = false;
    logger: Logger;
    key: string;
    data: any = {};
    walkThroughFlowKey: string;
    constructor(_logger: Logger, public changeRef: ChangeDetectorRef, public config: ConfigService, public utils: UtilsService) {
        this.logger = _logger;
    }

    ngOnChanges(changes?) {
        if (changes.doShow !== undefined && changes.doShow.currentValue === true) this.doInvoke();
    }
    ngAfterViewInit() {
        this.walkthroughFlowComponents.changes.subscribe(() => { this.doInvoke() });
    }
    doInvoke() {
        if (this.doShow) {
            if (this.showFlow) {
                if ( this.walkthroughFlowComponents.length > 0 && this.walkthroughFlowComponents.first.id !== this.walkThroughFlowKey) {
                    this.walkThroughFlowKey = this.walkthroughFlowComponents.first.id;
                    setTimeout(() => {
                        this.walkthroughFlowComponents.first.init();
                        this.walkthroughFlowComponents.first.start();
                    }, 0);
                }
            }
        }
    }
}
