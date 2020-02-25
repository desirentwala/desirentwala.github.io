import { ConfigService } from '../../services/config.service';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * This class represents the navigation bar component.
 */
@Component({

  selector: 'ncp-loader',
  templateUrl: './loader.html'
})
export class Loader implements OnInit {
  @Input() loading: any;
  @Input() loaderType: any;
  public useCSS: boolean = false;
  @Input() public subscribe: boolean = false;
  constructor(public config: ConfigService) {
    //this.loading='yes';
  }

  ngOnInit() {
    this.config.loadingSub.subscribe((data) => {
      if(!this.subscribe){
        this.loading = data;
      }
    });
    //this.useCSS = this.config.project !== '';
  }

}

@NgModule({
  declarations: [Loader],
  imports: [CommonModule, FormsModule],
  exports: [Loader]
})
export class LoaderModule { }

