import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfigService } from '../../services/config.service';
import { SharedModule } from '../common/shared';
import { ThemeService } from './theme.services';

/**
 * This class represents the changing a theme for ncp app.
 */
@Component({

  selector: 'ncp-theme',
  templateUrl: './theme.template.html'
})
export class ThemeComponent implements OnInit {
  themeList: any;
  rtlThemeFileName: any = '';
  isThemeDisplay: boolean = false;
  constructor(public config: ConfigService, public themeService: ThemeService) {
    this.themeList = this.themeService.themeList;
    this.config.loggerSub.subscribe(data => {
      if (data === 'configLoaded') {
        this.isThemeDisplay = this.config.get('themeDisplay');
      }
    });
  }

  ngOnInit() {
    this.themeService.ncpThemeServicesSub.subscribe((data) => {
      this.config.setLoadingSub('yes');
      let rtlThemeName = this.themeService.getLocalThemeName(data);
      if (rtlThemeName) {
        let defaultThemeName = this.themeService.getThemeName('defaultStyle');
        this.config.currentThemeName = defaultThemeName;
        this.config.isRTL = false;
        this.config.changeThemeName(rtlThemeName);
        this.rtlThemeFileName = rtlThemeName;
      }
      this.config.setLoadingSub('no');
    });
  }
  changeTheme(themeName) {
    let themeFullName = this.themeService.getThemeName(themeName);
    this.config.changeThemeName(themeFullName);
    this.config.currentThemeName = themeFullName;
  }
  removeTheme() {
    this.config.removeThemeName(this.config.currentThemeName);
    this.config.currentThemeName = 'default';
  }
}

@NgModule({
  declarations: [ThemeComponent],
  imports: [CommonModule, FormsModule, SharedModule],
  exports: [ThemeComponent, SharedModule],
  providers: [ThemeService]
})
export class ThemeModule { }

