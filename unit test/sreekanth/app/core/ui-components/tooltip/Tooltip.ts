
import {
    AfterViewInit,
    ChangeDetectorRef,
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    HostBinding,
    HostListener,
    Input,
    ViewContainerRef,
    OnInit,
} from '@angular/core';

import { TooltipContent } from './TooltipContent';
import { ConfigService } from '../../services/config.service';

@Directive({
    selector: '[tooltip]',
})

export class Tooltip implements AfterViewInit {


    public tooltip: ComponentRef<TooltipContent>;
    public visible: boolean = false;
    public isRTL: boolean = false;

    constructor(public viewContainerRef: ViewContainerRef,
        public resolver: ComponentFactoryResolver, public changeRef: ChangeDetectorRef, public configService: ConfigService) {
        this.tooltipPlacement = this.tooltipPlacement ? this.tooltipPlacement : 'right';
    }

    @Input('tooltip')
    content: string | TooltipContent;

    @Input()
    tooltipDisabled: boolean;

    @Input()
    tooltipAnimation: boolean = true;

    @Input()
    tooltipPlacement: 'top' | 'bottom' | 'left' | 'right' = 'right';

    @Input()
    tooltipClick: boolean = false;

    @Input()
    tooltipHide: boolean = false;
    touchEvent: boolean = false;
    @HostBinding('class.tooltipMobile')

    @HostListener('touchstart')
    _open() {
        this.touchEvent = true;
        if (this.tooltipDisabled) {
            return;
        }
        this.openTooltip();
    }
    @HostListener('click')
    open() {
        if (!this.touchEvent) {
            if (this.tooltipDisabled) {
                return;
            }
            this.openTooltip();
        }
    }
    @HostListener('mouseenter')
    show() {
        if (!this.touchEvent) {
            if (!this.tooltipClick) {
                if (this.tooltipDisabled) {
                    return;
                }
                this.openTooltip();
            }
        }
    }
    @HostListener('mouseleave')
    hide() {
        if (!this.touchEvent) {
            if (!this.tooltipClick) {
                if (this.content instanceof TooltipContent) {
                    (this.content as TooltipContent).hide();
                }
            }
        }
    }
    ngAfterViewInit() {
        this.isRTL = this.configService.isRTL;
        if (this.isRTL) {
            if (this.tooltipPlacement) {
                if (this.tooltipPlacement === 'right') {
                    this.tooltipPlacement = 'left';
                } else if (this.tooltipPlacement === 'left') {
                    this.tooltipPlacement = 'right';
                }
            }
        }
        setTimeout(() => {
            if (this.tooltipHide) {
                if (this.tooltip) {
                    this.tooltip.destroy();
                }
                if (this.content instanceof TooltipContent) {
                    (this.content as TooltipContent).hide();
                }
            }
        });
    }
    openTooltip() {
            const tooltip = this.content as TooltipContent;
            if (tooltip.top === -1500) {
                tooltip.hostElement = this.viewContainerRef.element.nativeElement;
                tooltip.animation = this.tooltipAnimation;
                if (window.innerWidth < 768) {
                    tooltip.placement = 'left';
                } else {
                    tooltip.placement = this.tooltipPlacement;
                }
                tooltip.show();
            } else {
                tooltip.hostElement = this.viewContainerRef.element.nativeElement;
                tooltip.hide();
            }
    }
}



