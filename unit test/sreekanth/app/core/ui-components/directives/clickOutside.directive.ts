import { CommonModule } from '@angular/common';
import {
    AfterViewChecked,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    NgModule,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
} from '@angular/core';

@Directive({ selector: '[clickOutside]' })
export class ClickOutsideDirective implements AfterViewChecked, OnChanges, OnDestroy {
    @Input() attachOutsideOnClick: boolean = false;
    @Input() exclude: string = '';
    @Input() excludeBeforeClick: boolean = false;
    @Input() clickOutsideEvents: string = '';
    @Input() active: boolean = true;
    @Output() clickOutside: EventEmitter<Event> = new EventEmitter<Event>();

    private _nodesExcluded: Array<any> = [];
    private _events: Array<string> = ['click', 'touchstart'];

    private _isBrowser: boolean;

    constructor(private _el: ElementRef) {
        this._isBrowser = new Function('try{return this===window;}catch(e){return false;}')();

        this._initOnClickBody = this._initOnClickBody.bind(this);
        this._onClickBody = this._onClickBody.bind(this);
    }

    ngAfterViewChecked() {
        if (!this._isBrowser) { return; }

        this._init();
    }

    ngOnDestroy() {
        if (!this._isBrowser) { return; }

        if (this.attachOutsideOnClick) {
            this._events.forEach(e => this._el.nativeElement.removeEventListener(e, this._initOnClickBody));
        }

        this._events.forEach(e => document.body.removeEventListener(e, this._onClickBody));
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this._isBrowser) { return; }

        if (changes['attachOutsideOnClick'] || changes['exclude']) {
            this._init();
        }
    }

    private _init() {
        if (this.active) {
            if (this.clickOutsideEvents !== '') {
                this._events = this.clickOutsideEvents.split(' ');
            }

            this._excludeCheck();

            if (this.attachOutsideOnClick) {
                this._events.forEach(e => this._el.nativeElement.addEventListener(e, this._initOnClickBody));
            } else {
                this._initOnClickBody();
            }
        }

    }
    private _initOnClickBody() {
        if (this.active)
            this._events.forEach(e => document.body.addEventListener(e, this._onClickBody));
    }

    private _excludeCheck() {
        if (this.exclude) {
            try {
                const nodes = Array.from(document.querySelectorAll(this.exclude)) as Array<HTMLElement>;
                if (nodes) {
                    this._nodesExcluded = nodes;
                }
            } catch (err) {
                console.error('[ng-click-outside] Check your exclude selector syntax.', err);
            }
        }
    }

    private _onClickBody(_event: Event) {
        if (this.active) {
            if (this.excludeBeforeClick) {
                this._excludeCheck();
            }
            let event = _event || window.event;
            let target = event.srcElement || event.target;
            if (!this._el.nativeElement.contains(target) && !this._shouldExclude(target)) {
                this.clickOutside.emit(event);
                if (this.attachOutsideOnClick) {
                    this._events.forEach(e => document.body.removeEventListener(e, this._onClickBody));
                }
            }
        }
    }

    private _shouldExclude(target): boolean {
        if (this._nodesExcluded && this._nodesExcluded.indexOf(target) > -1) {
            return true;
        }

        return false;
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [ClickOutsideDirective],
    declarations: [ClickOutsideDirective]
})
export class ClickOutSideModule { }

