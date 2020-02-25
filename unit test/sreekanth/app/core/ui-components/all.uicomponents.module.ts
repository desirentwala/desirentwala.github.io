import { ErrorHandlerModule } from './errorHandler/errorHandler.component';
import { NgModule } from '@angular/core';
import { SliderModule } from './slider/slider.component';
import { AccordionModule } from './accordion/accordion.module';
import { AddressLookUpModule } from './address-lookup/addressLookup.component';
import { UiAmountModule } from './amount/index';
import { UiButtonModule } from './button/index';
import { UiButtonRadioModule } from './buttonradio/index';
import { UiCheckboxModule } from './checkbox/index';
import { CheckboxarrayModule } from './checkboxarray/index';
import { CollapseModule } from './collapse/collapse.module';
import { NCPUiContactNumberComponentModule } from './contact-number/index';
import { UiContactNumberComponentModule } from './contact-number/index';
import { UiCounterModule } from './counter/counter.component';
import { UiDateofBirthModule } from './dateofbirth/index';
import { ClickOutSideModule } from './directives/clickOutside.directive';
import { UiDropdownModule } from './dropdown/index';
import { ErrorModule } from './error/error.component';
import { InputSwitchModule } from './inputswitch/inputswitch';
import { ItemBlocksModule } from './itemBlocks/itemBlock.component';
import { JoinModule } from './join/join.component';
import { LabelModule } from './label/label.component';
import { ListViewModule } from './listView/index';
import { UiManufacturingAgeModule } from './manufacturing-age/index';
import { UiMiscModule } from './misc-element/misc.component';
import { ModalModule } from './modal/index';
import { NcpCarouselModule } from './ncp-carousel/ncp.carousel';
import { NcpDatePickerModule } from './ncp-date-picker/ncp-date-picker.module';
import { UiWizardModule } from './ng2-wizard/index';
import { UiPlantableModule } from './plantable/index';
import { UiRadioModule } from './radio/index';
import { UiRowModule } from './row/row.component';
import { SelectButtonModule } from './selectbutton/selectbutton';
import { UiSelectdropdownModule } from './selectdropdown/selectdropdown.component';
import { SubHeadingModule } from './sub-heading/sub.heading.component';
import { SummaryTableModule } from './summary-table/index';
import { TabErrorModule } from './tab-error-msg/tab.error.msg';
import { UiTableFilterModule } from './table-filter/index';
import { UiTableSimpleModule } from './table-simple/index';
import { UiTextAreaModule } from './textarea/index';
import { UiTextBoxModule } from './textbox/index';
import { UiTimepickerModule } from './time-picker/index';
import { UiTimelineModule } from './timeline/timeline.component';
import { TooltipModule } from './tooltip/index';
import { UiPaymentGatewayModule } from './payment/payment.component';
import { UiTabModule } from './tab/tabset';
import { UiCoverageDisplayModule } from './coverage-display/index';
import { UiNCPCalendarModule } from './ncp-calendar/index';
import { UiNCPCountDownModule } from './countdown/countdown.component';
import { UiNCPDeclarationsModule } from './ncp-declarations/ncp-declarations.component';
import { UiAutoRenewalModule } from './auto-renewal/auto-renewal.component';
import { UIPasswordStrengthBarModule } from './PasswordStrengthBar/PasswordStrengthBarComponent ';
import { CoverTableModule } from './cover-table/cover-table.component';
import { NCPUiMultiCurrencyComponentModule } from './multi-currency/multicurrency.component';
import { UiStepNavigatorModule } from './step-navigator';
import { UiDatePickerDateOfBirthModule } from './datePickerDateOfBirth/datePickerDateOfBirth.component';
import { PICK_LIST_HELPER_SERVICES } from './utils/picklist.helper.service';
import { ValidationHandlerModule } from './validationHandler/validation.handler.component';
import { UiRangeSliderModule } from './rangeslider/range-slider.component';
import { Ng2PaginationModule } from './pagination/ng2-pagination';


const UI_MODULES = [
  UiTextBoxModule,
  UiRadioModule,
  UiCheckboxModule,
  UiAmountModule,
  UiButtonRadioModule,
  UiTableSimpleModule,
  UiTableFilterModule,
  UiPlantableModule,
  UiWizardModule,
  CollapseModule,
  AccordionModule,
  UiButtonModule,
  ModalModule,
  NcpDatePickerModule,
  SelectButtonModule,
  InputSwitchModule,
  TooltipModule,
  JoinModule,
  UiDropdownModule,
  ErrorModule,
  NcpCarouselModule,
  UiTextAreaModule,
  CheckboxarrayModule,
  UiContactNumberComponentModule,
  NCPUiContactNumberComponentModule,
  UiDateofBirthModule,
  SubHeadingModule,
  LabelModule,
  UiSelectdropdownModule,
  TabErrorModule,
  UiRowModule,
  UiMiscModule,
  UiTimepickerModule,
  UiManufacturingAgeModule,
  UiTimelineModule,
  ItemBlocksModule,
  AddressLookUpModule,
  SummaryTableModule,
  CoverTableModule,
  ListViewModule,
  SliderModule,
  AddressLookUpModule,
  UiCounterModule,
  ClickOutSideModule,
  UiPaymentGatewayModule,
  UiTabModule,
  UiCoverageDisplayModule,
  UiNCPCalendarModule,
  UiNCPCountDownModule,
  UiNCPDeclarationsModule,
  UiAutoRenewalModule,
  ErrorHandlerModule,
  UIPasswordStrengthBarModule,
  UiStepNavigatorModule,
  NCPUiMultiCurrencyComponentModule,
  UiDatePickerDateOfBirthModule,
  ValidationHandlerModule,
  UiRangeSliderModule,
  Ng2PaginationModule
];


@NgModule({
  imports: UI_MODULES,
  exports: UI_MODULES,
  providers: [ PICK_LIST_HELPER_SERVICES ]
})
export class AllUiComponents { }
