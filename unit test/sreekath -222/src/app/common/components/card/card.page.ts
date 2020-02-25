import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit, OnChanges {
  @Input() pet;
  @Input() species;
  @Output() public emitSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

     /**
      * Emitting selected pet details
      * @param pet selected pet
      */
     onSelect(pet): void {
      this.emitSelected.emit(pet);
    }

}
