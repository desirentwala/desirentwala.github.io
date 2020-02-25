import { SharedModule } from './../../shared/shared.module';
import { AmountFormat } from '../amount/pipes/amountFormat';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '../utils/utils.service';
import { Component, Input, NgModule, OnChanges, OnInit, Sanitizer, ElementRef, Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { ConfigService } from '../../services/config.service';
import { TooltipModule } from '../tooltip';
import { DisplayDate } from '../ncp-date-picker/pipes/display.date';
import { map } from '@adapters/packageAdapter';
import { JoinPipe } from '../../../modules/common/pipes/joinPipe';
@Component({
    selector: 'misc-a',
    template: `<a (click)="anchorClick()" [class]="miscClass">
                    <ng-content></ng-content>
                  </a>`
})
export class MiscAnchorComponent {
    @Input() miscClass: any = '';
    @Input() clickId: string;
    @Input() clickParam: any;
    @Input() public isDisabled: boolean = false;
    @Input() parentIndex;
    @Input() indexes;
    @Input() superParentIndex;
    eventHandler: EventService;
    constructor(_eventHandler: EventService) {
        this.eventHandler = _eventHandler;
    }
    public anchorClick() {
        if (!this.isDisabled) {
            if (this.clickParam !== undefined && this.clickParam !== null) {
                this.eventHandler.setEvent('click', this.clickId, this.clickParam);
            } else {
                this.eventHandler.setEvent('click', this.clickId, { 'index': this.indexes - 1, 'parentIndex': this.parentIndex, 'superParentIndex': this.superParentIndex });
            }
        }
    }
}

@Component({
    selector: 'misc-i',
    template: `<i  [class]="miscClass">
                  </i>`
})
export class MiscIconComponent {
    @Input() miscClass: any = '';
}

@Component({
    selector: 'misc-div',
    template: `<div  *ngIf="!htmlString" [class]="miscClass"  ngClass="{{ isEven ? evenClass : '' }} {{ isOdd ? oddClass : '' }}" [attr.contenteditable]="isContenteditable">
                    <ng-content></ng-content>
                </div>
                <div  *ngIf="htmlString && !translateRequired" [class]="miscClass" [innerHtml]="htmlString" >
                </div>
                <div  *ngIf="htmlString && translateRequired " [class]="miscClass" [innerHtml]="htmlString | translate" >
                </div>`
})
export class MiscDivComponent implements OnChanges {
    @Input() miscClass: any = '';
    @Input() isOdd: boolean;
    @Input() isEven: boolean;
    @Input() evenClass: any = '';
    @Input() oddClass: any = '';
    @Input() htmlString: any;
    @Input() isContenteditable: Boolean = false;
    @Input() translateRequired: Boolean = false;

    constructor(public domSanitizer: DomSanitizer) { }
    ngOnChanges() {
        if (this.htmlString && !this.translateRequired) {
            this.htmlString = this.domSanitizer.bypassSecurityTrustHtml(this.htmlString);
        }
    }
}

@Component({
    selector: 'misc-fieldset',
    template: `
<fieldset  [class]="miscClass">
    <ng-content></ng-content>
</fieldset>`
})
export class MiscFieldsetComponent {
    @Input() miscClass: any = '';
}

@Component({
    selector: 'misc-span',
    template: `
<span  [class]="miscClass" ngClass="{{ isEven ? evenClass : '' }} {{ isOdd ? oddClass : '' }}">
    <ng-content></ng-content>
</span>`
})
export class MiscSpanComponent {
    @Input() miscClass: any = '';
    @Input() isOdd: boolean;
    @Input() isEven: boolean;
    @Input() evenClass: any = '';
    @Input() oddClass: any = '';
}

@Component({
    selector: 'misc-legend',
    template: `
<legend  [class]="miscClass">
    <ng-content></ng-content>
</legend>`
})
export class MiscLegendComponent {
    @Input() miscClass: any = '';
}

@Component({
    selector: 'misc-ul',
    template: `
<ul  [class]="miscClass">
    <ng-content></ng-content>
</ul>`
})
export class MiscULComponent {
    @Input() miscClass: any = '';
}

@Component({
    selector: 'misc-li',
    template: `
<li  [class]="miscClass">
    <ng-content></ng-content>
</li>`
})
export class MiscLiComponent {
    @Input() miscClass: any = '';
}

@Component({
    selector: 'misc-iframe',
    template: `
        <iframe  [id]="elementId" [src]="url"  ngClass="{{frameClass}} iframeContainer"></iframe>`
})
export class MiscFrameComponent implements OnChanges {
    @Input() elementId: any;
    @Input() iFrameUrl: any;
    @Input() frameClass: any;
    url: SafeResourceUrl;
    constructor(public sanitize: DomSanitizer) { }
    ngOnChanges(changes?) {
        if (this.iFrameUrl) {
            try {
                this.iFrameUrl = this.sanitize.bypassSecurityTrustResourceUrl(this.iFrameUrl);
                this.url = this.iFrameUrl
            } catch (e) { }
        }
    }
}

@Component({
    selector: 'misc-h4',
    template: `
            <h4  [class]="miscClass" ngClass="h4" [class.withTooltipHeader]="tooltipTitle">
                <i *ngIf="iconClass" class="{{iconClass}} iconHeader"></i>
                <span *ngIf="label" class="labelHeader">{{ label | translate}}</span>
                 <ng-content></ng-content>
                 <div *ngIf="tooltipTitle" class="tooltip-align tooltip-mobile3 withTooltipHeader">
                    <button type="button" class="btn btn-link info-tooltip" data-toggle="toggle" [tooltipPlacement]="tooltipPlacement"
                    [tooltip]="tooltipHTML" [id]="elementId">
                        <i class="icon-tooltip" [id]="elementId"></i>
                        <tooltip-content #tooltipHTML [excludeId]="elementId">
                        <div [innerHTML]="tooltipTitle | translate"> </div>
                        </tooltip-content>
                    </button>
                </div>
            </h4>`
})
export class MiscH4Component {
    @Input() miscClass: any = '';
    @Input() elementId: any = '';
    @Input() iconClass: string = '';
    @Input() label: string = '';
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
}

@Component({
    selector: 'misc-b',
    template: `
    <b>
        {{label}}{{append}}
    </b>`
})
export class MiscBoldComponent implements OnInit {
    @Input() isLabel: boolean;
    @Input() label;
    @Input() append: any;
    utils: UtilsService;
    constructor(_utils: UtilsService) {
        this.utils = _utils;
    }
    ngOnInit() {
        if (this.isLabel) {
            this.label = this.utils.getTranslated(this.label);
        }
    }


}
@Component({
    selector: 'misc-h2',
    template: `
    <h2 [class]="miscClass" ngClass="h2">
        <i *ngIf="iconClass" class="{{iconClass}} iconHeader"></i>
                <span *ngIf="label" class="labelHeader">{{ label | translate}}</span>
                 <ng-content></ng-content>
    </h2>
    <div *ngIf="tooltipTitle" class="pull-left tooltip-align tooltip-mobile3">
        <button type="button" class="btn btn-link info-tooltip" data-toggle="toggle" [tooltipPlacement]="tooltipPlacement"
        [tooltip]="tooltipHTML" [id]="elementId">
            <i class="icon-tooltip" [id]="elementId"></i>
            <tooltip-content #tooltipHTML [excludeId]="elementId">
            <div [innerHTML]="tooltipTitle | translate"> </div>
            </tooltip-content>
        </button>
    </div>`
})
export class MiscH2Component {
    @Input() miscClass: any = '';
    @Input() elementId: any = '';
    @Input() iconClass: string = '';
    @Input() label: string = '';
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
}
@Component({
    selector: 'misc-display',
    template: `<span>{{containsLabel(label || "") ? (label | translate) : label }}</span><span *ngIf="append" [innerHTML]="append"></span>`,
})
export class MiscDisplayComponent implements OnChanges {
    @Input() isLabel: boolean;
    @Input() label;
    @Input() indexes;
    @Input() append: any;
    @Input() appendAlt: any;
    @Input() type: string;
    @Input() dateDisplayType: string = '';
    @Input() joinString: string = '';

    utils: UtilsService;
    indexLabelsArray = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th',]
    constructor(_utils: UtilsService, public amtFormat: AmountFormat, public displayDate: DisplayDate, public joinPipe: JoinPipe) {
        this.utils = _utils;
    }
    containsLabel(label) {
        return ('' + label).indexOf('NCP') > -1;
    }
    ngOnChanges(changes?) {
        let pattern = /^[-]?[0-9.]*$/;
        if (this.type && this.type === 'amount') {
            if (pattern.test(this.label)) {
                this.label = this.amtFormat.transform(this.label, []);
                if (typeof this.label === 'string' && this.label.indexOf('-') > -1) {
                    this.label = '(' + this.label.substring(1, this.label.length) + ') ';
                }
            }
        } else if (this.type && this.type === 'date') {
            this.label = this.displayDate.transform(this.label, this.dateDisplayType);
        } else if (this.type && this.type === 'join') {
            this.label = this.joinPipe.transform(this.label, this.joinString);
        }
        if (this.indexes) {
            if (!this.appendAlt)
                this.label = this.indexes + this.indexLabelsArray[this.indexes - 1] + ' ';
            else {
                if (parseInt(this.indexes) - 1 > 0) {
                    this.label = parseInt(this.indexes) - 1 + ' ';
                } else {
                    this.label = this.appendAlt + ' ';
                    this.append = '';
                }
            }
        }
    }
}

@Component({
    selector: 'misc-h1',
    template: `<h1 [class]="miscClass" ngClass="h1" [class.withTooltipHeader]="tooltipTitle">
                <i *ngIf="iconClass" class="{{iconClass}} iconHeader"></i>
                <span *ngIf="label" class="labelHeader">{{ label | translate}}</span>
                 <ng-content></ng-content>
                 <div *ngIf="tooltipTitle" class="tooltip-align tooltip-mobile3 withTooltipHeader">
                    <button type="button" class="btn btn-link info-tooltip" data-toggle="toggle" [tooltipPlacement]="tooltipPlacement"
                    [tooltip]="tooltipHTML" [id]="elementId">
                        <i class="icon-tooltip" [id]="elementId"></i>
                        <tooltip-content #tooltipHTML [excludeId]="elementId">
                        <div [innerHTML]="tooltipTitle | translate"> </div>
                        </tooltip-content>
                    </button>
                </div>
                </h1>`
})

export class MiscH1Component {
    @Input() miscClass: any = '';
    @Input() elementId: any = '';
    @Input() iconClass: string = '';
    @Input() label: string = '';
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';
    constructor() { }
}

@Component({
    selector: 'misc-h3',
    template: `<h3 [class]="miscClass" ngClass="h3">
                <i *ngIf="iconClass" class="{{iconClass}} iconHeader"></i>
                <span *ngIf="label" class="labelHeader">{{ label | translate}}</span>
                 <ng-content></ng-content>
                </h3>
                <div *ngIf="tooltipTitle" class="pull-left tooltip-align tooltip-mobile3">
                    <button type="button" class="btn btn-link info-tooltip" data-toggle="toggle" [tooltipPlacement]="tooltipPlacement"
                    [tooltip]="tooltipHTML" [id]="elementId">
                        <i class="icon-tooltip" [id]="elementId"></i>
                        <tooltip-content #tooltipHTML [excludeId]="elementId">
                        <div [innerHTML]="tooltipTitle | translate"> </div>
                        </tooltip-content>
                    </button>
                </div>`
})

export class MiscH3Component {
    @Input() miscClass: any = '';
    @Input() elementId: any = '';
    @Input() iconClass: string = '';
    @Input() label: string = '';
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';

    constructor() { }
}

@Component({
    selector: 'misc-h5',
    template: `<h5 [class]="miscClass" ngClass="h5">
                <i *ngIf="iconClass" class="{{iconClass}} iconHeader"></i>
                <span *ngIf="label" class="labelHeader">{{ label | translate}}</span>
                 <ng-content></ng-content>
                </h5>
                <div *ngIf="tooltipTitle" class="pull-left tooltip-align tooltip-mobile3">
                    <button type="button" class="btn btn-link info-tooltip" data-toggle="toggle" [tooltipPlacement]="tooltipPlacement"
                    [tooltip]="tooltipHTML" [id]="elementId">
                        <i class="icon-tooltip" [id]="elementId"></i>
                        <tooltip-content #tooltipHTML [excludeId]="elementId">
                        <div [innerHTML]="tooltipTitle | translate"> </div>
                        </tooltip-content>
                    </button>
                </div>`
})

export class MiscH5Component {
    @Input() miscClass: any = '';
    @Input() elementId: any = '';
    @Input() iconClass: string = '';
    @Input() label: string = '';
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';

    constructor() { }
}

@Component({
    selector: 'misc-h6',
    template: `<h5 [class]="miscClass">
                <i *ngIf="iconClass" class="{{iconClass}} iconHeader"></i>
                <span *ngIf="label" class="labelHeader">{{ label | translate}}</span>
                 <ng-content></ng-content>
                </h5>
                <div *ngIf="tooltipTitle" class="pull-left tooltip-align tooltip-mobile3">
                    <button type="button" class="btn btn-link info-tooltip" data-toggle="toggle" [tooltipPlacement]="tooltipPlacement"
                    [tooltip]="tooltipHTML" [id]="elementId">
                        <i class="icon-tooltip" [id]="elementId"></i>
                        <tooltip-content #tooltipHTML [excludeId]="elementId">
                        <div [innerHTML]="tooltipTitle | translate"> </div>
                        </tooltip-content>
                    </button>
                </div>`
})

export class MiscH6Component {
    @Input() miscClass: any = '';
    @Input() elementId: any = '';
    @Input() iconClass: string = '';
    @Input() label: string = '';
    @Input() tooltipTitle: string;
    @Input() tooltipPlacement: string = 'right';

    constructor() { }
}

@Component({
    selector: 'misc-img',
    template: `<ng-container *ngIf="useBackgroundImage && src">
                    <div class="imgBoxContainer" [ngClass]="customImgBoxContainerClass" [style.background-image]="'url(assets/img/' + backgroundImgURL + ')'">
                        <img class="centerMainImage" [ngStyle]="{ width : customWidth, height : customHeight }"  [ngClass]="miscClass" [src]="'assets/img/'+src" [alt]="alt" ><ng-content></ng-content>
                    </div>
                </ng-container>
    <ng-container *ngIf="!useBackgroundImage && src">
    <img [ngStyle]="{ width : customWidth, height : customHeight }" class="img-responsive imgContainer"  [class]="miscClass" [src]="'assets/img/'+src" [alt]="alt" >
    <ng-content>
    </ng-content></ng-container>`
})

export class MiscImageComponent implements OnInit {
    @Input() miscClass: any = '';
    @Input() alt: string = '';
    @Input() src: any = '';
    @Input() useBackgroundImage: boolean = false;
    @Input() backgroundImgURL: string = '';
    @Input() customImgBoxContainerClass: string = '';
    @Input() customHeight: any;
    @Input() customWidth: any;
    @Input() doExtractSVG: boolean;
    replaceImgExtensionsWithRawData: any = ['svg'];
    constructor(public configService: ConfigService, public renderer: Renderer,
        public elementRef: ElementRef) { }
    ngOnInit() {
        // tslint:disable-next-line:curly
        if (this.doExtractSVG) this.doReplaceImgWithRawData('svg');
}
    doReplaceImgWithRawData(type: string) {
        if (this.src && this.replaceImgExtensionsWithRawData.indexOf(this.src.split('.').pop()) !== -1) {
            this.configService.getImage('assets/img/' + this.src).pipe(map(res => res)).subscribe(el => {
                // get our element and clean it out
                const element = this.elementRef.nativeElement;
                element.innerHTML = '';
                // get response and build svg element
                const response = '' + el;
                const parser = new DOMParser();
                const svg = parser.parseFromString(response, 'image/svg+xml');
                svg.documentElement.removeAttribute('xmlns:a');
                svg.documentElement.setAttribute('class', this.miscClass);
                svg.documentElement.setAttribute('height', this.customHeight);
                svg.documentElement.setAttribute('width', this.customWidth);
                svg.documentElement.setAttribute('alt', this.alt);
                // insert the svg result
                this.renderer.projectNodes(element, [svg.documentElement]);
            });
        }
    }
}

@Component({
    selector: 'misc-nav',
    template: `<nav [class]="miscClass">  
                    <ng-content></ng-content>
                </nav>`
})

export class MiscNavComponent {
    @Input() miscClass: any = '';
    constructor() { }
}

@NgModule({
    imports: [CommonModule, TooltipModule, SharedModule],
    exports: [MiscAnchorComponent, MiscDivComponent,
        MiscFieldsetComponent, MiscLegendComponent, MiscIconComponent, MiscSpanComponent, MiscULComponent, MiscLiComponent, MiscH4Component,
        MiscBoldComponent, MiscH2Component, MiscDisplayComponent,
        MiscFrameComponent, SharedModule, MiscH1Component, MiscH3Component, MiscH5Component, MiscH6Component, MiscImageComponent, MiscNavComponent],
    declarations: [MiscAnchorComponent, MiscDivComponent,
        MiscFieldsetComponent, MiscLegendComponent, MiscIconComponent, MiscSpanComponent, MiscULComponent,
        MiscLiComponent, MiscH4Component, MiscBoldComponent,
        MiscH2Component, MiscDisplayComponent, MiscFrameComponent, MiscH1Component, MiscH3Component, MiscH5Component, MiscH6Component,
        MiscImageComponent, MiscNavComponent],
    providers: [AmountFormat, JoinPipe]
})
export class UiMiscModule { }


