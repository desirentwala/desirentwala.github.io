import { Component, Output,Input, ElementRef, EventEmitter, HostBinding, NgModule, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import 'jquery';
import 'owl.carousel';
import { ConfigService } from '../../services/config.service';

declare var jQuery: any;

@Component({

    selector: 'ncp-carousel',
    template: `<ng-content></ng-content>`
})
export class NcpCarousel implements AfterViewInit, OnDestroy {
    @HostBinding('class') defaultClass = 'owl-carousel';
    @Output() getOwl = new EventEmitter();
    @Output() onPrevious = new EventEmitter();
    @Output() onNext = new EventEmitter();
    @Input() numberOfColumns:any;
    @Input() dotsEach:any;
    @Input() slideBy:any;
    $owlElement: any;
    currentIndex: number = 0;
    constructor(public el: ElementRef, public configService: ConfigService) { }

    ngAfterViewInit() {
        this.$owlElement = jQuery(this.el.nativeElement).owlCarousel({
            loop: false,
            margin: 20,
            rtl:this.configService.isRTL,
            dots: true,
            nav: false,
            slideBy:this.slideBy,
            dotsEach: this.dotsEach,
            responsive: {
                0: {
                    items: 1,

                },
                768: {
                    items: this.numberOfColumns,
                }
            }
        });
        this.getOwl.emit(this.$owlElement);
        let carouselObj = this;
        this.$owlElement.on('changed.owl.carousel', function (event) {
            if (carouselObj.currentIndex < event.item.index) carouselObj.onNext.emit(event);
            else if (carouselObj.currentIndex > event.item.index) carouselObj.onPrevious.emit(event);
            carouselObj.currentIndex = event.item.index;
        });
    }

    ngOnDestroy() {
        this.$owlElement = null;
    }
}




@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [NcpCarousel],
    exports: [NcpCarousel]
})
export class NcpCarouselModule { }
