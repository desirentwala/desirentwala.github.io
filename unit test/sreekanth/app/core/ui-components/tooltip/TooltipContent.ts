
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'tooltip-content',
    template: `
<div  class="tooltip in {{ placement | translate }}"
     [style.top]="top + 'px'"
     [style.left]="left + 'px'"
     [class.fade]="isFade"
     role="tooltip" (clickOutside)="outsideClick()" [active]="top === -1500 ? false :true" [exclude]="excludeId">
    <div class="tooltip-arrow"></div> 
    <div class="tooltip-inner">
        <ng-content></ng-content>
        {{ content | translate }}
    </div> 
</div>
`
})
export class TooltipContent implements OnInit, OnChanges {



    @Input()
    hostElement: HTMLElement;

    @Input()
    content: string;

    @Input()
    placement: 'top' | 'bottom' | 'left' | 'right' = 'right';

    @Input()
    animation: boolean = true;
    @Input()
    excludeId: string = '';



    top: number = -1500;
    left: number = -3500;
    isFade: boolean = false;
    visible: boolean = false;
    constructor(public element: ElementRef,
        public cdr: ChangeDetectorRef) {
    }



    ngOnInit(): void {
    }

    ngOnChanges(changes?: SimpleChanges) {
        if (changes['excludeId']) {
            this.excludeId = '#' + this.excludeId;
        }
    }


    show(): void {
        if (!this.hostElement)
            return;
        const p = this.positionElements(this.hostElement, this.element.nativeElement.children[0], this.placement);
        this.top = p.top;
        this.left = p.left;
        if (this.animation) {
            this.isFade = true;
        }
        this.cdr.markForCheck();
    }

    hide(): void {
        this.top = -1500;
        this.left = -3500;
        if (this.animation) {
            this.isFade = false;
        }
        this.cdr.markForCheck();
    }

    outsideClick() {
        this.hide();
    }



    public positionElements(hostEl: HTMLElement, targetEl: HTMLElement, positionStr: string, appendToBody: boolean = false): { top: number, left: number } {
        let positionStrParts = positionStr.split('-');
        let pos0 = positionStrParts[0];
        let pos1 = positionStrParts[1] || 'center';

        let hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);
        let targetElWidth = targetEl.offsetWidth;
        let targetElHeight = targetEl.offsetHeight;
        let shiftWidth: any = {
            center: function (): number {
                return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
            },
            left: function (): number {
                return hostElPos.left;
            },
            right: function (): number {
                return hostElPos.left + hostElPos.width;
            }
        };

        let shiftHeight: any = {
            center: function (): number {
                return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
            },
            top: function (): number {
                return hostElPos.top;
            },
            bottom: function (): number {
                return hostElPos.top + hostElPos.height;
            }
        };

        let targetElPos: { top: number, left: number };
        switch (pos0) {
            case 'right':
                targetElPos = {
                    top: shiftHeight[pos1](),
                    left: shiftWidth[pos0]()
                };
                break;

            case 'left':
                targetElPos = {
                    top: shiftHeight[pos1](),
                    left: hostElPos.left - targetElWidth
                };
                break;

            case 'bottom':
                targetElPos = {
                    top: shiftHeight[pos0](),
                    left: shiftWidth[pos1]()
                };
                break;

            default:
                targetElPos = {
                    top: hostElPos.top - targetElHeight,
                    left: shiftWidth[pos1]()
                };
                break;
        }

        return targetElPos;
    }

    public position(nativeEl: HTMLElement): { width: number, height: number, top: number, left: number } {
        let offsetParentBCR = { top: 0, left: 0 };
        const elBCR = this.offset(nativeEl);
        const offsetParentEl = this.parentOffsetEl(nativeEl);
        if (offsetParentEl !== window.document) {
            offsetParentBCR = this.offset(offsetParentEl);
            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
            offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        const boundingClientRect = nativeEl.getBoundingClientRect();
        return {
            width: boundingClientRect.width || nativeEl.offsetWidth,
            height: boundingClientRect.height || nativeEl.offsetHeight,
            top: elBCR.top - offsetParentBCR.top,
            left: elBCR.left - offsetParentBCR.left
        };
    }

    public offset(nativeEl: any): { width: number, height: number, top: number, left: number } {
        const boundingClientRect = nativeEl.getBoundingClientRect();
        return {
            width: boundingClientRect.width || nativeEl.offsetWidth,
            height: boundingClientRect.height || nativeEl.offsetHeight,
            top: boundingClientRect.top + (window.pageYOffset || window.document.documentElement.scrollTop),
            left: boundingClientRect.left + (window.pageXOffset || window.document.documentElement.scrollLeft)
        };
    }

    public getStyle(nativeEl: HTMLElement, cssProp: string): string {
        if ((nativeEl as any).currentStyle) // IE
            return (nativeEl as any).currentStyle[cssProp];

        if (window.getComputedStyle)
            return (window.getComputedStyle(nativeEl) as any)[cssProp];

        // finally try and get inline style
        return (nativeEl.style as any)[cssProp];
    }

    public isStaticPositioned(nativeEl: HTMLElement): boolean {
        return (this.getStyle(nativeEl, 'position') || 'static') === 'static';
    }

    public parentOffsetEl(nativeEl: HTMLElement): any {
        let offsetParent: any = nativeEl.offsetParent || window.document;
        while (offsetParent && offsetParent !== window.document && this.isStaticPositioned(offsetParent)) {
            offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || window.document;
    }

}