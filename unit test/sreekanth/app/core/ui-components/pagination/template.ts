export const DEFAULT_TEMPLATE = `
    <pagination-template  #p="paginationApi"
                         [id]="id"
                         [maxSize]="maxSize"
                         (pageChange)="pageChange.emit($event)">
  <div class="col-md-12 col-lg-9 col-12 col-md-push-3 p0 text-center">                       \
    <ul class="ng2-pagination pagination col-centered" 
        role="navigation" 
        [attr.aria-label]="screenReaderPaginationLabel" 
        *ngIf="!(autoHide && p.pages.length <= 1)">

        <li [class.disabled]="p.isFirstPage()" *ngIf="directionLinks"> 
            <button class="previouspage"  (click)="p.previous()" tabindex="0" [disabled]="p.isFirstPage()">
                 <img alt="" *ngIf="p.isFirstPage()" src="assets/img/previous-activedisabled.svg" class="paddingright5"/> <img alt="" *ngIf="!p.isFirstPage()" src="assets/img/previous-active.svg" class="paddingright5"/><span class="colordefault d-none">Back</span>
            </button>
        </li>
        <li [class.current]="p.getCurrent() === page.value" [class.removedot]="page.label == '...'" *ngFor="let page of p.pages">
            <button (click)="p.setCurrent(page.value)" *ngIf="p.getCurrent() !== page.value" tabindex="0">
                <span class="show-for-sr">Page</span>
                <span>{{ page.label }}</span>
            </button>
            <div *ngIf="p.getCurrent() === page.value">
                <span class="show-for-sr">You're on page</span>
                <span>{{ page.label }}</span> 
            </div>
        </li>
        <li [class.disabled]="p.isLastPage()" *ngIf="directionLinks" >
            <button class="nextpage" (click)="p.next()" aria-label="Next page" tabindex="0" [disabled]="p.isLastPage()">
                <span class="colordefault d-none">Next</span> <img alt="" *ngIf="!p.isLastPage()" src="assets/img/next-inactive.svg" class="paddingleft10"><img alt="" *ngIf="p.isLastPage()" src="assets/img/next-inactivedisabled.svg" class="paddingleft10">
            </button>  
        </li>
    </ul>
    </div>
    <div class="col-md-6 col-lg-3 paddingright0 displayinlinetable col-md-pull-9 col-6 p0">

    </div>
    </pagination-template>
    `;

export const DEFAULT_STYLES = `
.colordefault{color:#6785c1;}
  .ng2-pagination::before, .ng2-pagination::after {
    content: ' ';
    display: table; }
  .ng2-pagination::after {
    clear: both; }
  .ng2-pagination li {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    font-size: 15px;
    margin-right: 0.0625rem;
    border-radius: 50%; }
  .ng2-pagination li {
    display: inline-block; }
  .ng2-pagination a,
  .ng2-pagination button {
    color: #6785c1; 
    display: block;
    border-radius: 100px; }
    .ng2-pagination a:hover,
    .ng2-pagination button:hover {
      background: #fff; }
  .ng2-pagination .current {
    color: #fff;
    background-color: #6785c1;
    border-color: #6785c1;
    cursor: pointer; padding:8px;border-radius:50%;height:36px;width:36px;line-height:1.2;position:relative;text-align: center;
		vertical-align: middle;margin: 0px 10px 30px 10px;border:1px solid #6785c1;}
  .ng2-pagination .disabled {
    color: #707070;
    cursor: not-allowed;pointer-events:none; } 
    .ng2-pagination .disabled:hover {
      background: transparent; }
  .ng2-pagination .ellipsis::after {
    content: '…';
    padding: 0.1875rem 0.625rem;
    color: #0a0a0a; }
.ng2-pagination .show-for-sr {
  position: absolute !important;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0); }
  .removedot button{
    border: none !important;
    background-color: transparent !important;
    pointer-events: none;
    margin: 0px 0px 0 0px !important;
    padding-top: 18px !important;}
    .disabled .nextpage{color:#707070 important;}
    .disabled .colordefault{color:#707070 !important;}
    .nextpage:disabled{background-color: transparent !important;}
     .previouspage:disabled{background-color: transparent !important;}
    .displayinlinetable{display:inline-table;}`;
