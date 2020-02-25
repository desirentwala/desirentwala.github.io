import { NewsService } from './services/news.service';
import { NewsRoutingModule } from './news-announcement.routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsAnnouncementComponent } from './news-announcement.component';
import { NewsCreationComponent } from './news-creation/news-creation.component';
import { FormGroup, FormBuilder, FormControl,ReactiveFormsModule,FormsModule } from '@angular/forms';
import { NewsManagementComponent } from './news-management/news-management.component';
import { NewsDisplayComponent } from './news-display/news-display.component';
import { CoreModule } from '../../core/index';
import { NewsFormComponent } from './news-form/news-form.component';
import { NewsViewComponent } from './news-view/news-view.component';
import { NewsEditComponent } from './news-edit/news-edit.component';
import { CKEditorModule } from '@adapters/packageAdapter';

@NgModule({
  imports: [
    CommonModule,
    NewsRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule
  ],
  declarations: [NewsAnnouncementComponent, NewsCreationComponent, NewsManagementComponent, NewsDisplayComponent, NewsFormComponent, NewsViewComponent, NewsEditComponent],
  entryComponents: [NewsManagementComponent, NewsCreationComponent, NewsViewComponent, NewsEditComponent, NewsDisplayComponent]
})
export class NewsAnnouncementModule { }
